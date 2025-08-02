'use client';

import React from 'react';
import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from 'ai';
import { AI_CONFIG } from '@/lib/ai-config';

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading: isPending, error, append } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    },
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    try {
      // Use the append method from useChat to add a message directly
      await append({ role: 'user', content: suggestion });
    } catch (error) {
      console.error('Error sending suggestion:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">Vastra Rent AI Assistant</h1>
          <p className="text-xs text-center text-muted-foreground mt-1">Powered by Dolphin Mistral AI</p>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold mb-2">Welcome to Vastra Rent!</h2>
              <p className="text-muted-foreground mb-6">
                I&apos;m your fashion rental assistant. Ask me about our collection, styling tips, or rental process!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {AI_CONFIG.suggestedPrompts.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                    disabled={isPending}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-destructive font-medium mb-2">
                Connection Error
              </p>
              <p className="text-sm text-destructive/80">
                {error.message || "Sorry, I'm having trouble connecting right now. Please try again in a moment."}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="text-xs text-destructive/60 cursor-pointer">Debug Info</summary>
                  <pre className="text-xs text-destructive/60 mt-1 whitespace-pre-wrap">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {messages.map((message: Message, index: number) => (
            <div
              key={index}
              className={cn(
                'flex gap-3 p-4 rounded-lg',
                message.role === 'user'
                  ? 'bg-muted ml-auto max-w-[80%]'
                  : 'bg-card border mr-auto max-w-[80%]'
              )}
            >
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.role === 'user' ? 'bg-primary' : 'bg-secondary'
              )}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </p>
                <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex gap-3 p-4 rounded-lg bg-card border mr-auto max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">AI Assistant</p>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <span>Typing</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about fashion rentals..."
              className="flex-1 px-3 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}