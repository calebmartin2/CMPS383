import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen.js';
import ProductInfo from './Screens/ProductInfo.js';
import LoginScreen from './Screens/LoginScreen.js';
import SignUpScreen from './Screens/SignUpScreen.js';
import { AuthCookieProvider } from './Authorization/AuthCookieProvider.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();


const Stack = createNativeStackNavigator();

function Root() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Account') {
          iconName = focused
            ? 'ios-person-circle'
            : 'ios-person-circle';
        } else if (route.name === 'Store') {
          iconName = focused ? 'ios-apps' : 'ios-apps';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'gray',
      tabBarInactiveBackgroundColor: 'rgb(33,37,41)',
      tabBarActiveBackgroundColor: 'rgb(33,37,41)'
    })}>
      <Tab.Screen name="Store" component={HomeScreen} options={{
        title: 'ICE - Store',
        headerStyle: {
          backgroundColor: 'rgb(33,37,41)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Tab.Screen name="Account" component={LoginScreen} options={{
        title: 'Account',
        headerStyle: {
          backgroundColor: 'rgb(33,37,41)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}/>
    </Tab.Navigator>
  )
}


function App() {

  return (
    <AuthCookieProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Root"
            component={Root}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ICE - Store" component={HomeScreen} 
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{
        title: 'Sign Up',
        headerStyle: {
          backgroundColor: 'rgb(33,37,41)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}/>
          <Stack.Screen name="ProductInfo" component={ProductInfo} options={({ route }) => ({
            title: route.params.product.name, headerStyle: {
              backgroundColor: 'rgb(33,37,41)',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthCookieProvider>
  );
}

export default App;