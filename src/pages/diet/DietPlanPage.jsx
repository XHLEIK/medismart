import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DietPlanPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    goal: '',
    dietaryRestrictions: [],
    allergies: [],
  });
  const [dietPlan, setDietPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
    { value: 'light', label: 'Lightly active (light exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)' },
    { value: 'active', label: 'Active (hard exercise 6-7 days/week)' },
    { value: 'very_active', label: 'Very active (hard daily exercise & physical job)' },
  ];
  
  const goals = [
    { value: 'lose_weight', label: 'Lose weight' },
    { value: 'maintain', label: 'Maintain weight' },
    { value: 'gain_weight', label: 'Gain weight' },
    { value: 'improve_health', label: 'Improve overall health' },
    { value: 'increase_energy', label: 'Increase energy levels' },
  ];
  
  const dietaryRestrictions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten_free', label: 'Gluten-free' },
    { value: 'dairy_free', label: 'Dairy-free' },
    { value: 'keto', label: 'Ketogenic' },
    { value: 'paleo', label: 'Paleo' },
  ];
  
  const commonAllergies = [
    { value: 'peanuts', label: 'Peanuts' },
    { value: 'tree_nuts', label: 'Tree nuts' },
    { value: 'fish', label: 'Fish' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'milk', label: 'Milk' },
    { value: 'soy', label: 'Soy' },
    { value: 'wheat', label: 'Wheat' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          [category]: [...prev[category], value]
        };
      } else {
        return {
          ...prev,
          [category]: prev[category].filter(item => item !== value)
        };
      }
    });
  };

  const validateForm = () => {
    const { age, gender, weight, height, activityLevel, goal } = formData;
    if (!age || !gender || !weight || !height || !activityLevel || !goal) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would be an API call to an AI service
    setTimeout(() => {
      // Generate a mock diet plan based on the user's inputs
      const mockDietPlan = generateMockDietPlan(formData);
      setDietPlan(mockDietPlan);
      setIsLoading(false);
    }, 2000);
  };

  const generateMockDietPlan = (data) => {
    // This is a simplified mock plan - in a real app, this would come from an AI model
    let basePlan = {
      calorieIntake: calculateCalories(data),
      meals: [],
      nutrition: {
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
      },
      recommendations: [],
    };
    
    // Add meals based on dietary restrictions
    if (data.dietaryRestrictions.includes('vegetarian')) {
      basePlan.meals = vegetarianMeals;
      basePlan.recommendations.push('Include plant-based protein sources like legumes and tofu');
    } else if (data.dietaryRestrictions.includes('vegan')) {
      basePlan.meals = veganMeals;
      basePlan.recommendations.push('Ensure adequate B12 intake through fortified foods or supplements');
    } else {
      basePlan.meals = standardMeals;
    }
    
    // Add goal-specific recommendations
    if (data.goal === 'lose_weight') {
      basePlan.recommendations.push('Focus on high-protein foods to maintain muscle mass');
      basePlan.recommendations.push('Incorporate more fiber-rich vegetables to promote satiety');
    } else if (data.goal === 'gain_weight') {
      basePlan.recommendations.push('Increase portion sizes, especially for protein and complex carbs');
      basePlan.recommendations.push('Include nutrient-dense, calorie-rich foods like nuts and avocados');
    }
    
    // Add activity level recommendations
    if (data.activityLevel === 'active' || data.activityLevel === 'very_active') {
      basePlan.recommendations.push('Ensure adequate carbohydrate intake to fuel your workouts');
      basePlan.recommendations.push('Consider adding a post-workout protein shake to support recovery');
    }
    
    // Calculate nutrition
    basePlan.nutrition = {
      protein: Math.round(basePlan.calorieIntake * 0.25 / 4), // 25% of calories from protein (4 cal/g)
      carbs: Math.round(basePlan.calorieIntake * 0.45 / 4),   // 45% of calories from carbs (4 cal/g)
      fats: Math.round(basePlan.calorieIntake * 0.3 / 9),     // 30% of calories from fats (9 cal/g)
      fiber: Math.round(basePlan.calorieIntake / 1000 * 14),  // 14g per 1000 calories
    };
    
    return basePlan;
  };

  const calculateCalories = (data) => {
    // Very simplified BMR calculation using Harris-Benedict equation
    let bmr = 0;
    if (data.gender === 'male') {
      bmr = 88.362 + (13.397 * parseFloat(data.weight)) + (4.799 * parseFloat(data.height)) - (5.677 * parseFloat(data.age));
    } else {
      bmr = 447.593 + (9.247 * parseFloat(data.weight)) + (3.098 * parseFloat(data.height)) - (4.330 * parseFloat(data.age));
    }
    
    // Activity multiplier
    let activityMultiplier = 1.2; // Default to sedentary
    if (data.activityLevel === 'light') activityMultiplier = 1.375;
    else if (data.activityLevel === 'moderate') activityMultiplier = 1.55;
    else if (data.activityLevel === 'active') activityMultiplier = 1.725;
    else if (data.activityLevel === 'very_active') activityMultiplier = 1.9;
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    let tdee = bmr * activityMultiplier;
    
    // Adjust based on goal
    if (data.goal === 'lose_weight') tdee -= 500; // Deficit of 500 calories
    else if (data.goal === 'gain_weight') tdee += 500; // Surplus of 500 calories
    
    return Math.round(tdee);
  };

  // Mock meal plans
  const standardMeals = [
    {
      type: 'Breakfast',
      options: [
        '2 eggs, 1 slice whole grain toast, 1 cup berries',
        'Greek yogurt with granola and fruit',
        'Oatmeal with banana, walnuts, and a drizzle of honey',
      ],
    },
    {
      type: 'Lunch',
      options: [
        'Grilled chicken salad with olive oil dressing',
        'Tuna wrap with mixed greens and avocado',
        'Quinoa bowl with roasted vegetables and grilled salmon',
      ],
    },
    {
      type: 'Dinner',
      options: [
        'Baked chicken breast, sweet potato, and steamed broccoli',
        'Grilled lean steak with asparagus and brown rice',
        'Baked cod with quinoa and roasted vegetables',
      ],
    },
    {
      type: 'Snacks',
      options: [
        'Apple with almond butter',
        'Protein shake with banana',
        'Handful of mixed nuts',
        'Carrot sticks with hummus',
      ],
    },
  ];

  const vegetarianMeals = [
    {
      type: 'Breakfast',
      options: [
        '2 eggs, 1 slice whole grain toast, 1 cup berries',
        'Greek yogurt with granola and fruit',
        'Oatmeal with banana, walnuts, and a drizzle of honey',
      ],
    },
    {
      type: 'Lunch',
      options: [
        'Lentil soup with whole grain bread',
        'Caprese sandwich with mozzarella, tomato, and basil',
        'Spinach and feta wrap with hummus',
      ],
    },
    {
      type: 'Dinner',
      options: [
        'Black bean and vegetable stir fry with brown rice',
        'Eggplant parmesan with side salad',
        'Veggie burger with sweet potato fries',
      ],
    },
    {
      type: 'Snacks',
      options: [
        'Apple with almond butter',
        'Greek yogurt with berries',
        'Handful of mixed nuts',
        'Carrot sticks with hummus',
      ],
    },
  ];

  const veganMeals = [
    {
      type: 'Breakfast',
      options: [
        'Tofu scramble with vegetables',
        'Overnight oats with plant milk, chia seeds, and fruit',
        'Smoothie bowl with banana, berries, and plant-based protein',
      ],
    },
    {
      type: 'Lunch',
      options: [
        'Lentil and vegetable soup',
        'Quinoa salad with roasted vegetables and tahini dressing',
        'Hummus and vegetable wrap',
      ],
    },
    {
      type: 'Dinner',
      options: [
        'Chickpea curry with brown rice',
        'Plant-based burger with sweet potato fries',
        'Stir-fried tofu with vegetables and brown rice',
      ],
    },
    {
      type: 'Snacks',
      options: [
        'Apple with almond butter',
        'Edamame',
        'Trail mix with dried fruits and nuts',
        'Roasted chickpeas',
      ],
    },
  ];

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {formStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input-field mt-1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field mt-1"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="1"
                  max="500"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="input-field mt-1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="1"
                  max="300"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="input-field mt-1"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                Activity Level <span className="text-red-500">*</span>
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className="input-field mt-1"
                required
              >
                <option value="">Select activity level</option>
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                Goal <span className="text-red-500">*</span>
              </label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="input-field mt-1"
                required
              >
                <option value="">Select your goal</option>
                {goals.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setFormStep(2)}
                className="btn-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {formStep === 2 && (
          <div className="space-y-4">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions (select all that apply)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {dietaryRestrictions.map((restriction) => (
                  <label key={restriction.value} className="flex items-center">
                    <input
                      type="checkbox"
                      value={restriction.value}
                      checked={formData.dietaryRestrictions.includes(restriction.value)}
                      onChange={(e) => handleCheckboxChange(e, 'dietaryRestrictions')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{restriction.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Allergies (select all that apply)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {commonAllergies.map((allergy) => (
                  <label key={allergy.value} className="flex items-center">
                    <input
                      type="checkbox"
                      value={allergy.value}
                      checked={formData.allergies.includes(allergy.value)}
                      onChange={(e) => handleCheckboxChange(e, 'allergies')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{allergy.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Plan...
                  </div>
                ) : (
                  'Generate Diet Plan'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    );
  };

  const renderDietPlan = () => {
    if (!dietPlan) return null;
    
    return (
      <div className="space-y-6">
        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Calorie Goal</h3>
              <p className="text-3xl font-bold text-primary">{dietPlan.calorieIntake} calories</p>
            </div>
            <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-xl font-semibold text-gray-900">{dietPlan.nutrition.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-xl font-semibold text-gray-900">{dietPlan.nutrition.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Fats</p>
                <p className="text-xl font-semibold text-gray-900">{dietPlan.nutrition.fats}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Fiber</p>
                <p className="text-xl font-semibold text-gray-900">{dietPlan.nutrition.fiber}g</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Personalized Meal Plan</h3>
          <div className="space-y-4">
            {dietPlan.meals.map((meal, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-primary mb-2">{meal.type}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {meal.options.map((option, optIndex) => (
                    <li key={optIndex} className="text-gray-700">{option}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-2">
              {dietPlan.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => {
              setDietPlan(null);
              setFormData({
                age: '',
                gender: '',
                weight: '',
                height: '',
                activityLevel: '',
                goal: '',
                dietaryRestrictions: [],
                allergies: [],
              });
              setFormStep(1);
            }}
            className="btn-secondary"
          >
            Create Another Plan
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Diet Plan Generator</h1>
          <p className="text-gray-600">Get a personalized diet plan based on your health profile</p>
        </div>
      </div>
      
      <div className="card p-4">
        {!dietPlan ? (
          <>
            <div className="mb-6">
              <div className="flex mb-4">
                <div className={`flex-1 step flex items-center ${formStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${formStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="text-sm font-medium">Basic Information</span>
                </div>
                <div className={`flex-1 step flex items-center ${formStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${formStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Dietary Preferences</span>
                </div>
              </div>
            </div>
            
            {renderForm()}
          </>
        ) : (
          renderDietPlan()
        )}
      </div>
      
      <div className="card p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">About Our AI Diet Plans</h2>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 mb-4">
            Our AI-powered diet plan generator creates personalized nutrition recommendations based on your:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <li className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Age, gender, and body composition
            </li>
            <li className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Activity level and energy expenditure
            </li>
            <li className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Health and fitness goals
            </li>
            <li className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Dietary restrictions and preferences
            </li>
          </ul>
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This tool provides general dietary recommendations and should not replace professional medical advice.
            Always consult with a healthcare provider or registered dietitian before making significant changes to your diet, especially if you
            have any health conditions or concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DietPlanPage; 