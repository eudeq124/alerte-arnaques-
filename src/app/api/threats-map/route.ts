import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Récupération de tous les rapports avec une région
    const reports = await prisma.report.findMany({
      where: {
        region: { not: null }
      },
      select: {
        region: true
      }
    });

    // Agrégation manuelle pour éviter les soucis de typage complexe sur groupBy
    const stats: Record<string, number> = {};
    reports.forEach(r => {
      const region = (r as any).region as string;
      stats[region] = (stats[region] || 0) + 1;
    });

    // Mapping des régions vers des coordonnées approximatives
    const regionCoords: Record<string, { x: number, y: number }> = {
      'Île-de-France': { x: 50, y: 35 },
      'PACA': { x: 65, y: 80 },
      'Occitanie': { x: 40, y: 80 },
      'Hauts-de-France': { x: 52, y: 15 },
      'Grand Est': { x: 75, y: 30 },
      'Nouvelle-Aquitaine': { x: 30, y: 65 },
      'Auvergne-Rhône-Alpes': { x: 60, y: 60 },
      'Bretagne': { x: 15, y: 35 },
      'Normandie': { x: 35, y: 25 },
      'Pays de la Loire': { x: 25, y: 45 },
      'Centre-Val de Loire': { x: 45, y: 45 },
      'Bourgogne-Franche-Comté': { x: 65, y: 45 },
    };

    const threats = Object.entries(stats).map(([name, count]) => ({
      id: name,
      name,
      count,
      x: regionCoords[name]?.x || 50,
      y: regionCoords[name]?.y || 50,
      type: "Multi-menaces"
    }));

    return NextResponse.json(threats);
  } catch (error) {
    console.error("THREATS_MAP_API_ERROR", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
