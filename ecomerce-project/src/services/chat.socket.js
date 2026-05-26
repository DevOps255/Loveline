import { getBaseUrl } from '../core/utils/helpers';

export class ChatSocket {
    constructor(convId, { onMessage, onTyping, onRead }) {
        this.convId    = convId;
        this.onMessage = onMessage;
        this.onTyping  = onTyping;
        this.onRead    = onRead;
        this.socket    = null;
    }

    connect() {
        const base = getBaseUrl().replace('http', 'ws');
        const token = localStorage.getItem('ll_access');
        if (!token) return;

        try {
            this.socket = new WebSocket(`${base}/ws/chat/${this.convId}/?token=${token}`);

            this.socket.onmessage = (e) => {
                try {
                    const data = JSON.parse(e.data);
                    if (data.type === 'chat_message') this.onMessage?.(data.payload);
                    if (data.type === 'typing')       this.onTyping?.(data.payload);
                    if (data.type === 'read_receipt') this.onRead?.(data.payload);
                } catch (err) {
                    console.error('[ChatSocket] message error:', err);
                }
            };

            this.socket.onerror = (err) => console.error('[ChatSocket] error:', err);
        } catch (err) {
            console.error('[ChatSocket] connection failed:', err);
        }
    }

    send(data) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}
