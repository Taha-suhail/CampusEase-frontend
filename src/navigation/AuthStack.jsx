import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../screens/auth/Welcome";
import EnterEmail from "../screens/auth/signup/EnterEmail";
import VerifyDetails from "../screens/auth/signup/VerifyDetails";
import VerifyEmail from "../screens/auth/signup/VerifyEmail";
import VerificationSuccess from "../screens/auth/signup/VerificationSuccess";
const Stack = createStackNavigator();
const AuthStack = ({ onSignupComplete }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="EnterEmail" component={EnterEmail} />
      <Stack.Screen name="VerifyDetails" component={VerifyDetails} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      <Stack.Screen name="VerificationSuccess">
        {(props) => (
          <VerificationSuccess
            {...props}
            onSignupComplete={onSignupComplete}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
