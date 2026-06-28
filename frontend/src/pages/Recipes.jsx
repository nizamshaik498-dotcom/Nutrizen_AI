import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import { RecipeCardItem } from '../components/RecipeCard'
import { getPantry, addToPantry, removeFromPantry, clearPantry } from '../utils/pantry'
import { toggleFavorite, getFavorites } from '../utils/favorites'
import API from '../utils/api'

function flattenRecipes(data) {
  const items = []
  if (data?.result?.recipes) {
    const r = data.result.recipes
    if (r.easy) items.push({ ...r.easy, difficulty: 'easy' })
    if (r.intermediate) items.push({ ...r.intermediate, difficulty: 'intermediate' })
    if (r.advanced) items.push({ ...r.advanced, difficulty: 'advanced' })
  }
  return items
}

export default function Recipes() {
  const { t } = useTranslation()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [favorites, setFavorites] = useState(getFavorites())
  const [pantry, setPantry] = useState(getPantry)
  const [showPantry, setShowPantry] = useState(false)
  const [pantryFilter, setPantryFilter] = useState('All')
  const [pantryInput, setPantryInput] = useState('')
  const [prepTime, setPrepTime] = useState('any')
  const [diet, setDiet] = useState('all')
  const [season, setSeason] = useState('all')

  const dietKeywords = {
    vegetarian: ['chicken', 'fish', 'pork', 'beef', 'mutton', 'lamb', 'egg'],
    vegan: ['chicken', 'fish', 'pork', 'beef', 'mutton', 'lamb', 'egg', 'milk', 'cheese', 'butter', 'cream', 'yogurt', 'honey'],
    glutenFree: ['wheat', 'flour', 'bread', 'pasta', 'noodles', 'soy sauce', 'couscous', 'barley'],
    lowCarb: ['rice', 'pasta', 'noodles', 'bread', 'flour', 'sugar', 'potato', 'sweet potato'],
  }

  const seasonIngredients = {
    spring: ['asparagus', 'artichoke', 'peas', 'radish', 'spinach', 'strawberry', 'lettuce'],
    summer: ['tomato', 'cucumber', 'bell pepper', 'corn', 'eggplant', 'zucchini', 'basil', 'watermelon', 'berries'],
    fall: ['pumpkin', 'squash', 'apple', 'pear', 'mushroom', 'sweet potato', 'broccoli', 'cauliflower'],
    winter: ['kale', 'cabbage', 'carrot', 'potato', 'onion', 'garlic', 'ginger', 'citrus', 'beet'],
  }

  function getRecipeText(r) {
    return [r.name || '', ...(r.additional_ingredients_required || []), ...(r.steps || [])].join(' ').toLowerCase()
  }

  function matchesDiet(recipeText, dietType) {
    const keywords = dietKeywords[dietType]
    if (!keywords) return true
    return !keywords.some(kw => recipeText.includes(kw))
  }

  function matchesSeason(recipeText, seasonType) {
    const keywords = seasonIngredients[seasonType]
    if (!keywords) return true
    return keywords.some(kw => recipeText.includes(kw))
  }

  const difficultyConfig = {
    easy: { label: t('recipes.easy'), badge: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300', header: 'from-lime-500 to-lime-600' },
    intermediate: { label: t('recipes.intermediate'), badge: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300', header: 'from-lime-500 to-lime-600' },
    advanced: { label: t('recipes.advanced'), badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300', header: 'from-red-500 to-red-600' },
  }

  useEffect(() => {
    fetch(`${API}/api/scan/demo`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`)
        return res.json()
      })
      .then(data => { setRecipes(flattenRecipes(data)); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const recipeMatchScores = useMemo(() => {
    if (pantry.length === 0) return recipes.map(r => ({ ...r, matchScore: 0 }))
    return recipes.map(r => {
      const ingredients = r.additional_ingredients_required || []
      if (ingredients.length === 0) return { ...r, matchScore: 0 }
      const matched = ingredients.filter(ing =>
        pantry.some(p => ing.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(ing.toLowerCase()))
      ).length
      return { ...r, matchScore: Math.round((matched / ingredients.length) * 100) }
    })
  }, [recipes, pantry])

  const filtered = recipeMatchScores.filter(r => {
    if (filter !== 'All' && r.difficulty !== filter.toLowerCase()) return false
    if (pantryFilter === 'Pantry Match (High)' && r.matchScore < 50) return false
    if (pantryFilter === 'Pantry Match (Low)' && (r.matchScore < 1 || r.matchScore >= 50)) return false
    if (search) {
      const q = search.toLowerCase()
      const nameMatch = r.name.toLowerCase().includes(q)
      const ingMatch = r.additional_ingredients_required?.some(i => i.toLowerCase().includes(q))
      if (!nameMatch && !ingMatch) return false
    }
    if (prepTime !== 'any') {
      const t = r.total_time_minutes
      if (prepTime === 'under15' && (t >= 15 || t == null)) return false
      if (prepTime === 'under30' && (t >= 30 || t == null)) return false
      if (prepTime === 'over30' && (t < 30 || t == null)) return false
    }
    if (diet !== 'all') {
      const text = getRecipeText(r)
      if (!matchesDiet(text, diet)) return false
    }
    if (season !== 'all') {
      const text = getRecipeText(r)
      if (!matchesSeason(text, season)) return false
    }
    return true
  })

  const levels = [
    { key: 'All', label: t('recipes.all') },
    { key: 'Easy', label: t('recipes.easy') },
    { key: 'Intermediate', label: t('recipes.intermediate') },
    { key: 'Advanced', label: t('recipes.advanced') },
  ]

  const pantryMatchOptions = ['All', 'Pantry Match (High)', 'Pantry Match (Low)']

  const handleSave = (name) => {
    toggleFavorite(name)
    setFavorites([...getFavorites()])
  }

  const handleAddPantry = () => {
    if (!pantryInput.trim()) return
    const updated = addToPantry(pantryInput.trim())
    setPantry([...updated])
    setPantryInput('')
  }

  const handleRemovePantry = (item) => {
    const updated = removeFromPantry(item)
    setPantry([...updated])
  }

  const handleClearPantry = () => {
    clearPantry()
    setPantry([])
  }

  const handleClearFilters = () => {
    setFilter('All')
    setSearch('')
    setPantryFilter('All')
    setPrepTime('any')
    setDiet('all')
    setSeason('all')
  }

  const activeFilters = []
  if (filter !== 'All') activeFilters.push(`Difficulty: ${filter}`)
  if (prepTime !== 'any') activeFilters.push({ under15: 'Prep: <15 min', under30: 'Prep: <30 min', over30: 'Prep: >30 min' }[prepTime])
  if (diet !== 'all') activeFilters.push(`Diet: ${diet.charAt(0).toUpperCase() + diet.slice(1)}`)
  if (season !== 'all') activeFilters.push(`Season: ${season.charAt(0).toUpperCase() + season.slice(1)}`)
  if (pantryFilter !== 'All') activeFilters.push(pantryFilter)
  if (search) activeFilters.push(`Search: "${search}"`)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-lime-600 via-lime-500 to-lime-400 rounded-2xl mb-8">
          <div className="absolute inset-0 bg-white/5" />
          <div className="relative h-48 flex items-center justify-center">
            <div className="flex items-center gap-3 text-white">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-30" />
                <div className="absolute inset-0 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
              </div>
              <span className="text-lg font-bold">{t('recipes.loading')}</span>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden shadow-sm">
              <div className="h-20 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded-lg animate-shimmer w-3/4" />
                <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded animate-shimmer w-1/2" />
                <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded animate-shimmer w-full" />
                <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded animate-shimmer w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-lime-600 via-lime-500 to-lime-400 rounded-2xl mb-8">
          <div className="absolute inset-0 bg-white/5" />
          <div className="relative h-48 flex items-center justify-center">
            <h1 className="text-4xl font-extrabold text-white">{t('recipes.title')}</h1>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-8 text-center shadow-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-700 dark:text-red-300 font-bold text-lg mb-1">{t('recipes.failedToLoad')}</p>
          <p className="text-red-500 dark:text-red-400 text-sm mb-5">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 btn-glass btn-glass-lime rounded-xl active:scale-[0.98]">{t('recipes.tryAgain')}</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO title="Explore Recipes" description="Browse AI-generated recipes from scanned vegetables. Filter by difficulty, diet, prep time, and season." />
      <div className="animate-fadeIn">
      <div className="relative overflow-hidden bg-gradient-to-br from-lime-600 via-lime-500 to-lime-400 animate-gradient py-20 md:py-28">
        <div className="absolute inset-0 bg-white/5" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 text-6xl animate-float">🍳</div>
          <div className="absolute top-20 right-20 text-5xl animate-float stagger-2">🥘</div>
          <div className="absolute bottom-16 left-1/4 text-4xl animate-float stagger-3">🥗</div>
          <div className="absolute top-1/3 right-1/4 text-5xl animate-float stagger-4">🍝</div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight drop-shadow-sm">{t('recipes.title')}</h1>
          <p className="text-lg text-emerald-100/90 leading-relaxed max-w-xl mx-auto font-medium">
            {t('recipes.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`${t('recipes.searchHint')} — add pantry items to see matches`}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 rounded-xl text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all duration-200 shadow-sm placeholder:text-stone-400 dark:placeholder:text-stone-500"
            />
          </div>
          <button
            onClick={() => setShowPantry(!showPantry)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 active:scale-[0.98] ${showPantry ? 'bg-lime-500 text-white border-lime-500 shadow-md shadow-lime-500/20 ring-1 ring-lime-500/20' : 'bg-white dark:bg-stone-800/90 text-stone-600 dark:text-stone-300 border-stone-200/80 dark:border-stone-700/60 hover:border-lime-300 dark:hover:border-lime-600 hover:shadow-sm'}`}
          >
            🧺 {t('recipes.myPantry')}
          </button>
        </div>

        {showPantry && (
          <div className="glass-card rounded-2xl p-5 mb-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-700 dark:text-stone-200">🧺 {t('recipes.myPantry')}</h3>
              {pantry.length > 0 && (
                <button onClick={handleClearPantry} className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold transition-colors">{t('shoppingList.clearAll')}</button>
              )}
            </div>

            {pantry.length === 0 ? (
              <p className="text-sm text-stone-400 dark:text-stone-500 mb-4">{t('recipes.pantryEmpty')}</p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-4">
                {pantry.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-lime-50 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300 border border-lime-200/80 dark:border-lime-700/60 px-3 py-1.5 rounded-full font-semibold shadow-sm">
                    {item}
                    <button onClick={() => handleRemovePantry(item)} className="hover:text-red-500 dark:hover:text-red-400 transition-colors leading-none text-base">×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <input
                value={pantryInput}
                onChange={e => setPantryInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPantry()}
                placeholder={t('recipes.addPantryHint')}
                className="flex-1 px-3 py-2 bg-stone-50 dark:bg-stone-700/50 border border-stone-200/80 dark:border-stone-600/60 rounded-lg text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all duration-200"
              />
              <button onClick={handleAddPantry} className="px-4 py-2 btn-glass btn-glass-lime rounded-lg text-sm active:scale-[0.98]">{t('shoppingList.addItem')}</button>
            </div>

            {pantry.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">{t('recipes.pantryMatch')}</p>
                <div className="flex flex-wrap gap-2">
                  {pantryMatchOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setPantryFilter(option)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-200 ${pantryFilter === option ? 'bg-lime-500 text-white border-lime-500 shadow-sm ring-1 ring-lime-500/20' : 'bg-white dark:bg-stone-700 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:border-lime-300 dark:hover:border-lime-600 hover:shadow-sm'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
          <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">
            <span className="font-bold text-stone-700 dark:text-stone-200">{filtered.length}</span> {t('recipes.recipeAvailable', { count: filtered.length })}
          </p>
          <div className="flex flex-wrap gap-2">
            {levels.map(level => (
              <button key={level.key} onClick={() => setFilter(level.key)} className={`px-4 py-1.5 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-[0.97] ${filter === level.key ? 'bg-gradient-to-r from-lime-500 to-lime-600 text-white border-lime-500 shadow-md ring-1 ring-lime-500/20' : 'bg-white dark:bg-stone-800/90 text-stone-600 dark:text-stone-300 border-stone-200/80 dark:border-stone-700/60 hover:border-lime-300 dark:hover:border-lime-600 hover:text-lime-600 dark:hover:text-lime-400 hover:shadow-sm'}`}>
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 p-3 glass-card rounded-2xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mr-1">{t('filters.prepTime')}:</span>
            {[{ key: 'any', label: t('filters.anyTime') }, { key: 'under15', label: t('filters.under15') }, { key: 'under30', label: t('filters.under30') }, { key: 'over30', label: t('filters.over30') }].map(opt => (
              <button key={opt.key} onClick={() => setPrepTime(opt.key)} className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-200 active:scale-[0.97] ${prepTime === opt.key ? 'bg-lime-500 text-white border-lime-500 shadow-sm ring-1 ring-lime-500/20' : 'bg-white dark:bg-stone-700 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:border-lime-300 dark:hover:border-lime-600 hover:shadow-sm'}`}>
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mr-1">{t('filters.diet')}:</span>
            {[{ key: 'all', label: 'All' }, { key: 'vegetarian', label: t('filters.vegetarian') }, { key: 'vegan', label: t('filters.vegan') }, { key: 'glutenFree', label: t('filters.glutenFree') }, { key: 'lowCarb', label: t('filters.lowCarb') }].map(opt => (
              <button key={opt.key} onClick={() => setDiet(opt.key)} className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-200 active:scale-[0.97] ${diet === opt.key ? 'bg-lime-500 text-white border-lime-500 shadow-sm ring-1 ring-lime-500/20' : 'bg-white dark:bg-stone-700 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:border-lime-300 dark:hover:border-lime-600 hover:shadow-sm'}`}>
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mr-1">{t('filters.season')}:</span>
            {[{ key: 'all', label: t('filters.allSeasons') }, { key: 'spring', label: t('filters.spring') }, { key: 'summer', label: t('filters.summer') }, { key: 'fall', label: t('filters.fall') }, { key: 'winter', label: t('filters.winter') }].map(opt => (
              <button key={opt.key} onClick={() => setSeason(opt.key)} className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-200 active:scale-[0.97] ${season === opt.key ? 'bg-lime-500 text-white border-lime-500 shadow-sm ring-1 ring-lime-500/20' : 'bg-white dark:bg-stone-700 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:border-lime-300 dark:hover:border-lime-600 hover:shadow-sm'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl shadow-sm">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-lime-50 to-lime-50 dark:from-lime-900/40 dark:to-lime-900/40 border-2 border-lime-200 dark:border-lime-700/50 flex items-center justify-center text-4xl shadow-lg">
              🔍
            </div>
            <p className="text-xl font-bold text-stone-700 dark:text-stone-200 mb-2">No recipes found</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-sm mx-auto leading-relaxed">Try adjusting your filters or search terms to discover more recipes</p>
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {activeFilters.map((f, i) => (
                  <span key={i} className="text-xs bg-stone-100 dark:bg-stone-700/60 text-stone-500 dark:text-stone-400 px-3 py-1.5 rounded-full font-medium border border-stone-200 dark:border-stone-600">
                    {f}
                  </span>
                ))}
              </div>
            )}
            <button onClick={handleClearFilters} className="inline-flex items-center gap-2 btn-glass btn-glass-lime px-6 py-3 rounded-xl active:scale-[0.98] text-sm">
              ✕ Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, i) => {
              const config = difficultyConfig[r.difficulty] || difficultyConfig.easy
              const isExpanded = expanded === i
              const isFav = favorites.includes(r.name)
              return (
                <RecipeCardItem
                  key={i}
                  r={r}
                  level={r.difficulty}
                  config={config}
                  isExpanded={isExpanded}
                  onToggleExpand={() => setExpanded(isExpanded ? null : i)}
                  isFav={isFav}
                  onSave={handleSave}
                  pantry={pantry}
                  showPantryMatch
                  showActions
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
    </>
  )
}
