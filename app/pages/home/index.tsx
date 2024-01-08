import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { homePageStyles } from './style';
import useInfosFromSocket from './hooks/useWebsocket';
import IconButton from '../../component/iconButton';
import { GesturesHandler } from '../../component/gesturesHandler';
import { emitSocket } from '../../utils/socket';
import { Slider } from '@rneui/base';

export default function HomePage(): React.JSX.Element {
  const [socketState, wifiIpAddress] = useInfosFromSocket();
  const [mouseSensitivity, setMouseSensitivity] = useState(1);
  const [isCloseGestureHandler, setIsCloseGestureHandler] = useState(false);
  const [isDraging, setIsDraging] = useState(false);
  // const [dragDiffPos, setDragDiffPos] = useState({
  //   x: 0,
  //   y: 0,
  // });

  const mainContent = <View style={homePageStyles.wholeView}>
    <Text>
      {socketState}
    </Text>
    <Text>
      use three finger to scroll down will close controll of computer
    </Text>
    <Text>
      wifiIpAddress: {wifiIpAddress}
    </Text>
    {!isCloseGestureHandler && <IconButton buttonProps={{
        title: 'click and move to drag mouse',
        style: { backgroundColor: 'rgba(78, 116, 289, 1)' },
        onPressIn() {
          emitSocket('mouseToggle', { down: 'down' });
          setIsDraging(true);
        },
      }} />}
    {isCloseGestureHandler && <>
      <IconButton buttonProps={{
        title: 'click to open gestures handler',
        style: { backgroundColor: 'rgba(78, 116, 289, 1)' },
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
