import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // On ne partage que les signalements à haut score de vérité (CERTIFIED ou PROBABLE)
    // Et on anonymise les données sensibles
    const reports = await (prisma.report as any).findMany({
      where: {
        trustScore: { gte: 60 }
      },
      select: {
        id: true,
        title: true,
        scamType: true,
        scammerDetails: true,
        trustScore: true,
        verificationLevel: true,
        createdAt: true,
        // On NE PARTAGE PAS les IDs des plaignants ni leurs selfies
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return NextResponse.json({
      status: "success",
      source: "Alerte Arnaques Global DeepProtect Feed",
      lastUpdate: new Date().toISOString(),
      threatCount: reports.length,
      threats: reports
    });
  } catch (err) {
    return NextResponse.json({ error: "Flux indisponible" }, { status: 500 });
  }
}
