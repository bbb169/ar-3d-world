import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { homePageStyles } from './style';
import useInfosFromSocket from './hooks/useWebsocket';
import IconButton from '../../component/iconButton';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

export default function HomePage(): React.JSX.Element {
  const [socketState, socket] = useInfosFromSocket();
  const [gestures, setGestures] = useState<string[]>([]);

  return (
    <PanGestureHandler
      onGestureEvent={(event) => {
        // 获取触摸点的数量
        const numberOfTouches = event.nativeEvent.numberOfPointers;
    
        // 如果触摸点的数量为3，表示三指滑动
        if (numberOfTouches >= 3) {
          // 处理三指滑动手势事件
          console.log('Three Finger Swipe:', event);
          setGestures(Array.from(new Set(gestures).add('Three Finger Swipe')));
        } else {
          setGestures(Array.from(new Set(gestures).add('Pan')));
        }
      }}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END && nativeEvent.numberOfPointers >= 3) {
          const set = new Set(gestures);
          if (nativeEvent.numberOfPointers >= 3) {
            set.delete('Three Finger Swipe');
          } else {
            set.delete('Pan');
          }
          setGestures(Array.from(set));
        }
      }}
    >
      <View style={homePageStyles.wholeView}>
        <Text>
          {socketState}
          gestures: {gestures.join(',')}
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
    </PanGestureHandler>
  );
}
