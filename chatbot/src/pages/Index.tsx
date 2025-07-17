
import Chatbot from "@/components/Chatbot";
import QuickStartGuide from "@/components/QuickStartGuide";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Info } from "lucide-react";

const Index = () => {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {showGuide ? (
        <div className="min-h-screen flex flex-col">
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-800">Getting Started</h1>
              </div>
              <Button 
                onClick={() => setShowGuide(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <QuickStartGuide />
          </div>
        </div>
      ) : (
        <Chatbot />
      )}
    </div>
  );
};

export default Index;
