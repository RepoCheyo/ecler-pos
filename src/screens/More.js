import { Alert, FlatList, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../utils/dimensions';
import SettingsItem from '../components/more/settingsItem';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function More() {
  const navigation = useNavigation();

  const storeSettings = [
    {
      name: 'Cuentas',
      screen: 'Accounts',
    },
    {
      name: 'Clientes',
      screen: 'Clients',
    },
  ];

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        height: '100%',
      }}
    >
      <View
        style={{
          padding: moderateScale(20),
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(25),
            fontWeight: 400,
          }}
        >
          Hola
        </Text>
        <Text
          style={{
            fontSize: moderateScale(35),
            fontWeight: 900,
          }}
        >
          Geraldine
        </Text>
      </View>

      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: moderateScale(10),
            alignItems: 'flex-start',
            left: verticalScale(10),
            marginTop: verticalScale(30),
          }}
        >
          <FontAwesome5 name="store" size={30} color="lightgreen" />
          <Text
            style={{
              fontWeight: 600,
              fontSize: moderateScale(25),
              left: horizontalScale(8),
            }}
          >
            Tienda
          </Text>
        </View>
        <FlatList
          data={storeSettings}
          renderItem={({ item }) => (
            <SettingsItem
              name={item.name}
              onPress={() => navigation.navigate(item.screen)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        />
      </View>
    </SafeAreaView>
  );
}
