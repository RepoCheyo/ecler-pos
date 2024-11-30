import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import SaveBtn from '../components/history/SaveBtn';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/dimensions';
import { Entypo } from '@expo/vector-icons';
import { DbContext } from '../utils/dbContext';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

export default function AddProduct() {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [value, setValue] = useState('');

  const [flavor, setFlavor] = useState([]);
  const [flavName, setFlaName] = useState('');
  const [flavQty, setFlaQty] = useState('');

  const createFlavor = (flavName, qty) => {
    setFlaName('');
    setFlaQty('');

    flavor.push({
      id: flavor.length + 1,
      name: flavName,
      qty: qty,
    });
  };

  const saveProd = (name, size, price, flavor) => {
    let prodId = uuid.v4();

    try {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO stock(prod_id, name, option, price) values (?, ?, ?, ?)',
          [prodId, name, size, price]
        );
      });

      flavor.forEach((element) => {
        let flavId = uuid.v4();

        db.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO flavors(flavor_id, prod_id, name, qty) values (?, ?, ?, ?)',
            [flavId, prodId, element.name, element.qty]
          );
        });
      });

      navigation.navigate('Almacen');
    } catch (error) {
      console.log(error);
    }
  };

  const isFormValid = useMemo(() => {
    return name.length > 0 && size.length && value.length;
  }, [name, size, value]);

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
          Agregar producto
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
            placeholder="Nombre del producto"
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
            //   height: '100%',
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
            left: horizontalScale(3),
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
            onPress={() => createFlavor(flavName.trim(), flavQty.trim())}
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

        {flavor.map((item) => {
          return (
            <View
              style={{
                display: 'flex',
                top: verticalScale(30),
                marginBottom: verticalScale(15),
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'space-around',
                width: '100%',
              }}
              key={item.id}
            >
              <Text>{item.name}</Text>
              <Text>{item.qty}</Text>
              <TouchableOpacity
                onPress={() =>
                  setFlavor(flavor.filter((a) => a.id !== item.id))
                }
              >
                <Entypo name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          );
        })}

        <SaveBtn
          btnBg={isFormValid ? '#fb8500' : 'lightgray'}
          onPress={() =>
            saveProd(name.trim(), size.trim(), value.trim(), flavor)
          }
          disabled={!isFormValid}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
