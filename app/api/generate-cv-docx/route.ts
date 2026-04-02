import { NextRequest, NextResponse } from "next/server";
import { Packer } from "docx";
import { generateHarvardDocx } from "@/lib/cv-docx-template";
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

    const doc = generateHarvardDocx(extractedData);
    const buffer = await Packer.toBuffer(doc);

    const safeName = (extractedData.personalInfo.fullName || "CV")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "_");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}_Harvard.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX generation error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `DOCX oluşturulurken hata: ${msg}` },
      { status: 500 }
    );
  }
}
