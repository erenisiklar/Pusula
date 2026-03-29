import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CVData } from "./gemini";

// --- Register Professional Fonts ---
// Lato (sans-serif - modern, clean) from GitHub Google Fonts repo
Font.register({
  family: "Lato",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Bold.ttf",
      fontWeight: 700,
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Italic.ttf",
      fontStyle: "italic",
      fontWeight: 400,
    },
  ],
});

// Times-Roman is built-in to @react-pdf/renderer (no registration needed)
// Used for Harvard CV as a classic serif academic font

// --- Color Constants (Pusula brand) ---
const COLORS = {
  black: "#1a1a2e",
  darkGray: "#374151",
  medGray: "#6b7280",
  lightGray: "#d1d5db",
  blue: "#3b82f6",
  white: "#ffffff",
};

// ======================================
// ONE-PAGE CV STYLES (Modern, Clean)
// ======================================
const onePageStyles = StyleSheet.create({
  page: {
    fontFamily: "Lato",
    fontSize: 9.5,
    color: COLORS.black,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    color: COLORS.black,
    marginBottom: 4,
    letterSpacing: 1,
  },
  contactLine: {
    fontSize: 8.5,
    textAlign: "center",
    color: COLORS.medGray,
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 0.8,
    borderBottomColor: COLORS.black,
    marginTop: 12,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    color: COLORS.black,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  entryTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: COLORS.black,
  },
  entrySubtitle: {
    fontSize: 9,
    fontStyle: "italic",
    color: COLORS.darkGray,
  },
  entryDate: {
    fontSize: 8.5,
    color: COLORS.medGray,
    textAlign: "right" as const,
  },
  bullet: {
    fontSize: 9,
    color: COLORS.darkGray,
    marginLeft: 10,
    marginTop: 1.5,
  },
  skillRow: {
    flexDirection: "row",
    marginTop: 3,
  },
  skillLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.black,
    width: 90,
  },
  skillValue: {
    fontSize: 9,
    color: COLORS.darkGray,
    flex: 1,
  },
});

// ======================================
// HARVARD CV STYLES (Formal, Academic)
// ======================================
const harvardStyles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    color: COLORS.black,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    lineHeight: 1.5,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    color: COLORS.black,
    marginBottom: 4,
  },
  contactLine: {
    fontSize: 9.5,
    textAlign: "center",
    color: COLORS.medGray,
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
    marginTop: 14,
    marginBottom: 7,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 2,
    color: COLORS.black,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  entryTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: COLORS.black,
  },
  entrySubtitle: {
    fontSize: 10,
    fontStyle: "italic",
    color: COLORS.darkGray,
  },
  entryDate: {
    fontSize: 9.5,
    color: COLORS.medGray,
    textAlign: "right" as const,
  },
  bullet: {
    fontSize: 10,
    color: COLORS.darkGray,
    marginLeft: 12,
    marginTop: 2,
  },
  skillRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  skillLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.black,
    width: 110,
  },
  skillValue: {
    fontSize: 10,
    color: COLORS.darkGray,
    flex: 1,
  },
});

// ======================================
// Shared Section Renderer
// ======================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStyles = Record<string, any>;

interface SectionProps {
  title: string;
  styles: AnyStyles;
  children: React.ReactNode;
}

function Section({ title, styles, children }: SectionProps) {
  return (
    <View>
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ContactLine({
  data,
  styles,
}: {
  data: CVData["personalInfo"];
  styles: AnyStyles;
}) {
  const parts: string[] = [];
  if (data.email) parts.push(data.email);
  if (data.phone) parts.push(data.phone);
  if (data.location) parts.push(data.location);
  const links: string[] = [];
  if (data.linkedin) links.push(data.linkedin);
  if (data.website) links.push(data.website);

  return (
    <View>
      <Text style={styles.name}>{data.fullName || "Name"}</Text>
      {parts.length > 0 && (
        <Text style={styles.contactLine}>{parts.join("  |  ")}</Text>
      )}
      {links.length > 0 && (
        <Text style={styles.contactLine}>{links.join("  |  ")}</Text>
      )}
    </View>
  );
}

// ======================================
// ONE-PAGE CV Document
// ======================================

export function OnePageCVDocument({ data }: { data: CVData }) {
  const s = onePageStyles;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <ContactLine data={data.personalInfo} styles={s} />

        {/* Education */}
        {data.education?.length > 0 && (
          <Section title="Education" styles={s}>
            {data.education.map((edu, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>{edu.institution}</Text>
                    <Text style={s.entrySubtitle}>
                      {[edu.degree, edu.field].filter(Boolean).join(", ")}
                      {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                    </Text>
                  </View>
                  <Text style={s.entryDate}>
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                {edu.highlights?.map((h, j) => (
                  <Text key={j} style={s.bullet}>
                    {"  -  "}
                    {h}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <Section title="Experience" styles={s}>
            {data.experience.map((exp, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>{exp.company}</Text>
                    <Text style={s.entrySubtitle}>{exp.role}</Text>
                  </View>
                  <Text style={s.entryDate}>
                    {[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                {exp.bullets?.map((b, j) => (
                  <Text key={j} style={s.bullet}>
                    {"  -  "}
                    {b}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <Section title="Projects" styles={s}>
            {data.projects.map((proj, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>
                    {proj.name}
                    {proj.technologies ? ` | ${proj.technologies}` : ""}
                  </Text>
                </View>
                {proj.description && (
                  <Text style={s.bullet}>
                    {"  -  "}
                    {proj.description}
                  </Text>
                )}
                {proj.highlights?.map((h, j) => (
                  <Text key={j} style={s.bullet}>
                    {"  -  "}
                    {h}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        )}

        {/* Leadership & Activities */}
        {data.leadership?.length > 0 && (
          <Section title="Leadership & Activities" styles={s}>
            {data.leadership.map((lead, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>{lead.organization}</Text>
                    <Text style={s.entrySubtitle}>{lead.role}</Text>
                  </View>
                  {lead.period && (
                    <Text style={s.entryDate}>{lead.period}</Text>
                  )}
                </View>
                {lead.description && (
                  <Text style={s.bullet}>
                    {"  -  "}
                    {lead.description}
                  </Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Awards */}
        {data.awards?.length > 0 && (
          <Section title="Awards & Honors" styles={s}>
            {data.awards.map((award, i) => (
              <View key={i} style={s.entryRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.entryTitle}>
                    {award.title}
                    {award.issuer ? ` - ${award.issuer}` : ""}
                  </Text>
                </View>
                {award.date && <Text style={s.entryDate}>{award.date}</Text>}
              </View>
            ))}
          </Section>
        )}

        {/* Skills */}
        {data.skills && (
          <Section title="Skills" styles={s}>
            {data.skills.technical && data.skills.technical.length > 0 && (
              <View style={s.skillRow}>
                <Text style={s.skillLabel}>Technical</Text>
                <Text style={s.skillValue}>
                  {data.skills.technical.join(", ")}
                </Text>
              </View>
            )}
            {data.skills.languages && data.skills.languages.length > 0 && (
              <View style={s.skillRow}>
                <Text style={s.skillLabel}>Languages</Text>
                <Text style={s.skillValue}>
                  {data.skills.languages.join(", ")}
                </Text>
              </View>
            )}
            {data.skills.certifications &&
              data.skills.certifications.length > 0 && (
                <View style={s.skillRow}>
                  <Text style={s.skillLabel}>Certifications</Text>
                  <Text style={s.skillValue}>
                    {data.skills.certifications.join(", ")}
                  </Text>
                </View>
              )}
            {data.skills.other && data.skills.other.length > 0 && (
              <View style={s.skillRow}>
                <Text style={s.skillLabel}>Other</Text>
                <Text style={s.skillValue}>
                  {data.skills.other.join(", ")}
                </Text>
              </View>
            )}
          </Section>
        )}
      </Page>
    </Document>
  );
}

// ======================================
// HARVARD CV Document
// ======================================

export function HarvardCVDocument({ data }: { data: CVData }) {
  const s = harvardStyles;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <ContactLine data={data.personalInfo} styles={s} />

        {/* Education */}
        {data.education?.length > 0 && (
          <Section title="Education" styles={s}>
            {data.education.map((edu, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>{edu.institution}</Text>
                    <Text style={s.entrySubtitle}>
                      {[edu.degree, edu.field].filter(Boolean).join(", ")}
                      {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                    </Text>
                  </View>
                  <Text style={s.entryDate}>
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                {edu.highlights?.map((h, j) => (
                  <Text key={j} style={s.bullet}>
                    {"  -  "}
                    {h}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        )}

        {/* Projects & Research */}
        {data.projects?.length > 0 && (
          <Section title="Academic Projects & Research" styles={s}>
            {data.projects.map((proj, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <Text style={s.entryTitle}>{proj.name}</Text>
                </View>
                {proj.technologies && (
                  <Text style={s.entrySubtitle}>
                    Technologies: {proj.technologies}
                  </Text>
                )}
                {proj.description && (
                  <Text style={s.bullet}>
                    {"  -  "}
                    {proj.description}
                  </Text>
                )}
                {proj.highlights?.map((h, j) => (
                  <Text key={j} style={s.bullet}>
                    {"  -  "}
                    {h}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        )}

        {/* Professional Experience */}
        {data.experience?.length > 0 && (
          <Section title="Professional Experience" styles={s}>
            {data.experience.map((exp, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>{exp.company}</Text>
                    <Text style={s.entrySubtitle}>{exp.role}</Text>
                  </View>
                  <Text style={s.entryDate}>
                    {[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                {exp.bullets?.map((b, j) => (
                  <Text key={j} style={s.bullet}>
                    {"  -  "}
                    {b}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        )}

        {/* Leadership & Activities */}
        {data.leadership?.length > 0 && (
          <Section title="Extracurricular Activities & Leadership" styles={s}>
            {data.leadership.map((lead, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>{lead.organization}</Text>
                    <Text style={s.entrySubtitle}>{lead.role}</Text>
                  </View>
                  {lead.period && (
                    <Text style={s.entryDate}>{lead.period}</Text>
                  )}
                </View>
                {lead.description && (
                  <Text style={s.bullet}>
                    {"  -  "}
                    {lead.description}
                  </Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Awards */}
        {data.awards?.length > 0 && (
          <Section title="Awards, Honors & Competitions" styles={s}>
            {data.awards.map((award, i) => (
              <View key={i}>
                <View style={s.entryRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryTitle}>{award.title}</Text>
                    {award.issuer && (
                      <Text style={s.entrySubtitle}>{award.issuer}</Text>
                    )}
                  </View>
                  {award.date && <Text style={s.entryDate}>{award.date}</Text>}
                </View>
                {award.description && (
                  <Text style={s.bullet}>
                    {"  -  "}
                    {award.description}
                  </Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Skills & Certifications */}
        {data.skills && (
          <Section title="Skills & Certifications" styles={s}>
            {data.skills.technical && data.skills.technical.length > 0 && (
              <View style={s.skillRow}>
                <Text style={s.skillLabel}>Technical Skills</Text>
                <Text style={s.skillValue}>
                  {data.skills.technical.join(", ")}
                </Text>
              </View>
            )}
            {data.skills.languages && data.skills.languages.length > 0 && (
              <View style={s.skillRow}>
                <Text style={s.skillLabel}>Languages</Text>
                <Text style={s.skillValue}>
                  {data.skills.languages.join(", ")}
                </Text>
              </View>
            )}
            {data.skills.certifications &&
              data.skills.certifications.length > 0 && (
                <View style={s.skillRow}>
                  <Text style={s.skillLabel}>Certifications</Text>
                  <Text style={s.skillValue}>
                    {data.skills.certifications.join(", ")}
                  </Text>
                </View>
              )}
            {data.skills.other && data.skills.other.length > 0 && (
              <View style={s.skillRow}>
                <Text style={s.skillLabel}>Other Skills</Text>
                <Text style={s.skillValue}>
                  {data.skills.other.join(", ")}
                </Text>
              </View>
            )}
          </Section>
        )}
      </Page>
    </Document>
  );
}
