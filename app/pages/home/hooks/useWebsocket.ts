import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import { emitSocket, initSocket } from '../../../utils/socket';
import { storeData } from '../../../utils/storage';
import device from 'expo-device';
import { useDeviceIpAddress } from './useDeviceIpAddress';

type SocketState = '未连接' | '已连接' | '连接断开';

export default function useInfosFromSocket(userSetIp: string): [SocketState, string] {
  const [socket, setSocket] = useState<Socket | void>();
  const [wifiIpAddress, setWifiIpAddress] = useState<string>('');
  const [socketState, setSocketState] = useState<SocketState>('未连接');
  const [deviceIp] = useDeviceIpAddress();

  useEffect(() => {
    if (socket && deviceIp) {
      const sendDeviceInfo = (times = 0) => {
        if (times < 10 && socket?.connected) {
          emitSocket('deviceInfo', {
            deviceName: device?.deviceName || '',
            ipAddress: deviceIp,
          });
        } else {
          setTimeout(() => {
            sendDeviceInfo(times + 1);
          }, 1000);
        }
      };

      sendDeviceInfo();
    }
  }, [socket, deviceIp]);

  useEffect(() => {
    if (userSetIp) {
      setSocket();
      setWifiIpAddress(userSetIp);
    }
  }, [userSetIp]);

  useEffect(() => {
    if (!wifiIpAddress) {
      NetInfo.fetch().then((connectionInfo) => {
        if (connectionInfo.type === 'wifi' && connectionInfo.details) {
          setWifiIpAddress(connectionInfo.details.ipAddress as string);
        }
      });
    } else if (!socket && wifiIpAddress) {
      setSocket(io(`http://${wifiIpAddress}:${3000}`));
    } else if (socket && wifiIpAddress) {
      initSocket(socket);
      // client-side
      socket.on('confirm-connect-device', () => {
        setSocketState('已连接');
        storeData('ipAddress', wifiIpAddress);
      });

      socket.on('disconnect', () => {
        setSocket();
        setSocketState('连接断开');
        // eslint-disable-next-line no-console
        console.log('========== disconnected ws ===========');
      });
    }
  }, [socket, wifiIpAddress]);

  return [socketState, __DEV__ === true ? '172.25.141.242' : wifiIpAddress];
}
