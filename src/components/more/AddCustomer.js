import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../utils/dimensions';

export default function AddCustomer({ onPress, btnColor }) {
  return (
    <TouchableOpacity
      style={{
        height: verticalScale(30),
        width: '20%',
        alignSelf: 'center',
        backgroundColor: btnColor,
        position: 'absolute',
        right: verticalScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(20),
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontWeight: 700,
          fontSize: moderateScale(12),
          color: 'white',
        }}
      >
        Agregar
      </Text>
    </TouchableOpacity>
  );
}
