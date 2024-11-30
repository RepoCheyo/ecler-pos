import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/dimensions';
import uuid from 'react-native-uuid';
import { DbContext } from '../utils/dbContext';
import { FontAwesome5, Entypo, Fontisto } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Holder from '../components/shared/main-cont';
import typography from '../styles/typography';
import { scale } from 'react-native-size-matters';
import colors from '../styles/colors';
import { ScrollView } from 'react-native';
import useCartStore from '../state/saleStore';

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

  const addProduct = useCartStore((state) => state.addProduct);

  const cart = useCartStore((state) => state.cart);
  const total = useCartStore((state) => state.total);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);

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
    setProd(prod);
    setPrice(prod.price);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM flavors WHERE prod_id=?',
        [prod.prod_id],
        (queryRes, resSet) => setFlavors(resSet.rows._array)
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

  const registerSale = (cust_name, sale_det, account) => {
    console.log(account);

    const saleId = uuid.v4();

    const saleDetString = JSON.stringify(sale_det);

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO sales (sale_id, cust_name, sale_det, amount, account) VALUES (?, ?, ?, ?, ?)',
        [saleId, cust_name, saleDetString, total, account]
      );
    });

    const newBal = accAm + total;

    db.transaction((tx) => {
      tx.executeSql('UPDATE accounts SET amount=? WHERE name=?', [newBal, acc]);
    });

    sale_det.forEach((element) => {
      const flavInfo = element.flavor;

      // Start a single transaction for the operation
      db.transaction((tx) => {
        // Fetch the current quantity of the flavor
        tx.executeSql(
          'SELECT qty FROM flavors WHERE flavor_id = ?',
          [flavInfo.flavor_id],
          (tx, queryRes) => {
            if (queryRes.rows.length > 0) {
              const currentQty = queryRes.rows.item(0).qty;

              // Calculate the new quantity
              const newQty = currentQty - 1;

              // Update the quantity in the database
              tx.executeSql(
                'UPDATE flavors SET qty = ? WHERE flavor_id = ?',
                [newQty, flavInfo.flavor_id],
                (tx, updateRes) => {
                  console.log(
                    `Flavor ID ${flavInfo.flavor_id} updated successfully to ${newQty}`
                  );
                },
                (tx, error) => {
                  console.error('Error updating flavor:', error.message);
                }
              );
            } else {
              console.warn(`Flavor ID ${flavInfo.flavor_id} not found`);
            }
          },
          (tx, error) => {
            console.error('Error fetching flavor:', error.message);
          }
        );
      });
    });

    clearCart();

    navigation.navigate('Historial');
  };

  const selectFlavor = (flavor) => {
    addProduct(prod, flavor);
  };

  useEffect(() => {
    getClients();
    getProducts();
    getAcc();
  }, []);

  const renderItem = ({ item, index }) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      }}
    >
      <View style={{ flex: 2 }}>
        <Text
          style={{
            fontSize: scale(12),
            fontWeight: 'bold',
            color: colors.light,
          }}
        >
          {item.name} {item.option}
        </Text>
        <Text style={{ fontSize: scale(10), color: colors.light }}>
          Sabor: {item.flavor.name}
        </Text>
        <Text
          style={{ fontSize: scale(10), color: colors.success, marginTop: 4 }}
        >
          ${item.price}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: '#f88',
            borderRadius: 4,
            padding: 8,
            marginLeft: 8,
          }}
          onPress={() => {
            removeProduct(index, parseInt(item.price));
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <View>
          <Holder>
            <View>
              <Text
                style={{
                  fontSize: moderateScale(40),
                  fontWeight: typography.fontWeight.black,
                }}
              >
                Registrar venta
              </Text>
            </View>

            <View
              style={{
                top: verticalScale(20),
                padding: moderateScale(10),
                height: '100%',
              }}
            >
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
              >
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
                        top: verticalScale(3),
                        width: '100%',
                      }}
                    >
                      <FlatList
                        horizontal
                        data={clients}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={{
                              backgroundColor:
                                item.name === client ? '#FF0800' : 'lightgray',
                              padding: moderateScale(5),
                              margin: moderateScale(5),
                              borderRadius: moderateScale(10),
                              alignItems: 'center',
                              overflow: 'hidden',
                              width: horizontalScale(100),
                            }}
                            onPress={() => {
                              setClient(item.name);
                            }}
                            key={item.name}
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
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
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
                                item.name === prod.name
                                  ? '#FF3800'
                                  : 'lightgray',
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
                        top: verticalScale(50),
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <Entypo
                        name="bowl"
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
                        Sabor
                      </Text>
                    </View>

                    <View
                      style={{
                        top: verticalScale(60),
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
                                backgroundColor: 'lightgray',
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
                                  color:
                                    item.name === flavor ? 'white' : 'black',
                                  // fontWeight: 500,
                                }}
                              >
                                {item.name}
                              </Text>
                              <Text
                                style={{
                                  fontSize: moderateScale(12),
                                  fontWeight: 500,
                                  color:
                                    item.name === flavor ? 'white' : 'black',
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
                        paddingBottom: scale(50),
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
                      Añade cuentas, clientes y productos antes de registrar una
                      venta
                    </Text>
                  </View>
                )}
              </TouchableWithoutFeedback>
            </View>
          </Holder>
        </View>
        {accs.length > 0 && clients.length > 0 && cart.length > 0 && (
          <View
            style={{
              backgroundColor: '#00A86B',
              flexDirection: 'row',
              display: 'flex',
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: 0,
              width: '100%',
              padding: scale(5),
            }}
          >
            <Text
              style={{
                fontSize: scale(18),
                fontWeight: '800',
                color: 'white',
                textAlign: 'left',
              }}
            >
              {' '}
              Total
            </Text>
            <Text
              style={{
                fontSize: scale(18),
                fontWeight: '800',
                color: 'white',
                textAlign: 'right',
              }}
            >
              {' '}
              ${total.toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          flex: 0.5,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
        }}
      >
        <Text
          style={{
            fontSize: scale(18),
            fontWeight: typography.fontWeight.bold,
            color: 'white',
            borderRadius: 10,
            padding: scale(3),
          }}
        >
          Resumen
        </Text>

        <View
          style={{
            height: '75%',
          }}
        >
          <ScrollView
            style={{
              flex: 1,
            }}
          >
            {cart.length === 0 ? (
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: colors.light,
                  marginTop: 50,
                }}
              >
                Agrega productos
              </Text>
            ) : (
              <>
                <FlatList
                  data={cart}
                  renderItem={renderItem}
                  keyExtractor={(item) => `${item.id}-${item.flavor}`}
                />
              </>
            )}
          </ScrollView>
        </View>
        {client !== '' &&
          acc &&
          accs.length > 0 &&
          clients.length > 0 &&
          cart.length > 0 && (
            <View
              style={{
                padding: scale(3),
              }}
            >
              <TouchableOpacity
                style={{
                  height: scale(30),
                  width: '95%',
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  alignSelf: 'center',
                }}
                onPress={() => {
                  registerSale(client, cart, acc);
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
            </View>
          )}
      </View>
    </View>
  );
}
