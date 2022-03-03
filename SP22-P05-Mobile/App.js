import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen.js';
// import LoginScreen from './Screens/LoginScreen.js'

const Stack = createNativeStackNavigator();

function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="ICE - Store" component={HomeScreen}  options={{
          title: 'ICE - Store',
          headerStyle: {
            backgroundColor: 'rgb(33,37,41)',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;