import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get("reportId");

  if (!reportId) return NextResponse.json({ error: "reportId requis" }, { status: 400 });

  try {
    const comments = await prisma.comment.findMany({
      where: { reportId },
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { reportId, content, author } = await req.json();

    if (!reportId || !content) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        author: author || "Anonyme",
        reportId
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
