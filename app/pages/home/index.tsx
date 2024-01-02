import React from 'react';
import { Text, View } from 'react-native';
import { homePageStyles } from './style';
import useInfosFromSocket from './hooks/useWebsocket';
import IconButton from '../../component/iconButton';

export default function HomePage(): React.JSX.Element {
  const [socketState, socket] = useInfosFromSocket();

  return (
    <View style={homePageStyles.wholeView}>
      <Text>
        {socketState}
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
  );
}
