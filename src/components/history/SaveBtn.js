import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { horizontalScale, verticalScale } from '../../utils/dimensions';

export default function SaveBtn({ btnBg, ...rest }) {
  return (
    <TouchableOpacity
      style={{
        height: verticalScale(70),
        width: horizontalScale(330),
        position: 'absolute',
        backgroundColor: btnBg,
        bottom: verticalScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 20,
      }}
      {...rest}
    >
      <Text
        style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: 16,
        }}
      >
        Registrar
      </Text>
    </TouchableOpacity>
  );
}
