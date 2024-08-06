import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { moderateScale, verticalScale } from '../../utils/dimensions';
import { Entypo } from '@expo/vector-icons';

export default function StatsCard({
  title,
  text,
  textColor,
  onPress,
  cardWidth,
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        width: cardWidth,
        height: '100%',
        padding: moderateScale(15),
        borderRadius: moderateScale(10),
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
            marginTop: verticalScale(3),
          }}
        >
          {text}
        </Text>
      </View>

      <View style={{ alignItems: 'center', alignSelf: 'center' }}>
        <Entypo
          name="chevron-small-right"
          size={moderateScale(40)}
          color="lightgray"
        />
      </View>
    </TouchableOpacity>
  );
}
