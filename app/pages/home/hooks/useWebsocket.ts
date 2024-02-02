import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import { initSocket } from '../../../utils/socket';

type SocketState = 'STOP' | 'STARED' | 'CONNECTED' | 'DISCONNECTED';

export default function useInfosFromSocket (userSetIp: string): [SocketState, string, any] {
    const [socket, setSocket] = useState<Socket | void>();
    const [wifiIpAddress, setWifiIpAddress] = useState<string>('');
    const [socketState, setSocketState] = useState<SocketState>('STOP');
    const [error, setError] = useState<any>();

    useEffect(() => {
        if (userSetIp) {
            setSocket();
            console.log(userSetIp);
            setWifiIpAddress(userSetIp);
        }
    }, [userSetIp]);


    useEffect(() => {
        if (!wifiIpAddress) {
            NetInfo.fetch().then((connectionInfo) => {
                if (connectionInfo.type === 'wifi' && connectionInfo.details) {
                    console.log('ipAddress', connectionInfo?.details?.ipAddress);
                    setWifiIpAddress(connectionInfo.details.ipAddress);
                }
            });
        } else if (!socket && wifiIpAddress) {
            console.log(`http://${wifiIpAddress}:${3000}`);
            fetch(`http://${wifiIpAddress}:${3000}/index`).then((res) => {
                console.log('res', res);
                setError(`res: ${res}`);
            }).catch(err => {
                setError(`err: ${err}`);
                console.log('err', err);
            });
            setSocket(io(`http://${wifiIpAddress}:${3000}`));
        } else if (socket && wifiIpAddress) {
            console.log(socket.connected);
            initSocket(socket);
            // client-side
            socket.on('connect', () => {
                setSocketState('STARED');
                console.log('connetct', socket.connected);
            });

            socket.on('disconnect', () => {
                setSocket();
                setSocketState('DISCONNECTED');
                console.log('========== disconnected ws ===========');
            });

            // =================== Heartbeat Detection ====================
            // setInterval(() => {
            //     console.log('======== heartDetect ============ ');

            //     // emitSocket('heartDetect');
            // }, 10000);
        }
    }, [socket, wifiIpAddress]);

    return [socketState, (__DEV__ === true ? '172.25.141.242' : wifiIpAddress), error];
}
