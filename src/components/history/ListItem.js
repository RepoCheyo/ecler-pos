import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { moderateScale } from '../../utils/dimensions';

export default function ListItem({
  id,
  title,
  amount,
  date,
  amountColor,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        padding: '5%',
        width: '100%',
        borderTopColor: 'lightgray',
        borderTopWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}
      onPress={onPress}
    >
      <View
        style={{
          flex: 0.9,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontWeight: 900,
              fontSize: moderateScale(18),
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: moderateScale(14),
              color: amountColor,
            }}
          >
            ${amount}
          </Text>
        </View>
        <Text
          style={{
            fontSize: moderateScale(12),
            color: 'gray',
          }}
        >
          {date}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(10),

            color: 'gray',
          }}
        >
          {id}
        </Text>
      </View>

      <View style={{ justifyContent: 'center' }}>
        <Entypo name="chevron-small-right" size={40} color="lightgray" />
      </View>
    </TouchableOpacity>
  );
}
