
import { useState, useEffect } from "react";
import { Bell, Heart, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import MatchRequestModal from "./MatchRequestModal";
import { Badge } from "@/components/ui/badge";
import matchRequestService, { MatchRequestResponse } from "@/services/match-request.service";

interface MatchNotificationProps {
  userEmail: string;
  userName: string;
  hasMatch: boolean;
}

const MatchNotification = ({ userEmail, userName, hasMatch }: MatchNotificationProps) => {
  console.log('[MatchNotification] Component props:', { userEmail, userName, hasMatch });
  
  const { t } = useLanguage();
  const [pendingRequests, setPendingRequests] = useState<MatchRequestResponse[]>([]);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadPendingRequests = async () => {
    if (isLoading) {
      console.log('[MatchNotification] Already loading, skipping...');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('📡 [MatchNotification] Loading pending requests...');
      const response = await matchRequestService.getReceivedRequests('pending');
      
      console.log('📥 [MatchNotification] API Response received:');
      console.log('   - Full Response:', response);
      console.log('   - Response JSON:', JSON.stringify(response, null, 2));
      console.log('   - matchRequests field:', response.matchRequests);
      console.log('   - matchRequests type:', typeof response.matchRequests);
      console.log('   - matchRequests is array:', Array.isArray(response.matchRequests));
      console.log('   - matchRequests length:', response.matchRequests?.length || 0);
      
      if (response.matchRequests && response.matchRequests.length > 0) {
        console.log('   - First request:', response.matchRequests[0]);
        console.log('   - First request JSON:', JSON.stringify(response.matchRequests[0], null, 2));
      }
      
      const requests = response.matchRequests || [];
      console.log('💾 [MatchNotification] Setting pending requests to state:', requests);
      console.log('   - Requests array:', requests);
      console.log('   - Requests length:', requests.length);
      
      setPendingRequests(requests);
      
      console.log('✅ [MatchNotification] setPendingRequests called with:', requests.length, 'items');
    } catch (error) {
      console.error('[MatchNotification] Error loading pending requests:', error);
      setPendingRequests([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    console.log('🔵 [MatchNotification] useEffect #1 (mount) triggered');
    console.log('[MatchNotification] hasMatch:', hasMatch, 'userEmail:', userEmail);
    
    // Always load pending requests to debug
    console.log('[MatchNotification] Calling loadPendingRequests from useEffect #1');
    loadPendingRequests();
    
    if (!hasMatch) {
      // Check for new requests periodically
      const interval = setInterval(() => {
        loadPendingRequests();
      }, 30000); // Every 30 seconds
      
      return () => {
        console.log('[MatchNotification] Cleanup interval');
        clearInterval(interval);
      };
    }
  }, []); // Empty deps to run once on mount
  
  // Separate effect to reload when userEmail changes
  useEffect(() => {
    console.log('🟢 [MatchNotification] useEffect #2 (userEmail) triggered');
    console.log('[MatchNotification] userEmail:', userEmail);
    if (userEmail) {
      console.log('[MatchNotification] Calling loadPendingRequests from useEffect #2');
      loadPendingRequests();
    }
  }, [userEmail]);
  
  console.log('=== [MatchNotification] RENDER ===');
  console.log('[MatchNotification] hasMatch:', hasMatch);
  console.log('[MatchNotification] pendingRequests.length:', pendingRequests.length);
  console.log('[MatchNotification] pendingRequests:', JSON.stringify(pendingRequests));
  console.log('[MatchNotification] First request:', JSON.stringify(pendingRequests[0]));
  console.log('[MatchNotification] isSendModalOpen:', isSendModalOpen);
  console.log('[MatchNotification] isReceiveModalOpen:', isReceiveModalOpen);
  console.log('[MatchNotification] isLoading:', isLoading);
  
  // Check if we have data but not rendering
  if (pendingRequests.length > 0) {
    console.log('✅ [MatchNotification] WE HAVE PENDING REQUESTS! Should show badge with:', pendingRequests.length);
  } else {
    console.log('❌ [MatchNotification] No pending requests in state');
  }
  
  if (hasMatch) {
    console.log('[MatchNotification] Returning null because hasMatch is true');
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
        
        <Button
          variant="outline"
          className="flex gap-2 items-center border-love-200 hover:bg-love-50 relative"
          onClick={() => {
            console.log('[MatchNotification] Opening receive modal, pending requests:', pendingRequests);
            setIsReceiveModalOpen(true);
          }}
        >
          {pendingRequests.length > 0 ? (
            <BellDot className="w-4 h-4 text-love-500" />
          ) : (
            <Bell className="w-4 h-4 text-love-500" />
          )}
          {t('pendingRequests')}
          {pendingRequests.length > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {pendingRequests.length}
            </Badge>
          )}
        </Button>
      </div>
      
      <MatchRequestModal 
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        userEmail={userEmail}
        userName={userName}
        mode="send"
        onRequestHandled={loadPendingRequests}
      />
      
      {isReceiveModalOpen && pendingRequests.length > 0 && (
        <MatchRequestModal 
          isOpen={isReceiveModalOpen}
          onClose={() => setIsReceiveModalOpen(false)}
          userEmail={userEmail}
          userName={userName}
          mode="receive"
          pendingRequest={pendingRequests[0]}
          onRequestHandled={() => {
            loadPendingRequests();
            setIsReceiveModalOpen(false);
          }}
        />
      )}
      
      {isReceiveModalOpen && pendingRequests.length === 0 && (
        <Dialog open={isReceiveModalOpen} onOpenChange={(open) => !open && setIsReceiveModalOpen(false)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Pending Requests</DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center text-muted-foreground">
              <p>No pending match requests</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsReceiveModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MatchNotification;
