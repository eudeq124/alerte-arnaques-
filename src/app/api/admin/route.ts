import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

// Check if the logged-in user is an admin via JWT role
async function requireAdmin() {
  const session = await auth();
  // The role is injected by the JWT callback in auth route
  return (session?.user as any)?.role === "ADMIN";
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Interdit" }, { status: 403 });

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
        _count: { select: { vouches: true, upvotes: true } }
    }
  });
  return NextResponse.json(reports);
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Interdit" }, { status: 403 });

  const { id, isVerified } = await req.json();
  const report = await prisma.report.update({
    where: { id },
    data: { isVerified },
  });
  return NextResponse.json(report);
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Interdit" }, { status: 403 });

  const { id } = await req.json();
  await prisma.report.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
