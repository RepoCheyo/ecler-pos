import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Entypo, Feather } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default function CustomerItem({ name, onPressTrash, onPressEdit }) {
  return (
    <View
      style={{
        width: '100%',
        height: verticalScale(75),
        display: 'flex',
        flexDirection: 'row',
        padding: moderateScale(10),
        marginBottom: verticalScale(5),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
      }}
    >
      <Text
        style={{
          marginLeft: scale(15),
          fontSize: scale(16),
        }}
      >
        {name}
      </Text>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          onPress={onPressEdit}
          style={{
            marginRight: scale(15),
          }}
        >
          <Feather name="edit-2" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressTrash}>
          <Entypo name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
