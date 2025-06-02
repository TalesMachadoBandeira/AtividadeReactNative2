import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddBirdScreen from '../screens/AddBirdScreen';
import EditBirdScreen from '../screens/EditBirdScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'BirdWatcher' }}
      />
      <Stack.Screen 
        name="AddBird" 
        component={AddBirdScreen} 
        options={{ title: 'Registrar Pássaro' }}
      />
      <Stack.Screen 
        name="EditBird" 
        component={EditBirdScreen} 
        options={{ title: 'Editar Pássaro' }}
      />
    </Stack.Navigator>
  );
} 