export interface User {
  id: string;
  name: string;
  email: string;
  role: 'aprendiz' | 'mentor' | 'admin';
  cycle: string;
  avatar: string;
  status?: 'active' | 'suspended';
  sessions?: number;
}

export interface Mentor {
  userId: string;
  specialty: string;
  tags: string[];
  rating: number;
  totalSessions: number;
  available: boolean;
  responseTime: string;
  bio: string;
  user?: User;
  reviews?: Review[];
}

export interface Session {
  id: string;
  mentorId: string;
  apprenticeId: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'pending' | 'cancelled';
  type: 'videocall' | 'chat';
  mentor?: User;
  apprentice?: User;
}

export interface Review {
  id: string;
  sessionId: string;
  mentorId: string;
  apprenticeId: string;
  rating: number;
  comment: string;
  clarity: number;
  knowledge: number;
  punctuality: number;
  helpfulness: number;
  date: string;
  mentor?: User;
  apprentice?: User;
}

export interface Stats {
  totalUsers: number;
  activeMentors: number;
  totalApprentices: number;
  sessionsThisMonth: number;
  averageRating: number;
  sessionsThisWeek: { day: string; count: number }[];
}
