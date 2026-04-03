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
        { error: `Site yüklenemedi (HTTP ${response.status}). URL'nin doğru olduğundan emin olun.` },
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
        { error: "Site yüklenirken zaman aşımı (10s). URL erişilebilir olduğundan emin olun." },
        { status: 408 }
      );
    }
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Site taranırken hata oluştu. URL erişilebilir olduğundan emin olun." },
      { status: 500 }
    );
  }
}
