import { Socket } from 'socket.io-client';
type ResolveValue<T> = T extends Record<string, any> ? [keyof T, T[keyof T]] : never;

let socket: Socket;

export function initSocket(newSocket: Socket) {
    socket = newSocket;
}

export function emitSocket(...params:ResolveValue<{
    'threeFingerSwitchWindow': 'left' | 'right' | 'top' | 'add' | 'minus';
}>) {
    if (socket) {
        socket.emit(...params);
    } else {
        console.warn('socket is not set yet');
    }
}
