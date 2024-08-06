import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../utils/dimensions';

export default function IngredientItem({ name, id, price, size }) {
  return (
    <View
      style={{
        width: horizontalScale(350),
        backgroundColor: 'white',
        alignSelf: 'center',
        padding: moderateScale(10),
        borderRadius: moderateScale(15),
        overflow: 'hidden',
        marginBottom: moderateScale(15),
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text
            style={{
              fontSize: moderateScale(9),
              color: 'gray',
              marginTop: verticalScale(5),
              marginBottom: verticalScale(5),
            }}
          >
            {id}
          </Text>
          <Text
            style={{
              fontSize: moderateScale(25),
              fontWeight: 900,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              marginTop: moderateScale(5),
              marginBottom: moderateScale(5),
            }}
          >
            {size}
          </Text>
        </View>
        <Text
          style={{
            fontSize: moderateScale(15),
            alignSelf: 'center',
            fontWeight: 600,
            color: '#3EB489',
          }}
        >
          {price}
        </Text>
      </View>

      <View>
        <TouchableOpacity
          style={{
            height: verticalScale(50),
            width: horizontalScale(330),
            top: verticalScale(2),
            backgroundColor: '#0095f6',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: moderateScale(10),
            }}
          >
            Editar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
