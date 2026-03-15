import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reportsWithoutInv = await (prisma.report as any).findMany({
      where: { investigation: null },
    });

    // Nettoyage : On ne génère plus d'investigations bidon
    // Les investigations sont maintenant créées RÉELLEMENT lors de chaque signalement.

    const investigations = await (prisma as any).investigation.findMany({
      include: { report: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ investigations });
  } catch (error) {
    console.error("EXPERT_API_ERROR:", error);
    return NextResponse.json({ error: "Erreur récupération investigations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { investigationId, adminNotes, isHandled, status } = await req.json();
    
    // Récupérer l'investigation actuelle pour les logs
    const current = await (prisma as any).investigation.findUnique({ where: { id: investigationId } });
    if (!current) return NextResponse.json({ error: "Intervigation introuvable" }, { status: 404 });

    const newLog = { action: status || "UPDATE", adminNotes, timestamp: new Date().toISOString() };
    let logs = [];
    try { logs = JSON.parse(current.logs || '[]'); } catch (e) { logs = []; }
    if (!Array.isArray(logs)) logs = [];
    logs.push(newLog);

    const updated = await (prisma as any).investigation.update({
      where: { id: investigationId },
      data: { 
        adminNotes, 
        isHandled: isHandled ?? (status ? true : undefined),
        status: status || undefined,
        logs: JSON.stringify(logs)
      },
      include: { report: true }
    });

    // --- SYSTÈME DE RÉPUTATION (RÉCOMPENSE) ---
    if (status === "BANNED" || status === "PROSECUTED") {
        const report = updated.report;
        if (report.reporterId) {
            const reporter = await (prisma as any).certifiedUser.findUnique({ where: { id: report.reporterId } });
            if (reporter) {
                const newPoints = reporter.points + 20;
                let newRank = reporter.rank;
                if (newPoints >= 500) newRank = "ÉLITE";
                else if (newPoints >= 100) newRank = "EXPERT";

                await (prisma as any).certifiedUser.update({
                    where: { id: report.reporterId },
                    data: { 
                        points: newPoints,
                        rank: newRank
                    }
                });
                console.log(`[REPUTATION] +20 points pour ${reporter.firstName} (Total: ${newPoints})`);
            }
        }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("ADMIN_DECISION_ERROR:", error);
    return NextResponse.json({ error: "Erreur mise à jour décision" }, { status: 500 });
  }
}
