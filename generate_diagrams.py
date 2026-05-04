"""
CattleAI - Diagram Generator
Generates: Level 0 DFD, 3 ER Diagrams, and Application Flow Diagram
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe
import numpy as np
import os

OUTPUT_DIR = "diagrams"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─────────────────────────────────────────────
# COLOR PALETTE
# ─────────────────────────────────────────────
BG       = "#0f172a"
CARD     = "#1e293b"
BORDER   = "#334155"
GREEN    = "#10b981"
BLUE     = "#3b82f6"
PURPLE   = "#8b5cf6"
YELLOW   = "#f59e0b"
RED      = "#ef4444"
TEAL     = "#14b8a6"
TEXT     = "#f1f5f9"
SUBTEXT  = "#94a3b8"

def styled_box(ax, x, y, w, h, label, sublabel="", color=GREEN, fontsize=11):
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                         boxstyle="round,pad=0.04",
                         linewidth=2, edgecolor=color,
                         facecolor=CARD, zorder=3)
    ax.add_patch(box)
    ax.text(x, y + (0.08 if sublabel else 0), label,
            ha='center', va='center', fontsize=fontsize,
            fontweight='bold', color=TEXT, zorder=4)
    if sublabel:
        ax.text(x, y - 0.18, sublabel,
                ha='center', va='center', fontsize=8,
                color=SUBTEXT, zorder=4)

def arrow(ax, x1, y1, x2, y2, label="", color=SUBTEXT, lw=1.5):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>", color=color,
                                lw=lw, connectionstyle="arc3,rad=0.0"),
                zorder=5)
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx, my + 0.06, label, ha='center', va='bottom',
                fontsize=7.5, color=SUBTEXT, zorder=6,
                bbox=dict(boxstyle='round,pad=0.2', fc=BG, ec='none', alpha=0.8))

def ext_entity(ax, x, y, label, color=YELLOW):
    box = FancyBboxPatch((x - 0.55, y - 0.22), 1.1, 0.44,
                         boxstyle="round,pad=0.04",
                         linewidth=2.5, edgecolor=color,
                         facecolor="#1c1f2e", zorder=3)
    ax.add_patch(box)
    ax.text(x, y, label, ha='center', va='center',
            fontsize=10, fontweight='bold', color=color, zorder=4)

def process_circle(ax, x, y, r, label, sublabel="", color=GREEN):
    circle = plt.Circle((x, y), r, color=CARD, ec=color, lw=2.5, zorder=3)
    ax.add_patch(circle)
    ax.text(x, y + (0.06 if sublabel else 0), label,
            ha='center', va='center', fontsize=9,
            fontweight='bold', color=TEXT, zorder=4)
    if sublabel:
        ax.text(x, y - 0.14, sublabel, ha='center', va='center',
                fontsize=7, color=SUBTEXT, zorder=4)

def datastore(ax, x, y, w, h, label, color=BLUE):
    # Open rectangle (datastore symbol)
    rect = plt.Rectangle((x - w/2, y - h/2), w, h,
                          linewidth=0, facecolor=CARD, zorder=3)
    ax.add_patch(rect)
    ax.plot([x - w/2, x + w/2], [y + h/2, y + h/2], color=color, lw=2, zorder=4)
    ax.plot([x - w/2, x + w/2], [y - h/2, y - h/2], color=color, lw=2, zorder=4)
    ax.text(x, y, label, ha='center', va='center',
            fontsize=9, fontweight='bold', color=color, zorder=5)


# ═══════════════════════════════════════════════════════════════
# DIAGRAM 1 — LEVEL 0 DFD (Context Diagram)
# ═══════════════════════════════════════════════════════════════
def draw_level0_dfd():
    fig, ax = plt.subplots(figsize=(16, 10))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')

    ax.text(5, 6.6, "Level 0 DFD — CattleAI Breed Recognition System",
            ha='center', va='center', fontsize=16, fontweight='bold',
            color=TEXT)
    ax.text(5, 6.3, "Context Diagram  |  All external entities and the central system",
            ha='center', va='center', fontsize=10, color=SUBTEXT)

    # Central process
    big_circle = plt.Circle((5, 3.4), 1.35, color=CARD, ec=GREEN, lw=3, zorder=3)
    ax.add_patch(big_circle)
    ax.text(5, 3.6, "CattleAI", ha='center', va='center',
            fontsize=13, fontweight='bold', color=GREEN, zorder=4)
    ax.text(5, 3.25, "Breed Recognition", ha='center', va='center',
            fontsize=9, color=SUBTEXT, zorder=4)
    ax.text(5, 2.95, "System", ha='center', va='center',
            fontsize=9, color=SUBTEXT, zorder=4)

    # External entities
    ext_entity(ax, 1.1, 5.5, "User /\nFarmer", YELLOW)
    ext_entity(ax, 8.9, 5.5, "AI Service\n(Flask/TF)", PURPLE)
    ext_entity(ax, 1.1, 1.3, "MongoDB\nDatabase", BLUE)
    ext_entity(ax, 8.9, 1.3, "Google Maps\nAPI", TEAL)

    # Arrows: User → System
    arrow(ax, 1.65, 5.5, 3.65, 4.3, "Cattle Image Upload", YELLOW, 1.8)
    arrow(ax, 1.65, 5.2, 3.65, 3.9, "Login / Register", YELLOW, 1.8)
    # System → User
    arrow(ax, 3.65, 3.1, 1.65, 1.7, "Breed Result + PDF Report", GREEN, 1.8)
    arrow(ax, 3.65, 3.4, 1.65, 5.1, "Prediction + Confidence", GREEN, 1.8)

    # System → AI Service
    arrow(ax, 6.35, 4.3, 8.35, 5.2, "Image Bytes (multipart)", PURPLE, 1.8)
    # AI Service → System
    arrow(ax, 8.35, 4.9, 6.35, 3.9, "Breed, Confidence, Top3,\nHeatmap, Quality", PURPLE, 1.8)

    # System → MongoDB
    arrow(ax, 3.65, 2.8, 1.65, 1.6, "Save Prediction Record", BLUE, 1.8)
    arrow(ax, 1.65, 1.0, 3.65, 2.6, "User Auth / History", BLUE, 1.8)

    # System → Maps
    arrow(ax, 6.35, 2.8, 8.35, 1.6, "Geolocation Request", TEAL, 1.8)
    arrow(ax, 8.35, 1.0, 6.35, 2.6, "Nearby Vet Clinics", TEAL, 1.8)

    # Legend
    legend_items = [
        mpatches.Patch(color=YELLOW, label='User / Farmer'),
        mpatches.Patch(color=PURPLE, label='AI Service (Flask)'),
        mpatches.Patch(color=BLUE,   label='MongoDB Database'),
        mpatches.Patch(color=TEAL,   label='Google Maps API'),
        mpatches.Patch(color=GREEN,  label='CattleAI System'),
    ]
    ax.legend(handles=legend_items, loc='lower center', ncol=5,
              facecolor=CARD, edgecolor=BORDER, labelcolor=TEXT,
              fontsize=9, framealpha=0.9,
              bbox_to_anchor=(0.5, -0.02))

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "1_level0_dfd.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor=BG)
    plt.close()
    print(f"✅ Saved: {path}")


# ═══════════════════════════════════════════════════════════════
# DIAGRAM 2 — ER DIAGRAM 1: User & Prediction (Core)
# ═══════════════════════════════════════════════════════════════
def draw_er_user_prediction():
    fig, ax = plt.subplots(figsize=(16, 10))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(7, 8.6, "ER Diagram 1 — User & Prediction Entities",
            ha='center', fontsize=16, fontweight='bold', color=TEXT)
    ax.text(7, 8.25, "Core data model: authentication and breed prediction records",
            ha='center', fontsize=10, color=SUBTEXT)

    def entity_box(cx, cy, title, attrs, color, w=3.2, row_h=0.38):
        h = row_h * (len(attrs) + 1) + 0.1
        # Header
        hdr = FancyBboxPatch((cx - w/2, cy - row_h/2), w, row_h,
                             boxstyle="round,pad=0.02",
                             linewidth=0, facecolor=color, zorder=3)
        ax.add_patch(hdr)
        ax.text(cx, cy, title, ha='center', va='center',
                fontsize=11, fontweight='bold', color='white', zorder=4)
        # Body
        body = FancyBboxPatch((cx - w/2, cy - row_h/2 - row_h * len(attrs)),
                              w, row_h * len(attrs),
                              boxstyle="round,pad=0.02",
                              linewidth=2, edgecolor=color,
                              facecolor=CARD, zorder=3)
        ax.add_patch(body)
        for i, (attr, pk) in enumerate(attrs):
            ay = cy - row_h * (i + 1)
            style = 'bold' if pk else 'normal'
            prefix = "🔑 " if pk == 'PK' else ("🔗 " if pk == 'FK' else "   ")
            ax.text(cx - w/2 + 0.15, ay, f"{prefix}{attr}",
                    ha='left', va='center', fontsize=8.5,
                    fontweight=style, color=TEXT if pk else SUBTEXT, zorder=4)
            if i < len(attrs) - 1:
                ax.plot([cx - w/2 + 0.1, cx + w/2 - 0.1],
                        [ay - row_h/2, ay - row_h/2],
                        color=BORDER, lw=0.5, zorder=4)
        return cy - row_h/2, cy - row_h/2 - row_h * len(attrs)

    # USER entity  (left)
    user_attrs = [
        ("_id (ObjectId)", "PK"),
        ("username : String", ""),
        ("email : String", ""),
        ("password : String (hashed)", ""),
        ("role : String [user|admin]", ""),
        ("createdAt : Date", ""),
    ]
    entity_box(3.5, 6.5, "USER", user_attrs, "#1d4ed8")

    # PREDICTION entity (right)
    pred_attrs = [
        ("_id (ObjectId)", "PK"),
        ("userId : ObjectId", "FK"),
        ("imageName : String", ""),
        ("imageUrl : String", ""),
        ("breed : String", ""),
        ("confidence : Number", ""),
        ("top3 : Array[{breed,score}]", ""),
        ("imageHash : String", ""),
        ("heatmapUrl : String", ""),
        ("createdAt : Date", ""),
    ]
    entity_box(8.5, 6.5, "PREDICTION", pred_attrs, "#7c3aed")

    # METADATA embedded (inside Prediction)
    meta_attrs = [
        ("origin : String", ""),
        ("milkProduction : String", ""),
        ("characteristics : String", ""),
        ("description : String", ""),
    ]
    entity_box(11.8, 3.2, "METADATA\n(embedded)", meta_attrs, "#0f766e", w=2.8)

    # IMAGE_QUALITY embedded
    iq_attrs = [
        ("animal_detected : Boolean", ""),
        ("lighting_sufficient : Boolean", ""),
        ("background_clutter : Boolean", ""),
    ]
    entity_box(5.2, 2.0, "IMAGE_QUALITY\n(embedded)", iq_attrs, "#b45309", w=3.0)

    # Relationship line: User → Prediction (1 to many)
    ax.annotate("", xy=(6.9, 5.8), xytext=(5.1, 5.8),
                arrowprops=dict(arrowstyle="-|>", color=GREEN, lw=2), zorder=5)
    ax.text(6.0, 5.95, "MAKES", ha='center', fontsize=9,
            fontweight='bold', color=GREEN, zorder=6)
    ax.text(5.2, 5.65, "1", fontsize=11, fontweight='bold', color=YELLOW)
    ax.text(6.7, 5.65, "N", fontsize=11, fontweight='bold', color=YELLOW)

    # Prediction → Metadata (composition)
    ax.plot([10.1, 11.2], [4.5, 4.0], color=TEAL, lw=1.5, ls='--', zorder=5)
    ax.text(10.7, 4.35, "has", ha='center', fontsize=8, color=TEAL)

    # Prediction → ImageQuality (composition)
    ax.plot([7.5, 6.7], [4.0, 2.8], color=YELLOW, lw=1.5, ls='--', zorder=5)
    ax.text(7.2, 3.5, "has", ha='center', fontsize=8, color=YELLOW)

    # Legend
    legend_items = [
        mpatches.Patch(color="#1d4ed8", label='User Entity'),
        mpatches.Patch(color="#7c3aed", label='Prediction Entity'),
        mpatches.Patch(color="#0f766e", label='Metadata (embedded)'),
        mpatches.Patch(color="#b45309", label='ImageQuality (embedded)'),
    ]
    ax.legend(handles=legend_items, loc='lower left',
              facecolor=CARD, edgecolor=BORDER, labelcolor=TEXT,
              fontsize=9, framealpha=0.9)

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "2_er_user_prediction.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor=BG)
    plt.close()
    print(f"✅ Saved: {path}")


# ═══════════════════════════════════════════════════════════════
# DIAGRAM 3 — ER DIAGRAM 2: Breed Knowledge Model
# ═══════════════════════════════════════════════════════════════
def draw_er_breed_knowledge():
    fig, ax = plt.subplots(figsize=(16, 10))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(7, 8.6, "ER Diagram 2 — Breed Knowledge & Encyclopedia Model",
            ha='center', fontsize=16, fontweight='bold', color=TEXT)
    ax.text(7, 8.25, "Static knowledge base: breeds, species types, and XAI decision factors",
            ha='center', fontsize=10, color=SUBTEXT)

    def entity_box(cx, cy, title, attrs, color, w=3.4, row_h=0.38):
        hdr = FancyBboxPatch((cx - w/2, cy - row_h/2), w, row_h,
                             boxstyle="round,pad=0.02",
                             linewidth=0, facecolor=color, zorder=3)
        ax.add_patch(hdr)
        ax.text(cx, cy, title, ha='center', va='center',
                fontsize=11, fontweight='bold', color='white', zorder=4)
        body = FancyBboxPatch((cx - w/2, cy - row_h/2 - row_h * len(attrs)),
                              w, row_h * len(attrs),
                              boxstyle="round,pad=0.02",
                              linewidth=2, edgecolor=color,
                              facecolor=CARD, zorder=3)
        ax.add_patch(body)
        for i, (attr, pk) in enumerate(attrs):
            ay = cy - row_h * (i + 1)
            prefix = "🔑 " if pk == 'PK' else ("🔗 " if pk == 'FK' else "   ")
            ax.text(cx - w/2 + 0.15, ay, f"{prefix}{attr}",
                    ha='left', va='center', fontsize=8.5,
                    fontweight='bold' if pk else 'normal',
                    color=TEXT if pk else SUBTEXT, zorder=4)
            if i < len(attrs) - 1:
                ax.plot([cx - w/2 + 0.1, cx + w/2 - 0.1],
                        [ay - row_h/2, ay - row_h/2],
                        color=BORDER, lw=0.5, zorder=4)

    # SPECIES entity
    species_attrs = [
        ("speciesId : String", "PK"),
        ("name : String [Buffalo|Cow|Goat]", ""),
        ("description : String", ""),
    ]
    entity_box(2.5, 7.2, "SPECIES", species_attrs, "#0369a1", w=3.6)

    # BREED entity (center)
    breed_attrs = [
        ("breedId : String", "PK"),
        ("speciesId : String", "FK"),
        ("name : String", ""),
        ("origin : String", ""),
        ("milkProduction : String", ""),
        ("characteristics : String", ""),
        ("description : String", ""),
    ]
    entity_box(7, 6.8, "BREED", breed_attrs, "#15803d", w=3.6)

    # XAI_FACTOR entity
    xai_attrs = [
        ("factorId : String", "PK"),
        ("breedId : String", "FK"),
        ("summary : String", ""),
        ("point1 : String", ""),
        ("point2 : String", ""),
        ("point3 : String", ""),
        ("point4 : String", ""),
    ]
    entity_box(11.5, 6.8, "XAI_FACTOR", xai_attrs, "#7c3aed", w=3.2)

    # PREDICTION_RESULT entity (bottom center)
    result_attrs = [
        ("resultId : ObjectId", "PK"),
        ("breedId : String", "FK"),
        ("userId : ObjectId", "FK"),
        ("confidence : Number", ""),
        ("rank : Number [1|2|3]", ""),
        ("createdAt : Date", ""),
    ]
    entity_box(7, 2.8, "PREDICTION_RESULT", result_attrs, "#b45309", w=3.6)

    # Relationships
    # Species → Breed (1:N)
    ax.annotate("", xy=(5.2, 6.5), xytext=(4.3, 6.5),
                arrowprops=dict(arrowstyle="-|>", color=GREEN, lw=2), zorder=5)
    ax.text(4.75, 6.65, "CLASSIFIES", ha='center', fontsize=8, fontweight='bold', color=GREEN)
    ax.text(4.35, 6.35, "1", fontsize=11, fontweight='bold', color=YELLOW)
    ax.text(5.1, 6.35, "N", fontsize=11, fontweight='bold', color=YELLOW)

    # Breed → XAI_Factor (1:1)
    ax.annotate("", xy=(9.85, 6.5), xytext=(8.8, 6.5),
                arrowprops=dict(arrowstyle="-|>", color=PURPLE, lw=2), zorder=5)
    ax.text(9.3, 6.65, "HAS XAI", ha='center', fontsize=8, fontweight='bold', color=PURPLE)
    ax.text(8.85, 6.35, "1", fontsize=11, fontweight='bold', color=YELLOW)
    ax.text(9.75, 6.35, "1", fontsize=11, fontweight='bold', color=YELLOW)

    # Breed → PredictionResult (1:N)
    ax.annotate("", xy=(7, 4.1), xytext=(7, 4.9),
                arrowprops=dict(arrowstyle="-|>", color=TEAL, lw=2), zorder=5)
    ax.text(7.3, 4.5, "PRODUCES", ha='left', fontsize=8, fontweight='bold', color=TEAL)
    ax.text(7.1, 4.95, "1", fontsize=11, fontweight='bold', color=YELLOW)
    ax.text(7.1, 4.15, "N", fontsize=11, fontweight='bold', color=YELLOW)

    # Note box
    note = FancyBboxPatch((0.3, 0.3), 5.5, 1.2,
                          boxstyle="round,pad=0.1",
                          linewidth=1.5, edgecolor=BORDER,
                          facecolor="#1e293b", zorder=3)
    ax.add_patch(note)
    ax.text(3.05, 1.2, "📝  Implementation Note",
            ha='center', fontsize=9, fontweight='bold', color=YELLOW, zorder=4)
    ax.text(3.05, 0.85, "BREED and XAI_FACTOR are stored as in-memory\nPython dicts in predict_api.py (no separate DB collection).",
            ha='center', fontsize=8.5, color=SUBTEXT, zorder=4)

    legend_items = [
        mpatches.Patch(color="#0369a1", label='Species'),
        mpatches.Patch(color="#15803d", label='Breed'),
        mpatches.Patch(color="#7c3aed", label='XAI Factor'),
        mpatches.Patch(color="#b45309", label='Prediction Result'),
    ]
    ax.legend(handles=legend_items, loc='lower right',
              facecolor=CARD, edgecolor=BORDER, labelcolor=TEXT,
              fontsize=9, framealpha=0.9)

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "3_er_breed_knowledge.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor=BG)
    plt.close()
    print(f"✅ Saved: {path}")


# ═══════════════════════════════════════════════════════════════
# DIAGRAM 4 — ER DIAGRAM 3: Full System Relationships
# ═══════════════════════════════════════════════════════════════
def draw_er_full_system():
    fig, ax = plt.subplots(figsize=(18, 11))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10)
    ax.axis('off')

    ax.text(9, 9.6, "ER Diagram 3 — Full System Entity Relationship Overview",
            ha='center', fontsize=16, fontweight='bold', color=TEXT)
    ax.text(9, 9.25, "Complete view of all entities, attributes, and relationships across the CattleAI platform",
            ha='center', fontsize=10, color=SUBTEXT)

    def entity_box(cx, cy, title, attrs, color, w=3.2, row_h=0.36):
        hdr = FancyBboxPatch((cx - w/2, cy - row_h/2), w, row_h,
                             boxstyle="round,pad=0.02",
                             linewidth=0, facecolor=color, zorder=3)
        ax.add_patch(hdr)
        ax.text(cx, cy, title, ha='center', va='center',
                fontsize=10, fontweight='bold', color='white', zorder=4)
        body = FancyBboxPatch((cx - w/2, cy - row_h/2 - row_h * len(attrs)),
                              w, row_h * len(attrs),
                              boxstyle="round,pad=0.02",
                              linewidth=2, edgecolor=color,
                              facecolor=CARD, zorder=3)
        ax.add_patch(body)
        for i, (attr, pk) in enumerate(attrs):
            ay = cy - row_h * (i + 1)
            prefix = "🔑 " if pk == 'PK' else ("🔗 " if pk == 'FK' else "   ")
            ax.text(cx - w/2 + 0.12, ay, f"{prefix}{attr}",
                    ha='left', va='center', fontsize=7.8,
                    fontweight='bold' if pk else 'normal',
                    color=TEXT if pk else SUBTEXT, zorder=4)
            if i < len(attrs) - 1:
                ax.plot([cx - w/2 + 0.08, cx + w/2 - 0.08],
                        [ay - row_h/2, ay - row_h/2],
                        color=BORDER, lw=0.4, zorder=4)

    # USER
    entity_box(2.2, 8.0, "USER", [
        ("_id : ObjectId", "PK"),
        ("username : String", ""),
        ("email : String", ""),
        ("password : String", ""),
        ("role : String", ""),
        ("createdAt : Date", ""),
    ], "#1d4ed8", w=3.0)

    # PREDICTION
    entity_box(7.5, 8.2, "PREDICTION", [
        ("_id : ObjectId", "PK"),
        ("userId : ObjectId", "FK"),
        ("imageName : String", ""),
        ("imageUrl : String", ""),
        ("breed : String", ""),
        ("confidence : Number", ""),
        ("imageHash : String", ""),
        ("heatmapUrl : String", ""),
        ("createdAt : Date", ""),
    ], "#7c3aed", w=3.2)

    # METADATA (embedded in Prediction)
    entity_box(12.5, 8.0, "METADATA\n(embedded)", [
        ("origin : String", ""),
        ("milkProduction : String", ""),
        ("characteristics : String", ""),
        ("description : String", ""),
        ("type : String", ""),
    ], "#0f766e", w=3.0)

    # IMAGE_QUALITY (embedded in Prediction)
    entity_box(7.5, 3.5, "IMAGE_QUALITY\n(embedded)", [
        ("animal_detected : Boolean", ""),
        ("lighting_sufficient : Boolean", ""),
        ("background_clutter : Boolean", ""),
        ("brightness : Number", ""),
        ("blur_score : Number", ""),
    ], "#b45309", w=3.2)

    # TOP3 (embedded array in Prediction)
    entity_box(12.5, 4.5, "TOP3_RESULT\n(array, embedded)", [
        ("breed : String", ""),
        ("score : Number", ""),
        ("rank : Number [1-3]", ""),
    ], "#be185d", w=3.0)

    # BREED_KNOWLEDGE (in-memory)
    entity_box(2.2, 3.8, "BREED_KNOWLEDGE\n(in-memory)", [
        ("breedName : String", "PK"),
        ("type : String", ""),
        ("origin : String", ""),
        ("milkProduction : String", ""),
        ("characteristics : String", ""),
        ("description : String", ""),
    ], "#15803d", w=3.2)

    # XAI_FACTORS (in-memory)
    entity_box(2.2, 1.0, "XAI_FACTORS\n(in-memory)", [
        ("breedName : String", "PK"),
        ("summary : String", ""),
        ("points : Array[String]", ""),
    ], "#9333ea", w=3.2)

    # ── Relationships ──
    # User → Prediction (1:N)
    ax.annotate("", xy=(5.85, 7.5), xytext=(3.7, 7.5),
                arrowprops=dict(arrowstyle="-|>", color=GREEN, lw=2), zorder=5)
    ax.text(4.75, 7.65, "MAKES  1:N", ha='center', fontsize=8, fontweight='bold', color=GREEN)

    # Prediction → Metadata (1:1 composition)
    ax.annotate("", xy=(11.0, 7.2), xytext=(9.1, 7.2),
                arrowprops=dict(arrowstyle="-|>", color=TEAL, lw=1.8, linestyle='dashed'), zorder=5)
    ax.text(10.05, 7.38, "CONTAINS  1:1", ha='center', fontsize=8, color=TEAL)

    # Prediction → ImageQuality (1:1 composition)
    ax.annotate("", xy=(7.5, 4.85), xytext=(7.5, 5.85),
                arrowprops=dict(arrowstyle="-|>", color=YELLOW, lw=1.8, linestyle='dashed'), zorder=5)
    ax.text(7.9, 5.35, "CONTAINS  1:1", ha='left', fontsize=8, color=YELLOW)

    # Prediction → Top3 (1:1 composition)
    ax.annotate("", xy=(11.0, 5.5), xytext=(9.1, 6.5),
                arrowprops=dict(arrowstyle="-|>", color=RED, lw=1.8, linestyle='dashed'), zorder=5)
    ax.text(10.2, 6.2, "CONTAINS  1:3", ha='center', fontsize=8, color=RED)

    # Prediction → BreedKnowledge (lookup)
    ax.annotate("", xy=(3.8, 5.5), xytext=(5.9, 6.5),
                arrowprops=dict(arrowstyle="-|>", color=SUBTEXT, lw=1.5, linestyle='dotted'), zorder=5)
    ax.text(4.7, 6.2, "LOOKS UP", ha='center', fontsize=8, color=SUBTEXT)

    # BreedKnowledge → XAI (1:1)
    ax.annotate("", xy=(2.2, 2.3), xytext=(2.2, 2.9),
                arrowprops=dict(arrowstyle="-|>", color=PURPLE, lw=1.8), zorder=5)
    ax.text(2.6, 2.6, "HAS  1:1", ha='left', fontsize=8, color=PURPLE)

    # Legend
    legend_items = [
        mpatches.Patch(color="#1d4ed8", label='User (MongoDB)'),
        mpatches.Patch(color="#7c3aed", label='Prediction (MongoDB)'),
        mpatches.Patch(color="#0f766e", label='Metadata (embedded)'),
        mpatches.Patch(color="#b45309", label='ImageQuality (embedded)'),
        mpatches.Patch(color="#be185d", label='Top3 (embedded array)'),
        mpatches.Patch(color="#15803d", label='BreedKnowledge (in-memory)'),
        mpatches.Patch(color="#9333ea", label='XAI Factors (in-memory)'),
    ]
    ax.legend(handles=legend_items, loc='lower center', ncol=4,
              facecolor=CARD, edgecolor=BORDER, labelcolor=TEXT,
              fontsize=8.5, framealpha=0.9,
              bbox_to_anchor=(0.5, -0.02))

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "4_er_full_system.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor=BG)
    plt.close()
    print(f"✅ Saved: {path}")


# ═══════════════════════════════════════════════════════════════
# DIAGRAM 5 — APPLICATION FLOW DIAGRAM
# ═══════════════════════════════════════════════════════════════
def draw_app_flow():
    fig, ax = plt.subplots(figsize=(18, 22))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 22)
    ax.axis('off')

    ax.text(9, 21.5, "Application Flow Diagram — CattleAI",
            ha='center', fontsize=18, fontweight='bold', color=TEXT)
    ax.text(9, 21.1, "End-to-end request flow from user action to breed prediction result",
            ha='center', fontsize=11, color=SUBTEXT)

    # ── Helper: flow box ──
    def fbox(cx, cy, label, sublabel="", color=GREEN, w=3.6, h=0.55):
        box = FancyBboxPatch((cx - w/2, cy - h/2), w, h,
                             boxstyle="round,pad=0.06",
                             linewidth=2, edgecolor=color,
                             facecolor=CARD, zorder=3)
        ax.add_patch(box)
        ax.text(cx, cy + (0.1 if sublabel else 0), label,
                ha='center', va='center', fontsize=9.5,
                fontweight='bold', color=TEXT, zorder=4)
        if sublabel:
            ax.text(cx, cy - 0.14, sublabel, ha='center', va='center',
                    fontsize=7.5, color=SUBTEXT, zorder=4)

    def diamond(cx, cy, label, color=YELLOW, w=2.2, h=0.7):
        pts = np.array([[cx, cy+h/2], [cx+w/2, cy], [cx, cy-h/2], [cx-w/2, cy]])
        poly = plt.Polygon(pts, closed=True, facecolor=CARD,
                           edgecolor=color, linewidth=2, zorder=3)
        ax.add_patch(poly)
        ax.text(cx, cy, label, ha='center', va='center',
                fontsize=8.5, fontweight='bold', color=color, zorder=4)

    def farrow(x1, y1, x2, y2, label="", color=SUBTEXT):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="-|>", color=color, lw=1.8), zorder=5)
        if label:
            mx, my = (x1+x2)/2, (y1+y2)/2
            ax.text(mx + 0.1, my, label, ha='left', va='center',
                    fontsize=7.5, color=SUBTEXT, zorder=6,
                    bbox=dict(boxstyle='round,pad=0.15', fc=BG, ec='none', alpha=0.85))

    def lane_bg(x, y, w, h, label, color):
        rect = FancyBboxPatch((x, y), w, h,
                              boxstyle="round,pad=0.1",
                              linewidth=1.5, edgecolor=color,
                              facecolor=color + "18", zorder=1, alpha=0.5)
        ax.add_patch(rect)
        ax.text(x + 0.25, y + h/2, label, ha='left', va='center',
                fontsize=9, fontweight='bold', color=color,
                rotation=90, zorder=2)

    # ── Swim lanes ──
    lane_bg(0.1,  0.3, 3.5, 20.4, "CLIENT (React)", BLUE)
    lane_bg(3.8,  0.3, 4.8, 20.4, "NODE.JS SERVER", GREEN)
    lane_bg(8.8,  0.3, 4.8, 20.4, "FLASK AI SERVICE", PURPLE)
    lane_bg(13.8, 0.3, 3.9, 20.4, "MONGODB", YELLOW)

    # ── FLOW STEPS ──

    # 1. User opens app
    fbox(1.9, 20.2, "1. User Opens App", "Browser loads React SPA", BLUE)
    farrow(1.9, 19.92, 1.9, 19.3)

    # 2. Auth check
    diamond(1.9, 19.0, "Token in\nlocalStorage?", YELLOW)
    # Yes → Dashboard
    ax.annotate("", xy=(1.9, 18.3), xytext=(1.9, 18.65),
                arrowprops=dict(arrowstyle="-|>", color=GREEN, lw=1.8), zorder=5)
    ax.text(2.05, 18.5, "Yes", fontsize=8, color=GREEN)
    # No → Login
    ax.annotate("", xy=(3.5, 19.0), xytext=(3.0, 19.0),
                arrowprops=dict(arrowstyle="-|>", color=RED, lw=1.8), zorder=5)
    ax.text(3.05, 19.1, "No", fontsize=8, color=RED)

    # 3. Login / Register
    fbox(1.9, 18.0, "3. Login / Register", "POST /api/auth/login", BLUE)
    farrow(1.9, 17.72, 6.2, 17.72, "Credentials", BLUE)
    fbox(6.2, 17.72, "Validate User\n+ bcrypt compare", "", GREEN, w=4.2)
    farrow(6.2, 17.44, 6.2, 16.9, "", GREEN)
    fbox(6.2, 16.6, "Sign JWT (7d)", "Return token + user", GREEN, w=4.2)
    farrow(6.2, 16.32, 1.9, 16.32, "JWT Token", GREEN)
    fbox(1.9, 16.0, "Store token in\nlocalStorage", "", BLUE)
    farrow(1.9, 15.72, 1.9, 15.1)

    # 4. Dashboard
    fbox(1.9, 14.8, "4. Dashboard Loads", "Fetch /api/prediction/history", BLUE)
    farrow(1.9, 14.52, 6.2, 14.52, "GET + JWT header", BLUE)
    fbox(6.2, 14.52, "Auth Middleware\nVerify JWT", "", GREEN, w=4.2)
    farrow(6.2, 14.24, 15.8, 14.24, "Query userId", GREEN)
    fbox(15.8, 14.24, "Find Predictions\nby userId", "", YELLOW, w=3.5)
    farrow(15.8, 13.96, 6.2, 13.96, "History Array", YELLOW)
    farrow(6.2, 13.68, 1.9, 13.68, "JSON Response", GREEN)
    fbox(1.9, 13.4, "Render Stats Cards\n+ History", "", BLUE)
    farrow(1.9, 13.12, 1.9, 12.5)

    # 5. Image Upload
    fbox(1.9, 12.2, "5. User Selects Image", "Canvas auto-enhance\n(contrast/saturation)", BLUE)
    farrow(1.9, 11.82, 1.9, 11.2)
    fbox(1.9, 10.9, "POST /api/prediction/predict", "multipart/form-data + JWT", BLUE)
    farrow(1.9, 10.62, 6.2, 10.62, "Image file", BLUE)

    # 6. Node.js processes
    fbox(6.2, 10.62, "Multer saves image\nto /uploads/", "", GREEN, w=4.2)
    farrow(6.2, 10.34, 6.2, 9.8)
    fbox(6.2, 9.5, "MD5 hash check\n(duplicate detection)", "", GREEN, w=4.2)
    farrow(6.2, 9.22, 15.8, 9.22, "findOne imageHash", GREEN)
    fbox(15.8, 9.22, "MongoDB\nHash Lookup", "", YELLOW, w=3.5)
    farrow(15.8, 8.94, 6.2, 8.94, "Exists / Not found", YELLOW)
    farrow(6.2, 8.66, 6.2, 8.1)

    # 7. Forward to AI
    fbox(6.2, 7.8, "Forward image to\nFlask AI Service", "POST localhost:8000/predict", GREEN, w=4.2)
    farrow(6.2, 7.52, 11.2, 7.52, "Image bytes", GREEN)

    # 8. AI Pipeline
    fbox(11.2, 7.52, "MobileNetV2\nAnimal Validation", "Reject non-livestock", PURPLE, w=4.2)
    farrow(11.2, 7.24, 11.2, 6.7)
    fbox(11.2, 6.4, "Image Quality\nAnalysis", "Brightness + blur check", PURPLE, w=4.2)
    farrow(11.2, 6.12, 11.2, 5.6)
    fbox(11.2, 5.3, "CNN Model Predict\n(MobileNetV2 fine-tuned)", "Top-3 breeds + scores", PURPLE, w=4.2)
    farrow(11.2, 5.02, 11.2, 4.5)
    fbox(11.2, 4.2, "Grad-CAM Heatmap\nGeneration", "Visual explanation overlay", PURPLE, w=4.2)
    farrow(11.2, 3.92, 11.2, 3.4)
    fbox(11.2, 3.1, "Return JSON\n{breed, confidence, top3,\nheatmap, quality}", "", PURPLE, w=4.2)
    farrow(11.2, 2.72, 6.2, 2.72, "Prediction result", PURPLE)

    # 9. Save to DB
    fbox(6.2, 2.72, "Save Prediction\nto MongoDB", "New Prediction document", GREEN, w=4.2)
    farrow(6.2, 2.44, 15.8, 2.44, "Insert document", GREEN)
    fbox(15.8, 2.44, "MongoDB\nInsert", "", YELLOW, w=3.5)
    farrow(15.8, 2.16, 6.2, 2.16, "Saved doc", YELLOW)
    farrow(6.2, 1.88, 1.9, 1.88, "Full result JSON", GREEN)

    # 10. Render result
    fbox(1.9, 1.6, "10. Render Result", "Breed card, confidence,\nXAI factors, heatmap", BLUE)

    # ── Terminator ──
    end_box = FancyBboxPatch((0.7, 0.5), 2.4, 0.5,
                             boxstyle="round,pad=0.1",
                             linewidth=2, edgecolor=GREEN,
                             facecolor=GREEN + "33", zorder=3)
    ax.add_patch(end_box)
    ax.text(1.9, 0.75, "✅  Flow Complete", ha='center', va='center',
            fontsize=9, fontweight='bold', color=GREEN, zorder=4)
    farrow(1.9, 1.32, 1.9, 1.0)

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "5_app_flow.png")
    plt.savefig(path, dpi=150, bbox_inches='tight', facecolor=BG)
    plt.close()
    print(f"✅ Saved: {path}")


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("\n🚀 Generating CattleAI Diagrams...\n")
    draw_level0_dfd()
    draw_er_user_prediction()
    draw_er_breed_knowledge()
    draw_er_full_system()
    draw_app_flow()
    print(f"\n✅ All 5 diagrams saved to ./{OUTPUT_DIR}/")
    print("   1_level0_dfd.png")
    print("   2_er_user_prediction.png")
    print("   3_er_breed_knowledge.png")
    print("   4_er_full_system.png")
    print("   5_app_flow.png")
