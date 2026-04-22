import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/home/Dashboard";
import AdminDashboard from "../screens/home/AdminDashboard";
const Stack = createStackNavigator();
const HomeStack = ({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard">
        {(props) => <Dashboard {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="AdminDashboard">
        {(props) => <AdminDashboard {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default HomeStack;
