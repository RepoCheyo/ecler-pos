import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DbContext } from '../utils/dbContext';
import { useNavigation } from '@react-navigation/native';
import { verticalScale, moderateScale } from '../utils/dimensions';
import { Entypo } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

import SaveBtn from '../components/history/SaveBtn';
import colors from '../styles/colors';

export default function EditProduct({ route }) {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const prod_id = route.params.params.prod_id;
  const [prod, setProd] = useState([]);

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [value, setValue] = useState('');

  const [flavor, setFlavor] = useState([]);
  const [flavName, setFlaName] = useState('');
  const [flavQty, setFlaQty] = useState('');

  const getProd = (prod_id) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM stock WHERE prod_id=?',
          [prod_id],
          (queryRes, resSet) => {
            const prod = resSet.rows._array[0];

            setName(prod.name);
            setSize(prod.option);
            setValue(prod.price);
            // flavor.push(JSON.parse(prod.flavors));
            // setFlavor(flavor[0]);
          }
        );
        tx.executeSql(
          'SELECT * FROM flavors WHERE prod_id=?',
          [prod_id],
          (queryRes, resSet) => {
            setFlavor(resSet.rows._array);
          }
        );
      });
    } catch (error) {
      Alert.alert(error);
    }
  };

  useEffect(() => {
    getProd(prod_id);
  }, []);

  const createFlavor = (flavName, qty) => {
    setFlaName('');
    setFlaQty('');

    let flavId = uuid.v4();

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO flavors(flavor_id, prod_id, name, qty) values (?, ?, ?, ?)',
        [flavId, prod_id, flavName, qty]
      );
    });
    navigation.navigate('Almacen');

    flavor.push({
      id: flavor.length + 1 || flavor.flavor_id,
      name: flavName,
      qty: qty,
    });
  };

  const dltProdDb = (id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM flavors WHERE flavor_id=(?)', [id]);
    });
    navigation.navigate('Almacen');
  };

  const dltFlav = (flav) => {
    Alert.alert(
      'Eliminar sabor',
      `Esta seguro de eliminar ${flav.name} esto afectara a las ventas registradas con este sabor`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => dltProdDb(flav.flavor_id),
        },
      ]
    );
  };

  const editFlavNameDb = (id, name) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE flavors SET name=? WHERE flavor_id=?', [name, id]);
    });
    navigation.navigate('Almacen');
  };

  const editFlavName = (flav) => {
    Alert.prompt(
      'Cambiar sabor',
      `Esta seguro de cambiar el nombre de ${flav.name}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: (name) => editFlavNameDb(flav.flavor_id, name.trim()),
        },
      ]
    );
  };

  const editFlavQtyDb = (id, qty) => {
    db.transaction((tx) => {
      tx.executeSql('UPDATE flavors SET qty=? WHERE flavor_id=?', [qty, id]);
    });
    navigation.navigate('Almacen');
  };

  const editFlavQty = (flav) => {
    Alert.prompt(
      'Cambiar sabor',
      `Esta seguro de cambiar el stock de ${flav.name}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: (qty) => editFlavQtyDb(flav.flavor_id, parseInt(qty)),
        },
      ]
    );
  };

  const updateProd = (name, size, price, flavor) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE stock SET name=?, option=?, price=? WHERE prod_id=?',
          [name, size, price, prod_id]
        );
      });

      navigation.navigate('Almacen');
    } catch (error) {
      console.log(error);
    }
  };

  const isFlavForm = useMemo(() => {
    return flavName.length > 0 && flavQty.length > 0;
  }, [flavName, flavQty]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={{
          height: '100%',
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '900',
            top: verticalScale(15),
            padding: '3%',
          }}
        >
          Editar producto
        </Text>

        <View
          style={{
            top: verticalScale(12),
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <TextInput
            onChangeText={setName}
            value={name}
            placeholder={name}
            placeholderTextColor="gray"
            automaticallyAdjustKeyboardInsets={true}
          />

          <TextInput onChangeText={setSize} value={size} placeholder="Tamaño" />

          <TextInput
            style={{
              zIndex: 1000,
              height: verticalScale(50),
            }}
            onChangeText={setValue}
            value={value}
            placeholder="Precio"
            keyboardType="numeric"
            automaticallyAdjustKeyboardInsets={true}
          />
        </View>

        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            top: verticalScale(35),
            padding: '3%',
          }}
        >
          Sabores
        </Text>

        <View
          style={{
            top: verticalScale(20),
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <TextInput
            style={{
              zIndex: 1000,
              height: verticalScale(50),
            }}
            onChangeText={setFlaName}
            value={flavName}
            placeholder="Nombre del sabor"
            automaticallyAdjustKeyboardInsets={true}
          />
          <TextInput
            style={{
              zIndex: 1000,

              height: verticalScale(50),
            }}
            onChangeText={setFlaQty}
            value={flavQty}
            placeholder="Cantidad sabor"
            keyboardType="numeric"
            automaticallyAdjustKeyboardInsets={true}
          />

          <TouchableOpacity
            style={{
              height: verticalScale(30),
              width: '20%',
              alignSelf: 'center',
              backgroundColor: isFlavForm ? '#81D8D0' : 'lightgray',
              right: verticalScale(10),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: moderateScale(20),
            }}
            onPress={() => createFlavor(flavName, flavQty)}
            disabled={!isFlavForm}
          >
            <Text
              style={{
                fontWeight: 700,
                fontSize: moderateScale(12),
                color: 'white',
              }}
            >
              Agregar
            </Text>
          </TouchableOpacity>
        </View>

        {flavor?.map((item) => {
          return (
            <TouchableOpacity
              style={{
                display: 'flex',
                top: verticalScale(30),
                marginBottom: verticalScale(15),
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'space-around',
                width: '100%',
              }}
              key={item.flavor_id}
              onPress={() => {
                setFlaName(item.name), setFlaQty(item.qty.toString());
              }}
            >
              <Text>{item.name}</Text>
              <Text>{item.qty}</Text>
              <TouchableOpacity onPress={() => editFlavName(item)}>
                <Text
                  style={{
                    fontWeight: 800,
                    color: colors.primary,
                  }}
                >
                  Editar nombre
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editFlavQty(item)}>
                <Text
                  style={{
                    fontWeight: 800,
                    color: colors.primary,
                  }}
                >
                  Editar stock
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dltFlav(item)}>
                <Entypo name="trash" size={24} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        <SaveBtn
          btnBg={'#fb8500'}
          onPress={() => updateProd(name, size, value, flavor)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
