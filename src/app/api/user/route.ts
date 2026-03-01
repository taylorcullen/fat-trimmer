import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        heightCm: true,
        goalWeightKg: true,
        unitSystem: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { heightCm, goalWeightKg, unitSystem } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(heightCm !== undefined && { heightCm: heightCm ? parseFloat(heightCm) : null }),
        ...(goalWeightKg !== undefined && { goalWeightKg: goalWeightKg ? parseFloat(goalWeightKg) : null }),
        ...(unitSystem !== undefined && { unitSystem }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        heightCm: true,
        goalWeightKg: true,
        unitSystem: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
