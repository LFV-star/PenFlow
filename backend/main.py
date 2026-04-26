from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io

from document_parser import extract_text
from renderer import render_handwritten_pdf

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


@app.post("/convert")
async def convert(
    file: UploadFile = File(...),
    font: str = Form(default="caveat"),
    font_size: int = Form(default=16),
    ink_color: str = Form(default="black"),
    paper_style: str = Form(default="blank"),
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
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    try:
        pdf_bytes = render_handwritten_pdf(
            text=text,
            font=font,
            font_size=font_size,
            ink_color=ink_color,
            paper_style=paper_style,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to render PDF: {str(e)}")

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=penflow-output.pdf"}
    )