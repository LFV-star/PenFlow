from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import textwrap
import io
import random
import math

# Register all handwriting fonts
pdfmetrics.registerFont(TTFont("Caveat", "Caveat-Regular.ttf"))
pdfmetrics.registerFont(TTFont("PatrickHand", "PatrickHand-Regular.ttf"))
pdfmetrics.registerFont(TTFont("IndieFlower", "IndieFlower-Regular.ttf"))
pdfmetrics.registerFont(TTFont("ShadowsIntoLight", "ShadowsIntoLight-Regular.ttf"))

FONTS = {
    "caveat": "Caveat",
    "patrick_hand": "PatrickHand",
    "indie_flower": "IndieFlower",
    "shadows_into_light": "ShadowsIntoLight",
}

INK_COLORS = {
    "black": (0, 0, 0),
    "blue": (0.1, 0.2, 0.7),
    "pencil": (0.4, 0.4, 0.4),
}

PAGE_WIDTH = 595
PAGE_HEIGHT = 842
MARGIN_LEFT = 72
MARGIN_RIGHT = 72
MARGIN_TOP = 72
MARGIN_BOTTOM = 72


def draw_lined_paper(c):
    c.setStrokeColorRGB(0.7, 0.85, 1.0)
    c.setLineWidth(0.5)
    y = PAGE_HEIGHT - MARGIN_TOP
    while y > MARGIN_BOTTOM:
        c.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
        y -= 28


def draw_grid_paper(c):
    c.setStrokeColorRGB(0.75, 0.85, 1.0)
    c.setLineWidth(0.3)
    y = PAGE_HEIGHT - MARGIN_TOP
    while y > MARGIN_BOTTOM:
        c.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
        y -= 20
    x = MARGIN_LEFT
    while x < PAGE_WIDTH - MARGIN_RIGHT:
        c.line(x, PAGE_HEIGHT - MARGIN_TOP, x, MARGIN_BOTTOM)
        x += 20


def render_handwritten_pdf(
    text: str,
    font: str = "caveat",
    font_size: int = 16,
    ink_color: str = "black",
    paper_style: str = "blank",
    handwriting_style: dict = None,
) -> bytes:
    """
    Renders text as a handwritten-style PDF.
    If handwriting_style is provided, applies personal style characteristics.
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))

    # Apply handwriting style if provided
    if handwriting_style:
        font_size = handwriting_style.get("font_size", font_size)
        slant = handwriting_style.get("slant", 0.0)
        spacing_factor = handwriting_style.get("spacing_factor", 1.0)
        stroke_weight = handwriting_style.get("stroke_weight", "normal")

        # Map stroke weight to ink darkness
        if stroke_weight == "heavy":
            ink_color = "black"
        elif stroke_weight == "light":
            ink_color = "pencil"
    else:
        slant = 0.0
        spacing_factor = 1.0

    font_name = FONTS.get(font, "Caveat")
    r, g, b = INK_COLORS.get(ink_color, (0, 0, 0))
    line_height = font_size * 1.8 * spacing_factor

    def draw_page_background():
        if paper_style == "lined":
            draw_lined_paper(c)
        elif paper_style == "grid":
            draw_grid_paper(c)

    draw_page_background()
    c.setFont(font_name, font_size)
    c.setFillColorRGB(r, g, b)

    # Apply slant as a canvas transform
    slant_radians = math.radians(slant * 0.3)

    usable_width = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
    chars_per_line = int(usable_width / (font_size * 0.55 * spacing_factor))
    wrapped_lines = []

    for paragraph in text.split("\n"):
        if paragraph.strip() == "":
            wrapped_lines.append("")
        else:
            wrapped = textwrap.wrap(paragraph, width=chars_per_line)
            wrapped_lines.extend(wrapped)

    y = PAGE_HEIGHT - MARGIN_TOP

    for line in wrapped_lines:
        if y < MARGIN_BOTTOM:
            c.showPage()
            draw_page_background()
            c.setFont(font_name, font_size)
            c.setFillColorRGB(r, g, b)
            y = PAGE_HEIGHT - MARGIN_TOP

        # Natural variation + slant offset
        x_offset = random.uniform(-1.5, 1.5)
        y_offset = random.uniform(-1.0, 1.0)
        slant_offset = (PAGE_HEIGHT - y) * math.tan(slant_radians) * 0.05

        c.drawString(
            MARGIN_LEFT + x_offset + slant_offset,
            y + y_offset,
            line
        )
        y -= line_height

    c.save()
    buffer.seek(0)
    return buffer.read()