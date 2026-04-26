import pdfplumber
from docx import Document
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file given its raw bytes."""
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from a Word (.docx) file given its raw bytes."""
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
    return "\n".join(paragraphs)


def extract_text(filename: str, file_bytes: bytes) -> str:
    """
    Route to the correct extractor based on file extension.
    Raises an error if file type is unsupported.
    """
    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported file type: {filename}")