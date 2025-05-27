import { Animated, View, Text, TouchableOpacity, Alert} from 'react-native';
import { Styles } from '../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useContext, useEffect, useRef } from 'react';
import { useTheme } from '../../assets/Styles/ThemeContext';
import { AuthLogin } from '../../assets/Contexts/AuthLogin';

export default function Step_1({navigation}:any) {
    const { theme } = useTheme();
    const {isOffline,onlineOffline,getModalStyleLabelAlert} = useContext<any>(AuthLogin);

    const fadeAnimG = useRef(new Animated.Value(1)).current;
    const fadeAnimS = useRef(new Animated.Value(1)).current;
    const fadeAnimA = useRef(new Animated.Value(1)).current;
    const fadeAnimP1 = useRef(new Animated.Value(1)).current;
    const fadeAnimP2 = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const blinkAnimation = () => {
          Animated.sequence([
            Animated.timing(fadeAnimG, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimS, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimA, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimP1, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimP2, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimG, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimS, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimA, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimP1, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnimP2, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start(() => {
            blinkAnimation(); // Loop the animation
          });
        };
    
        blinkAnimation();
    }, [fadeAnimG, fadeAnimS, fadeAnimA, fadeAnimP1, fadeAnimP2]);
    try {
      return (
        <View style={[Styles.container,{backgroundColor:theme.backgroundColor.background,paddingHorizontal:2.5}]}>
            <View style={[Styles.w95,Styles.em_linhaHorizontal,{backgroundColor:theme.backgroundColor.background}]}>
                <Animated.Text style={{...Styles.title,opacity: fadeAnimG,color:theme.labels.text}}>G</Animated.Text>
                <Animated.Text style={{...Styles.title, opacity: fadeAnimS,color:theme.labels.text}}>S</Animated.Text>
                <Animated.Text style={[Styles.ft_extraBold,Styles.title]}>{' '}</Animated.Text>
                <Animated.Text style={{...Styles.title, opacity: fadeAnimA,color:theme.labels.text}}>A</Animated.Text>
                <Animated.Text style={{...Styles.title, opacity: fadeAnimP1,color:theme.labels.text}}>P</Animated.Text>
                <Animated.Text style={{...Styles.title, opacity: fadeAnimP2,color:theme.labels.text}}>P</Animated.Text>
            </View>
            <Text style={[Styles.title,{color:theme.labels.text}]}>Bem-vindo!</Text>
            {
              isOffline ===true ?
                <Text style={[Styles.subtitle,Styles.ft_medium,getModalStyleLabelAlert('danger'),{marginVertical:10}]}>{'Detectamos o modo OFFLINE ativo em seu aparelho, Por favor desative o moto offline para continuar.'}</Text>
              :
                <Text style={[Styles.subtitle,Styles.ft_medium,{color:theme.labels.text,marginVertical:10}]}>Clique em "começar" para configurarmos seu aplicativo...</Text>
            }
            
            {
              isOffline === true ?

              <TouchableOpacity onPress={()=>{
                onlineOffline('online');
              }} style={[Styles.w95,Styles.btn,Styles.em_linhaHorizontal,Styles.success,{}]}>
                <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblsuccess]}>Ficar online</Text>
                <MaterialCommunityIcons name='wifi-check' size={25} style={[Styles.lblsuccess,Styles.ml_5]}/> 
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={()=>{navigation.navigate('path configuracao')}} style={[Styles.w95,Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{}]}>
                <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblprimary]}>Começar</Text>
                <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.lblprimary,Styles.ml_5]}/> 
              </TouchableOpacity>
            }
        </View>
    );
    } catch (error:any) {
      Alert.alert('Erro',error.message);
    }
    
}