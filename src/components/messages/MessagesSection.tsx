import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const [isOpen, setIsOpen] = useState(false);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-love-500" />
          {t('privateMessages')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-love-500" />
            Chat with {partnerName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            <MessageList 
              messages={messages}
              currentUserEmail={userEmail}
              partnerName={partnerName}
            />
          </div>
          <div className="p-4 border-t">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesSection;
