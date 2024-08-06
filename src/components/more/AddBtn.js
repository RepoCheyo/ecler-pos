import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../utils/dimensions';

export default function AddBtn({ onPress, btnColor, disabled }) {
  return (
    <TouchableOpacity
      style={{
        height: verticalScale(60),
        width: '90%',
        alignSelf: 'center',
        backgroundColor: btnColor,
        position: 'absolute',
        bottom: verticalScale(45),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(20),
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={{
          fontWeight: 700,
          fontSize: moderateScale(13),
          color: 'white',
        }}
      >
        Agregar
      </Text>
    </TouchableOpacity>
  );
}
