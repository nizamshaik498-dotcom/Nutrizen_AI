import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addRecipeIngredientsToList } from '../utils/shoppingList'
import { toggleFavorite, isFavorite } from '../utils/favorites'
import { useTranslation } from 'react-i18next'
import VideoSection from './VideoSection'
import PersonalizationBar, { getAgeGroup } from './PersonalizationBar'
import ShareButton from './ShareButton'

/**
 * Scales a single ingredient text by a numeric factor.
 */
function scaleIngredient(text, factor) {
  if (factor === 1) return text
  const match = text.match(/^(\d+)(?:\s*\/\s*(\d+))?(\.\d+)?\s*(.*)$/)
  if (!match) return text
  let num, rest
  if (match[2]) {
    num = parseInt(match[1], 10) / parseInt(match[2], 10)
    rest = match[4]
  } else if (match[3]) {
    num = parseFloat(match[1] + match[3])
    rest = match[4]
  } else if (match[1]) {
    num = parseInt(match[1], 10)
    rest = match[4]
  } else {
    return text
  }
  const scaled = num * factor
  const formatted = Number.isInteger(scaled) ? String(Math.round(scaled)) : scaled.toFixed(1).replace(/\.0$/, '')
  return `${formatted} ${rest}`.trim()
}

/**
 * Groups steps into batches of 3 for display.
 */
function stepGroups(steps) {
  if (!steps) return []
  const groups = []
  for (let i = 0; i < steps.length; i += 3) {
    groups.push(steps.slice(i, i + 3))
  }
  return groups
}

/**
 * Individual recipe card used by both the scan-results section wrapper
 * and the Recipes page.
 *
 * Props:
 *   r              — Recipe object (required)
 *   config         — Styling config with keys: color|header (gradient),
 *                    step|badge (step indicator classes), label (display text)
 *   level          — Difficulty string ('easy'|'intermediate'|'advanced')
 *   showActions    — Show/hide bottom action buttons (default: false)
 *
 *   // Controlled expansion (parent manages expand/collapse)
 *   isExpanded     — Boolean (omit for internal state)
 *   onToggleExpand — Callback when expand toggle is clicked
 *
 *   // Controlled favorites (parent manages favorite state)
 *   isFav          — Boolean (omit for internal state)
 *   onSave         — Callback fn(name) when favorite is toggled
 *
 *   // Pantry match features (Recipes page)
 *   pantry         — Array of pantry item strings
 *   showPantryMatch— Show match-score badge in header
 */
export function RecipeCardItem({
  r,
  config,
  level,
  showActions,
  isExpanded: controlledExpanded,
  onToggleExpand,
  isFav: controlledIsFav,
  onSave,
  pantry,
  showPantryMatch,
}) {
  const { t } = useTranslation()
  const [internalShowAll, setInternalShowAll] = useState(false)
  const [internalFav, setInternalFav] = useState(isFavorite(r?.name))
  const [addedMsg, setAddedMsg] = useState('')
  const [servings, setServings] = useState(r?.servings || 2)
  const [unitSystem, setUnitSystem] = useState('metric')
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())

  const originalServings = r?.servings || 2
  const scaleFactor = servings / originalServings

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalShowAll
  const handleToggleExpand = onToggleExpand || (() => setInternalShowAll(s => !s))

  const isFav = controlledIsFav !== undefined ? controlledIsFav : internalFav
  const handleSave = onSave || ((name) => {
    setInternalFav(toggleFavorite(name))
  })

  if (!r) return null

  const headerGradient = config?.color || config?.header || 'from-lime-500 to-lime-600'
  const stepBadge = config?.step || config?.badge || 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300'
  const label = config?.label || level || ''

  const groups = stepGroups(r.steps)
  const displayedGroups = isExpanded ? groups : groups.slice(0, 1)

  const toggleChecked = (idx) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const gatherAll = () => {
    const len = r.additional_ingredients_required?.length || 0
    if (!len) return
    if (checkedIngredients.size === len) {
      setCheckedIngredients(new Set())
    } else {
      setCheckedIngredients(new Set(Array.from({ length: len }, (_, i) => i)))
    }
  }

  const convertUnit = (text) => {
    if (unitSystem === 'metric') return text
    return text
      .replace(/(\d+(?:\.\d+)?)\s*g\b/g, (_, n) => `${(parseFloat(n) / 28.35).toFixed(1)} oz`)
      .replace(/(\d+(?:\.\d+)?)\s*ml\b/g, (_, n) => `${(parseFloat(n) / 29.57).toFixed(1)} fl oz`)
      .replace(/(\d+(?:\.\d+)?)\s*kg\b/g, (_, n) => `${(parseFloat(n) * 2.205).toFixed(1)} lb`)
  }

  const handleAddToList = () => {
    if (r.additional_ingredients_required?.length) {
      addRecipeIngredientsToList(r.additional_ingredients_required)
      setAddedMsg(t('recipes.addedToList'))
      setTimeout(() => setAddedMsg(''), 2000)
    }
  }

  return (
    <div className="group glass-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* ── Header ── */}
      <div className={`bg-gradient-to-r ${headerGradient} px-5 py-4 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/90">{label}</span>
          <div className="flex items-center gap-2">
            {showPantryMatch && r.matchScore > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.matchScore >= 50 ? 'bg-white/30 text-white' : 'bg-white/20 text-white/90'}`}>
                {r.matchScore}% match
              </span>
            )}
            <span className="text-white/80 text-xs">{r.total_time_minutes} min</span>
          </div>
        </div>
        <h3 className={`text-xl font-extrabold text-white mt-1.5 relative${onSave ? ' pr-8' : ''}`}>{r.name}</h3>
        {onSave && (
          <button
            onClick={() => handleSave(r.name)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-all hover:scale-110 active:scale-95"
            title={isFav ? t('recipes.saved') : t('recipes.save')}
          >
            <span className={`text-sm ${isFav ? 'text-red-400' : 'text-white/80'}`}>{isFav ? '❤️' : '🤍'}</span>
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        {/* Servings & Unit Controls */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">{t('recipeCard.scale')}:</span>
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-700/50 rounded-lg p-0.5">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-7 h-7 rounded-md bg-white dark:bg-stone-600 text-stone-600 dark:text-stone-300 flex items-center justify-center text-base font-bold hover:bg-lime-50 dark:hover:bg-stone-500 hover:text-lime-600 dark:hover:text-lime-400 transition-all shadow-sm"
            >−</button>
            <span className="text-sm font-bold text-stone-700 dark:text-stone-200 min-w-[2.5rem] text-center">{servings}</span>
            <button
              onClick={() => setServings(Math.min(20, servings + 1))}
              className="w-7 h-7 rounded-md bg-white dark:bg-stone-600 text-stone-600 dark:text-stone-300 flex items-center justify-center text-base font-bold hover:bg-lime-50 dark:hover:bg-stone-500 hover:text-lime-600 dark:hover:text-lime-400 transition-all shadow-sm"
            >+</button>
          </div>
          <span className="text-xs text-stone-400 dark:text-stone-500">{t('recipeCard.servings')}</span>
          <button
            onClick={() => setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')}
            className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
              unitSystem === 'metric'
                ? 'bg-lime-50 dark:bg-lime-900/40 text-lime-600 dark:text-lime-400 border-lime-200 dark:border-lime-700 shadow-sm'
                : 'bg-white dark:bg-stone-700 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:border-lime-300 dark:hover:border-lime-600'
            }`}
          >
            {unitSystem === 'metric' ? t('recipeCard.metric') : t('recipeCard.imperial')}
          </button>
        </div>

        {/* Additional Ingredients */}
        {r.additional_ingredients_required?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">{t('recipes.youWillNeed')}</p>
              <button
                onClick={gatherAll}
                className="text-xs text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 font-semibold transition-colors"
              >
                {checkedIngredients.size === r.additional_ingredients_required.length && checkedIngredients.size > 0
                  ? t('recipeCard.checked')
                  : t('recipeCard.gatherAll')}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {r.additional_ingredients_required.map((ing, i) => {
                const scaled = scaleFactor !== 1 ? scaleIngredient(ing, scaleFactor) : ing
                const converted = convertUnit(scaled)
                const checked = checkedIngredients.has(i)
                const inPantry = pantry?.some(p =>
                  ing.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(ing.toLowerCase())
                )
                return (
                  <label
                    key={i}
                    className={`cursor-pointer text-xs px-3 py-1 rounded-full font-semibold border transition-all duration-200 ${
                      checked
                        ? 'bg-stone-100 dark:bg-stone-700 text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-600 line-through shadow-sm'
                        : inPantry
                          ? 'bg-lime-50 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300 border-lime-200/80 dark:border-lime-700/60 hover:bg-lime-100 dark:hover:bg-lime-900/60 hover:shadow-sm active:scale-95'
                          : 'bg-lime-50 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300 border-lime-200/80 dark:border-lime-700/60 hover:bg-lime-100 dark:hover:bg-lime-900/60 hover:shadow-sm active:scale-95'
                    }`}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggleChecked(i)} className="sr-only" />
                    <span className={`inline-block w-3.5 h-3.5 rounded border-2 mr-1.5 align-middle transition-all duration-200 ${
                      checked
                        ? 'bg-lime-500 border-lime-500'
                        : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-500'
                    }`}>
                      {checked && <svg className="w-full h-full text-white" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </span>
                    {converted || ing}
                    {inPantry && !checked ? ' ✓' : ''}
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Instruction Step Groups */}
        {groups.length > 0 && (
          <div className="relative">
            {displayedGroups.map((group, gi) => {
              const start = gi * 3 + 1
              const end = gi * 3 + group.length
              return (
                <div key={gi} className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${stepBadge}`} />
                    <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wide">
                      {t('recipeCard.stepGroup', { start, end })}
                    </span>
                  </div>
                  <div className="relative pl-6 border-l-2 border-stone-200 dark:border-stone-600 space-y-4">
                    {group.map((step, si) => {
                      const globalIdx = gi * 3 + si
                      return (
                        <div key={si} className="relative group/step">
                          <div className={`absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-white dark:bg-stone-800 border-2 ${stepBadge} shadow-sm transition-transform duration-200 group-hover/step:scale-125`} />
                          <div className="text-sm text-stone-600 dark:text-stone-300 ml-1 leading-relaxed">{globalIdx + 1}. {step}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Show More / Less Steps */}
        {r.steps?.length > 3 && (
          <button
            onClick={handleToggleExpand}
            className="text-sm font-bold text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 mt-2 mb-1 transition-all duration-200 inline-flex items-center gap-1"
          >
            {isExpanded ? <>{t('recipes.showLess')} ↑</> : <>+{r.steps.length - 3} {t('recipes.moreSteps')} ↓</>}
          </button>
        )}

        {/* Plating Suggestion */}
        {r.plating_suggestion && (
          <div className="mt-4 pt-4 border-t border-dashed border-stone-100 dark:border-stone-700">
            <p className="text-xs text-stone-500 dark:text-stone-400 italic leading-relaxed flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-lime-100 dark:bg-lime-900/40 flex items-center justify-center text-xs shrink-0 mt-0.5">💡</span>
              <span>{r.plating_suggestion}</span>
            </p>
          </div>
        )}

        {/* Video Section */}
        {r.name && <VideoSection recipeName={r.name} difficulty={level} />}

        {/* Cost & Budget Info */}
        <div className="flex items-center gap-3 mt-3">
          {r.servings && <span className="text-xs text-stone-400 dark:text-stone-500">🍽 {servings} {t('recipes.servings')}</span>}
          {r.estimated_cost && <span className="text-xs font-semibold text-lime-600 dark:text-lime-400">💰 ~{r.estimated_cost}</span>}
          {r.budget_friendly && <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300 font-semibold">{t('recipes.budget')} 👍</span>}
        </div>

        {/* Action Buttons (Add to List / Save / Share / Cooking Mode) */}
        {showActions && (
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-stone-700">
            <button
              onClick={handleAddToList}
              aria-label={t('recipes.addToList')}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-lime-50 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 border border-lime-200/80 dark:border-lime-700/50 rounded-xl px-2 py-2.5 hover:bg-lime-100 dark:hover:bg-lime-900/50 transition-all duration-200 hover:shadow-sm active:scale-[0.97]"
            >
              <span className="text-base">🛒</span>
              <span>{addedMsg || t('recipes.addToList')}</span>
            </button>
            <button
              onClick={() => handleSave(r.name)}
              aria-label={isFav ? t('recipes.saved') : t('recipes.save')}
              className={`flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl px-2 py-2.5 border transition-all duration-200 active:scale-[0.97] ${
                isFav
                  ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200/80 dark:border-red-700/50 shadow-sm'
                  : 'bg-stone-50 dark:bg-stone-700/50 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:border-red-200 dark:hover:border-red-700/50 hover:shadow-sm'
              }`}
            >
              <span className="text-base">{isFav ? '❤️' : '🤍'}</span>
              <span>{isFav ? t('recipes.saved') : t('recipes.save')}</span>
            </button>
            <ShareButton title={r.name} text={`Check out this recipe: ${r.name}`} />
            <Link
              to="/cooking-mode"
              state={{ recipe: r }}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-lime-50 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 border border-lime-200/80 dark:border-lime-700/50 rounded-xl px-2 py-2.5 hover:bg-lime-100 dark:hover:bg-lime-900/50 transition-all duration-200 hover:shadow-sm active:scale-[0.97] text-center"
            >
              <span className="text-base">👨‍🍳</span>
              <span>{t('cookingMode.start')}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Section wrapper used in Scan.jsx and History.jsx.
 * Renders a title bar with PersonalizationBar, then a grid of RecipeCardItem cards
 * filtered by the selected age group.
 */
export default function RecipeCard({ recipes, showActions }) {
  const { t } = useTranslation()
  const [ageGroup, setAgeGroupState] = useState(getAgeGroup)
  if (!recipes) return null

  const levels = ['easy', 'intermediate', 'advanced']
  const levelConfig = {
    easy: { color: 'from-lime-500 to-lime-600', badge: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300', step: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300' },
    intermediate: { color: 'from-lime-500 to-lime-600', badge: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300', step: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300' },
    advanced: { color: 'from-red-500 to-red-600', badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300', step: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300' },
  }

  const filteredLevels = levels.filter(level => {
    if (ageGroup === 'child') return level === 'easy'
    if (ageGroup === 'elderly') return level === 'easy' || level === 'intermediate'
    return true
  }).filter(level => recipes[level] && recipes[level].name)

  const handleAgeGroupChange = (group) => {
    setAgeGroupState(group)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-lime-400 to-lime-600 rounded-xl flex items-center justify-center text-sm shadow-md ring-1 ring-lime-500/20">🍳</div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('scan.sections.recipes')}</h2>
        </div>
        <PersonalizationBar onAgeGroupChange={handleAgeGroupChange} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLevels.length > 0 ? filteredLevels.map(level => {
          const r = recipes[level]
          return (
            <RecipeCardItem
              key={level}
              level={level}
              r={r}
              config={levelConfig[level]}
              showActions={showActions}
            />
          )
        }) : (
          <div className="col-span-full text-center py-10 text-stone-400 dark:text-stone-500">
            <p className="text-lg mb-1">🍽️</p>
            <p className="text-sm">{t('recipes.noRecipes', 'No recipes available for this scan. Try scanning different vegetables.')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
