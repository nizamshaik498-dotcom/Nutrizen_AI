import json
import os
import re
from groq import Groq

SYSTEM_PROMPT = """You are a professional nutritionist and meal planning assistant. Generate a complete 7-day meal plan as JSON.

For each day (Monday through Sunday), provide:
- breakfast: { name, description, prep_time_minutes, calories, protein_g, ingredients[] }
- lunch: { name, description, prep_time_minutes, calories, protein_g, ingredients[] }
- dinner: { name, description, prep_time_minutes, calories, protein_g, ingredients[] }
- snacks[]: optional 1-2 snack suggestions per day
- total_daily_calories: number
- total_daily_protein_g: number

Also include:
- weekly_grocery_list: { category: string, items: string[] }[] — categorized shopping list for the week
- nutrition_summary: { avg_daily_calories, avg_daily_protein_g, avg_daily_carbs_g, avg_daily_fat_g, dietary_notes }

Consider the user's allergies, dietary preferences, and any available ingredients from their fridge/pantry.
Use healthy, balanced meals with variety across the week.
Keep descriptions concise. Return ONLY valid JSON."""

def generate_meal_plan(user_preferences=None, available_ingredients=None):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return {"error": "GROQ_API_KEY not configured"}
    client = Groq(api_key=api_key)

    user_context = ""
    if user_preferences:
        parts = []
        if user_preferences.get("allergies"):
            parts.append(f"Allergies: {user_preferences['allergies']}")
        if user_preferences.get("dietary_preferences"):
            parts.append(f"Dietary preferences: {user_preferences['dietary_preferences']}")
        if user_preferences.get("medical_conditions"):
            parts.append(f"Medical conditions: {user_preferences['medical_conditions']}")
        if parts:
            user_context = "User context:\n" + "\n".join(parts)

    ingredients_context = ""
    if available_ingredients and len(available_ingredients) > 0:
        ingredients_context = f"Available ingredients to use: {', '.join(available_ingredients[:15])}"

    prompt_parts = [user_context, ingredients_context] if user_context or ingredients_context else ["Generate a balanced weekly meal plan."]
    prompt = "\n\n".join(p for p in prompt_parts if p)

    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.5,
        max_tokens=4096,
    )

    content = response.choices[0].message.content
    cleaned = re.sub(r'^```(?:json)?\s*', '', content.strip())
    cleaned = re.sub(r'\s*```$', '', cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Failed to parse meal plan", "raw": content}
