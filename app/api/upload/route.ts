import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // Tải file trực tiếp lên Vercel Blob Cloud
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Có thể thêm tính năng tự động tạo UUID tránh trùng lặp tên nếu cần: 
      // addRandomSuffix: true (mặc định đã là true)
    });

    return NextResponse.json({ 
      success: true, 
      message: "File uploaded successfully",
      fileUrl: blob.url,
      fileName: file.name
    });

  } catch (error: any) {
    console.error("Error uploading file to Vercel Blob:", error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Failed to upload file. Please check BLOB_READ_WRITE_TOKEN." 
    }, { status: 500 });
  }
}
