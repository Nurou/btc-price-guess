import { io } from 'socket.io-client';
import { BACKEND_WS_URL } from './shared';

export const socket = io(BACKEND_WS_URL, { transports: ['websocket'], autoConnect: true });
