import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TabStopPosition,
  TabStopType,
  SectionType,
  convertInchesToTwip,
} from "docx";
import type { CVData } from "./gemini";

const DARK_RED = "8B0000";
const BLACK = "000000";
const DARK_GRAY = "333333";

function sectionHeader(title: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: DARK_RED },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 22,
        color: DARK_RED,
        font: "Times New Roman",
      }),
    ],
  });
}

function entryTitle(title: string, date?: string): Paragraph {
  const children: TextRun[] = [
    new TextRun({
      text: title,
      bold: true,
      size: 21,
      color: BLACK,
      font: "Times New Roman",
    }),
  ];

  if (date) {
    children.push(
      new TextRun({
        text: "\t" + date,
        size: 19,
        color: DARK_GRAY,
        font: "Times New Roman",
      })
    );
  }

  return new Paragraph({
    spacing: { before: 120, after: 40 },
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    children,
  });
}

function subtitle(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 19,
        color: DARK_GRAY,
        font: "Times New Roman",
      }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 40 },
    indent: { left: convertInchesToTwip(0.25) },
    children: [
      new TextRun({
        text: "•  " + text,
        size: 19,
        color: BLACK,
        font: "Times New Roman",
      }),
    ],
  });
}

function skillLine(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: label + ": ",
        bold: true,
        size: 20,
        color: BLACK,
        font: "Times New Roman",
      }),
      new TextRun({
        text: value,
        size: 20,
        color: BLACK,
        font: "Times New Roman",
      }),
    ],
  });
}

export function generateHarvardDocx(data: CVData): Document {
  const info = data.personalInfo;
  const paragraphs: Paragraph[] = [];

  // Header - Name
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: (info.fullName || "NAME").toUpperCase(),
          bold: true,
          size: 28,
          color: BLACK,
          font: "Times New Roman",
          underline: {},
        }),
      ],
    })
  );

  // Contact info
  const contactLines: string[] = [];
  if (info.location) contactLines.push(info.location);
  if (info.email) contactLines.push("Email: " + info.email);
  if (info.phone) contactLines.push("Mobile Phone: " + info.phone);
  if (info.linkedin || info.website)
    contactLines.push([info.linkedin, info.website].filter(Boolean).join(" / "));

  for (const line of contactLines) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: line,
            size: 18,
            color: DARK_GRAY,
            font: "Times New Roman",
          }),
        ],
      })
    );
  }

  // Education
  if (data.education?.length > 0) {
    paragraphs.push(sectionHeader("Education & Qualifications"));
    for (const edu of data.education) {
      paragraphs.push(
        entryTitle(
          edu.institution,
          [edu.startDate, edu.endDate].filter(Boolean).join(" – ")
        )
      );
      if (edu.degree || edu.field) {
        bullet(
          [edu.degree, edu.field].filter(Boolean).join(", ")
        );
      }
      if (edu.gpa) paragraphs.push(bullet("GPA: " + edu.gpa));
      for (const h of edu.highlights || []) {
        paragraphs.push(bullet(h));
      }
    }
  }

  // Certificates
  if (data.skills?.certifications && data.skills.certifications.length > 0) {
    paragraphs.push(sectionHeader("Certificates"));
    for (const cert of data.skills.certifications) {
      paragraphs.push(bullet(cert));
    }
  }

  // Projects (Summer Schools)
  if (data.projects?.length > 0) {
    paragraphs.push(sectionHeader("Summer Schools & Trainings & Conferences"));
    for (const proj of data.projects) {
      paragraphs.push(entryTitle(proj.name));
      if (proj.description) paragraphs.push(bullet(proj.description));
      for (const h of proj.highlights || []) {
        paragraphs.push(bullet(h));
      }
    }
  }

  // Work Experience
  if (data.experience?.length > 0) {
    paragraphs.push(sectionHeader("Work Experiences"));
    for (const exp of data.experience) {
      paragraphs.push(
        entryTitle(
          exp.company,
          [exp.startDate, exp.endDate].filter(Boolean).join(" – ")
        )
      );
      if (exp.role) paragraphs.push(subtitle(exp.role));
      for (const b of exp.bullets || []) {
        paragraphs.push(bullet(b));
      }
    }
  }

  // Leadership
  if (data.leadership?.length > 0) {
    paragraphs.push(sectionHeader("Community Service & School Clubs"));
    for (const lead of data.leadership) {
      const title = lead.role
        ? `${lead.organization} – ${lead.role}`
        : lead.organization;
      paragraphs.push(entryTitle(title, lead.period));
      if (lead.description) paragraphs.push(bullet(lead.description));
    }
  }

  // Awards
  if (data.awards?.length > 0) {
    paragraphs.push(sectionHeader("Awards & Honors"));
    for (const award of data.awards) {
      paragraphs.push(entryTitle(award.title, award.date));
      if (award.issuer) paragraphs.push(subtitle(award.issuer));
      if (award.description) paragraphs.push(bullet(award.description));
    }
  }

  // Skills
  if (data.skills) {
    paragraphs.push(sectionHeader("Skills & Interests"));
    if (data.skills.technical?.length)
      paragraphs.push(skillLine("SKILLS", data.skills.technical.join(", ")));
    if (data.skills.languages?.length)
      paragraphs.push(skillLine("LANGUAGES", data.skills.languages.join(", ")));
    if (data.skills.other?.length)
      paragraphs.push(skillLine("INTERESTS", data.skills.other.join(", ")));
  }

  return new Document({
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            margin: {
              top: convertInchesToTwip(0.7),
              bottom: convertInchesToTwip(0.7),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        children: paragraphs,
      },
    ],
  });
}
