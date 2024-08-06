import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { moderateScale } from '../../utils/dimensions';

export default function FlavorItem({ name, qty }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: qty > 0 ? '#EFEFEF' : '#FF0800',
        padding: moderateScale(10),
        margin: moderateScale(5),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Text
        style={{
          fontSize: moderateScale(12),
          fontWeight: 500,
          color: qty > 0 ? 'black' : 'white',
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontSize: moderateScale(12),
          color: qty > 0 ? 'black' : 'white',
        }}
      >
        {qty}
      </Text>
    </TouchableOpacity>
  );
}
