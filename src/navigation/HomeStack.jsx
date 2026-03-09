import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/home/Dashboard";
const Stack = createStackNavigator();
const HomeStack = ({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard">
        {(props) => <Dashboard {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default HomeStack;
