import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToDoList from './src/screens/ToDoList';

const  Stack = createNativeStackNavigator();

function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='TodoList' component={ToDoList}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;