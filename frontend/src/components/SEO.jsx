import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description }) {
  const siteName = 'NutriZen AI'
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const desc = description || 'AI-powered smart kitchen assistant. Scan vegetables, get recipes, nutrition, allergy info, and smart substitutions.'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  )
}
