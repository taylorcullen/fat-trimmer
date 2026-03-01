import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile, getPresignedUrl } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "30");
    const offset = parseInt(searchParams.get("offset") || "0");

    const photos = await prisma.photo.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.photo.count({
      where: { userId: session.user.id },
    });

    // Generate presigned URLs for each photo
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await getPresignedUrl(`photos/${photo.userId}/${photo.filename}`),
      }))
    );

    return NextResponse.json({ photos: photosWithUrls, total });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${uuidv4()}.${ext}`;
    const key = `photos/${session.user.id}/${filename}`;

    await uploadFile(key, buffer, file.type || "image/jpeg");

    const photo = await prisma.photo.create({
      data: {
        userId: session.user.id,
        filename,
        category: category || "front",
        date: date ? new Date(date) : new Date(),
      },
    });

    const url = await getPresignedUrl(key);

    return NextResponse.json({ ...photo, url }, { status: 201 });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
