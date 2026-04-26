from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import textwrap
import io
import random

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

# Page settings (A4)
PAGE_WIDTH = 595
PAGE_HEIGHT = 842
MARGIN_LEFT = 72
MARGIN_RIGHT = 72
MARGIN_TOP = 72
MARGIN_BOTTOM = 72


def draw_lined_paper(c):
    """Draw horizontal lines across the page."""
    c.setStrokeColorRGB(0.7, 0.85, 1.0)
    c.setLineWidth(0.5)
    y = PAGE_HEIGHT - MARGIN_TOP
    while y > MARGIN_BOTTOM:
        c.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
        y -= 28


def draw_grid_paper(c):
    """Draw a grid across the page."""
    c.setStrokeColorRGB(0.75, 0.85, 1.0)
    c.setLineWidth(0.3)
    # Horizontal lines
    y = PAGE_HEIGHT - MARGIN_TOP
    while y > MARGIN_BOTTOM:
        c.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
        y -= 20
    # Vertical lines
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
) -> bytes:
    """
    Renders text as a handwritten-style PDF with customizable settings.
    Returns the PDF as raw bytes.
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))

    # Get settings
    font_name = FONTS.get(font, "Caveat")
    r, g, b = INK_COLORS.get(ink_color, (0, 0, 0))
    line_height = font_size * 1.8

    def draw_page_background():
        if paper_style == "lined":
            draw_lined_paper(c)
        elif paper_style == "grid":
            draw_grid_paper(c)

    # Draw first page background
    draw_page_background()

    # Set font and ink color
    c.setFont(font_name, font_size)
    c.setFillColorRGB(r, g, b)

    # Wrap text
    usable_width = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
    chars_per_line = int(usable_width / (font_size * 0.55))
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

        x_offset = random.uniform(-1.5, 1.5)
        y_offset = random.uniform(-1.0, 1.0)
        c.drawString(MARGIN_LEFT + x_offset, y + y_offset, line)
        y -= line_height

    c.save()
    buffer.seek(0)
    return buffer.read()