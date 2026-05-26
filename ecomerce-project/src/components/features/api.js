import { authService } from '../../services/auth.service';
import { profileService, discoverService, exploreService, likesService } from '../../services/profile.service';
import { chatService, subscriptionService, notificationService } from '../../services/chat.service';

export const authAPI = authService;
export const profileAPI = profileService;
export const discoverAPI = discoverService;
export const exploreAPI = exploreService;
export const likesAPI = likesService;
export const messagesAPI = chatService; // Match with components naming
export const subscriptionAPI = subscriptionService;
export const notificationAPI = notificationService;
