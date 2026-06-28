DEMO_DATA = {
  "scan_summary": {
    "total_vegetables_detected": 5,
    "items": [
      {
        "id": "veg_01",
        "common_name": "Tomato",
        "scientific_name": "Solanum lycopersicum",
        "estimated_quantity": "3 medium",
        "estimated_weight_grams": 450,
        "freshness_status": "Fresh",
        "confidence_level": "High",
        "flag": None,
        "estimated_days_until_spoilage": 5,
        "spoilage_warning": "Soft spots and wrinkling may appear after 5-7 days at room temperature.",
        "best_use": "Ideal for fresh salads, sauces, and roasting within 3 days for peak flavor."
      },
      {
        "id": "veg_02",
        "common_name": "Spinach",
        "scientific_name": "Spinacia oleracea",
        "estimated_quantity": "2 cups",
        "estimated_weight_grams": 60,
        "freshness_status": "Fresh",
        "confidence_level": "High",
        "flag": None,
        "estimated_days_until_spoilage": 3,
        "spoilage_warning": "Leaves may wilt and become slimy within 3-5 days if not stored properly.",
        "best_use": "Best consumed within 2 days raw in salads or sautéed as a side dish."
      },
      {
        "id": "veg_03",
        "common_name": "Carrot",
        "scientific_name": "Daucus carota",
        "estimated_quantity": "2 medium",
        "estimated_weight_grams": 120,
        "freshness_status": "Fresh",
        "confidence_level": "High",
        "flag": None,
        "estimated_days_until_spoilage": 14,
        "spoilage_warning": "Carrots may become limp or develop white blush after 2 weeks in the fridge.",
        "best_use": "Excellent for roasting, grating raw into salads, or adding to soups and stews."
      },
      {
        "id": "veg_04",
        "common_name": "Broccoli",
        "scientific_name": "Brassica oleracea",
        "estimated_quantity": "1 head",
        "estimated_weight_grams": 300,
        "freshness_status": "Fresh",
        "confidence_level": "High",
        "flag": None,
        "estimated_days_until_spoilage": 7,
        "spoilage_warning": "Florets may yellow and soften after 7-10 days; strong sulfur odor indicates spoilage.",
        "best_use": "Best steamed, roasted, or blanched within 5 days for optimal texture and nutrients."
      },
      {
        "id": "veg_05",
        "common_name": "Bell Pepper",
        "scientific_name": "Capsicum annuum",
        "estimated_quantity": "2 medium",
        "estimated_weight_grams": 240,
        "freshness_status": "Fresh",
        "confidence_level": "High",
        "flag": None,
        "estimated_days_until_spoilage": 10,
        "spoilage_warning": "Wrinkling and soft patches may develop after 10-14 days in the fridge.",
        "best_use": "Perfect for fresh crudités, stir-fries, stuffing, or roasting within a week."
      }
    ]
  },
  "recipes": {
    "easy": {
      "name": "Garden Fresh Salad Bowl",
      "total_time_minutes": 15,
      "prep_time_minutes": 15,
      "cook_time_minutes": 0,
      "servings": 2,
      "additional_ingredients_required": ["lemon", "honey", "sesame seeds"],
      "steps": [
        "Wash and chop tomatoes, bell peppers, and broccoli into bite-sized pieces. Grate carrots. Keep spinach leaves whole.",
        "Blanch broccoli florets in boiling water for 1 minute, then plunge into ice water.",
        "In a bowl, whisk lemon juice with honey for the dressing.",
        "Toss all vegetables with the dressing. Top with sesame seeds.",
        "Serve immediately at room temperature."
      ],
      "plating_suggestion": "Serve in a wide wooden bowl with dressing drizzled in a spiral pattern.",
      "estimated_cost": "₹420",
      "budget_friendly": True
    },
    "intermediate": {
      "name": "Roasted Vegetable Medley with Garlic Herb Sauce",
      "total_time_minutes": 40,
      "prep_time_minutes": 15,
      "cook_time_minutes": 25,
      "servings": 4,
      "additional_ingredients_required": ["garlic", "yogurt", "mixed herbs", "lemon"],
      "steps": [
        "Preheat oven to 200°C. Cut tomatoes in half, chop carrots, broccoli, and bell peppers into even chunks.",
        "Toss all vegetables with olive oil, salt, and pepper. Spread evenly on a large baking tray.",
        "Roast for 25 minutes until carrots are tender and edges are caramelized.",
        "Blend yogurt with roasted garlic, herbs, and lemon juice for the sauce.",
        "Arrange roasted vegetables on a platter and drizzle with herb sauce."
      ],
      "plating_suggestion": "Arrange roasted vegetables on a large white platter with sauce drizzled artistically.",
      "estimated_cost": "₹710",
      "budget_friendly": True
    },
    "advanced": {
      "name": "Stuffed Bell Peppers with Broccoli-Carrot Rice",
      "total_time_minutes": 55,
      "prep_time_minutes": 20,
      "cook_time_minutes": 35,
      "servings": 2,
      "additional_ingredients_required": ["arborio rice", "onion", "garlic", "vegetable stock", "parmesan", "butter", "white wine", "breadcrumbs"],
      "steps": [
        "Preheat oven to 190°C. Slice tops off bell peppers and remove seeds. Blanch for 3 minutes.",
        "Finely dice onion and garlic. Sauté in butter until translucent.",
        "Add arborio rice, toast for 2 minutes. Deglaze with white wine.",
        "Add warm stock one ladle at a time, stirring continuously for 18 minutes.",
        "In the last 5 minutes, stir in finely chopped broccoli, grated carrot, and chopped spinach.",
        "Fold in parmesan and butter. Stuff mixture into bell pepper cups.",
        "Top with breadcrumbs and bake for 15 minutes until golden.",
        "Serve with tomato salad on the side."
      ],
      "plating_suggestion": "Place stuffed bell pepper in the center of a plate surrounded by a ring of fresh tomato salad and microgreens.",
      "estimated_cost": "₹1,000",
      "budget_friendly": False
    }
  },
  "nutrition": [
    {
      "vegetable_id": "veg_01",
      "vegetable_name": "Tomato",
      "per_100g": {
        "calories_kcal": 18,
        "carbohydrates_g": 3.9,
        "dietary_fibre_g": 1.2,
        "protein_g": 0.9,
        "fat_g": 0.2,
        "vitamin_c_mg": 14,
        "iron_mg": 0.3,
        "potassium_mg": 237,
        "calcium_mg": 10,
        "sodium_mg": 5
      },
      "glycemic_index": 15,
      "glycemic_load": "Low",
      "health_score_out_of_10": 9,
      "health_score_reason": "Low calorie, rich in lycopene and vitamin C",
      "data_confidence": "USDA Verified"
    },
    {
      "vegetable_id": "veg_02",
      "vegetable_name": "Spinach",
      "per_100g": {
        "calories_kcal": 23,
        "carbohydrates_g": 3.6,
        "dietary_fibre_g": 2.2,
        "protein_g": 2.9,
        "fat_g": 0.4,
        "vitamin_c_mg": 28,
        "iron_mg": 2.7,
        "potassium_mg": 558,
        "calcium_mg": 99,
        "sodium_mg": 79
      },
      "glycemic_index": 1,
      "glycemic_load": "Low",
      "health_score_out_of_10": 10,
      "health_score_reason": "Nutrient-dense superfood, high in iron and calcium",
      "data_confidence": "USDA Verified"
    },
    {
      "vegetable_id": "veg_03",
      "vegetable_name": "Carrot",
      "per_100g": {
        "calories_kcal": 41,
        "carbohydrates_g": 9.6,
        "dietary_fibre_g": 2.8,
        "protein_g": 0.9,
        "fat_g": 0.2,
        "vitamin_c_mg": 5.9,
        "iron_mg": 0.3,
        "potassium_mg": 320,
        "calcium_mg": 33,
        "sodium_mg": 69
      },
      "glycemic_index": 39,
      "glycemic_load": "Low",
      "health_score_out_of_10": 8,
      "health_score_reason": "Excellent source of beta-carotene and fibre",
      "data_confidence": "USDA Verified"
    },
    {
      "vegetable_id": "veg_04",
      "vegetable_name": "Broccoli",
      "per_100g": {
        "calories_kcal": 34,
        "carbohydrates_g": 6.6,
        "dietary_fibre_g": 2.6,
        "protein_g": 2.8,
        "fat_g": 0.4,
        "vitamin_c_mg": 89,
        "iron_mg": 0.7,
        "potassium_mg": 316,
        "calcium_mg": 47,
        "sodium_mg": 33
      },
      "glycemic_index": 10,
      "glycemic_load": "Low",
      "health_score_out_of_10": 10,
      "health_score_reason": "Packed with vitamin C, fibre, and sulforaphane — a true superfood",
      "data_confidence": "USDA Verified"
    },
    {
      "vegetable_id": "veg_05",
      "vegetable_name": "Bell Pepper",
      "per_100g": {
        "calories_kcal": 26,
        "carbohydrates_g": 6.0,
        "dietary_fibre_g": 2.1,
        "protein_g": 1.0,
        "fat_g": 0.3,
        "vitamin_c_mg": 128,
        "iron_mg": 0.4,
        "potassium_mg": 211,
        "calcium_mg": 9,
        "sodium_mg": 3
      },
      "glycemic_index": 10,
      "glycemic_load": "Low",
      "health_score_out_of_10": 9,
      "health_score_reason": "Extremely high in vitamin C, low calorie, great for immunity",
      "data_confidence": "USDA Verified"
    }
  ],
  "allergy_report": [
    {
      "vegetable_id": "veg_01",
      "vegetable_name": "Tomato",
      "risk_groups": [
        { "group": "Diabetics", "severity": "SAFE", "reason": "Low GI, minimal impact on blood sugar", "recommendation": "Can be consumed freely" },
        { "group": "Thyroid Patients (Hypo)", "severity": "SAFE", "reason": "No known interaction", "recommendation": "Safe for consumption" },
        { "group": "Thyroid Patients (Hyper)", "severity": "SAFE", "reason": "No known interaction", "recommendation": "Safe for consumption" },
        { "group": "IBS / Digestive Disorders", "severity": "CAUTION", "reason": "Acidity may trigger heartburn or reflux in sensitive individuals", "recommendation": "Consume in moderation, avoid on empty stomach" },
        { "group": "Pregnant Women", "severity": "SAFE", "reason": "Rich in folate and vitamin C", "recommendation": "Beneficial during pregnancy" },
        { "group": "Infants & Children Under 5", "severity": "SAFE", "reason": "Soft, easy to digest when cooked", "recommendation": "Introduce after 12 months, serve cooked" },
        { "group": "Elderly (65+)", "severity": "SAFE", "reason": "Easy to chew, nutrient-rich", "recommendation": "Beneficial, serve cooked for easier digestion" },
        { "group": "Kidney Disease Patients", "severity": "CAUTION", "reason": "Moderate potassium content (237mg/100g)", "recommendation": "Consult nephrologist for portion limits" },
        { "group": "Blood Thinner Users (e.g. Warfarin)", "severity": "SAFE", "reason": "Low vitamin K content, minimal interaction", "recommendation": "Safe for regular consumption" }
      ]
    },
    {
      "vegetable_id": "veg_02",
      "vegetable_name": "Spinach",
      "risk_groups": [
        { "group": "Diabetics", "severity": "SAFE", "reason": "Very low GI, high fibre", "recommendation": "Excellent for blood sugar control" },
        { "group": "Thyroid Patients (Hypo)", "severity": "CAUTION", "reason": "Contains goitrogens that may interfere with thyroid function when consumed raw in large quantities", "recommendation": "Cook thoroughly to reduce goitrogen content" },
        { "group": "Thyroid Patients (Hyper)", "severity": "SAFE", "reason": "Goitrogens may be beneficial for hyperthyroid", "recommendation": "Safe for consumption" },
        { "group": "IBS / Digestive Disorders", "severity": "SAFE", "reason": "High fibre content aids digestion", "recommendation": "Introduce gradually to avoid bloating" },
        { "group": "Pregnant Women", "severity": "SAFE", "reason": "Rich in folate and iron", "recommendation": "Highly beneficial, cook thoroughly" },
        { "group": "Infants & Children Under 5", "severity": "SAFE", "reason": "Soft when cooked, nutrient-dense", "recommendation": "Blend into purees for babies from 8 months" },
        { "group": "Elderly (65+)", "severity": "SAFE", "reason": "Easy to digest when cooked", "recommendation": "Beneficial for bone health due to vitamin K" },
        { "group": "Kidney Disease Patients", "severity": "AVOID", "reason": "Very high potassium (558mg/100g) and oxalates", "recommendation": "Avoid or consume in very small quantities after consultation" },
        { "group": "Blood Thinner Users (e.g. Warfarin)", "severity": "AVOID", "reason": "Very high vitamin K content interferes with warfarin effectiveness", "recommendation": "Maintain consistent intake; consult doctor for dosage adjustment" }
      ]
    },
    {
      "vegetable_id": "veg_03",
      "vegetable_name": "Carrot",
      "risk_groups": [
        { "group": "Diabetics", "severity": "SAFE", "reason": "Low GI, moderate natural sugars", "recommendation": "Consume in moderation as part of balanced meal" },
        { "group": "Thyroid Patients (Hypo)", "severity": "SAFE", "reason": "No known interaction", "recommendation": "Safe for consumption" },
        { "group": "Thyroid Patients (Hyper)", "severity": "SAFE", "reason": "No known interaction", "recommendation": "Safe for consumption" },
        { "group": "IBS / Digestive Disorders", "severity": "SAFE", "reason": "Cooked carrots are easy to digest", "recommendation": "Cook before eating for easier digestion" },
        { "group": "Pregnant Women", "severity": "SAFE", "reason": "Rich in beta-carotene and vitamin A", "recommendation": "Beneficial for fetal development" },
        { "group": "Infants & Children Under 5", "severity": "SAFE", "reason": "Soft when cooked, naturally sweet", "recommendation": "Steam and mash for babies from 6 months" },
        { "group": "Elderly (65+)", "severity": "SAFE", "reason": "Soft texture when cooked", "recommendation": "Beneficial for eye health" },
        { "group": "Kidney Disease Patients", "severity": "CAUTION", "reason": "Moderate potassium content (320mg/100g)", "recommendation": "Consult nephrologist for appropriate portion size" },
        { "group": "Blood Thinner Users (e.g. Warfarin)", "severity": "SAFE", "reason": "Low vitamin K content", "recommendation": "Safe for regular consumption" }
      ]
    },
    {
      "vegetable_id": "veg_04",
      "vegetable_name": "Broccoli",
      "risk_groups": [
        { "group": "Diabetics", "severity": "SAFE", "reason": "Low GI, high fibre content helps stabilize blood sugar", "recommendation": "Excellent choice for blood sugar control" },
        { "group": "Thyroid Patients (Hypo)", "severity": "CAUTION", "reason": "Contains goitrogens that may interfere with thyroid function when consumed raw in large amounts", "recommendation": "Cook thoroughly to reduce goitrogen content" },
        { "group": "Thyroid Patients (Hyper)", "severity": "SAFE", "reason": "Goitrogens may be beneficial for hyperthyroidism", "recommendation": "Moderate consumption is safe" },
        { "group": "IBS / Digestive Disorders", "severity": "CAUTION", "reason": "High fibre and raffinose may cause gas and bloating in sensitive individuals", "recommendation": "Cook well and introduce gradually" },
        { "group": "Pregnant Women", "severity": "SAFE", "reason": "Rich in folate, vitamin C, and calcium", "recommendation": "Highly recommended, cook thoroughly" },
        { "group": "Infants & Children Under 5", "severity": "SAFE", "reason": "Soft when steamed, nutrient-dense", "recommendation": "Steam and puree for babies from 8 months" },
        { "group": "Elderly (65+)", "severity": "SAFE", "reason": "Easy to digest when cooked, rich in calcium and vitamin K", "recommendation": "Beneficial for bone health" },
        { "group": "Kidney Disease Patients", "severity": "CAUTION", "reason": "Moderate potassium content (316mg/100g)", "recommendation": "Consult nephrologist for portion limits" },
        { "group": "Blood Thinner Users (e.g. Warfarin)", "severity": "CAUTION", "reason": "Contains moderate vitamin K which may interfere with blood thinners", "recommendation": "Maintain consistent intake; consult doctor" }
      ]
    },
    {
      "vegetable_id": "veg_05",
      "vegetable_name": "Bell Pepper",
      "risk_groups": [
        { "group": "Diabetics", "severity": "SAFE", "reason": "Low GI, very low sugar content", "recommendation": "Excellent for blood sugar management" },
        { "group": "Thyroid Patients (Hypo)", "severity": "SAFE", "reason": "No known interaction", "recommendation": "Safe for consumption" },
        { "group": "Thyroid Patients (Hyper)", "severity": "SAFE", "reason": "No known interaction", "recommendation": "Safe for consumption" },
        { "group": "IBS / Digestive Disorders", "severity": "SAFE", "reason": "Low FODMAP, generally well tolerated", "recommendation": "Usually safe in moderate amounts" },
        { "group": "Pregnant Women", "severity": "SAFE", "reason": "Exceptionally high vitamin C aids iron absorption", "recommendation": "Highly beneficial during pregnancy" },
        { "group": "Infants & Children Under 5", "severity": "SAFE", "reason": "Soft when cooked, naturally sweet", "recommendation": "Roast and puree for babies from 8 months" },
        { "group": "Elderly (65+)", "severity": "SAFE", "reason": "Easy to chew, rich in antioxidants", "recommendation": "Beneficial for immune health" },
        { "group": "Kidney Disease Patients", "severity": "SAFE", "reason": "Low potassium content (211mg/100g)", "recommendation": "Generally safe for kidney patients" },
        { "group": "Blood Thinner Users (e.g. Warfarin)", "severity": "SAFE", "reason": "Very low vitamin K content", "recommendation": "Safe for regular consumption" }
      ]
    }
  ],
  "substitutions": [
    {
      "original_vegetable_id": "veg_02",
      "original_vegetable_name": "Spinach",
      "risk_reason": "High vitamin K contraindicated for blood thinner users; high oxalates and potassium for kidney patients",
      "affected_groups": ["Kidney Disease Patients", "Blood Thinner Users (e.g. Warfarin)"],
      "substitute_vegetable": "Zucchini (courgette)",
      "why_safer": "Zucchini is low in vitamin K (safe for warfarin users), low in potassium (safe for kidney patients), and contains no oxalates. It offers similar mild flavor and soft texture when cooked.",
      "nutritional_equivalence": "Moderate",
      "recipe_update": {
        "replaces_in_recipe": "all",
        "updated_ingredient_line": "Replace spinach with diced zucchini in all recipes"
      }
    }
  ],
  "integration_check": [
    {
      "vegetable_id": "veg_01",
      "vegetable_name": "Tomato",
      "detection_complete": True,
      "nutrition_complete": True,
      "allergy_checked": True,
      "substitute_evaluated": True,
      "overall_status": "FULLY PROCESSED"
    },
    {
      "vegetable_id": "veg_02",
      "vegetable_name": "Spinach",
      "detection_complete": True,
      "nutrition_complete": True,
      "allergy_checked": True,
      "substitute_evaluated": True,
      "overall_status": "FULLY PROCESSED"
    },
    {
      "vegetable_id": "veg_03",
      "vegetable_name": "Carrot",
      "detection_complete": True,
      "nutrition_complete": True,
      "allergy_checked": True,
      "substitute_evaluated": True,
      "overall_status": "FULLY PROCESSED"
    },
    {
      "vegetable_id": "veg_04",
      "vegetable_name": "Broccoli",
      "detection_complete": True,
      "nutrition_complete": True,
      "allergy_checked": True,
      "substitute_evaluated": True,
      "overall_status": "FULLY PROCESSED"
    },
    {
      "vegetable_id": "veg_05",
      "vegetable_name": "Bell Pepper",
      "detection_complete": True,
      "nutrition_complete": True,
      "allergy_checked": True,
      "substitute_evaluated": True,
      "overall_status": "FULLY PROCESSED"
    }
  ],
  "improvements": {
    "nutritional_gaps": ["Vitamin B12", "Omega-3 fatty acids", "Complete protein", "Vitamin D"],
    "suggested_add_ons": [
      { "ingredient": "Chickpeas or lentils", "reason": "Adds plant-based protein and fibre for satiety", "nutrient_it_adds": "Protein, Iron, Folate" },
      { "ingredient": "Avocado", "reason": "Provides healthy monounsaturated fats and creamy texture", "nutrient_it_adds": "Healthy fats, Vitamin E, Potassium" },
      { "ingredient": "Bell peppers", "reason": "Adds color variety and boosts vitamin C content significantly", "nutrient_it_adds": "Vitamin C, Antioxidants" }
    ],
    "cooking_technique_upgrades": {
      "easy": "Blanch the carrots for 30 seconds to enhance color and nutrient absorption",
      "intermediate": "Add a finishing touch of smoked paprika or sumac for depth of flavor",
      "advanced": "Use sous-vide carrots for precise texture, then glaze with honey-thyme butter"
    },
    "meal_balance_score_out_of_10": 8,
    "meal_balance_justification": "The 5-vegetable selection covers an excellent range of vitamins A, C, K, fibre, and antioxidants. Broccoli and bell pepper are standout additions. The main gaps are protein and healthy fats — a serving of legumes would bring this to 10/10.",
    "next_scan_suggestion": "Pair this vegetable plate with chickpeas or grilled tofu for a complete meal with protein and healthy fats",
    "overall_verdict": "Excellent 5-vegetable selection with high nutritional density. Tomato, spinach, carrot, broccoli, and bell pepper cover a wide spectrum of vitamins, minerals, and antioxidants. Broccoli stands out for its vitamin C and sulforaphane content, while bell pepper delivers the highest vitamin C per gram. The main gaps are protein, healthy fats, and vitamin B12. Adding lentils, avocado, or grilled paneer would make this a perfectly balanced meal.",
    "estimated_total_cost": "₹580 - ₹830",
    "leftover_recipe_suggestion": "Transform leftover roasted vegetables into a hearty frittata or blend into a creamy soup the next day."
  },
  "health_benefits": [
    {
      "vegetable_id": "veg_01",
      "vegetable_name": "Tomato",
      "benefits": [
        {
          "benefit": "Heart Health",
          "detail": "Rich in lycopene, a powerful antioxidant that reduces LDL oxidation and lowers the risk of cardiovascular disease.",
          "science": "Studies show that regular tomato consumption is associated with a 14% reduction in cardiovascular events (Journal of Nutrition, 2019)."
        },
        {
          "benefit": "Cancer Prevention",
          "detail": "Lycopene and beta-carotene in tomatoes help neutralize free radicals that can lead to cellular DNA damage.",
          "science": "A meta-analysis of 24 studies found that high tomato intake reduces prostate cancer risk by up to 20% (Cancer Epidemiology, 2020)."
        },
        {
          "benefit": "Skin Protection",
          "detail": "Carotenoids in tomatoes accumulate in skin tissue and provide natural protection against UV damage.",
          "science": "Daily intake of 40g tomato paste with olive oil reduced sunburn by 40% over 10 weeks (British Journal of Dermatology, 2011)."
        }
      ]
    },
    {
      "vegetable_id": "veg_02",
      "vegetable_name": "Spinach",
      "benefits": [
        {
          "benefit": "Bone Health",
          "detail": "High in vitamin K1 which activates osteocalcin, a protein essential for bone mineralization and strength.",
          "science": "Adults with the highest vitamin K intake had a 35% lower risk of hip fractures (American Journal of Clinical Nutrition, 2017)."
        },
        {
          "benefit": "Eye Protection",
          "detail": "Contains lutein and zeaxanthin, carotenoids that accumulate in the retina and filter harmful blue light.",
          "science": "A 12-year study found that 6mg daily of lutein reduced age-related macular degeneration risk by 41% (JAMA Ophthalmology, 2018)."
        },
        {
          "benefit": "Blood Pressure Regulation",
          "detail": "High nitrate content in spinach helps dilate blood vessels and improve blood flow naturally.",
          "science": "Consuming 200g of cooked spinach reduced systolic blood pressure by 5.4 mmHg within 3 hours (Nitric Oxide Journal, 2016)."
        }
      ]
    },
    {
      "vegetable_id": "veg_03",
      "vegetable_name": "Carrot",
      "benefits": [
        {
          "benefit": "Vision Support",
          "detail": "Extremely rich in beta-carotene which the body converts to vitamin A, essential for night vision and eye health.",
          "science": "A 15-year study on 50,000 women found that those consuming beta-carotene-rich diets had a 39% lower risk of cataracts (Ophthalmology, 2014)."
        },
        {
          "benefit": "Immune Function",
          "detail": "Vitamin A supports the production and function of white blood cells that fight infections.",
          "science": "Carrot consumption has been linked to a 20% reduction in respiratory infection risk in children (Nutrients, 2020)."
        },
        {
          "benefit": "Digestive Health",
          "detail": "Soluble and insoluble fibre in carrots promotes regular bowel movements and feeds beneficial gut bacteria.",
          "science": "A serving of grilled carrots provides ~2.8g fibre, supporting microbiome diversity and colon health (Nutrients, 2021)."
        }
      ]
    },
    {
      "vegetable_id": "veg_04",
      "vegetable_name": "Broccoli",
      "benefits": [
        {
          "benefit": "Cancer-Fighting Compounds",
          "detail": "Contains sulforaphane, a potent compound that activates detoxification enzymes and suppresses tumor growth.",
          "science": "Broccoli sprout extract reduced breast cancer cell proliferation by 65% in lab studies (Cancer Prevention Research, 2019)."
        },
        {
          "benefit": "Anti-Inflammatory",
          "detail": "Kaempferol and quercetin in broccoli reduce chronic inflammation markers throughout the body.",
          "science": "Regular broccoli consumption lowered CRP levels by 21% in a 10-week clinical trial (Journal of Nutrition, 2018)."
        },
        {
          "benefit": "Detoxification Support",
          "detail": "Glucosinolates in broccoli support phase II liver detoxification pathways, aiding toxin elimination.",
          "science": "Consuming 200g broccoli daily increased glutathione-S-transferase activity by 30% in 2 weeks (Carcinogenesis, 2017)."
        }
      ]
    },
    {
      "vegetable_id": "veg_05",
      "vegetable_name": "Bell Pepper",
      "benefits": [
        {
          "benefit": "Immune Boost",
          "detail": "One bell pepper contains more vitamin C than an orange, stimulating white blood cell production and activity.",
          "science": "A single medium red bell pepper provides 169% of the RDI for vitamin C, significantly enhancing immune response (NIH ODS, 2022)."
        },
        {
          "benefit": "Skin Health",
          "detail": "Vitamin C is essential for collagen synthesis, keeping skin firm, elastic, and youthful.",
          "science": "Individuals with the highest vitamin C intake had 11% fewer wrinkles and firmer skin (American Journal of Clinical Nutrition, 2012)."
        },
        {
          "benefit": "Eye Health",
          "detail": "Rich in lutein, zeaxanthin, and beta-cryptoxanthin — carotenoids that protect retinal cells from oxidative stress.",
          "science": "A diet rich in colorful peppers was associated with a 26% lower risk of age-related macular degeneration (AREDS2 Study, 2017)."
        }
      ]
    }
  ],
  "storage_tips": [
    {
      "vegetable_id": "veg_01",
      "vegetable_name": "Tomato",
      "method": "Countertop stem-end up, away from direct sunlight",
      "shelf_life_days": 5,
      "refrigerate": False,
      "refrigerate_note": "Refrigeration destroys texture and flavor — only refrigerate if fully ripe and need 2-3 more days.",
      "freeze_instructions": "Blanch whole tomatoes for 2 minutes, peel, then freeze in zip-top bags for up to 8 months.",
      "ripen_at_home": True,
      "ethylene_producer": True,
      "tip": "Never store tomatoes in the fridge if you plan to eat them within 3 days — cold kills the flavor enzymes."
    },
    {
      "vegetable_id": "veg_02",
      "vegetable_name": "Spinach",
      "method": "Refrigerate in a perforated bag with a paper towel to absorb moisture",
      "shelf_life_days": 5,
      "refrigerate": True,
      "refrigerate_note": "Keep at 1-4°C in the crisper drawer. Do not wash before storing — moisture accelerates spoilage.",
      "freeze_instructions": "Blanch for 30 seconds, squeeze dry, portion into bags and freeze for up to 12 months.",
      "ripen_at_home": False,
      "ethylene_producer": False,
      "tip": "Place a dry paper towel inside the bag — it absorbs condensation and doubles shelf life."
    },
    {
      "vegetable_id": "veg_03",
      "vegetable_name": "Carrot",
      "method": "Refrigerate in a sealed container submerged in water or wrapped in a damp cloth",
      "shelf_life_days": 21,
      "refrigerate": True,
      "refrigerate_note": "Remove leafy tops before storing — they draw moisture from the root and cause limpness.",
      "freeze_instructions": "Blanch sliced carrots for 3 minutes, cool, and freeze in bags for up to 10 months.",
      "ripen_at_home": False,
      "ethylene_producer": True,
      "tip": "Store carrots away from apples and pears — ethylene from those fruits makes carrots bitter."
    },
    {
      "vegetable_id": "veg_04",
      "vegetable_name": "Broccoli",
      "method": "Refrigerate in a loose bag with slight moisture — place stem-end in water like a bouquet",
      "shelf_life_days": 10,
      "refrigerate": True,
      "refrigerate_note": "Best kept at 0-1°C. Wrap in a damp paper towel to maintain crispness and prevent wilting.",
      "freeze_instructions": "Blanch florets for 2 minutes, shock in ice water, drain well, and freeze for up to 12 months.",
      "ripen_at_home": False,
      "ethylene_producer": False,
      "tip": "Wrap broccoli in a damp paper towel inside a perforated bag to keep it crisp for over a week."
    },
    {
      "vegetable_id": "veg_05",
      "vegetable_name": "Bell Pepper",
      "method": "Refrigerate whole and dry in the crisper drawer, unwashed",
      "shelf_life_days": 10,
      "refrigerate": True,
      "refrigerate_note": "Keep dry — any moisture on the skin encourages mold. Use within 10 days for best texture.",
      "freeze_instructions": "Slice or dice, spread on a baking sheet to flash freeze, then transfer to bags for up to 8 months.",
      "ripen_at_home": True,
      "ethylene_producer": True,
      "tip": "Bell peppers continue ripening at room temperature — leave on the counter if you want sweeter peppers."
    }
  ],
  "cooking_tips": [
    {
      "vegetable_id": "veg_01",
      "vegetable_name": "Tomato",
      "preparation": "Score an X on the bottom, blanch 30 seconds, then plunge into ice water for easy peeling. Remove seeds if making sauces.",
      "best_cooking_methods": ["Slow-roasting", "Sautéing", "Grilling", "Raw in salads"],
      "flavor_pairings": ["Basil", "Mozzarella", "Garlic", "Olive oil", "Oregano", "Balsamic vinegar"],
      "nutrition_preservation": "Cooking tomatoes with olive oil increases lycopene absorption by 3-5x. Avoid boiling as water-soluble vitamins leach out.",
      "common_mistakes": ["Refrigerating before ripening", "Overcooking until mushy", "Using dull knives that crush the flesh"]
    },
    {
      "vegetable_id": "veg_02",
      "vegetable_name": "Spinach",
      "preparation": "Wash thoroughly in cold water to remove grit. Remove thick stems. Pat dry or spin in a salad spinner.",
      "best_cooking_methods": ["Quick sauté", "Steaming", "Blanching", "Raw in salads"],
      "flavor_pairings": ["Garlic", "Lemon", "Nutmeg", "Cream", "Feta cheese", "Pine nuts"],
      "nutrition_preservation": "Steam for 2 minutes to retain maximum folate and vitamin C. Avoid prolonged boiling which destroys nutrients.",
      "common_mistakes": ["Overcrowding the pan (causes steaming instead of sautéing)", "Not drying leaves before cooking", "Cooking too long until slimy"]
    },
    {
      "vegetable_id": "veg_03",
      "vegetable_name": "Carrot",
      "preparation": "Scrub well — peeling is optional if organic. Cut into uniform sizes for even cooking. Save tops for pesto.",
      "best_cooking_methods": ["Roasting", "Steaming", "Sautéing", "Glazing", "Raw julienned"],
      "flavor_pairings": ["Honey", "Cumin", "Ginger", "Coriander", "Orange", "Thyme", "Butter"],
      "nutrition_preservation": "Lightly cooking carrots increases beta-carotene bioavailability by 65% compared to raw. Steaming is best.",
      "common_mistakes": ["Cutting pieces unevenly", "Overcrowding the roasting pan (causes steaming)", "Adding salt too early (draws out moisture)"]
    },
    {
      "vegetable_id": "veg_04",
      "vegetable_name": "Broccoli",
      "preparation": "Cut florets into even bite-sized pieces. Peel and slice the stem — it is just as nutritious as the florets.",
      "best_cooking_methods": ["Roasting at high heat", "Steaming", "Blanching", "Stir-frying"],
      "flavor_pairings": ["Garlic", "Lemon", "Chili flakes", "Parmesan", "Soy sauce", "Sesame", "Almonds"],
      "nutrition_preservation": "Steam for 4-5 minutes to preserve 90% of vitamin C and sulforaphane. Avoid boiling — it destroys 50% of nutrients.",
      "common_mistakes": ["Overcooking until mushy and gray", "Discarding the stems", "Cutting florets too small so they crumble"]
    },
    {
      "vegetable_id": "veg_05",
      "vegetable_name": "Bell Pepper",
      "preparation": "Cut off the top, remove seeds and white membranes. For roasting, keep whole or halve. The skin is edible.",
      "best_cooking_methods": ["Roasting", "Grilling", "Sautéing", "Stir-frying", "Raw in salads"],
      "flavor_pairings": ["Onion", "Garlic", "Basil", "Oregano", "Olive oil", "Capers", "Anchovy"],
      "nutrition_preservation": "Vitamin C degrades with heat — eat bell peppers raw for maximum vitamin C or lightly sauté for 3 minutes maximum.",
      "common_mistakes": ["Storing in plastic bags without air circulation", "Charring skin excessively", "Not removing all seeds before stuffing"]
    }
  ],
  "cost_estimation": [
    {
      "vegetable_id": "veg_01",
      "vegetable_name": "Tomato",
      "estimated_price_per_kg": "₹290 - ₹500",
      "price_seasonality": "Peak summer (July-September) is cheapest at ₹210/kg; winter greenhouse tomatoes can cost up to ₹670/kg.",
      "budget_tip": "Buy in bulk during farmers market season and can your own tomatoes for year-round savings.",
      "estimated_cost_for_this_scan": "₹130 - ₹230"
    },
    {
      "vegetable_id": "veg_02",
      "vegetable_name": "Spinach",
      "estimated_price_per_kg": "₹420 - ₹670",
      "price_seasonality": "Spring and fall offer the best prices (₹380/kg); summer heat and winter cold drive prices up by 30-40%.",
      "budget_tip": "Buy frozen spinach for recipes — it is 50% cheaper, equally nutritious, and lasts months in the freezer.",
      "estimated_cost_for_this_scan": "₹25 - ₹42"
    },
    {
      "vegetable_id": "veg_03",
      "vegetable_name": "Carrot",
      "estimated_price_per_kg": "₹130 - ₹250",
      "price_seasonality": "Carrots are affordable year-round; cheapest in fall harvest season (₹100/kg) and slightly pricier in early summer.",
      "budget_tip": "Buy whole carrots with tops still attached — they are fresher and cheaper than pre-cut baby carrots.",
      "estimated_cost_for_this_scan": "₹17 - ₹33"
    },
    {
      "vegetable_id": "veg_04",
      "vegetable_name": "Broccoli",
      "estimated_price_per_kg": "₹250 - ₹420",
      "price_seasonality": "Best prices in fall and winter (₹210/kg); spring/summer prices rise as supply tightens.",
      "budget_tip": "Use the entire broccoli — stem, leaves, and florets. The stem is just as tasty when peeled and sliced.",
      "estimated_cost_for_this_scan": "₹75 - ₹130"
    },
    {
      "vegetable_id": "veg_05",
      "vegetable_name": "Bell Pepper",
      "estimated_price_per_kg": "₹330 - ₹580",
      "price_seasonality": "Red and yellow peppers are 2x the price of green ones. Summer offers best value at around ₹250/kg.",
      "budget_tip": "Green bell peppers are significantly cheaper and have the same nutritional profile — use them when recipes don't require sweetness.",
      "estimated_cost_for_this_scan": "₹83 - ₹140"
    }
  ]
}
