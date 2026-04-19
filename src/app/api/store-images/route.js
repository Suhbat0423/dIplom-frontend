import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const getSafeExtension = (file) => {
  const extension = extname(file.name || "").toLowerCase();

  if (extension) {
    return extension;
  }

  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  return ".jpg";
};

export async function POST(request) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!image || typeof image === "string") {
    return NextResponse.json(
      { message: "Image file is required." },
      { status: 400 },
    );
  }

  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json(
      { message: "Use PNG, JPG, or WEBP images only." },
      { status: 400 },
    );
  }

  if (image.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { message: "Image must be 5MB or smaller." },
      { status: 400 },
    );
  }

  const uploadsDir = join(process.cwd(), "public", "uploads", "stores");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}${getSafeExtension(image)}`;
  const filePath = join(uploadsDir, filename);
  const bytes = await image.arrayBuffer();

  await writeFile(filePath, Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/stores/${filename}` });
}
