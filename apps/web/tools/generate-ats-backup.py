#!/usr/bin/env python3
"""Generate ATS-friendly DOCX and PDF resume backups from resume.md."""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import tempfile
import urllib.request
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE
from docx.shared import Inches, Pt, RGBColor


DEFAULT_SOURCE = "https://nibras.co/resume.md"
DEFAULT_OUTPUT_DIR = Path.home() / "Downloads"

BLACK = RGBColor(0x11, 0x11, 0x11)
MUTED = RGBColor(0x4B, 0x55, 0x63)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        default=DEFAULT_SOURCE,
        help="resume.md URL or local path",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="directory for generated files (default: ~/Downloads)",
    )
    parser.add_argument(
        "--stem",
        default=f"Griko_Nibras_ATS_Resume_Backup_{date.today().isoformat()}",
        help="output filename without extension",
    )
    parser.add_argument(
        "--docx-only",
        action="store_true",
        help="skip LibreOffice PDF conversion",
    )
    return parser.parse_args()


def load_source(source: str) -> str:
    if re.match(r"^https?://", source):
        request = urllib.request.Request(
            source,
            headers={
                "Accept": "text/plain",
                "User-Agent": "resume-ats-backup/1.0",
            },
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.read().decode("utf-8")
    return Path(source).expanduser().read_text(encoding="utf-8")


def set_font(run, size=9.5, bold=False, italic=False, color=BLACK):
    run.font.name = "Arial"
    fonts = run._element.get_or_add_rPr().rFonts
    fonts.set(qn("w:ascii"), "Arial")
    fonts.set(qn("w:hAnsi"), "Arial")
    fonts.set(qn("w:eastAsia"), "Arial")
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return run


def add_hyperlink(paragraph, text, url, size=9.5, bold=False):
    relationship_id = paragraph.part.relate_to(
        url,
        RELATIONSHIP_TYPE.HYPERLINK,
        is_external=True,
    )
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), relationship_id)

    run_element = OxmlElement("w:r")
    properties = OxmlElement("w:rPr")
    fonts = OxmlElement("w:rFonts")
    fonts.set(qn("w:ascii"), "Arial")
    fonts.set(qn("w:hAnsi"), "Arial")
    properties.append(fonts)

    color = OxmlElement("w:color")
    color.set(qn("w:val"), "0563C1")
    properties.append(color)
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    properties.append(underline)
    size_element = OxmlElement("w:sz")
    size_element.set(qn("w:val"), str(int(size * 2)))
    properties.append(size_element)
    if bold:
        properties.append(OxmlElement("w:b"))

    run_element.append(properties)
    text_element = OxmlElement("w:t")
    text_element.text = text
    run_element.append(text_element)
    hyperlink.append(run_element)
    paragraph._p.append(hyperlink)


def display_url(url: str) -> str:
    return re.sub(r"^https?://(www\.)?", "", url).rstrip("/")


def section_text(source: str, title: str) -> str:
    match = re.search(
        rf"^## {re.escape(title)}\s*$\n(.*?)(?=^## |^---\s*$|\Z)",
        source,
        flags=re.MULTILINE | re.DOTALL,
    )
    return match.group(1).strip() if match else ""


def parse_header(source: str) -> dict:
    """`# Name`, the headline paragraph, then `- Label: value` contact lines."""
    head = source.split("\n## ", 1)[0]
    blocks = [block.strip() for block in re.split(r"\n\s*\n", head) if block.strip()]
    contact = {"Name": blocks[0].removeprefix("# ").strip()} if blocks else {}
    for block in blocks[1:]:
        if block.startswith("- "):
            for line in block.splitlines():
                key, _, value = line.removeprefix("- ").partition(": ")
                contact[key.strip()] = value.strip()
        else:
            contact.setdefault("Title", block)
    return contact


def parse_entries(section: str) -> list[dict]:
    """`### Title`, a ` · ` meta line, then bullets, paragraphs, Technologies and Links."""
    entries = []
    for block in re.split(r"^### ", section, flags=re.MULTILINE)[1:]:
        title, _, rest = block.partition("\n")
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", rest) if p.strip()]
        meta = paragraphs.pop(0).split(" · ") if paragraphs else []
        entry = {
            "title": title.strip(),
            "meta": meta,
            "url": next((part for part in meta if re.match(r"^https?://", part)), None),
            "technologies": "",
            "links": [],
            "bullets": [],
            "body": [],
        }
        for paragraph in paragraphs:
            if paragraph.startswith("- "):
                entry["bullets"] += [line[2:].strip() for line in paragraph.splitlines()]
            elif paragraph.startswith("Technologies: "):
                entry["technologies"] = paragraph.removeprefix("Technologies: ")
            elif paragraph.startswith("Links: "):
                entry["links"] = paragraph.removeprefix("Links: ").split(", ")
            else:
                entry["body"].append(paragraph)
        entries.append(entry)
    return entries


def configure_document(document: Document) -> None:
    section = document.sections[0]
    section.top_margin = Inches(0.65)
    section.right_margin = Inches(0.65)
    section.bottom_margin = Inches(0.65)
    section.left_margin = Inches(0.65)
    section.header_distance = Inches(0.3)
    section.footer_distance = Inches(0.3)

    normal = document.styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(9.5)
    normal.font.color.rgb = BLACK
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = Pt(3)
    normal.paragraph_format.line_spacing = 1.08

    for name, size, before, after in [
        ("Heading 1", 12, 10, 4),
        ("Heading 2", 10.5, 6, 2),
        ("Heading 3", 9.5, 4, 1),
    ]:
        style = document.styles[name]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = BLACK
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True

    bullet = document.styles["List Bullet"]
    bullet.font.name = "Arial"
    bullet._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    bullet._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    bullet.font.size = Pt(9.5)
    bullet.paragraph_format.left_indent = Inches(0.28)
    bullet.paragraph_format.first_line_indent = Inches(-0.16)
    bullet.paragraph_format.space_after = Pt(2)
    bullet.paragraph_format.line_spacing = 1.08

    if "Resume Metadata" not in document.styles:
        style = document.styles.add_style(
            "Resume Metadata",
            WD_STYLE_TYPE.PARAGRAPH,
        )
        style.base_style = normal
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
        style.font.size = Pt(9)
        style.font.color.rgb = MUTED
        style.paragraph_format.space_after = Pt(2)
        style.paragraph_format.keep_with_next = True


def add_section_heading(document: Document, text: str) -> None:
    paragraph = document.add_paragraph(style="Heading 1")
    paragraph.paragraph_format.keep_with_next = True
    set_font(paragraph.add_run(text.upper()), size=12, bold=True)


def add_linked_heading(document: Document, entry: dict) -> None:
    paragraph = document.add_paragraph(style="Heading 2")
    if entry["url"]:
        add_hyperlink(paragraph, entry["title"], entry["url"], size=10.5, bold=True)
    else:
        set_font(paragraph.add_run(entry["title"]), size=10.5, bold=True)


def add_meta(document: Document, parts: list[str]) -> None:
    paragraph = document.add_paragraph(style="Resume Metadata")
    text = " | ".join(display_url(part) for part in parts if part)
    set_font(paragraph.add_run(text), size=9, color=MUTED)


def add_body(document: Document, entry: dict) -> None:
    for text in entry["body"]:
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(2)
        set_font(paragraph.add_run(text))
    for item in entry["bullets"]:
        paragraph = document.add_paragraph(style="List Bullet")
        set_font(paragraph.add_run(item))
    if entry["technologies"]:
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(3)
        set_font(paragraph.add_run("Technologies: "), size=8.8, bold=True)
        set_font(paragraph.add_run(entry["technologies"]), size=8.8, color=MUTED)
    if entry["links"]:
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(3)
        for index, url in enumerate(entry["links"]):
            if index:
                set_font(paragraph.add_run(", "), size=8.8)
            add_hyperlink(paragraph, display_url(url), url, size=8.8)


def add_contact(document: Document, contact: dict[str, str]) -> None:
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_after = Pt(1)
    set_font(paragraph.add_run(contact.get("Name", "")), size=19, bold=True)

    if contact.get("Title"):
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(4)
        set_font(paragraph.add_run(contact["Title"]), size=11.5, bold=True, color=MUTED)

    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_after = Pt(5)
    items = []
    if contact.get("Location"):
        items.append((contact["Location"], None))
    if contact.get("Email"):
        items.append((contact["Email"], f"mailto:{contact['Email']}"))
    for key in ("Website", "LinkedIn", "GitHub"):
        if contact.get(key):
            items.append((display_url(contact[key]), contact[key]))
    for index, (text, url) in enumerate(items):
        if index:
            set_font(paragraph.add_run(" | "))
        if url:
            add_hyperlink(paragraph, text, url)
        else:
            set_font(paragraph.add_run(text))


def add_entries(document: Document, title: str, entries: list[dict], linked: bool) -> None:
    if not entries:
        return
    add_section_heading(document, title)
    for entry in entries:
        if linked:
            add_linked_heading(document, entry)
        else:
            paragraph = document.add_paragraph(style="Heading 2")
            set_font(paragraph.add_run(entry["title"]), size=10.5, bold=True)
        add_meta(document, [part for part in entry["meta"] if part != entry["url"]] if linked else entry["meta"])
        add_body(document, entry)


def add_skills(document: Document, section: str) -> None:
    add_section_heading(document, "Skills")
    for line in section.splitlines():
        name, _, skills = line.removeprefix("- ").partition(": ")
        if not skills:
            continue
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(2)
        set_font(paragraph.add_run(f"{name}: "), bold=True)
        set_font(paragraph.add_run(skills))


def build_document(source: str, output_path: Path) -> None:
    contact = parse_header(source)
    name = contact.get("Name", "")

    document = Document()
    configure_document(document)
    document.core_properties.title = f"{name} - Resume"
    document.core_properties.subject = f"Resume of {name}"
    document.core_properties.author = name
    document.core_properties.keywords = "resume"

    add_contact(document, contact)
    summary = section_text(source, "Summary")
    if summary:
        add_section_heading(document, "Summary")
        for text in re.split(r"\n\s*\n", summary):
            set_font(document.add_paragraph().add_run(text.strip()))
    add_entries(document, "Experience", parse_entries(section_text(source, "Experience")), False)
    add_entries(document, "Projects", parse_entries(section_text(source, "Projects")), True)
    add_skills(document, section_text(source, "Skills"))
    add_entries(document, "Education", parse_entries(section_text(source, "Education")), False)
    add_entries(document, "Community", parse_entries(section_text(source, "Community")), True)
    add_entries(document, "Talks", parse_entries(section_text(source, "Talks")), True)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    document.save(output_path)


def convert_to_pdf(docx_path: Path, output_dir: Path) -> Path:
    office = shutil.which("soffice") or shutil.which("libreoffice")
    if not office:
        raise RuntimeError(
            "LibreOffice is required for PDF output; use --docx-only to skip it"
        )

    with tempfile.TemporaryDirectory(prefix="resume-libreoffice-") as profile:
        command = [
            office,
            "--headless",
            f"-env:UserInstallation={Path(profile).as_uri()}",
            "--convert-to",
            "pdf",
            "--outdir",
            str(output_dir),
            str(docx_path),
        ]
        result = subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode:
            raise RuntimeError(
                f"LibreOffice conversion failed: {result.stderr.strip()}"
            )

    pdf_path = output_dir / f"{docx_path.stem}.pdf"
    if not pdf_path.is_file() or pdf_path.stat().st_size == 0:
        raise RuntimeError("LibreOffice did not create a non-empty PDF")
    return pdf_path


def main() -> None:
    args = parse_args()
    source = load_source(args.source)
    output_dir = args.output_dir.expanduser().resolve()
    docx_path = output_dir / f"{args.stem}.docx"
    build_document(source, docx_path)
    print(docx_path)

    if not args.docx_only:
        print(convert_to_pdf(docx_path, output_dir))


if __name__ == "__main__":
    main()
