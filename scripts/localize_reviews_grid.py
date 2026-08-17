"""Overlay FIL/RU copy onto the English review-grid PNG without changing frames or photos."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "global-reviews-grid.png"
FONTS = Path(r"C:\Windows\Fonts")

INK = (63, 63, 65)
GOLD = (233, 164, 18)
GOLD_TITLE = (232, 163, 16)
MUTED = (125, 125, 126)
META = (138, 138, 138)
BODY = (68, 68, 65)
SEAL = (230, 160, 20)
WHITE = (254, 254, 254)
HEADER_BG = (254, 254, 254)
PAGE_BG = (253, 252, 251)

SERIF = str(FONTS / "georgiab.ttf")
SANS = str(FONTS / "segoeui.ttf")
SANS_B = str(FONTS / "segoeuib.ttf")
SANS_SEAL = str(FONTS / "arialbd.ttf")

SEAL_CENTER = (1546, 79)
SEAL_R_OUTER = 70
SEAL_R_INNER = 42
SEAL_R_TEXT = 55.5
SEAL_R_ICON = 36

CARDS = [
    {"text_x": 76, "name_x": 196, "stars_y": 376, "name_cover": (180, 372, 536, 396), "cover": (68, 398, 536, 512)},
    {"text_x": 614, "name_x": 733, "stars_y": 375, "name_cover": (716, 371, 1072, 396), "cover": (604, 398, 1072, 512)},
    {"text_x": 1147, "name_x": 1267, "stars_y": 375, "name_cover": (1250, 371, 1604, 396), "cover": (1138, 398, 1604, 512)},
    {"text_x": 76, "name_x": 196, "stars_y": 724, "name_cover": (180, 720, 536, 744), "cover": (68, 746, 536, 868)},
    {"text_x": 612, "name_x": 735, "stars_y": 723, "name_cover": (718, 719, 1072, 743), "cover": (604, 746, 1072, 868)},
    {"text_x": 1147, "name_x": 1270, "stars_y": 723, "name_cover": (1253, 719, 1604, 743), "cover": (1138, 746, 1604, 868)},
]

DATES = ["2025.05.12", "2025.05.07", "2025.05.01", "2025.04.28", "2025.05.20", "2025.05.25"]
PRODUCT = "MOYOMOYO Soothing Care Serum"

COPY = {
    "fil": {
        "title": [("100% ", INK), ("Tunay na Review", GOLD_TITLE), (" mula sa mga Nanay (Orihinal na Litrato)", INK)],
        "subtitle": "Tunay na review ng mga nanay, may orihinal na litrato.",
        "seal_top": "CLINICAL TRIAL",
        "seal_bottom": "NATAPOS NA",
        "names": [
            "Nanay ni Emma",
            "Nanay ni Oliver",
            "Nanay ni Noah",
            "Nanay ni Liam",
            "Nanay ni Ava",
            "Nanay ni Mason",
        ],
        "reviews": [
            ("Lubhang gumanda ang tuyong paltos.", "Kalmado, malambot at hydrated na ang balat!"),
            ("Nawala na ang pantal sa paligid ng bibig", "at halos wala na ang pamumula!"),
            ("Humupa na ang mapupulang magaspang na paltos.", "Malusog at komportable na ang kanyang balat!"),
            ("Gumanda na ang baby acne at pamumula.", "Sobrang saya ko sa resulta!"),
            ("Halos wala na ang pulang butlig at tuyong paltos.", "Ang lambot at kinis na ng kanyang balat!"),
            ("Gumanda na ang tuyo at irritated na balat.", "Gentle ito at talagang epektibo!"),
        ],
        "out": ROOT / "public" / "global-reviews-grid-fil.png",
    },
    "ru": {
        "title": [("100% ", INK), ("Реальные отзывы", GOLD_TITLE), (" мам (Оригинальные фото)", INK)],
        "subtitle": "Настоящие отзывы мам с оригинальными фотографиями.",
        "seal_top": "КЛИН. ТЕСТ",
        "seal_bottom": "ЗАВЕРШЁН",
        "names": [
            "Мама Эммы",
            "Мама Оливера",
            "Мама Ноа",
            "Мама Лиама",
            "Мама Авы",
            "Мама Мейсона",
        ],
        "reviews": [
            ("Шелушение заметно прошло.", "Кожа спокойная, мягкая и увлажнённая!"),
            ("Сыпь вокруг рта прошла,", "краснота почти исчезла!"),
            ("Красные шершавые участки сильно успокоились.", "Кожа выглядит здоровой и комфортной!"),
            ("Прыщики и краснота заметно прошли.", "Я так рада результату!"),
            ("Красные бугорки и сухость почти прошли.", "Кожа такая мягкая и гладкая!"),
            ("Сухая раздражённая кожа сильно улучшилась.", "Средство мягкое и отлично работает!"),
        ],
        "out": ROOT / "public" / "global-reviews-grid-ru.png",
    },
}


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def fit_parts(path: str, parts: list[tuple[str, tuple[int, int, int]]], max_w: float, start: int, min_size: int = 24):
    size = start
    while size >= min_size:
        f = font(path, size)
        width = sum(f.getlength(text) for text, _ in parts)
        if width <= max_w:
            return f
        size -= 1
    return font(path, min_size)


def cover(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: tuple[int, int, int]) -> None:
    draw.rectangle(box, fill=fill)


def extract_icon(src: Image.Image) -> Image.Image:
    cx, cy = SEAL_CENTER
    r = SEAL_R_ICON
    box = (cx - r, cy - r, cx + r, cy + r)
    crop = src.crop(box).convert("RGBA")
    mask = Image.new("L", crop.size, 0)
    ImageDraw.Draw(mask).ellipse((1, 1, crop.size[0] - 2, crop.size[1] - 2), fill=255)
    crop.putalpha(mask)
    return crop


def paint_seal_disk(img: Image.Image, fill: tuple[int, int, int]) -> None:
    px = img.load()
    cx, cy = SEAL_CENTER
    r = SEAL_R_OUTER + 6
    w, h = img.size
    for y in range(max(0, cy - r), min(h, cy + r + 1)):
        for x in range(max(0, cx - r), min(w, cx + r + 1)):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                px[x, y] = fill


def draw_arc_text(
    base: Image.Image,
    text: str,
    radius: float,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    top: bool,
) -> None:
    cx, cy = SEAL_CENTER
    chars = list(text)
    widths = [fnt.getlength(ch) or fnt.getlength("A") * 0.35 for ch in chars]
    total = sum(widths) + max(0, len(chars) - 1) * 1.2
    span = total / radius
    if top:
        angle = -math.pi / 2 - span / 2
        direction = 1
    else:
        angle = math.pi / 2 + span / 2
        direction = -1

    for ch, width in zip(chars, widths):
        mid = angle + direction * ((width / 2) / radius)
        x = cx + radius * math.cos(mid)
        y = cy + radius * math.sin(mid)
        # Top letters stay upright on the arc; bottom stays page-readable like the English seal.
        rot = (math.degrees(mid) + 90) if top else (-math.degrees(mid) + 90)
        glyph = Image.new("RGBA", (int(width) + 18, fnt.size + 18), (0, 0, 0, 0))
        ImageDraw.Draw(glyph).text((9, 6), ch, font=fnt, fill=fill + (255,))
        glyph = glyph.rotate(rot, resample=Image.Resampling.BICUBIC, expand=True)
        base.alpha_composite(glyph, (int(x - glyph.size[0] / 2), int(y - glyph.size[1] / 2)))
        angle += direction * ((width + 1.2) / radius)


def draw_seal(img: Image.Image, icon: Image.Image, top: str, bottom: str) -> None:
    paint_seal_disk(img, PAGE_BG)
    overlay = img.convert("RGBA")
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = SEAL_CENTER
    draw.ellipse(
        (cx - SEAL_R_OUTER, cy - SEAL_R_OUTER, cx + SEAL_R_OUTER, cy + SEAL_R_OUTER),
        outline=SEAL + (255,),
        width=2,
    )
    draw.ellipse(
        (cx - SEAL_R_INNER, cy - SEAL_R_INNER, cx + SEAL_R_INNER, cy + SEAL_R_INNER),
        outline=SEAL + (255,),
        width=2,
    )
    overlay.alpha_composite(layer)
    seal_font = font(SANS_SEAL, 9)
    draw_arc_text(overlay, top, SEAL_R_TEXT, seal_font, SEAL, top=True)
    draw_arc_text(overlay, bottom, SEAL_R_TEXT, seal_font, SEAL, top=False)
    icon_box = (SEAL_CENTER[0] - SEAL_R_ICON, SEAL_CENTER[1] - SEAL_R_ICON)
    overlay.alpha_composite(icon, icon_box)
    img.paste(overlay.convert("RGB"))


def render_locale(src: Image.Image, icon: Image.Image, data: dict) -> Image.Image:
    img = src.copy()
    draw = ImageDraw.Draw(img)

    cover(draw, (46, 28, 1468, 90), HEADER_BG)
    cover(draw, (46, 108, 980, 144), HEADER_BG)
    for card in CARDS:
        cover(draw, card["name_cover"], WHITE)
        cover(draw, card["cover"], WHITE)

    title_font = fit_parts(SERIF, data["title"], 1288, 42, 26)
    x, y = 55, 78
    for text, color in data["title"]:
        draw.text((x, y), text, font=title_font, fill=color, anchor="ls")
        x += title_font.getlength(text)

    sub_font = font(SANS, 16)
    while sub_font.getlength(data["subtitle"]) > 900 and sub_font.size > 12:
        sub_font = font(SANS, sub_font.size - 1)
    draw.text((55, 130), data["subtitle"], font=sub_font, fill=MUTED, anchor="ls")

    draw_seal(img, icon, data["seal_top"], data["seal_bottom"])
    draw = ImageDraw.Draw(img)

    name_font = font(SANS, 13)
    product_font = font(SANS_B, 14)
    body_font = font(SANS, 14)
    for i, card in enumerate(CARDS):
        x = card["text_x"]
        stars_y = card["stars_y"]
        name_y = stars_y + 12
        product_y = stars_y + 40
        body_y = product_y + 32
        meta = f"{data['names'][i]}  |  {DATES[i]}"
        draw.text((card["name_x"], name_y), meta, font=name_font, fill=META, anchor="ls")
        draw.text((x, product_y), PRODUCT, font=product_font, fill=GOLD, anchor="ls")
        line1, line2 = data["reviews"][i]
        draw.text((x, body_y), line1, font=body_font, fill=BODY, anchor="ls")
        draw.text((x, body_y + 24), line2, font=body_font, fill=BODY, anchor="ls")

    return img


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    icon = extract_icon(src)
    for key, data in COPY.items():
        out = render_locale(src, icon, data)
        out.save(data["out"], "PNG", optimize=True)
        print(f"wrote {data['out'].name} {out.size}")


if __name__ == "__main__":
    main()
