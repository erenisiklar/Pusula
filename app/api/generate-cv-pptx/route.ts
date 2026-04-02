import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { generateOnePagePptx } from "@/lib/cv-pptx-template";
import type { CVData } from "@/lib/gemini";

/**
 * Re-packages a PPTX buffer using DEFLATE compression.
 * pptxgenjs outputs STORE (no compression) which some tools like Canva reject.
 */
async function recompressWithDeflate(input: Buffer): Promise<Buffer> {
  const zip = await JSZip.loadAsync(input);
  const output = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
  return Buffer.from(output);
}

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
    const rawBuffer = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;

    // Re-compress with DEFLATE for Canva/PowerPoint compatibility
    const buffer = await recompressWithDeflate(rawBuffer);

    const safeName = (extractedData.personalInfo.fullName || "CV")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "_");

    return new NextResponse(new Uint8Array(buffer), {
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
