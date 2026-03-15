import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const advisories = await prisma.securityAdvisory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(advisories);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content, category, level } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const advisory = await prisma.securityAdvisory.create({
      data: { title, content, category: category || "GENERAL", level: level || "INFO" }
    });

    return NextResponse.json(advisory);
  } catch (error) {
    console.error("ADVISORY_POST_ERROR", error);
    return NextResponse.json({ error: "Erreur lors de la création de l'avis" }, { status: 500 });
  }
}
