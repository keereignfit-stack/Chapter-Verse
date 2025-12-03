import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/geminiService';
import { ChatMessage } from '../../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await sendChatMessage(history, userMsg.text);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all transform origin-bottom-right">
          <div className="bg-rose-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <span className="text-xl">✒️</span>
                <h3 className="font-bold font-serif">Chapter&Verse Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-rose-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="flex-1 h-96 overflow-y-auto p-4 bg-gray-50 no-scrollbar">
            {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-10 text-sm">
                    <p className="font-serif italic text-lg mb-2">Welcome.</p>
                    <p>I'm your concierge.</p>
                    <p>Let's write your next chapter together.</p>
                </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start mb-3">
                   <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-none text-gray-500 text-xs animate-pulse">
                       Thinking...
                   </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for advice..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        <span className="sr-only">Open Chat</span>
        {isOpen ? (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;