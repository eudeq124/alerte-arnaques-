export default function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://alerte-arnaques.vercel.app';
  
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/reports`, lastModified: new Date() },
    { url: `${baseUrl}/journal`, lastModified: new Date() },
    { url: `${baseUrl}/tips`, lastModified: new Date() },
    { url: `${baseUrl}/identities`, lastModified: new Date() },
    { url: `${baseUrl}/social-scanner`, lastModified: new Date() },
    { url: `${baseUrl}/deepfake-detector`, lastModified: new Date() },
    { url: `${baseUrl}/legal`, lastModified: new Date() },
  ];
}
