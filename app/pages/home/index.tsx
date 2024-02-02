import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { homePageStyles } from './style';
import useInfosFromSocket from './hooks/useWebsocket';
import IconButton from '../../component/iconButton';
import { GesturesHandler } from '../../component/gesturesHandler';
import { emitSocket } from '../../utils/socket';
import { Slider } from '@rneui/base';
import { publicStyles } from '../../styles';
import { IpAddressInput } from '../../component/ipAddressInput';

export default function HomePage(): React.JSX.Element {
  const [userSetIp, setUserSetIp] = useState<string>('');
  const [socketState, wifiIpAddress, error] = useInfosFromSocket(userSetIp);
  const [mouseSensitivity, setMouseSensitivity] = useState(1);
  const [isCloseGestureHandler, setIsCloseGestureHandler] = useState(false);
  const [isDraging, setIsDraging] = useState(false);

  const mainContent = <View style={homePageStyles.wholeView}>
    <View style={{ transform: [{ rotate: '90deg' }], ...publicStyles.displayCenter }}>
      <Text>
        {socketState}
      </Text>
      <Text>
        use three finger to scroll down will close controll of computer
      </Text>
      <Text>
        wifiIpAddress: {wifiIpAddress}
      </Text>
      <Text>
        error: {error}
      </Text>
      {!isCloseGestureHandler && <IconButton buttonProps={{
          title: 'drag',
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
            setUserSetIp(val.join('.'));
            console.log(val);
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
      <View>
        <Text>change mouse sensitivity: {mouseSensitivity.toFixed(2)}</Text>
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
