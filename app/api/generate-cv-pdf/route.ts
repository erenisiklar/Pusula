import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { OnePageCVDocument, HarvardCVDocument } from "@/lib/cv-pdf-templates";
import type { CVData } from "@/lib/gemini";
import React from "react";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { extractedData, variant } = body as {
      extractedData: CVData;
      variant: "onepage" | "harvard";
    };

    if (!extractedData || !extractedData.personalInfo) {
      return NextResponse.json(
        { error: "CV verisi eksik. Lutfen once CV olusturun." },
        { status: 400 }
      );
    }

    const doc =
      variant === "harvard"
        ? React.createElement(HarvardCVDocument, { data: extractedData })
        : React.createElement(OnePageCVDocument, { data: extractedData });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(doc as any);

    const fileName =
      variant === "harvard"
        ? `${extractedData.personalInfo.fullName || "CV"}_Harvard.pdf`
        : `${extractedData.personalInfo.fullName || "CV"}_OnePage.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `PDF olusturulurken hata: ${msg}` },
      { status: 500 }
    );
  }
}
