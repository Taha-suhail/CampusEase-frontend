import { createStackNavigator } from "@react-navigation/stack";
import StudentDashboard from "../screens/home/StudentDashboard";
import StudentProfile from "../screens/home/StudentProfile";
import ApplyLeave from "../screens/home/ApplyLeave";
import StudentAssignments from "../screens/home/StudentAssignments";
import StudentScanQR from "../screens/home/StudentScanQR";
import StudentAttendance from "../screens/home/StudentAttendance";
const Stack = createStackNavigator();
const StudentStack = ({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentDashboard">
        {(props) => <StudentDashboard {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="ApplyLeave" component={ApplyLeave} />
      <Stack.Screen name="StudentAssignments" component={StudentAssignments} />
      <Stack.Screen name="StudentScanQR" component={StudentScanQR} />
      <Stack.Screen name="StudentAttendance" component={StudentAttendance} />
    </Stack.Navigator>
  );
};

export default StudentStack;
