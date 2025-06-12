
export interface AnonymousChatSession {
  id: string;
  user1: {
    id: string;
    gender: 'male' | 'female';
    preferredGender: 'male' | 'female' | 'any';
  };
  user2?: {
    id: string;
    gender: 'male' | 'female';
    preferredGender: 'male' | 'female' | 'any';
  };
  messages: AnonymousMessage[];
  status: 'waiting' | 'connected' | 'ended';
  createdAt: Date;
  connectedAt?: Date;
  endedAt?: Date;
}

export interface AnonymousMessage {
  id: string;
  sessionId: string;
  senderId: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system';
}

export interface UserPreferences {
  gender: 'male' | 'female';
  preferredGender: 'male' | 'female' | 'any';
}

const STORAGE_KEY = 'anonymous-chat-sessions';
const QUEUE_KEY = 'anonymous-chat-queue';

export const getStoredSessions = (): AnonymousChatSession[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const sessions = JSON.parse(stored);
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      connectedAt: session.connectedAt ? new Date(session.connectedAt) : undefined,
      endedAt: session.endedAt ? new Date(session.endedAt) : undefined,
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error parsing stored sessions:', error);
    return [];
  }
};

export const saveSession = (session: AnonymousChatSession) => {
  const sessions = getStoredSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const findMatchingUser = (
  userId: string, 
  userPreferences: UserPreferences
): AnonymousChatSession | null => {
  const sessions = getStoredSessions();
  
  // Tìm session đang chờ match
  const waitingSession = sessions.find(session => 
    session.status === 'waiting' && 
    session.user1.id !== userId &&
    isCompatible(session.user1, userPreferences)
  );
  
  return waitingSession || null;
};

const isCompatible = (user1: UserPreferences, user2: UserPreferences): boolean => {
  // Kiểm tra xem 2 user có phù hợp với nhau không
  const user1WantsUser2 = user1.preferredGender === 'any' || user1.preferredGender === user2.gender;
  const user2WantsUser1 = user2.preferredGender === 'any' || user2.preferredGender === user1.gender;
  
  return user1WantsUser2 && user2WantsUser1;
};

export const createChatSession = (
  userId: string, 
  userPreferences: UserPreferences
): AnonymousChatSession => {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const session: AnonymousChatSession = {
    id: sessionId,
    user1: {
      id: userId,
      gender: userPreferences.gender,
      preferredGender: userPreferences.preferredGender
    },
    messages: [{
      id: `msg-${Date.now()}`,
      sessionId,
      senderId: 'system',
      message: 'Đang tìm kiếm người trò chuyện phù hợp...',
      timestamp: new Date(),
      type: 'system'
    }],
    status: 'waiting',
    createdAt: new Date()
  };
  
  saveSession(session);
  return session;
};

export const joinChatSession = (
  session: AnonymousChatSession,
  userId: string,
  userPreferences: UserPreferences
): AnonymousChatSession => {
  const updatedSession = {
    ...session,
    user2: {
      id: userId,
      gender: userPreferences.gender,
      preferredGender: userPreferences.preferredGender
    },
    status: 'connected' as const,
    connectedAt: new Date(),
    messages: [
      ...session.messages,
      {
        id: `msg-${Date.now()}`,
        sessionId: session.id,
        senderId: 'system',
        message: 'Đã kết nối thành công! Hãy bắt đầu cuộc trò chuyện.',
        timestamp: new Date(),
        type: 'system' as const
      }
    ]
  };
  
  saveSession(updatedSession);
  return updatedSession;
};

export const addMessage = (
  sessionId: string,
  senderId: string,
  message: string
): AnonymousMessage => {
  const sessions = getStoredSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  const newMessage: AnonymousMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sessionId,
    senderId,
    message,
    timestamp: new Date(),
    type: 'text'
  };
  
  session.messages.push(newMessage);
  saveSession(session);
  
  return newMessage;
};

export const endChatSession = (sessionId: string) => {
  const sessions = getStoredSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (session) {
    session.status = 'ended';
    session.endedAt = new Date();
    session.messages.push({
      id: `msg-${Date.now()}`,
      sessionId,
      senderId: 'system',
      message: 'Cuộc trò chuyện đã kết thúc.',
      timestamp: new Date(),
      type: 'system'
    });
    
    saveSession(session);
  }
};

export const getCurrentSession = (userId: string): AnonymousChatSession | null => {
  const sessions = getStoredSessions();
  return sessions.find(session => 
    (session.user1.id === userId || session.user2?.id === userId) &&
    (session.status === 'waiting' || session.status === 'connected')
  ) || null;
};
