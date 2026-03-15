import Link from 'next/link';

export default function LegalPage() {
  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques</Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Accueil</Link>
        </nav>
      </header>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1>Mentions Légales & Confidentialité</h1>
          <p style={{ color: 'var(--secondary)' }}>Mis à jour le 15 Mars 2026</p>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <section>
            <h2>1. Éditeur du site</h2>
            <p>Le site "Alerte Arnaques" est une plateforme participative à but non lucratif hébergée sur Vercel.</p>
            <p>Contact : contact@alerte-arnaques.exemple.fr</p>
          </section>

          <section>
            <h2>2. Politique de confidentialité (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), les informations recueillies via le formulaire de signalement sont utilisées uniquement dans le cadre de la prévention des arnaques.</p>
            <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.</p>
          </section>

          <section>
            <h2>3. Modération et responsabilité</h2>
            <p>Les témoignages publiés sur cette plateforme sont soumis par des utilisateurs anonymes ou identifiés. <strong>Une modération a priori</strong> est effectuée pour éviter la diffamation et les fausses accusations.</p>
            <p>Le site ne saurait être tenu responsable des propos tenus par les internautes en l'absence de vérification complète des faits par les autorités compétentes.</p>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--danger)', marginTop: '1rem' }}>
              <strong>Avertissement :</strong> La dénonciation calomnieuse est punie par la loi. Ne postez que des informations vraies et vérifiables.
            </div>
          </section>

          <section>
            <h2>4. Droit de Réponse</h2>
            <p>Toute personne physique ou morale nommée ou désignée dans un signalement dispose d'un droit de réponse en vertu de la loi sur la liberté de la presse et de la LCEN.</p>
            <p>Pour exercer ce droit ou demander le retrait d'un contenu que vous estimez diffamatoire, veuillez utiliser notre formulaire de contact ou nous écrire à contact@alerte-arnaques.exemple.fr en joignant les justificatifs nécessaires.</p>
            <button className="btn" style={{ marginTop: '1rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }}>
              Demander un retrait / Droit de réponse
            </button>
          </section>

        </div>
      </div>
    </>
  );
}
