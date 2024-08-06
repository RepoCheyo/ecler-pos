import { Alert, FlatList, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import ProductItem from '../components/stock/ProductItem';
import AddButton from '../components/history/addActButton';
import { verticalScale, moderateScale } from '../utils/dimensions';
import { DbContext } from '../utils/dbContext';
import { initFuncs } from '../db/initFuncs';
import { useNavigation } from '@react-navigation/native';

export default function Stock() {
  const navigation = useNavigation();

  const [stock, setStock] = useState([]);

  const { db } = useContext(DbContext);

  const getStock = () => {
    db.transaction((tx) => {
      tx.executeSql(initFuncs.stockInit);
      tx.executeSql('SELECT * FROM stock', null, (queryRes, resSet) =>
        setStock(resSet.rows._array)
      );
    });
  };

  useEffect(() => {
    getStock();
  }, [stock]);

  const dltProdDb = (id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM stock WHERE prod_id=(?)', [id]);
    });
  };

  const dltProd = (prod) => {
    Alert.alert('Eliminar producto', 'Esta seguro de eliminar ' + prod.name, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        onPress: () => dltProdDb(prod.prod_id),
      },
    ]);
  };

  return (
    <>
      <ScrollView
        style={{
          height: '100%',
        }}
        showsVerticalScrollIndicator={false}
      >
        {stock.length > 0 ? (
          <FlatList
            data={stock}
            contentContainerStyle={{ paddingBottom: verticalScale(90) }}
            renderItem={({ item }) => (
              <ProductItem
                key={item.prod_id}
                id={item.prod_id}
                name={item.name}
                price={item.price}
                size={item.option}
                flavors={JSON.parse(item.flavors)}
                onPressEdit={() =>
                  navigation.navigate('EditProduct', {
                    params: { prod_id: item.prod_id },
                  })
                }
                onPressDlt={() => dltProd(item)}
              />
            )}
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
                fontSize: moderateScale(15),
                color: 'gray',
                top: verticalScale(90),
              }}
            >
              No tienes productos registrados
            </Text>
          </View>
        )}
      </ScrollView>
      <AddButton btnColor={'#e74c0b'} screenToNav={'AddProduct'} />
    </>
  );
}
