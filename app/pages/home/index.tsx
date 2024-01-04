import React from 'react';
import { Text, View } from 'react-native';
import { homePageStyles } from './style';
import useInfosFromSocket from './hooks/useWebsocket';
import IconButton from '../../component/iconButton';
import { GesturesHandler } from '../../component/gesturesHandler';
import { emitSocket } from '../../utils/socket';

export default function HomePage(): React.JSX.Element {
  const [socketState, wifiIpAddress] = useInfosFromSocket();

  return (
    <GesturesHandler>
      <View style={homePageStyles.wholeView}>
        <Text>
          {socketState}
        </Text>
        <Text>
          wifiIpAddress: {wifiIpAddress}
        </Text>
        <IconButton buttonProps={{
          title: 'click to send message',
          onPress() {
            emitSocket('threeFingerSwitchWindow', 'right');
          },
        }} />
      </View>
    </GesturesHandler>
  );
}
