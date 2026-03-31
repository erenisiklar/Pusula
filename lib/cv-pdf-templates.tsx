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
// ONE-PAGE CV — Modern Two-Column Layout
// ======================================
const SIDEBAR_WIDTH = 185;
const SIDEBAR_BG = "#1e293b"; // Dark navy sidebar
const SIDEBAR_ACCENT = "#3b82f6"; // Pusula blue
const SIDEBAR_TEXT = "#e2e8f0";
const SIDEBAR_MUTED = "#94a3b8";
const MAIN_BG = "#ffffff";

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
// ONE-PAGE CV Document — Modern Sidebar
// ======================================

/* Sidebar section with blue accent line */
function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontFamily: "Lato",
          fontSize: 9,
          fontWeight: 700,
          color: SIDEBAR_ACCENT,
          textTransform: "uppercase" as const,
          letterSpacing: 2,
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "rgba(59,130,246,0.4)",
          paddingTop: 6,
        }}
      >
        {children}
      </View>
    </View>
  );
}

/* Skill bar (visual indicator) */
function SkillTag({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: "rgba(59,130,246,0.15)",
        borderRadius: 3,
        paddingHorizontal: 6,
        paddingVertical: 2.5,
        marginRight: 4,
        marginBottom: 4,
      }}
    >
      <Text
        style={{
          fontFamily: "Lato",
          fontSize: 7.5,
          color: "#93c5fd",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/* Main content section header */
function MainSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <View
          style={{
            width: 3,
            height: 12,
            backgroundColor: SIDEBAR_ACCENT,
            marginRight: 6,
            borderRadius: 1,
          }}
        />
        <Text
          style={{
            fontFamily: "Lato",
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.black,
            textTransform: "uppercase" as const,
            letterSpacing: 1.5,
          }}
        >
          {title}
        </Text>
      </View>
      <View
        style={{
          borderTopWidth: 0.5,
          borderTopColor: "#e2e8f0",
          paddingTop: 4,
        }}
      >
        {children}
      </View>
    </View>
  );
}

export function OnePageCVDocument({ data }: { data: CVData }) {
  const info = data.personalInfo;

  return (
    <Document>
      <Page
        size="A4"
        style={{
          fontFamily: "Lato",
          fontSize: 9,
          flexDirection: "row",
          color: COLORS.black,
          lineHeight: 1.4,
        }}
      >
        {/* ====== LEFT SIDEBAR ====== */}
        <View
          style={{
            width: SIDEBAR_WIDTH,
            backgroundColor: SIDEBAR_BG,
            paddingTop: 32,
            paddingBottom: 28,
            paddingHorizontal: 16,
          }}
        >
          {/* Name + Title area */}
          <View style={{ marginBottom: 16, alignItems: "center" }}>
            {/* Initials circle */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: SIDEBAR_ACCENT,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 20,
                  fontWeight: 700,
                  color: COLORS.white,
                }}
              >
                {(info.fullName || "N")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Lato",
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.white,
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              {info.fullName || "Name"}
            </Text>
            {data.education?.[0]?.field && (
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 8,
                  color: SIDEBAR_ACCENT,
                  textAlign: "center",
                }}
              >
                {data.education[0].field}
              </Text>
            )}
          </View>

          {/* Contact */}
          <SidebarSection title="Contact">
            {info.email && (
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 7.5,
                  color: SIDEBAR_TEXT,
                  marginBottom: 4,
                }}
              >
                {info.email}
              </Text>
            )}
            {info.phone && (
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 7.5,
                  color: SIDEBAR_TEXT,
                  marginBottom: 4,
                }}
              >
                {info.phone}
              </Text>
            )}
            {info.location && (
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 7.5,
                  color: SIDEBAR_TEXT,
                  marginBottom: 4,
                }}
              >
                {info.location}
              </Text>
            )}
            {info.linkedin && (
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 7.5,
                  color: SIDEBAR_MUTED,
                  marginBottom: 4,
                }}
              >
                {info.linkedin}
              </Text>
            )}
            {info.website && (
              <Text
                style={{
                  fontFamily: "Lato",
                  fontSize: 7.5,
                  color: SIDEBAR_MUTED,
                  marginBottom: 4,
                }}
              >
                {info.website}
              </Text>
            )}
          </SidebarSection>

          {/* Skills (as tags) */}
          {data.skills?.technical && data.skills.technical.length > 0 && (
            <SidebarSection title="Skills">
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {data.skills.technical.map((skill, i) => (
                  <SkillTag key={i} label={skill} />
                ))}
              </View>
            </SidebarSection>
          )}

          {/* Languages */}
          {data.skills?.languages && data.skills.languages.length > 0 && (
            <SidebarSection title="Languages">
              {data.skills.languages.map((lang, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 2.5,
                      backgroundColor: SIDEBAR_ACCENT,
                      marginRight: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Lato",
                      fontSize: 8,
                      color: SIDEBAR_TEXT,
                    }}
                  >
                    {lang}
                  </Text>
                </View>
              ))}
            </SidebarSection>
          )}

          {/* Certifications */}
          {data.skills?.certifications &&
            data.skills.certifications.length > 0 && (
              <SidebarSection title="Certifications">
                {data.skills.certifications.map((cert, i) => (
                  <Text
                    key={i}
                    style={{
                      fontFamily: "Lato",
                      fontSize: 7.5,
                      color: SIDEBAR_TEXT,
                      marginBottom: 3,
                    }}
                  >
                    {cert}
                  </Text>
                ))}
              </SidebarSection>
            )}

          {/* Other Skills */}
          {data.skills?.other && data.skills.other.length > 0 && (
            <SidebarSection title="Other">
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {data.skills.other.map((s, i) => (
                  <SkillTag key={i} label={s} />
                ))}
              </View>
            </SidebarSection>
          )}
        </View>

        {/* ====== RIGHT MAIN CONTENT ====== */}
        <View
          style={{
            flex: 1,
            backgroundColor: MAIN_BG,
            paddingTop: 32,
            paddingBottom: 28,
            paddingLeft: 22,
            paddingRight: 28,
          }}
        >
          {/* Education */}
          {data.education?.length > 0 && (
            <MainSection title="Education">
              {data.education.map((edu, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: COLORS.black,
                        }}
                      >
                        {edu.institution}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 8.5,
                          fontStyle: "italic",
                          color: COLORS.darkGray,
                        }}
                      >
                        {[edu.degree, edu.field].filter(Boolean).join(", ")}
                        {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "Lato",
                        fontSize: 8,
                        color: COLORS.medGray,
                      }}
                    >
                      {[edu.startDate, edu.endDate]
                        .filter(Boolean)
                        .join(" - ")}
                    </Text>
                  </View>
                  {edu.highlights?.map((h, j) => (
                    <Text
                      key={j}
                      style={{
                        fontFamily: "Lato",
                        fontSize: 8.5,
                        color: COLORS.darkGray,
                        marginLeft: 8,
                        marginTop: 1.5,
                      }}
                    >
                      {"•  "}
                      {h}
                    </Text>
                  ))}
                </View>
              ))}
            </MainSection>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <MainSection title="Experience">
              {data.experience.map((exp, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: COLORS.black,
                        }}
                      >
                        {exp.company}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 8.5,
                          fontStyle: "italic",
                          color: SIDEBAR_ACCENT,
                        }}
                      >
                        {exp.role}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "Lato",
                        fontSize: 8,
                        color: COLORS.medGray,
                      }}
                    >
                      {[exp.startDate, exp.endDate]
                        .filter(Boolean)
                        .join(" - ")}
                    </Text>
                  </View>
                  {exp.bullets?.map((b, j) => (
                    <Text
                      key={j}
                      style={{
                        fontFamily: "Lato",
                        fontSize: 8.5,
                        color: COLORS.darkGray,
                        marginLeft: 8,
                        marginTop: 1.5,
                      }}
                    >
                      {"•  "}
                      {b}
                    </Text>
                  ))}
                </View>
              ))}
            </MainSection>
          )}

          {/* Projects */}
          {data.projects?.length > 0 && (
            <MainSection title="Projects">
              {data.projects.map((proj, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato",
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: COLORS.black,
                      }}
                    >
                      {proj.name}
                    </Text>
                    {proj.technologies && (
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 7.5,
                          color: SIDEBAR_ACCENT,
                          marginLeft: 6,
                        }}
                      >
                        {proj.technologies}
                      </Text>
                    )}
                  </View>
                  {proj.description && (
                    <Text
                      style={{
                        fontFamily: "Lato",
                        fontSize: 8.5,
                        color: COLORS.darkGray,
                        marginLeft: 8,
                        marginTop: 1,
                      }}
                    >
                      {"•  "}
                      {proj.description}
                    </Text>
                  )}
                  {proj.highlights?.map((h, j) => (
                    <Text
                      key={j}
                      style={{
                        fontFamily: "Lato",
                        fontSize: 8.5,
                        color: COLORS.darkGray,
                        marginLeft: 8,
                        marginTop: 1.5,
                      }}
                    >
                      {"•  "}
                      {h}
                    </Text>
                  ))}
                </View>
              ))}
            </MainSection>
          )}

          {/* Leadership & Activities */}
          {data.leadership?.length > 0 && (
            <MainSection title="Leadership & Activities">
              {data.leadership.map((lead, i) => (
                <View key={i} style={{ marginBottom: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: COLORS.black,
                        }}
                      >
                        {lead.organization}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 8.5,
                          fontStyle: "italic",
                          color: SIDEBAR_ACCENT,
                        }}
                      >
                        {lead.role}
                      </Text>
                    </View>
                    {lead.period && (
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 8,
                          color: COLORS.medGray,
                        }}
                      >
                        {lead.period}
                      </Text>
                    )}
                  </View>
                  {lead.description && (
                    <Text
                      style={{
                        fontFamily: "Lato",
                        fontSize: 8.5,
                        color: COLORS.darkGray,
                        marginLeft: 8,
                        marginTop: 1.5,
                      }}
                    >
                      {"•  "}
                      {lead.description}
                    </Text>
                  )}
                </View>
              ))}
            </MainSection>
          )}

          {/* Awards */}
          {data.awards?.length > 0 && (
            <MainSection title="Awards & Honors">
              {data.awards.map((award, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Lato",
                        fontSize: 9,
                        fontWeight: 700,
                        color: COLORS.black,
                      }}
                    >
                      {award.title}
                    </Text>
                    {award.issuer && (
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 8,
                          color: COLORS.darkGray,
                          fontStyle: "italic",
                        }}
                      >
                        {award.issuer}
                      </Text>
                    )}
                  </View>
                  {award.date && (
                    <Text
                      style={{
                        fontFamily: "Lato",
                        fontSize: 8,
                        color: COLORS.medGray,
                      }}
                    >
                      {award.date}
                    </Text>
                  )}
                </View>
              ))}
            </MainSection>
          )}
        </View>
      </Page>
    </Document>
  );
}

// ======================================
// HARVARD CV Document — User Template Match
// ======================================

const H = {
  // Colors matching user's template
  headerRed: "#8b0000", // Dark red for section titles
  black: "#000000",
  darkGray: "#333333",
  medGray: "#555555",
};

/* Harvard section header: centered, uppercase, underlined, dark red */
function HarvardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 14, marginBottom: 6 }}>
      <Text
        style={{
          fontFamily: "Times-Roman",
          fontSize: 11,
          fontWeight: 700,
          textAlign: "center" as const,
          color: H.headerRed,
          textDecoration: "underline" as const,
          textTransform: "uppercase" as const,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

/* Harvard entry row: title+location left, date right */
function HarvardEntry({
  title,
  subtitle,
  date,
  description,
  bullets,
}: {
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Text style={{ fontFamily: "Times-Roman", fontSize: 10.5, fontWeight: 700, color: H.black, flex: 1 }}>
          {title}
        </Text>
        {date && (
          <Text style={{ fontFamily: "Times-Roman", fontSize: 10, color: H.darkGray, textAlign: "right" as const, minWidth: 120 }}>
            {date}
          </Text>
        )}
      </View>
      {subtitle && (
        <Text style={{ fontFamily: "Times-Roman", fontSize: 10, fontStyle: "italic", color: H.medGray, marginTop: 1 }}>
          {subtitle}
        </Text>
      )}
      {description && (
        <Text style={{ fontFamily: "Times-Roman", fontSize: 10, fontStyle: "italic", color: H.medGray, marginTop: 2 }}>
          {description}
        </Text>
      )}
      {bullets && bullets.length > 0 && bullets.map((b, i) => (
        <View key={i} style={{ flexDirection: "row", marginTop: 2, paddingLeft: 16 }}>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 10, color: H.black, width: 12 }}>•</Text>
          <Text style={{ fontFamily: "Times-Roman", fontSize: 10, color: H.black, flex: 1 }}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

export function HarvardCVDocument({ data }: { data: CVData }) {
  const info = data.personalInfo;

  return (
    <Document>
      <Page
        size="A4"
        style={{
          fontFamily: "Times-Roman",
          fontSize: 10,
          color: H.black,
          paddingTop: 36,
          paddingBottom: 30,
          paddingHorizontal: 50,
          lineHeight: 1.35,
        }}
      >
        {/* ===== HEADER ===== */}
        <View style={{ alignItems: "center", marginBottom: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "underline" as const,
              textTransform: "uppercase" as const,
              letterSpacing: 1.5,
              marginBottom: 4,
            }}
          >
            {info.fullName || "NAME"}
          </Text>
          {info.location && (
            <Text style={{ fontSize: 9.5, color: H.darkGray, marginBottom: 1.5 }}>
              {info.location}
            </Text>
          )}
          {info.email && (
            <Text style={{ fontSize: 9.5, color: H.darkGray, marginBottom: 1.5 }}>
              Email: {info.email}
            </Text>
          )}
          {info.phone && (
            <Text style={{ fontSize: 9.5, color: H.darkGray, marginBottom: 1.5 }}>
              Mobile Phone: {info.phone}
            </Text>
          )}
          {(info.linkedin || info.website) && (
            <Text style={{ fontSize: 9.5, color: H.darkGray, marginBottom: 1.5 }}>
              {[info.linkedin, info.website].filter(Boolean).join(" / ")}
            </Text>
          )}
        </View>

        {/* ===== EDUCATION & QUALIFICATIONS ===== */}
        {data.education?.length > 0 && (
          <HarvardSection title="Education & Qualifications">
            {data.education.map((edu, i) => (
              <HarvardEntry
                key={i}
                title={[edu.institution, edu.field ? `– ${edu.field}` : ""].filter(Boolean).join(" ")}
                date={[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                bullets={[
                  ...(edu.degree ? [edu.degree] : []),
                  ...(edu.gpa ? [`GPA: ${edu.gpa}`] : []),
                  ...(edu.highlights || []),
                ].filter(Boolean)}
              />
            ))}
          </HarvardSection>
        )}

        {/* ===== CERTIFICATES ===== */}
        {data.skills?.certifications && data.skills.certifications.length > 0 && (
          <HarvardSection title="Certificates">
            {data.skills.certifications.map((cert, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 3, paddingLeft: 16 }}>
                <Text style={{ fontSize: 10, width: 12 }}>•</Text>
                <Text style={{ fontSize: 10, flex: 1, fontWeight: 700 }}>{cert}</Text>
              </View>
            ))}
          </HarvardSection>
        )}

        {/* ===== PROJECTS ===== */}
        {data.projects?.length > 0 && (
          <HarvardSection title="Projects & Research">
            {data.projects.map((proj, i) => (
              <HarvardEntry
                key={i}
                title={proj.name}
                subtitle={proj.technologies ? `Technologies: ${proj.technologies}` : undefined}
                bullets={[
                  ...(proj.description ? [proj.description] : []),
                  ...(proj.highlights || []),
                ]}
              />
            ))}
          </HarvardSection>
        )}

        {/* ===== WORK EXPERIENCES ===== */}
        {data.experience?.length > 0 && (
          <HarvardSection title="Work Experiences">
            {data.experience.map((exp, i) => (
              <HarvardEntry
                key={i}
                title={exp.company}
                subtitle={exp.role}
                date={[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                bullets={exp.bullets}
              />
            ))}
          </HarvardSection>
        )}

        {/* ===== COMMUNITY SERVICE & SCHOOL CLUBS ===== */}
        {data.leadership?.length > 0 && (
          <HarvardSection title="Community Service & School Clubs">
            {data.leadership.map((lead, i) => (
              <HarvardEntry
                key={i}
                title={`${lead.organization}${lead.role ? ` – ${lead.role}` : ""}`}
                date={lead.period}
                bullets={lead.description ? [lead.description] : undefined}
              />
            ))}
          </HarvardSection>
        )}

        {/* ===== AWARDS & HONORS ===== */}
        {data.awards?.length > 0 && (
          <HarvardSection title="Awards & Honors">
            {data.awards.map((award, i) => (
              <HarvardEntry
                key={i}
                title={award.title}
                subtitle={award.issuer}
                date={award.date}
                bullets={award.description ? [award.description] : undefined}
              />
            ))}
          </HarvardSection>
        )}

        {/* ===== SKILLS & INTERESTS ===== */}
        {data.skills && (
          <HarvardSection title="Skills & Interests">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <View style={{ flexDirection: "row", marginBottom: 4, flexWrap: "wrap" }}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}>SKILLS: </Text>
                <Text style={{ fontSize: 10, flex: 1 }}>{data.skills.technical.join(", ")}</Text>
              </View>
            )}
            {data.skills.languages && data.skills.languages.length > 0 && (
              <View style={{ flexDirection: "row", marginBottom: 4, flexWrap: "wrap" }}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}>LANGUAGES: </Text>
                <Text style={{ fontSize: 10, flex: 1 }}>{data.skills.languages.join(", ")}</Text>
              </View>
            )}
            {data.skills.other && data.skills.other.length > 0 && (
              <View style={{ flexDirection: "row", marginBottom: 4, flexWrap: "wrap" }}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}>INTERESTS: </Text>
                <Text style={{ fontSize: 10, flex: 1 }}>{data.skills.other.join(", ")}</Text>
              </View>
            )}
          </HarvardSection>
        )}
      </Page>
    </Document>
  );
}
