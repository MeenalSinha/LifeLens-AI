import React, { useRef, useState, useEffect } from 'react';
import { Send, Paperclip, Mic, X, FileText, Image as ImageIcon, Loader2, StopCircle } from 'lucide-react';
import { Attachment } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

interface InputAreaProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  isLoading: boolean;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputText]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Check max files limit
      if (attachments.length + e.target.files.length > MAX_FILES) {
        alert(`You can only attach up to ${MAX_FILES} files.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const newAttachments: Attachment[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        
        // Check max file size limit
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          alert(`File "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
          continue;
        }

        try {
          const base64 = await fileToBase64(file);
          const type = file.type.startsWith('image/') ? 'image' : 'pdf';
          const previewUrl = type === 'image' ? URL.createObjectURL(file) : undefined;
          
          newAttachments.push({
            file,
            type,
            base64,
            previewUrl,
            mimeType: file.type
          });
        } catch (err) {
          console.error("Error reading file", err);
        }
      }
      setAttachments(prev => [...prev, ...newAttachments]);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Chrome default
        const file = new File([audioBlob], "voice_note.webm", { type: 'audio/webm' });
        const base64 = await fileToBase64(file);
        
        const newAttachment: Attachment = {
          file,
          type: 'audio',
          base64,
          mimeType: 'audio/webm'
        };
        
        // Immediately send audio if it was recorded
        onSendMessage(inputText, [...attachments, newAttachment]);
        setAttachments([]);
        setInputText('');
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Microphone access is required to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim() && attachments.length === 0) return;
    onSendMessage(inputText, attachments);
    setInputText('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-white border-t border-gray-200 px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-3xl mx-auto">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-3 mb-3 overflow-x-auto pb-2">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg p-2 w-24 h-24 flex flex-col items-center justify-center">
                <button 
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
                >
                  <X size={12} />
                </button>
                {att.type === 'image' && att.previewUrl ? (
                  <img src={att.previewUrl} alt="preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileText size={24} className="mb-1 text-indigo-500" />
                    <span className="text-[10px] truncate max-w-full px-1">{att.file.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex-shrink-0"
            disabled={isLoading || isRecording}
            title="Attach image or PDF"
          >
            <Paperclip size={22} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf"
            multiple
          />

          {/* Text Area */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Ask a question or describe your document..."}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[50px] max-h-[150px] bg-gray-50"
              disabled={isLoading || isRecording}
              rows={1}
            />
          </div>

          {/* Voice/Send Button */}
          {inputText.trim() || attachments.length > 0 ? (
             <button
             onClick={handleSend}
             disabled={isLoading}
             className={`p-3 rounded-full transition-all shadow-md flex-shrink-0 ${
               isLoading 
                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                 : 'bg-indigo-600 text-white hover:bg-indigo-700'
             }`}
           >
             {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
           </button>
          ) : (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={isLoading}
              className={`p-3 rounded-full transition-all shadow-md flex-shrink-0 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse scale-110'
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
              }`}
              title="Hold to speak"
            >
              {isRecording ? <StopCircle size={22} /> : <Mic size={22} />}
            </button>
          )}
        </div>
        {isRecording && <p className="text-xs text-red-500 text-center mt-2 font-medium">Recording audio...</p>}
      </div>
    </div>
  );
};

export default InputArea;