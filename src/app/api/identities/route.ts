import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../auth/[...nextauth]/route";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as any)?.role === "ADMIN";
}

export async function GET() {
  try {
    const identities = await prisma.identity.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(identities);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Interdit" }, { status: 403 });

  try {
    const { name, type, imageUrl, description } = await req.json();
    const identity = await prisma.identity.create({
      data: { name, type, imageUrl, description, isVerified: true },
    });
    return NextResponse.json(identity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
