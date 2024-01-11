import React from 'react';
import { View, TouchableOpacity, Text, ButtonProps, TouchableOpacityProps } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { IconButtonProps } from '@expo/vector-icons/build/createIconSet';
import { buttonStyles, publicStyles } from '../../styles';

const IconButton = ({buttonProps, iconProps}:{buttonProps?: Partial<ButtonProps> & TouchableOpacityProps, iconProps?: IconButtonProps<any>}) => {
  return (
    <TouchableOpacity {...buttonProps} style={{ ...buttonStyles().primaryButton, ...buttonStyles().circleButton }}>
      <View style={{  }}>
        <AntDesign {...iconProps} />
        {buttonProps?.title && <Text style={{ textAlign: 'center', lineHeight: 32 }}>{buttonProps.title}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;
