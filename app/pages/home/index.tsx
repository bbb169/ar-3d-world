import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { homePageStyles } from './style';
import useInfosFromSocket from './hooks/useWebsocket';
import IconButton from '../../component/iconButton';
import { GesturesHandler } from '../../component/gesturesHandler';
import { emitSocket } from '../../utils/socket';
import { Slider } from '@rneui/base';
import { publicStyles, textStyles } from '../../styles';
import { IpAddressInput } from '../../component/ipAddressInput';
import { getData } from '../../utils/storage';
import device from 'expo-device';

export default function HomePage(): React.JSX.Element {
  const [userSetIp, setUserSetIp] = useState<string>('');
  const [socketState, wifiIpAddress] = useInfosFromSocket(userSetIp);
  const [mouseSensitivity, setMouseSensitivity] = useState(1);
  const [isCloseGestureHandler, setIsCloseGestureHandler] = useState(false);
  const [isDraging, setIsDraging] = useState(false);
  const { height } = useMemo(() => Dimensions.get('window'), []);

  useEffect(() => {
    getData('ipAddress').then(ipAddress => {
      if (ipAddress) {
        setUserSetIp(ipAddress);
      }
    });
  }, []);

  const mainContent = <View style={homePageStyles.wholeView}>
    <View style={{ transform: [{ rotate: '90deg' }], ...publicStyles.displayCenter }}>
      <Text style={textStyles.textColor}>
        设备名: {device?.deviceName || '未知'}
      </Text>
      <Text style={textStyles.textColor}>
        wifi的ip地址: {wifiIpAddress || '未知'}
      </Text>
      <Text style={textStyles.textColor}>
        {socketState}
      </Text>
      <Text style={textStyles.textColor}>
        三指下滑解除控制电脑
      </Text>
      {!isCloseGestureHandler && <IconButton buttonProps={{
          title: '按下',
          style: { backgroundColor: 'rgba(78, 116, 289, 1)' },
          type: 'circle',
          size: 64,
          onPressIn() {
            emitSocket('mouseToggle', { down: 'down' });
            setIsDraging(true);
          },
        }} />}
      {isCloseGestureHandler && <>
        <IpAddressInput onChange={(val) => {
          if (val.every(item => {
            if (item.search(/\d+/g) > -1) {
              return Number(item) > 0 &&  Number(item) < 255;
            }
            return false;
          })) {
            setUserSetIp('');
            setTimeout(() => {
              setUserSetIp(val.join('.'));
            }, 0);
          }
        }} />
        <IconButton buttonProps={{
          title: 'Open',
          style: { backgroundColor: 'rgba(78, 116, 289, 1)' },
          type: 'circle',
          size: 64,
          onPress() {
            setIsCloseGestureHandler(false);
          },
        }} />
      <View style={{ width: height * 1 / 3 }}>
        <Text style={{...textStyles.textColor, width: height * 1 / 3}}>change mouse sensitivity: {mouseSensitivity.toFixed(2)}</Text>
        <Slider
          value={mouseSensitivity}
          onValueChange={setMouseSensitivity}
          maximumValue={10}
          minimumValue={1}
          step={0.2}
          trackStyle={{ height: 5, backgroundColor: 'blue' }}
          allowTouchTrack
        />
      </View>
      </>}
    </View>
  </View>;

  return (
    isCloseGestureHandler ? mainContent : <GesturesHandler
      sensitivity={mouseSensitivity}
      setIsCloseGestureHandler={setIsCloseGestureHandler}
      isDraging={isDraging}
      setIsDraging={setIsDraging}
    >
      {mainContent}
    </GesturesHandler>
  );
}
