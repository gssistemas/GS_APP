import React, {useContext, useEffect,useRef} from 'react';
import { View, Text, Animated,Platform, Alert} from 'react-native';
import ParallaxScrollView from '../../Components/ParallaxScrollView';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedView } from '../../Components/ThemedView';
import { Styles } from '../../../assets/Styles/Styles';
import { ThemedText } from '../../Components/ThemedText';
import { HelloWave } from '../../Components/HelloWave';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
//tabs
import Explorer from './Tabs/explore';
import HomeScreen from './Tabs';
import PraVoce from './Tabs/Pravoce';
import { AuthLogin } from '../../../assets/Contexts/AuthLogin';

const Tab = createMaterialBottomTabNavigator();

export default function Index() {
    try {
        return (
            <Tab.Navigator initialRouteName='homeScreen' activeColor='#000' inactiveColor='#999'>
                <Tab.Screen name='explorer' component={Explorer}
                    options={{
                        tabBarLabel: 'Sou parceiro',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="apps" color={color} size={26} />
                        ),
                        tabBarBadge:undefined,
                    }}
                />
                <Tab.Screen name='homeScreen' component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                        tabBarBadge:undefined,
                    }}
                />
                <Tab.Screen name='praVoce' component={PraVoce}
                    options={{
                        tabBarLabel: 'Pra você',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="store" color={color} size={26} />
                        ),
                        tabBarBadge:undefined,
                    }}
                />
            </Tab.Navigator>
        );
    } catch (error:any) {
        Alert.alert('Erro',error.message);
    }
    
}