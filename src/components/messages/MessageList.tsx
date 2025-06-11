
import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  CheckCheck, 
  Download, 
  Play, 
  MapPin, 
  Pin, 
  Star, 
  Reply,
  Heart,
  ThumbsUp,
  Laugh,
  BarChart3,
  Clock
} from "lucide-react";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
  type?: string;
  metadata?: any;
  reactions?: { emoji: string; count: number; users: string[] }[];
  isPinned?: boolean;
  isStarred?: boolean;
  replyTo?: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserEmail: string;
  partnerName: string;
  onReplyMessage?: (message: Message) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
}

const MessageList = ({ 
  messages, 
  currentUserEmail, 
  partnerName, 
  onReplyMessage,
  onReactToMessage 
}: MessageListProps) => {
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

  const renderMessageContent = (message: Message) => {
    const { type, content, metadata } = message;

    switch (type) {
      case "sticker":
        return (
          <div className="text-6xl p-4 text-center">
            {metadata?.emoji}
          </div>
        );

      case "photo":
        return (
          <div className="space-y-2">
            <img 
              src={metadata?.fileUrl} 
              alt="Shared photo" 
              className="max-w-64 rounded-lg cursor-pointer"
              onClick={() => window.open(metadata?.fileUrl, '_blank')}
            />
            {content && <p className="text-sm">{content}</p>}
          </div>
        );

      case "video":
        return (
          <div className="space-y-2">
            <div className="relative max-w-64">
              <video 
                src={metadata?.fileUrl} 
                controls 
                className="w-full rounded-lg"
              />
            </div>
            {content && <p className="text-sm">{content}</p>}
          </div>
        );

      case "file":
        return (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg max-w-64">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Download className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{metadata?.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {(metadata?.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        );

      case "location":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg max-w-64">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Location Shared</p>
                <p className="text-xs text-muted-foreground">
                  {metadata?.latitude?.toFixed(6)}, {metadata?.longitude?.toFixed(6)}
                </p>
              </div>
            </div>
            {content && <p className="text-sm">{content}</p>}
          </div>
        );

      case "voice":
        return (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg max-w-64">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="h-2 bg-primary/20 rounded-full">
                <div className="h-2 bg-primary rounded-full w-1/3"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metadata?.duration || "00:03"}
              </p>
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg max-w-64">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <p className="text-sm font-medium">Audio Message</p>
              <p className="text-xs text-muted-foreground">Click to play</p>
            </div>
          </div>
        );

      case "poll":
        return (
          <div className="space-y-3 max-w-72">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <p className="font-medium text-sm">{metadata?.question}</p>
            </div>
            <div className="space-y-2">
              {metadata?.options?.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                >
                  <span>{option}</span>
                </Button>
              ))}
            </div>
            {content && <p className="text-sm mt-2">{content}</p>}
          </div>
        );

      case "quiz":
        return (
          <div className="space-y-3 max-w-72">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">Q</span>
              </div>
              <p className="font-medium text-sm">{metadata?.question}</p>
            </div>
            <div className="space-y-2">
              {metadata?.options?.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                >
                  <span>{option}</span>
                </Button>
              ))}
            </div>
            {content && <p className="text-sm mt-2">{content}</p>}
          </div>
        );

      case "scheduled":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Scheduled for {metadata?.scheduledFor}</span>
            </div>
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {metadata?.originalMessage || content}
            </p>
          </div>
        );

      default:
        return (
          <p className="whitespace-pre-wrap break-words leading-relaxed">{content}</p>
        );
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    onReactToMessage?.(messageId, emoji);
  };

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
                      const isLastInGroup = index === messageGroup.length - 1;
                      
                      return (
                        <div key={message.id} className="space-y-1">
                          {/* Pin/Star indicators */}
                          {(message.isPinned || message.isStarred) && (
                            <div className={`flex gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              {message.isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                              {message.isStarred && <Star className="h-3 w-3 text-yellow-500" />}
                            </div>
                          )}
                          
                          {/* Reply indicator */}
                          {message.replyTo && (
                            <div className={`text-xs text-muted-foreground flex items-center gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              <Reply className="h-3 w-3" />
                              <span>Reply to message</span>
                            </div>
                          )}
                          
                          <div 
                            className={`
                              ${isCurrentUser 
                                ? 'bg-love-100 text-love-800 rounded-2xl rounded-tr-sm' 
                                : 'bg-couple-light text-couple-dark rounded-2xl rounded-tl-sm'}
                              px-4 py-3 text-sm shadow-sm relative group
                              ${!isLastInGroup && !isCurrentUser ? 'rounded-bl-2xl rounded-tl-sm' : ''}
                              ${!isLastInGroup && isCurrentUser ? 'rounded-br-2xl rounded-tr-sm' : ''}
                            `}
                          >
                            {renderMessageContent(message)}
                            
                            {/* Quick reactions on hover */}
                            <div className={`
                              absolute -top-8 ${isCurrentUser ? 'right-0' : 'left-0'} 
                              opacity-0 group-hover:opacity-100 transition-opacity
                              bg-background border rounded-full px-2 py-1 flex gap-1 shadow-lg z-10
                            `}>
                              {['❤️', '👍', '😂'].map((emoji) => (
                                <Button
                                  key={emoji}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-xs hover:bg-muted"
                                  onClick={() => handleReaction(message.id, emoji)}
                                >
                                  {emoji}
                                </Button>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-muted"
                                onClick={() => onReplyMessage?.(message)}
                              >
                                <Reply className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Reactions */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className={`flex gap-1 flex-wrap ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              {message.reactions.map((reaction, reactionIndex) => (
                                <Badge 
                                  key={reactionIndex}
                                  variant="secondary" 
                                  className="h-5 text-xs px-1 cursor-pointer hover:bg-muted"
                                  onClick={() => handleReaction(message.id, reaction.emoji)}
                                >
                                  {reaction.emoji} {reaction.count}
                                </Badge>
                              ))}
                            </div>
                          )}
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
              <p className="text-muted-foreground text-center text-sm">
                No messages yet. Send your first message to your partner!
              </p>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
