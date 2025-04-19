import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceAI } from '../../context/VoiceAIContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../layouts/MainLayout';
import { MicrophoneIcon, StopIcon, ArrowPathIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { 
  processCommand, 
  speak as speakText, 
  startListening, 
  stopListening, 
  initVoices 
} from './CommandProcessor';

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addNotification } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [recognitionError, setRecognitionError] = useState(null);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false);

  // Initialize voice synthesis
  useEffect(() => {
    const init = async () => {
      try {
        // Check for browser support
        const supported = typeof window !== 'undefined' && 
          (window.SpeechRecognition || window.webkitSpeechRecognition);
        
        setBrowserSupportsSpeechRecognition(!!supported);
        
        // Initialize voices
        await initVoices();
      } catch (error) {
        console.error('Error initializing voice assistant:', error);
      }
    };
    
    init();
    
    // Cleanup
    return () => {
      stopListening();
    };
  }, []);

  // Animation classes for the floating button
  const buttonClass = isListening
    ? "w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-pulse"
    : "w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-float";

  // List of available commands to show in help
  const availableCommands = [
    "Go to dashboard",
    "Show appointments",
    "Go to doctors",
    "Open profile",
    "Go to chat",
    "Video consultation",
    "Go back",
    "Book appointment",
    "Show notifications",
    "Sign out",
    "Help"
  ];

  // Close panel when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        if (isListening) toggleListening();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isListening]);

  // Handle command result
  const handleCommand = useCallback((command) => {
    setLastCommand(command);
    
    // Process the command
    const result = processCommand(command, { 
      userAuth: !!user,
      currentPath: window.location.pathname
    });
    
    setAIResponse(result.response);
    
    // Speak the response
    setIsSpeaking(true);
    speakText(result.response, () => {
      setIsSpeaking(false);
    });
    
    // Handle actions based on command result
    switch (result.action) {
      case 'navigate':
        navigate(result.destination);
        break;
      
      case 'goBack':
        navigate(-1);
        break;
      
      case 'openNotifications':
        // This would trigger the notifications panel
        document.querySelector('[aria-label="Notifications"]')?.click();
        break;
      
      case 'logout':
        logout();
        break;
      
      case 'showHelp':
        setShowCommands(true);
        break;
        
      case 'openDialog':
        // Would handle different dialog types
        addNotification({
          title: 'Voice Command',
          message: `Requested to open ${result.dialog} dialog`,
          type: 'appointment'
        });
        break;
        
      default:
        // No specific action needed for info responses
        break;
    }
  }, [navigate, user, logout, addNotification]);

  // Handle command result, errors, and listening end
  const handleRecognitionResult = (command) => {
    handleCommand(command);
    setIsListening(false);
  };
  
  const handleRecognitionError = (error) => {
    console.error('Speech recognition error:', error);
    setRecognitionError(error);
    setIsListening(false);
    
    // Provide feedback about the error
    setAIResponse(`I had trouble hearing you: ${error}`);
    speakText(`I had trouble hearing you. Please try again.`);
  };
  
  const handleRecognitionEnd = () => {
    setIsListening(false);
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setRecognitionError(null);
      const started = startListening(
        handleRecognitionResult,
        handleRecognitionError,
        handleRecognitionEnd
      );
      
      if (started) {
        setIsListening(true);
        setAIResponse("I'm listening...");
      } else {
        setAIResponse("Sorry, I couldn't start listening. Please try again.");
      }
    }
  };

  // Handle the floating button click
  const handleButtonClick = () => {
    if (!browserSupportsSpeechRecognition) {
      setIsOpen(true);
      setAIResponse('Your browser does not support speech recognition. Please try using Chrome, Edge, or Safari.');
      return;
    }
    
    if (!isOpen) {
      setIsOpen(true);
    } else {
      toggleListening();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button 
        className={buttonClass}
        onClick={handleButtonClick}
        aria-label={isListening ? "Stop listening" : "Start voice assistant"}
      >
        {isListening ? (
          <StopIcon className="h-6 w-6 animate-pulse" />
        ) : (
          <MicrophoneIcon className="h-6 w-6" />
        )}
      </button>

      {/* Voice assistant panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-slideInUp">
          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
            <h3 className="font-medium">MediSmart Voice Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Assistant response */}
            <div className={`p-3 rounded-lg bg-gray-100 flex items-start gap-2 ${isSpeaking ? 'animate-pulse' : ''}`}>
              {isSpeaking && (
                <SpeakerWaveIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
              )}
              <p className="text-gray-700">{aiResponse || "How can I help you today?"}</p>
            </div>
            
            {/* Detected command */}
            {lastCommand && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">I heard:</p>
                <p className="text-gray-700 font-medium mt-1 p-2 border border-gray-200 rounded">"{lastCommand}"</p>
              </div>
            )}
            
            {/* Error message if speech recognition failed */}
            {recognitionError && (
              <div className="mt-4 p-2 bg-red-50 text-red-600 rounded-lg text-sm">
                <p>Error: {recognitionError}</p>
                <p className="mt-1 text-red-500">Please try again or use a different browser.</p>
              </div>
            )}

            {/* Command list toggle */}
            <button 
              className="mt-4 text-primary hover:text-primary/80 text-sm flex items-center"
              onClick={() => setShowCommands(!showCommands)}
            >
              {showCommands ? "Hide commands" : "Show available commands"}
              <ArrowPathIcon className="ml-1 h-3 w-3" />
            </button>
            
            {/* Available commands */}
            {showCommands && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Try saying:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {availableCommands.map((command, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {command}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {isListening ? (
                <span className="flex items-center text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                  Listening...
                </span>
              ) : (
                <span>Click the mic to start</span>
              )}
            </div>
            
            <button 
              onClick={toggleListening}
              className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'}`}
              disabled={!browserSupportsSpeechRecognition}
            >
              {isListening ? (
                <StopIcon className="h-5 w-5" />
              ) : (
                <MicrophoneIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant; 