
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MessageList, { Message } from "./MessageList";
import MessageInput from "./MessageInput";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "@/contexts/LanguageContext";
import Eri from "@/components/mascot/Eri";

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
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Load existing messages
  useEffect(() => {
    const storedMessages = localStorage.getItem("eralove-messages");
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
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
          content: "Hi! How are you today? 😊",
          timestamp: new Date(now.getTime() - 86400000).toISOString(),
          read: true,
          type: "text"
        },
        {
          id: "msg-2",
          sender: userEmail,
          content: "I'm doing great! Looking forward to our date tomorrow.",
          timestamp: new Date(now.getTime() - 50000000).toISOString(),
          read: true,
          type: "text"
        },
        {
          id: "msg-3",
          sender: partnerEmail,
          content: "",
          timestamp: new Date(now.getTime() - 40000000).toISOString(),
          read: true,
          type: "sticker",
          metadata: { emoji: "💖", name: "Love" }
        },
        {
          id: "msg-4",
          sender: partnerEmail,
          content: "Me too! I'll pick you up at 7.",
          timestamp: new Date(now.getTime() - 30000000).toISOString(),
          read: true,
          type: "text",
          reactions: [
            { emoji: "❤️", count: 1, users: [userEmail] }
          ]
        }
      ];
      
      setMessages(sampleMessages);
      localStorage.setItem("eralove-messages", JSON.stringify(sampleMessages));
    }
  }, [userEmail, partnerEmail]);

  const handleSendMessage = (content: string, type = "text", metadata?: any) => {
    const newMessage: Message = {
      id: uuidv4(),
      sender: userEmail,
      content,
      type,
      metadata,
      timestamp: new Date().toISOString(),
      read: false,
      replyTo: replyingTo?.id
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    localStorage.setItem("eralove-messages", JSON.stringify(updatedMessages));
    
    // Clear reply state
    setReplyingTo(null);
    
    const messageTypeText = type === "text" ? "Message" : 
                           type === "sticker" ? "Sticker" :
                           type === "photo" ? "Photo" :
                           type === "video" ? "Video" :
                           type === "file" ? "File" :
                           type === "location" ? "Location" :
                           type === "voice" ? "Voice message" :
                           type === "audio" ? "Audio" :
                           type === "poll" ? "Poll" :
                           type === "quiz" ? "Quiz" :
                           type === "scheduled" ? "Scheduled message" :
                           type === "pinned" ? "Pinned message" :
                           type === "starred" ? "Starred message" : "Message";
    
    toast.success(`${messageTypeText} sent`);
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.id === messageId) {
          const reactions = message.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            // Toggle reaction
            const userHasReacted = existingReaction.users.includes(userEmail);
            if (userHasReacted) {
              existingReaction.count -= 1;
              existingReaction.users = existingReaction.users.filter(u => u !== userEmail);
              if (existingReaction.count === 0) {
                return {
                  ...message,
                  reactions: reactions.filter(r => r.emoji !== emoji)
                };
              }
            } else {
              existingReaction.count += 1;
              existingReaction.users.push(userEmail);
            }
          } else {
            // Add new reaction
            reactions.push({
              emoji,
              count: 1,
              users: [userEmail]
            });
          }
          
          return {
            ...message,
            reactions: [...reactions]
          };
        }
        return message;
      });
    });
    
    // Update localStorage
    setTimeout(() => {
      const updatedMessages = messages.map(message => {
        if (message.id === messageId) {
          const reactions = message.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            const userHasReacted = existingReaction.users.includes(userEmail);
            if (userHasReacted) {
              existingReaction.count -= 1;
              existingReaction.users = existingReaction.users.filter(u => u !== userEmail);
              if (existingReaction.count === 0) {
                return {
                  ...message,
                  reactions: reactions.filter(r => r.emoji !== emoji)
                };
              }
            } else {
              existingReaction.count += 1;
              existingReaction.users.push(userEmail);
            }
          } else {
            reactions.push({
              emoji,
              count: 1,
              users: [userEmail]
            });
          }
          
          return {
            ...message,
            reactions: [...reactions]
          };
        }
        return message;
      });
      localStorage.setItem("eralove-messages", JSON.stringify(updatedMessages));
    }, 100);
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
          <div className="mt-2">
            <Eri 
              message="Now you can send photos, stickers, voice messages, polls and so much more! Keep the love flowing! 💕"
              size="small"
            />
          </div>
        </DialogHeader>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            <MessageList 
              messages={messages}
              currentUserEmail={userEmail}
              partnerName={partnerName}
              onReplyMessage={handleReplyToMessage}
              onReactToMessage={handleReactToMessage}
            />
          </div>
          <div className="p-4 border-t">
            <MessageInput 
              onSendMessage={handleSendMessage}
              replyingTo={replyingTo}
              onCancelReply={handleCancelReply}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesSection;
