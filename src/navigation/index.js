import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  Home,
  Stock,
  More,
  Expenses,
  Sales,
  AddSale,
  AddExpense,
  Clients,
  Accounts,
  AddProduct,
  EditProduct,
  SaleDetail,
  ExpenseDetail,
} from '../screens/index';
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { verticalScale } from '../utils/dimensions';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const HistoryNav = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          top: '0%',
          paddingTop: verticalScale(40),
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          textTransform: 'capitalize',
          fontSize: 15,
        },
      }}
    >
      <TopTab.Screen name="Ventas" component={Sales} />
      <TopTab.Screen name="Gastos" component={Expenses} />
    </TopTab.Navigator>
  );
};

const BottomNav = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e36414',
        headerShown: false,
        tabBarPosition: 'left',
      }}
    >
      <BottomTab.Screen
        name="Inicio"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={26} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Historial"
        component={HistoryNav}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={28} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Almacen"
        component={Stock}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="fridge-industrial-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="Más"
        component={More}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="more-horiz" size={26} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={BottomNav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Accounts"
          component={Accounts}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="Clients"
          component={Clients}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProduct}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="AddSale"
          component={AddSale}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="SaleDetail"
          component={SaleDetail}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpense}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="ExpenseDetail"
          component={ExpenseDetail}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
