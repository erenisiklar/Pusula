// Test script: Generate sample PDFs with Eren's CV data
const React = require("react");

async function main() {
  // Dynamic imports for ESM modules
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const { OnePageCVDocument, HarvardCVDocument } = await import("../lib/cv-pdf-templates.tsx");
  const fs = require("fs");
  const path = require("path");

  const sampleData = {
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
        name: "Sorbonne University Summer School",
        description: "Pre-university summer school at the Université Paris 1 Panthéon-Sorbonne, participation in B2-level French as a foreign language courses.",
        technologies: "",
        highlights: [],
      },
      {
        name: "Sabanci University Summer School",
        description: 'Participation in "International Macroeconomics", "International Law" and "Machine Learning and Artificial Intelligence" courses.',
        technologies: "",
        highlights: [],
      },
      {
        name: "Galatasaray High School Solve Down Conference",
        description: "Focused on problem-solving and critical thinking skills, including workshops, discussions, and competitions.",
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
        "English: Advanced",
        "French: Upper Intermediate",
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
        description: "Member of the Francophone Model United Nations in Eurasia Club, participated in numerous conferences.",
      },
      {
        role: "Co-founder & Community Expert",
        organization: "For Create. / High School Entrepreneurship Association",
        period: "2024 – Present",
        description: "Co-founded a high school entrepreneurship association focused on building community.",
      },
      {
        role: "Head of Event Organization",
        organization: "Saint-Joseph Entrepreneurship Club – SOMMET Conference",
        period: "2023 – 2024",
        description: "Organized conferences bringing together entrepreneurs, industry leaders, investors, and aspiring business owners.",
      },
      {
        role: "Co-President",
        organization: "Entrepreneurship Club",
        period: "2023 – 2024",
        description: "Selected to be co-president after being a member for 2 years. Fostered entrepreneurial skills among members.",
      },
      {
        role: "Tourist Guide & Interpreter",
        organization: "ASSEDIL",
        period: "2023 – 2024",
        description: "Introduced Istanbul to directors, principals and freres of Lasallian schools from more than 30 countries.",
      },
    ],
    awards: [
      {
        title: "IstanbuLiège Exchange Programme",
        issuer: "Liège, Belgium",
        date: "May 2023",
        description: "Twin school exchange program with Saint-Benoit Saint-Servais High School in Liège.",
      },
    ],
    detectedField: "business",
  };

  // Generate One-Page PDF
  const onePageDoc = React.createElement(OnePageCVDocument, { data: sampleData });
  const onePageBuffer = await renderToBuffer(onePageDoc);
  fs.writeFileSync(path.join(__dirname, "Eren_Isiklar_OnePage.pdf"), Buffer.from(onePageBuffer));
  console.log("✓ One-Page CV generated: Eren_Isiklar_OnePage.pdf");

  // Generate Harvard PDF
  const harvardDoc = React.createElement(HarvardCVDocument, { data: sampleData });
  const harvardBuffer = await renderToBuffer(harvardDoc);
  fs.writeFileSync(path.join(__dirname, "Eren_Isiklar_Harvard.pdf"), Buffer.from(harvardBuffer));
  console.log("✓ Harvard CV generated: Eren_Isiklar_Harvard.pdf");
}

main().catch(console.error);
