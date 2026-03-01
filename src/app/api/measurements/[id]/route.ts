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

    const measurement = await prisma.measurement.findUnique({
      where: { id: params.id },
    });

    if (!measurement) {
      return NextResponse.json({ error: "Measurement not found" }, { status: 404 });
    }

    if (measurement.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.measurement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting measurement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
