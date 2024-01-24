/* eslint-disable react-native/no-inline-styles */
import { Input } from '@rneui/base';
import { useEffect, useMemo, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Dimensions, StyleSheet, View } from 'react-native';
import IconButton from '../iconButton';

export function IpAddressInput({ onChange }: { onChange: (val: string[]) => void }) {
    const [ip, setIp] = useState(['', '', '', '']);
    const { height } = useMemo(() => Dimensions.get('window'), []);
    const style = useMemo((): StyleProp<TextStyle> => ({
        backgroundColor: 'white',
        borderColor: '#1677ff',
        borderRadius: 8,
        overflow: 'hidden',
    }), [height]);

    return <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: height * 8 / 9 }}>
        <View style={{ width: height * 1 / 10 }}>
        <Input style={style} onChange={(e) => {
            ip[0] = e.nativeEvent.text;
            setIp([...ip]);
         }}/>
        </View>
        <View style={{ width: height * 1 / 10 }}><Input style={style} onChange={(e) => {
            ip[1] = e.nativeEvent.text;
            setIp([...ip]);
         }}/></View>
         <View style={{ width: height * 1 / 10 }}>
         <Input style={style} onChange={(e) => {
            ip[2] = e.nativeEvent.text;
            setIp([...ip]);
         }}/></View>
          <View style={{ width: height * 1 / 10 }}>
         <Input style={style} onChange={(e) => {
            ip[3] = e.nativeEvent.text;
            setIp([...ip]);
         }}/></View>
         <IconButton buttonProps={{
          title: '确认',
          style: { backgroundColor: 'rgba(78, 116, 289, 1)' },
          type: 'circle',
          size: 32,
          onPress() {
            onChange(ip);
          },
        }} />
    </View>;
}
