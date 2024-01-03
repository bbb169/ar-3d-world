import React from 'react';
import { Text, View } from 'react-native';
import { homePageStyles } from './style';
import useInfosFromSocket from './hooks/useWebsocket';
import IconButton from '../../component/iconButton';
import { GesturesHandler } from '../../component/gesturesHandler';

export default function HomePage(): React.JSX.Element {
  const [socketState, socket, wifiIpAddress] = useInfosFromSocket();
  
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
            if (socket) {
              socket.emit('threeFingerSwitchWindow', 'right');
            }
          },
        }} />
      </View>
    </GesturesHandler>
  );
}
