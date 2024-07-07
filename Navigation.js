import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Home from "./screens/Home";
import Search from "./screens/Search";
import Account from "./screens/Account";
import SignIn from "./screens/sign/SignIn";
import SignUp from "./screens/sign/SignUp";
import SignScreen from "./screens/SignScreen";
import PostDetail from "./screens/PostDetail"
export const SignedInStack= ()=> {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PostDetail" component={PostDetail} />

    </Stack.Navigator>
  );

  const SearchStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );

  const AccountStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={Account}
        
      />
      <Stack.Screen name="PostDetail" component={PostDetail} />

    </Stack.Navigator>
  );
 
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Account" component={AccountStack} options={{ headerShown: false }} />
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Search" component={SearchStack} options={{ headerShown: false }} />
      </Tab.Navigator>
      <Stack.Screen name="PostDetail" component={PostDetail} />

    </NavigationContainer>
  );
}

export const SignedOutStack = () =>{
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const AccountStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Sign"
        component={SignScreen}
      />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Account" component={AccountStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

}
