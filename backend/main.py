from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io

from document_parser import extract_text
from renderer import render_handwritten_pdf

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Handwrite API is running ✅"}


@app.post("/convert")
async def convert(file: UploadFile = File(...)):
    """
    Accepts a PDF or DOCX file,
    extracts the text,
    renders it as a handwritten PDF,
    and returns it for download.
    """

    # Validate file type
    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    # Read file bytes
    file_bytes = await file.read()

    # Extract text
    try:
        text = extract_text(file.filename, file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    # Render handwritten PDF
    try:
        pdf_bytes = render_handwritten_pdf(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to render PDF: {str(e)}")

    # Return PDF as downloadable file
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=handwritten.pdf"}
    )