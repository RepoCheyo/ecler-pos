import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/dimensions';
import { DbContext } from '../utils/dbContext';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import colors from '../styles/colors';

export default function AddExpense() {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [detail, setDetail] = useState('');
  const [accs, setAccs] = useState('');
  const [accsAmount, setAccsAmount] = useState('');

  const [acc, setAcc] = useState([]);

  const getAcc = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM accounts', null, (queryRes, resSet) =>
        setAcc(resSet.rows._array)
      );
    });
  };

  const registerExpense = (title, amount, desc, acc) => {
    const expenseId = uuid.v4();

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO expenses(expense_id, title, amount, desc, account) values (?, ?, ?, ?, ?)',
        [expenseId, title, amount, desc, acc.name]
      );
    });

    const newBal = acc.amount - parseInt(amount);

    db.transaction((tx) => {
      tx.executeSql('UPDATE accounts SET amount=? WHERE name=?', [
        newBal,
        acc.name,
      ]);
    });

    navigation.navigate('Historial');
  };

  useEffect(() => {
    getAcc();
  }, []);

  return (
    <SafeAreaView
      style={{
        height: '100%',
      }}
    >
      <Text
        style={{
          fontSize: moderateScale(20),
          fontWeight: '900',
          top: verticalScale(20),
          padding: moderateScale(10),
        }}
      >
        Agregar gasto
      </Text>

      {acc.length > 0 ? (
        <ScrollView>
          <View
            style={{
              top: verticalScale(30),
              display: 'flex',
              flexDirection: 'row',
              padding: moderateScale(10),
            }}
          >
            <AntDesign
              name="pushpin"
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
              Título
            </Text>
          </View>

          <View
            style={{
              top: verticalScale(25),
              width: horizontalScale(150),
              borderWidth: 2,
              padding: moderateScale(5),
              borderColor: 'lightgray',
              borderRadius: moderateScale(10),
              justifyContent: 'center',
              left: 20,
            }}
          >
            <TextInput
              style={{
                fontSize: moderateScale(10),
              }}
              onChangeText={setTitle}
              value={title}
              automaticallyAdjustKeyboardInsets={true}
            />
          </View>
          <View
            style={{
              top: verticalScale(30),
              display: 'flex',
              flexDirection: 'row',
              padding: moderateScale(10),
            }}
          >
            <FontAwesome5
              name="money-bill-wave"
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
              Monto
            </Text>
          </View>

          <View
            style={{
              top: verticalScale(25),
              width: horizontalScale(150),
              borderWidth: 2,
              padding: moderateScale(5),
              borderColor: 'lightgray',
              borderRadius: moderateScale(10),
              justifyContent: 'center',
              left: 20,
            }}
          >
            <TextInput
              style={{
                fontSize: moderateScale(10),
              }}
              onChangeText={setAmount}
              value={amount}
              automaticallyAdjustKeyboardInsets={true}
              keyboardType="numeric"
            />
          </View>

          {accsAmount < amount && (
            <Text
              style={{
                color: colors.danger,
                marginTop: scale(15),
                marginLeft: scale(10),
                fontWeight: 900,
              }}
            >
              No puedes agregar ya que el monto es mayor al saldo de la cuenta
            </Text>
          )}

          <View
            style={{
              top: verticalScale(30),
              display: 'flex',
              flexDirection: 'row',
              padding: moderateScale(10),
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

          <View
            style={{
              top: verticalScale(25),
              width: horizontalScale(150),
              borderWidth: 2,
              padding: moderateScale(5),
              borderColor: 'lightgray',
              borderRadius: moderateScale(10),
              justifyContent: 'center',
              left: 20,
            }}
          >
            <TextInput
              style={{
                fontSize: moderateScale(10),
              }}
              onChangeText={setDetail}
              value={detail}
              automaticallyAdjustKeyboardInsets={true}
            />
          </View>

          <View
            style={{
              top: verticalScale(30),
              display: 'flex',
              flexDirection: 'row',
              padding: moderateScale(10),
            }}
          >
            <Entypo name="wallet" size={moderateScale(16)} color="lightgray" />
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

          <View
            style={{
              top: verticalScale(20),
              paddingBottom: scale(20),
              width: '100%',
            }}
          >
            <FlatList
              horizontal
              data={acc}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      item.name === accs.name ? '#FF0800' : 'lightgray',
                    padding: moderateScale(5),
                    margin: moderateScale(5),
                    borderRadius: moderateScale(10),
                    alignItems: 'center',
                    overflow: 'hidden',
                    width: horizontalScale(100),
                  }}
                  onPress={() => {
                    setAccs(item);
                    setAccsAmount(item.amount);
                  }}
                  key={item.acc_id}
                >
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      fontWeight: 500,
                      color: item.name === accs.name ? 'white' : 'black',
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      fontWeight: 700,
                      color: item.name === accs.name ? 'white' : 'black',
                    }}
                  >
                    ${item.amount}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {title && amount && accs && accsAmount > amount && (
            <TouchableOpacity
              style={{
                height: verticalScale(70),
                width: '95%',
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                alignSelf: 'center',
              }}
              onPress={() => {
                registerExpense(title, amount, detail, accs);
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: 16,
                }}
              >
                Registrar
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
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
              textAlign: 'center',
            }}
          >
            Añade una cuenta para registrar gastos
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
