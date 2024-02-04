import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export function useDeviceIpAddress() {
    const [ip, setIp] = useState<string>('');

    useEffect(() => {
        Network.getIpAddressAsync().then((res) => {
            setIp(res);
        });
    }, []);

    return [ip];
}
