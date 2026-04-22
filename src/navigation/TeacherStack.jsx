import { createStackNavigator } from "@react-navigation/stack";
import TeacherDashboard from "../screens/home/TeacherDashboard";
import AssignedSubjects from "../screens/teacher/AssignedSubjects";
import LeaveRequests from "../screens/teacher/LeaveRequests";
import TeacherProfile from "../screens/home/TeacherProfile";
import TeacherAssignments from "../screens/teacher/TeacherAssignments";
import TeacherGenerateQR from "../screens/teacher/TeacherGenerateQR";

const Stack = createStackNavigator();
const TeacherStack = ({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherDashboard">
        {(props) => <TeacherDashboard {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="AssignedSubjects" component={AssignedSubjects} />
      <Stack.Screen name="LeaveRequests" component={LeaveRequests} />
      <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
      <Stack.Screen name="TeacherAssignments" component={TeacherAssignments} />
      <Stack.Screen name="TeacherGenerateQR" component={TeacherGenerateQR} />
    </Stack.Navigator>
  );
};

export default TeacherStack;
