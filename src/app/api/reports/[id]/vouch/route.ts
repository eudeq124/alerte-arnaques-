import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId } = await req.json(); // CertifiedUser ID

    if (!userId) return NextResponse.json({ error: "Identification requise" }, { status: 400 });

    const user = await prisma.certifiedUser.findUnique({ where: { id: userId } });
    if (!user || !user.isCertified) {
        return NextResponse.json({ error: "Seuls les membres Gold peuvent confirmer une arnaque" }, { status: 403 });
    }

    // Add vouch
    await prisma.vouch.create({
      data: {
        reportId: id,
        userId: userId
      }
    });

    // Update report trust score
    const report = await prisma.report.findUnique({ 
        where: { id: id },
        include: { _count: { select: { vouches: true } } }
    });

    if (report) {
        const newScore = Math.min(100, report.trustScore + 15);
        await prisma.report.update({
            where: { id: id },
            data: { 
                trustScore: newScore,
                verificationLevel: newScore >= 85 ? "CERTIFIED" : newScore >= 60 ? "PROBABLE" : "SUSPECT"
            }
        });
    }

    return NextResponse.json({ success: true, message: "Signalement confirmé par vos soins." });
  } catch (error) {
    return NextResponse.json({ error: "Vous avez déjà confirmé ce signalement" }, { status: 400 });
  }
}
