import { View, Text, FlatList, SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ListItem from '../components/history/ListItem';
import AddButton from '../components/history/addActButton';
import { DbContext } from '../utils/dbContext';
import { initFuncs } from '../db/initFuncs';
import { moderateScale, verticalScale } from '../utils/dimensions';
import { useNavigation } from '@react-navigation/native';

export default function Expenses() {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [expenses, setExpenses] = useState([]);

  const getExpenses = () => {
    db.transaction((tx) => {
      tx.executeSql(initFuncs.expensesInit);
      tx.executeSql('SELECT * FROM expenses', null, (queryRes, resSet) =>
        setExpenses(resSet.rows._array)
      );
    });
  };

  useEffect(() => {
    getExpenses();
  }, [expenses]);

  return (
    <SafeAreaView
      style={{
        height: '100%',
      }}
    >
      {expenses.length > 0 ? (
        <FlatList
          data={expenses}
          renderItem={({ item }) => (
            <ListItem
              id={item.expense_id}
              title={item.title}
              amount={item.amount}
              date={item.date}
              amountColor={'red'}
              onPress={() =>
                navigation.navigate('ExpenseDetail', {
                  params: { expense_id: item.expense_id },
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
            No has registrado gastos
          </Text>
        </View>
      )}
      <AddButton btnColor={'#d00000'} screenToNav={'AddExpense'} />
    </SafeAreaView>
  );
}
