from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io

from document_parser import extract_text
from renderer import render_handwritten_pdf
from handwriting_analyzer import analyze_handwriting

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Penflow API is running ✅"}


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    """
    Accepts a handwriting image and returns style characteristics.
    """
    allowed = ["image/jpeg", "image/png", "image/jpg"]
    if image.content_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are supported."
        )

    image_bytes = await image.read()

    try:
        style = analyze_handwriting(image_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze image: {str(e)}"
        )

    return style


@app.post("/convert")
async def convert(
    file: UploadFile = File(...),
    font: str = Form(default="caveat"),
    font_size: int = Form(default=16),
    ink_color: str = Form(default="black"),
    paper_style: str = Form(default="blank"),
    use_personal_style: bool = Form(default=False),
    slant: float = Form(default=0.0),
    spacing_factor: float = Form(default=1.0),
    stroke_weight: str = Form(default="normal"),
):
    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    file_bytes = await file.read()

    try:
        text = extract_text(file.filename, file_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text: {str(e)}"
        )

    # Build handwriting style if using personal style
    handwriting_style = None
    if use_personal_style:
        handwriting_style = {
            "font_size": font_size,
            "slant": slant,
            "spacing_factor": spacing_factor,
            "stroke_weight": stroke_weight,
        }

    try:
        pdf_bytes = render_handwritten_pdf(
            text=text,
            font=font,
            font_size=font_size,
            ink_color=ink_color,
            paper_style=paper_style,
            handwriting_style=handwriting_style,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to render PDF: {str(e)}"
        )

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=penflow-output.pdf"}
    )