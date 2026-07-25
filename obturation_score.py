"""
ObturaScore AI — Deterministic Root Canal Obturation Scoring Pipeline
=======================================================================

Given a single periapical radiograph of an obturated root canal, this module
returns a reproducible score out of 10:

    total_score = length_score(/4) + density_score(/3) + taper_score(/3)

Design goals (in priority order):
1. DETERMINISM — identical input image always yields identical output.
   Enforced via (a) a pure classical-CV pipeline with no randomness anywhere,
   and (b) a SHA-256 content-hash cache so repeat uploads never re-run
   anything at all.
2. INTERPRETABILITY — each subscore comes from a directly measurable
   geometric/intensity property of the canal, not a black-box regression.
3. CALIBRATABLE — the thresholds marked CALIBRATE below are the values you
   should tune against your 900-image dataset (ideally against a subset with
   expert-assigned ground-truth scores).

Usage:
    from obturation_scorer import analyze_xray
    result = analyze_xray("Images 2/4.jpg")
    print(result)
    # {
    #   "image_hash": "a3f9...",
    #   "length_score": 3.2,
    #   "density_score": 2.4,
    #   "taper_score": 2.7,
    #   "total_score": 8.3,
    #   "details": {...}
    # }

Dependencies: opencv-python, numpy
    pip install opencv-python numpy --break-system-packages
"""

import hashlib
import json
import os

import cv2
import numpy as np

# ----------------------------------------------------------------------
# Cache — guarantees identical output for identical file content, and
# avoids recomputation cost. Swap this for a MongoDB lookup in server.js
# if you'd rather cache at the API layer; either is fine, but at least one
# layer of hash-based caching should exist somewhere in the request path.
# ----------------------------------------------------------------------
CACHE_PATH = os.path.join(os.path.dirname(__file__), "score_cache.json")


def _load_cache():
    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "r") as f:
            return json.load(f)
    return {}


def _save_cache(cache):
    with open(CACHE_PATH, "w") as f:
        json.dump(cache, f, indent=2)


def _hash_image_bytes(image_bytes: bytes) -> str:
    return hashlib.sha256(image_bytes).hexdigest()


# ----------------------------------------------------------------------
# Step 1 — Deterministic preprocessing
# ----------------------------------------------------------------------
CANONICAL_SIZE = (512, 512)  # fixed size, fixed interpolation -> reproducible


def preprocess(gray_img: np.ndarray) -> np.ndarray:
    """Standardize contrast and size. No randomness anywhere in this path."""
    img = cv2.resize(gray_img, CANONICAL_SIZE, interpolation=cv2.INTER_AREA)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    img = clahe.apply(img)
    img = cv2.GaussianBlur(img, (3, 3), 0)
    return img


# ----------------------------------------------------------------------
# Step 2 — Canal + fill segmentation
#
# Gutta-percha (the obturation material) is markedly more radiopaque than
# surrounding dentin, so it isolates well with adaptive thresholding.
# This is intentionally classical CV rather than a trained segmentation
# net: it is 100% deterministic and needs no labeled masks to start
# working. If you later hand-label masks for a subset of your 900 images,
# you can swap this function for a U-Net without touching anything else
# in the pipeline (the interface — a binary fill mask — stays the same).
# ----------------------------------------------------------------------
def segment_fill(img: np.ndarray) -> np.ndarray:
    """Returns a binary mask of the radiopaque obturation material."""
    # Otsu picks a global threshold; fill material sits in the brightest
    # percentile of the tooth region.
    _, otsu = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Restrict to the brightest structures only (gutta-percha, not dentin)
    p95 = np.percentile(img, 95)  # CALIBRATE: percentile cutoff
    _, bright = cv2.threshold(img, p95 * 0.9, 255, cv2.THRESH_BINARY)

    mask = cv2.bitwise_and(otsu, bright)
    mask = cv2.morphologyEx(
        mask, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8), iterations=2
    )
    return mask


def largest_component(mask: np.ndarray) -> np.ndarray:
    """Keep only the largest connected blob — assumed to be the canal fill."""
    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
    if n_labels <= 1:
        return mask
    largest_idx = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    return np.uint8(labels == largest_idx) * 255


# ----------------------------------------------------------------------
# Step 3 — Landmark extraction: orifice, apex, fill terminus
# ----------------------------------------------------------------------
def get_fill_axis_points(fill_mask: np.ndarray):
    """
    Returns (orifice_pt, terminus_pt) — the two ends of the fill column,
    found via PCA on the mask's foreground pixels (its principal axis is
    the canal's long axis, a deterministic and rotation-robust choice).
    """
    ys, xs = np.nonzero(fill_mask)
    if len(xs) < 10:
        raise ValueError("Fill region too small to analyze — check image quality")

    pts = np.column_stack([xs, ys]).astype(np.float64)
    mean = pts.mean(axis=0)
    centered = pts - mean
    cov = np.cov(centered.T)
    eigvals, eigvecs = np.linalg.eigh(cov)
    principal_axis = eigvecs[:, np.argmax(eigvals)]

    projections = centered @ principal_axis
    orifice_pt = pts[np.argmin(projections)]
    terminus_pt = pts[np.argmax(projections)]

    # Canonically orient so orifice = topmost (closer to crown) point
    if orifice_pt[1] > terminus_pt[1]:
        orifice_pt, terminus_pt = terminus_pt, orifice_pt

    return orifice_pt, terminus_pt


def estimate_apex(img: np.ndarray, tooth_mask: np.ndarray, terminus_pt: np.ndarray):
    """
    Estimates the radiographic apex as the tip of the tooth/root contour
    nearest the fill terminus. `tooth_mask` should isolate the whole tooth
    (root + crown), not just the fill.
    """
    contours, _ = cv2.findContours(
        tooth_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    if not contours:
        # Fallback: extend a fixed margin past the fill terminus
        return terminus_pt + np.array([0, 15])  # CALIBRATE

    largest = max(contours, key=cv2.contourArea)
    pts = largest.reshape(-1, 2)
    dists_from_terminus_axis = np.abs(pts[:, 0] - terminus_pt[0])
    # Apex = point below terminus, closest in x, with max y
    candidates = pts[pts[:, 1] > terminus_pt[1]]
    if len(candidates) == 0:
        return terminus_pt + np.array([0, 15])
    apex = candidates[np.argmax(candidates[:, 1])]
    return apex


def segment_tooth(img: np.ndarray) -> np.ndarray:
    """Rough whole-tooth mask (root + crown), used only for apex-finding."""
    _, mask = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    return largest_component(mask)


# ----------------------------------------------------------------------
# Step 4 — Subscore calculations
# ----------------------------------------------------------------------
def length_score(orifice_pt, terminus_pt, apex_pt) -> float:
    """
    Score out of 4. Ideal obturation ends 0.5-2mm short of the apex.
    We work in pixels and use the canal's own length as the unit scale,
    since we don't have a calibrated mm/pixel ratio from the radiograph
    metadata. CALIBRATE the `ideal_short_frac` band against your dataset
    once you know the typical canal length in pixels vs real mm.
    """
    canal_len = np.linalg.norm(apex_pt - orifice_pt)
    fill_len = np.linalg.norm(terminus_pt - orifice_pt)
    if canal_len == 0:
        return 0.0

    shortfall_frac = (canal_len - fill_len) / canal_len  # >0 = short, <0 = over

    ideal_low, ideal_high = 0.02, 0.08  # CALIBRATE: fraction of canal length
    if ideal_low <= shortfall_frac <= ideal_high:
        return 4.0
    elif shortfall_frac < 0:  # overfill — penalize more steeply
        overfill = abs(shortfall_frac)
        return max(0.0, 4.0 - overfill * 20)  # CALIBRATE steepness
    else:  # underfill
        underfill = shortfall_frac - ideal_high
        return max(0.0, 4.0 - underfill * 12)  # CALIBRATE steepness


def density_score(img: np.ndarray, fill_mask: np.ndarray) -> float:
    """
    Score out of 3. Measures homogeneity of the fill: voids/gaps show up
    as darker low-intensity dips within the fill mask.
    """
    fill_pixels = img[fill_mask > 0]
    if len(fill_pixels) == 0:
        return 0.0

    mean_intensity = fill_pixels.mean()
    std_intensity = fill_pixels.std()

    # Void detection: pixels within the fill mask well below the fill's
    # own mean brightness indicate a gap/void in the gutta-percha.
    void_threshold = mean_intensity - 1.5 * std_intensity  # CALIBRATE
    void_fraction = np.mean(fill_pixels < void_threshold)

    coeff_variation = std_intensity / (mean_intensity + 1e-6)

    # Combine: penalize both void fraction and overall intensity variability
    raw = 1.0 - (void_fraction * 1.5 + coeff_variation * 1.0)  # CALIBRATE weights
    return float(np.clip(raw, 0, 1) * 3.0)


def taper_score(fill_mask: np.ndarray, orifice_pt, terminus_pt, n_samples=15) -> float:
    """
    Score out of 3. Samples canal width at points along the orifice->
    terminus axis and checks for smooth, monotonic narrowing.
    """
    direction = terminus_pt - orifice_pt
    length = np.linalg.norm(direction)
    if length == 0:
        return 0.0
    unit_dir = direction / length
    perp_dir = np.array([-unit_dir[1], unit_dir[0]])

    widths = []
    for i in range(n_samples):
        t = i / (n_samples - 1)
        center = orifice_pt + t * direction
        widths.append(_measure_width_at(fill_mask, center, perp_dir))

    widths = np.array([w for w in widths if w is not None])
    if len(widths) < 4:
        return 0.0

    # 1) Monotonicity: taper should generally narrow orifice -> apex
    diffs = np.diff(widths)
    monotonic_fraction = np.mean(diffs <= 0.5)  # allow small noise tolerance

    # 2) Smoothness: low variance in the *rate* of narrowing = consistent taper
    if len(diffs) > 1:
        smoothness = 1.0 - np.clip(np.std(diffs) / (np.mean(widths) + 1e-6), 0, 1)
    else:
        smoothness = 1.0

    raw = 0.6 * monotonic_fraction + 0.4 * smoothness  # CALIBRATE weights
    return float(np.clip(raw, 0, 1) * 3.0)


def _measure_width_at(mask, center, perp_dir, max_search=40):
    """Walks outward along perp_dir from center until leaving the mask."""
    h, w = mask.shape
    for direction_sign in (1, -1):
        pass  # measured together below

    def in_bounds(pt):
        return 0 <= pt[0] < w and 0 <= pt[1] < h

    def mask_at(pt):
        x, y = int(round(pt[0])), int(round(pt[1]))
        return in_bounds((x, y)) and mask[y, x] > 0

    left_extent, right_extent = 0, 0
    for d in range(1, max_search):
        p = center + d * perp_dir
        if mask_at(p):
            right_extent = d
        else:
            break
    for d in range(1, max_search):
        p = center - d * perp_dir
        if mask_at(p):
            left_extent = d
        else:
            break

    total_width = left_extent + right_extent
    return total_width if total_width > 0 else None


# ----------------------------------------------------------------------
# Main entry point
# ----------------------------------------------------------------------
def analyze_xray(image_path: str, use_cache: bool = True) -> dict:
    with open(image_path, "rb") as f:
        image_bytes = f.read()
    image_hash = _hash_image_bytes(image_bytes)

    cache = _load_cache() if use_cache else {}
    if use_cache and image_hash in cache:
        return cache[image_hash]

    nparr = np.frombuffer(image_bytes, np.uint8)
    raw_img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    if raw_img is None:
        raise ValueError(f"Could not read image: {image_path}")

    img = preprocess(raw_img)

    fill_mask = segment_fill(img)
    fill_mask = largest_component(fill_mask)

    tooth_mask = segment_tooth(img)

    orifice_pt, terminus_pt = get_fill_axis_points(fill_mask)
    apex_pt = estimate_apex(img, tooth_mask, terminus_pt)

    l_score = round(length_score(orifice_pt, terminus_pt, apex_pt), 2)
    d_score = round(density_score(img, fill_mask), 2)
    t_score = round(taper_score(fill_mask, orifice_pt, terminus_pt), 2)
    total = round(l_score + d_score + t_score, 2)

    result = {
        "image_hash": image_hash,
        "length_score": l_score,
        "density_score": d_score,
        "taper_score": t_score,
        "total_score": total,
        "details": {
            "orifice_pt": orifice_pt.tolist(),
            "terminus_pt": terminus_pt.tolist(),
            "apex_pt": (
                apex_pt.tolist() if hasattr(apex_pt, "tolist") else list(apex_pt)
            ),
        },
    }

    if use_cache:
        cache[image_hash] = result
        _save_cache(cache)

    return result


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python obturation_scorer.py <path_to_xray_image>")
        sys.exit(1)

    result = analyze_xray(sys.argv[1])
    print(json.dumps(result, indent=2))