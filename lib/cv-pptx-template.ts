import PptxGenJS from "pptxgenjs";
import type { CVData } from "./gemini";

// Colors matching the One-Page CV PDF
const SIDEBAR_BG = "1E293B";
const SIDEBAR_ACCENT = "3B82F6";
const WHITE = "FFFFFF";
const SIDEBAR_TEXT = "E2E8F0";
const SIDEBAR_MUTED = "94A3B8";
const BLACK = "1A1A2E";
const DARK_GRAY = "374151";
const MED_GRAY = "6B7280";

// Standard 4:3 dimensions (Canva compatible)
const W = 10;
const H = 7.5;
const SIDEBAR_W = 2.8;
const MAIN_X = SIDEBAR_W + 0.25;
const MAIN_W = W - MAIN_X - 0.3;

function addSidebarSection(
  slide: PptxGenJS.Slide,
  title: string,
  yPos: number
): number {
  slide.addText(title.toUpperCase(), {
    x: 0.25,
    y: yPos,
    w: SIDEBAR_W - 0.5,
    h: 0.25,
    fontSize: 8,
    fontFace: "Arial",
    bold: true,
    color: SIDEBAR_ACCENT,
  });
  // Accent line
  slide.addShape("rect", {
    x: 0.25,
    y: yPos + 0.25,
    w: SIDEBAR_W - 0.5,
    h: 0.01,
    fill: { color: "2563EB", transparency: 60 },
  });
  return yPos + 0.32;
}

function addSidebarText(
  slide: PptxGenJS.Slide,
  text: string,
  y: number,
  color: string = SIDEBAR_TEXT,
  fontSize: number = 7.5
): number {
  slide.addText(text, {
    x: 0.25,
    y,
    w: SIDEBAR_W - 0.5,
    h: 0.2,
    fontSize,
    fontFace: "Arial",
    color,
  });
  return y + 0.2;
}

function addMainSectionHeader(
  slide: PptxGenJS.Slide,
  title: string,
  y: number
): number {
  // Blue accent bar
  slide.addShape("rect", {
    x: MAIN_X,
    y: y + 0.02,
    w: 0.04,
    h: 0.18,
    fill: { color: SIDEBAR_ACCENT },
  });
  slide.addText(title.toUpperCase(), {
    x: MAIN_X + 0.12,
    y,
    w: MAIN_W - 0.12,
    h: 0.24,
    fontSize: 10,
    fontFace: "Arial",
    bold: true,
    color: BLACK,
  });
  // Thin separator
  slide.addShape("rect", {
    x: MAIN_X,
    y: y + 0.26,
    w: MAIN_W,
    h: 0.005,
    fill: { color: "E2E8F0" },
  });
  return y + 0.32;
}

export function generateOnePagePptx(data: CVData): PptxGenJS {
  const pptx = new PptxGenJS();
  // Use standard LAYOUT_4x3 for Canva compatibility
  pptx.layout = "LAYOUT_4x3";

  const slide = pptx.addSlide();

  const info = data.personalInfo;

  // ===== SIDEBAR BACKGROUND =====
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SIDEBAR_W,
    h: H,
    fill: { color: SIDEBAR_BG },
  });

  // ===== SIDEBAR CONTENT =====
  let sy = 0.35;

  // Initials circle
  const initials = (info.fullName || "N")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  slide.addShape("ellipse", {
    x: (SIDEBAR_W - 0.8) / 2,
    y: sy,
    w: 0.8,
    h: 0.8,
    fill: { color: SIDEBAR_ACCENT },
  });
  slide.addText(initials, {
    x: (SIDEBAR_W - 0.8) / 2,
    y: sy,
    w: 0.8,
    h: 0.8,
    fontSize: 22,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
    align: "center",
    valign: "middle",
  });
  sy += 0.9;

  // Name
  slide.addText(info.fullName || "Name", {
    x: 0.15,
    y: sy,
    w: SIDEBAR_W - 0.3,
    h: 0.28,
    fontSize: 13,
    fontFace: "Arial",
    bold: true,
    color: WHITE,
    align: "center",
  });
  sy += 0.32;

  // Field
  if (data.education?.[0]?.field) {
    slide.addText(data.education[0].field, {
      x: 0.15,
      y: sy,
      w: SIDEBAR_W - 0.3,
      h: 0.2,
      fontSize: 8,
      fontFace: "Arial",
      color: SIDEBAR_ACCENT,
      align: "center",
    });
    sy += 0.24;
  }

  sy += 0.15;

  // Contact
  sy = addSidebarSection(slide, "Contact", sy);
  if (info.email) sy = addSidebarText(slide, info.email, sy);
  if (info.phone) sy = addSidebarText(slide, info.phone, sy);
  if (info.location) sy = addSidebarText(slide, info.location, sy);
  if (info.linkedin)
    sy = addSidebarText(slide, info.linkedin, sy, SIDEBAR_MUTED);
  if (info.website)
    sy = addSidebarText(slide, info.website, sy, SIDEBAR_MUTED);
  sy += 0.12;

  // Skills
  if (data.skills?.technical && data.skills.technical.length > 0) {
    sy = addSidebarSection(slide, "Skills", sy);
    const skillText = data.skills.technical.join("  •  ");
    slide.addText(skillText, {
      x: 0.25,
      y: sy,
      w: SIDEBAR_W - 0.5,
      h: 0.7,
      fontSize: 7,
      fontFace: "Arial",
      color: "93C5FD",
      valign: "top",
    });
    const lines = Math.ceil(skillText.length / 35);
    sy += Math.max(0.22, lines * 0.14);
    sy += 0.12;
  }

  // Languages
  if (data.skills?.languages && data.skills.languages.length > 0) {
    sy = addSidebarSection(slide, "Languages", sy);
    for (const lang of data.skills.languages) {
      sy = addSidebarText(slide, "● " + lang, sy, SIDEBAR_TEXT, 7);
    }
    sy += 0.12;
  }

  // Certifications
  if (data.skills?.certifications && data.skills.certifications.length > 0) {
    sy = addSidebarSection(slide, "Certifications", sy);
    for (const cert of data.skills.certifications) {
      sy = addSidebarText(slide, cert, sy, SIDEBAR_TEXT, 6.5);
      sy += 0.02;
    }
    sy += 0.12;
  }

  // Other
  if (data.skills?.other && data.skills.other.length > 0) {
    sy = addSidebarSection(slide, "Other", sy);
    const otherText = data.skills.other.join("  •  ");
    slide.addText(otherText, {
      x: 0.25,
      y: sy,
      w: SIDEBAR_W - 0.5,
      h: 0.5,
      fontSize: 7,
      fontFace: "Arial",
      color: "93C5FD",
      valign: "top",
    });
  }

  // ===== MAIN CONTENT =====
  let my = 0.3;

  // Education
  if (data.education?.length > 0) {
    my = addMainSectionHeader(slide, "Education", my);
    for (const edu of data.education) {
      slide.addText(
        [
          {
            text: edu.institution,
            options: { fontSize: 9, bold: true, color: BLACK, fontFace: "Arial" },
          },
        ],
        { x: MAIN_X, y: my, w: MAIN_W * 0.7, h: 0.18 }
      );
      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        slide.addText(dateStr, {
          x: MAIN_X + MAIN_W * 0.7,
          y: my,
          w: MAIN_W * 0.3,
          h: 0.18,
          fontSize: 7,
          fontFace: "Arial",
          color: MED_GRAY,
          align: "right",
        });
      }
      my += 0.18;
      const degreeField = [edu.degree, edu.field].filter(Boolean).join(", ");
      if (degreeField || edu.gpa) {
        slide.addText(degreeField + (edu.gpa ? ` | GPA: ${edu.gpa}` : ""), {
          x: MAIN_X,
          y: my,
          w: MAIN_W,
          h: 0.16,
          fontSize: 7.5,
          fontFace: "Arial",
          italic: true,
          color: DARK_GRAY,
        });
        my += 0.16;
      }
      for (const h of edu.highlights || []) {
        slide.addText("•  " + h, {
          x: MAIN_X + 0.1,
          y: my,
          w: MAIN_W - 0.1,
          h: 0.16,
          fontSize: 7.5,
          fontFace: "Arial",
          color: DARK_GRAY,
        });
        my += 0.16;
      }
      my += 0.06;
    }
  }

  // Experience
  if (data.experience?.length > 0) {
    my = addMainSectionHeader(slide, "Experience", my);
    for (const exp of data.experience) {
      slide.addText(exp.company, {
        x: MAIN_X,
        y: my,
        w: MAIN_W * 0.7,
        h: 0.18,
        fontSize: 9,
        fontFace: "Arial",
        bold: true,
        color: BLACK,
      });
      const dateStr = [exp.startDate, exp.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        slide.addText(dateStr, {
          x: MAIN_X + MAIN_W * 0.7,
          y: my,
          w: MAIN_W * 0.3,
          h: 0.18,
          fontSize: 7,
          fontFace: "Arial",
          color: MED_GRAY,
          align: "right",
        });
      }
      my += 0.18;
      if (exp.role) {
        slide.addText(exp.role, {
          x: MAIN_X,
          y: my,
          w: MAIN_W,
          h: 0.16,
          fontSize: 7.5,
          fontFace: "Arial",
          italic: true,
          color: SIDEBAR_ACCENT,
        });
        my += 0.16;
      }
      for (const b of exp.bullets || []) {
        slide.addText("•  " + b, {
          x: MAIN_X + 0.1,
          y: my,
          w: MAIN_W - 0.1,
          h: 0.16,
          fontSize: 7.5,
          fontFace: "Arial",
          color: DARK_GRAY,
        });
        my += 0.16;
      }
      my += 0.06;
    }
  }

  // Projects
  if (data.projects?.length > 0) {
    my = addMainSectionHeader(slide, "Projects", my);
    for (const proj of data.projects) {
      slide.addText(proj.name, {
        x: MAIN_X,
        y: my,
        w: MAIN_W,
        h: 0.18,
        fontSize: 9,
        fontFace: "Arial",
        bold: true,
        color: BLACK,
      });
      my += 0.18;
      if (proj.description) {
        slide.addText("•  " + proj.description, {
          x: MAIN_X + 0.1,
          y: my,
          w: MAIN_W - 0.1,
          h: 0.16,
          fontSize: 7.5,
          fontFace: "Arial",
          color: DARK_GRAY,
        });
        my += 0.16;
      }
      for (const h of proj.highlights || []) {
        slide.addText("•  " + h, {
          x: MAIN_X + 0.1,
          y: my,
          w: MAIN_W - 0.1,
          h: 0.16,
          fontSize: 7.5,
          fontFace: "Arial",
          color: DARK_GRAY,
        });
        my += 0.16;
      }
      my += 0.04;
    }
  }

  // Leadership
  if (data.leadership?.length > 0) {
    my = addMainSectionHeader(slide, "Leadership & Activities", my);
    for (const lead of data.leadership) {
      slide.addText(lead.organization, {
        x: MAIN_X,
        y: my,
        w: MAIN_W * 0.7,
        h: 0.18,
        fontSize: 9,
        fontFace: "Arial",
        bold: true,
        color: BLACK,
      });
      if (lead.period) {
        slide.addText(lead.period, {
          x: MAIN_X + MAIN_W * 0.7,
          y: my,
          w: MAIN_W * 0.3,
          h: 0.18,
          fontSize: 7,
          fontFace: "Arial",
          color: MED_GRAY,
          align: "right",
        });
      }
      my += 0.18;
      if (lead.role) {
        slide.addText(lead.role, {
          x: MAIN_X,
          y: my,
          w: MAIN_W,
          h: 0.16,
          fontSize: 7.5,
          fontFace: "Arial",
          italic: true,
          color: SIDEBAR_ACCENT,
        });
        my += 0.16;
      }
      if (lead.description) {
        slide.addText("•  " + lead.description, {
          x: MAIN_X + 0.1,
          y: my,
          w: MAIN_W - 0.1,
          h: 0.16,
          fontSize: 7.5,
          fontFace: "Arial",
          color: DARK_GRAY,
        });
        my += 0.16;
      }
      my += 0.04;
    }
  }

  // Awards
  if (data.awards?.length > 0) {
    my = addMainSectionHeader(slide, "Awards & Honors", my);
    for (const award of data.awards) {
      slide.addText(award.title, {
        x: MAIN_X,
        y: my,
        w: MAIN_W * 0.7,
        h: 0.18,
        fontSize: 8,
        fontFace: "Arial",
        bold: true,
        color: BLACK,
      });
      if (award.date) {
        slide.addText(award.date, {
          x: MAIN_X + MAIN_W * 0.7,
          y: my,
          w: MAIN_W * 0.3,
          h: 0.18,
          fontSize: 7,
          fontFace: "Arial",
          color: MED_GRAY,
          align: "right",
        });
      }
      my += 0.18;
      if (award.issuer) {
        slide.addText(award.issuer, {
          x: MAIN_X,
          y: my,
          w: MAIN_W,
          h: 0.14,
          fontSize: 7,
          fontFace: "Arial",
          italic: true,
          color: DARK_GRAY,
        });
        my += 0.14;
      }
      my += 0.04;
    }
  }

  return pptx;
}
