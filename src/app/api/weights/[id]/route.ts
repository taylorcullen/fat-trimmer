import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weight = await prisma.weight.findUnique({
      where: { id: params.id },
    });

    if (!weight) {
      return NextResponse.json({ error: "Weight not found" }, { status: 404 });
    }

    if (weight.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.weight.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting weight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weight = await prisma.weight.findUnique({
      where: { id: params.id },
    });

    if (!weight) {
      return NextResponse.json({ error: "Weight not found" }, { status: 404 });
    }

    if (weight.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { weightKg, date, notes } = body;

    const updated = await prisma.weight.update({
      where: { id: params.id },
      data: {
        ...(weightKg && { weightKg }),
        ...(date && { date: new Date(date) }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating weight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
