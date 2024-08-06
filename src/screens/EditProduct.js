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
import SaveBtn from '../components/history/SaveBtn';

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
            flavor.push(JSON.parse(prod.flavors));
            setFlavor(flavor[0]);
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

    flavor.push({
      id: flavor.length + 1,
      name: flavName,
      qty: qty,
    });
  };

  const updateProd = (name, size, price, flavor) => {
    let flavorsString = JSON.stringify(flavor);

    try {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE stock SET name=?, option=?, price=?, flavors=? WHERE prod_id=?',
          [name, size, price, flavorsString, prod_id]
        );
      });

      navigation.navigate('Almacen');
    } catch (error) {
      console.log(error);
    }
  };

  // const isFormValid = useMemo(() => {
  //   return flavName.length > 0 && flavQty.length > 0;
  // }, [flavName, flavQty]);

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
              key={item.id}
              onPress={() => {
                setFlaName(item.name), setFlaQty(item.qty);
              }}
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
