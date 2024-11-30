import { Alert, FlatList, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsItem from '../components/more/settingsItem';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, scale } from 'react-native-size-matters';

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
          padding: scale(20),
        }}
      >
        <Text
          style={{
            fontSize: scale(25),
            fontWeight: 400,
          }}
        >
          Hola
        </Text>
        <Text
          style={{
            fontSize: scale(35),
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
            left: scale(10),
            marginTop: scale(30),
          }}
        >
          <FontAwesome5 name="store" size={scale(25)} color="lightgreen" />
          <Text
            style={{
              fontWeight: 600,
              fontSize: scale(25),
              left: scale(8),
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
