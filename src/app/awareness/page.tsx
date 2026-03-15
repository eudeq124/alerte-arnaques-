import Link from 'next/link';

export default function AwarenessPage() {
  const articles = [
    {
      id: 1,
      title: "Comment reconnaître un faux conseiller bancaire ?",
      excerpt: "Les arnaques au faux conseiller bancaire explosent. Découvrez les signes qui ne trompent pas (demande de validation d'opérations, transfert de fonds sécurisé, etc.) et comment réagir en cas de doute.",
      category: "Arnaque Bancaire"
    },
    {
      id: 2,
      title: "Les signes d'une fausse boutique en ligne",
      excerpt: "Des prix trop bas, l'absence de mentions légales, de conditions générales de vente ou un site créé récemment sont autant d'indicateurs d'un potentiel site frauduleux de e-commerce.",
      category: "Site Suspect"
    },
    {
      id: 3,
      title: "L'arnaque sentimentale sur les réseaux (Brouteurs)",
      excerpt: "Apprenez à déjouer les pièges des faux profils sur les sites de rencontre ou réseaux sociaux. S'ils vous demandent de l'argent après quelques semaines d'échanges virtuels passionnés, fuyez.",
      category: "Faux Profil"
    }
  ];

  return (
    <>
      <header className="flex-center" style={{ justifyContent: 'space-between' }}>
        <Link href="/" className="nav-brand">Alerte Arnaques</Link>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/reports" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Base de données</Link>
          <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Accueil</Link>
        </nav>
      </header>

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1>Sensibilisation & Prévention</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--secondary)' }}>
            Les arnaques évoluent en permanence. La meilleure défense reste l'information. 
            Découvrez nos guides pratiques pour repérer une arnaque avant de tomber dans le piège.
          </p>
        </div>

        <div className="grid">
          {articles.map(article => (
            <div key={article.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: 600 }}>
                  {article.category}
                </span>
                <h2 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>{article.title}</h2>
              </div>
              
              <p style={{ fontSize: '0.95rem', color: 'var(--foreground)', opacity: 0.9 }}>
                {article.excerpt}
              </p>

              <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--primary)', marginTop: 'auto', border: '1px solid var(--card-border)' }}>
                Lire le guide complet
              </button>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ marginTop: '4rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <h3 style={{ color: 'var(--success)' }}>Que faire si vous êtes victime ?</h3>
          <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '1rem auto', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Cessez immédiatement tout contact avec l'escroc.</li>
            <li>Ne payez jamais pour récupérer l'argent perdu (arnaque à la récupération de fonds).</li>
            <li>Conservez toutes les preuves (captures d'écran, emails, numéros, URL).</li>
            <li>Contactez rapidement votre banque pour bloquer les prélèvements ou votre carte.</li>
            <li>Déposez plainte auprès du commissariat, de la gendarmerie ou en ligne via les plateformes gouvernementales dédiées.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
