import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our base API endpoint
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define types for our API responses
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'musician' | 'producer' | 'studio';
  bio?: string;
  location?: string;
  hourly_rate?: number;
  years_experience?: number;
  studio_experience?: boolean;
  remote_recording_capability?: boolean;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  date: string;
  duration: number;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  host_id: string;
  host?: User;
  participants?: SessionParticipant[];
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'declined';
  role?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Payment {
  id: string;
  amount: number;
  session_id: string;
  payer_id: string;
  recipient_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  payment_date?: string;
  created_at: string;
  updated_at: string;
  session?: Session;
  payer?: User;
  recipient?: User;
}

export interface Stats {
  totalSessions: number;
  pendingInvitations: number;
  upcomingSessions: number;
  pendingPayments: number;
  totalEarnings: number;
  completedSessions: number;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: User;
  recipient?: User;
}

export interface Conversation {
  id: string;
  participant_ids: string[];
  last_message?: Message;
  participants?: User[];
  unread_count: number;
}

// Define the API service
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get token from state
      const token = localStorage.getItem('token');
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: [
    'Session', 
    'User', 
    'Payment', 
    'Message', 
    'Conversation',
    'Stats',
  ],
  endpoints: (builder) => ({
    // Session endpoints
    getSessions: builder.query<Session[], void>({
      query: () => 'sessions',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Session' as const, id })),
              { type: 'Session', id: 'LIST' },
            ]
          : [{ type: 'Session', id: 'LIST' }],
    }),
    
    getSessionById: builder.query<Session, string>({
      query: (id) => `sessions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Session', id }],
    }),
    
    createSession: builder.mutation<Session, Partial<Session>>({
      query: (body) => ({
        url: 'sessions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Session', id: 'LIST' }, { type: 'Stats' }],
    }),
    
    updateSession: builder.mutation<Session, Partial<Session> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `sessions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Session', id },
        { type: 'Stats' },
      ],
    }),
    
    deleteSession: builder.mutation<void, string>({
      query: (id) => ({
        url: `sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Session', id: 'LIST' }, { type: 'Stats' }],
    }),
    
    // Invitations (session participation) endpoints
    respondToInvitation: builder.mutation<
      SessionParticipant,
      { sessionId: string; status: 'confirmed' | 'declined' }
    >({
      query: ({ sessionId, status }) => ({
        url: `sessions/${sessionId}/respond`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'Session', id: sessionId },
        { type: 'Stats' },
      ],
    }),
    
    // User endpoints
    getMusicians: builder.query<User[], void>({
      query: () => 'users/musicians',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    updateUser: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    // Payment endpoints
    getPayments: builder.query<Payment[], void>({
      query: () => 'payments',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Payment' as const, id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),
    
    createPayment: builder.mutation<Payment, Partial<Payment>>({
      query: (body) => ({
        url: 'payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }, { type: 'Stats' }],
    }),
    
    // Dashboard stats
    getStats: builder.query<Stats, void>({
      query: () => 'stats',
      providesTags: ['Stats'],
    }),
    
    // Upcoming sessions for dashboard
    getUpcomingSessions: builder.query<Session[], void>({
      query: () => 'sessions/upcoming',
      providesTags: ['Session'],
    }),
    
    // Recent payments for dashboard
    getRecentPayments: builder.query<Payment[], void>({
      query: () => 'payments/recent',
      providesTags: ['Payment'],
    }),
    
    // Messaging endpoints
    getConversations: builder.query<Conversation[], void>({
      query: () => 'messages/conversations',
      providesTags: ['Conversation'],
    }),
    
    getMessages: builder.query<Message[], string>({
      query: (userId) => `messages/${userId}`,
      providesTags: (result, error, userId) => [
        { type: 'Message', id: userId },
      ],
    }),
    
    sendMessage: builder.mutation<
      Message,
      { recipientId: string; content: string }
    >({
      query: (body) => ({
        url: 'messages',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { recipientId }) => [
        { type: 'Message', id: recipientId },
        'Conversation',
      ],
    }),
    
    markMessageAsRead: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `messages/${messageId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Conversation'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetSessionsQuery,
  useGetSessionByIdQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useRespondToInvitationMutation,
  useGetMusiciansQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useGetStatsQuery,
  useGetUpcomingSessionsQuery,
  useGetRecentPaymentsQuery,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessageAsReadMutation,
} = api;