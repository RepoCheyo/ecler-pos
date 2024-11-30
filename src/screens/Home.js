import { ScrollView, Text, View, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import StatsCard from '../components/home/statsCard';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../utils/dimensions';
import { useNavigation } from '@react-navigation/native';
import { DbContext } from '../utils/dbContext';
import Holder from '../components/shared/main-cont';
import Card from '../components/shared/card';
import { scale } from 'react-native-size-matters';
import typography from '../styles/typography';

export default function Home() {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProds, setTotalProds] = useState(0);
  const [totalProdsSales, setTotalProdsSales] = useState(0);

  const getTotalSales = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT SUM(amount) AS totalSales FROM sales',
        null,
        (queryRes, resSet) => {
          setTotalSales(resSet.rows._array[0].totalSales);
        }
      );
    });
  };

  const getTotalExpenses = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT SUM(amount) AS totalExpenses FROM expenses',
        null,
        (queryRes, resSet) => {
          setTotalExpenses(resSet.rows._array[0].totalExpenses);
        }
      );
    });
  };

  const getTotalProds = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM stock', null, (queryRes, resSet) => {
        let prodArr = resSet.rows._array;
        setTotalProds(prodArr.length);
      });
    });
  };

  const getTotalProdsSales = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM sales', null, (queryRes, resSet) => {
        let prodArr = resSet.rows._array;
        setTotalProdsSales(prodArr.length);
      });
    });
  };

  const matrixFunc = () => {
    getTotalSales();
    getTotalExpenses();
    getTotalProds();
    getTotalProdsSales();
  };

  useEffect(() => {
    matrixFunc();
  }, []);

  return (
    <ScrollView
      style={{ height: '100%' }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={matrixFunc} />
      }
    >
      <Holder>
        {totalSales > 0 ? (
          <>
            <Text
              style={{
                fontSize: moderateScale(50),
                fontWeight: typography.fontWeight.black,
              }}
            >
              Inicio
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: '50%',
              }}
            >
              <View
                style={{
                  flex: 1,
                  padding: scale(3),
                }}
              >
                <Card
                  title="Ganancias totales"
                  text={'$' + totalSales}
                  onPress={() =>
                    navigation.navigate('Root', {
                      screen: 'Historial',
                      params: { screen: 'Ventas' },
                    })
                  }
                />
              </View>
              <View
                style={{
                  flex: 1,
                  padding: scale(3),
                }}
              >
                <Card
                  title={'Gastos totales'}
                  icon={'dollar'}
                  text={'$' + totalExpenses}
                  onPress={() =>
                    navigation.navigate('Root', {
                      screen: 'Historial',
                      params: { screen: 'Gastos' },
                    })
                  }
                />
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: '50%',
              }}
            >
              <View
                style={{
                  flex: 1,
                  padding: scale(3),
                }}
              >
                <Card
                  title={'Productos en stock'}
                  text={totalProds}
                  onPress={() => navigation.navigate('Almacen')}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  padding: scale(3),
                }}
              >
                <Card
                  title={'Ventas totales'}
                  text={totalProdsSales}
                  onPress={() => navigation.navigate('Almacen')}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <Text
              style={{
                fontSize: moderateScale(14),
                color: 'gray',
                top: verticalScale(40),
                textAlign: 'center',
              }}
            >
              Una vez registrando datos, tus estadísticas apareceran aqui ;)
            </Text>
          </>
        )}
      </Holder>
    </ScrollView>
  );
}
