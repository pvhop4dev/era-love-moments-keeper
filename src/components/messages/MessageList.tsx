
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserEmail: string;
  partnerName: string;
}

const MessageList = ({ messages, currentUserEmail, partnerName }: MessageListProps) => {
  const [sortedMessages, setSortedMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Sort messages by timestamp
    const sorted = [...messages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    setSortedMessages(sorted);
  }, [messages]);

  return (
    <ScrollArea className="h-[300px]">
      <div className="flex flex-col gap-3 p-2">
        {sortedMessages.length > 0 ? (
          sortedMessages.map((message) => {
            const isCurrentUser = message.sender === currentUserEmail;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[80%]`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 border border-love-100">
                      <div className="bg-couple text-white h-full w-full flex items-center justify-center text-sm font-medium">
                        {partnerName.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                  )}
                  <div 
                    className={`rounded-lg px-3 py-2 text-sm ${
                      isCurrentUser 
                        ? 'bg-love-100 text-love-800' 
                        : 'bg-couple-light text-couple-dark'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-love-500' : 'text-couple'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Card className="p-8 flex items-center justify-center">
            <p className="text-muted-foreground text-center">No messages yet. Send your first message to your partner!</p>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
