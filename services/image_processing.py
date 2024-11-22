import aiofiles
from PIL import Image
from .segmentation import segment_clothing
from ..config import settings
import aiohttp
from pathlib import Path
import zipfile
import io


async def compress_image(img, max_size=settings.MAX_IMAGE_SIZE):
    if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
        img.thumbnail(max_size, Image.LANCZOS)
    return img


async def process_image(image_path, filename):
    async with aiofiles.open(image_path, mode='rb') as f:
        content = await f.read()

    img = Image.open(io.BytesIO(content))
    img = img.convert("RGBA")
    img = await compress_image(img)
    processed_img = segment_clothing(img)

    output_path = Path(settings.PROCESSED_DIR) / f"processed_{filename}"
    processed_img.save(output_path, format="PNG")
    return output_path


async def process_image_url(image_url):
    async with aiohttp.ClientSession() as session:
        async with session.get(image_url) as response:
            content = await response.read()

    img = Image.open(io.BytesIO(content))
    img = await compress_image(img)
    processed_img = segment_clothing(img)

    output_path = Path(settings.PROCESSED_DIR) / "processed_url_image.png"
    processed_img.save(output_path, format="PNG")
    return output_path


async def process_image_batch(files, batch_id):
    batch_folder = Path(settings.BATCH_DIR) / str(batch_id)
    batch_folder.mkdir(parents=True, exist_ok=True)

    for file in files:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        img = await compress_image(img)
        processed_img = segment_clothing(img)

        output_path = batch_folder / f"processed_{file.filename}"
        processed_img.save(output_path, format="PNG")

    zip_path = Path(settings.PROCESSED_DIR) / \
        f"processed_images_{batch_id}.zip"
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for file_path in batch_folder.glob('*'):
            zipf.write(file_path, arcname=file_path.name)

    return zip_path
