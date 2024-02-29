import { Socket } from 'socket.io-client';
export type ResolveValue<T> = T extends Record<string, any> ? [keyof T, T[keyof T]] : never;

let socket: Socket;

export function initSocket(newSocket: Socket) {
    socket = newSocket;
}

let throttleInfo: {
    lastKey: string;
    open: boolean;
} = {
    lastKey: '',
    open: true,
}

export function emitSocket(...params:ResolveValue<{
    'threeFingerSwitchWindow': 'left' | 'right' | 'top' | 'add' | 'minus';
    'moveMouse': {
        left: number
        top: number
        isDraging: boolean
      };
    'dragMouse': {
        left: number
        top: number
      };
    'mouseToggle': {
        down?: 'down' | 'up'
        button?: 'left' | 'right' | 'middle'
    },
    'mouseClick': {
        button?: 'left' | 'right' | 'middle', double?: boolean
    };
    'scrollMouse': {
        x: number
        y: number
    };
    'deviceInfo': {
        deviceName: string;
        ipAddress: string;
    };
}>) {
    if (socket) {
        if (throttleInfo.open || throttleInfo.lastKey !== params[0]) {
            socket.emit(...params);
            throttleInfo = {
                open: false,
                lastKey: params[0],
            };
            setTimeout(() => {
                throttleInfo = {
                    ...throttleInfo,
                    open: true,
                };
            }, 5);
        }
    } else {
        console.warn('socket is not set yet');
    }
}
