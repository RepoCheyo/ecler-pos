import { View, Text, FlatList, SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ListItem from '../components/history/ListItem';
import AddButton from '../components/history/addActButton';
import { verticalScale, moderateScale } from '../utils/dimensions';
import { initFuncs } from '../db/initFuncs';
import { DbContext } from '../utils/dbContext';
import { useNavigation } from '@react-navigation/native';

export default function Sales() {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [query, setQuery] = useState('');
  const [sales, setSales] = useState([]);

  const getSales = () => {
    db.transaction((tx) => {
      tx.executeSql(initFuncs.saleInit);
      tx.executeSql('SELECT * FROM sales', null, (queryRes, resSet) =>
        setSales(resSet.rows._array)
      );
    });
  };

  useEffect(() => {
    getSales();
  }, [sales]);

  return (
    <SafeAreaView
      style={{
        height: '100%',
      }}
    >
      {sales.length > 0 ? (
        <FlatList
          data={sales}
          key={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              key={item.sale_id}
              id={item.sale_id}
              title={item.cust_name}
              amount={item.amount}
              date={item.date}
              amountColor={'#00D64F'}
              onPress={() =>
                navigation.navigate('SaleDetail', {
                  params: { sale_id: item.sale_id },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id}
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
            No has registrado ventas
          </Text>
        </View>
      )}
      <AddButton btnColor={'#007f5f'} screenToNav={'AddSale'} />
    </SafeAreaView>
  );
}
