import { getBaseUrl } from '../core/utils/helpers';

export class NotificationSocket {
    constructor({ onNotification, onBadgeUpdate }) {
        this.onNotification = onNotification;
        this.onBadgeUpdate  = onBadgeUpdate;
        this.socket         = null;
        this.retryCount     = 0;
        this.maxRetries     = 5;
    }

    connect() {
        const base = getBaseUrl().replace('http', 'ws');
        const token = localStorage.getItem('ll_access');
        if (!token) return;

        try {
            this.socket = new WebSocket(`${base}/ws/notifications/?token=${token}`);

            this.socket.onmessage = (e) => {
                try {
                    const data = JSON.parse(e.data);
                    if (data.type === 'notification') {
                        this.onNotification?.(data.payload);
                    } else if (data.type === 'badge_update') {
                        this.onBadgeUpdate?.(data.payload);
                    }
                } catch (err) {
                    console.error('[NotificationSocket] message error:', err);
                }
            };

            this.socket.onclose = () => {
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    setTimeout(() => this.connect(), 3000 * this.retryCount);
                }
            };

            this.socket.onerror = (err) => {
                console.error('[NotificationSocket] error:', err);
            };
        } catch (err) {
            console.error('[NotificationSocket] connection failed:', err);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.retryCount = this.maxRetries; // stop retrying
    }
}
