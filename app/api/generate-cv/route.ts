import { NextRequest, NextResponse } from "next/server";
import { generateCV } from "@/lib/claude";

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

    const validFields = ["business", "engineering", "other"];
    const field = validFields.includes(targetField) ? targetField : "other";

    const result = await generateCV({
      rawContent: rawContent.trim(),
      targetField: field,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("CV generation error:", error);
    return NextResponse.json(
      { error: "CV olusturulurken bir hata olustu. Lutfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
