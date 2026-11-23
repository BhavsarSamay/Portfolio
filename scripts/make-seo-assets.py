"""Generates the share image and icons used for search results and link previews.

    python scripts/make-seo-assets.py

Writes into public/:
  og-image.jpg            1200x630 preview for Google, LinkedIn, WhatsApp, X, Slack
  favicon.ico             16/32/48 px, shown by browsers and in Google results
  favicon-48.png          48 px PNG favicon (Google asks for a multiple of 48)
  apple-touch-icon.png    180 px, iOS home screen
  icon-192.png, icon-512.png   web app manifest icons
Needs Pillow. Uses Windows system fonts (Segoe UI, Georgia); edit FONTS for other systems.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
PORTRAIT = PUB / "assets" / "samay-portrait.jpg"
FONTS = Path("C:/Windows/Fonts")

INK = (11, 11, 13)
CREAM = (236, 231, 220)
GOLD = (226, 197, 140)
MUTE = (139, 135, 127)


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


def og_image():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), INK)
    # Portrait on the right, faded into the black on its left edge.
    p = Image.open(PORTRAIT).convert("RGB")
    ph = H
    pw = round(p.width * ph / p.height)
    p = p.resize((pw, ph), Image.LANCZOS)
    mask = Image.new("L", (pw, ph), 255)
    md = ImageDraw.Draw(mask)
    fade = int(pw * 0.45)
    for x in range(fade):
        md.line([(x, 0), (x, ph)], fill=int(255 * (x / fade) ** 1.6))
    img.paste(p, (W - pw + 40, 0), mask)

    d = ImageDraw.Draw(img)
    x = 72
    d.text((x, 92), "SOFTWARE ENGINEER  ·  AHMEDABAD, INDIA", font=font("segoeuisl.ttf", 22), fill=GOLD)
    d.text((x, 150), "Samay", font=font("segoeuil.ttf", 112), fill=CREAM)
    d.text((x, 262), "Bhavsar", font=font("georgiai.ttf", 112), fill=GOLD)
    d.line([(x, 418), (x + 420, 418)], fill=(60, 56, 50), width=2)
    d.text((x, 440), "Full-stack developer building AI agents,", font=font("segoeuisl.ttf", 30), fill=CREAM)
    d.text((x, 480), "web platforms and the systems behind them.", font=font("segoeuisl.ttf", 30), fill=CREAM)
    d.text((x, 552), "samaybhavsar.in", font=font("segoeui.ttf", 24), fill=MUTE)
    d.rectangle([0, H - 6, W, H], fill=GOLD)
    img.save(PUB / "og-image.jpg", quality=88, optimize=True, progressive=True)


def icon(size):
    """Dark rounded tile with a gold italic monogram, drawn at 4x and downsampled for clean edges."""
    S = size * 4
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=INK)
    d.ellipse([S * 0.13, S * 0.13, S * 0.87, S * 0.87], outline=GOLD, width=max(2, int(S * 0.035)))
    f = font("georgiai.ttf", int(S * 0.36))
    d.text((S / 2, S / 2 + S * 0.01), "SB", font=f, fill=GOLD, anchor="mm")
    return im.resize((size, size), Image.LANCZOS)


def main():
    og_image()
    icon(48).save(PUB / "favicon-48.png")
    icon(180).convert("RGB").save(PUB / "apple-touch-icon.png")
    icon(192).save(PUB / "icon-192.png")
    icon(512).save(PUB / "icon-512.png")
    icon(256).save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    for f in ("og-image.jpg", "favicon.ico", "favicon-48.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"):
        print(f"{f:22s} {(PUB / f).stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
