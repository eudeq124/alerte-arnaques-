import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.certifiedUser.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération KYC" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, isCertified } = await req.json();
    const updated = await prisma.certifiedUser.update({
      where: { id: userId },
      data: { isCertified }
    });

    // Notify user via simulated mail
    await prisma.notification.create({
      data: {
        type: "Mail",
        subject: isCertified ? "✅ Votre identité est certifiée !" : "❌ Dossier d'identité rejeté",
        message: isCertified 
          ? "Félicitations ! Vous êtes désormais un signaleur certifié. Vos alertes auront un impact maximal."
          : "Votre dossier n'a pas pu être validé. Veuillez renvoyer des photos plus nettes.",
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erreur mise à jour KYC" }, { status: 500 });
  }
}
