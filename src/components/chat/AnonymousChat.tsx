
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Send, X, Users, Heart } from "lucide-react";
import { toast } from "sonner";
import {
  AnonymousChatSession,
  UserPreferences,
  findMatchingUser,
  createChatSession,
  joinChatSession,
  addMessage,
  endChatSession,
  getCurrentSession
} from "@/utils/anonymousChatUtils";

interface AnonymousChatProps {
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

const AnonymousChat = ({ userEmail, isOpen, onClose }: AnonymousChatProps) => {
  const [currentSession, setCurrentSession] = useState<AnonymousChatSession | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: 'male',
    preferredGender: 'any'
  });
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showPreferences, setShowPreferences] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Kiểm tra xem có session đang active không
      const existingSession = getCurrentSession(userEmail);
      if (existingSession) {
        setCurrentSession(existingSession);
        setShowPreferences(false);
      } else {
        setShowPreferences(true);
      }
    }
  }, [isOpen, userEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  useEffect(() => {
    if (isSearching && currentSession?.status === 'waiting') {
      const interval = setInterval(() => {
        // Simulate checking for matches
        const matchingSession = findMatchingUser(userEmail, preferences);
        if (matchingSession) {
          const updatedSession = joinChatSession(matchingSession, userEmail, preferences);
          setCurrentSession(updatedSession);
          setIsSearching(false);
          toast.success("Đã tìm thấy người trò chuyện!");
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isSearching, currentSession, userEmail, preferences]);

  const handleStartChat = () => {
    const session = createChatSession(userEmail, preferences);
    setCurrentSession(session);
    setIsSearching(true);
    setShowPreferences(false);
    toast.info("Đang tìm kiếm người trò chuyện...");
  };

  const handleSendMessage = () => {
    if (!message.trim() || !currentSession) return;

    try {
      addMessage(currentSession.id, userEmail, message.trim());
      
      // Update local state
      const updatedSession = {
        ...currentSession,
        messages: [
          ...currentSession.messages,
          {
            id: `msg-${Date.now()}`,
            sessionId: currentSession.id,
            senderId: userEmail,
            message: message.trim(),
            timestamp: new Date(),
            type: 'text' as const
          }
        ]
      };
      
      setCurrentSession(updatedSession);
      setMessage('');
    } catch (error) {
      toast.error("Không thể gửi tin nhắn");
    }
  };

  const handleEndChat = () => {
    if (currentSession) {
      endChatSession(currentSession.id);
      setCurrentSession(null);
      setIsSearching(false);
      setShowPreferences(true);
      toast.info("Đã kết thúc cuộc trò chuyện");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getDisplayName = (senderId: string) => {
    if (senderId === 'system') return 'Hệ thống';
    if (senderId === userEmail) return 'Bạn';
    return 'Người lạ';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[500px] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 bg-gradient-to-r from-love-500 to-couple text-white rounded-t-lg">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tâm sự cùng người lạ
          </DialogTitle>
        </DialogHeader>

        {showPreferences ? (
          <div className="flex-1 p-4 space-y-4">
            <div className="text-center">
              <Heart className="h-12 w-12 text-love-500 mx-auto mb-2" />
              <p className="text-love-700 text-sm">
                Chia sẻ tâm tư với người lạ một cách ẩn danh
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-love-700">Giới tính của bạn</Label>
                <RadioGroup
                  value={preferences.gender}
                  onValueChange={(value) => setPreferences({...preferences, gender: value as 'male' | 'female'})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Nữ</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium text-love-700">Muốn trò chuyện với</Label>
                <RadioGroup
                  value={preferences.preferredGender}
                  onValueChange={(value) => setPreferences({...preferences, preferredGender: value as 'male' | 'female' | 'any'})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Bất kỳ ai</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="prefer-male" />
                    <Label htmlFor="prefer-male">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="prefer-female" />
                    <Label htmlFor="prefer-female">Nữ</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button 
              onClick={handleStartChat}
              className="w-full bg-love-500 hover:bg-love-600 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Bắt đầu trò chuyện
            </Button>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentSession?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === userEmail ? 'justify-end' : 
                    msg.senderId === 'system' ? 'justify-center' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      msg.senderId === userEmail
                        ? 'bg-love-500 text-white rounded-br-none'
                        : msg.senderId === 'system'
                        ? 'bg-gray-100 text-gray-600 text-xs rounded-full px-3 py-1'
                        : 'bg-white border border-love-200 text-love-700 rounded-bl-none'
                    }`}
                  >
                    {msg.senderId !== 'system' && (
                      <div className="text-xs opacity-70 mb-1">
                        {getDisplayName(msg.senderId)}
                      </div>
                    )}
                    {msg.message}
                    {msg.senderId !== 'system' && (
                      <div className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isSearching && (
                <div className="flex justify-center">
                  <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-love-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-love-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-love-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    Đang tìm kiếm...
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-love-200">
              {currentSession?.status === 'connected' ? (
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border-love-200 focus:border-love-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-love-500 hover:bg-love-600 text-white px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  {isSearching ? 'Đang tìm kiếm người trò chuyện...' : 'Chưa kết nối'}
                </div>
              )}
              
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPreferences(true);
                    setCurrentSession(null);
                    setIsSearching(false);
                  }}
                  className="text-love-600 border-love-200"
                >
                  Tìm người khác
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEndChat}
                  className="text-red-600 border-red-200"
                >
                  Kết thúc
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnonymousChat;
