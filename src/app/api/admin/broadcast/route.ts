import { NextResponse } from "next/server";
import { broadcastAlert } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    await broadcastAlert("ALERTE CYBER-ARNAQUE EN COURS", title, content);

    return NextResponse.json({ message: "Alerte diffusée avec succès" });
  } catch (error) {
    console.error("BROADCAST_ERROR", error);
    return NextResponse.json({ error: "Erreur lors de la diffusion" }, { status: 500 });
  }
}
