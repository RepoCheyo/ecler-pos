import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { horizontalScale, moderateScale } from '../../utils/dimensions';

export default function SettingsItem({ name, onPress }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        width: '100%',
        padding: moderateScale(5),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(16),
            fontWeight: 300,
            marginLeft: horizontalScale(18),
          }}
        >
          {name}
        </Text>
      </View>
      <Entypo name="chevron-small-right" size={40} color="lightgray" />
    </TouchableOpacity>
  );
}
