import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/dimensions';
import uuid from 'react-native-uuid';
import { DbContext } from '../utils/dbContext';
import { FontAwesome5, Entypo, Fontisto } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function AddSale() {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [client, setClient] = useState('');
  const [prod, setProd] = useState('');
  const [price, setPrice] = useState('');
  const [flavor, setFlavor] = useState('');
  const [flavQty, setFlavQty] = useState(0);
  const [qty, setQty] = useState('');
  const [acc, setAcc] = useState('');
  const [accAm, setAccAm] = useState(0);

  const [accs, setAccs] = useState([]);
  const [clients, setClients] = useState([]);
  const [prods, setProds] = useState([]);
  const [flavors, setFlavors] = useState([]);

  const getClients = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM customers', null, (queryRes, resSet) =>
        setClients(resSet.rows._array)
      );
    });
  };

  const getProducts = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM stock', null, (queryRes, resSet) =>
        setProds(resSet.rows._array)
      );
    });
  };

  const getFlavors = (prod) => {
    setProd(prod.name);
    setPrice(prod.price);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM stock WHERE prod_id=?',
        [prod.prod_id],
        (queryRes, resSet) =>
          setFlavors(JSON.parse(resSet.rows._array[0].flavors))
      );
    });
  };

  const getAcc = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM accounts', null, (queryRes, resSet) =>
        setAccs(resSet.rows._array)
      );
    });
  };

  const selectFlavor = (flavor) => {
    setFlavor(flavor.name);
    setFlavQty(parseInt(flavor.qty));
  };

  const registerSale = (cust_name, sale_det, amount, account) => {
    const saleId = uuid.v4();

    let detailString = JSON.stringify(sale_det);

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO sales(sale_id, cust_name, sale_det, amount, account) values (?, ?, ?, ?, ?)',
        [saleId, cust_name, detailString, amount, account]
      );
    });

    const newBal = accAm + parseInt(amount);

    db.transaction((tx) => {
      tx.executeSql('UPDATE accounts SET amount=? WHERE name=?', [newBal, acc]);
    });

    if (flavors.some((item) => item.name === sale_det.flavor)) {
      let flavor = sale_det.flavor;

      let flavStockSale = sale_det.qty;

      flavors.splice(
        flavors.findIndex((v) => v.name === flavor),
        1
      );

      let stockTotal = flavQty - parseInt(flavStockSale);

      flavors.push({
        name: sale_det.flavor,
        qty: stockTotal,
      });
    }

    const flavorsString = JSON.stringify(flavors);

    db.transaction((tx) => {
      tx.executeSql('UPDATE stock SET flavors=? WHERE name=?', [
        flavorsString,
        prod,
      ]);
    });

    navigation.navigate('Historial');
  };

  useEffect(() => {
    getClients();
    getProducts();
    getAcc();
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
          Agregar venta
        </Text>

        {accs.length > 0 && clients.length > 0 && prods.length > 0 && (
          <Text
            style={{
              fontSize: moderateScale(16),
              fontWeight: '800',
              top: verticalScale(20),
              padding: moderateScale(10),
              backgroundColor: '#00A86B',
              color: 'white',
              borderRadius: 10,
            }}
          >
            {' '}
            Total ${price ? parseInt(price) * qty : 0}
          </Text>
        )}
      </View>

      <View
        style={{
          top: verticalScale(20),
          padding: moderateScale(10),
          height: '100%',
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {accs.length > 0 && clients.length > 0 && prods.length > 0 ? (
            <>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: verticalScale(10),
                }}
              >
                <FontAwesome5
                  name="users"
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
                  Cliente
                </Text>
              </View>

              <View
                style={{
                  top: verticalScale(1),
                  width: horizontalScale(200),
                  height: verticalScale(40),

                  borderWidth: 2,
                  padding: 5,
                  borderColor: 'lightgray',
                  borderRadius: moderateScale(10),
                  justifyContent: 'center',
                }}
              >
                <RNPickerSelect
                  onValueChange={(itemValue, itemIndex) => setClient(itemValue)}
                  items={clients.map((item) => {
                    return {
                      label: item.name,
                      value: item.name,
                    };
                  })}
                />
              </View>

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
                  Producto
                </Text>
              </View>

              <View
                style={{
                  top: verticalScale(25),
                  width: '100%',
                }}
              >
                <FlatList
                  horizontal
                  data={prods}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          item.name === prod ? '#FF3800' : 'lightgray',
                        padding: moderateScale(5),
                        margin: moderateScale(5),
                        borderRadius: moderateScale(10),
                        alignItems: 'center',
                        overflow: 'hidden',
                        width: horizontalScale(100),
                      }}
                      onPress={() => getFlavors(item)}
                      key={item.prod_id}
                    >
                      <Text
                        style={{
                          fontSize: moderateScale(12),
                          fontWeight: 500,
                          color: item.name === prod ? 'white' : 'black',
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: moderateScale(12),
                          fontWeight: 700,
                          color: item.name === prod ? 'white' : 'black',
                        }}
                      >
                        ${item.price}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              <View
                style={{
                  top: verticalScale(30),
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Entypo name="bowl" size={moderateScale(16)} color="#BEBFC5" />
                <Text
                  style={{
                    fontWeight: 600,
                    fontSize: moderateScale(12),
                    left: horizontalScale(3),
                    alignSelf: 'center',
                  }}
                >
                  Sabor
                </Text>
              </View>

              <View
                style={{
                  top: verticalScale(30),
                  height: verticalScale(100),
                }}
              >
                {flavors.length !== 0 ? (
                  <FlatList
                    horizontal
                    data={flavors}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            item.name === flavor ? '#FF6347' : 'lightgray',
                          padding: moderateScale(5),
                          margin: moderateScale(5),
                          borderRadius: moderateScale(10),
                          alignItems: 'center',
                          overflow: 'hidden',
                          justifyContent: 'center',
                          height: verticalScale(50),
                          width: horizontalScale(100),
                        }}
                        key={item.id}
                        onPress={() => selectFlavor(item)}
                      >
                        <Text
                          style={{
                            fontSize: moderateScale(12),
                            color: item.name === flavor ? 'white' : 'black',
                            // fontWeight: 500,
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: moderateScale(12),
                            fontWeight: 500,
                            color: item.name === flavor ? 'white' : 'black',
                          }}
                        >
                          {item.qty}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text
                    style={{
                      color: 'gray',
                      top: verticalScale(5),
                      fontSize: moderateScale(10),
                    }}
                  >
                    Seleccione producto para mostrar los sabores
                  </Text>
                )}
              </View>

              <View
                style={{
                  top: verticalScale(15),
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Fontisto name="shopping-basket" size={24} color="#BEBFC5" />
                <Text
                  style={{
                    fontWeight: 600,
                    fontSize: moderateScale(12),
                    alignSelf: 'center',
                    left: horizontalScale(3),
                  }}
                >
                  Cantidad
                </Text>
              </View>

              <View
                style={{
                  top: verticalScale(25),
                  width: horizontalScale(100),
                  height: verticalScale(40),
                  borderWidth: 2,
                  padding: 5,
                  borderColor: 'lightgray',
                  borderRadius: moderateScale(10),
                  justifyContent: 'center',
                }}
              >
                <TextInput
                  style={{
                    fontSize: moderateScale(12),
                  }}
                  onChangeText={setQty}
                  value={qty}
                  placeholder="Cantidad"
                  keyboardType="numeric"
                  automaticallyAdjustKeyboardInsets={true}
                />
              </View>

              <View
                style={{
                  top: verticalScale(50),
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Entypo
                  name="wallet"
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
                  Cuenta
                </Text>
              </View>

              <View
                style={{
                  top: verticalScale(50),
                  width: '100%',
                }}
              >
                <FlatList
                  horizontal
                  data={accs}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          item.name === acc ? '#FF0800' : 'lightgray',
                        padding: moderateScale(5),
                        margin: moderateScale(5),
                        borderRadius: moderateScale(10),
                        alignItems: 'center',
                        overflow: 'hidden',
                        width: horizontalScale(100),
                      }}
                      onPress={() => {
                        setAcc(item.name), setAccAm(item.amount);
                      }}
                      key={item.acc_id}
                    >
                      <Text
                        style={{
                          fontSize: moderateScale(12),
                          fontWeight: 500,
                          color: item.name === acc ? 'white' : 'black',
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: moderateScale(12),
                          fontWeight: 700,
                          color: item.name === acc ? 'white' : 'black',
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
            </>
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
                Añade cuentas, clientes y productos antes de registrar una venta
              </Text>
            </View>
          )}
        </TouchableWithoutFeedback>
      </View>

      {client !== '' &&
        qty > 0 &&
        qty < flavQty &&
        acc &&
        accs.length > 0 &&
        clients.length > 0 &&
        prods.length > 0 && (
          <TouchableOpacity
            style={{
              height: verticalScale(70),
              width: '95%',
              backgroundColor: 'black',
              bottom: verticalScale(70),
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              borderRadius: 20,
              alignSelf: 'center',
            }}
            onPress={() => {
              registerSale(
                client,
                {
                  prod: prod,
                  price: price,
                  flavor: flavor,
                  qty: qty,
                },
                parseInt(price) * qty,
                acc
              );
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
    </SafeAreaView>
  );
}
