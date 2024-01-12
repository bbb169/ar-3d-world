import React from 'react';
import { View, TouchableOpacity, Text, ButtonProps, TouchableOpacityProps } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { IconButtonProps } from '@expo/vector-icons/build/createIconSet';
import { buttonStyles, publicStyles } from '../../styles';

interface extraButtomProps {
  type?: 'circle' | null
  size?: number
}

const IconButton = ({buttonProps, iconProps}:{buttonProps?: Partial<ButtonProps & extraButtomProps> & TouchableOpacityProps, iconProps?: IconButtonProps<any>}) => {
  return (
    <TouchableOpacity {...buttonProps} style={{ ...buttonStyles(buttonProps?.size || 32).primaryButton, ...(buttonProps?.type === 'circle' ? buttonStyles(buttonProps.size).circleButton : {}) }}>
      <View>
        {iconProps?.name && <AntDesign {...iconProps} />}
        {buttonProps?.title && <Text>{buttonProps.title}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;
