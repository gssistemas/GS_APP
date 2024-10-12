import React, { useContext,useState} from "react";
import {View,Text,StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator,Animated} from 'react-native';
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import ParallaxScrollView from "../Components/ParallaxScrollView";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { HelloWave } from "./HelloWave";
import { AuthLogin } from "../../assets/Contexts/AuthLogin";
import { Styles } from "../../assets/Styles/Styles";
import {useNavigation} from '@react-navigation/native';

export default function LoginComponent({route}:any){
    const navigation = useNavigation();
    const {fecharModal,apresentaModal,usuario,email,senha,setarProps,login,load,setLoad,salvarVariaveis,isConnectedNetwork,tokenNotification} = useContext<any>(AuthLogin);
    const [Em,setEm] = useState(email);
    const [pass,setPass] = useState(senha);
    const [blink, setBlink] = useState(false);
    const [animation] = useState(new Animated.Value(1));
    console.log(isConnectedNetwork,route)

    const blinkView = () => {
        setBlink(true);
        Animated.loop(
          Animated.sequence([
            Animated.timing(animation, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animation, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
        ).start();
    
        // Para parar o efeito de piscar após 5 segundos
        setTimeout(() => {
          setBlink(false);
          animation.stopAnimation();
        }, 3000);
    };

    try {
        return(
                <ParallaxScrollView 
                    headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
                    headerImage={
                    <View style={[styles.reactLogo,{flexDirection:'row'}]}>
                        <View style={[{flexDirection:'row'}]}>
                            <MaterialCommunityIcons size={310} name="account" color={'#FFF'}/>
                        </View>
                    </View>}
                >
                    <Animated.View style={[Styles.em_linhaHorizontal,Styles.offlineIndicator,{opacity:animation,position:'absolute',top:0,left:0,right:0,alignItems:'center',justifyContent:'center',backgroundColor:'#A1CEDC',paddingVertical:5,borderBottomLeftRadius:50,borderBottomRightRadius:50}]}>
                        <MaterialCommunityIcons name="wifi" size={25} color={isConnectedNetwork === true ? 'blue' : 'red'} style={[Styles.mr_5]}/>
                        <Text style={[Styles.ft_medium,{color: isConnectedNetwork === true ? 'blue' : 'red'}]}>{isConnectedNetwork === true ? 'Conectado!' : 'Você está Offline, verifique sua conexão.'}</Text>
                    </Animated.View>
                    <View style={[{gap:15,marginVertical:15,paddingVertical:15}]}>
                        <ThemedView style={styles.titleContainer}>
                            <ThemedText type="title" style={[{width:'100%',textAlign:'center'}]}>Faça login </ThemedText>
                        </ThemedView>
                        <ThemedView style={[styles.titleContainer,{alignItems:'center',justifyContent:'center'}]}>
                            <HelloWave />
                        </ThemedView>
                        <ThemedView style={styles.titleContainer}>
                            <ThemedText type="defaultSemiBold" style={[{width:'100%',textAlign:'center'}]}>"{route.params !== undefined && route.params.client !== undefined && route.params.client !== '' && route.params.client !== null ? route.params.client : route.params === undefined ? 'Cliente não selecionado!' : route.params.loja}"</ThemedText>
                        </ThemedView>
                        <View style={[{paddingHorizontal:5,flexDirection:'row',alignItems:'center',borderRadius:5,elevation:2,justifyContent:'flex-start',height:45,backgroundColor:'#FFF'}]}>
                            <MaterialCommunityIcons name="email" size={20} />
                            <TextInput placeholder="E-mail do parceiro..." style={[{height:'100%',width:'90%',paddingHorizontal:5}]} onChangeText={(text)=>{setEm(text)}} defaultValue={route.params !== undefined && route.params.user !== undefined && route.params.user !== '' && route.params.user !== null ? route.params.user : Em} value={route.params !== undefined && route.params.user !== undefined && route.params.user !== '' && route.params.user !== null ? route.params.user : Em}/>
                        </View>
                        <View style={[{paddingHorizontal:5,flexDirection:'row',alignItems:'center',borderRadius:5,elevation:2,justifyContent:'flex-start',height:45,backgroundColor:'#FFF'}]}>
                            <MaterialCommunityIcons name="key" size={20} />
                            <TextInput placeholder="Senha" style={[{height:'100%',width:'90%',paddingHorizontal:5}]} secureTextEntry={true} onChangeText={(text)=>{setPass(text)}} defaultValue={route.params !== undefined && route.params.user !== undefined && route.params.user !== '' && route.params.pass !== null ? route.params.pass : Em} value={route.params !== undefined && route.params.pass !== undefined && route.params.pass !== '' && route.params.pass !== null ? route.params.pass : pass}/>
                        </View>
                        <View style={[{paddingHorizontal:0,flexDirection:'row',alignItems:'center',borderRadius:5,justifyContent:'flex-start',height:20,backgroundColor:'transparent'}]}>
                            <ThemedText type="subtitle">Esqueceu sua senha?</ThemedText>
                            <ThemedText type="link" style={[{marginLeft:5}]}>
                                <TouchableOpacity><ThemedText>Recupere agora.</ThemedText></TouchableOpacity>
                            </ThemedText>
                        </View>
                        <View style={[{paddingHorizontal:0,flexDirection:'row',alignItems:'center',borderRadius:5,justifyContent:'flex-start',height:20,backgroundColor:'transparent'}]}>
                            <ThemedText type="subtitle">Não é parceiro?</ThemedText>
                            <ThemedText type="link" style={[{marginLeft:5}]}>
                                <TouchableOpacity><ThemedText>Cadastre-se agora.</ThemedText></TouchableOpacity>
                            </ThemedText>
                        </View>
                        <View style={[Styles.w100,{height:1,backgroundColor:'#999'}]}/>
                        <View style={[{paddingHorizontal:0,flexDirection:'row',alignItems:'center',borderRadius:5,justifyContent:'space-between',height:45,backgroundColor:'transparent'}]}>
                            <TouchableOpacity style={[{backgroundColor:'red',marginHorizontal:0,paddingVertical:10,paddingHorizontal:10,borderRadius:5,elevation:5}]}
                                onPress={()=>{
                                    //apresentaModal(idModal:string,iconeM:string,titleM:string,conteudoM:string|ReactNode|ReactElement|Function,styleM:StyleSheet|string,actionsM:Function)
                                    apresentaModal('dialog','help','Cancelar login?','Tem certeza que deseja cancelar o login?','default',()=>(
                                        <>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.w50,Styles.success,{elevation:0,borderWidth:0,marginHorizontal:0,marginVertical:0,borderRadius:0,borderBottomLeftRadius:5}]} onPress={()=>{fecharModal('')}}>
                                                <ThemedText type="default" style={[Styles.lblsuccess]}>Não</ThemedText>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.w50,Styles.danger,{elevation:0,borderWidth:0,marginHorizontal:0,marginVertical:0,borderRadius:0,borderBottomRightRadius:5}]}
                                                onPress={()=>{fecharModal(''),navigation.navigate('home')}}
                                            >
                                                <ThemedText type="default" style={[Styles.lbldanger]}>Sim! cancelar</ThemedText>
                                            </TouchableOpacity>
                                        </>
                                    ))
                                }}
                            >
                                <ThemedText type="subtitle" style={[{color:'#FFFFFF'}]}>Cancelar</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{backgroundColor:'blue',marginHorizontal:0,paddingVertical:10,paddingHorizontal:10,borderRadius:5,elevation:5}]}
                                onPress={()=>{
                                    setLoad(true);
                                    blinkView()
                                    login({comando:'login',email:Em,senha:pass,token:tokenNotification,idEmpresa:route.params.clienteid});
                                }}
                            >
                                {
                                    load === false ? <ThemedText type="subtitle" style={[{color:'#FFFFFF'}]}><Text>Login/Entrar</Text></ThemedText> : <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'center'}]}><ActivityIndicator size={25} color={'#FFFFFF'} style={[{marginRight:10}]}/><ThemedText type="subtitle" style={[{color:'#FFFFFF'}]}>Aguarde...</ThemedText></View>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={[Styles.w100,Styles.em_linhaHorizontal]}>
                            <View style={[Styles.w45,{marginHorizontal:0,height:1,backgroundColor:'#999'}]}/>
                            <Text style={[Styles.ft_regular,Styles.w10,{marginHorizontal:0,textAlign:'center'}]}>OU</Text>
                            <View style={[Styles.w45,{marginHorizontal:0,height:1,backgroundColor:'#999'}]}/>
                        </View>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal,{backgroundColor:'blue',marginHorizontal:0,paddingVertical:10,paddingHorizontal:10,borderRadius:5,elevation:5}]}
                            onPress={()=>{
                                navigation.navigate('signin google');
                            }}
                        >
                            <MaterialCommunityIcons name="google" size={25} style={[Styles.lblprimary]}/>
                            {
                                load === false ? <ThemedText type="subtitle" style={[{color:'#FFFFFF'}]}><Text>Login com o google</Text></ThemedText> : <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'center'}]}><ActivityIndicator size={25} color={'#FFFFFF'} style={[{marginRight:10}]}/><ThemedText type="subtitle" style={[{color:'#FFFFFF'}]}>Aguarde...</ThemedText></View>
                            }
                        </TouchableOpacity>
                    </View>
                </ParallaxScrollView>
        )
    } catch (error) {
        Alert.alert('Erro de inicio','Corrija o erro na linha 88=>',error.message)  
    }
}

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 250,
      width: 250,
      bottom: -40,
      left: -150,
      position: 'absolute',
      resizeMode:'stretch',
      elevation:10,
    },
  });