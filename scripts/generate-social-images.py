#!/usr/bin/env python3
"""Generate social cards using the site's IBM Plex Sans title typography.

Requires Pillow. Run: python3 scripts/generate-social-images.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_SIZE = 180
font = ImageFont.truetype(str(ROOT / 'public/ibm-plex-sans-regular.ttf'), FONT_SIZE)

for folder, label, letter_spacing in [
    (ROOT / 'app', 'ANGEL', -0.045),
    (ROOT / 'app/movies', 'MOVIES I LIKE', -0.04),
]:
    # Match each heading's font family, regular weight, and letter spacing.
    lettering = Image.new('RGB', (1200, 630), 'black')
    draw = ImageDraw.Draw(lettering)
    # Keep longer titles inside the same generous horizontal margins.
    text_font = font
    while text_font.getlength(label) + (len(label) - 1) * text_font.size * letter_spacing > 1000:
        text_font = ImageFont.truetype(str(ROOT / 'public/ibm-plex-sans-regular.ttf'), text_font.size - 1)
    for index, character in enumerate(label):
        x = text_font.getlength(label[:index]) + index * text_font.size * letter_spacing
        draw.text((x, 0), character, font=text_font, fill='white')
    text = lettering.crop(lettering.getbbox())
    image = Image.new('RGB', (1200, 630), 'black')
    image.paste(text, ((1200 - text.width) // 2, (630 - text.height) // 2))
    for kind in ['opengraph-image', 'twitter-image']:
        image.save(folder / f'{kind}.png', optimize=True)
        (folder / f'{kind}.alt.txt').write_text(f'{label} in white on a black background\n')
    print(f'{label}: IBM Plex Sans Regular, letter spacing {letter_spacing}em')
