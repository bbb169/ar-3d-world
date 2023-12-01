import React from 'react';
import { View, TouchableOpacity, Text, ButtonProps, TouchableOpacityProps } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { IconButtonProps } from '@expo/vector-icons/build/createIconSet';

const IconButton = ({buttonProps, iconProps}:{buttonProps?: Partial<ButtonProps> & TouchableOpacityProps, iconProps?: IconButtonProps<any>}) => {
  return (
    <TouchableOpacity {...buttonProps}>
      <View>
        <AntDesign {...iconProps} />
        {buttonProps?.title && <Text>{buttonProps.title}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;
