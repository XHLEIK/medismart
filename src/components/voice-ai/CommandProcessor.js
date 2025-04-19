// CommandProcessor.js
// This utility processes voice commands and provides more complex functionality

// Helper function to safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

// Speech synthesis setup
let speechSynthesis = null;
let speechRecognition = null;
let voices = [];

// Initialize speech APIs if in browser
if (isBrowser()) {
  speechSynthesis = window.speechSynthesis;
  
  // Set up speech recognition with appropriate browser prefixes
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
  
  if (SpeechRecognition) {
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'en-US';
    
    // Optional: Set up grammar constraints if supported
    if (SpeechGrammarList) {
      const commands = [
        'dashboard', 'appointments', 'doctors', 'profile', 'chat',
        'video', 'back', 'book appointment', 'notifications', 'sign out', 'help'
      ];
      const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands.join(' | ')};`;
      const grammarList = new SpeechGrammarList();
      grammarList.addFromString(grammar, 1);
      speechRecognition.grammars = grammarList;
    }
  }
}

// Initialize voices when available
export const initVoices = () => {
  if (!isBrowser() || !speechSynthesis) return false;
  
  voices = speechSynthesis.getVoices();
  
  // If voices aren't ready, wait for them
  if (voices.length === 0) {
    return new Promise((resolve) => {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve(true);
      };
    });
  }
  
  return true;
};

// Speak text using speech synthesis
export const speak = (text, callback = null) => {
  if (!isBrowser() || !speechSynthesis) return;
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  // Create utterance with robotic voice
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a somewhat robotic-sounding voice
  if (voices.length === 0) {
    voices = speechSynthesis.getVoices();
  }
  
  // Find a good voice for our assistant
  // Prefer Microsoft David or Google US English voice if available
  const preferredVoice = voices.find(voice => 
    voice.name.includes('David') || 
    voice.name.includes('US English') ||
    (voice.name.toLowerCase().includes('male') && voice.lang.includes('en-'))
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Slightly adjust pitch and rate for more robotic feel
  utterance.pitch = 0.9;
  utterance.rate = 1.1;
  
  // Handle callback when speech ends
  if (callback) {
    utterance.onend = callback;
  }
  
  // Start speaking
  speechSynthesis.speak(utterance);
};

// Start listening for commands
export const startListening = (onResult, onError, onEnd) => {
  if (!isBrowser() || !speechRecognition) {
    if (onError) onError('Speech recognition not supported');
    return false;
  }
  
  speechRecognition.onresult = (event) => {
    const last = event.results.length - 1;
    const command = event.results[last][0].transcript.trim();
    if (onResult) onResult(command);
  };
  
  speechRecognition.onerror = (event) => {
    if (onError) onError(event.error);
  };
  
  speechRecognition.onend = () => {
    if (onEnd) onEnd();
  };
  
  try {
    speechRecognition.start();
    return true;
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    if (onError) onError(error.message);
    return false;
  }
};

// Stop listening
export const stopListening = () => {
  if (!isBrowser() || !speechRecognition) return;
  
  try {
    speechRecognition.stop();
  } catch (error) {
    console.error('Error stopping speech recognition:', error);
  }
};

/**
 * Process natural language commands and determine the action to take
 * @param {string} command - The voice command to process
 * @param {object} context - Context information like current user, location, etc.
 * @returns {object} - The determined action and response
 */
export const processCommand = (command, context = {}) => {
  if (!command) {
    return {
      action: 'none',
      response: "I didn't hear anything. Please try again."
    };
  }
  
  const normalizedCommand = command.toLowerCase().trim();
  
  // ---- Navigation commands ----
  if (matchCommand(normalizedCommand, ['go to dashboard', 'open dashboard', 'show dashboard', 'dashboard'])) {
    return {
      action: 'navigate',
      destination: '/dashboard',
      response: "Opening the dashboard"
    };
  }
  
  if (matchCommand(normalizedCommand, ['go to appointments', 'show appointments', 'view appointments', 'my appointments'])) {
    return {
      action: 'navigate',
      destination: '/appointments',
      response: "Opening your appointments"
    };
  }
  
  if (matchCommand(normalizedCommand, ['go to doctors', 'find doctors', 'show doctors', 'view doctors'])) {
    return {
      action: 'navigate',
      destination: '/doctor',
      response: "Taking you to the doctors page"
    };
  }
  
  if (matchCommand(normalizedCommand, ['go to profile', 'open profile', 'show profile', 'my profile'])) {
    return {
      action: 'navigate',
      destination: '/profile',
      response: "Opening your profile"
    };
  }
  
  if (matchCommand(normalizedCommand, ['go to chat', 'open chat', 'show chat', 'doctor chat'])) {
    return {
      action: 'navigate',
      destination: '/chat',
      response: "Opening the chat interface"
    };
  }
  
  if (matchCommand(normalizedCommand, ['video consultation', 'video call', 'start video', 'doctor video'])) {
    return {
      action: 'navigate',
      destination: '/videocall',
      response: "Starting video consultation"
    };
  }
  
  if (matchCommand(normalizedCommand, ['go back', 'previous page', 'back', 'return'])) {
    return {
      action: 'goBack',
      response: "Going back to the previous page"
    };
  }

  // ---- Appointment actions ----
  if (matchCommand(normalizedCommand, ['book appointment', 'schedule appointment', 'new appointment', 'make appointment'])) {
    return {
      action: 'navigate',
      destination: '/appointments/new',
      response: "Let's book a new appointment"
    };
  }
  
  if (matchCommand(normalizedCommand, ['cancel appointment', 'delete appointment', 'remove appointment'])) {
    return {
      action: 'openDialog',
      dialog: 'cancelAppointment',
      response: "Which appointment would you like to cancel?"
    };
  }
  
  if (matchCommand(normalizedCommand, ['reschedule appointment', 'change appointment', 'move appointment'])) {
    return {
      action: 'openDialog',
      dialog: 'rescheduleAppointment',
      response: "Let's reschedule your appointment"
    };
  }

  // ---- Medication actions ----
  if (matchCommand(normalizedCommand, ['my medications', 'view medications', 'show medications', 'medicine list'])) {
    return {
      action: 'navigate',
      destination: '/medication',
      response: "Showing your medications"
    };
  }
  
  if (matchCommand(normalizedCommand, ['add medication', 'new medication', 'track medication'])) {
    return {
      action: 'navigate',
      destination: '/medication/add',
      response: "Let's add a new medication to track"
    };
  }

  // ---- Notification actions ----
  if (matchCommand(normalizedCommand, ['show notifications', 'check notifications', 'any notifications', 'my notifications'])) {
    return {
      action: 'openNotifications',
      response: "Checking your notifications"
    };
  }
  
  // ---- Authentication actions ----
  if (matchCommand(normalizedCommand, ['logout', 'sign out', 'log off', 'sign me out'])) {
    return {
      action: 'logout',
      response: "Signing you out"
    };
  }
  
  // ---- Help commands ----
  if (matchCommand(normalizedCommand, ['help', 'what can you do', 'available commands', 'how to use'])) {
    return {
      action: 'showHelp',
      response: "I can help with navigation, appointments, medications, and more. Try commands like 'go to dashboard', 'book appointment', or 'show notifications'."
    };
  }
  
  if (matchCommand(normalizedCommand, ['who are you', 'what are you', 'your name'])) {
    return {
      action: 'info',
      response: "I'm MediSmart's voice assistant, designed to help you navigate the healthcare app and manage your medical needs through voice commands."
    };
  }

  // ---- Calendar and Date commands ----
  if (matchCommand(normalizedCommand, ['what day is today', 'today date', 'current date'])) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);
    return {
      action: 'provideInfo',
      response: `Today is ${dateString}`
    };
  }
  
  if (matchCommand(normalizedCommand, ['what time is it', 'current time', 'time now'])) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
    return {
      action: 'provideInfo',
      response: `The current time is ${timeString}`
    };
  }

  // ---- Health tips ----
  if (matchCommand(normalizedCommand, ['health tip', 'medical advice', 'wellness tip'])) {
    const tips = [
      "Remember to stay hydrated by drinking at least 8 glasses of water daily.",
      "Regular exercise, even just 30 minutes of walking each day, can significantly improve your health.",
      "Don't forget to take breaks from screen time to protect your eyes.",
      "Eating a colorful variety of fruits and vegetables helps ensure you get a range of nutrients.",
      "Regular health check-ups are important even when you feel healthy.",
      "Adequate sleep is crucial for your immune system and overall health."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    return {
      action: 'provideInfo',
      response: randomTip
    };
  }

  // Fallback for unrecognized commands
  return {
    action: 'unknown',
    response: "I'm sorry, I didn't understand that command. Try saying 'help' to see what I can do."
  };
};

/**
 * Check if a command matches any of the provided patterns
 * @param {string} command - The normalized command to check
 * @param {Array<string>} patterns - Array of patterns to match against
 * @returns {boolean} - Whether the command matches any pattern
 */
function matchCommand(command, patterns) {
  return patterns.some(pattern => command.includes(pattern));
}

/**
 * Extracts entities from commands (names, dates, etc.)
 * @param {string} command - The command to extract from
 * @param {string} entityType - Type of entity to extract
 * @returns {string|null} - The extracted entity or null
 */
export const extractEntity = (command, entityType) => {
  // This would be more sophisticated in a real implementation
  // Potentially using NLP libraries
  switch(entityType) {
    case 'date':
      // Simple date extraction (very basic example)
      const datePattern = /(?:on|for|at) (tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;
      const dateMatch = command.match(datePattern);
      return dateMatch ? dateMatch[1] : null;
      
    case 'time':
      // Simple time extraction
      const timePattern = /(?:at) (\d{1,2}(?::\d{2})? ?(?:am|pm)?)/i;
      const timeMatch = command.match(timePattern);
      return timeMatch ? timeMatch[1] : null;
      
    default:
      return null;
  }
};

/**
 * Generate a conversational response
 * @param {string} intent - The determined intent
 * @param {object} entities - Extracted entities
 * @returns {string} - A conversational response
 */
export const generateResponse = (intent, entities = {}) => {
  // In a more advanced implementation, this would use a more sophisticated
  // approach for generating natural language responses
  
  switch(intent) {
    case 'booking':
      const date = entities.date || 'the specified date';
      return `I'll book your appointment for ${date}. What time would you prefer?`;
      
    case 'greeting':
      const greetings = [
        "Hello! How can I help you with your healthcare today?",
        "Hi there! What can I do for you?",
        "Greetings! How may I assist you with your medical needs?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
      
    default:
      return "I'm here to help with your healthcare needs. What would you like to do?";
  }
}; 