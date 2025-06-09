
import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Check, CheckCheck } from "lucide-react";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sort messages by timestamp
    const sorted = [...messages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    setSortedMessages(sorted);

    // Scroll to bottom after messages update
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
  }, [messages]);

  // Group messages by sender for consecutive messages
  const groupedMessages: Message[][] = [];
  let currentGroup: Message[] = [];
  let currentSender = '';

  sortedMessages.forEach((message, index) => {
    if (message.sender !== currentSender && currentGroup.length > 0) {
      groupedMessages.push([...currentGroup]);
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
    currentSender = message.sender;
    
    // Handle the last message
    if (index === sortedMessages.length - 1) {
      groupedMessages.push([...currentGroup]);
    }
  });

  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
      <div className="flex flex-col gap-3 p-4">
        {groupedMessages.length > 0 ? (
          groupedMessages.map((messageGroup, groupIndex) => {
            const isCurrentUser = messageGroup[0].sender === currentUserEmail;
            
            return (
              <div 
                key={`group-${messageGroup[0].id}`}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[85%]`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 border border-love-100 mt-2 flex-shrink-0">
                      <div className="bg-couple text-white h-full w-full flex items-center justify-center text-sm font-medium">
                        {partnerName.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                  )}
                  <div className="flex flex-col gap-1">
                    {messageGroup.map((message, index) => {
                      const isFirstInGroup = index === 0;
                      const isLastInGroup = index === messageGroup.length - 1;
                      
                      return (
                        <div 
                          key={message.id}
                          className={`
                            ${isCurrentUser 
                              ? 'bg-love-100 text-love-800 rounded-2xl rounded-tr-sm' 
                              : 'bg-couple-light text-couple-dark rounded-2xl rounded-tl-sm'}
                            px-4 py-3 text-sm shadow-sm
                            ${!isLastInGroup && !isCurrentUser ? 'rounded-bl-2xl rounded-tl-sm' : ''}
                            ${!isLastInGroup && isCurrentUser ? 'rounded-br-2xl rounded-tr-sm' : ''}
                          `}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                        </div>
                      );
                    })}
                    <div className={`flex items-center text-xs gap-1 mt-1 ${isCurrentUser ? 'justify-end mr-1' : 'ml-1'}`}>
                      <span className="text-muted-foreground">
                        {new Date(messageGroup[messageGroup.length-1].timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {isCurrentUser && (
                        <span className="text-love-500">
                          {messageGroup[messageGroup.length-1].read ? <CheckCheck size={12} /> : <Check size={12} />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="p-6 mx-4">
              <p className="text-muted-foreground text-center text-sm">No messages yet. Send your first message to your partner!</p>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
