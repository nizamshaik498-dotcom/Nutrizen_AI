import { useEffect } from 'react'

export default function SchemaMarkup({ recipes }) {
  useEffect(() => {
    if (!recipes) return

    const levels = ['easy', 'intermediate', 'advanced']
    const items = levels.reduce((acc, level) => {
      const r = recipes[level]
      if (r) acc.push(r)
      return acc
    }, [])

    if (items.length === 0) return

    const graph = items.map(r => {
      const instructions = (r.steps || []).map(text => ({
        '@type': 'HowToStep',
        text,
      }))

      return {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: r.name,
        description: r.plating_suggestion || r.steps?.[0] || '',
        totalTime: `PT${r.total_time_minutes}M`,
        recipeYield: r.servings ? String(r.servings) : undefined,
        recipeIngredient: r.additional_ingredients_required || undefined,
        recipeInstructions: instructions.length > 0 ? instructions : undefined,
      }
    })

    const jsonld = graph.length === 1
      ? graph[0]
      : {
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'ItemList', itemListElement: graph.map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })) },
          ],
        }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonld, null, 2)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [recipes])

  return null
}
