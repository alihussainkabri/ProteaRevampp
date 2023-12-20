import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign } from 'react-native-vector-icons'
import Home from '../screens/Home';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}


export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: '#3a7bd5',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: { marginLeft: -24 }
            }}
        >

            <Drawer.Screen name="Home" component={HomeStack}
                options={{
                    drawerIcon: ({ color }) => (
                        // <Entypo name="home" size={24} color={color} />
                        <AntDesign name="home" size={24} color={color} />
                    )
                }}
            />
        </Drawer.Navigator>
    );
}