
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Stethoscope, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Dr. AI Assistant, your virtual healthcare companion. I can suggest basic medicines and natural alternatives for minor symptoms, and recommend which type of doctor to consult for various health issues. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Emergency keywords - immediate medical attention needed
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || 
        lowerMessage.includes('chest pain') || lowerMessage.includes('heart attack') ||
        lowerMessage.includes('stroke') || lowerMessage.includes('bleeding heavily') ||
        lowerMessage.includes('difficulty breathing') || lowerMessage.includes('severe pain')) {
      return "🚨 This sounds like a medical emergency. Please call 911 immediately or go to your nearest emergency room. Do not delay seeking immediate medical attention.";
    }

    // Headache - Minor symptom with suggestions
    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
      return "💊 **Medicines**: For mild headaches, try acetaminophen (Tylenol) 500mg or ibuprofen (Advil) 200-400mg.\n\n🌿 **Natural alternatives**: Stay hydrated, apply cold/warm compress, try peppermint oil on temples, practice deep breathing, ensure adequate sleep.\n\n👨‍⚕️ **Consult a Neurologist** if headaches are severe, frequent (more than 15 days/month), or accompanied by vision changes, fever, or neck stiffness.";
    }

    // Fever - Minor to moderate symptom
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return "💊 **Medicines**: Acetaminophen (Tylenol) 500-1000mg every 6 hours or ibuprofen (Advil) 400mg every 6-8 hours to reduce fever.\n\n🌿 **Natural alternatives**: Rest, increase fluid intake, use cool compresses, take lukewarm baths, wear light clothing.\n\n👨‍⚕️ **Consult a General Physician/Family Doctor** for fever above 103°F (39.4°C), fever lasting more than 3 days, or if accompanied by severe symptoms.";
    }

    // Cough - Minor symptom
    if (lowerMessage.includes('cough') || lowerMessage.includes('coughing')) {
      return "💊 **Medicines**: Dextromethorphan (Robitussin DM) for dry cough, or guaifenesin (Mucinex) for productive cough with mucus.\n\n🌿 **Natural alternatives**: Honey (1-2 tsp), warm salt water gargle, ginger tea, steam inhalation, stay hydrated.\n\n👨‍⚕️ **Consult a Pulmonologist** for persistent cough lasting more than 3 weeks, cough with blood, or difficulty breathing. For general cough, start with a **Family Doctor**.";
    }

    // Stomach/Gastric issues - Minor symptom
    if (lowerMessage.includes('stomach') || lowerMessage.includes('gastric') || 
        lowerMessage.includes('nausea') || lowerMessage.includes('acidity') ||
        lowerMessage.includes('heartburn') || lowerMessage.includes('indigestion')) {
      return "💊 **Medicines**: Antacids (Tums, ENO), Omeprazole (Prilosec) for acid reflux, Pepto-Bismol for upset stomach.\n\n🌿 **Natural alternatives**: Ginger tea, chamomile tea, fennel seeds, small frequent meals, avoid spicy/fatty foods, probiotics (yogurt).\n\n👨‍⚕️ **Consult a Gastroenterologist** for persistent symptoms, blood in vomit/stool, or severe abdominal pain. For mild issues, start with a **General Physician**.";
    }

    // Cold/Flu - Minor symptom
    if (lowerMessage.includes('cold') || lowerMessage.includes('flu') || 
        lowerMessage.includes('runny nose') || lowerMessage.includes('congestion')) {
      return "💊 **Medicines**: Paracetamol for body aches, decongestants like pseudoephedrine, throat lozenges, saline nasal spray.\n\n🌿 **Natural alternatives**: Warm salt water gargle, steam inhalation, vitamin C, zinc supplements, rest, fluids, chicken soup.\n\n👨‍⚕️ **Consult a General Physician/Family Doctor** if symptoms worsen after a week or if you develop high fever and breathing difficulties.";
    }

    // Skin issues - Minor symptom
    if (lowerMessage.includes('rash') || lowerMessage.includes('skin') || 
        lowerMessage.includes('itch') || lowerMessage.includes('acne')) {
      return "💊 **Medicines**: Antihistamines (Benadryl, Claritin) for itching, hydrocortisone cream for rashes, benzoyl peroxide for acne.\n\n🌿 **Natural alternatives**: Aloe vera gel, oatmeal baths, coconut oil, avoid harsh soaps, moisturize regularly.\n\n👨‍⚕️ **Consult a Dermatologist** for persistent skin issues, severe acne, unusual moles, or infections that don't heal.";
    }

    // Joint/Muscle pain - Minor symptom
    if (lowerMessage.includes('joint') || lowerMessage.includes('muscle') || 
        lowerMessage.includes('back pain') || lowerMessage.includes('arthritis')) {
      return "💊 **Medicines**: Ibuprofen (Advil) 400mg, topical pain relievers like Voltaren gel, acetaminophen for mild pain.\n\n🌿 **Natural alternatives**: Hot/cold therapy, gentle stretching, turmeric tea, Epsom salt baths, maintain good posture.\n\n👨‍⚕️ **Consult an Orthopedist** for joint issues, or a **Rheumatologist** if you suspect arthritis. For muscle pain, start with a **General Physician**.";
    }

    // Sleep issues - Minor symptom
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || 
        lowerMessage.includes('cant sleep')) {
      return "💊 **Medicines**: Melatonin (1-3mg), avoid long-term use of sleep aids without doctor consultation.\n\n🌿 **Natural alternatives**: Chamomile tea, warm milk, lavender aromatherapy, maintain sleep schedule, avoid screens before bed, relaxation techniques.\n\n👨‍⚕️ **Consult a Sleep Specialist** for chronic insomnia, or start with a **General Physician** for sleep hygiene guidance.";
    }

    // Allergies - Minor symptom
    if (lowerMessage.includes('allergy') || lowerMessage.includes('allergic') || 
        lowerMessage.includes('sneezing') || lowerMessage.includes('watery eyes')) {
      return "💊 **Medicines**: Antihistamines like Claritin (loratadine), Zyrtec (cetirizine), or Benadryl for acute symptoms.\n\n🌿 **Natural alternatives**: Local honey, quercetin supplements, nasal irrigation, avoid known allergens, keep windows closed during high pollen days.\n\n👨‍⚕️ **Consult an Allergist/Immunologist** for severe allergies, allergy testing, or if symptoms interfere with daily life.";
    }

    // Anxiety/Stress - Mental health (handle carefully)
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || 
        lowerMessage.includes('panic') || lowerMessage.includes('worried')) {
      return "🧠 **For mild stress/anxiety**: Practice deep breathing, meditation, regular exercise, adequate sleep.\n\n🌿 **Natural alternatives**: Chamomile tea, valerian root, lavender, yoga, mindfulness exercises.\n\n👨‍⚕️ **Consult a Psychiatrist** for severe anxiety, panic attacks, or if symptoms interfere with daily life. A **Psychologist** can provide therapy and coping strategies.";
    }

    // Depression - Serious mental health issue
    if (lowerMessage.includes('depression') || lowerMessage.includes('depressed') || 
        lowerMessage.includes('sad all the time') || lowerMessage.includes('hopeless')) {
      return "⚠️ **Important**: Depression is a serious condition that requires professional help.\n\n👨‍⚕️ **Please consult a Psychiatrist** immediately for proper evaluation and treatment. A **Psychologist** can also provide valuable therapy.\n\n🆘 If you're having thoughts of self-harm, please call a mental health crisis line or go to the emergency room immediately.";
    }

    // Medication questions
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || 
        lowerMessage.includes('dosage') || lowerMessage.includes('side effects')) {
      return "⚠️ I cannot provide specific medication dosages or advice about prescription drugs. Please consult your **Pharmacist** for over-the-counter medication guidance, or your **prescribing doctor** for prescription medication questions.\n\n📞 Always follow prescribed dosing instructions and inform healthcare providers about all medications you're taking to avoid interactions.";
    }

    // General health advice
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || 
        lowerMessage.includes('weight') || lowerMessage.includes('exercise')) {
      return "🥗 **General guidance**: Balanced diet with fruits, vegetables, whole grains, lean proteins, and adequate hydration supports overall health.\n\n👨‍⚕️ **Consult a Nutritionist/Dietitian** for specific dietary needs, weight management plans, or if you have conditions like diabetes. A **General Physician** can also provide basic guidance.";
    }

    // Default responses for unclear symptoms
    const defaultResponses = [
      "I'd be happy to help with general health guidance. Could you please describe your specific symptoms so I can suggest appropriate over-the-counter medicines, natural alternatives, and which type of doctor to consult?",
      "To provide the best suggestions for medicines and natural remedies, could you tell me more about your symptoms? I can also recommend which medical specialist would be most appropriate for your concern.",
      "I can help suggest basic treatments and doctor specializations, but I need more details about your symptoms. What specific health issue are you experiencing?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue.trim()),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Dr. AI Assistant</h1>
              <p className="text-sm text-gray-600">Medicine Suggestions & Doctor Recommendations</p>
            </div>
            <div className="ml-auto">
              <Pill className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-4xl mx-auto p-4">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Important:</strong> This AI provides basic medicine suggestions and doctor recommendations for minor symptoms only. For serious conditions or emergencies, seek immediate medical attention.
          </AlertDescription>
        </Alert>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              
              <Card className={`max-w-md p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`text-sm leading-relaxed ${
                  message.sender === 'bot' ? 'whitespace-pre-line' : ''
                }`}>
                  {message.text}
                </div>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </Card>

              {message.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <Card className="bg-white border-gray-200 p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms (e.g., headache, stomach pain, cough)..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Get medicine suggestions 💊 and doctor recommendations 👨‍⚕️ for common symptoms
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
