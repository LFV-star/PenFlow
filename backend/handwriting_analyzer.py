import cv2
import numpy as np
import io


def analyze_handwriting(image_bytes: bytes) -> dict:
    """
    Analyzes a handwriting image and extracts style characteristics.
    Returns a dict of style properties to apply to the PDF renderer.
    """

    # Load image from bytes
    img_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)

    if img is None:
        raise ValueError("Could not read image. Please upload a valid image file.")

    # Step 1 — Threshold the image (make it black and white)
    _, binary = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV)

    # Step 2 — Find contours (letter shapes)
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if len(contours) == 0:
        return _default_style()

    # Step 3 — Analyze letter sizes
    heights = []
    widths = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w > 5 and h > 5:  # ignore tiny noise
            heights.append(h)
            widths.append(w)

    if not heights:
        return _default_style()

    avg_height = np.mean(heights)
    avg_width = np.mean(widths)

    # Step 4 — Estimate slant using Hough lines
    edges = cv2.Canny(binary, 50, 150)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, 30, minLineLength=20, maxLineGap=5)

    slant = 0.0
    if lines is not None:
        angles = []
        for line in lines:
            x1, y1, x2, y2 = line[0]
            if x2 != x1:
                angle = np.degrees(np.arctan2(y2 - y1, x2 - x1))
                if -45 < angle < 45:
                    angles.append(angle)
        if angles:
            slant = float(np.mean(angles))

    # Step 5 — Estimate stroke weight (how dark/thick the writing is)
    dark_pixels = np.sum(binary > 0)
    total_pixels = binary.shape[0] * binary.shape[1]
    density = dark_pixels / total_pixels

    stroke_weight = "normal"
    if density > 0.15:
        stroke_weight = "heavy"
    elif density < 0.05:
        stroke_weight = "light"

    # Step 6 — Map avg_height to font size
    font_size = int(np.clip(avg_height * 0.6, 12, 24))

    # Step 7 — Map avg_width to letter spacing
    spacing_factor = float(np.clip(avg_width / max(avg_height, 1), 0.8, 1.4))

    return {
        "font_size": font_size,
        "slant": round(slant, 2),
        "stroke_weight": stroke_weight,
        "spacing_factor": round(spacing_factor, 2),
        "density": round(density, 4),
    }


def _default_style() -> dict:
    """Returns default style if analysis fails."""
    return {
        "font_size": 16,
        "slant": 0.0,
        "stroke_weight": "normal",
        "spacing_factor": 1.0,
        "density": 0.08,
    }