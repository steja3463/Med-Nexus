import React from "react";

const ChatbotPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Dr. AI Chatbot</h2>
      <p className="mb-6 text-gray-700 text-center max-w-xl">
        Welcome to the Dr. AI Chatbot! Here you can ask health-related questions and get instant guidance on minor symptoms, medicines, and which doctor to consult.<br/><br/>
        <strong>Note:</strong> This is for informational purposes only and not a substitute for professional medical advice.
      </p>
      <div className="w-full flex justify-center">
        <iframe
          src="http://localhost:5174"
          title="Dr. AI Chatbot"
          className="w-full max-w-3xl h-[700px] border rounded-lg shadow-lg"
          style={{ background: 'white' }}
        />
      </div>
    </div>
  );
};

export default ChatbotPlaceholder; 