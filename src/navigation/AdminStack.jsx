import { createStackNavigator } from "@react-navigation/stack";
import AdminDashboard from "../screens/home/AdminDashboard";
import AddStudent from "../screens/admin/AddStudent";
import AddTeacher from "../screens/admin/AddTeacher";
import BulkAddUsers from "../screens/admin/BulkAddUsers";
import CreateSubject from "../screens/admin/CreateSubject";
import AssignSubjectToTeacher from "../screens/admin/AssignSubjectToTeacher";
import StudentsList from "../screens/admin/StudentsList";
import TeachersList from "../screens/admin/TeachersList";
import SubjectsList from "../screens/admin/SubjectsList";
import StudentDetail from "../screens/admin/StudentDetail";
import TeacherDetail from "../screens/admin/TeacherDetail";

const Stack = createStackNavigator();

const AdminStack = ({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard">
        {(props) => <AdminDashboard {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="AddStudent" component={AddStudent} />
      <Stack.Screen name="AddTeacher" component={AddTeacher} />
      <Stack.Screen name="BulkAddUsers" component={BulkAddUsers} />
      <Stack.Screen name="CreateSubject" component={CreateSubject} />
      <Stack.Screen
        name="AssignSubjectToTeacher"
        component={AssignSubjectToTeacher}
      />
      <Stack.Screen name="StudentsList" component={StudentsList} />
      <Stack.Screen name="TeachersList" component={TeachersList} />
      <Stack.Screen name="SubjectsList" component={SubjectsList} />
      <Stack.Screen name="StudentDetail" component={StudentDetail} />
      <Stack.Screen name="TeacherDetail" component={TeacherDetail} />
    </Stack.Navigator>
  );
};

export default AdminStack;
