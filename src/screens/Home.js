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

export default function Home() {
  const { db } = useContext(DbContext);

  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProds, setTotalProds] = useState(0);

  const [sls, setSls] = useState([]);
  const [custs, setCusts] = useState([]);
  const [prodSales, setProdSales] = useState([]);

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

  const getSalesByMonth = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT amount AS value, cust_name AS name FROM sales ORDER BY date DESC LIMIT 6',
        null,
        (queryRes, resSet) => {
          let prodArr = resSet.rows._array;
          setSls(prodArr);
        }
      );
    });
  };

  const getClientSales = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT cust_name AS label, count(*) AS value FROM  sales GROUP  BY cust_name ORDER  BY value DESC',
        null,
        (queryRes, resSet) => {
          let qry = resSet.rows._array;
          setCusts(qry);
        }
      );
    });
  };

  const getSalesByProd = () => {
    const arrByProdSale = [];
    const result = [];

    db.transaction((tx) => {
      tx.executeSql('SELECT sale_det FROM sales', null, (queryRes, resSet) => {
        let qry = resSet.rows._array;

        qry.forEach((item) => {
          let formatted = JSON.parse(item.sale_det);

          arrByProdSale.push(formatted.prod);
        });

        const countMap = arrByProdSale.reduce((acc, label) => {
          acc[label] = (acc[label] || 0) + 1;
          return acc;
        }, {});

        for (const [label, value] of Object.entries(countMap)) {
          result.push({ value, label });
        }

        setCusts(result);
      });
    });
  };

  const matrixFunc = () => {
    getTotalSales();
    getTotalExpenses();
    getTotalProds();
    getSalesByMonth();
    getClientSales();
    getSalesByProd();
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
      {totalSales > 0 ? (
        <>
          <View style={{ marginTop: verticalScale(60) }}>
            <View
              style={{
                width: '95%',
                height: verticalScale(80),
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <StatsCard
                title={'Ventas totales'}
                text={'$' + totalSales}
                cardWidth={'100%'}
                textColor={'#03C03C'}
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
                width: '100%',
                height: verticalScale(100),
                alignItems: 'center',
                top: verticalScale(10),
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <StatsCard
                title={'Gastos totales'}
                text={'$' + totalExpenses}
                textColor={'red'}
                cardWidth={'45%'}
                onPress={() =>
                  navigation.navigate('Root', {
                    screen: 'Historial',
                    params: { screen: 'Gastos' },
                  })
                }
              />
              <StatsCard
                title={'Productos en stock'}
                text={totalProds}
                textColor={'gray'}
                cardWidth={'45%'}
                onPress={() => navigation.navigate('Almacen')}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: moderateScale(26),
              marginLeft: horizontalScale(15),
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(22),
                fontWeight: 800,
                padding: moderateScale(8),
              }}
            >
              Estadísticas
            </Text>

            <View
              style={{
                marginTop: verticalScale(10),
                backgroundColor: 'white',
                padding: moderateScale(15),
                borderRadius: moderateScale(30),
                marginBottom: verticalScale(20),
                width: '96%',
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(20),
                  fontWeight: 800,
                  textAlign: 'center',
                  marginBottom: verticalScale(20),
                }}
              >
                Ventas recientes por cliente
              </Text>
              <LineChart
                areaChart
                isAnimated
                curved
                data={sls}
                hideRules
                startFillColor="rgb(46, 217, 255)"
                startOpacity={0.8}
                endFillColor="rgb(203, 241, 250)"
                color="darkblue"
                dataPointsColor="darkblue"
                endOpacity={0.3}
                pointerConfig={{
                  pointerColor: 'black',
                  pointerLabelComponent: (items) => {
                    return (
                      <View
                        style={{
                          height: verticalScale(50),
                          width: horizontalScale(70),
                          backgroundColor: 'black',
                          borderRadius: moderateScale(100),
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}
                      >
                        <Text
                          style={{
                            color: 'lightgray',
                            fontSize: moderateScale(12),
                            textAlign: 'center',
                          }}
                        >
                          {items[0].name}
                        </Text>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: moderateScale(10),
                          }}
                        >
                          ${items[0].value}
                        </Text>
                      </View>
                    );
                  },
                }}
              />
            </View>

            <View
              style={{
                marginTop: verticalScale(5),
                backgroundColor: 'white',
                padding: moderateScale(15),
                borderRadius: moderateScale(30),
                width: '96%',
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(20),
                  fontWeight: 800,
                  textAlign: 'center',
                  padding: moderateScale(10),
                }}
              >
                Ventas por producto
              </Text>
              <View
                style={{
                  marginTop: verticalScale(-15),
                }}
              >
                <BarChart
                  barWidth={moderateScale(18)}
                  barBorderRadius={4}
                  frontColor="pink"
                  data={custs}
                  rotateLabel
                  yAxisThickness={0}
                  xAxisThickness={0}
                  isAnimated
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <View
          style={{
            alignItems: 'center',
            top: verticalScale(50),
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
            Una vez registrando datos, tus estadísticas apareceran aqui ;)
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
