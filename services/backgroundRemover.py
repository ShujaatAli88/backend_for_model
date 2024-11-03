import io
import sys
from PIL import Image
from rembg import remove


def remove_background(input_path, output_path):
    try:
        # Read input image
        with open(input_path, 'rb') as input_file:
            input_bytes = input_file.read()

        # Remove background
        output_bytes = remove(input_bytes)

        # Save the result
        img = Image.open(io.BytesIO(output_bytes)).convert('RGBA')
        img.save(output_path, 'PNG')

        return True
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        return False


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python remove_bg.py <input_path> <output_path>", file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    success = remove_background(input_path, output_path)
    sys.exit(0 if success else 1)
