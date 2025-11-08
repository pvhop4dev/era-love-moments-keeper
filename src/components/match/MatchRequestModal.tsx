import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import matchRequestService, { MatchRequestResponse } from "@/services/match-request.service";
import userService from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";
import { formatDateObjectForBackend } from "@/utils/datetimeUtils";

interface MatchRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  mode: "send" | "receive";
  pendingRequest?: MatchRequestResponse;
  onRequestHandled?: () => void;
}

const MatchRequestModal = ({
  isOpen,
  onClose,
  userEmail,
  userName,
  mode,
  pendingRequest,
  onRequestHandled
}: MatchRequestModalProps) => {
  const { t } = useLanguage();
  const { updateUser } = useAuth();
  const [partnerEmail, setPartnerEmail] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(mode === "send" ? new Date() : undefined);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize startDate from pendingRequest's anniversaryDate when in receive mode
  useEffect(() => {
    if (mode === "receive" && pendingRequest?.anniversaryDate) {
      setStartDate(new Date(pendingRequest.anniversaryDate));
    }
  }, [mode, pendingRequest]);
  
  const handleSendRequest = async () => {
    if (!partnerEmail) {
      toast.error(t('emailRequired'));
      return;
    }
    
    if (!partnerEmail.includes('@')) {
      toast.error(t('invalidEmail'));
      return;
    }
    
    if (partnerEmail.toLowerCase() === userEmail.toLowerCase()) {
      toast.error(t('cannotMatchSelf'));
      return;
    }
    
    if (!startDate) {
      toast.error(t('anniversaryDateRequired') || 'Please select an anniversary date');
      return;
    }
    
    setIsLoading(true);
    try {
      const anniversaryDate = formatDateObjectForBackend(startDate);
      await matchRequestService.sendMatchRequest({
        receiverEmail: partnerEmail,
        anniversaryDate: anniversaryDate,
        message: `Match request from ${userName}`,
      });
      
      toast.success(t('requestSent') || 'Match request sent successfully!');
      onClose();
      if (onRequestHandled) {
        onRequestHandled();
      }
    } catch (error: any) {
      console.error('[MatchRequestModal] Error sending request:', error);
      toast.error(error.response?.data?.message || t('errorSendingRequest') || 'Failed to send match request');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAcceptRequest = async () => {
    if (!pendingRequest) {
      toast.error("No pending request found");
      return;
    }
    
    if (!startDate) {
      toast.error(t('anniversaryDateRequired') || 'Please select an anniversary date');
      return;
    }
    
    setIsLoading(true);
    try {
      const anniversaryDate = formatDateObjectForBackend(startDate);
      await matchRequestService.respondToMatchRequest(pendingRequest.id, {
        action: 'accept',
        anniversaryDate: anniversaryDate,
      });
      
      // Fetch updated user profile to get partnerId, partnerName, anniversaryDate
      console.log('[MatchRequestModal] Fetching updated user profile...');
      const updatedUser = await userService.getProfile();
      console.log('[MatchRequestModal] Updated user:', updatedUser);
      
      // Update AuthContext with new user data
      updateUser(updatedUser);
      
      toast.success(t('requestAccepted') || 'Match request accepted!');
      onClose();
      if (onRequestHandled) {
        onRequestHandled();
      }
      
      // Reload to show the updated dashboard
      window.location.reload();
    } catch (error: any) {
      console.error('[MatchRequestModal] Error accepting request:', error);
      toast.error(error.response?.data?.message || t('errorAcceptingRequest') || 'Failed to accept request');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeclineRequest = async () => {
    if (!pendingRequest) {
      toast.error("No pending request found");
      return;
    }
    
    setIsLoading(true);
    try {
      await matchRequestService.rejectMatchRequest(pendingRequest.id);
      
      toast.success(t('requestDeclined') || 'Match request declined');
      onClose();
      if (onRequestHandled) {
        onRequestHandled();
      }
    } catch (error: any) {
      console.error('[MatchRequestModal] Error declining request:', error);
      toast.error(error.response?.data?.message || t('errorDecliningRequest') || 'Failed to decline request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIgnoreRequest = () => {
    onClose();
    if (onRequestHandled) {
      onRequestHandled();
    }
  };

  const handleStartAccept = () => {
    setIsAccepting(true);
  };

  const handleCancelAccept = () => {
    setIsAccepting(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-love-700">
            {mode === "send" ? t('sendMatchRequest') || 'Send Match Request' : t('matchRequestReceived') || 'Match Request Received'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {mode === "send" ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="partnerEmail">{t('partnerEmail') || "Partner's Email"}</Label>
                <Input
                  id="partnerEmail"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="partner@example.com"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  {t('matchRequestExplanation') || 'Enter your partner\'s email to send a match request'}
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label>{t('anniversaryDate') || 'Anniversary Date'}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>{t('selectDate') || 'Select date'}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-sm text-muted-foreground">
                  {t('anniversaryDateHelp') || 'This will be your relationship anniversary date'}
                </p>
              </div>
            </>
          ) : pendingRequest ? (
            <>
              <div className="rounded-md bg-background p-4 border">
                <p className="font-medium mb-1">{t('matchRequestFrom') || 'Match request from'}</p>
                <p className="text-lg text-love-600">{pendingRequest.senderName || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">{pendingRequest.senderEmail}</p>
                {pendingRequest.anniversaryDate && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Anniversary: {new Date(pendingRequest.anniversaryDate).toLocaleDateString()}
                  </p>
                )}
                {pendingRequest.message && (
                  <p className="text-sm mt-2 italic">"{pendingRequest.message}"</p>
                )}
              </div>
              
              {isAccepting && (
                <div className="grid gap-3 mt-2">
                  <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">
                      Confirm Anniversary Date
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      You can keep the suggested date or choose your own
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Anniversary Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No pending match requests</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="border-love-200 hover:bg-love-50"
            disabled={isLoading}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          
          {mode === "send" ? (
            <Button 
              onClick={handleSendRequest} 
              className="love-button"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : (t('sendRequest') || 'Send Request')}
            </Button>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {!isAccepting ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleDeclineRequest} 
                    className="border-red-200 hover:bg-red-50 text-red-600"
                    disabled={isLoading}
                  >
                    {t('decline') || 'Decline'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleIgnoreRequest} 
                    className="border-gray-200 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    {t('ignore') || 'Ignore'}
                  </Button>
                  <Button 
                    onClick={handleStartAccept} 
                    className="love-button"
                    disabled={isLoading}
                  >
                    {t('accept') || 'Accept'}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelAccept} 
                    className="border-gray-200 hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    {t('cancel') || 'Cancel'}
                  </Button>
                  <Button 
                    onClick={handleAcceptRequest} 
                    className="love-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Accepting...' : (t('accept') || 'Accept')}
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchRequestModal;
