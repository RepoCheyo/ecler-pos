import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../utils/dimensions';
import FlavorItem from './FlavorItem';
import { scale } from 'react-native-size-matters';

export default function ProductItem({
  id,
  name,
  size,
  price,
  flavors,
  onPressEdit,
  onPressDlt,
}) {
  return (
    <View
      style={{
        width: '100%',
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
        </View>

        <View
          style={{
            padding: moderateScale(10),
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(15),
              alignSelf: 'center',
              color: '#29AB87',
              fontWeight: 900,
            }}
          >
            ${price}
          </Text>
          <Text
            style={{
              fontSize: moderateScale(15),
              alignSelf: 'center',
              fontWeight: 600,
            }}
          >
            {size}
          </Text>
        </View>
      </View>

      <View>
        <FlatList
          horizontal
          data={flavors}
          renderItem={({ item }) => (
            <FlavorItem key={item.id} name={item.name} qty={item.qty} />
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity
          style={{
            height: scale(30),
            width: '100%',
            top: verticalScale(2),
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderRadius: 15,
            backgroundColor: '#0095f6',
          }}
          onPress={onPressEdit}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: moderateScale(13),
            }}
          >
            Editar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: scale(30),
            width: '100%',
            top: verticalScale(10),
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderRadius: 15,
            marginBottom: verticalScale(10),
            backgroundColor: '#F5F5F5',
          }}
          onPress={onPressDlt}
        >
          <Text
            style={{
              fontWeight: 600,
              color: 'black',
              fontSize: moderateScale(13),
            }}
          >
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
