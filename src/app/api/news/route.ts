import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 20
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
