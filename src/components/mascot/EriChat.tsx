
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send } from "lucide-react";
import Eri from "./Eri";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'eri';
  timestamp: Date;
}

const EriChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('eri-chat-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error loading chat messages:', error);
      }
    } else {
      // Welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        message: 'Xin chào! Tôi là Eri, trợ lý tình yêu của bạn. Bạn có thể chia sẻ tâm tư, góp ý hoặc hỏi tôi bất cứ điều gì về tình yêu! 💕',
        sender: 'eri',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('eri-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getEriResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('buồn') || lowerMessage.includes('sad') || lowerMessage.includes('khóc')) {
      return 'Tôi hiểu bạn đang buồn. Hãy nhớ rằng mọi cảm xúc đều tạm thời, và tôi luôn ở đây để lắng nghe bạn. Bạn có muốn chia sẻ thêm không? 🤗';
    }
    
    if (lowerMessage.includes('yêu') || lowerMessage.includes('love') || lowerMessage.includes('người yêu')) {
      return 'Tình yêu thật tuyệt vời! Hãy luôn trân trọng những khoảnh khắc ngọt ngào và chia sẻ tình cảm một cách chân thành. Tôi hy vọng bạn và người ấy sẽ có nhiều kỷ niệm đẹp! 💕';
    }
    
    if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
      return 'Không có gì đâu! Tôi luôn vui khi được giúp đỡ bạn. Hãy luôn mỉm cười và yêu thương bản thân nhé! 😊';
    }
    
    if (lowerMessage.includes('góp ý') || lowerMessage.includes('feedback') || lowerMessage.includes('ý kiến')) {
      return 'Cảm ơn bạn đã muốn góp ý! Mọi ý kiến của bạn đều rất quý giá và giúp EraLove trở nên tốt hơn. Hãy chia sẻ chi tiết những gì bạn nghĩ nhé! 💭';
    }
    
    if (lowerMessage.includes('chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Chào bạn! Rất vui được gặp bạn. Tôi là Eri và tôi ở đây để lắng nghe mọi tâm tư của bạn. Bạn hôm nay thế nào? 🌸';
    }
    
    const responses = [
      'Tôi hiểu cảm giác của bạn. Hãy luôn tin tưởng vào bản thân và những điều tốt đẹp sẽ đến! ✨',
      'Cảm ơn bạn đã chia sẻ với tôi. Tôi luôn ở đây để lắng nghe và hỗ trợ bạn! 💖',
      'Điều bạn nói rất thú vị! Tôi hy vọng bạn luôn giữ được tinh thần tích cực như vậy! 🌟',
      'Tôi rất trân trọng sự tin tưởng của bạn. Hãy luôn nhớ rằng bạn rất đặc biệt! 🦋',
      'Wow, bạn thật tuyệt vời! Hãy tiếp tục chia sẻ những suy nghĩ của bạn với tôi nhé! 🌺'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      message: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate Eri typing
    setTimeout(() => {
      const eriMessage: ChatMessage = {
        id: `eri-${Date.now()}`,
        message: getEriResponse(currentMessage),
        sender: 'eri',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, eriMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast.success("Chào mừng bạn đến với không gian tâm sự cùng Eri! 💕");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-love-500 to-couple shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="w-80 h-96 flex flex-col shadow-2xl border-2 border-love-200 bg-gradient-to-b from-love-50 to-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-love-500 to-couple text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <img 
                  src="/lovable-uploads/18684914-a401-48a9-a658-a9fd7b4be946.png"
                  alt="Eri"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm">Tâm sự cùng Eri</h3>
                <p className="text-xs opacity-90">Trợ lý tình yêu của bạn</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-love-500 text-white rounded-br-none'
                      : 'bg-white border border-love-200 text-love-700 rounded-bl-none'
                  }`}
                >
                  {msg.message}
                  <div
                    className={`text-xs mt-1 opacity-70 ${
                      msg.sender === 'user' ? 'text-love-100' : 'text-love-400'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-love-200 text-love-700 rounded-lg rounded-bl-none p-2 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-love-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-love-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-love-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-love-200">
            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Chia sẻ tâm tư với Eri..."
                className="flex-1 min-h-[40px] max-h-[80px] resize-none border-love-200 focus:border-love-400"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="bg-love-500 hover:bg-love-600 text-white px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EriChat;
