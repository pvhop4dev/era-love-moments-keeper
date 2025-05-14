
/**
 * Utilities for handling match requests between users
 */

import { toast } from "sonner";

export interface MatchRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  recipientEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  acceptedAt?: string;
  relationshipStartDate?: string;
}

/**
 * Send a match request via email to another user
 */
export const sendMatchRequest = (
  currentUserEmail: string,
  currentUserName: string,
  partnerEmail: string
): boolean => {
  try {
    // Get existing requests
    const existingRequests: MatchRequest[] = JSON.parse(
      localStorage.getItem("eralove-match-requests") || "[]"
    );
    
    // Check if a request already exists for this email pair
    const existingRequest = existingRequests.find(
      (req) => 
        (req.requesterEmail === currentUserEmail && req.recipientEmail === partnerEmail) ||
        (req.requesterEmail === partnerEmail && req.recipientEmail === currentUserEmail)
    );
    
    if (existingRequest) {
      if (existingRequest.status === 'accepted') {
        toast.error("You are already matched with this user!");
      } else if (existingRequest.status === 'pending') {
        toast.error("A match request is already pending with this email!");
      }
      return false;
    }
    
    // Create a new request
    const newRequest: MatchRequest = {
      id: `req-${Date.now()}`,
      requesterId: currentUserEmail, // Using email as ID for demo
      requesterName: currentUserName,
      requesterEmail: currentUserEmail,
      recipientEmail: partnerEmail,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Save the request
    existingRequests.push(newRequest);
    localStorage.setItem("eralove-match-requests", JSON.stringify(existingRequests));
    
    // In a real app, we would send an email here
    toast.success(`Match request sent to ${partnerEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending match request:", error);
    toast.error("Failed to send match request");
    return false;
  }
};

/**
 * Check if the current user has any pending match requests
 */
export const getPendingMatchRequests = (userEmail: string): MatchRequest[] => {
  try {
    const allRequests: MatchRequest[] = JSON.parse(
      localStorage.getItem("eralove-match-requests") || "[]"
    );
    
    return allRequests.filter(
      (req) => req.recipientEmail === userEmail && req.status === 'pending'
    );
  } catch (error) {
    console.error("Error getting pending match requests:", error);
    return [];
  }
};

/**
 * Accept a match request and set the relationship start date
 */
export const acceptMatchRequest = (
  requestId: string, 
  startDate: string
): boolean => {
  try {
    const allRequests: MatchRequest[] = JSON.parse(
      localStorage.getItem("eralove-match-requests") || "[]"
    );
    
    const updatedRequests = allRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'accepted' as const,
          acceptedAt: new Date().toISOString(),
          relationshipStartDate: startDate
        };
      }
      return req;
    });
    
    localStorage.setItem("eralove-match-requests", JSON.stringify(updatedRequests));
    return true;
  } catch (error) {
    console.error("Error accepting match request:", error);
    return false;
  }
};

/**
 * Decline a match request
 */
export const declineMatchRequest = (requestId: string): boolean => {
  try {
    const allRequests: MatchRequest[] = JSON.parse(
      localStorage.getItem("eralove-match-requests") || "[]"
    );
    
    const updatedRequests = allRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'declined' as const
        };
      }
      return req;
    });
    
    localStorage.setItem("eralove-match-requests", JSON.stringify(updatedRequests));
    return true;
  } catch (error) {
    console.error("Error declining match request:", error);
    return false;
  }
};

/**
 * Check if a user has an active match
 */
export const getActiveMatch = (userEmail: string): MatchRequest | null => {
  try {
    const allRequests: MatchRequest[] = JSON.parse(
      localStorage.getItem("eralove-match-requests") || "[]"
    );
    
    return allRequests.find(
      req => 
        req.status === 'accepted' && 
        (req.requesterEmail === userEmail || req.recipientEmail === userEmail)
    ) || null;
  } catch (error) {
    console.error("Error getting active match:", error);
    return null;
  }
};

/**
 * Get the partner details for a matched user
 */
export const getPartnerDetails = (userEmail: string): {
  name: string;
  email: string;
  anniversaryDate: string;
} | null => {
  try {
    const match = getActiveMatch(userEmail);
    
    if (!match) {
      return null;
    }
    
    // Determine if the current user is the requester or recipient
    const isRequester = match.requesterEmail === userEmail;
    
    if (isRequester) {
      // Try to get the partner's user data from localStorage
      const allUsers = JSON.parse(localStorage.getItem("eralove-users") || "[]");
      const partnerUser = allUsers.find(u => u.email === match.recipientEmail);
      
      if (partnerUser) {
        return {
          name: partnerUser.name,
          email: partnerUser.email,
          anniversaryDate: match.relationshipStartDate || ""
        };
      }
      
      // If we don't have the user's data, return minimal info
      return {
        name: "Partner",
        email: match.recipientEmail,
        anniversaryDate: match.relationshipStartDate || ""
      };
    } else {
      // Get the requester's info from the match request
      return {
        name: match.requesterName,
        email: match.requesterEmail,
        anniversaryDate: match.relationshipStartDate || ""
      };
    }
  } catch (error) {
    console.error("Error getting partner details:", error);
    return null;
  }
};
