import { View, Text, ScrollView, Alert, Button } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { DbContext } from '../utils/dbContext';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/dimensions';
import { FontAwesome5, Entypo, Fontisto } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

export default function SaleDetail({ route }) {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [sale, setSale] = useState([]);
  const [saleDet, setSaleDet] = useState([]);

  const sale_id = route.params.params.sale_id;

  const getSale = (sale_id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM sales WHERE sale_id=?',
        [sale_id],
        (queryRes, resSet) => {
          const sale = resSet.rows._array[0];
          setSale(sale);

          const stringToJSON = JSON.parse(sale.sale_det);

          stringToJSON.forEach((flavor) => {
            db.transaction((tx) => {
              tx.executeSql(
                'SELECT * FROM stock WHERE prod_id = ?',
                [flavor.prod_id],
                (tx, result) => {
                  if (result.rows.length > 0) {
                    const product = result.rows.item(0);

                    // Combine flavor with its associated product
                    const flavorWithProduct = { ...flavor, product };

                    // Update the state
                    setSaleDet((prevState) => [
                      ...prevState,
                      flavorWithProduct,
                    ]);
                  }
                }
              );
            });
          });
        }
      );
    });
  };

  const deleteSale = (saleId) => {
    db.transaction((tx) => {
      // Step 1: Fetch the sale details
      tx.executeSql(
        'SELECT * FROM sales WHERE sale_id = ?',
        [saleId],
        (tx, result) => {
          if (result.rows.length > 0) {
            const sale = result.rows.item(0);
            const { sale_det, amount, account } = sale;

            // Step 2: Refund the amount to the account
            tx.executeSql(
              'UPDATE accounts SET amount = amount + ? WHERE name = ?',
              [amount, account]
            );

            // Step 3: Parse sale_det and refund the flavors
            const saleDetails = JSON.parse(sale_det); // Assuming sale_det is a JSON string
            saleDetails.forEach((item) => {
              const { flavor } = item; // Assuming each `item` has a `flavor` object
              tx.executeSql(
                'UPDATE flavors SET qty = qty + ? WHERE flavor_id = ?',
                [1, flavor.flavor_id] // Refund one unit for each flavor in sale_det
              );
            });

            // Step 4: Delete the sale
            tx.executeSql('DELETE FROM sales WHERE sale_id = ?', [saleId]);
          }
        }
      );
    });
    navigation.navigate('Historial');
  };

  useEffect(() => {
    getSale(sale_id);
  }, []);

  return (
    <ScrollView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              fontSize: moderateScale(18),
              fontWeight: '900',
              top: verticalScale(20),
              padding: moderateScale(10),
            }}
          >
            Resumen de venta
          </Text>

          <Text
            style={{
              fontSize: moderateScale(7),
              left: horizontalScale(7),
              top: verticalScale(10),
            }}
          >
            {sale.sale_id}
          </Text>
        </View>

        <Text
          style={{
            fontSize: moderateScale(14),
            fontWeight: '800',
            top: verticalScale(20),
            padding: moderateScale(10),
            backgroundColor: '#00A86B',
            color: 'white',
            borderRadius: 10,
          }}
        >
          Total ${sale.amount}
        </Text>
      </View>

      <View
        style={{
          top: verticalScale(20),
          padding: moderateScale(10),
          height: '100%',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: verticalScale(10),
          }}
        >
          <FontAwesome5 name="users" size={moderateScale(16)} color="#BEBFC5" />
          <Text
            style={{
              fontWeight: 600,
              fontSize: moderateScale(12),
              left: horizontalScale(3),
              alignSelf: 'center',
            }}
          >
            Cliente
          </Text>
        </View>

        <Text
          style={{
            fontSize: moderateScale(10),
          }}
        >
          {sale.cust_name}
        </Text>

        <View
          style={{
            top: verticalScale(25),
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <FontAwesome5
            name="hamburger"
            size={moderateScale(16)}
            color="#BEBFC5"
          />

          <Text
            style={{
              fontWeight: 600,
              fontSize: moderateScale(12),
              left: horizontalScale(3),
              alignSelf: 'center',
            }}
          >
            Productos
          </Text>
        </View>

        {saleDet.map((item, index) => (
          <Text
            key={index}
            style={{
              fontSize: moderateScale(10),
              top: verticalScale(30),
              marginBottom: verticalScale(10),
            }}
          >
            {item.product?.name || 'Unknown Product'} •{' '}
            {item.flavor.name || 'Unknown Flavor'} • 1
          </Text>
        ))}

        <View
          style={{
            top: verticalScale(50),
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Entypo name="wallet" size={moderateScale(16)} color="#BEBFC5" />
          <Text
            style={{
              fontWeight: 600,
              fontSize: moderateScale(12),
              left: horizontalScale(3),
              alignSelf: 'center',
            }}
          >
            Cuenta
          </Text>
        </View>

        <Text
          style={{
            fontSize: moderateScale(10),
            top: verticalScale(60),
          }}
        >
          {sale.account}
        </Text>

        <View
          style={{
            top: verticalScale(80),
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Entypo name="calendar" size={moderateScale(16)} color="#BEBFC5" />
          <Text
            style={{
              fontWeight: 600,
              fontSize: moderateScale(12),
              left: horizontalScale(3),
              alignSelf: 'center',
            }}
          >
            Fecha
          </Text>
        </View>

        <Text
          style={{
            top: verticalScale(90),
            fontSize: moderateScale(10),
            paddingBottom: scale(20),
          }}
        >
          {sale.date}
        </Text>
      </View>
      <View
        style={{
          padding: scale(5),
        }}
      >
        <Button
          onPress={() => {
            deleteSale(sale_id);
          }}
          title="Eliminar venta"
        />
      </View>
    </ScrollView>
  );
}
