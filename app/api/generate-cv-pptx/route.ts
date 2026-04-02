import { NextRequest, NextResponse } from "next/server";
import { generateOnePagePptx } from "@/lib/cv-pptx-template";
import type { CVData } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { extractedData } = body as { extractedData: CVData };

    if (!extractedData || !extractedData.personalInfo) {
      return NextResponse.json(
        { error: "CV verisi eksik." },
        { status: 400 }
      );
    }

    const pptx = generateOnePagePptx(extractedData);
    const output = await pptx.write({ outputType: "arraybuffer" });
    const buffer = new Uint8Array(output as ArrayBuffer);

    const safeName = (extractedData.personalInfo.fullName || "CV")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "_");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${safeName}_OnePage.pptx"`,
      },
    });
  } catch (error) {
    console.error("PPTX generation error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `PPTX oluşturulurken hata: ${msg}` },
      { status: 500 }
    );
  }
}
