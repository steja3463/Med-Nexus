
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Clock, Users } from 'lucide-react';

const QuickStartGuide = () => {
  const features = [
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Symptom Assessment",
      description: "Get guidance on common symptoms and when to seek medical care"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Health Information",
      description: "Access reliable health information and general medical guidance"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "24/7 Availability",
      description: "Available anytime when your healthcare provider isn't accessible"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: "Professional Support",
      description: "Designed to complement, not replace, professional medical care"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          How Dr. AI Assistant Can Help You
        </h2>
        <p className="text-gray-600">
          Your virtual healthcare companion for basic health questions and guidance
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {feature.icon}
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Getting Started
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Start by describing your symptoms or health concerns</li>
            <li>• Ask about general health topics like nutrition, exercise, or sleep</li>
            <li>• Get guidance on when to seek professional medical care</li>
            <li>• Remember: This is for information only, not diagnosis or treatment</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStartGuide;
