import React, { useState } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../utils/api';

const ChatPanel = ({ meetingId, initialHistory = [] }) => {
    const [messages, setMessages] = useState(initialHistory);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages([...messages, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(meetingId, input);
            const botMsg = { role: 'assistant', content: response.data.answer };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-surface border border-border rounded-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-bottom border-border bg-surface2/50 flex items-center justify-between">
                <h4 className="font-bold flex items-center gap-2">
                    <Bot size={18} className="text-accent" />
                    Meeting Assistant
                </h4>
                <div className="text-[10px] font-mono text-muted uppercase tracking-widest">RAG Engine Active</div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-accent/20' : 'bg-accent2/20'
                                }`}>
                                {msg.role === 'user' ? <User size={14} className="text-accent" /> : <Bot size={14} className="text-accent2" />}
                            </div>
                            <div className={`p-4 rounded-lg text-sm leading-relaxed ${msg.role === 'user' ? 'bg-accent/10 border border-accent/20 rounded-tr-none' : 'bg-surface2 border border-border rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent2/20 flex items-center justify-center shrink-0">
                                <Bot size={14} className="text-accent2" />
                            </div>
                            <div className="p-4 bg-surface2 border border-border rounded-lg rounded-tl-none flex items-center gap-2 text-sm text-muted">
                                <Loader2 size={16} className="animate-spin" />
                                Thinking...
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-border bg-surface2/30">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about the meeting..."
                        className="w-full bg-surface border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/30 outline-none rounded-md py-3 px-4 pr-12 text-sm transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent disabled:text-muted hover:bg-accent/10 rounded-md transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatPanel;
