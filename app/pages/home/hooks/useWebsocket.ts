import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import { initSocket } from '../../../utils/socket';

type SocketState = 'STOP' | 'STARED' | 'CONNECTED' | 'DISCONNECTED';

export default function useInfosFromSocket (): [SocketState, string] {
    const [socket, setSocket] = useState<Socket | void>();
    const [wifiIpAddress, setWifiIpAddress] = useState<string>('');
    const [socketState, setSocketState] = useState<SocketState>('STOP');


    useEffect(() => {
        if (!wifiIpAddress) {
            // fetch('http://localhost:3000/index').then((res) => {
            //     console.log('res', res);
            // }).catch(err => {
            //     console.log('err', err);
            // });
            NetInfo.fetch().then((connectionInfo) => {
                if (connectionInfo.type === 'wifi' && connectionInfo.details) {
                    console.log('ipAddress', connectionInfo?.details?.ipAddress);
                    setWifiIpAddress(connectionInfo.details.ipAddress);
                }
            });
        } else if (!socket && wifiIpAddress) {
            console.log(`http://${__DEV__ === true ? '172.25.141.242' : wifiIpAddress}:${3000}`);
            setSocket(io(`http://${__DEV__ === true ? '172.25.141.242' : wifiIpAddress}:${3000}`));
            setSocketState('STARED');
        } else if (socket && wifiIpAddress) {
            console.log(socket.connected);
            initSocket(socket);
            // client-side
            socket.on('connect', () => {
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

    return [socketState, (__DEV__ === true ? '172.25.141.242' : wifiIpAddress)];
}
