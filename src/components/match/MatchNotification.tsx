
import { useState, useEffect } from "react";
import { Bell, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingMatchRequests, MatchRequest } from "@/utils/matchUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import MatchRequestModal from "./MatchRequestModal";

interface MatchNotificationProps {
  userEmail: string;
  userName: string;
  hasMatch: boolean;
}

const MatchNotification = ({ userEmail, userName, hasMatch }: MatchNotificationProps) => {
  const { t } = useLanguage();
  const [pendingRequests, setPendingRequests] = useState<MatchRequest[]>([]);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  
  const loadPendingRequests = () => {
    const requests = getPendingMatchRequests(userEmail);
    setPendingRequests(requests);
  };
  
  useEffect(() => {
    loadPendingRequests();
    
    // Check for new requests periodically (in a real app this would be via WebSockets)
    const interval = setInterval(() => {
      loadPendingRequests();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [userEmail]);
  
  if (hasMatch) {
    return null; // Don't show match controls if already matched
  }
  
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex gap-2 items-center border-love-200 hover:bg-love-50"
          onClick={() => setIsSendModalOpen(true)}
        >
          <Heart className="w-4 h-4 text-love-500" />
          {t('sendMatchRequest')}
        </Button>
        
        {pendingRequests.length > 0 && (
          <Button
            variant="outline"
            className="flex gap-2 items-center border-love-200 hover:bg-love-50 relative"
            onClick={() => setIsReceiveModalOpen(true)}
          >
            <Bell className="w-4 h-4 text-love-500" />
            {t('pendingRequests')}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          </Button>
        )}
      </div>
      
      <MatchRequestModal 
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        userEmail={userEmail}
        userName={userName}
        mode="send"
        onRequestHandled={loadPendingRequests}
      />
      
      {pendingRequests.length > 0 && (
        <MatchRequestModal 
          isOpen={isReceiveModalOpen}
          onClose={() => setIsReceiveModalOpen(false)}
          userEmail={userEmail}
          userName={userName}
          mode="receive"
          pendingRequest={pendingRequests[0]}
          onRequestHandled={loadPendingRequests}
        />
      )}
    </>
  );
};

export default MatchNotification;
