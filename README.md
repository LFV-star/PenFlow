# Penflow ✍️

Convert documents to handwritten-style PDF.

## What it does
Upload a PDF or DOCX file and Penflow converts it into a 
realistic handwritten-style PDF you can download and print.

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Python + FastAPI
- **PDF Generation:** ReportLab
- **Document Parsing:** pdfplumber, python-docx

## Features
- Upload PDF or DOCX files
- Converts text to handwriting-style font
- Download ready-to-print PDF
- Multi-page support

## Getting Started

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


### Frontend
cd frontend
npm install
npm run dev
