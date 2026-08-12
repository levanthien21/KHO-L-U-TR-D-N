import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", "tools");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save the file
    // To prevent overwriting and handle filenames safely, we can prepend a timestamp
    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const path = join(uploadDir, safeFilename);

    await writeFile(path, buffer);

    return NextResponse.json({ 
      success: true, 
      message: "File uploaded successfully",
      fileUrl: `/uploads/tools/${safeFilename}`,
      fileName: file.name
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
  }
}
