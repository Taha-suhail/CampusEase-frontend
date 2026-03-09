import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import MainAppStack from "./src/navigation/MainAppStack";

export default function App() {
  return (
    <NavigationContainer>
      <MainAppStack />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
