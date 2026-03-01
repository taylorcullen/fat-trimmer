import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "30");
    const offset = parseInt(searchParams.get("offset") || "0");

    const measurements = await prisma.measurement.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.measurement.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ measurements, total });
  } catch (error) {
    console.error("Error fetching measurements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, chestCm, waistCm, hipsCm, armCm, thighCm } = body;

    const measurement = await prisma.measurement.create({
      data: {
        userId: session.user.id,
        date: date ? new Date(date) : new Date(),
        chestCm: chestCm || null,
        waistCm: waistCm || null,
        hipsCm: hipsCm || null,
        armCm: armCm || null,
        thighCm: thighCm || null,
      },
    });

    return NextResponse.json(measurement, { status: 201 });
  } catch (error) {
    console.error("Error creating measurement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
