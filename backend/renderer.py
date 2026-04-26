from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import textwrap
import io
import random


# Register our handwriting font
pdfmetrics.registerFont(TTFont("Handwriting", "Caveat-Regular.ttf"))

# Page settings (A4 size in points)
PAGE_WIDTH = 595
PAGE_HEIGHT = 842
MARGIN_LEFT = 72
MARGIN_RIGHT = 72
MARGIN_TOP = 72
MARGIN_BOTTOM = 72
LINE_HEIGHT = 28
FONT_SIZE = 16


def render_handwritten_pdf(text: str) -> bytes:
    """
    Takes plain text and renders it as a handwritten-style PDF.
    Returns the PDF as raw bytes.
    """
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))

    # Set font
    c.setFont("Handwriting", FONT_SIZE)

    # Wrap text to fit within page margins
    usable_width = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
    chars_per_line = int(usable_width / (FONT_SIZE * 0.55))
    wrapped_lines = []

    for paragraph in text.split("\n"):
        if paragraph.strip() == "":
            wrapped_lines.append("")  # preserve paragraph breaks
        else:
            wrapped = textwrap.wrap(paragraph, width=chars_per_line)
            wrapped_lines.extend(wrapped)

    # Start writing from top of page
    y = PAGE_HEIGHT - MARGIN_TOP

    for line in wrapped_lines:
        # If we run out of space, create a new page
        if y < MARGIN_BOTTOM:
            c.showPage()
            c.setFont("Handwriting", FONT_SIZE)
            y = PAGE_HEIGHT - MARGIN_TOP

        # Add subtle natural variation (slight x and y offset per line)
        x_offset = random.uniform(-1.5, 1.5)
        y_offset = random.uniform(-1.0, 1.0)

        c.drawString(MARGIN_LEFT + x_offset, y + y_offset, line)
        y -= LINE_HEIGHT

    c.save()
    buffer.seek(0)
    return buffer.read()