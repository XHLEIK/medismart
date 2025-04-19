import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  processCommand, 
  speak as speakText, 
  startListening, 
  stopListening,
  initVoices 
} from '../components/voice-ai/CommandProcessor';

// Helper function to safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

// Create a Voice AI context
const VoiceAIContext = createContext();

export const useVoiceAI = () => useContext(VoiceAIContext);

export const VoiceAIProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAIResponse] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionError, setRecognitionError] = useState(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false);

  // Initialize voice capabilities
  useEffect(() => {
    const init = async () => {
      try {
        // Check for browser support
        const supported = isBrowser() && 
          (window.SpeechRecognition || window.webkitSpeechRecognition);
        
        setBrowserSupportsSpeechRecognition(!!supported);
        
        // Initialize voices
        if (supported) {
          await initVoices();
        }
      } catch (error) {
        console.error('Error initializing voice assistant:', error);
      }
    };
    
    init();
    
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, []);

  // Handle the recognized command
  const processRecognizedCommand = (command) => {
    if (!command) return;
    
    const normalizedCommand = command.toLowerCase().trim();
    setLastCommand(normalizedCommand);
    
    // Update command history
    setCommandHistory(prev => [...prev, {
      command: normalizedCommand,
      timestamp: new Date().toISOString()
    }]);
    
    // Process the command
    const result = processCommand(normalizedCommand);
    setAIResponse(result.response);
    
    // Speak the response
    speak(result.response);
    
    // Handle actions
    handleCommandAction(result);
  };

  // Handle command actions
  const handleCommandAction = (result) => {
    if (!result) return;
    
    switch(result.action) {
      case 'navigate':
        navigate(result.destination);
        break;
        
      case 'goBack':
        navigate(-1);
        break;
        
      case 'logout':
        // This would need to be handled by the app's auth system
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          navigate('/login');
        }
        break;
        
      // Additional actions could be handled here
        
      default:
        // No specific action needed
        break;
    }
  };

  // Toggle listening function
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setRecognitionError(null);
      
      const started = startListening(
        // On result
        (command) => {
          processRecognizedCommand(command);
          setIsListening(false);
        },
        // On error
        (error) => {
          console.error("Speech recognition error:", error);
          setRecognitionError(error);
          setIsListening(false);
        },
        // On end
        () => {
          setIsListening(false);
        }
      );
      
      if (started) {
        setIsListening(true);
      }
    }
  };

  // Speak function that updates state
  const speak = (text) => {
    if (!text) return;
    
    setIsSpeaking(true);
    
    speakText(text, () => {
      setIsSpeaking(false);
    });
  };

  const value = {
    isListening,
    aiResponse,
    lastCommand,
    commandHistory,
    isSpeaking,
    recognitionError,
    browserSupportsSpeechRecognition,
    toggleListening,
    processCommand: processRecognizedCommand,
    speak
  };

  return <VoiceAIContext.Provider value={value}>{children}</VoiceAIContext.Provider>;
}; 