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

    const weights = await prisma.weight.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.weight.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ weights, total });
  } catch (error) {
    console.error("Error fetching weights:", error);
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
    const { weightKg, date, notes } = body;

    if (!weightKg || typeof weightKg !== "number") {
      return NextResponse.json({ error: "Weight is required" }, { status: 400 });
    }

    const weight = await prisma.weight.create({
      data: {
        userId: session.user.id,
        weightKg,
        date: date ? new Date(date) : new Date(),
        notes: notes || null,
      },
    });

    return NextResponse.json(weight, { status: 201 });
  } catch (error) {
    console.error("Error creating weight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
