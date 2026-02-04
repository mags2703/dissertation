'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Play } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TestResult {
  id: string;
  timestamp: Date;
  output: string;
  executionTime: string;
  memoryUsed: string;
}

export function ChatInterface() {
  const [activeTab, setActiveTab] = useState<'solution' | 'testing'>(
    'solution',
  );
  const [solutionMessages, setSolutionMessages] = useState<Message[]>([]);
  const [testingMessages, setTestingMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRunTests = () => {
    // Placeholder for test running logic
  };

  useEffect(() => {
    scrollToBottom();
  }, [solutionMessages, testingMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    if (activeTab === 'solution') {
      setSolutionMessages((prev) => [...prev, userMessage]);
    } else {
      setTestingMessages((prev) => [...prev, userMessage]);
    }
    setInput('');
    setIsLoading(true);

    if (activeTab === 'solution') {
      const res = await axios.post('http://localhost:3000/api/solution', {
        prompt: input,
      });
      const message: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.output,
        timestamp: new Date(),
      };
      setSolutionMessages((prev) => [...prev, message]);
    } else {
      const res = await axios.post('http://localhost:3000/api/test', {
        prompt: input,
      });

      const message: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.output,
        timestamp: new Date(),
      };
      setTestingMessages((prev) => [...prev, message]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">Assistant</h2>
        <p className="text-xs text-muted-foreground">Solving Two Sum</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border px-4">
        <button
          onClick={() => setActiveTab('solution')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'solution'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Solution
        </button>
        <button
          onClick={() => setActiveTab('testing')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'testing'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Testing
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(activeTab === 'solution' ? solutionMessages : testingMessages).map(
          (message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ),
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={
              activeTab === 'solution'
                ? 'Describe your solution...'
                : 'Describe your tests...'
            }
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
