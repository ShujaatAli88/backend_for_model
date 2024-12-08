import os
import sys
import cv2
import numpy as np
import torch
from flask import Flask, request, jsonify
import urllib.request
import base64
from io import BytesIO
import uuid
import supervision as sv
from segment_anything import sam_model_registry, SamPredictor
from typing import List
import subprocess

# Set up the Flask application
app = Flask(__name__)

# # Set HOME directory
# HOME = os.getcwd()
# print("HOME:", HOME)

# # Initialize the device
# DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
# print(f"Using device: {DEVICE}")

# # Paths and models setup (similar to your script)
# GROUNDING_DINO_CONFIG_PATH = os.path.join(
#     HOME, "GroundingDINO", "groundingdino", "config", "GroundingDINO_SwinT_OGC.py")
# GROUNDING_DINO_CHECKPOINT_PATH = os.path.join(
#     HOME, "weights", "groundingdino_swint_ogc.pth")
# SAM_CHECKPOINT_PATH = os.path.join(HOME, "weights", "sam_vit_h_4b8939.pth")

# # Load SAM Model
# sam = sam_model_registry["vit_h"](
#     checkpoint=SAM_CHECKPOINT_PATH).to(device=DEVICE)
# sam_predictor = SamPredictor(sam)
# print("Sam Model Loaded Successfully.")


def segment_and_getmasks(sam_predictor: SamPredictor, image: np.ndarray, xyxy: np.ndarray) -> np.ndarray:
    sam_predictor.set_image(image)
    result_masks = []
    for box in xyxy:
        masks, scores, logits = sam_predictor.predict(
            box=box,
            multimask_output=True
        )
        index = np.argmax(scores)
        result_masks.append(masks[index])
    return np.array(result_masks)


def is_package_installed(package_name, version):
    try:
        import pkg_resources
        pkg_resources.require(f"{package_name}=={version}")
        return True
    except (ImportError, pkg_resources.DistributionNotFound, pkg_resources.VersionConflict):
        return False


def initialize():
    HOME = os.getcwd()
    print("HOME:", HOME)

    # Define repository details
    grounding_dino_repo = "GroundingDINO"
    grounding_dino_url = "https://github.com/IDEA-Research/GroundingDINO.git"
    segment_anything_repo = "segment-anything"
    segment_anything_url = "git+https://github.com/facebookresearch/segment-anything.git"

# Clone GroundingDINO repository if not already cloned
    os.chdir(HOME)
    if not os.path.exists(grounding_dino_repo):
        # Set Git buffer size
        os.system("git config --global http.postBuffer 157286400")
        os.system(f"git clone {grounding_dino_url}")
    else:
        print(f"{grounding_dino_repo} repository already cloned.")

# Install GroundingDINO requirements
    grounding_dino_path = os.path.join(HOME, grounding_dino_repo)
    if os.path.exists(grounding_dino_path):
        os.chdir(grounding_dino_path)
        os.system("git checkout -q 57535c5a79791cb76e36fdb64975271354f10251")
        os.system(f"{sys.executable} -m pip install -e .")

# Install Segment Anything if not already installed
    os.chdir(HOME)
    # Just a logical check; replace if needed
    if not os.path.exists(segment_anything_repo):
        os.system(f"{sys.executable} -m pip install {segment_anything_url}")
    else:
        print(f"{segment_anything_repo} already installed or cloned."
              )
    HOME = os.getcwd()
    print("HOME Directory:", HOME)

# Ensure supervision is installed at the required version
    required_supervision_version = "0.6.0"
    if not is_package_installed("supervision", required_supervision_version):
        print(f"Installing supervision=={required_supervision_version}...")
        subprocess.run(["pip", "uninstall", "-y", "supervision"], check=True)
        subprocess.run(["pip", "install", f"supervision=={
            required_supervision_version}"], check=True)
    else:
        print(f"supervision=={
              required_supervision_version} is already installed.")

    # Verify supervision version
    print("Supervision version:", sv.__version__)

    # Paths
    GROUNDING_DINO_CONFIG_PATH = os.path.normpath(
        os.path.join(
            HOME, "GroundingDINO/groundingdino/config/GroundingDINO_SwinT_OGC.py")
    )
    print("Expected Config Path:", GROUNDING_DINO_CONFIG_PATH)

    # Debugging: Check files in the directory
    config_dir = os.path.normpath(os.path.join(
        HOME, "GroundingDINO/groundingdino/config"))
    if os.path.isdir(config_dir):
        print("Files in Config Directory:", os.listdir(config_dir))
    else:
        print("Config directory does not exist:", config_dir)

    # Check if file exists
    file_exists = os.path.isfile(GROUNDING_DINO_CONFIG_PATH)
    print(GROUNDING_DINO_CONFIG_PATH, "; exist:", file_exists)

    # Weights directory
    weights_dir = os.path.join(HOME, "weights")
    os.makedirs(weights_dir, exist_ok=True)

    # Grounding DINO Weights
    dino_url = "https://github.com/IDEA-Research/GroundingDINO/releases/download/v0.1.0-alpha/groundingdino_swint_ogc.pth"
    dino_path = os.path.join(weights_dir, "groundingdino_swint_ogc.pth")
    if not os.path.isfile(dino_path):
        print(f"Downloading Grounding DINO weights to {dino_path}...")
        urllib.request.urlretrieve(dino_url, dino_path)
    else:
        print(f"Grounding DINO weights already exist at {dino_path}.")

    # SAM Weights
    sam_url = "https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth"
    sam_path = os.path.join(weights_dir, "sam_vit_h_4b8939.pth")
    if not os.path.isfile(sam_path):
        print(f"Downloading SAM weights to {sam_path}...")
        urllib.request.urlretrieve(sam_url, sam_path)
    else:
        print(f"SAM weights already exist at {sam_path}.")

    # Check if GPU is available and set the device
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {DEVICE}")

    # Set HOME to the current working directory
    HOME = os.getcwd()
    print(f"HOME is set to: {HOME}")

    # Define paths
    GROUNDING_DINO_CONFIG_PATH = os.path.join(
        HOME, "GroundingDINO", "groundingdino", "config", "GroundingDINO_SwinT_OGC.py")
    GROUNDING_DINO_CHECKPOINT_PATH = os.path.join(
        HOME, "weights", "groundingdino_swint_ogc.pth")

    # Validate paths
    if not os.path.exists(GROUNDING_DINO_CONFIG_PATH):
        raise FileNotFoundError(f"Configuration file not found: {
                                GROUNDING_DINO_CONFIG_PATH}")
    if not os.path.exists(GROUNDING_DINO_CHECKPOINT_PATH):
        raise FileNotFoundError(f"Checkpoint file not found: {
                                GROUNDING_DINO_CHECKPOINT_PATH}")

    # Add GroundingDINO to Python path
    GROUNDING_DINO_PATH = os.path.join(HOME, "GroundingDINO")
    sys.path.append(GROUNDING_DINO_PATH)

    # Import the model
    try:
        from GroundingDINO.groundingdino.util.inference import Model
    except ImportError as e:
        raise ImportError(
            "Failed to import Model from groundingdino.util.inference.") from e

    # Load model
    try:
        grounding_dino_model = Model(
            model_config_path=GROUNDING_DINO_CONFIG_PATH,
            model_checkpoint_path=GROUNDING_DINO_CHECKPOINT_PATH,
            device=DEVICE.type
        )
        print("Model loaded successfully!")
    except Exception as e:
        raise RuntimeError(
            "Failed to initialize the GroundingDINO model.") from e

    # Load SAM Model.

    SAM_CHECKPOINT_PATH = os.path.join(HOME, "weights", "sam_vit_h_4b8939.pth")
    if not os.path.exists(SAM_CHECKPOINT_PATH):
        raise FileNotFoundError(f"Checkpoint sam file not found: {
                                SAM_CHECKPOINT_PATH}")
    else:
        print(f"Sam Model Found at:{SAM_CHECKPOINT_PATH}")
    sam = sam_model_registry["vit_h"](
        checkpoint=SAM_CHECKPOINT_PATH).to(device=DEVICE)
    sam_predictor = SamPredictor(sam)


# Model for processing (keep it as per your original code)
class ImprovedMannequinRemover:
    def __init__(self):
        print("Model loaded successfully!")

    def ensure_directory_exists(self, folder_path):
        """Ensure that the directory exists, create if not."""
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

    def resize_image(self, image, target_size=512):
        """Resize image maintaining aspect ratio"""
        h, w = image.shape[:2]
        aspect = w / h

        if h > w:
            new_h = target_size
            new_w = int(target_size * aspect)
        else:
            new_w = target_size
            new_h = int(target_size / aspect)

        return cv2.resize(image, (new_w, new_h))

    def pad_image(self, image, target_size=512):
        h, w = image.shape[:2]
        top = (target_size - h) // 2
        bottom = target_size - h - top
        left = (target_size - w) // 2
        right = target_size - w - left

        return cv2.copyMakeBorder(image, top, bottom, left, right,
                                  cv2.BORDER_CONSTANT, value=[255, 255, 255])

    def create_refined_mask(self, image):
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)

        lower_white1 = np.array([0, 0, 200])
        upper_white1 = np.array([180, 30, 255])
        mask1 = cv2.inRange(hsv, lower_white1, upper_white1)

        lower_white2 = np.array([0, 0, 130])
        upper_white2 = np.array([180, 40, 255])
        mask2 = cv2.inRange(hsv, lower_white2, upper_white2)

        combined_mask = cv2.bitwise_or(mask1, mask2)

        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

        mask = cv2.GaussianBlur(mask, (5, 5), 0)
        _, mask = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)

        return mask

    def process_image(self, image):
        """Process the image, resize, create mask, and return results"""
        resized_image = self.resize_image(image)
        padded_image = self.pad_image(resized_image)

        # Create mask
        mask = self.create_refined_mask(padded_image)
        return padded_image, mask


# Endpoint to remove dummy from images
@app.route('/remove-dummy', methods=['POST'])
def remove_dummy():
    initialize()
    try:
        data = request.json  # Expecting a JSON body
        print("-----------------Data ---------------------- ", data)
        images_data = data.get('images', [])
        background_color = data.get('backgroundColor', 'white')

        remover = ImprovedMannequinRemover()

        # Initialize the results list
        results = []

        for image_data in images_data:
            image_base64 = image_data.get('base64')
            image_file_name = image_data.get('fileName', f"{uuid.uuid4()}.png")

            # Decode the base64 image data
            image_data_decoded = base64.b64decode(image_base64)
            image = cv2.imdecode(np.frombuffer(
                image_data_decoded, np.uint8), cv2.IMREAD_COLOR)

            if image is None:
                return jsonify({"error": f"Failed to decode image {image_file_name}"}), 400

            # Process the image (resize, create mask, etc.)
            processed_image, mask = remover.process_image(image)

            # Save processed image and mask
            output_filename = f"processed_{image_file_name}"
            mask_filename = f"mask_{image_file_name}"

            # Convert processed image back to base64
            _, img_buffer = cv2.imencode('.png', processed_image)
            img_base64 = base64.b64encode(img_buffer).decode('utf-8')

            # Convert mask back to base64
            _, mask_buffer = cv2.imencode('.png', mask)
            mask_base64 = base64.b64encode(mask_buffer).decode('utf-8')

            results.append({
                "fileName": output_filename,
                "processed_image": img_base64,
                "mask_image": mask_base64
            })

        return jsonify({"success": True, "images": results}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
