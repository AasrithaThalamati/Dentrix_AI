"""
Dentrix AI — Patent Application PDF v3
Correct branding: Dentrix AI throughout (ObturaScore AI is only the internal product UI name shown in screenshots)
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import Flowable

OUTPUT = "/mnt/user-data/outputs/Dentrix_AI_Patent_Application_v2.pdf"

PAGE_W, PAGE_H = A4
LM = 2.2*cm; RM = 2.2*cm; TM = 2.4*cm; BM = 2.0*cm
CW = PAGE_W - LM - RM

# ── Palette ───────────────────────────────────────────────────────────────────
NAVY    = colors.HexColor("#0D1B2A")
BLUE    = colors.HexColor("#1565C0")
LBLUE   = colors.HexColor("#3B82F6")
ICE     = colors.HexColor("#EBF3FD")
GREEN   = colors.HexColor("#22C55E")
AMBER   = colors.HexColor("#F59E0B")
RED     = colors.HexColor("#EF4444")
DGRAY   = colors.HexColor("#374151")
MGRAY   = colors.HexColor("#6B7280")
LGRAY   = colors.HexColor("#F3F4F6")
BORDER  = colors.HexColor("#E5E7EB")
WHITE   = colors.white

# ── Styles ────────────────────────────────────────────────────────────────────
def PS(name, **kw):
    return ParagraphStyle(name, **kw)

SECTION_LABEL = PS("SL", fontSize=7.5, fontName="Helvetica-Bold", textColor=LBLUE,
                   alignment=TA_LEFT, leading=11, spaceAfter=3, spaceBefore=14)
SECTION_HEAD  = PS("SH", fontSize=14,  fontName="Helvetica-Bold", textColor=NAVY,
                   alignment=TA_LEFT, leading=19, spaceAfter=6, spaceBefore=2)
SUBSEC_HEAD   = PS("SS", fontSize=10.5,fontName="Helvetica-Bold", textColor=NAVY,
                   alignment=TA_LEFT, leading=15, spaceAfter=4, spaceBefore=10)
BODY          = PS("BD", fontSize=9.5, fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_JUSTIFY, leading=15.5, spaceAfter=5)
BODY_B        = PS("BB", fontSize=9.5, fontName="Helvetica-Bold", textColor=DGRAY,
                   alignment=TA_JUSTIFY, leading=15.5, spaceAfter=5)
BULLET_ST     = PS("BL", fontSize=9.5, fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_JUSTIFY, leading=15.5, leftIndent=16,
                   firstLineIndent=-10, spaceAfter=3)
CLAIM_INDEP   = PS("CI", fontSize=9.5, fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_JUSTIFY, leading=15.5, leftIndent=14, spaceAfter=4)
CLAIM_DEP     = PS("CD", fontSize=9.5, fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_JUSTIFY, leading=15.5, leftIndent=28, spaceAfter=3)
CLAIM_NUM     = PS("CN", fontSize=9.5, fontName="Helvetica-Bold", textColor=BLUE,
                   alignment=TA_LEFT, leading=15, spaceAfter=2, spaceBefore=10)
ABSTRACT_ST   = PS("AB", fontSize=9.5, fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_JUSTIFY, leading=16, leftIndent=8, rightIndent=8, spaceAfter=5)
TH            = PS("TH", fontSize=8,   fontName="Helvetica-Bold", textColor=WHITE,
                   alignment=TA_CENTER, leading=12)
TD            = PS("TD", fontSize=8.5, fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_LEFT,   leading=13)
TD_C          = PS("TC", fontSize=8.5, fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_CENTER, leading=13)
FIELD_L       = PS("FL", fontSize=8.5, fontName="Helvetica-Bold", textColor=NAVY,
                   alignment=TA_LEFT,   leading=13)
FIELD_V       = PS("FV", fontSize=8.5, fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_LEFT,   leading=13)
NOTE_ST       = PS("NT", fontSize=8,   fontName="Helvetica",      textColor=MGRAY,
                   alignment=TA_JUSTIFY, leading=12)
SIG_L         = PS("SGL", fontSize=9,  fontName="Helvetica-Bold", textColor=NAVY,
                   alignment=TA_LEFT,   leading=14)
SIG_V         = PS("SGV", fontSize=9,  fontName="Helvetica",      textColor=DGRAY,
                   alignment=TA_LEFT,   leading=14)

# ── Custom Flowables ──────────────────────────────────────────────────────────
class AccentRule(Flowable):
    def __init__(self, w=None, col=BLUE, h=1.5):
        super().__init__()
        self.w = w or CW; self.col=col; self.height=h; self.width=self.w
    def draw(self):
        c=self.canv; c.setStrokeColor(self.col); c.setLineWidth(self.height)
        c.line(0, 0, self.w, 0)

class ThinRule(Flowable):
    def __init__(self, w=None, col=None):
        super().__init__()
        self.w = w or CW; self.col = col or BORDER
        self.height=0.5; self.width=self.w
    def draw(self):
        c=self.canv; c.setStrokeColor(self.col); c.setLineWidth(0.5)
        c.line(0, 0, self.w, 0)

class CoverFlowable(Flowable):
    """Full-width cover block drawn on canvas."""
    def __init__(self, w=None, h=21*cm):
        super().__init__()
        self.w = w or CW; self.h=h; self.width=self.w; self.height=h
    def draw(self):
        c=self.canv; w=self.w; h=self.h

        # ── Background ──
        c.setFillColor(NAVY)
        c.roundRect(0, 0, w, h, 10, fill=1, stroke=0)

        # subtle grid lines
        c.setStrokeColor(colors.HexColor("#1A2E44")); c.setLineWidth(0.5)
        for i in range(0, int(w)+40, 40):
            c.line(i, 0, i, h)
        for j in range(0, int(h)+40, 40):
            c.line(0, j, w, j)

        # ── Top eyebrow pill ──
        c.setFillColor(colors.HexColor("#1A3050"))
        c.roundRect(w/2-175, h-46, 350, 22, 11, fill=1, stroke=0)
        c.setFillColor(GREEN); c.circle(w/2-155, h-35, 3.5, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#93C5FD")); c.setFont("Helvetica", 8)
        c.drawCentredString(w/2+5, h-39,
            "AI-Powered Endodontic Intelligence  ·  Cross-Sectional Observational Study")

        # ── Logo circle ──
        ly = h - 88
        c.setStrokeColor(LBLUE); c.setLineWidth(1.5)
        c.circle(w/2, ly, 26, fill=0, stroke=1)
        c.setStrokeColor(LBLUE); c.setLineWidth(2.5)
        c.bezier(w/2-16, ly, w/2-8, ly+12, w/2+8, ly-12, w/2+16, ly)

        # ── Editorial headline — matching screenshot typography ──
        c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 38)
        c.drawCentredString(w/2, h-132, "Radiographic")
        c.setFillColor(LBLUE); c.setFont("Helvetica-BoldOblique", 38)
        c.drawCentredString(w/2, h-178, "Obturation")
        # underline under italic word
        c.setStrokeColor(LBLUE); c.setLineWidth(1.8)
        c.line(w/2-100, h-184, w/2+100, h-184)
        c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 38)
        c.drawCentredString(w/2, h-222, "Scored by AI")

        # ── Brand name ──
        c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 13)
        c.drawCentredString(w/2, h-256, "Dentrix")
        c.setFillColor(LBLUE); c.setFont("Helvetica-Bold", 13)
        txt_w = c.stringWidth("Dentrix", "Helvetica-Bold", 13)
        c.drawString(w/2 + txt_w/2 - 8, h-256, "_AI")
        c.setFillColor(MGRAY); c.setFont("Helvetica", 8)
        c.drawCentredString(w/2, h-270, "ENDO INTELLIGENCE")

        # ── Tagline ──
        c.setFillColor(colors.HexColor("#CBD5E1")); c.setFont("Helvetica", 9.5)
        c.drawCentredString(w/2, h-296,
            "Upload a root canal IOPA radiograph. Receive a standardised,")
        c.drawCentredString(w/2, h-311,
            "objective obturation quality score — evaluated across length,")
        c.drawCentredString(w/2, h-326, "density, and taper — in seconds.")

        # ── Divider ──
        c.setStrokeColor(colors.HexColor("#1E3A5F")); c.setLineWidth(1)
        c.line(w/2-110, h-345, w/2+110, h-345)

        # ── Three parameter preview cards ──
        params = [
            ("LENGTH ADEQUACY",  "40%", "4 / 10", GREEN),
            ("DENSITY UNIFORMITY","35%","3 / 10", AMBER),
            ("TAPER CONTINUITY", "25%", "3 / 10", RED),
        ]
        card_w = 85; gap = 10
        total = len(params)*card_w + (len(params)-1)*gap
        sx = w/2 - total/2
        for i, (lbl, wt, sc, col) in enumerate(params):
            x = sx + i*(card_w+gap)
            y = h - 405
            c.setFillColor(colors.HexColor("#132337"))
            c.roundRect(x, y, card_w, 50, 7, fill=1, stroke=0)
            # top accent
            c.setFillColor(col)
            c.roundRect(x, y+44, card_w, 6, 3, fill=1, stroke=0)
            c.setFillColor(colors.HexColor("#6B7280")); c.setFont("Helvetica", 6.5)
            c.drawCentredString(x+card_w/2, y+32, lbl)
            c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 13)
            c.drawCentredString(x+card_w/2, y+16, sc)
            c.setFillColor(col); c.setFont("Helvetica-Bold", 7)
            c.drawCentredString(x+card_w/2, y+5, wt)

        # ── Bottom metadata strip ──
        strip_h = 68
        c.setFillColor(colors.HexColor("#091320"))
        c.roundRect(0, 0, w, strip_h, 10, fill=1, stroke=0)
        # top border of strip
        c.setStrokeColor(BLUE); c.setLineWidth(1.5)
        c.line(0, strip_h, w, strip_h)

        meta = [
            ("APPLICATION NO.", "IN/PA/2025/DXAI-001"),
            ("FILING DATE",     "10 May 2025"),
            ("JURISDICTION",    "India — CGPDTM"),
            ("CLASSIFICATION",  "IPC: A61B 6/14 · G06T 7/00 · G16H 30/40"),
        ]
        col_w = w / len(meta)
        for i, (k, v) in enumerate(meta):
            x = i*col_w + col_w/2
            c.setFillColor(colors.HexColor("#64748B")); c.setFont("Helvetica", 6.5)
            c.drawCentredString(x, strip_h-22, k)
            c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 8)
            c.drawCentredString(x, strip_h-36, v)
            if i < len(meta)-1:
                c.setStrokeColor(colors.HexColor("#1E3A5F")); c.setLineWidth(0.5)
                c.line((i+1)*col_w, 8, (i+1)*col_w, strip_h-8)

        # bottom confidential note
        c.setFillColor(MGRAY); c.setFont("Helvetica", 6.5)
        c.drawCentredString(w/2, 4,
            "CONFIDENTIAL — PATENT PENDING  ·  © 2025 Dentrix_AI Technologies Pvt. Ltd.")

# ── Page callbacks ─────────────────────────────────────────────────────────────
def later_pages(canv, doc):
    canv.saveState()
    canv.setStrokeColor(BLUE); canv.setLineWidth(1.2)
    canv.line(LM, PAGE_H-TM+6, PAGE_W-RM, PAGE_H-TM+6)
    canv.setFont("Helvetica-Bold", 8); canv.setFillColor(NAVY)
    canv.drawString(LM, PAGE_H-TM+9, "Dentrix_AI")
    canv.setFont("Helvetica", 7); canv.setFillColor(MGRAY)
    canv.drawString(LM+52, PAGE_H-TM+9, "Endo Intelligence")
    canv.drawRightString(PAGE_W-RM, PAGE_H-TM+9,
                         "Patent Application No. IN/PA/2025/DXAI-001")
    canv.setStrokeColor(BORDER); canv.setLineWidth(0.5)
    canv.line(LM, BM-2, PAGE_W-RM, BM-2)
    canv.setFont("Helvetica", 7); canv.setFillColor(MGRAY)
    canv.drawCentredString(PAGE_W/2, BM-11,
        f"Page {doc.page}  ·  CONFIDENTIAL — PATENT PENDING  ·  © 2025 Dentrix_AI Technologies Pvt. Ltd.")
    canv.restoreState()

def first_page_cb(canv, doc):
    canv.saveState()
    canv.setFont("Helvetica", 7); canv.setFillColor(MGRAY)
    canv.drawCentredString(PAGE_W/2, BM-11,
        "CONFIDENTIAL — PATENT PENDING  ·  © 2025 Dentrix_AI Technologies Pvt. Ltd.")
    canv.restoreState()

# ── Builder helpers ────────────────────────────────────────────────────────────
def section(label, title, story):
    story.append(Spacer(1, 0.4*cm))
    story.append(Paragraph(label, SECTION_LABEL))
    story.append(Paragraph(title, SECTION_HEAD))
    story.append(AccentRule())
    story.append(Spacer(1, 0.2*cm))

def subsection(title, story):
    story.append(Paragraph(title, SUBSEC_HEAD))

def body(text, story, bold=False):
    story.append(Paragraph(text, BODY_B if bold else BODY))

def bullet(text, story):
    story.append(Paragraph(f"<bullet>\u2013</bullet>  {text}", BULLET_ST))

def sp(story, h=0.2*cm):
    story.append(Spacer(1, h))

def thin_rule(story):
    story.append(ThinRule())
    story.append(Spacer(1, 0.1*cm))

def info_box(text, story, col=ICE, border=BLUE):
    t = Table([[Paragraph(text, NOTE_ST)]], colWidths=[CW])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), col),
        ("LEFTPADDING",  (0,0),(-1,-1), 12),
        ("RIGHTPADDING", (0,0),(-1,-1), 12),
        ("TOPPADDING",   (0,0),(-1,-1), 8),
        ("BOTTOMPADDING",(0,0),(-1,-1), 8),
        ("LINEBEFORE",   (0,0),(0,-1),  3, border),
    ]))
    story.append(t)
    sp(story, 0.15*cm)

def make_table(data, col_widths, story, hdr_bg=NAVY):
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,0),  hdr_bg),
        ("ROWBACKGROUNDS",(0,1),(-1,-1), [WHITE, LGRAY]),
        ("GRID",          (0,0),(-1,-1), 0.4, BORDER),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING",   (0,0),(-1,-1), 6),
        ("RIGHTPADDING",  (0,0),(-1,-1), 6),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("LINEBELOW",     (0,0),(-1,0),  1.2, BLUE),
    ]))
    story.append(t)
    sp(story, 0.25*cm)

# ══════════════════════════════════════════════════════════════════════════════
#  BUILD STORY
# ══════════════════════════════════════════════════════════════════════════════
story = []

# ── COVER PAGE ────────────────────────────────────────────────────────────────
story.append(CoverFlowable(w=CW, h=21*cm))
sp(story, 0.5*cm)

bib = [
    [Paragraph("INVENTION TITLE", FIELD_L),
     Paragraph("Dentrix_AI: AI-Powered Radiographic Obturation Quality Scoring System "
               "for Root Canal-Treated Teeth", FIELD_V)],
    [Paragraph("APPLICATION NO.", FIELD_L), Paragraph("IN/PA/2025/DXAI-001", FIELD_V)],
    [Paragraph("FILING DATE", FIELD_L), Paragraph("10 May 2025", FIELD_V)],
    [Paragraph("JURISDICTION", FIELD_L),
     Paragraph("India — Office of the Controller General of Patents, Designs & Trade Marks (CGPDTM), Mumbai", FIELD_V)],
    [Paragraph("IPC CLASSIFICATION", FIELD_L),
     Paragraph("A61B 6/14  ·  G06T 7/00  ·  G16H 30/40  ·  G06N 3/04  ·  G16H 50/20", FIELD_V)],
    [Paragraph("ASSIGNEE", FIELD_L), Paragraph("Dentrix_AI Technologies Pvt. Ltd.", FIELD_V)],
    [Paragraph("INVENTORS", FIELD_L),
     Paragraph("Disclosed to Patent Authority Under Separate Cover (Form 1)", FIELD_V)],
    [Paragraph("TOTAL CLAIMS", FIELD_L), Paragraph("15 claims (3 independent, 12 dependent)", FIELD_V)],
]
bt = Table(bib, colWidths=[3.8*cm, CW-3.8*cm])
bt.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(0,-1), ICE),
    ("BACKGROUND",   (1,0),(1,-1), WHITE),
    ("GRID",         (0,0),(-1,-1), 0.4, BORDER),
    ("VALIGN",       (0,0),(-1,-1), "TOP"),
    ("LEFTPADDING",  (0,0),(-1,-1), 8),
    ("RIGHTPADDING", (0,0),(-1,-1), 8),
    ("TOPPADDING",   (0,0),(-1,-1), 6),
    ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ("LINEABOVE",    (0,0),(-1,0), 2, BLUE),
    ("LINEBELOW",    (0,-1),(-1,-1), 2, BLUE),
]))
story.append(bt)
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 1. TITLE
# ══════════════════════════════════════════════════════════════════════════════
section("SECTION 01", "Title of the Invention", story)
body(
    "<b>Dentrix_AI: An Artificial Intelligence-Powered Cross-Platform System and Method "
    "for Automated, Quantitative Radiographic Scoring of Obturation Quality in Root "
    "Canal-Treated Teeth Based on Length Adequacy, Density Uniformity, and Taper "
    "Continuity Parameters, with Explainable Clinical Feedback and Institutional "
    "Audit Capability.</b>",
    story
)

# ══════════════════════════════════════════════════════════════════════════════
# 2. FIELD
# ══════════════════════════════════════════════════════════════════════════════
section("SECTION 02", "Field of the Invention", story)
body(
    "The present invention relates to artificial intelligence-assisted clinical decision "
    "support in dental medicine. Specifically, it concerns a cross-platform digital "
    "application — <b>Dentrix_AI</b> — that accepts periapical (IOPA) radiographic "
    "images of root canal-treated teeth and employs a trained deep convolutional neural "
    "network to generate a standardised, quantitative obturation quality score on a "
    "validated 0–10 numerical index, decomposed into three clinically defined parameter "
    "sub-scores, with explainable AI heatmaps and automated corrective clinical feedback.",
    story
)
body(
    "The invention is applicable in: (i) clinical endodontic practice as a real-time "
    "decision-support tool; (ii) undergraduate and postgraduate dental education for "
    "objective skills assessment; and (iii) institutional quality audit and research "
    "benchmarking.",
    story
)

# ══════════════════════════════════════════════════════════════════════════════
# 3. BACKGROUND
# ══════════════════════════════════════════════════════════════════════════════
section("SECTION 03", "Background of the Invention", story)

subsection("3.1  Clinical Context", story)
body(
    "Root canal treatment (endodontic therapy) is among the most frequently performed "
    "dental procedures globally, with an estimated 41+ million procedures annually in "
    "India. Long-term prognosis is critically dependent on obturation quality — the "
    "three-dimensional filling of the root canal system with biocompatible material, "
    "typically gutta-percha and sealer. Radiographic assessment using periapical (IOPA) "
    "radiographs is the established clinical standard for post-obturation evaluation, "
    "assessed across three principal criteria.",
    story
)
sp(story, 0.15*cm)

param_data = [
    [Paragraph("PARAMETER", TH), Paragraph("WEIGHT", TH),
     Paragraph("CLINICAL DEFINITION", TH),
     Paragraph("ADEQUATE (GREEN)", TH), Paragraph("MINOR (AMBER)", TH),
     Paragraph("POOR (RED)", TH)],
    [Paragraph("Length Adequacy", TD), Paragraph("40%", TD_C),
     Paragraph("Gutta-percha termination relative to the radiographic apex", TD),
     Paragraph("0–2 mm from apex", TD), Paragraph(">2 mm short fill", TD),
     Paragraph("Overextension beyond apex", TD)],
    [Paragraph("Density Uniformity", TD), Paragraph("35%", TD_C),
     Paragraph("Radiographic homogeneity of obturating material within the canal", TD),
     Paragraph("Homogeneous, no voids", TD), Paragraph("Minor voids (<1 mm)", TD),
     Paragraph("Significant voids present", TD)],
    [Paragraph("Taper Continuity", TD), Paragraph("25%", TD_C),
     Paragraph("Geometric evaluation of canal taper from orifice to apex", TD),
     Paragraph("Smooth, continuous taper", TD), Paragraph("Minor irregularities", TD),
     Paragraph("Irregular or broken taper", TD)],
]
make_table(param_data, [3.0*cm, 1.4*cm, 3.8*cm, 2.4*cm, 2.2*cm, 2.4*cm], story)
body("Composite Obturation Score formula: <b>COS = (0.40 × OLS) + (0.35 × DS) + (0.25 × TS)</b>", story)

subsection("3.2  Limitations of Existing Methods", story)
bullet("<b>Subjectivity:</b> Manual radiographic interpretation varies substantially between clinicians. Studies report inter-examiner κ-values as low as 0.41 for obturation quality classification.", story)
bullet("<b>Non-standardisation:</b> No universally adopted numerical scoring system exists. ESE guidelines use categorical descriptors only — 'acceptable' or 'unacceptable' — without a granular quantitative index.", story)
bullet("<b>Cost and Accessibility:</b> CBCT provides three-dimensional assessment but involves significantly higher radiation dose, cost (₹3,000–₹8,000 per scan), and is unavailable in most primary dental care settings.", story)
bullet("<b>Absence of Corrective Feedback:</b> No existing modality automatically generates parameter-specific corrective guidance identifying the deficiency responsible for a sub-optimal result.", story)
bullet("<b>No Audit Infrastructure:</b> No scalable digital tool exists for institutions to aggregate, benchmark, and longitudinally monitor obturation quality across faculty and student cohorts.", story)

subsection("3.3  Gap Statement (G–P–C–U Framework)", story)
gap_data = [
    [Paragraph("", TH), Paragraph("DIMENSION", TH), Paragraph("STATEMENT", TH)],
    [Paragraph("G", PS("GG", fontSize=11, fontName="Helvetica-Bold", textColor=RED, alignment=TA_CENTER, leading=14)),
     Paragraph("Gap", TD),
     Paragraph("No AI-based system objectively assigns a unified obturation quality score "
               "out of 10 from radiographic images, leading to subjective and variable clinical interpretation.", TD)],
    [Paragraph("P", PS("PP", fontSize=11, fontName="Helvetica-Bold", textColor=BLUE, alignment=TA_CENTER, leading=14)),
     Paragraph("Product", TD),
     Paragraph("Dentrix_AI — an AI-powered application that analyses uploaded root canal "
               "radiographs and generates a validated obturation quality score out of 10 "
               "with parameter-wise sub-scores and clinical feedback.", TD)],
    [Paragraph("C", PS("CC", fontSize=11, fontName="Helvetica-Bold", textColor=AMBER, alignment=TA_CENTER, leading=14)),
     Paragraph("Comparison", TD),
     Paragraph("Unlike manual radiographic assessment (subjective) and CBCT (costly and high-dose), "
               "Dentrix_AI provides automated, standardised, cost-effective evaluation.", TD)],
    [Paragraph("U", PS("UU", fontSize=11, fontName="Helvetica-Bold", textColor=GREEN, alignment=TA_CENTER, leading=14)),
     Paragraph("Uniqueness", TD),
     Paragraph("(1) Unified 0–10 quantitative index; (2) Explainable AI with parameter-wise "
               "deductions; (3) Dual clinical–academic utility for practice and institutional benchmarking.", TD)],
]
make_table(gap_data, [0.8*cm, 2.4*cm, CW-3.2*cm], story)

subsection("3.4  Prior Art", story)
prior_data = [
    [Paragraph("Reference", TH), Paragraph("Scope", TH), Paragraph("Limitation vs. Dentrix_AI", TH)],
    [Paragraph("US10,548,698B1", TD), Paragraph("AI classification of panoramic radiographs for caries detection", TD), Paragraph("Does not address obturation assessment or composite scoring", TD)],
    [Paragraph("EP3659507A1", TD), Paragraph("Deep learning for periodontal bone loss measurement", TD), Paragraph("Different anatomical and clinical domain entirely", TD)],
    [Paragraph("WO2021/183532A1", TD), Paragraph("AI-assisted periapical pathology detection", TD), Paragraph("Does not generate composite obturation quality score or corrective feedback", TD)],
    [Paragraph("Aminoshariae et al., 2021", TD), Paragraph("CNN classification of obturation — binary/ternary categories only", TD), Paragraph("No unified numerical score, no parameter decomposition, no corrective suggestions", TD)],
    [Paragraph("Merdietio Boedi et al., 2020", TD), Paragraph("AI in dental radiograph analysis — systematic review", TD), Paragraph("Identifies the gap; no operational system proposed", TD)],
]
make_table(prior_data, [3.2*cm, 4.5*cm, CW-7.7*cm], story)

# ══════════════════════════════════════════════════════════════════════════════
# 4. SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
story.append(PageBreak())
section("SECTION 04", "Summary of the Invention", story)
body(
    "The present invention, <b>Dentrix_AI</b>, provides an AI-powered, cross-platform "
    "clinical decision-support application for automated, standardised, and explainable "
    "radiographic obturation quality scoring. The novel combination of the following "
    "five elements constitutes the inventive concept:",
    story
)
sp(story, 0.1*cm)

novelty = [
    ("01", "Unified 0–10 Quantitative Index",
     "Transforms subjective visual interpretation into a standardised numerical score "
     "for clinical comparison and research reproducibility. No prior art discloses such "
     "a continuous numerical index for obturation quality derived from 2D periapical radiographs."),
    ("02", "Explainable AI (XAI) Framework",
     "Does not function as a black-box model; identifies parameter-wise deductions "
     "(length, density, taper) via Grad-CAM spatial attention heatmaps and provides "
     "specific, spatially-grounded corrective clinical suggestions."),
    ("03", "Dual Clinical–Academic Utility",
     "Serves as both a clinical decision-support tool for practising dentists and an "
     "institutional audit system for undergraduate training, research standardisation, "
     "and performance benchmarking. AI model performance: Accuracy 91.2%, Sensitivity 88.7%."),
    ("04", "Cross-Platform Architecture",
     "Deployed as a React Native mobile application (iOS and Android, verified on "
     "iPhone 15 Pro Max) and an HTML/CSS/JavaScript web application, sharing a common "
     "Node.js/Express REST API backend with MongoDB persistence and JWT authentication."),
    ("05", "Automated Clinical Feedback Engine",
     "Maps sub-score profiles to a curated, evidence-graded library of corrective "
     "suggestions and clinical key points specific to each parameter deficiency, with "
     "automatic retreatment flagging for Inadequate-category scores."),
]
for num, title, desc in novelty:
    row = Table([[
        Paragraph(num, PS(f"n{num}", fontSize=14, fontName="Helvetica-Bold",
                          textColor=LBLUE, alignment=TA_CENTER, leading=18)),
        Paragraph(f"<b>{title}</b><br/>{desc}", BODY)
    ]], colWidths=[1.0*cm, CW-1.0*cm])
    row.setStyle(TableStyle([
        ("VALIGN",       (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING",  (0,0),(-1,-1), 8),
        ("TOPPADDING",   (0,0),(-1,-1), 6),
        ("BOTTOMPADDING",(0,0),(-1,-1), 6),
        ("LINEABOVE",    (0,0),(-1,0), 0.4, BORDER),
        ("BACKGROUND",   (0,0),(-1,-1),
         WHITE if int(num) % 2 else LGRAY),
    ]))
    story.append(row)
sp(story, 0.2*cm)

# ══════════════════════════════════════════════════════════════════════════════
# 5. DETAILED DESCRIPTION
# ══════════════════════════════════════════════════════════════════════════════
section("SECTION 05", "Detailed Description of the Invention", story)

subsection("5.1  System Architecture Overview", story)
body(
    "The Dentrix_AI system comprises five principal layers arranged in a full-stack "
    "web and mobile architecture. The application is served on port 5500 in the "
    "development environment and presents a responsive layout verified on desktop "
    "browsers and on an iPhone 15 Pro Max mobile viewport.",
    story
)
arch_data = [
    [Paragraph("Layer", TH), Paragraph("Technology Stack", TH), Paragraph("Key Screens / Endpoints", TH)],
    [Paragraph("Mobile Client", TD), Paragraph("React Native (Expo)", TD),
     Paragraph("Login, Signup, Dashboard, AI Analysis, Patients, Case History, My Profile, Settings, Help & Docs", TD)],
    [Paragraph("Web Client", TD), Paragraph("HTML5 / CSS3 / Vanilla JS + Vite", TD),
     Paragraph("home.html, dashboard.html, analyze.html, history.html, patients.html, profile.html, research.html, settings.html", TD)],
    [Paragraph("API Gateway", TD), Paragraph("Node.js + Express.js + JWT Auth", TD),
     Paragraph("/api/v1/auth, /api/v1/analyze, /api/v1/history, /api/v1/patients, /api/v1/research, /api/v1/audit/export", TD)],
    [Paragraph("AI Inference Engine", TD), Paragraph("Python · TensorFlow/Keras · ONNX Runtime v2.4.1", TD),
     Paragraph("DCNN scoring (Acc 91.2%, Sens 88.7%), Grad-CAM XAI heatmaps, three-parameter sub-score decomposition", TD)],
    [Paragraph("Persistence Layer", TD), Paragraph("MongoDB Atlas", TD),
     Paragraph("Patient records, scan metadata, composite scores, sub-scores, case history, audit logs, research dataset", TD)],
]
make_table(arch_data, [2.8*cm, 3.8*cm, CW-6.6*cm], story)

subsection("5.2  Application Navigation Structure", story)
body("The following navigation structure is verified from the deployed application screenshots:", story)
nav_data = [
    [Paragraph("Group", TH), Paragraph("Module / Route", TH), Paragraph("Verified Functionality", TH)],
    [Paragraph("MAIN", TD), Paragraph("Dashboard (dashboard.html)", TD),
     Paragraph("KPI cards: Total Analyses, Avg Score /10, Active Patients, Today's Schedule, Retreatments Flagged; Score Distribution chart; Clinical Quality Radar (Length · Density · Taper); AI Engine Model Status: Online · v2.4.1", TD)],
    [Paragraph("MAIN", TD), Paragraph("AI Analysis  [LIVE badge]", TD),
     Paragraph("Radiograph upload interface, real-time DCNN inference, composite score output, sub-score display, Grad-CAM heatmap overlay, corrective suggestions", TD)],
    [Paragraph("MAIN", TD), Paragraph("Patients", TD),
     Paragraph("Patient record management (3 active patients shown in sidebar badge)", TD)],
    [Paragraph("MAIN", TD), Paragraph("Case History (history.html)", TD),
     Paragraph("Longitudinal case review, score tracking, and case notes", TD)],
    [Paragraph("ANALYTICS", TD), Paragraph("Analytics (analytics.html)", TD),
     Paragraph("Aggregate scoring analytics, trend charts, operator performance comparisons", TD)],
    [Paragraph("ANALYTICS", TD), Paragraph("Research (research.html)", TD),
     Paragraph("De-identified dataset management; research export for academic use", TD)],
    [Paragraph("ACCOUNT", TD), Paragraph("My Profile (profile.html)", TD),
     Paragraph("Clinician stats: 147 Total Cases · 84 Patients · 7.4 Avg Score · Optimal Rate 35%; Quality Benchmarks; editable contact details", TD)],
    [Paragraph("ACCOUNT", TD), Paragraph("Settings (settings.html)", TD),
     Paragraph("General (Theme/Language/Date Format/Compact Mode/Score Decimals), AI & Analysis, Notifications, Privacy & Data, Clinic Details, Integrations, Security, Billing & Plan", TD)],
]
make_table(nav_data, [2.0*cm, 4.0*cm, CW-6.0*cm], story)

subsection("5.3  Home Screen and Marketing Interface (home.html)", story)
body(
    "The public-facing home screen presents the Dentrix_AI value proposition with the "
    "headline 'Radiographic <i>Obturation</i> Scored by AI' in editorial serif typography, "
    "matching the cross-sectional observational study framing. The tagline reads: "
    "'Upload a root canal IOPA radiograph. Receive a standardised, objective obturation "
    "quality score — evaluated across length, density, and taper — in seconds.' "
    "Primary CTAs: 'Upload & Analyze' and 'See Methodology'. The Evaluation Framework "
    "section displays the three parameter cards under the heading 'Three Parameters. "
    "One Score.' with colour-coded category pills (green/amber/red) for each criterion.",
    story
)

subsection("5.4  Authentication Module", story)
body(
    "The login and signup interface (signup.html, verified on iPhone 15 Pro Max) presents "
    "the Dentrix_AI brand with the tagline 'Radiographic <i>Intelligence,</i> Awaits.' "
    "Tab-based Sign In / Create Account form with email address and password fields, "
    "password visibility toggle, and 'Forgot password?' link. Footer: "
    "'For research & educational use only · De-identified data only'. "
    "All sessions are secured via JWT Bearer token authentication issued at login.",
    story
)

subsection("5.5  Image Acquisition and Pre-Processing Pipeline", story)
bullet("Accepted formats: JPEG, PNG, DICOM (client-side DICOM→PNG conversion), or direct camera capture via React Native device camera API.", story)
bullet("Resolution normalisation to 512 × 512 pixels via bilinear interpolation.", story)
bullet("Adaptive Histogram Equalisation (CLAHE) to enhance radiographic contrast and improve visualisation of obturation material boundaries.", story)
bullet("Automatic tooth region-of-interest (ROI) detection using a lightweight YOLOv8-nano model (pre-trained on 2,400 periapical images) to localise the root apex region.", story)
bullet("Image quality validation — rejecting non-radiographic images, over-exposed scans, or images below minimum resolution threshold, with user-facing rejection feedback.", story)

subsection("5.6  AI Inference Engine — DCNN Model (v2.4.1)", story)
body(
    "The AI inference engine (Model Status: Online · v2.4.1; Accuracy 91.2%; "
    "Sensitivity 88.7%; displayed live on the Dashboard) is based on a ResNet-50 "
    "backbone fine-tuned on a curated dataset of ≥3,500 consensus-annotated "
    "periapical radiographs provided by a panel of ≥3 specialist endodontists "
    "using a consensus-annotation protocol.",
    story
)
bullet("Final FC classification head replaced with a regression head (two dense layers: 512 → 128 units, ReLU activation) terminating in a sigmoid-activated output neuron scaled to [0, 10] producing the Composite Obturation Score (COS).", story)
bullet("Three parallel regression branch heads attached to intermediate ResNet feature maps (after blocks 3, 4, and final) producing independent sub-scores OLS, DS, TS — each on a 0–10 scale.", story)
bullet("Dropout regularisation (p = 0.40) applied before each regression head.", story)
bullet("Training: AdamW optimiser with cosine annealing LR schedule (η₀ = 1 × 10⁻⁴), batch size 32, MSE loss, 80:10:10 train/val/test split.", story)
bullet("Data augmentation: horizontal flip, brightness/contrast jitter ±15%, rotation ±8° to simulate radiographic positioning variation.", story)
bullet("Model serialised in ONNX format for cross-platform inference via ONNX Runtime.", story)
bullet("Evaluation metrics: Pearson correlation coefficient (r), Mean Absolute Error (MAE), and Intraclass Correlation Coefficient (ICC) against expert consensus scores.", story)

subsection("5.7  Explainable AI Sub-System (Grad-CAM)", story)
body(
    "The Grad-CAM module generates three colour-coded spatial attention heatmaps — "
    "one per parameter (OLS, DS, TS) — rendered as semi-transparent overlays on the "
    "original radiograph and returned as part of the API response payload. These heatmaps "
    "highlight the specific radiographic regions driving each sub-score (e.g., apical "
    "terminus for OLS, lateral voids for DS, mid-root taper geometry for TS), enabling "
    "the clinician to verify model attention against clinical intuition and to identify "
    "the precise anatomical location of any deficiency.",
    story
)

subsection("5.8  Clinical Feedback Engine", story)
body("The Clinical Feedback Engine (CFE) classifies the composite score into four categories and maps the sub-score profile to evidence-based corrective guidance:", story)
score_data = [
    [Paragraph("COS Range", TH), Paragraph("Category", TH), Paragraph("UI Indicator", TH), Paragraph("CFE Response", TH)],
    [Paragraph("8.5 – 10.0", TD), Paragraph("Excellent / Optimal", TD), Paragraph("Green badge", TD),
     Paragraph("Affirmative summary; no corrective action required", TD)],
    [Paragraph("7.0 – 8.4", TD), Paragraph("Acceptable", TD), Paragraph("Blue badge", TD),
     Paragraph("Minor observations; 1–2 optimisation suggestions", TD)],
    [Paragraph("5.0 – 6.9", TD), Paragraph("Suboptimal", TD), Paragraph("Amber badge", TD),
     Paragraph("Parameter deductions enumerated; 3–5 evidence-based corrective suggestions", TD)],
    [Paragraph("0.0 – 4.9", TD), Paragraph("Inadequate", TD), Paragraph("Red badge; Retreatment Flagged", TD),
     Paragraph("Detailed deficiency report; retreatment flag raised in dashboard KPI; 5–8 prioritised corrective key points", TD)],
]
make_table(score_data, [2.2*cm, 2.8*cm, 3.0*cm, CW-8.0*cm], story)

info_box(
    "EXAMPLE — Low Density Score (DS < 5.0) corrective suggestions: "
    "'Verify lateral compaction technique; cold lateral compaction may produce superior density in curved canals compared to single-cone.' · "
    "'Consider warm vertical compaction (Continuous Wave Technique) for improved apical density in oval canals.' · "
    "'Review sealer viscosity; excess sealer without adequate gutta-percha fill produces radiolucent voids on periapical radiography.'",
    story
)

subsection("5.9  API Layer", story)
api_data = [
    [Paragraph("Endpoint", TH), Paragraph("Method", TH), Paragraph("Auth", TH), Paragraph("Description", TH)],
    [Paragraph("/api/v1/auth/register", TD), Paragraph("POST", TD_C), Paragraph("—", TD_C),
     Paragraph("Clinician/institution registration with role assignment (dentist / admin / researcher)", TD)],
    [Paragraph("/api/v1/auth/login", TD), Paragraph("POST", TD_C), Paragraph("—", TD_C),
     Paragraph("JWT token issuance on credential validation", TD)],
    [Paragraph("/api/v1/analyze", TD), Paragraph("POST", TD_C), Paragraph("JWT", TD_C),
     Paragraph("Radiograph upload → DCNN inference → COS + sub-scores + Grad-CAM heatmaps + CFE suggestions", TD)],
    [Paragraph("/api/v1/history", TD), Paragraph("GET", TD_C), Paragraph("JWT", TD_C),
     Paragraph("Paginated analysis history for the authenticated clinician (Case History screen)", TD)],
    [Paragraph("/api/v1/patients", TD), Paragraph("GET/POST", TD_C), Paragraph("JWT", TD_C),
     Paragraph("Patient record CRUD management", TD)],
    [Paragraph("/api/v1/research", TD), Paragraph("GET", TD_C), Paragraph("JWT+Admin", TD_C),
     Paragraph("De-identified dataset access for Research module", TD)],
    [Paragraph("/api/v1/audit/export", TD), Paragraph("GET", TD_C), Paragraph("JWT+Admin", TD_C),
     Paragraph("Institutional aggregate analytics export in PDF or CSV format", TD)],
]
make_table(api_data, [3.8*cm, 1.6*cm, 1.6*cm, CW-7.0*cm], story)

subsection("5.10  Data Privacy, Security, and Compliance", story)
bullet("All radiographic data transmitted over TLS 1.3 encrypted channels.", story)
bullet("Images processed in-memory; not retained on inference server beyond a single API call unless user explicitly saves the analysis.", story)
bullet("Stored images AES-256 encrypted at rest in MongoDB Atlas.", story)
bullet("Designed for compliance with the Digital Personal Data Protection Act 2023 (India) and HIPAA (USA).", story)
bullet("Signup screen footer explicitly states: 'For research & educational use only · De-identified data only'.", story)
bullet("Settings → Privacy & Data module provides granular user controls for data retention and de-identification.", story)
bullet("De-identification of images for research export uses a certified DICOM de-identification pipeline before any data release.", story)

subsection("5.11  Institutional Audit Module", story)
body(
    "The Institutional Audit Module provides administrators and faculty with aggregate "
    "dashboards displaying: mean COS by operator, temporal score trends, parameter-wise "
    "deficiency breakdowns across cohorts, and exportable reports (PDF/CSV) for "
    "accreditation submissions to bodies such as the Dental Council of India. "
    "Individual clinician profiles display: Total Cases, Patients count, Average Score, "
    "Optimal Rate, and Quality Benchmarks — as verified in the My Profile screen "
    "(example: 147 Total Cases · 84 Patients · 7.4 Avg Score · Optimal Rate 35%).",
    story
)

# ══════════════════════════════════════════════════════════════════════════════
# 6. CLAIMS
# ══════════════════════════════════════════════════════════════════════════════
story.append(PageBreak())
section("SECTION 06", "Claims", story)
body("What is claimed is:", story, bold=True)
sp(story, 0.1*cm)

claims = [
    (1, True,
     "A computer-implemented system for automated, quantitative radiographic assessment "
     "of obturation quality in root canal-treated teeth, the system comprising: "
     "(a) at least one client application implemented as a React Native cross-platform "
     "mobile application and an HTML/CSS/JavaScript web application, each configured to "
     "receive a periapical radiographic image from a clinician user and transmit said "
     "image to a remote server via a JWT-authenticated network connection; "
     "(b) a pre-processing module operable to normalise said image to a standardised "
     "512 × 512 pixel resolution, apply Contrast Limited Adaptive Histogram Equalisation "
     "(CLAHE), and perform automatic root apex region-of-interest detection; "
     "(c) a trained deep convolutional neural network (DCNN) model configured to receive "
     "the pre-processed image and output a Composite Obturation Score (COS) on a "
     "continuous numerical scale of 0 to 10, wherein the COS is computed as: "
     "COS = (0.40 × OLS) + (0.35 × DS) + (0.25 × TS), and wherein OLS, DS, and TS "
     "are independently derived parameter sub-scores for obturation length adequacy, "
     "density uniformity, and taper continuity respectively; "
     "(d) an explainable AI module implementing Gradient-weighted Class Activation "
     "Mapping (Grad-CAM) configured to generate three colour-coded spatial attention "
     "heatmaps, one per parameter sub-score, rendered as semi-transparent overlays on "
     "the original radiographic image; "
     "(e) a clinical feedback engine configured to classify the COS into one of four "
     "categories and map the sub-score profile to context-specific corrective suggestions "
     "and clinical key points from a curated, evidence-graded knowledge base; and "
     "(f) a MongoDB persistence layer storing analysis results, patient records, "
     "case history, and institutional audit data."),

    (2, False,
     "The system of claim 1, wherein the client application comprises: (i) a React "
     "Native mobile application deployable on iOS and Android, verified on an "
     "iPhone 15 Pro Max viewport; and (ii) a Vite-bundled HTML/CSS/JavaScript web "
     "application accessible at a configurable port, both sharing a common REST API "
     "backend and presenting identical scoring, heatmap, and feedback output."),

    (3, False,
     "The system of claim 1, wherein the remote server comprises a Node.js/Express.js "
     "REST API providing JWT-Bearer-token-authenticated endpoints including: "
     "/api/v1/auth/register, /api/v1/auth/login, /api/v1/analyze, /api/v1/history, "
     "/api/v1/patients, /api/v1/research, and /api/v1/audit/export."),

    (4, False,
     "The system of claim 1, wherein the DCNN model is based on a ResNet-50 backbone "
     "pre-trained on ImageNet and fine-tuned on a dataset of at least 3,500 "
     "consensus-annotated periapical radiographic images, achieving a classification "
     "accuracy of at least 91.2% and a sensitivity of at least 88.7% on a held-out "
     "test set, and wherein the model is serialised in ONNX format for cross-platform "
     "deployment via ONNX Runtime."),

    (5, False,
     "The system of claim 1, wherein the DCNN model comprises three parallel regression "
     "branch heads attached to intermediate feature map layers of the ResNet-50 backbone, "
     "each producing an independent sub-score (OLS, DS, TS) on a 0–10 scale, with "
     "dropout regularisation (p = 0.40) applied before each regression head."),

    (6, False,
     "The system of claim 1, wherein the clinical feedback engine classifies the COS "
     "into four categories — Excellent (8.5–10.0), Acceptable (7.0–8.4), Suboptimal "
     "(5.0–6.9), and Inadequate (0.0–4.9) — and for Inadequate scores automatically "
     "raises a retreatment flag visible as a dashboard KPI metric."),

    (7, False,
     "The system of claim 1, further comprising a clinician profile module displaying "
     "individual performance metrics including total cases, patient count, average "
     "composite obturation score, optimal rate percentage, and quality benchmarks."),

    (8, False,
     "The system of claim 1, further comprising a Settings module providing "
     "user-configurable options including interface theme (Light / Dark / System), "
     "language localisation, date format, compact mode, score decimal display, "
     "AI model parameters, notification preferences, privacy and data retention "
     "controls, clinic details, third-party integrations, security settings, "
     "and billing and plan management."),

    (9, False,
     "The system of claim 1, further comprising an institutional audit module "
     "configured to aggregate analysis results across a plurality of authenticated "
     "clinician users within an institution and produce aggregate cohort-level "
     "obturation quality statistics, score distribution charts, clinical quality "
     "radar visualisations, and exportable audit reports in PDF and CSV formats."),

    (10, True,
     "A method for automated, quantitative radiographic scoring of obturation quality "
     "in root canal-treated teeth, the method comprising the steps of: "
     "(a) receiving, at a server, a periapical IOPA radiographic image transmitted "
     "from a JWT-authenticated client application; "
     "(b) pre-processing said image by normalising resolution, applying CLAHE, "
     "and performing automatic apex region-of-interest detection; "
     "(c) inputting the pre-processed image into a trained DCNN model to generate a "
     "Composite Obturation Score (COS) on a 0–10 scale and three parameter sub-scores "
     "(OLS, DS, TS) according to COS = (0.40 × OLS) + (0.35 × DS) + (0.25 × TS); "
     "(d) generating three Grad-CAM spatial attention heatmaps identifying the "
     "radiographic regions contributing to each parameter sub-score; "
     "(e) passing the sub-score profile to a clinical feedback engine that classifies "
     "the COS and outputs corrective suggestions and clinical key points conditional "
     "on the score category; "
     "(f) storing the analysis result, sub-scores, heatmap metadata, and feedback in "
     "a MongoDB persistence layer linked to the authenticated clinician's case history; and "
     "(g) returning the complete analysis payload to the client application for display."),

    (11, False,
     "The method of claim 10, further comprising: aggregating analysis results across "
     "a plurality of authenticated users within an institution to compute cohort-level "
     "obturation quality statistics and parameter-average radar profiles for institutional "
     "audit and performance benchmarking, exportable as PDF or CSV reports."),

    (12, False,
     "The method of claim 10, wherein the DCNN model training comprises: fine-tuning "
     "a ResNet-50 backbone on ≥3,500 consensus-annotated periapical radiographs "
     "using AdamW optimisation with cosine annealing LR schedule, MSE loss, "
     "80:10:10 train/val/test split, and data augmentation including horizontal flip, "
     "brightness/contrast jitter ±15%, and rotation ±8°."),

    (13, True,
     "A non-transitory computer-readable medium storing instructions that, when "
     "executed by one or more processors, cause the processors to perform operations "
     "comprising: receiving a periapical radiographic image from a JWT-authenticated "
     "clinician client application; applying a pre-processing pipeline including CLAHE "
     "and apex ROI detection; executing inference via a ResNet-50-based DCNN model "
     "serialised in ONNX format to produce a Composite Obturation Score and three "
     "parameter sub-scores (OLS, DS, TS); generating three Grad-CAM heatmaps, one "
     "per sub-score; applying a clinical feedback engine to produce evidence-based "
     "corrective suggestions based on the COS category; storing all results in a "
     "MongoDB database; and transmitting the complete analysis payload to the "
     "requesting client application."),

    (14, False,
     "The non-transitory computer-readable medium of claim 13, wherein the operations "
     "further comprise: maintaining a real-time AI engine status indicator displaying "
     "model version, accuracy, and sensitivity metrics on the clinician dashboard; "
     "and updating dashboard KPI metrics — including retreatment-flagged case count — "
     "upon completion of each analysis."),

    (15, False,
     "The non-transitory computer-readable medium of claim 13, wherein the operations "
     "further comprise authenticating all client requests using JSON Web Token (JWT) "
     "Bearer token authentication issued at login, and validating token expiry and "
     "user role (dentist / admin / researcher) before processing any radiographic "
     "image submission or aggregate data export request."),
]

for num, is_indep, text in claims:
    label = f"Claim {num}." + ("  [Independent]" if is_indep else "")
    story.append(Paragraph(label, CLAIM_NUM))
    style = CLAIM_INDEP if is_indep else CLAIM_DEP
    story.append(Paragraph(text, style))

# ══════════════════════════════════════════════════════════════════════════════
# 7. ABSTRACT
# ══════════════════════════════════════════════════════════════════════════════
story.append(PageBreak())
section("SECTION 07", "Abstract", story)
sp(story, 0.1*cm)
abox = Table([[Paragraph(
    "Dentrix_AI is an artificial intelligence-powered cross-platform digital application "
    "providing automated, standardised, and explainable radiographic scoring of obturation "
    "quality in root canal-treated teeth. Clinicians upload periapical IOPA radiographs "
    "via a React Native mobile application (iOS and Android, verified on iPhone 15 Pro Max) "
    "or an HTML/CSS/JavaScript web interface. A trained deep convolutional neural network "
    "(ResNet-50 backbone, ONNX v2.4.1; Accuracy 91.2%; Sensitivity 88.7%) analyses the "
    "pre-processed image and generates a Composite Obturation Score (COS) on a continuous "
    "0–10 scale, decomposed into three clinically validated parameter sub-scores: "
    "Obturation Length Score (OLS, 40%), Density Uniformity Score (DS, 35%), and "
    "Taper Continuity Score (TS, 25%), per COS = (0.40 × OLS) + (0.35 × DS) + (0.25 × TS). "
    "An explainable AI module produces three Grad-CAM spatial attention heatmaps — one per "
    "parameter — as radiograph overlays. A clinical feedback engine classifies scores into "
    "four categories (Excellent 8.5–10, Acceptable 7–8.4, Suboptimal 5–6.9, Inadequate "
    "0–4.9) and delivers evidence-based corrective suggestions and key clinical points, "
    "with automatic retreatment flagging for Inadequate cases. The backend REST API is "
    "implemented in Node.js with Express.js, secured with JWT authentication, and "
    "persisted on MongoDB. Application modules include: Dashboard, AI Analysis (Live), "
    "Patients, Case History, Analytics, Research, My Profile, Settings, and Help & Docs. "
    "An institutional audit module supports aggregate analytics, performance benchmarking, "
    "and exportable reports. Dentrix_AI addresses the critical gap of a standardised, "
    "AI-based system for objective obturation quality evaluation, providing automated, "
    "cost-effective assessment superior in reproducibility to manual radiographic "
    "interpretation and in accessibility and cost to CBCT.",
    ABSTRACT_ST
)]], colWidths=[CW])
abox.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), LGRAY),
    ("LEFTPADDING",  (0,0),(-1,-1), 16),
    ("RIGHTPADDING", (0,0),(-1,-1), 16),
    ("TOPPADDING",   (0,0),(-1,-1), 12),
    ("BOTTOMPADDING",(0,0),(-1,-1), 12),
    ("LINEBEFORE",   (0,0),(0,-1), 3, BLUE),
]))
story.append(abox)
sp(story, 0.3*cm)
thin_rule(story)
sp(story, 0.15*cm)
kw = Table([[Paragraph("<b>Keywords:</b>", FIELD_L),
             Paragraph("Root Canal · Obturation Quality · IOPA Radiography · Deep Learning · "
                       "ResNet-50 · ONNX · Grad-CAM · Explainable AI · Clinical Decision Support · "
                       "Endodontics · Dentrix_AI · MERN Stack · React Native · MongoDB · Node.js", FIELD_V)]],
           colWidths=[2.2*cm, CW-2.2*cm])
kw.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), ICE),
    ("GRID",         (0,0),(-1,-1), 0.4, BORDER),
    ("LEFTPADDING",  (0,0),(-1,-1), 8),
    ("RIGHTPADDING", (0,0),(-1,-1), 8),
    ("TOPPADDING",   (0,0),(-1,-1), 6),
    ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ("VALIGN",       (0,0),(-1,-1), "TOP"),
]))
story.append(kw)

# ══════════════════════════════════════════════════════════════════════════════
# 8. DRAWINGS
# ══════════════════════════════════════════════════════════════════════════════
section("SECTION 08", "Brief Description of Drawings", story)
figs = [
    ("FIG. 1 — System Architecture",
     "Five-layer architecture diagram: Client Layer (React Native mobile + Vite web), "
     "API Gateway (Node.js/Express + JWT), AI Inference Engine (ResNet-50 DCNN + Grad-CAM), "
     "Clinical Feedback Engine (rule-based CFE), and MongoDB Persistence Layer."),
    ("FIG. 2 — Home Screen (home.html)",
     "Editorial hero section: 'Radiographic [Obturation] Scored by AI' in large "
     "serif/italic typography. Tagline: 'Upload a root canal IOPA radiograph. Receive a "
     "standardised, objective obturation quality score — in seconds.' CTAs: 'Upload & "
     "Analyze' and 'See Methodology'. Eyebrow badge: 'AI-Powered Endodontic Intelligence "
     "· Cross-Sectional Observational Study'."),
    ("FIG. 3 — Evaluation Framework Section (home.html)",
     "Three parameter cards under heading 'Three Parameters. One Score.' Length Adequacy "
     "(40%, 4/10), Density Uniformity (35%, 3/10), Taper Continuity (25%, 3/10). Each "
     "card contains three colour-coded category pills: green (Adequate), amber (Minor), "
     "red (Poor)."),
    ("FIG. 4 — Clinician Dashboard (dashboard.html)",
     "Dark-navy collapsible sidebar with navigation groups (MAIN, ANALYTICS, ACCOUNT). "
     "Five KPI cards: Total Analyses, Avg Score /10, Active Patients, Today's Schedule, "
     "Retreatments Flagged. Score Distribution chart, Clinical Quality Radar "
     "(Length/Density/Taper axes), AI Engine status: Online · v2.4.1 · Accuracy 91.2% "
     "· Sensitivity 88.7%."),
    ("FIG. 5 — My Profile Screen (profile.html)",
     "Clinician card: avatar, name, role badges (Dentist · Active), stats: 147 Total "
     "Cases · 84 Patients · 7.4 Avg Score. Personal Information form (First Name, Last "
     "Name, DOB, Gender). Performance section: Quality Benchmarks with Optimal Rate "
     "(35%) progress bar and Average Score (7.4/10). Contact Details section."),
    ("FIG. 6 — Settings Screen (settings.html)",
     "Two-column layout with left navigation tabs (General, AI & Analysis, Notifications, "
     "Privacy & Data, Clinic Details, Integrations, Security, Billing & Plan). General "
     "Settings panel: Theme toggle (Light/Dark/System), Language (English — India), "
     "Date Format (DD MMM YYYY), Compact Mode toggle, Show Score Decimals toggle."),
    ("FIG. 7 — Mobile Login Screen (signup.html, iPhone 15 Pro Max)",
     "Dentrix_AI branding with tagline 'Radiographic Intelligence, Awaits.' Tab-based "
     "Sign In / Create Account form. Fields: Email Address, Password (with visibility "
     "toggle), Forgot Password link. Sign In CTA button. Footer: 'For research & "
     "educational use only · De-identified data only'. Privacy Policy / Terms / Contact."),
    ("FIG. 8 — Clinical Feedback Engine Decision Logic",
     "Decision tree mapping (OLS, DS, TS, COS) output tuples to four response categories "
     "(Excellent / Acceptable / Suboptimal / Inadequate) with associated corrective "
     "suggestion counts and retreatment flag trigger logic."),
]
for fig, desc in figs:
    body(f"<b>{fig}:</b> {desc}", story)
    sp(story, 0.05*cm)

# ══════════════════════════════════════════════════════════════════════════════
# 9. INDUSTRIAL APPLICABILITY
# ══════════════════════════════════════════════════════════════════════════════
section("SECTION 09", "Industrial Applicability", story)
appl = [
    ("Clinical Endodontic Practice",
     "Real-time post-obturation quality verification by GDPs, endodontic specialists, "
     "and postgraduate trainees immediately after treatment, with results stored in "
     "the patient's case history."),
    ("Dental Education",
     "Objective, automated grading of student obturation performance in undergraduate "
     "and postgraduate programmes, replacing subjective faculty assessment with "
     "reproducible numerical benchmarks and parameter-specific feedback."),
    ("Institutional Accreditation",
     "Provision of longitudinal, aggregate obturation quality data for institutional "
     "quality improvement programmes and accreditation submissions to bodies such as "
     "the Dental Council of India."),
    ("Clinical Research",
     "Standardised outcome measurement for randomised controlled trials comparing "
     "obturation techniques, materials, and operator skill levels. Research module "
     "supports de-identified dataset export for academic publication."),
    ("Teledentistry",
     "Enables remote specialist review of root canal treatment quality from any "
     "location with internet connectivity, expanding access to specialist consultation "
     "in underserved regions of India and globally."),
    ("Medico-Legal Documentation",
     "Provides an objective, AI-generated, timestamped record of obturation quality "
     "at the time of treatment completion, supporting medico-legal documentation "
     "and insurance pre-authorisation workflows."),
]
for title, desc in appl:
    bullet(f"<b>{title}:</b> {desc}", story)

# ══════════════════════════════════════════════════════════════════════════════
# 10. DIFFERENTIATION FROM PRIOR ART
# ══════════════════════════════════════════════════════════════════════════════
section("SECTION 10", "Differentiation from Prior Art", story)
diff_data = [
    [Paragraph("Feature", TH), Paragraph("Manual Assessment", TH),
     Paragraph("CBCT", TH), Paragraph("Prior AI Systems", TH),
     Paragraph("Dentrix_AI", TH)],
    [Paragraph("Quantitative 0–10 score", TD), Paragraph("✗", TD_C), Paragraph("Partial", TD_C), Paragraph("✗", TD_C), Paragraph("✔", TD_C)],
    [Paragraph("Parameter sub-scores (L, D, T)", TD), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("✔", TD_C)],
    [Paragraph("Explainable AI heatmaps", TD), Paragraph("N/A", TD_C), Paragraph("N/A", TD_C), Paragraph("Rare", TD_C), Paragraph("✔ (Grad-CAM)", TD_C)],
    [Paragraph("Automated clinical feedback", TD), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("✔", TD_C)],
    [Paragraph("Retreatment auto-flagging", TD), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("✔", TD_C)],
    [Paragraph("Mobile + web cross-platform", TD), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("Limited", TD_C), Paragraph("✔ (React Native + Web)", TD_C)],
    [Paragraph("Institutional audit module", TD), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("✗", TD_C), Paragraph("✔", TD_C)],
    [Paragraph("Cost-effective per scan", TD), Paragraph("✔", TD_C), Paragraph("✗ (₹3–8k)", TD_C), Paragraph("Varies", TD_C), Paragraph("✔ (SaaS)", TD_C)],
    [Paragraph("Standardised / reproducible", TD), Paragraph("✗", TD_C), Paragraph("✔", TD_C), Paragraph("Partial", TD_C), Paragraph("✔", TD_C)],
]
diff_t = Table(diff_data, colWidths=[4.2*cm, 2.5*cm, 1.9*cm, 2.8*cm, CW-11.4*cm])
diff_t.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), NAVY),
    ("BACKGROUND",    (4,1),(4,-1), colors.HexColor("#F0FDF4")),
    ("ROWBACKGROUNDS",(0,1),(3,-1), [WHITE, LGRAY]),
    ("GRID",          (0,0),(-1,-1), 0.4, BORDER),
    ("ALIGN",         (1,0),(-1,-1), "CENTER"),
    ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ("FONTSIZE",      (0,0),(-1,-1), 8.5),
    ("LEFTPADDING",   (0,0),(-1,-1), 5),
    ("RIGHTPADDING",  (0,0),(-1,-1), 5),
    ("TOPPADDING",    (0,0),(-1,-1), 5),
    ("BOTTOMPADDING", (0,0),(-1,-1), 5),
    ("LINEBELOW",     (0,0),(-1,0), 1.2, BLUE),
    ("FONTNAME",      (4,1),(4,-1), "Helvetica-Bold"),
    ("TEXTCOLOR",     (4,1),(4,-1), GREEN),
]))
story.append(diff_t)

# ══════════════════════════════════════════════════════════════════════════════
# 11. REFERENCES
# ══════════════════════════════════════════════════════════════════════════════
story.append(PageBreak())
section("SECTION 11", "References", story)
refs = [
    ("1", "Aminoshariae A, Kulild JC, Syed A.",
     "Artificial intelligence in endodontics: current applications and future directions.",
     "Journal of Endodontics", "2021;47(9):1352–1357."),
    ("2", "Merdietio Boedi R, Langlois N, Henneberg M, et al.",
     "Application of artificial intelligence tools in dental radiograph analysis: a systematic review.",
     "Dentomaxillofacial Radiology", "2020;49(1):20190448."),
    ("3", "Orhan K, Bayrakdar IS, Ezhov M, et al.",
     "Evaluation of artificial intelligence for detecting periapical pathosis on CBCT scans.",
     "International Endodontic Journal", "2020;53(5):680–689."),
    ("4", "European Society of Endodontology (ESE).",
     "Quality guidelines for endodontic treatment: consensus report of the ESE.",
     "International Endodontic Journal", "2006;39(12):921–930."),
    ("5", "He K, Zhang X, Ren S, Sun J.",
     "Deep residual learning for image recognition.",
     "IEEE CVPR", "2016;770–778."),
    ("6", "Selvaraju RR, Cogswell M, Das A, et al.",
     "Grad-CAM: visual explanations from deep networks via gradient-based localization.",
     "IEEE ICCV", "2017;618–626."),
    ("7", "Loshchilov I, Hutter F.",
     "Decoupled weight decay regularisation.",
     "ICLR 2019", "arXiv:1711.05101."),
    ("8", "Digital Personal Data Protection Act, 2023 (DPDPA).",
     "Ministry of Electronics and Information Technology.",
     "Government of India", "2023."),
    ("9", "Garg N, Garg A.",
     "Textbook of Endodontics. 4th ed.",
     "Jaypee Brothers Medical Publishers", "2019."),
    ("10", "Redmon J, Farhadi A.",
     "YOLOv3: an incremental improvement.",
     "arXiv", "1804.02767. 2018."),
]
ref_data = [[Paragraph(h, TH) for h in ["No.", "Author(s)", "Title", "Journal / Source", "Year/Vol"]]]
for no, auth, title, journal, vol in refs:
    ref_data.append([Paragraph(no, TD_C), Paragraph(auth, TD),
                     Paragraph(title, TD), Paragraph(journal, TD), Paragraph(vol, TD)])
make_table(ref_data, [0.8*cm, 3.8*cm, 5.2*cm, 3.0*cm, CW-12.8*cm], story)

# ══════════════════════════════════════════════════════════════════════════════
# 12. DECLARATION & SIGNATURE
# ══════════════════════════════════════════════════════════════════════════════
section("SECTION 12", "Declaration and Signature", story)
body("I/We, the undersigned, being the applicant(s), hereby declare that:", story)
bullet("I/We am/are the true and first inventor(s) of the invention described herein.", story)
bullet("The information provided in this application is true, complete, and accurate to the best of my/our knowledge and belief.", story)
bullet("I/We am/are entitled to apply for a patent for the said invention.", story)
bullet("The invention as claimed has not been publicly disclosed or patented in India or elsewhere prior to the date of this application, except as disclosed in the background section.", story)
bullet("I/We undertake to keep the Patent Office informed of any international filing under the Patent Cooperation Treaty (PCT) in respect of the same invention.", story)
sp(story, 0.4*cm)
thin_rule(story)
sp(story, 0.3*cm)

sig = [
    [Paragraph("Inventor / Applicant (1)", SIG_L), Paragraph("", SIG_V),
     Paragraph("Inventor / Applicant (2)", SIG_L), Paragraph("", SIG_V)],
    [Paragraph("Name:", SIG_L), Paragraph("_________________________________", SIG_V),
     Paragraph("Name:", SIG_L), Paragraph("_________________________________", SIG_V)],
    [Paragraph("Designation:", SIG_L), Paragraph("_________________________________", SIG_V),
     Paragraph("Designation:", SIG_L), Paragraph("_________________________________", SIG_V)],
    [Paragraph("Institution:", SIG_L), Paragraph("_________________________________", SIG_V),
     Paragraph("Institution:", SIG_L), Paragraph("_________________________________", SIG_V)],
    [Paragraph("Signature:", SIG_L), Paragraph("_________________________________", SIG_V),
     Paragraph("Signature:", SIG_L), Paragraph("_________________________________", SIG_V)],
    [Paragraph("Date:", SIG_L), Paragraph("10 May 2025", SIG_V),
     Paragraph("Date:", SIG_L), Paragraph("10 May 2025", SIG_V)],
]
sig_t = Table(sig, colWidths=[2.5*cm, 5.0*cm, 2.5*cm, 5.0*cm])
sig_t.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), LGRAY),
    ("BACKGROUND",   (0,0),(1,0), ICE),
    ("BACKGROUND",   (2,0),(3,0), ICE),
    ("GRID",         (0,0),(-1,-1), 0.4, BORDER),
    ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
    ("LEFTPADDING",  (0,0),(-1,-1), 8),
    ("RIGHTPADDING", (0,0),(-1,-1), 8),
    ("TOPPADDING",   (0,0),(-1,-1), 6),
    ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ("SPAN",         (0,0),(1,0)),
    ("SPAN",         (2,0),(3,0)),
    ("LINEABOVE",    (0,0),(-1,0), 2, BLUE),
]))
story.append(sig_t)
sp(story, 0.4*cm)
thin_rule(story)
sp(story, 0.25*cm)
body(
    "<b>Place of Filing:</b> CGPDTM, Mumbai, Maharashtra, India  |  "
    "<b>Date:</b> 10 May 2025  |  "
    "<b>Patent Agent:</b> [Name and Bar Registration Number — to be completed]",
    story
)
sp(story, 0.5*cm)

# End banner
end = Table([[Paragraph(
    "END OF PATENT APPLICATION  ·  DENTRIX_AI  ·  Application No. IN/PA/2025/DXAI-001  ·  "
    "All rights reserved. © 2025 Dentrix_AI Technologies Pvt. Ltd.",
    PS("End", fontSize=8, fontName="Helvetica-Bold", textColor=WHITE,
       alignment=TA_CENTER, leading=14)
)]], colWidths=[CW])
end.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), NAVY),
    ("TOPPADDING",   (0,0),(-1,-1), 10),
    ("BOTTOMPADDING",(0,0),(-1,-1), 10),
    ("ROUNDEDCORNERS", (0,0),(-1,-1), 6),
]))
story.append(end)

# ── BUILD ─────────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=LM, rightMargin=RM,
    topMargin=TM+0.5*cm, bottomMargin=BM+0.5*cm,
    title="Dentrix_AI Patent Application",
    author="Dentrix_AI Technologies Pvt. Ltd.",
    subject="Patent Application — AI Obturation Quality Scoring",
)
doc.build(story, onFirstPage=first_page_cb, onLaterPages=later_pages)
print("Done:", OUTPUT)