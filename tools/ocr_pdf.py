from __future__ import annotations

import argparse
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TESSERACT = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
DEFAULT_TESSDATA = ROOT / ".ocr" / "tessdata"


def get_page_count(pdf_path: Path) -> int:
    result = subprocess.run(["pdfinfo", str(pdf_path)], check=True, capture_output=True)
    output_bytes = result.stdout or result.stderr or b""
    output = output_bytes.decode("utf-8", errors="ignore")
    if "Pages:" not in output:
        output = output_bytes.decode("gb18030", errors="ignore")
    for line in output.splitlines():
        if line.startswith("Pages:"):
            return int(line.split(":", 1)[1].strip())
    raise RuntimeError(f"Could not determine page count for {pdf_path}")


def render_page(pdf_path: Path, image_path: Path, page: int, dpi: int) -> None:
    cmd = [
        "pdftoppm",
        "-f",
        str(page),
        "-l",
        str(page),
        "-singlefile",
        "-png",
        "-gray",
        "-r",
        str(dpi),
        str(pdf_path),
        str(image_path.with_suffix("")),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def ocr_image(
    image_path: Path,
    text_path: Path,
    tesseract_path: Path,
    tessdata_dir: Path,
    psm: int,
) -> None:
    cmd = [
        str(tesseract_path),
        str(image_path),
        str(text_path.with_suffix("")),
        "-l",
        "chi_sim",
        "--tessdata-dir",
        str(tessdata_dir),
        "--psm",
        str(psm),
        "quiet",
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def process_page(
    pdf_path: Path,
    out_dir: Path,
    page: int,
    dpi: int,
    tesseract_path: Path,
    tessdata_dir: Path,
    psm: int,
    force: bool,
) -> tuple[int, str]:
    text_path = out_dir / f"page-{page:04d}.txt"
    if text_path.exists() and not force:
        return page, "skip"

    with tempfile.TemporaryDirectory(prefix=f"ocr-{page:04d}-", dir=out_dir) as temp_dir:
        temp_dir_path = Path(temp_dir)
        image_path = temp_dir_path / "page.png"
        render_page(pdf_path, image_path, page, dpi)
        ocr_image(image_path, text_path, tesseract_path, tessdata_dir, psm)

    return page, "done"


def combine_pages(out_dir: Path, start: int, end: int) -> Path:
    combined_path = out_dir / "combined.txt"
    with combined_path.open("w", encoding="utf-8") as fh:
        for page in range(start, end + 1):
            text_path = out_dir / f"page-{page:04d}.txt"
            if not text_path.exists():
                continue
            fh.write(f"\n\n===== PAGE {page} =====\n")
            fh.write(text_path.read_text(encoding="utf-8", errors="ignore").strip())
            fh.write("\n")
    return combined_path


def main() -> None:
    parser = argparse.ArgumentParser(description="OCR a scanned PDF into page-level text files.")
    parser.add_argument("pdf", type=Path)
    parser.add_argument("out_dir", type=Path)
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--end", type=int)
    parser.add_argument("--dpi", type=int, default=200)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--psm", type=int, default=6)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--tesseract", type=Path, default=DEFAULT_TESSERACT)
    parser.add_argument("--tessdata-dir", type=Path, default=DEFAULT_TESSDATA)
    args = parser.parse_args()

    pdf_path = args.pdf.resolve()
    out_dir = args.out_dir.resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    if not args.tesseract.exists():
        raise FileNotFoundError(f"Tesseract not found: {args.tesseract}")
    if not args.tessdata_dir.exists():
        raise FileNotFoundError(f"Tessdata directory not found: {args.tessdata_dir}")

    max_page = get_page_count(pdf_path)
    start = max(1, args.start)
    end = min(args.end or max_page, max_page)

    print(f"OCR {pdf_path.name}: pages {start}-{end}, dpi={args.dpi}, workers={args.workers}, psm={args.psm}")
    pages = list(range(start, end + 1))
    done = 0
    skipped = 0

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(
                process_page,
                pdf_path,
                out_dir,
                page,
                args.dpi,
                args.tesseract,
                args.tessdata_dir,
                args.psm,
                args.force,
            ): page
            for page in pages
        }
        for future in as_completed(futures):
            page, status = future.result()
            if status == "skip":
                skipped += 1
            else:
                done += 1
            print(f"[{status}] page {page}")

    combined_path = combine_pages(out_dir, start, end)
    print(f"Combined text written to {combined_path}")
    print(f"done={done}, skipped={skipped}, total={len(pages)}")


if __name__ == "__main__":
    main()
