import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';

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
            console.log(`http://172.25.141.242:${3000}`);
            setSocket(io(`http://172.25.141.242:${3000}`));
        } else if (socket && wifiIpAddress) {
            console.log(socket.connected);

            // client-side
            socket.on('connect', () => {
                console.log('connetct');
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
