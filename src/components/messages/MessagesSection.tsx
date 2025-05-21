
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MessageList, { Message } from "./MessageList";
import MessageInput from "./MessageInput";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "@/contexts/LanguageContext";

interface MessagesSectionProps {
  userEmail: string;
  userName: string;
  partnerEmail: string;
  partnerName: string;
}

const MessagesSection = ({ 
  userEmail, 
  userName, 
  partnerEmail,
  partnerName 
}: MessagesSectionProps) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);

  // Load existing messages
  useEffect(() => {
    const storedMessages = localStorage.getItem("eralove-messages");
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Filter messages that belong to this conversation
        const conversationMessages = parsedMessages.filter(
          (msg: Message) => 
            (msg.sender === userEmail || msg.sender === partnerEmail)
        );
        setMessages(conversationMessages);
      } catch (error) {
        console.error("Error parsing messages:", error);
      }
    } else {
      // Set sample messages for demo
      const now = new Date();
      const sampleMessages: Message[] = [
        {
          id: "msg-1",
          sender: partnerEmail,
          content: "Hi! How are you today?",
          timestamp: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
          read: true
        },
        {
          id: "msg-2",
          sender: userEmail,
          content: "I'm doing great! Looking forward to our date tomorrow.",
          timestamp: new Date(now.getTime() - 50000000).toISOString(),
          read: true
        },
        {
          id: "msg-3",
          sender: partnerEmail,
          content: "Me too! I'll pick you up at 7.",
          timestamp: new Date(now.getTime() - 30000000).toISOString(),
          read: true
        }
      ];
      
      setMessages(sampleMessages);
      localStorage.setItem("eralove-messages", JSON.stringify(sampleMessages));
    }
  }, [userEmail, partnerEmail]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      sender: userEmail,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Save to localStorage
    localStorage.setItem("eralove-messages", JSON.stringify(updatedMessages));
    
    // In a real app, we would send this to the partner
    toast.success("Message sent");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-love-500" />
          {t('privateMessages')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MessageList 
          messages={messages}
          currentUserEmail={userEmail}
          partnerName={partnerName}
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </CardContent>
    </Card>
  );
};

export default MessagesSection;
