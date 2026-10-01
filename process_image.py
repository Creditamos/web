import rembg
from PIL import Image
import sys

input_path = "/Users/gabrielcampos/Desktop/Creditamos/frontend/landing/public/images/logo-footer.jpeg"
output_path = "/Users/gabrielcampos/Desktop/Creditamos/frontend/landing/public/images/logo-footer.webp"

try:
    with open(input_path, 'rb') as i:
        input_data = i.read()
    
    # Remove background
    output_data = rembg.remove(input_data)
    
    # Save as webp
    # Using PIL to save as webp
    import io
    img = Image.open(io.BytesIO(output_data))
    img.save(output_path, "WEBP")
    print(f"Successfully processed and saved to {output_path}")
except Exception as e:
    print(f"Error: {e}")
