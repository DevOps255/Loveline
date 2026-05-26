import { apiFetch, apiFormData } from './api.helper';

export const chatService = {
    getMatches: () => apiFetch('/api/matches/'),
    getConversations: () => apiFetch('/api/conversations/'),
    getMessages: (convId, page = 1) => apiFetch(`/api/conversations/${convId}/messages?page=${page}`),
    
    sendMessage: (convId, content) => apiFetch(`/api/conversations/${convId}/messages`, { 
        method: 'POST', 
        body: JSON.stringify({ content }) 
    }),
    
    sendVoiceMessage: (matchId, formData) => apiFormData(`/api/matches/${matchId}/voice-message`, formData, 'POST'),
    
    markAsRead: (convId) => apiFetch(`/api/conversations/${convId}/read`, { method: 'POST' }),
    deleteConversation: (convId) => apiFetch(`/api/conversations/${convId}`, { method: 'DELETE' }),
    unmatch: (matchId) => apiFetch(`/api/matches/${matchId}/unmatch`, { method: 'POST' }),
    report: (userId, reason) => apiFetch('/api/report', { 
        method: 'POST', 
        body: JSON.stringify({ user_id: userId, reason }) 
    }),
};

export const subscriptionService = {
    getStatus: () => apiFetch('/api/subscription'),
    getPlans: () => apiFetch('/api/subscription/plans'),
    subscribe: (planId) => apiFetch('/api/subscription/subscribe', {
        method: 'POST',
        body: JSON.stringify({ plan_id: planId })
    }),
    cancel: () => apiFetch('/api/subscription/cancel', { method: 'POST' }),
};

export const notificationService = {
    getUnreadCounts: () => apiFetch('/api/notifications/unread-counts'),
    getAll: (page = 1) => apiFetch(`/api/notifications?page=${page}`),
    markRead: (id) => apiFetch(`/api/notifications/${id}/read`, { method: 'POST' }),
    markAllRead: () => apiFetch('/api/notifications/mark-all-read', { method: 'POST' }),
};
