import React, { useState } from 'react';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import { Message, Attachment } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid'; // We'll simple random id gen actually to avoid huge lib

const generateId = () => Math.random().toString(36).substring(2, 9);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    // 1. Add User Message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      text: text,
      attachments: attachments,
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. Call Gemini
      const responseText = await sendMessageToGemini(text, attachments);

      // 3. Add Model Response
      const aiMessage: Message = {
        id: generateId(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'model',
        text: "I'm sorry, I encountered an error while processing your request. Please check your internet connection or try a different file.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <MessageList messages={messages} isLoading={isLoading} />
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
