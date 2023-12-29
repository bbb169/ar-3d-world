import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';

type ResolveValue<T> = T extends Record<string, any> ? [keyof T, T[keyof T]] : never;

type EmitSocketParams = (...props: ResolveValue<{
    'threeFingerSwitchWindow': 'left' | 'right';
}>) => void

export default function useInfosFromSocket () {
    const [socket, setSocket] = useState<Socket | void>();
    const [wifiIpAddress, setWifiIpAddress] = useState<string | null>(null);


    useEffect(() => {
        if (!wifiIpAddress) {
            fetch('http://localhost:3000/index').then((res) => {
                console.log('res', res);
            }).catch(err => {
                console.log('err', err);
            });
            NetInfo.fetch().then((connectionInfo) => {
                if (connectionInfo.type === 'wifi' && connectionInfo.details) {
                    console.log('ipAddress',connectionInfo?.details?.ipAddress);
                    setWifiIpAddress(connectionInfo.details.ipAddress);
                }
            });
        } else if (!socket && wifiIpAddress) {
            console.log(`http://${__DEV__ === true ? '172.25.141.242' : wifiIpAddress}:${3000}`);
            setSocket(io(`http://${__DEV__ === true ? '172.25.141.242' : wifiIpAddress}:${3000}`));
        } else if (socket && wifiIpAddress) {
            console.log(socket.connected);

            // client-side
            socket.on('connect', () => {
                console.log('connetct', socket.connected);
                const emitSocket = socket.emit as EmitSocketParams;
                emitSocket('threeFingerSwitchWindow', 'right');
            });

            socket.on('disconnect', () => {
                setSocket();
                console.log('========== disconnected ws ===========');
            });

            // =================== Heartbeat Detection ====================
            // setInterval(() => {
            //     console.log('======== heartDetect ============ ');

            //     // emitSocket('heartDetect');
            // }, 10000);
        }
    }, [socket, wifiIpAddress]);

    return [socket];
}
