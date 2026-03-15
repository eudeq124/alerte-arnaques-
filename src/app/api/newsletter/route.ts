import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Check if already exists
    const existing = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ message: "Déjà inscrit !" }, { status: 200 });
    }

    await prisma.subscriber.create({
      data: { email }
    });

    return NextResponse.json({ message: "Inscription réussie !" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
