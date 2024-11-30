import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import colors from '../../styles/colors';

export default function Card({ title, text, textColor, icon, onPress }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        padding: scale(10),
        borderRadius: scale(20),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
      onPress={onPress}
    >
      <View>
        <Text style={{ fontWeight: 900, fontSize: moderateScale(20) }}>
          {title}
        </Text>
        <Text
          style={{
            color: textColor,
            fontWeight: 700,
            fontSize: moderateScale(20),
            marginTop: verticalScale(5),
          }}
        >
          {text}
        </Text>
      </View>

      <View style={{ alignItems: 'center', alignSelf: 'center' }}>
        <Entypo name="chevron-small-right" size={scale(30)} color="lightgray" />
      </View>
    </TouchableOpacity>
  );
}
