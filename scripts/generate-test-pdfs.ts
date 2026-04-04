import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { OnePageCVDocument, HarvardCVDocument } from "../lib/cv-pdf-templates";
import type { CVData } from "../lib/gemini";
import fs from "fs";
import path from "path";

const sampleData: CVData = {
  personalInfo: {
    fullName: "Eren Isiklar",
    email: "erenisiklar06@gmail.com",
    phone: "+90 530 139 02 17",
    location: "Istanbul, Turkey",
    linkedin: "linkedin.com/in/erenisiklar",
    website: "",
  },
  education: [
    {
      institution: "SAINT JOSEPH PRIVATE HIGH SCHOOL, ISTANBUL – TURKEY",
      degree: "High School Diploma",
      field: "Turkish & Math Track",
      gpa: "85/100",
      startDate: "Sep 2020",
      endDate: "Jun 2025",
      highlights: [
        "Curriculum in French and Turkish",
        "Prize of excellence for 3 consecutive years",
        "AP Results: Macroeconomics 4/5, Microeconomics 4/5, Calculus BC 4/5",
      ],
    },
  ],
  experience: [
    {
      company: "Zet Denim, Istanbul, Turkey",
      role: "Summer Intern",
      startDate: "Aug 5",
      endDate: "Aug 23, 2024",
      bullets: [
        "Observed the workspace and engaged with colleagues across departments",
        "Contributed to presentations on market trends and product strategy",
        "Conducted research on current trends in denim fashion, competitor analysis, and consumer preferences",
      ],
    },
    {
      company: "Mavi, Istanbul, Turkey",
      role: "Summer Intern",
      startDate: "Aug 21",
      endDate: "Aug 25, 2023",
      bullets: [
        "Interacted with customers to gather feedback on product satisfaction",
        "Participated in organization of promotional events",
        "Contributed to strategies aimed at increasing sales",
      ],
    },
    {
      company: "AFD Insurance, Istanbul, Turkey",
      role: "Summer Intern",
      startDate: "Jul 1",
      endDate: "Jul 31, 2024",
      bullets: [
        "Classified customers and managed client portfolios",
        "Updated contact details in the company database",
      ],
    },
  ],
  projects: [
    {
      name: "Sorbonne University Summer School, Paris, France",
      description:
        "Pre-university summer school at the Université Paris 1 Panthéon-Sorbonne, participation in B2-level French as a foreign language courses.",
      technologies: "",
      highlights: [],
    },
    {
      name: "Sabanci University Summer School, Istanbul, Turkey",
      description:
        'Participation in "International Macroeconomics", "International Law" and "Machine Learning and Artificial Intelligence" courses.',
      technologies: "",
      highlights: [],
    },
    {
      name: "Galatasaray High School Solve Down Conference",
      description:
        "Focused on problem-solving and critical thinking skills, including workshops, discussions, and competitions.",
      technologies: "",
      highlights: [],
    },
  ],
  skills: {
    technical: [
      "Leadership",
      "Public Speaking",
      "Creativity",
      "Organizing",
      "Team Player",
      "Critical Thinking",
      "Word",
      "PowerPoint",
      "Excel",
      "Adobe Photoshop",
    ],
    languages: [
      "Turkish: Native",
      "English: Advanced (IELTS C1 – 7.5/9)",
      "French: Upper Intermediate (DELF B2 – 73.5/100)",
    ],
    certifications: [
      "DELF B2 – Final Note 73.5/100 – March 2024",
      "IELTS C1 – Final Note 7.5/9 – November 2024",
      "SAT 1400/1600 (Math: 770, Reading & Writing: 630)",
    ],
    other: [
      "Music (Guitar 9 years, Drum 2 years)",
      "Trading",
      "Political Debates",
      "Arts",
      "Basketball – 7 years professional, team captain, EYBL Europe 6th place (2023)",
    ],
  },
  leadership: [
    {
      role: "Head of Cultural Visits Post",
      organization: "MFINUE – Model United Nations in Eurasia Club",
      period: "2024 – Present",
      description:
        "Member of the Francophone Model United Nations in Eurasia Club, participated in numerous conferences.",
    },
    {
      role: "Co-founder & Community Expert",
      organization: "For Create. / High School Entrepreneurship Association",
      period: "2024 – Present",
      description:
        "Co-founded a high school entrepreneurship association focused on building community.",
    },
    {
      role: "Head of Event Organization",
      organization: "Saint-Joseph Entrepreneurship Club – SOMMET Conference",
      period: "2023 – 2024",
      description:
        "Organized conferences bringing together entrepreneurs, industry leaders, investors, and aspiring business owners.",
    },
    {
      role: "Co-President",
      organization: "Entrepreneurship Club",
      period: "2023 – 2024",
      description:
        "Selected to be co-president after being a member for 2 years. Fostered entrepreneurial skills among members.",
    },
    {
      role: "Tourist Guide & Interpreter",
      organization: "ASSEDIL",
      period: "2023 – 2024",
      description:
        "Introduced Istanbul to directors, principals and freres of Lasallian schools from more than 30 countries.",
    },
  ],
  awards: [
    {
      title: "IstanbuLiège Exchange Programme",
      issuer: "Liège, Belgium",
      date: "May 2023",
      description:
        "Twin school exchange program with Saint-Benoit Saint-Servais High School in Liège.",
    },
    {
      title: "Player of the Game – Lampe Challenge Games",
      issuer: "Sweden",
      date: "2022",
      description: 'Awarded "Player of the Game" at Lampe Challenge Games in Sweden.',
    },
    {
      title: "EYBL Europe – 6th Place",
      issuer: "European Youth Basketball League",
      date: "2023",
      description: "Placed 6th in the EYBL tournament in Europe with school basketball team.",
    },
  ],
  detectedField: "business",
};

async function main() {
  const outDir = path.join(__dirname);

  // Generate One-Page PDF
  console.log("Generating One-Page CV...");
  const onePageDoc = React.createElement(OnePageCVDocument, { data: sampleData });
  const onePageBuffer = await renderToBuffer(onePageDoc as any);
  const onePagePath = path.join(outDir, "Eren_Isiklar_OnePage.pdf");
  fs.writeFileSync(onePagePath, Buffer.from(onePageBuffer));
  console.log(`✓ One-Page CV: ${onePagePath}`);

  // Generate Harvard PDF
  console.log("Generating Harvard CV...");
  const harvardDoc = React.createElement(HarvardCVDocument, { data: sampleData });
  const harvardBuffer = await renderToBuffer(harvardDoc as any);
  const harvardPath = path.join(outDir, "Eren_Isiklar_Harvard.pdf");
  fs.writeFileSync(harvardPath, Buffer.from(harvardBuffer));
  console.log(`✓ Harvard CV: ${harvardPath}`);

  console.log("\nDone! Both PDFs generated.");
}

main().catch(console.error);
