import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getFridgeItems, addFridgeItem, removeFridgeItem, clearFridge, findMatchingRecipes } from '../utils/fridgeMode'
import { Link } from 'react-router-dom'

const categories = [
  {
    label: 'Vegetables', icon: '🥦',
    items: [
      { name: 'Tomato', emoji: '🍅' }, { name: 'Spinach', emoji: '🥬' }, { name: 'Carrot', emoji: '🥕' },
      { name: 'Onion', emoji: '🧅' }, { name: 'Bell Pepper', emoji: '🫑' }, { name: 'Broccoli', emoji: '🥦' },
      { name: 'Potato', emoji: '🥔' }, { name: 'Cucumber', emoji: '🥒' }, { name: 'Garlic', emoji: '🧄' },
      { name: 'Corn', emoji: '🌽' }, { name: 'Cabbage', emoji: '🥬' }, { name: 'Cauliflower', emoji: '🥦' },
      { name: 'Eggplant', emoji: '🍆' }, { name: 'Mushroom', emoji: '🍄' }, { name: 'Lettuce', emoji: '🥬' },
      { name: 'Green Beans', emoji: '🫘' }, { name: 'Peas', emoji: '🫛' }, { name: 'Zucchini', emoji: '🥒' },
      { name: 'Sweet Potato', emoji: '🍠' }, { name: 'Ginger', emoji: '🫚' }, { name: 'Celery', emoji: '🥬' },
      { name: 'Radish', emoji: '🫘' }, { name: 'Beetroot', emoji: '🫘' }, { name: 'Pumpkin', emoji: '🎃' },
      { name: 'Asparagus', emoji: '🥬' }, { name: 'Artichoke', emoji: '🥬' }, { name: 'Kale', emoji: '🥬' },
      { name: 'Okra', emoji: '🫘' },
    ]
  },
  {
    label: 'Fruits', icon: '🍎',
    items: [
      { name: 'Apple', emoji: '🍎' }, { name: 'Banana', emoji: '🍌' }, { name: 'Orange', emoji: '🍊' },
      { name: 'Strawberry', emoji: '🍓' }, { name: 'Grapes', emoji: '🍇' }, { name: 'Mango', emoji: '🥭' },
      { name: 'Lemon', emoji: '🍋' }, { name: 'Avocado', emoji: '🥑' }, { name: 'Pineapple', emoji: '🍍' },
      { name: 'Watermelon', emoji: '🍉' }, { name: 'Blueberry', emoji: '🫐' }, { name: 'Cherry', emoji: '🍒' },
      { name: 'Peach', emoji: '🍑' }, { name: 'Pear', emoji: '🍐' }, { name: 'Coconut', emoji: '🥥' },
      { name: 'Kiwi', emoji: '🥝' }, { name: 'Papaya', emoji: '🏵️' }, { name: 'Pomegranate', emoji: '🏵️' },
      { name: 'Lime', emoji: '🍋‍🟩' }, { name: 'Dragon Fruit', emoji: '🏵️' },
    ]
  },
  {
    label: 'Meat & Poultry', icon: '🍗',
    items: [
      { name: 'Chicken Breast', emoji: '🍗' }, { name: 'Chicken Thigh', emoji: '🍗' }, { name: 'Ground Beef', emoji: '🥩' },
      { name: 'Steak', emoji: '🥩' }, { name: 'Pork Chop', emoji: '🥩' }, { name: 'Bacon', emoji: '🥓' },
      { name: 'Turkey', emoji: '🍗' }, { name: 'Lamb', emoji: '🥩' }, { name: 'Chicken Wings', emoji: '🍗' },
      { name: 'Sausage', emoji: '🌭' }, { name: 'Ham', emoji: '🥩' }, { name: 'Duck', emoji: '🍗' },
      { name: 'Mutton', emoji: '🥩' }, { name: 'Beef Mince', emoji: '🥩' }, { name: 'Chicken Drumstick', emoji: '🍗' },
    ]
  },
  {
    label: 'Seafood', icon: '🐟',
    items: [
      { name: 'Salmon', emoji: '🐟' }, { name: 'Shrimp', emoji: '🦐' }, { name: 'Tuna', emoji: '🐟' },
      { name: 'Cod', emoji: '🐟' }, { name: 'Crab', emoji: '🦀' }, { name: 'Lobster', emoji: '🦞' },
      { name: 'Prawns', emoji: '🦐' }, { name: 'Sardines', emoji: '🐟' }, { name: 'Mackerel', emoji: '🐟' },
      { name: 'Clams', emoji: '🐚' }, { name: 'Mussels', emoji: '🐚' }, { name: 'Trout', emoji: '🐟' },
      { name: 'Tilapia', emoji: '🐟' }, { name: 'Squid', emoji: '🦑' }, { name: 'Octopus', emoji: '🐙' },
    ]
  },
  {
    label: 'Dairy & Eggs', icon: '🥛',
    items: [
      { name: 'Milk', emoji: '🥛' }, { name: 'Eggs', emoji: '🥚' }, { name: 'Butter', emoji: '🧈' },
      { name: 'Cheese', emoji: '🧀' }, { name: 'Yogurt', emoji: '🫗' }, { name: 'Cream', emoji: '🥛' },
      { name: 'Sour Cream', emoji: '🫗' }, { name: 'Cottage Cheese', emoji: '🧀' }, { name: 'Mozzarella', emoji: '🧀' },
      { name: 'Cheddar', emoji: '🧀' }, { name: 'Parmesan', emoji: '🧀' }, { name: 'Greek Yogurt', emoji: '🫗' },
      { name: 'Heavy Cream', emoji: '🥛' }, { name: 'Buttermilk', emoji: '🥛' }, { name: 'Ice Cream', emoji: '🍦' },
    ]
  },
  {
    label: 'Herbs & Spices', icon: '🌿',
    items: [
      { name: 'Basil', emoji: '🌿' }, { name: 'Cilantro', emoji: '🌿' }, { name: 'Mint', emoji: '🌿' },
      { name: 'Rosemary', emoji: '🌿' }, { name: 'Thyme', emoji: '🌿' }, { name: 'Oregano', emoji: '🌿' },
      { name: 'Parsley', emoji: '🌿' }, { name: 'Turmeric', emoji: '🏵️' }, { name: 'Cumin', emoji: '🏵️' },
      { name: 'Cinnamon', emoji: '🏵️' }, { name: 'Paprika', emoji: '🏵️' }, { name: 'Chili Powder', emoji: '🌶️' },
      { name: 'Black Pepper', emoji: '🏵️' }, { name: 'Salt', emoji: '🧂' }, { name: 'Bay Leaf', emoji: '🌿' },
      { name: 'Dill', emoji: '🌿' }, { name: 'Sage', emoji: '🌿' }, { name: 'Curry Powder', emoji: '🏵️' },
    ]
  },
  {
    label: 'Grains & Legumes', icon: '🌾',
    items: [
      { name: 'Rice', emoji: '🍚' }, { name: 'Pasta', emoji: '🍝' }, { name: 'Bread', emoji: '🍞' },
      { name: 'Flour', emoji: '🌾' }, { name: 'Oats', emoji: '🥣' }, { name: 'Quinoa', emoji: '🌾' },
      { name: 'Lentils', emoji: '🫘' }, { name: 'Chickpeas', emoji: '🫘' }, { name: 'Black Beans', emoji: '🫘' },
      { name: 'Kidney Beans', emoji: '🫘' }, { name: 'Noodles', emoji: '🍜' }, { name: 'Couscous', emoji: '🌾' },
      { name: 'Barley', emoji: '🌾' }, { name: 'Wheat', emoji: '🌾' }, { name: 'Cornmeal', emoji: '🌽' },
    ]
  },
  {
    label: 'Condiments & Sauces', icon: '🫙',
    items: [
      { name: 'Olive Oil', emoji: '🫒' }, { name: 'Soy Sauce', emoji: '🫙' }, { name: 'Ketchup', emoji: '🫙' },
      { name: 'Mustard', emoji: '🫙' }, { name: 'Mayonnaise', emoji: '🫙' }, { name: 'Vinegar', emoji: '🫙' },
      { name: 'Honey', emoji: '🍯' }, { name: 'Hot Sauce', emoji: '🌶️' }, { name: 'BBQ Sauce', emoji: '🫙' },
      { name: 'Tomato Sauce', emoji: '🫙' }, { name: 'Coconut Milk', emoji: '🥥' }, { name: 'Fish Sauce', emoji: '🫙' },
      { name: 'Maple Syrup', emoji: '🫙' }, { name: 'Sesame Oil', emoji: '🫙' }, { name: 'Worcestershire', emoji: '🫙' },
    ]
  },
]

export default function FridgeScanner() {
  const { t } = useTranslation()
  const [items, setItems] = useState(getFridgeItems)
  const [newItem, setNewItem] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [expandedCats, setExpandedCats] = useState(categories.map((_, i) => i < 3 ? i : -1).filter(i => i >= 0))

  const handleAdd = (name) => {
    addFridgeItem({ name })
    setItems(getFridgeItems())
    setNewItem('')
  }

  const handleRemove = (id) => {
    removeFridgeItem(id)
    setItems(getFridgeItems())
  }

  const handleScanFridge = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://FaizBasha05.pythonanywhere.com/scan/demo')
      const data = await res.json()
      const allRecipes = []
      if (data?.result?.recipes) {
        if (data.result.recipes.easy) allRecipes.push({ ...data.result.recipes.easy, difficulty: 'easy' })
        if (data.result.recipes.intermediate) allRecipes.push({ ...data.result.recipes.intermediate, difficulty: 'intermediate' })
        if (data.result.recipes.advanced) allRecipes.push({ ...data.result.recipes.advanced, difficulty: 'advanced' })
      }
      const scannedItems = data?.result?.scan_summary?.items || []
      const matched = findMatchingRecipes(items, allRecipes, scannedItems)
      setRecipes(matched)
      setShowResults(true)
    } catch (err) {
      console.warn('Fridge scan failed:', err)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="glass-card rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center text-sm shadow-sm">🧊</div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('fridgeMode.title')}</h2>
          <span className="text-xs bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300 px-2 py-0.5 rounded-full font-semibold ml-auto">{items.length} items</span>
        </div>

        <div className="flex gap-2 mb-4">
          <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && newItem.trim() && handleAdd(newItem.trim())} placeholder={t('fridgeMode.addItem')} className="flex-1 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button onClick={() => newItem.trim() && handleAdd(newItem.trim())} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md">{t('fridgeMode.add')}</button>
        </div>

        <div className="space-y-2 mb-4 max-h-72 overflow-y-auto">
          {categories.map((cat, ci) => {
            const open = expandedCats.includes(ci)
            return (
              <div key={cat.label}>
                <button onClick={() => setExpandedCats(open ? expandedCats.filter(i => i !== ci) : [...expandedCats, ci])} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/40 hover:bg-stone-100 dark:hover:bg-stone-700/40 transition-colors">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-300 flex-1">{cat.label}</span>
                  <span className="text-xs text-stone-400">{cat.items.length}</span>
                  <span className="text-stone-400 text-xs transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : '' }}>▼</span>
                </button>
                {open && (
                  <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                    {cat.items.map(q => (
                      <button key={q.name} onClick={() => handleAdd(q.name)} className="text-xs px-2.5 py-1.5 bg-white/60 dark:bg-stone-700/60 border border-blue-200 dark:border-blue-800/40 rounded-full text-stone-600 dark:text-stone-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        {q.emoji} {q.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="space-y-1.5 mb-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2 glass-card rounded-xl px-3 py-2">
              <span className="flex-1 text-sm font-medium text-stone-700 dark:text-stone-200">{item.name}</span>
              <button onClick={() => handleRemove(item.id)} className="text-xs text-stone-400 hover:text-red-500 transition-colors">✕</button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="flex gap-2">
            <button onClick={handleScanFridge} disabled={loading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('common.loading')}</> : `🔍 ${t('fridgeMode.scanAndRecommend')}`}
            </button>
            <button onClick={() => { clearFridge(); setItems([]); setShowResults(false) }} className="px-4 py-2.5 text-xs text-red-500 dark:text-red-400 hover:text-red-600 border border-red-200 dark:border-red-800/40 rounded-xl font-medium transition-colors">{t('fridgeMode.clearAll')}</button>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🧊</div>
            <p className="text-sm text-stone-500 dark:text-stone-400">{t('fridgeMode.emptyDesc')}</p>
          </div>
        )}
      </div>

      {showResults && recipes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">{t('fridgeMode.matchingRecipes')}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {recipes.map((r, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone-800 dark:text-stone-100 text-sm">{r.name}</h4>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.matchPercent >= 70 ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : r.matchPercent >= 40 ? 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                    {r.matchPercent}% match
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {r.matchedIngredients?.map((ing, j) => <span key={j} className="text-xs bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300 px-2 py-0.5 rounded-full">✓ {ing}</span>)}
                </div>
                <Link to="/cooking-mode" state={{ recipe: r }} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700">
                  👨‍🍳 {t('cookingMode.start')} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {showResults && recipes.length === 0 && items.length > 0 && (
        <div className="mt-6 text-center py-8 glass-card rounded-2xl">
          <div className="text-4xl mb-2">🤷</div>
          <p className="text-stone-500 dark:text-stone-400">{t('fridgeMode.noMatches')}</p>
        </div>
      )}
    </div>
  )
}
