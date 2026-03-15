import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Connectez-vous pour voter" }, { status: 401 });
    }

    const { reportId } = await req.json();

    if (!reportId) {
      return NextResponse.json({ error: "ID du signalement manquant" }, { status: 400 });
    }

    // Retreive user from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
       return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Check if upvote already exists
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        reportId_userId: {
          reportId: reportId,
          userId: user.id,
        },
      },
    });

    if (existingUpvote) {
      // Remove upvote if already voted (Toggle)
      await prisma.upvote.delete({
        where: { id: existingUpvote.id },
      });
      return NextResponse.json({ message: "Vote retiré" }, { status: 200 });
    } else {
      // Add upvote
      await prisma.upvote.create({
        data: {
          reportId,
          userId: user.id,
        },
      });
      return NextResponse.json({ message: "Vote ajouté" }, { status: 201 });
    }
  } catch (error) {
    console.error("Erreur upvote:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
