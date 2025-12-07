import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { User, Sparkles, FileText, Image as ImageIcon, Mic } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-12 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
               <Sparkles className="text-indigo-500 w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to LifeLens AI</h2>
            <p className="text-gray-500 max-w-sm mb-8">
              Upload a photo or document. Ask naturally. <br/>Get a clear explanation.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left hover:border-indigo-200 transition-colors cursor-pointer">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mb-2 inline-block">Finance</span>
                <p className="text-sm font-medium text-gray-700">"Is this hospital bill accurate?"</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left hover:border-indigo-200 transition-colors cursor-pointer">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mb-2 inline-block">Education</span>
                <p className="text-sm font-medium text-gray-700">"Explain this chemistry diagram."</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left hover:border-indigo-200 transition-colors cursor-pointer">
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full mb-2 inline-block">Legal</span>
                <p className="text-sm font-medium text-gray-700">"Summarize this rental contract."</p>
              </div>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left hover:border-indigo-200 transition-colors cursor-pointer">
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full mb-2 inline-block">General</span>
                <p className="text-sm font-medium text-gray-700">"What is this vegetable?"</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
              msg.role === 'user' ? 'bg-indigo-600' : 'bg-white border border-gray-200'
            }`}>
              {msg.role === 'user' ? (
                <User size={16} className="text-white" />
              ) : (
                <Sparkles size={16} className="text-indigo-600" />
              )}
            </div>

            {/* Content */}
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Attachments for User Message */}
              {msg.role === 'user' && msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2 justify-end">
                  {msg.attachments.map((att, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm max-w-[150px]">
                      {att.type === 'image' && att.previewUrl ? (
                        <img src={att.previewUrl} alt="attachment" className="rounded-md w-full h-auto object-cover max-h-32" />
                      ) : att.type === 'audio' ? (
                        <div className="flex items-center gap-2 text-gray-600 px-2 py-1">
                          <Mic size={16} className="text-red-500" />
                          <span className="text-xs font-medium">Voice Note</span>
                        </div>
                      ) : (
                         <div className="flex items-center gap-2 text-gray-600 px-2 py-1">
                          <FileText size={16} className="text-indigo-500" />
                          <span className="text-xs truncate max-w-[100px]">{att.file.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`px-5 py-3 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                 {msg.role === 'user' ? (
                   <p className="whitespace-pre-wrap">{msg.text || (msg.attachments?.length ? <i>Attached {msg.attachments.length} file(s)</i> : '')}</p>
                 ) : (
                   <MarkdownRenderer content={msg.text || ''} />
                 )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
               <Sparkles size={16} className="text-indigo-600 animate-pulse" />
            </div>
            <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              </div>
              <span className="text-sm text-gray-400 ml-2 font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageList;