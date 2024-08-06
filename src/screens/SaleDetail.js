import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { DbContext } from '../utils/dbContext';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/dimensions';
import { FontAwesome5, Entypo, Fontisto } from '@expo/vector-icons';

export default function SaleDetail({ route }) {
  const { db } = useContext(DbContext);

  const [sale, setSale] = useState([]);
  const [saleDet, setSaleDet] = useState([]);

  const sale_id = route.params.params.sale_id;

  const getSale = (sale_id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM sales WHERE sale_id=?',
        [sale_id],
        (queryRes, resSet) => {
          setSale(resSet.rows._array[0]);

          console.log(resSet.rows._array[0]);

          const stringToJSON = JSON.parse(resSet.rows._array[0].sale_det);

          setSaleDet(stringToJSON);
        }
      );
    });
  };

  useEffect(() => {
    getSale(sale_id);
  }, []);

  return (
    <View>
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

        <Text
          style={{
            fontSize: moderateScale(10),
            top: verticalScale(30),
          }}
        >
          {saleDet.prod} • {saleDet.flavor} • {saleDet.qty}
        </Text>

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
          }}
        >
          {sale.date}
        </Text>
      </View>
    </View>
  );
}
