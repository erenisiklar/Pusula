import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 30;

function stripHtml(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

/** Returns true if robots.txt allows crawling the given path, false if disallowed. */
async function isAllowedByRobots(parsedUrl: URL): Promise<boolean> {
  const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(robotsUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Pusula/1.0" },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return true; // No robots.txt = allowed

    const text = await res.text();
    const path = parsedUrl.pathname || "/";

    // Parse relevant User-agent blocks (Pusula/1.0 and *)
    const lines = text.split(/\r?\n/);
    let activeBlock = false;
    let disallowedPaths: string[] = [];
    let catchAllDisallowedPaths: string[] = [];
    let inCatchAll = false;
    let inPusulaBlock = false;

    for (const raw of lines) {
      const line = raw.trim();
      if (line.startsWith("#") || line === "") {
        if (line === "") { activeBlock = false; inCatchAll = false; inPusulaBlock = false; }
        continue;
      }
      const [field, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const fieldLower = field.toLowerCase().trim();

      if (fieldLower === "user-agent") {
        if (value === "*") { inCatchAll = true; inPusulaBlock = false; activeBlock = true; }
        else if (value.toLowerCase().includes("pusula")) { inPusulaBlock = true; inCatchAll = false; activeBlock = true; }
        else { activeBlock = false; inCatchAll = false; inPusulaBlock = false; }
      } else if (fieldLower === "disallow" && activeBlock && value) {
        if (inPusulaBlock) disallowedPaths.push(value);
        else if (inCatchAll) catchAllDisallowedPaths.push(value);
      }
    }

    // Pusula-specific rules take precedence; fall back to catch-all
    const rules = disallowedPaths.length > 0 ? disallowedPaths : catchAllDisallowedPaths;
    for (const disallowed of rules) {
      if (path.startsWith(disallowed)) return false;
    }
    return true;
  } catch {
    return true; // On error, allow (fail-open for UX)
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY tanımlı değil." }, { status: 500 });
  }

  const body = await request.json();
  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Geçerli bir URL gerekli." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    return NextResponse.json(
      { error: "Geçersiz URL. http:// veya https:// ile başlayan bir adres girin." },
      { status: 400 }
    );
  }

  // robots.txt check
  const allowed = await isAllowedByRobots(parsedUrl);
  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "Bu site otomatik taramaya izin vermiyor (robots.txt). Üniversitenin resmi sitesini manuel olarak inceleyerek bilgileri kendiniz girebilirsiniz.",
        robotsBlocked: true,
      },
      { status: 403 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Pusula/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Site yüklenemedi (HTTP ${response.status}). URL doğru olduğundan ve kamuya açık olduğundan emin olun. Not: Bazı siteler bu işleme izin vermeyebilir.`,
        },
        { status: 400 }
      );
    }

    const html = await response.text();
    const plainText = stripHtml(html);
    const truncated = plainText.slice(0, 6000);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
    });

    const prompt = `You are analyzing a university or academic program webpage to help a student write a personalized motivation letter.

Webpage text:
${truncated}

Extract the most useful information for a motivation letter. Return ONLY valid JSON (no markdown, no code blocks):
{
  "mission": "1-2 sentences about the program's mission or academic focus (empty string if not found)",
  "keywords": ["5-8 key academic or research terms specific to this program"],
  "values": ["3-5 institutional values or priorities"],
  "uniqueAspects": ["2-4 distinctive features: research groups, teaching methods, partnerships, etc."]
}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    const insights = JSON.parse(text);
    return NextResponse.json({ insights });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "Site yüklenirken zaman aşımı (10s). URL erişilebilir olduğundan emin olun. Not: Bazı siteler bu işleme izin vermeyebilir.",
        },
        { status: 408 }
      );
    }
    console.error("Scrape error:", error);
    return NextResponse.json(
      {
        error:
          "Site taranırken hata oluştu. URL erişilebilir olduğundan emin olun. Not: Bazı siteler bu işleme izin vermeyebilir.",
      },
      { status: 500 }
    );
  }
}
