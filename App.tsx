import React,{useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View,AppRegistry} from 'react-native';
import {Styles} from './assets/Styles/Styles';
import Routes from './Routes/Index';
import AuthThemeProvider from './assets/Styles/ThemeContext';
import AuthLoginProvider from './assets/Contexts/AuthLogin';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
    return (
      <NavigationContainer independent={true}>
        <AuthThemeProvider>
          <AuthLoginProvider>
              <Routes/>
          </AuthLoginProvider>
        </AuthThemeProvider>
      </NavigationContainer>
    );
}
