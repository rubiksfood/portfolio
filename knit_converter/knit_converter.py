#! /usr/bin/env python3

from pdf2docx import Converter
from docx2pdf import convert as docx2pdf_convert
from docx import Document
import os
import re


# Dict mapping US knitting terms to UK knitting terms
us_gb_dict = {
    "bind off": "cast off",
    "BO": "cast off",
    "gauge": "tension",
    "skip": "miss",
    "stockinette stitch": "stocking stitch",
    "yarn over": "yarn over needle",
    "YO": "yarn over needle",
    "seed stitch": "moss stitch",
    "moss stitch": "double moss stitch",
    "selvage": "selvedge",
    "through the back loop": "through back of the loop",
    "yarn to the front": "wool forward",
    "yarn to the back": "wool back",
    "4-stitch left cable": "cable 4 front",
    "cross 4-stitches to the left": "cable 4 front",
    "C4L": "C4F",
    "4-stitch right cable": "cable 4 back",
    "cross 4-stitches to the right": "cable 4 back",
    "C4R": "C4B",
    "sl st" : "sl1k",
    "sl" : "sl1k",
    "knit 2 together": "k2tog",
    "laceweight": "1 ply",
    "fingering": "2 ply",
    "sock": "3 ply",
    "sport": "4 ply",
    "light worsted": "DK",
    "worsted": "aran",
    "bulky": "chunky",
}

def pdf_to_doc(pdf_path, doc_path):
    cv = Converter(pdf_path)
    cv.convert(doc_path, start=0, end=None)
    cv.close()

def doc_to_pdf(doc_path, pdf_path):
    docx2pdf_convert(doc_path, pdf_path)

def convert_terms(doc_path, us_gb_dict):
    doc = Document(doc_path)
    for para in doc.paragraphs:
        orig_text = para.text
        new_text = orig_text
        for us_term, uk_term in us_gb_dict.items():
            pattern = re.compile(r'\b' + re.escape(us_term) + r'\b', re.IGNORECASE)
            def replace(m):
                original = m.group()
                if original.istitle():
                    return uk_term.capitalize()
                else:
                    return uk_term
            new_text = pattern.sub(replace, new_text)
        if new_text != orig_text:
            para.text = new_text
    doc.save(doc_path)


if __name__ == "__main__":
    input_path = "Path_to_your_input_pdfs"  # Change this to your input directory
    output_path = "Path_to_your_output_pdfs"  # Change this to your output directory
    os.makedirs(output_path, exist_ok=True)

    for filename in os.listdir(input_path):
        if filename.endswith(".pdf"):
            input_pdf = os.path.join(input_path, filename)
            doc_to_edit = os.path.join(output_path, filename.replace(".pdf", ".docx"))
            output_pdf = os.path.join(output_path, f"gb_{filename}")

            # Document conversions
            pdf_to_doc(input_pdf, doc_to_edit)
            convert_terms(doc_to_edit, us_gb_dict)
            doc_to_pdf(doc_to_edit, output_pdf)
            print(f"Converted {filename} and saved to {output_pdf}")
            try:
                os.remove(doc_to_edit)  # This line deletes the Word document
            except FileNotFoundError:
                print("Temp doc not found.")
            except Exception as e:
                print(f"An error occurred: {e}")