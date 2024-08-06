import { View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { DbContext } from '../utils/dbContext';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/dimensions';
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ExpenseDetail({ route }) {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [expense, setExpense] = useState([]);

  const expense_id = route.params.params.expense_id;

  const getExpense = (expense_id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM expenses WHERE expense_id=?',
        [expense_id],
        (queryRes, resSet) => {
          setExpense(resSet.rows._array[0]);
        }
      );
    });
  };

  useEffect(() => {
    getExpense(expense_id);
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
            Resumen de gasto
          </Text>

          <Text
            style={{
              fontSize: moderateScale(7),
              left: horizontalScale(7),
              top: verticalScale(10),
            }}
          >
            {expense.expense_id}
          </Text>
        </View>
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
            marginBottom: verticalScale(5),
          }}
        >
          <FontAwesome
            name="thumb-tack"
            size={moderateScale(18)}
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
            Titulo
          </Text>
        </View>

        <Text
          style={{
            fontSize: moderateScale(10),
          }}
        >
          {expense.title}
        </Text>

        <View
          style={{
            top: verticalScale(20),

            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <FontAwesome5
            name="sticky-note"
            size={moderateScale(16)}
            color="lightgray"
          />

          <Text
            style={{
              fontWeight: 600,
              fontSize: moderateScale(12),
              left: horizontalScale(3),
              alignSelf: 'center',
            }}
          >
            Nota
          </Text>
        </View>

        <Text
          style={{
            fontSize: moderateScale(10),
            top: verticalScale(25),
          }}
        >
          {expense.desc}
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
          {expense.account} •{' '}
          <Text
            style={{
              color: 'red',
              fontWeight: 600,
              fontSize: moderateScale(10),
            }}
          >
            -{expense.amount}
          </Text>
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
          {expense.date}
        </Text>
      </View>
    </View>
  );
}
