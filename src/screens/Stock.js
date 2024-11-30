import { Alert, FlatList, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import ProductItem from '../components/stock/ProductItem';
import AddButton from '../components/history/addActButton';
import { verticalScale, moderateScale } from '../utils/dimensions';
import { DbContext } from '../utils/dbContext';
import { initFuncs } from '../db/initFuncs';
import { useNavigation } from '@react-navigation/native';
import Holder from '../components/shared/main-cont';

export default function Stock() {
  const navigation = useNavigation();

  const [stock, setStock] = useState([]);

  const { db } = useContext(DbContext);

  const getStock = () => {
    db.transaction((tx) => {
      tx.executeSql(initFuncs.stockInit);
      tx.executeSql(initFuncs.flavorsInit);
      tx.executeSql(
        'SELECT stock.prod_id, stock.name, stock.option, stock.price, flavors.flavor_id, flavors.qty, flavors.name AS flavor_name FROM stock LEFT JOIN flavors ON stock.prod_id = flavors.prod_id;',
        null,
        (queryRes, resSet) => {
          const products = [];
          resSet.rows._array.forEach((row) => {
            // Find if the product already exists in the array
            let product = products.find((p) => p.prod_id === row.prod_id);

            // If the product doesn't exist, create a new product entry
            if (!product) {
              product = {
                prod_id: row.prod_id,
                name: row.name,
                price: row.price,
                option: row.option,
                flavors: [],
              };
              products.push(product);
            }

            // Add flavor details if they exist
            if (row.flavor_id) {
              product.flavors.push({
                flavor_id: row.flavor_id,
                name: row.flavor_name,
                qty: row.qty,
                price: row.flavor_price,
              });
            }
          });

          setStock(products); // Log the structured data
        }
      );
    });
  };

  useEffect(() => {
    getStock();
  }, [stock]);

  const dltProdDb = (id) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM stock WHERE prod_id=(?)', [id]);
      tx.executeSql('DELETE FROM flavors WHERE prod_id=(?)', [id]);
    });
  };

  const dltProd = (prod) => {
    Alert.alert(
      'Eliminar producto',
      `Esta seguro de eliminar ${prod.name} esto afectara a las ventas registradas con este producto y sabores`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => dltProdDb(prod.prod_id),
        },
      ]
    );
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
          <Holder>
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
                  flavors={item.flavors}
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
          </Holder>
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
