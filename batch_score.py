"""
Batch-run the obturation scorer over an entire image directory and export
raw measurements + scores to CSV — used to calibrate the CALIBRATE
thresholds in obturation_scorer.py against your real dataset.

Usage:
    python batch_score.py "Images 2/" output.csv
"""

import csv
import os
import sys
import traceback

import numpy as np

from obturation_scorer import (
    preprocess, segment_fill, largest_component, segment_tooth,
    get_fill_axis_points, estimate_apex, length_score, density_score,
    taper_score, _hash_image_bytes,
)
import cv2

VALID_EXT = (".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff")


def process_one(path):
    with open(path, "rb") as f:
        image_bytes = f.read()
    image_hash = _hash_image_bytes(image_bytes)

    nparr = np.frombuffer(image_bytes, np.uint8)
    raw_img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    if raw_img is None:
        raise ValueError("unreadable image")

    img = preprocess(raw_img)
    fill_mask = largest_component(segment_fill(img))
    tooth_mask = segment_tooth(img)

    orifice_pt, terminus_pt = get_fill_axis_points(fill_mask)
    apex_pt = estimate_apex(img, tooth_mask, terminus_pt)

    canal_len = float(np.linalg.norm(np.array(apex_pt) - orifice_pt))
    fill_len = float(np.linalg.norm(terminus_pt - orifice_pt))
    shortfall_frac = (canal_len - fill_len) / canal_len if canal_len else None

    fill_pixels = img[fill_mask > 0]
    mean_intensity = float(fill_pixels.mean()) if len(fill_pixels) else None
    std_intensity = float(fill_pixels.std()) if len(fill_pixels) else None

    l = length_score(orifice_pt, terminus_pt, apex_pt)
    d = density_score(img, fill_mask)
    t = taper_score(fill_mask, orifice_pt, terminus_pt)

    return {
        "filename": os.path.basename(path),
        "image_hash": image_hash,
        "canal_len_px": round(canal_len, 2),
        "fill_len_px": round(fill_len, 2),
        "shortfall_frac": round(shortfall_frac, 4) if shortfall_frac is not None else "",
        "fill_mean_intensity": round(mean_intensity, 2) if mean_intensity else "",
        "fill_std_intensity": round(std_intensity, 2) if std_intensity else "",
        "length_score": round(l, 2),
        "density_score": round(d, 2),
        "taper_score": round(t, 2),
        "total_score": round(l + d + t, 2),
        "expert_score": "",  # fill this column in by hand for calibration
        "error": "",
    }


def main(input_dir, output_csv):
    files = sorted(
        f for f in os.listdir(input_dir) if f.lower().endswith(VALID_EXT)
    )
    print(f"Found {len(files)} images in {input_dir}")

    rows = []
    for i, fname in enumerate(files, 1):
        path = os.path.join(input_dir, fname)
        try:
            row = process_one(path)
        except Exception as e:
            row = {
                "filename": fname, "image_hash": "", "canal_len_px": "",
                "fill_len_px": "", "shortfall_frac": "", "fill_mean_intensity": "",
                "fill_std_intensity": "", "length_score": "", "density_score": "",
                "taper_score": "", "total_score": "", "expert_score": "",
                "error": f"{type(e).__name__}: {e}",
            }
            print(f"[{i}/{len(files)}] FAILED: {fname} -> {e}")
        else:
            print(f"[{i}/{len(files)}] {fname} -> total {row['total_score']}")
        rows.append(row)

    fieldnames = list(rows[0].keys())
    with open(output_csv, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    n_failed = sum(1 for r in rows if r["error"])
    print(f"\nDone. {len(rows) - n_failed}/{len(rows)} succeeded. Wrote {output_csv}")
    if n_failed:
        print(f"{n_failed} images failed segmentation — check the 'error' column. "
              "These are usually low-contrast or unusually cropped radiographs; "
              "inspect them manually and adjust segment_fill()/segment_tooth() "
              "thresholds if a pattern emerges.")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python batch_score.py <image_directory> <output_csv>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])