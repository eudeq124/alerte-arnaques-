import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      firstName, lastName, city, country, phone, 
      idCardPhoto, selfiePhoto, latitude, longitude, gmailAccount 
    } = data;

    if (!firstName || !lastName || !gmailAccount || !idCardPhoto || !selfiePhoto) {
      return NextResponse.json({ error: "Tous les justificatifs sont requis" }, { status: 400 });
    }

    const newUser = await prisma.certifiedUser.create({
      data: {
        firstName,
        lastName,
        city,
        country,
        phone,
        idCardPhoto,
        selfiePhoto,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        gmailAccount,
        isCertified: false, // Wait for admin review
      }
    });

    // Notify admin of new KYC request
    await prisma.notification.create({
      data: {
        type: "Mail",
        subject: `💳 Nouvelle demande de certification KYC : ${firstName} ${lastName}`,
        message: `L'utilisateur ${firstName} ${lastName} (${country}) a soumis son dossier de certification avec selfie et position GPS. Veuillez vérifier dans la console expert.`,
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
       return NextResponse.json({ error: "Ce compte Gmail est déjà enregistré." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
