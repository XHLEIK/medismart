import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  ArrowDownTrayIcon, 
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
  ClockIcon,
  CalendarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Medicine categories with associated themes
const MEDICINE_CATEGORIES = {
  'Analgesic': { color: 'red', darkColor: 'red-700', lightColor: 'red-50' },
  'Antibiotic': { color: 'blue', darkColor: 'blue-700', lightColor: 'blue-50' },
  'Antidepressant': { color: 'purple', darkColor: 'purple-700', lightColor: 'purple-50' },
  'Antidiabetic': { color: 'green', darkColor: 'green-700', lightColor: 'green-50' },
  'Antihistamine': { color: 'yellow', darkColor: 'yellow-700', lightColor: 'yellow-50' },
  'Antihypertensive': { color: 'emerald', darkColor: 'emerald-700', lightColor: 'emerald-50' },
  'Anti-inflammatory': { color: 'orange', darkColor: 'orange-700', lightColor: 'orange-50' },
  'Antimalarial': { color: 'lime', darkColor: 'lime-700', lightColor: 'lime-50' },
  'Antipsychotic': { color: 'indigo', darkColor: 'indigo-700', lightColor: 'indigo-50' },
  'Antiviral': { color: 'sky', darkColor: 'sky-700', lightColor: 'sky-50' },
  'Bronchodilator': { color: 'cyan', darkColor: 'cyan-700', lightColor: 'cyan-50' },
  'Decongestant': { color: 'teal', darkColor: 'teal-700', lightColor: 'teal-50' },
  'Diuretic': { color: 'blue', darkColor: 'blue-700', lightColor: 'blue-50' },
  'Hormone': { color: 'pink', darkColor: 'pink-700', lightColor: 'pink-50' },
  'Immunosuppressant': { color: 'violet', darkColor: 'violet-700', lightColor: 'violet-50' },
  'Laxative': { color: 'amber', darkColor: 'amber-700', lightColor: 'amber-50' },
  'Muscle Relaxant': { color: 'rose', darkColor: 'rose-700', lightColor: 'rose-50' },
  'NSAID': { color: 'orange', darkColor: 'orange-700', lightColor: 'orange-50' },
  'Opioid': { color: 'red', darkColor: 'red-700', lightColor: 'red-50' },
  'Sedative': { color: 'purple', darkColor: 'purple-700', lightColor: 'purple-50' },
  'Statin': { color: 'green', darkColor: 'green-700', lightColor: 'green-50' },
  'Steroid': { color: 'yellow', darkColor: 'yellow-700', lightColor: 'yellow-50' },
  'Thyroid Hormone': { color: 'blue', darkColor: 'blue-700', lightColor: 'blue-50' },
  'Vitamin': { color: 'green', darkColor: 'green-700', lightColor: 'green-50' },
  'ACE Inhibitor': { color: 'emerald', darkColor: 'emerald-700', lightColor: 'emerald-50' },
  'Beta Blocker': { color: 'indigo', darkColor: 'indigo-700', lightColor: 'indigo-50' },
  'Calcium Channel Blocker': { color: 'amber', darkColor: 'amber-700', lightColor: 'amber-50' },
  'Proton Pump Inhibitor': { color: 'teal', darkColor: 'teal-700', lightColor: 'teal-50' },
  'SSRI Antidepressant': { color: 'purple', darkColor: 'purple-700', lightColor: 'purple-50' },
};

// Function to generate a large dataset of medicines
const generateMedicineData = () => {
  const genericNames = [
    "Acetaminophen", "Amoxicillin", "Atorvastatin", "Azithromycin", "Lisinopril", 
    "Metformin", "Amlodipine", "Albuterol", "Losartan", "Simvastatin", 
    "Metoprolol", "Omeprazole", "Gabapentin", "Hydrochlorothiazide", "Sertraline", 
    "Citalopram", "Fluoxetine", "Levothyroxine", "Prednisone", "Ibuprofen", 
    "Tramadol", "Furosemide", "Pantoprazole", "Montelukast", "Aspirin",
    "Meloxicam", "Cetirizine", "Loratadine", "Alprazolam", "Zolpidem",
    "Oxycodone", "Hydrocodone", "Doxycycline", "Ciprofloxacin", "Cephalexin",
    "Clindamycin", "Warfarin", "Clopidogrel", "Metronidazole", "Naproxen",
    "Clarithromycin", "Cyclobenzaprine", "Methylprednisolone", "Lorazepam", "Diazepam",
    "Atenolol", "Carvedilol", "Cefdinir", "Tamsulosin", "Pravastatin",
    "Rosuvastatin", "Duloxetine", "Escitalopram", "Venlafaxine", "Bupropion",
    "Clonazepam", "Amitriptyline", "Folic Acid", "Spironolactone", "Glipizide",
    "Ramipril", "Valsartan", "Diltiazem", "Propranolol", "Ranitidine", 
    "Famotidine", "Ondansetron", "Promethazine", "Dicyclomine", "Fluconazole",
    "Nitrofurantoin", "Sulfamethoxazole", "Potassium", "Levetiracetam", "Latanoprost",
    "Finasteride", "Sildenafil", "Tadalafil", "Insulin", "Enoxaparin",
    "Morphine", "Fentanyl", "Risedronate", "Alendronate", "Estradiol",
    "Ethinyl Estradiol", "Norethindrone", "Hydroxychloroquine", "Topiramate", "Lamotrigine",
    "Oxcarbazepine", "Memantine", "Donepezil", "Atomoxetine", "Methylphenidate",
    "Lisdexamfetamine", "Glyburide", "Glimepiride", "Pioglitazone", "Allopurinol",
    "Colchicine", "Febuxostat", "Baclofen", "Tizanidine", "Chlorzoxazone",
    "Dexamethasone", "Triamcinolone", "Nifedipine", "Digoxin", "Olmesartan"
  ];

  const brandNames = [
    "Tylenol", "Amoxil", "Lipitor", "Zithromax", "Prinivil", 
    "Glucophage", "Norvasc", "Ventolin", "Cozaar", "Zocor", 
    "Lopressor", "Prilosec", "Neurontin", "Microzide", "Zoloft", 
    "Celexa", "Prozac", "Synthroid", "Deltasone", "Advil", 
    "Ultram", "Lasix", "Protonix", "Singulair", "Bayer", 
    "Mobic", "Zyrtec", "Claritin", "Xanax", "Ambien", 
    "OxyContin", "Vicodin", "Vibramycin", "Cipro", "Keflex", 
    "Cleocin", "Coumadin", "Plavix", "Flagyl", "Aleve", 
    "Biaxin", "Flexeril", "Medrol", "Ativan", "Valium", 
    "Tenormin", "Coreg", "Omnicef", "Flomax", "Pravachol", 
    "Crestor", "Cymbalta", "Lexapro", "Effexor", "Wellbutrin", 
    "Klonopin", "Elavil", "Folvite", "Aldactone", "Glucotrol", 
    "Altace", "Diovan", "Cardizem", "Inderal", "Zantac", 
    "Pepcid", "Zofran", "Phenergan", "Bentyl", "Diflucan", 
    "Macrobid", "Bactrim", "K-Dur", "Keppra", "Xalatan", 
    "Proscar", "Viagra", "Cialis", "Humulin", "Lovenox", 
    "MS Contin", "Duragesic", "Actonel", "Fosamax", "Estrace", 
    "Estradiol", "Aygestin", "Plaquenil", "Topamax", "Lamictal", 
    "Trileptal", "Namenda", "Aricept", "Strattera", "Ritalin", 
    "Vyvanse", "DiaBeta", "Amaryl", "Actos", "Zyloprim", 
    "Colcrys", "Uloric", "Lioresal", "Zanaflex", "Parafon Forte", 
    "Decadron", "Kenalog", "Procardia", "Lanoxin", "Benicar"
  ];

  const forms = ["Tablet", "Capsule", "Liquid", "Injection", "Patch", "Cream", "Ointment", "Gel", "Spray", "Inhaler", "Powder", "Extended-release tablet", "Delayed-release capsule", "Suppository", "Drops"];
  
  const sideEffects = [
    "Nausea", "Dizziness", "Headache", "Drowsiness", "Fatigue", 
    "Dry mouth", "Constipation", "Diarrhea", "Insomnia", "Vomiting", 
    "Rash", "Itching", "Increased heart rate", "Decreased heart rate", "Blurred vision", 
    "Muscle pain", "Joint pain", "Stomach pain", "Weight gain", "Weight loss", 
    "Increased appetite", "Decreased appetite", "Anxiety", "Depression", "Mood changes", 
    "Irritability", "Confusion", "Memory problems", "Shortness of breath", "Cough", 
    "Heartburn", "Acid reflux", "Gas", "Bloating", "Upset stomach", 
    "Swelling", "Edema", "High blood pressure", "Low blood pressure", "Increased blood sugar", 
    "Decreased blood sugar", "Hair loss", "Sweating", "Hot flashes", "Chills", 
    "Tremors", "Weakness", "Numbness", "Tingling", "Sleep disturbances"
  ];

  const warnings = [
    "May cause drowsiness. Use caution when driving or operating machinery.",
    "Do not take with alcohol.",
    "Take with food to minimize stomach upset.",
    "May increase risk of bleeding. Inform your doctor before surgery.",
    "May increase risk of heart attack or stroke with long-term use.",
    "Do not stop taking suddenly without consulting your doctor.",
    "Avoid grapefruit juice while taking this medication.",
    "May reduce the effectiveness of birth control pills.",
    "May cause birth defects if taken during pregnancy.",
    "Not recommended for use in children under 12 years of age.",
    "May cause photosensitivity. Avoid prolonged exposure to sunlight.",
    "May interact with other medications. Inform your doctor of all medications you are taking.",
    "May cause allergic reactions in people with known allergies.",
    "May affect liver function. Regular monitoring recommended.",
    "May affect kidney function. Regular monitoring recommended.",
    "May increase risk of suicidal thoughts in young adults.",
    "May cause changes in blood pressure.",
    "May cause changes in heart rhythm.",
    "May cause dizziness upon standing.",
    "May cause dependency with long-term use."
  ];

  const categories = Object.keys(MEDICINE_CATEGORIES);

  // Generate 10,000+ medicines
  const medicines = [];
  for (let i = 0; i < 10500; i++) {
    const genericNameIndex = i % genericNames.length;
    const brandNameIndex = i % brandNames.length;
    const nameModifier = Math.floor(i / genericNames.length) > 0 ? ` ${Math.floor(i / genericNames.length) + 1}` : '';
    
    const genericName = genericNames[genericNameIndex] + nameModifier;
    const brandName = brandNames[brandNameIndex] + nameModifier;
    
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const category = categories[categoryIndex];
    
    const dosages = ["25mg", "50mg", "100mg", "200mg", "250mg", "500mg", "1000mg", "5mg", "10mg", "20mg", "40mg", "80mg", "2.5mg", "5mcg", "10mcg", "20mcg", "40mcg", "100mcg"];
    const dosage = dosages[Math.floor(Math.random() * dosages.length)];
    
    const form = forms[Math.floor(Math.random() * forms.length)];
    
    const frequencies = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "Every 4 hours", "Every 6 hours", "Every 8 hours", "Every 12 hours", "As needed", "Weekly", "Monthly", "Before meals", "After meals", "At bedtime"];
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    
    const purposes = [
      "Pain relief", "Fever reduction", "Bacterial infections", "Viral infections", 
      "High blood pressure", "High cholesterol", "Diabetes", "Heart failure", 
      "Asthma", "Allergies", "Inflammation", "Depression", "Anxiety", "Insomnia", 
      "Seizures", "Acid reflux", "Ulcers", "Cough", "Congestion", "Thyroid disorders", 
      "Hormone replacement", "Birth control", "Osteoporosis", "Arthritis", 
      "Cancer", "Immune disorders", "HIV/AIDS", "Organ transplant", "Alzheimer's disease", 
      "Parkinson's disease", "ADHD", "Bipolar disorder", "Schizophrenia", "OCD", 
      "PTSD", "Substance abuse", "Smoking cessation", "Weight loss", "Erectile dysfunction", 
      "Benign prostatic hyperplasia", "Glaucoma", "Macular degeneration", "Multiple sclerosis", 
      "Fibromyalgia", "Gout", "Migraine", "Nausea", "Constipation", "Diarrhea"
    ];
    
    const purpose = purposes[Math.floor(Math.random() * purposes.length)];
    
    // Get 3-5 random side effects
    const numSideEffects = Math.floor(Math.random() * 3) + 3;
    const shuffledSideEffects = [...sideEffects].sort(() => 0.5 - Math.random());
    const selectedSideEffects = shuffledSideEffects.slice(0, numSideEffects).join(", ");
    
    // Get 1-2 random warnings
    const numWarnings = Math.floor(Math.random() * 2) + 1;
    const shuffledWarnings = [...warnings].sort(() => 0.5 - Math.random());
    const selectedWarnings = shuffledWarnings.slice(0, numWarnings).join(" ");
    
    // Create variation in the image index to handle the limited number of real images
    // This will cycle through the available image indices
    const imageIndex = (i % 100) + 1;
    
    medicines.push({
      id: i + 1,
      name: genericName,
      brand: brandName,
      category,
      dosage,
      form,
      frequency,
      purpose,
      sideEffects: selectedSideEffects,
      warnings: selectedWarnings,
      image: `https://via.placeholder.com/200x200/${getHashColor(category)}/FFFFFF?text=${encodeURIComponent(genericName.charAt(0))}`
    });
  }
  
  return medicines;
};

// Helper to create a hex color from a string for placeholders
const getHashColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

// Function to get theme colors based on medicine category
const getMedicineTheme = (category) => {
  return MEDICINE_CATEGORIES[category] || { color: 'teal', darkColor: 'teal-700', lightColor: 'teal-50' };
};

// Legacy mock data reduced to first few entries for reference
const MOCK_MEDICATIONS = [
  {
    id: 1,
    name: "Amoxicillin",
    brand: "Amoxil",
    category: "Antibiotic",
    dosage: "500mg",
    form: "Capsule",
    frequency: "Every 8 hours",
    purpose: "Bacterial infections",
    sideEffects: "Diarrhea, rash, nausea, vomiting",
    warnings: "Allergic reactions, may reduce effectiveness of birth control pills",
    image: "https://www.drugs.com/images/pills/nlm/001185176.jpg"
  },
  {
    id: 2,
    name: "Lisinopril",
    brand: "Prinivil, Zestril",
    category: "ACE Inhibitor",
    dosage: "10mg",
    form: "Tablet",
    frequency: "Once daily",
    purpose: "High blood pressure, heart failure",
    sideEffects: "Dizziness, headache, dry cough",
    warnings: "May cause birth defects if taken during pregnancy",
    image: "https://www.drugs.com/images/pills/mmx/t110014f/lisinopril.jpg"
  },
  // Additional entries removed for brevity
];

// Get user's medications from localStorage or provide defaults
const getUserMedications = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedMeds = localStorage.getItem('user_medications');
    if (storedMeds) {
      return JSON.parse(storedMeds);
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
  
  // Default medications if none in localStorage
  return [
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      schedule: ["8:00 AM"],
      refillDate: "2023-08-15",
      active: true,
      category: "ACE Inhibitor"
    },
    {
      id: 5,
      name: "Sertraline",
      dosage: "50mg",
      schedule: ["9:00 PM"],
      refillDate: "2023-08-28",
      active: true,
      category: "SSRI Antidepressant"
    },
    {
      id: 7,
      name: "Levothyroxine",
      dosage: "88mcg",
      schedule: ["7:00 AM"],
      refillDate: "2023-09-05",
      active: true,
      category: "Thyroid Hormone"
    }
  ];
};

const MedicationPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userMedications, setUserMedications] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [],
    forms: [],
    showOnlyPrescription: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  
  // Generate all medications data once on component mount
  const allMedications = useMemo(() => generateMedicineData(), []);
  
  // Get unique categories and forms for filters
  const allCategories = useMemo(() => 
    [...new Set(allMedications.map(med => med.category))].sort(),
    [allMedications]
  );
  
  const allForms = useMemo(() => 
    [...new Set(allMedications.map(med => med.form))].sort(),
    [allMedications]
  );
  
  // Initialize user medications
  useEffect(() => {
    setUserMedications(getUserMedications());
  }, []);
  
  // Apply theme based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const theme = getMedicineTheme(selectedCategory);
      document.documentElement.style.setProperty('--theme-color', `var(--${theme.color}-500)`);
      document.documentElement.style.setProperty('--theme-color-dark', `var(--${theme.darkColor})`);
      document.documentElement.style.setProperty('--theme-color-light', `var(--${theme.lightColor})`);
    } else {
      document.documentElement.style.setProperty('--theme-color', 'var(--teal-500)');
      document.documentElement.style.setProperty('--theme-color-dark', 'var(--teal-700)');
      document.documentElement.style.setProperty('--theme-color-light', 'var(--teal-50)');
    }
    
    return () => {
      // Reset theme when component unmounts
      document.documentElement.style.setProperty('--theme-color', 'var(--teal-500)');
      document.documentElement.style.setProperty('--theme-color-dark', 'var(--teal-700)');
      document.documentElement.style.setProperty('--theme-color-light', 'var(--teal-50)');
    };
  }, [selectedCategory]);
  
  // Search medications function with debounce
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const delayDebounce = setTimeout(() => {
      setIsSearching(true);
      
      // Apply search and filters
      let results = allMedications.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Apply category filters
      if (advancedFilters.categories.length > 0) {
        results = results.filter(med => 
          advancedFilters.categories.includes(med.category)
        );
      }
      
      // Apply form filters
      if (advancedFilters.forms.length > 0) {
        results = results.filter(med => 
          advancedFilters.forms.includes(med.form)
        );
      }
      
      setSearchResults(results);
      setCurrentPage(1);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, advancedFilters, allMedications]);
  
  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already triggered by the useEffect
  };
  
  // View medicine details
  const viewMedicineDetails = useCallback((medicine) => {
    setSelectedMedicine(medicine);
    setSelectedCategory(medicine.category);
  }, []);
  
  // Add medicine to user's list
  const addMedicineToUser = useCallback((medicine) => {
    const newUserMed = {
      id: medicine.id,
      name: medicine.name,
      dosage: medicine.dosage,
      schedule: ["8:00 AM"],
      refillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
      category: medicine.category
    };
    
    const updatedMeds = [...userMedications, newUserMed];
    setUserMedications(updatedMeds);
    
    // Save to localStorage
    try {
      localStorage.setItem('user_medications', JSON.stringify(updatedMeds));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    
    setShowAddForm(false);
    setSearchResults([]);
    setSearchTerm("");
  }, [userMedications]);
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setAdvancedFilters(prev => {
      if (filterType === 'categories' || filterType === 'forms') {
        // Toggle selection in array
        const currentValues = [...prev[filterType]];
        const valueIndex = currentValues.indexOf(value);
        
        if (valueIndex === -1) {
          currentValues.push(value);
        } else {
          currentValues.splice(valueIndex, 1);
        }
        
        return {
          ...prev,
          [filterType]: currentValues
        };
      } else {
        // Boolean toggle
        return {
          ...prev,
          [filterType]: value
        };
      }
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setAdvancedFilters({
      categories: [],
      forms: [],
      showOnlyPrescription: false
    });
    setSearchTerm("");
  };
  
  // Pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle removing a medication from user's list
  const removeMedication = (medicationId) => {
    const updatedMeds = userMedications.filter(med => med.id !== medicationId);
    setUserMedications(updatedMeds);
    
    // Save to localStorage
    try {
      localStorage.setItem('user_medications', JSON.stringify(updatedMeds));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };
  
  // Function to determine if a time slot has medications
  const getTimeSlotMedications = (timeRange) => {
    return userMedications.filter(med => {
      return med.schedule.some(time => {
        const hour = parseInt(time.split(':')[0]);
        if (timeRange === "Morning" && hour >= 6 && hour < 12) return true;
        if (timeRange === "Afternoon" && hour >= 12 && hour < 18) return true;
        if (timeRange === "Evening" && (hour >= 18 || hour < 6)) return true;
        return false;
      });
    });
  };
  
  // Get color classes based on category for medications
  const getMedicationCategoryClasses = (category) => {
    const theme = getMedicineTheme(category);
    return {
      bg: `bg-${theme.color}-500`,
      bgLight: `bg-${theme.lightColor}`,
      text: `text-${theme.color}-700`,
      border: `border-${theme.color}-200`,
      hover: `hover:bg-${theme.color}-100`
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with title and add button */}
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">Medications</h1>
          <p className="text-gray-600">Manage and track your medications</p>
        </div>
        <button 
          className="btn-primary flex items-center gap-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
          onClick={() => setShowAddForm(true)}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Search and add medicine section */}
      {showAddForm && (
        <div className="card p-4 bg-white shadow-md rounded-xl border border-gray-200 animate-slideInDown">
          <h2 className="text-lg font-semibold mb-4">Find a Medication</h2>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by medicine name or brand..."
                className="input-field pl-10 pr-4 py-2 w-full rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <button 
              type="button"
              className={`px-4 py-2 rounded-lg border ${showFilters ? 'bg-gray-100 border-gray-300' : 'border-gray-300'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              type="submit" 
              className="btn-primary px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
              disabled={isSearching || !searchTerm.trim()}
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : "Search"}
            </button>
          </form>
          
          {/* Advanced filters */}
          {showFilters && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Advanced Filters</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md bg-white">
                    {allCategories.slice(0, 15).map((category, idx) => (
                      <div key={idx} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          id={`category-${idx}`}
                          checked={advancedFilters.categories.includes(category)}
                          onChange={() => handleFilterChange('categories', category)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded"
                        />
                        <label htmlFor={`category-${idx}`} className="ml-2 text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                    {allCategories.length > 15 && (
                      <div className="text-center mt-2">
                        <button
                          type="button"
                          className="text-teal-600 text-sm hover:text-teal-800"
                          onClick={() => alert("More categories would be shown here")}
                        >
                          Show more...
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Forms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medication Forms
                  </label>
                  <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md bg-white">
                    {allForms.map((form, idx) => (
                      <div key={idx} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          id={`form-${idx}`}
                          checked={advancedFilters.forms.includes(form)}
                          onChange={() => handleFilterChange('forms', form)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded"
                        />
                        <label htmlFor={`form-${idx}`} className="ml-2 text-sm text-gray-700">
                          {form}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Search results */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searchResults.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Found {searchResults.length} medications {searchTerm ? `matching "${searchTerm}"` : ''}
                  </p>
                  
                  {/* Pagination */}
                  {searchResults.length > resultsPerPage && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-1 rounded ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        &laquo;
                      </button>
                      
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        &raquo;
                      </button>
                    </div>
                  )}
                </div>
                
                {currentResults.map(medicine => {
                  const themeClasses = getMedicationCategoryClasses(medicine.category);
                  
                  return (
                    <div 
                      key={medicine.id} 
                      className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors ${themeClasses.border}`}
                    >
                      <div className={`w-12 h-12 rounded-md overflow-hidden flex-shrink-0 ${themeClasses.bgLight}`}>
                        <img 
                          src={medicine.image} 
                          alt={medicine.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/100x100/${getHashColor(medicine.category)}/FFFFFF?text=${encodeURIComponent(medicine.name.charAt(0))}`;
                          }}
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-900">{medicine.name}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm text-gray-500">{medicine.dosage} • {medicine.form}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${themeClasses.bgLight} ${themeClasses.text}`}>
                            {medicine.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2">
                        <button 
                          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                          onClick={() => viewMedicineDetails(medicine)}
                        >
                          Details
                        </button>
                        <button 
                          className={`px-2 py-1 text-sm text-white rounded ${themeClasses.bg} hover:opacity-90`}
                          onClick={() => addMedicineToUser(medicine)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              searchTerm && !isSearching && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No medications found matching "{searchTerm}"</p>
                  <p className="text-sm text-gray-500 mt-1">Try another search term or check the spelling</p>
                </div>
              )
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setShowAddForm(false);
                setSearchResults([]);
                setSearchTerm("");
                setShowFilters(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Medication schedule section */}
      <div className="card bg-white p-4 shadow-md rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { time: "Morning", range: "6:00 AM - 12:00 PM", icon: "☀️" },
            { time: "Afternoon", range: "12:00 PM - 6:00 PM", icon: "🌤️" },
            { time: "Evening", range: "6:00 PM - 12:00 AM", icon: "🌙" }
          ].map((timeSlot, idx) => {
            const slotMedications = getTimeSlotMedications(timeSlot.time);
            
            return (
              <div 
                key={idx}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">{timeSlot.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{timeSlot.time}</h3>
                    <p className="text-xs text-gray-500">{timeSlot.range}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {slotMedications.length > 0 ? (
                    slotMedications.map(med => {
                      const themeClasses = getMedicationCategoryClasses(med.category);
                      
                      return (
                        <div key={med.id} className={`flex items-center p-2 rounded ${themeClasses.bgLight}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${themeClasses.bg}`}>
                            {med.name.charAt(0)}
                          </div>
                          <div className="ml-2">
                            <p className="text-sm font-medium">{med.name}</p>
                            <p className="text-xs text-gray-500">{med.dosage}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">No medications scheduled</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current medications */}
      <div className="card bg-white p-4 shadow-md rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Your Medications</h2>
        
        {userMedications.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You don't have any medications yet</p>
            <button 
              className="mt-3 px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50"
              onClick={() => setShowAddForm(true)}
            >
              Add your first medication
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userMedications.map(med => {
              // Find full medicine details
              const fullMedDetails = allMedications.find(m => m.id === med.id) || 
                                    MOCK_MEDICATIONS.find(m => m.id === med.id) || {};
              
              const themeClasses = getMedicationCategoryClasses(med.category);
              
              return (
                <div 
                  key={med.id}
                  className={`flex flex-wrap md:flex-nowrap items-start p-4 border rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all ${themeClasses.border}`}
                >
                  <div className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ${themeClasses.bgLight}`}>
                    <img 
                      src={fullMedDetails.image || `https://via.placeholder.com/100x100/${getHashColor(med.category)}/FFFFFF?text=${encodeURIComponent(med.name.charAt(0))}`} 
                      alt={med.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/100x100/${getHashColor(med.category)}/FFFFFF?text=${encodeURIComponent(med.name.charAt(0))}`;
                      }}
                    />
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex flex-wrap justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{med.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">{med.dosage}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${themeClasses.bgLight} ${themeClasses.text}`}>
                            {med.category}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {med.schedule.map((time, idx) => (
                            <span 
                              key={idx} 
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${themeClasses.bgLight} ${themeClasses.text}`}
                            >
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="block text-xs text-gray-500 flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Refill by: {med.refillDate}
                        </span>
                        <div className="mt-2 flex space-x-2">
                          <button 
                            className={`flex items-center px-2 py-1 text-sm border rounded ${themeClasses.border} ${themeClasses.text} hover:bg-opacity-20 ${themeClasses.hover}`}
                            onClick={() => viewMedicineDetails(fullMedDetails)}
                          >
                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                            Info
                          </button>
                          <button 
                            className="flex items-center px-2 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50"
                            onClick={() => removeMedication(med.id)}
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Medicine details modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">{selectedMedicine.name}</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setSelectedMedicine(null);
                    setSelectedCategory(null);
                  }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-4 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedMedicine.image} 
                      alt={selectedMedicine.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/300x300/${getHashColor(selectedMedicine.category)}/FFFFFF?text=${encodeURIComponent(selectedMedicine.name.charAt(0))}`;
                      }}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                      Download Info
                    </button>
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Brand Name</p>
                    <p className="text-gray-900">{selectedMedicine.brand}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="text-gray-900">{selectedMedicine.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Form</p>
                      <p className="text-gray-900">{selectedMedicine.form}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dosage</p>
                      <p className="text-gray-900">{selectedMedicine.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Frequency</p>
                      <p className="text-gray-900">{selectedMedicine.frequency}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purpose</p>
                    <p className="text-gray-900">{selectedMedicine.purpose}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Side Effects</p>
                    <p className="text-gray-900">{selectedMedicine.sideEffects}</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                    <p className="text-sm font-medium text-yellow-800">Warnings</p>
                    <p className="text-sm text-yellow-700 mt-1">{selectedMedicine.warnings}</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg flex items-start">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Important Safety Information</p>
                      <p className="text-sm text-blue-700 mt-1">
                        This information is for educational purposes only. Always consult with your healthcare provider before starting, stopping, or changing any medication.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm mr-3"
                  onClick={() => {
                    addMedicineToUser(selectedMedicine);
                    setSelectedMedicine(null);
                    setSelectedCategory(null);
                  }}
                >
                  Add to My Medications
                </button>
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedMedicine(null);
                    setSelectedCategory(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationPage; 