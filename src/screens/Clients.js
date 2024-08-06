import { View, Text, FlatList, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DbContext } from '../utils/dbContext';
import CustomerItem from '../components/more/customerItem';
import { verticalScale, moderateScale } from '../utils/dimensions';
import AddCustomer from '../components/more/AddCustomer';
import { initFuncs } from '../db/initFuncs';

export default function Clients() {
  const [cust, setCust] = useState([]);

  const { db } = useContext(DbContext);

  useEffect(() => {
    try {
      db.transaction((tx) => {
        tx.executeSql(initFuncs.customersInit),
          tx.executeSql(
            'SELECT * FROM customers',
            null,
            (queryRes, resSet) => setCust(resSet.rows._array)
            // console.log(cust)
          );
      });
    } catch (error) {
      alert(error);
    }
  });

  const insertCust = (cust) => {
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO customers(name) values (?)', [cust]);
    });
  };

  const addCustomer = () => {
    Alert.prompt(
      'Agregar cliente',
      'Registra el nombre del comprador para futuras ventas',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Guardar',
          onPress: (cust) => insertCust(cust),
        },
      ]
    );
  };

  const updateCustDb = (id, name) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE customers SET name = ? WHERE cust_id = ?', [
        name,
        id,
      ]);
    });
  };

  const editCustomer = (cust) => {
    Alert.prompt('Editar cliente', 'Esta editando a ' + cust.name, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Guardar',
        onPress: (name) => updateCustDb(cust.cust_id, name.trim()),
      },
    ]);
  };

  const dltCustDb = (id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM customers WHERE cust_id=(?)', [id]);
    });
  };

  const dltCust = (cust) => {
    Alert.alert('Eliminar cliente', 'Esta seguro de eliminar a ' + cust.name, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        onPress: () => dltCustDb(cust.cust_id),
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        height: '100%',
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
            fontSize: moderateScale(40),
            fontWeight: 900,
            padding: moderateScale(10),
          }}
        >
          Clientes
        </Text>

        <AddCustomer onPress={addCustomer} btnColor={'#2a9d8f'} />
      </View>

      {cust.length > 0 ? (
        <FlatList
          data={cust}
          renderItem={({ item }) => (
            <CustomerItem
              id={item.id}
              name={item.name}
              onPressTrash={() => dltCust(item)}
              onPressEdit={() => editCustomer(item)}
            />
          )}
          keyExtractor={(item) => item.cust_id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(14),
              color: 'gray',
              top: verticalScale(40),
            }}
          >
            No tienes clientes registrados
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
