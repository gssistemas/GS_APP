import { Image, StyleSheet, Platform,View,Text,Alert} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useLinkBuilder} from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HelloWave } from '../../Components/HelloWave';
import ParallaxScrollView from '../../Components/ParallaxScrollView';
import { ThemedText } from '../../Components/ThemedText';
import { ThemedView } from '../../Components/ThemedView';
import LoginComponent from '../../Components/ComponentLogin';
import MinhasOs from './TabsOs/MinhasOs';
import OsDisponiveis from './TabsOs/OsDisponiveis';
import OsOffline from './TabsOs/OsOffline';
import * as Notifications from 'expo-notifications';
import { useContext,useRef, useEffect, useState } from 'react';
import { AuthLogin } from '../../../assets/Contexts/AuthLogin';
import Constants from 'expo-constants';
import {useNavigation} from '@react-navigation/native';
import Config from '../../../assets/Config/Config.json';
import axios from 'axios';
import { useTheme } from '../../../assets/Styles/ThemeContext';

const Tab = createMaterialTopTabNavigator();

export default function HomeOs() {
    const {theme} = useTheme()
    const navigation = useNavigation();
    const {usuario,listMinhasOs,httpAlimentacao,listOsDisponiveis,listOsOffline,buscarEmpresas,setTokenNotification,buscarNotificacoes} = useContext<any>(AuthLogin);
    const [countMos,setMos] = useState<number | undefined>(0);
    const [countOd,setCountOd] = useState<number | undefined>(0);
    const [countOo,setCountOo] = useState<number | undefined>(0);

    try {
        return(
            <Tab.Navigator>
                <Tab.Screen
                    name='Minhas o.s.'
                    component={MinhasOs}
                    options={{
                        tabBarBadge:()=>{
                            return(
                                <View style={[{backgroundColor:listMinhasOs !== null && listMinhasOs.length > 0 ? 'green':'red',borderRadius:50,borderBottomLeftRadius:0,marginTop:6,marginRight:8,paddingHorizontal:5,alignItems:'center',justifyContent:'center'}]}>
                                    <Text style={{color:'#FFFFFF'}}>{listMinhasOs !== null || listMinhasOs ? listMinhasOs.length : 0}</Text>
                                </View>
                            )
                        },
                        tabBarScrollEnabled:false,
                        tabBarIndicatorStyle:{backgroundColor:listMinhasOs !== null && listMinhasOs.length > 0 ? 'green' : 'red',height:3,borderBottomLeftRadius:3,borderBottomRightRadius:3},
                        tabBarActiveTintColor:theme.labels.text,
                        tabBarStyle:{backgroundColor:theme.backgroundColor.background}
                    }}
                />
                <Tab.Screen
                    name='O.s. offline'
                    component={OsOffline}
                    options={{
                        tabBarBadge:()=>{
                            return(
                                <View style={[{backgroundColor:listOsOffline !== null && listOsOffline.length > 0 ? 'green' : 'red',borderRadius:50,borderBottomLeftRadius:0,marginTop:6,marginRight:8,paddingHorizontal:5,alignItems:'center',justifyContent:'center'}]}>
                                    <Text style={{color:'#FFFFFF'}}>{listOsOffline !== null || listOsOffline ? listOsOffline.length : 0}</Text>
                                </View>
                            )
                        },
                        tabBarScrollEnabled:false,
                        tabBarIndicatorStyle:{backgroundColor:listOsOffline !== null && listOsOffline.length > 0 ? 'green' : 'red',height:3,borderBottomLeftRadius:3,borderBottomRightRadius:3},
                        tabBarActiveTintColor:theme.labels.text,
                        tabBarStyle:{backgroundColor:theme.backgroundColor.background}
                    }}
                />
                <Tab.Screen
                    name='O.s. disp.'
                    component={OsDisponiveis}
                    options={{
                        tabBarBadge:()=>{
                            return(
                                <View style={[{backgroundColor:countOo === 0 ? 'red':'blue',borderRadius:50,borderBottomLeftRadius:0,marginTop:6,marginRight:8,paddingHorizontal:5,alignItems:'center',justifyContent:'center'}]}>
                                    <Text style={{color:'#FFFFFF'}}>{listOsDisponiveis !== null || listOsDisponiveis ? listOsDisponiveis.length : 0}</Text>
                                </View>
                            )
                        },
                        tabBarScrollEnabled:false,
                        tabBarIndicatorStyle:{backgroundColor:listOsDisponiveis !== null && listOsDisponiveis.length > 0 ? 'green' : 'red',height:3,borderBottomLeftRadius:3,borderBottomRightRadius:3},
                        tabBarActiveTintColor:theme.labels.text,
                        tabBarStyle:{backgroundColor:theme.backgroundColor.background}
                    }}
                />
            </Tab.Navigator>
        )
    } catch (error:any) {
        Alert.alert('Erro',error.message);
    }
    
}