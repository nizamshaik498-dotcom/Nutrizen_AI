import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Reorder } from 'framer-motion'
import SEO from '../components/SEO'
import EmptyState from '../components/EmptyState'
import { getShoppingList, addToShoppingList, removeFromShoppingList, toggleShoppingItem, clearShoppingList, reorderShoppingList } from '../utils/shoppingList'

const CATEGORIES = {
  'Produce': {
    icon: '🥬',
    keywords: ['apple', 'banana', 'tomato', 'onion', 'garlic', 'ginger', 'carrot', 'broccoli', 'spinach', 'lettuce', 'cucumber', 'bell pepper', 'chili', 'potato', 'sweet potato', 'mushroom', 'avocado', 'lemon', 'lime', 'cabbage', 'cauliflower', 'corn', 'peas', 'green beans', 'eggplant', 'zucchini', 'squash', 'kale', 'celery', 'radish', 'beet', 'pumpkin']
  },
  'Dairy': {
    icon: '🥛',
    keywords: ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'sour cream', 'paneer', 'ghee', 'curd', 'ice cream', 'cream cheese', 'mozzarella', 'cheddar', 'parmesan']
  },
  'Meat & Seafood': {
    icon: '🥩',
    keywords: ['chicken', 'egg', 'fish', 'pork', 'beef', 'mutton', 'lamb', 'shrimp', 'prawn', 'turkey', 'bacon', 'sausage', 'ham', 'salmon', 'tuna']
  },
  'Spices & Herbs': {
    icon: '🌿',
    keywords: ['salt', 'pepper', 'turmeric', 'cumin', 'coriander', 'chili powder', 'paprika', 'cinnamon', 'cardamom', 'clove', 'nutmeg', 'oregano', 'basil', 'thyme', 'rosemary', 'bay leaf', 'garam masala', 'red chili', 'black pepper', 'curry powder', 'mustard', 'fennel', 'ginger garlic']
  },
  'Grains & Pasta': {
    icon: '🌾',
    keywords: ['rice', 'pasta', 'noodle', 'bread', 'flour', 'wheat', 'quinoa', 'oats', 'cereal', 'couscous', 'barley', 'semolina', 'ragi', 'jowar', 'bajra']
  },
  'Canned & Jarred': {
    icon: '🥫',
    keywords: ['can', 'jar', 'sauce', 'pickle', 'olive', 'ketchup', 'mayonnaise', 'mustard', 'vinegar', 'jam', 'honey', 'salsa']
  },
  'Frozen': {
    icon: '❄️',
    keywords: ['frozen', 'ice']
  },
  'Condiments': {
    icon: '🫒',
    keywords: ['oil', 'soy sauce', 'vinegar', 'honey', 'ketchup', 'mustard', 'mayonnaise', 'sauce', 'sriracha', 'hot sauce', 'olive oil', 'vegetable oil']
  },
  'Baking': {
    icon: '🎂',
    keywords: ['sugar', 'baking', 'baking soda', 'baking powder', 'vanilla', 'chocolate', 'cocoa', 'yeast', 'flour', 'cornstarch']
  },
}

const CATEGORY_ORDER = ['Produce', 'Dairy', 'Meat & Seafood', 'Spices & Herbs', 'Grains & Pasta', 'Canned & Jarred', 'Frozen', 'Condiments', 'Baking', 'Other']

function categorizeItem(name) {
  const lower = name.toLowerCase()
  for (const key of CATEGORY_ORDER) {
    if (key === 'Other') continue
    const cat = CATEGORIES[key]
    if (cat.keywords.some(kw => lower.includes(kw))) return key
  }
  return 'Other'
}

function SwipeItem({ item, onToggle, onRemove }) {
  const touchX = useRef(0)
  const [offsetX, setOffsetX] = useState(0)
  const handleTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - touchX.current
    if (diff < 0) setOffsetX(Math.max(diff, -80))
    else setOffsetX(Math.min(diff, 0))
  }
  const handleTouchEnd = () => {
    if (offsetX < -40) { onRemove(item.id); setOffsetX(0); touchX.current = 0; return }
    setOffsetX(0)
    touchX.current = 0
  }
  return (
    <div className="relative overflow-hidden rounded-xl swipe-container" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div className="absolute inset-y-0 right-0 flex items-center justify-end px-4 bg-red-500/90 text-white text-sm font-bold rounded-xl swipe-hint">
        {offsetX === 0 ? 'Swipe →' : 'Delete'}
      </div>
      <Reorder.Item
        value={item}
        as="div"
        whileDrag={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        style={{ x: offsetX }}
        className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-stone-50/50 dark:hover:bg-stone-700/30 tap-scale cursor-grab active:cursor-grabbing ${item.checked ? 'opacity-60' : ''}`}
      >
        <button onClick={() => onToggle(item.id)} role="checkbox" aria-checked={item.checked} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs transition-all shrink-0 ${item.checked ? 'bg-lime-500 border-lime-500 text-white shadow-sm' : 'border-stone-300 dark:border-stone-500 hover:border-lime-400'}`}>
          {item.checked ? '✓' : ''}
        </button>
        <span className={`flex-1 text-sm font-medium ${item.checked ? 'text-stone-400 dark:text-stone-500 line-through' : 'text-stone-700 dark:text-stone-200'}`}>{item.name}</span>
        <button onClick={() => onRemove(item.id)} className="text-xs text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 shrink-0 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">✕</button>
      </Reorder.Item>
    </div>
  )
}

export default function ShoppingList() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [expandedCats, setExpandedCats] = useState(() => {
    const initial = {}
    CATEGORY_ORDER.forEach(c => { initial[c] = true })
    return initial
  })

  useEffect(() => { setItems(getShoppingList()) }, [])

  const handleAdd = () => {
    if (!newItem.trim()) return
    const updated = addToShoppingList({ name: newItem.trim() })
    setItems(updated)
    setNewItem('')
  }

  const handleToggle = (id) => setItems(toggleShoppingItem(id))
  const handleRemove = (id) => setItems(removeFromShoppingList(id))
  const handleClear = () => { clearShoppingList(); setItems([]) }

  const toggleCategory = (cat) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const grouped = {}
  CATEGORY_ORDER.forEach(c => { grouped[c] = [] })
  items.forEach(item => {
    const cat = categorizeItem(item.name)
    grouped[cat].push(item)
  })

  const checkedCount = items.filter(i => i.checked).length
  const progress = items.length ? Math.round((checkedCount / items.length) * 100) : 0

  return (
    <>
      <SEO title="Shopping List" description="Auto-categorized shopping list with progress tracking for your recipe ingredients." />
      <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-lime-600 via-lime-500 to-lime-600 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl shadow-lime-500/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shadow-inner">🛒</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t('shoppingList.title')}</h1>
            <p className="text-emerald-100/80 text-sm">{t('shoppingList.items', { count: items.length })}</p>
          </div>
        </div>
        {items.length > 0 && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium">{checkedCount}/{items.length} {t('shoppingList.checked')}</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div className="bg-white h-2.5 rounded-full transition-all duration-700 ease-out shadow-sm" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            value={newItem} onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder={t('shoppingList.placeholder')}
            className="w-full px-4 py-3 pl-10 bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/60 rounded-xl text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
        </div>
        <button onClick={handleAdd} className="px-5 py-3 btn-glass btn-glass-lime rounded-xl active:scale-[0.98]">{t('shoppingList.addItem')}</button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          emoji="🛒"
          title={t('shoppingList.emptyTitle')}
          description={t('shoppingList.emptyDesc')}
          action={
            <>
              <Link to="/scan" className="inline-flex items-center gap-2 btn-glass btn-glass-lime px-7 py-3.5 rounded-xl text-sm">
                📸 {t('shoppingList.scanVeggies')} →
              </Link>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-4">💡 Tip: Scan vegetables to auto-generate shopping lists from recipes</p>
            </>
          }
        />
      ) : (
        <div className="space-y-3">
          {CATEGORY_ORDER.map(cat => {
            const catItems = grouped[cat]
            if (catItems.length === 0) return null
            const catChecked = catItems.filter(i => i.checked).length
            const isExpanded = expandedCats[cat]
            const catConfig = CATEGORIES[cat] || { icon: '📦' }
            return (
              <div key={cat} className="glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-stone-50/80 dark:hover:bg-stone-700/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{catConfig.icon}</span>
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-200">{cat}</span>
                    <span className="text-xs text-stone-400 dark:text-stone-500 font-medium bg-stone-100 dark:bg-stone-700/80 px-2 py-0.5 rounded-full">{catItems.length}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-500" style={{ width: `${catItems.length ? (catChecked / catItems.length) * 100 : 0}%` }} />
                      </div>
                      <span className="text-xs text-lime-600 dark:text-lime-400 font-semibold min-w-[2rem] text-right">{catChecked}/{catItems.length}</span>
                    </div>
                    <svg className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {isExpanded && (
                  <Reorder.Group axis="y" values={catItems} onReorder={(reordered) => {
                    const all = items
                    const other = all.filter(i => !catItems.find(c => c.id === i.id))
                    const reindexed = reordered.map((item, idx) => ({ ...item, order: idx }))
                    const sorted = [...other, ...reindexed].sort((a,b) => (a.order || 0) - (b.order || 0))
                    setItems(sorted)
                    reorderShoppingList(sorted)
                  }} className="px-3 pb-3 space-y-0.5">
                    {catItems.map(item => (
                      <SwipeItem key={item.id} item={item} onToggle={handleToggle} onRemove={handleRemove} />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            )
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-700/40">
          <span className="text-xs text-stone-400 dark:text-stone-500">{items.length - checkedCount} {t('shoppingList.remaining')}</span>
          <button onClick={handleClear} className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">{t('shoppingList.clearAll')}</button>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6 glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center text-sm shadow-sm">🚚</div>
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm">{t('groceryDelivery.orderFrom')}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Instacart', url: `https://www.instacart.com/store/s?k=${encodeURIComponent(items.filter(i => !i.checked).map(i => i.name).join(','))}`, emoji: '🛒' },
              { name: 'Amazon Fresh', url: `https://www.amazon.com/s?k=${encodeURIComponent(items.filter(i => !i.checked).slice(0, 5).map(i => i.name).join('+'))}`, emoji: '📦' },
              { name: 'Walmart', url: `https://www.walmart.com/search?q=${encodeURIComponent(items.filter(i => !i.checked).slice(0, 3).map(i => i.name).join(' '))}`, emoji: '🏪' },
            ].map(platform => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {platform.emoji} {platform.name}
              </a>
            ))}
          </div>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">{t('groceryDelivery.deliveryPlatforms')}</p>
        </div>
      )}
    </div>
    </>
  )
}
