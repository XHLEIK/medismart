import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Helper function to safely check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

const ChatbotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I\'m MediSmart AI, your virtual healthcare assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(true); // Default to true for safety
  const messagesEndRef = useRef(null);
  
  // Safe access to environment variables
  const getApiKey = () => {
    if (!isBrowser()) return "";
    
    try {
      return process.env.REACT_APP_GEMINI_API_KEY || "";
    } catch (error) {
      console.error("Error accessing environment variable:", error);
      return "";
    }
  };
  
  // Check if API key is available - wrapped in try/catch for safety
  useEffect(() => {
    if (!isBrowser()) return;
    
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        setApiKeyMissing(true);
        console.warn("Gemini API key is missing. Using fallback responses.");
      } else {
        setApiKeyMissing(false);
      }
    } catch (error) {
      console.error("Error checking API key:", error);
      setApiKeyMissing(true);
    }
  }, []);
  
  const scrollToBottom = () => {
    if (!isBrowser()) return;
    
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Error scrolling to bottom:", error);
    }
  };
  
  useEffect(() => {
    if (!isBrowser()) return;
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    const userInput = inputValue;
    
    // Clear input and show typing indicator right away
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setApiError(null);
    
    try {
      // Get AI response with timeout protection
      const botResponse = await Promise.race([
        generateAIResponse(userInput),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timed out")), 15000)
        )
      ]);
      
      // Add bot message to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error("AI response error:", error);
      setApiError(error.message || "Failed to get response");
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const generateAIResponse = async (userInput) => {
    // Always use fallback responses for now until API is properly configured
    return generateFallbackResponse(userInput);
    
    /* 
    // Uncomment once API is properly set up
    
    // If API key is missing, use fallback responses
    if (apiKeyMissing) {
      return generateFallbackResponse(userInput);
    }
    
    try {
      // Gemini API endpoint
      const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
      const apiKey = getApiKey();
      
      // Context for healthcare-focused responses
      const prompt = `
        You are a helpful healthcare assistant called MediSmart AI. 
        Provide accurate, helpful healthcare information in response to questions.
        Always recommend consulting a healthcare professional for medical advice.
        Always keep responses concise and conversational.
        
        User question: ${userInput}
      `;
      
      const response = await axios.post(
        `${endpoint}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800,
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }
      );
      
      // Extract the generated text from response
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      
      // If rate limit or API error, fall back to rule-based responses
      return generateFallbackResponse(userInput);
    }
    */
  };
  
  // Fallback response generator (original rule-based system)
  const generateFallbackResponse = (userInput) => {
    try {
      const input = userInput.toLowerCase();
      
      // Simple rule-based responses when API fails
      if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return `Hello there! How can I assist you with your health concerns today?`;
      } else if (input.includes('headache') || input.includes('head pain') || input.includes('migraine')) {
        return `I'm sorry to hear you're experiencing a headache. This could be due to various factors like stress, dehydration, lack of sleep, or eye strain. If it's mild, you might try drinking water, resting in a dark room, or taking an over-the-counter pain reliever. However, if your headache is severe, persistent, or accompanied by other symptoms like fever, vomiting, or vision changes, you should consult with a healthcare provider right away.`;
      } else if (input.includes('fever') || input.includes('temperature')) {
        return `Fever is often a sign that your body is fighting an infection. For adults, rest, staying hydrated, and taking acetaminophen or ibuprofen can help manage a fever. However, if your temperature exceeds 103°F (39.4°C), persists for more than three days, or is accompanied by severe symptoms, please seek medical attention promptly.`;
      } else if (input.includes('cough') || input.includes('cold') || input.includes('flu')) {
        return `For coughs and cold symptoms, ensure you're getting plenty of rest and staying hydrated. Over-the-counter medications can help relieve symptoms. If you have a persistent cough lasting more than a week, difficulty breathing, or high fever, please consult with a healthcare provider.`;
      } else if (input.includes('sleep') || input.includes('insomnia') || input.includes('tired')) {
        return `Good sleep is essential for health. Try maintaining a regular sleep schedule, limiting screen time before bed, creating a comfortable sleep environment, and avoiding caffeine late in the day. If sleep problems persist, consider speaking with a healthcare provider about possible sleep disorders or other contributing factors.`;
      } else if (input.includes('stress') || input.includes('anxiety') || input.includes('depression')) {
        return `Mental health is just as important as physical health. Regular exercise, mindfulness practices, and maintaining social connections can help manage stress and anxiety. If you're experiencing persistent feelings of anxiety or depression that interfere with daily life, please consider speaking with a mental health professional.`;
      } else if (input.includes('diet') || input.includes('nutrition') || input.includes('eat')) {
        return `A balanced diet is fundamental for good health. Try to include plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated and limit processed foods, sugars, and excessive salt. Would you like some specific dietary recommendations or information about our AI-generated diet plans?`;
      } else if (input.includes('exercise') || input.includes('workout') || input.includes('active')) {
        return `Regular physical activity is crucial for maintaining health. Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week, along with muscle-strengthening activities twice a week. Even small amounts of activity are beneficial. Would you like some exercise suggestions tailored to specific health goals?`;
      } else if (input.includes('doctor') || input.includes('appointment')) {
        return `If you'd like to schedule an appointment with a doctor, you can do so through our appointment section. Would you like me to help you navigate to our appointment booking feature?`;
      } else if (input.includes('thanks') || input.includes('thank you')) {
        return `You're welcome! Is there anything else I can help you with?`;
      } else if (input.includes('bye') || input.includes('goodbye')) {
        return `Take care! Remember, I'm here 24/7 if you need any health information or assistance.`;
      } else {
        return `Thank you for your question. While I can provide general health information, I'm not a substitute for professional medical advice. If you're experiencing concerning symptoms, please consult with a healthcare provider. Is there something specific about your health that you'd like to know more about?`;
      }
    } catch (error) {
      console.error("Error in fallback response:", error);
      return "I'm sorry, I couldn't process your question properly. Could you try asking something else?";
    }
  };
  
  const formatTime = (date) => {
    if (!isBrowser()) return "";
    
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Unknown time";
    }
  };
  
  // Server-side rendering safety check
  if (!isBrowser()) {
    return (
      <div className="h-[calc(100vh-7rem)] flex flex-col justify-center items-center">
        <div className="p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold mb-2">Loading Chat Assistant...</h2>
          <p className="text-sm">Please wait while the chat interface loads.</p>
        </div>
      </div>
    );
  }
  
  // Render with error boundaries
  try {
    return (
      <div className="h-[calc(100vh-7rem)] flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Smart Health Assistant</h1>
            <p className="text-sm text-gray-600">Chat with our AI to get health information and guidance</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
            Using fallback mode
          </div>
        </div>
        
        <div className="flex flex-1 gap-3 overflow-hidden">
          {/* Main chat area - takes 2/3 of the space */}
          <div className="card flex-1 flex flex-col h-full">
            <div className="flex items-center p-2 border-b border-gray-200">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">MediSmart AI</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : message.isError
                          ? 'bg-red-50 text-red-800 rounded-tl-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-primary-100' 
                        : message.isError
                          ? 'text-red-400'
                          : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-1.5 rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {apiError && !isTyping && (
                <div className="flex justify-center">
                  <div className="bg-red-50 text-red-800 text-xs px-3 py-1 rounded-full">
                    Error: {apiError}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-2 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="input-field flex-1 py-1.5 text-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className={`ml-2 px-3 py-1.5 rounded-md flex items-center ${
                    isTyping || !inputValue.trim() 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary text-white'
                  }`}
                  disabled={isTyping || !inputValue.trim()}
                >
                  {isTyping ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Sidebar content - takes 1/3 of the space */}
          <div className="w-1/3 flex flex-col gap-3 overflow-hidden">
            {/* Common Topics */}
            <div className="card p-3 flex-1">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Common Topics</h2>
              <div className="grid grid-cols-2 gap-1.5">
                {['Headache', 'Fever', 'Cold & Flu', 'Sleep', 'Stress', 'Diet', 'Exercise'].map((topic) => (
                  <button
                    key={topic}
                    className="py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    onClick={() => setInputValue(`Tell me about ${topic.toLowerCase()}`)}
                    disabled={isTyping}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Health Tips */}
            <div className="card p-3 flex-1">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Health Tips</h2>
              <div className="space-y-1.5">
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-800">Stay hydrated by drinking at least 8 glasses of water daily.</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-800">Taking a 10-minute walk after meals can aid digestion and stabilize blood sugar.</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-800">Practice deep breathing for 5 minutes daily to reduce stress and improve focus.</p>
                </div>
              </div>
            </div>
            
            {/* Health Disclaimer */}
            <div className="card p-3">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Health Disclaimer</h2>
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-gray-800">
                  The information provided is for general informational purposes only. It is not intended to be a substitute for professional medical advice. Always seek the advice of your physician with any questions regarding a medical condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering ChatbotPage:", error);
    // Fallback UI if rendering fails
    return (
      <div className="h-[calc(100vh-7rem)] flex flex-col justify-center items-center">
        <div className="bg-yellow-100 p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Chat Assistant is temporarily unavailable</h2>
          <p className="text-sm text-yellow-700">We're experiencing technical difficulties with our chat assistant. Please try again later or contact support if the issue persists.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default ChatbotPage; 