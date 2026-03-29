import { NextRequest, NextResponse } from "next/server";
import { generateCVWithGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawContent, targetField } = body;

    if (!rawContent || !rawContent.trim()) {
      return NextResponse.json(
        { error: "CV icerigi bos olamaz. Lutfen icerik girin veya dosya yukleyin." },
        { status: 400 }
      );
    }

    if (rawContent.trim().length < 50) {
      return NextResponse.json(
        { error: "Yeterli icerik bulunamadi. Lutfen daha fazla bilgi girin." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "Gemini API anahtari yapilandirilmamis. Lutfen GEMINI_API_KEY env degiskenini kontrol edin." },
        { status: 500 }
      );
    }

    const validFields = ["business", "engineering", "other"] as const;
    const field = validFields.includes(targetField) ? targetField : "other";

    const result = await generateCVWithGemini({
      rawContent: rawContent.trim(),
      targetField: field,
    });

    return NextResponse.json({
      onePageCV: result.onePageCV,
      harvardCV: result.harvardCV,
      extractedData: result.extractedData,
    });
  } catch (error) {
    console.error("CV generation error:", error instanceof Error ? error.message : error);
    console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error instanceof Error ? error : {}), 2));

    let message = "CV olusturulurken bir hata olustu. Lutfen tekrar deneyin.";

    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("API_KEY")) {
        message = "Gemini API anahtari gecersiz. Lutfen GEMINI_API_KEY degerini kontrol edin.";
      } else if (error.message.includes("quota") || error.message.includes("rate")) {
        message = "API istek limiti asildi. Lutfen birkacdakika bekleyip tekrar deneyin.";
      } else if (error.message.includes("model")) {
        message = "Model bulunamadi. Lutfen API yapilandirmasini kontrol edin.";
      } else {
        message = `Hata: ${error.message}`;
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
