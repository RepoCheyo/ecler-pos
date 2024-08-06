import {
  View,
  Text,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../utils/dimensions';
import { FontAwesome } from '@expo/vector-icons';
import AddCustomer from '../components/more/AddCustomer';
import { DbContext } from '../utils/dbContext';
import { initFuncs } from '../db/initFuncs';
import AccountItem from '../components/more/AccountItem';
import AddBtn from '../components/more/AddBtn';

export default function Accounts() {
  const { db } = useContext(DbContext);

  const [acc, setAcc] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [accName, setAccName] = useState('');
  const [accAmount, setAmount] = useState();

  useEffect(() => {
    try {
      db.transaction((tx) => {
        tx.executeSql(initFuncs.paymentsInit),
          tx.executeSql('SELECT * FROM accounts', null, (queryRes, resSet) =>
            setAcc(resSet.rows._array)
          );
      });
    } catch (error) {
      alert(error);
    }
  });

  const dltCAccDb = (id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM accounts WHERE acc_id=(?)', [id]);
    });
  };

  const dltAcc = (acc) => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta seguro de eliminar la cuenta ' + acc.name,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => dltCAccDb(acc.acc_id),
        },
      ]
    );
  };

  const insertAcc = (name, accAmount) => {
    let amountInt = parseInt(accAmount);

    db.transaction((tx) => {
      tx.executeSql('INSERT INTO accounts(name, amount) values (?, ?)', [
        name,
        amountInt,
      ]);
    });
    setModalVisible(false);
  };

  const updateAccDb = (id, amount) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE accounts SET amount = ? WHERE acc_id = ?', [
        amount,
        id,
      ]);
    });
  };

  const editAcc = (acc) => {
    Alert.prompt('Editar cuenta', 'Esta editando a ' + acc.name, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Guardar',
        onPress: (amount) => updateAccDb(acc.acc_id, amount),
      },
    ]);
  };

  const isAccFull = useMemo(() => {
    return accName.length > 0 && accAmount > 0;
  }, [accName, accAmount]);

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
          Cuentas
        </Text>

        <AddCustomer
          btnColor={'#219ebc'}
          onPress={() => setModalVisible(true)}
        />
      </View>

      {acc.length > 0 ? (
        <FlatList
          data={acc}
          renderItem={({ item }) => (
            <AccountItem
              id={item.acc_id}
              name={item.name}
              amount={item.amount}
              onPressTrash={() => dltAcc(item)}
              onPressEdit={() => editAcc(item)}
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
            No tienes cuentas registradas
          </Text>
        </View>
      )}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
          accessible={false}
        >
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View
                style={{
                  bottom: verticalScale(30),
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  borderRadius: moderateScale(20),
                  padding: moderateScale(10),
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  height: '65%',
                  width: '95%',
                  position: 'absolute',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontSize: moderateScale(22),
                      fontWeight: 900,
                      padding: moderateScale(10),
                    }}
                  >
                    Agregar Cuenta
                  </Text>

                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      backgroundColor: 'lightgray',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      borderRadius: moderateScale(20),
                      width: horizontalScale(30),
                      height: verticalScale(30),
                    }}
                  >
                    <FontAwesome
                      name="close"
                      size={16}
                      color="gray"
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    alignItems: 'center',
                    top: moderateScale(20),
                  }}
                >
                  <TextInput
                    placeholderTextColor="lightgray"
                    onChangeText={setAccName}
                    value={accName}
                    placeholder="Nombre de cuenta"
                    automaticallyAdjustKeyboardInsets={true}
                  />

                  <TextInput
                    style={{
                      padding: 16,
                    }}
                    placeholderTextColor="lightgray"
                    onChangeText={setAmount}
                    value={accAmount}
                    placeholder="Saldo de cuenta"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
        <AddBtn
          btnColor={isAccFull ? '#3a86ff' : 'lightgray'}
          onPress={() => insertAcc(accName.trim(), accAmount)}
          disabled={!isAccFull}
        />
      </Modal>
    </SafeAreaView>
  );
}
