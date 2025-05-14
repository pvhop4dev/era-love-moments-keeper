
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { sendMatchRequest, MatchRequest, acceptMatchRequest, declineMatchRequest } from "@/utils/matchUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface MatchRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  mode: "send" | "receive";
  pendingRequest?: MatchRequest;
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
  const [partnerEmail, setPartnerEmail] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  
  const handleSendRequest = () => {
    if (!partnerEmail.trim()) {
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
    
    const success = sendMatchRequest(userEmail, userName, partnerEmail);
    if (success) {
      onClose();
      if (onRequestHandled) {
        onRequestHandled();
      }
    }
  };
  
  const handleAcceptRequest = () => {
    if (!pendingRequest) {
      toast.error("No pending request found");
      return;
    }
    
    if (!startDate) {
      toast.error(t('startDateRequired'));
      return;
    }
    
    const formattedDate = startDate.toISOString().split('T')[0];
    const success = acceptMatchRequest(pendingRequest.id, formattedDate);
    
    if (success) {
      toast.success(t('requestAccepted'));
      
      // Update the user's anniversary date
      const userData = JSON.parse(localStorage.getItem("eralove-user") || "{}");
      userData.anniversaryDate = formattedDate;
      userData.partnerName = pendingRequest.requesterName;
      localStorage.setItem("eralove-user", JSON.stringify(userData));
      
      // Update users collection
      const allUsers = JSON.parse(localStorage.getItem("eralove-users") || "[]");
      const updatedUsers = allUsers.map(user => {
        if (user.email === userData.email) {
          return {
            ...user,
            anniversaryDate: formattedDate,
            partnerName: pendingRequest.requesterName
          };
        }
        return user;
      });
      localStorage.setItem("eralove-users", JSON.stringify(updatedUsers));
      
      onClose();
      if (onRequestHandled) {
        onRequestHandled();
      }
      
      // Reload to show the updated dashboard
      window.location.reload();
    } else {
      toast.error(t('errorAcceptingRequest'));
    }
  };
  
  const handleDeclineRequest = () => {
    if (!pendingRequest) {
      toast.error("No pending request found");
      return;
    }
    
    const success = declineMatchRequest(pendingRequest.id);
    
    if (success) {
      toast.success(t('requestDeclined'));
      onClose();
      if (onRequestHandled) {
        onRequestHandled();
      }
    } else {
      toast.error(t('errorDecliningRequest'));
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-love-700">
            {mode === "send" ? t('sendMatchRequest') : t('matchRequestReceived')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {mode === "send" ? (
            <div className="grid gap-2">
              <Label htmlFor="partnerEmail">{t('partnerEmail')}</Label>
              <Input
                id="partnerEmail"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                placeholder="partner@example.com"
              />
              <p className="text-sm text-muted-foreground">
                {t('matchRequestExplanation')}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md bg-background p-4 border">
                <p className="font-medium mb-1">{t('matchRequestFrom')}</p>
                <p className="text-lg text-love-600">{pendingRequest?.requesterName}</p>
                <p className="text-sm text-muted-foreground">{pendingRequest?.requesterEmail}</p>
              </div>
              
              <div className="grid gap-2 mt-2">
                <Label>{t('setRelationshipStartDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>{t('selectDate')}</span>}
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
                  {t('matchDateExplanation')}
                </p>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="border-love-200 hover:bg-love-50"
          >
            {t('cancel')}
          </Button>
          
          {mode === "send" ? (
            <Button 
              onClick={handleSendRequest} 
              className="love-button"
            >
              {t('sendRequest')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleDeclineRequest} 
                className="border-red-200 hover:bg-red-50 text-red-600"
              >
                {t('decline')}
              </Button>
              <Button 
                onClick={handleAcceptRequest} 
                className="love-button"
              >
                {t('accept')}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchRequestModal;
