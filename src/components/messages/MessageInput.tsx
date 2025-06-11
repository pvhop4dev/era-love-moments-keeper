
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { 
  SendHorizonal, 
  Smile, 
  Paperclip, 
  Camera, 
  Video, 
  FileText, 
  MapPin, 
  Mic, 
  Music, 
  BarChart3,
  HelpCircle,
  Calendar,
  Pin,
  Star,
  Reply
} from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (message: string, type?: string, metadata?: any) => void;
  replyingTo?: any;
  onCancelReply?: () => void;
}

const MessageInput = ({ onSendMessage, replyingTo, onCancelReply }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const emojis = ["😀", "😂", "🥰", "😍", "🤗", "😘", "😊", "😉", "😋", "😎", "🤔", "😴", "😇", "🥳", "❤️", "💕", "💖", "💗", "💘", "💝"];
  const stickers = [
    { id: 1, emoji: "🎉", name: "Party" },
    { id: 2, emoji: "💖", name: "Love" },
    { id: 3, emoji: "🌟", name: "Star" },
    { id: 4, emoji: "🔥", name: "Fire" },
    { id: 5, emoji: "👍", name: "Thumbs Up" },
    { id: 6, emoji: "🎂", name: "Cake" },
    { id: 7, emoji: "🌹", name: "Rose" },
    { id: 8, emoji: "💎", name: "Diamond" }
  ];

  const handleSend = (messageType = "text", metadata?: any) => {
    if (message.trim() || messageType !== "text") {
      onSendMessage(message.trim() || "", messageType, metadata);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (type: string) => {
    const input = type === "photo" ? photoInputRef.current : 
                  type === "video" ? videoInputRef.current : 
                  fileInputRef.current;
    input?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      handleSend(type, { 
        fileName: file.name, 
        fileSize: file.size, 
        fileUrl,
        fileType: file.type 
      });
      toast.success(`${type} sent successfully!`);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleStickerSend = (sticker: any) => {
    handleSend("sticker", sticker);
    setShowStickerPicker(false);
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        handleSend("location", { latitude, longitude });
        toast.success("Location shared!");
      }, () => {
        toast.error("Could not get location");
      });
    }
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info("Recording voice message...");
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        handleSend("voice", { duration: "00:03" });
        toast.success("Voice message sent!");
      }, 3000);
    }
  };

  const handlePollSend = () => {
    if (pollQuestion.trim() && pollOptions.filter(opt => opt.trim()).length >= 2) {
      handleSend("poll", { 
        question: pollQuestion, 
        options: pollOptions.filter(opt => opt.trim()) 
      });
      setPollQuestion("");
      setPollOptions(["", ""]);
      toast.success("Poll sent!");
    }
  };

  const handleQuizSend = () => {
    if (quizQuestion.trim() && quizOptions.filter(opt => opt.trim()).length >= 2) {
      handleSend("quiz", { 
        question: quizQuestion, 
        options: quizOptions.filter(opt => opt.trim()),
        correctAnswer
      });
      setQuizQuestion("");
      setQuizOptions(["", "", "", ""]);
      setCorrectAnswer(0);
      toast.success("Quiz sent!");
    }
  };

  const handleScheduledSend = () => {
    if (message.trim() && scheduledDate && scheduledTime) {
      handleSend("scheduled", { 
        scheduledFor: `${scheduledDate} ${scheduledTime}`,
        originalMessage: message
      });
      setScheduledDate("");
      setScheduledTime("");
      toast.success("Message scheduled!");
    }
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  return (
    <div className="space-y-3">
      {replyingTo && (
        <div className="bg-muted p-2 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Reply className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Replying to: {replyingTo.content.substring(0, 50)}...</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancelReply}>✕</Button>
        </div>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[40px] max-h-32 resize-none pr-12"
            rows={1}
          />
          
          {/* Emoji Picker */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-2 h-6 w-6 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-5 gap-1">
                {emojis.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEmojiSelect(emoji)}
                    className="h-8 w-8 p-0 text-lg"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1">
          {/* Attachment Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Paperclip className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleFileUpload("photo")}
                  className="flex flex-col gap-1 h-16"
                >
                  <Camera className="h-4 w-4" />
                  <span className="text-xs">Photo</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleFileUpload("video")}
                  className="flex flex-col gap-1 h-16"
                >
                  <Video className="h-4 w-4" />
                  <span className="text-xs">Video</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleFileUpload("file")}
                  className="flex flex-col gap-1 h-16"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">File</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLocationShare}
                  className="flex flex-col gap-1 h-16"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">Location</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleVoiceRecord}
                  className="flex flex-col gap-1 h-16"
                  disabled={isRecording}
                >
                  <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500' : ''}`} />
                  <span className="text-xs">Voice</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSend("audio", { type: "audio" })}
                  className="flex flex-col gap-1 h-16"
                >
                  <Music className="h-4 w-4" />
                  <span className="text-xs">Audio</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Stickers */}
          <Popover open={showStickerPicker} onOpenChange={setShowStickerPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <span className="text-lg">🎯</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-4 gap-2">
                {stickers.map((sticker) => (
                  <Button
                    key={sticker.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStickerSend(sticker)}
                    className="h-12 w-12 p-0 text-2xl"
                  >
                    {sticker.emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* More Options */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                ⋯
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                {/* Poll Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Create Poll
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Poll</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Poll question"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                      />
                      {pollOptions.map((option, index) => (
                        <Input
                          key={index}
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...pollOptions];
                            newOptions[index] = e.target.value;
                            setPollOptions(newOptions);
                          }}
                        />
                      ))}
                      <Button variant="outline" onClick={addPollOption}>
                        Add Option
                      </Button>
                      <Button onClick={handlePollSend} className="w-full">
                        Send Poll
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Quiz Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Quiz</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Quiz question"
                        value={quizQuestion}
                        onChange={(e) => setQuizQuestion(e.target.value)}
                      />
                      {quizOptions.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...quizOptions];
                              newOptions[index] = e.target.value;
                              setQuizOptions(newOptions);
                            }}
                          />
                          <Button
                            variant={correctAnswer === index ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCorrectAnswer(index)}
                          >
                            ✓
                          </Button>
                        </div>
                      ))}
                      <Button onClick={handleQuizSend} className="w-full">
                        Send Quiz
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Schedule Message */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Message</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Message to schedule"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                      <Button onClick={handleScheduledSend} className="w-full">
                        Schedule Message
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Pin Message */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleSend("pinned", { isPinned: true })}
                >
                  <Pin className="h-4 w-4 mr-2" />
                  Pin Message
                </Button>

                {/* Star Message */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleSend("starred", { isStarred: true })}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Star Message
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Send Button */}
          <Button 
            onClick={() => handleSend()} 
            className="bg-love-500 hover:bg-love-600 h-10 w-10 p-0"
            disabled={!message.trim()}
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "file")}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "photo")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "video")}
      />
    </div>
  );
};

export default MessageInput;
