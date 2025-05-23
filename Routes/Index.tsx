import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity,Animated, Alert, SafeAreaView,AppRegistry,ToastAndroid,Platform, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {expo as appName} from '../app.json';
import {Snackbar} from 'react-native-paper';
import { useTheme } from '../assets/Styles/ThemeContext';
import {Styles} from '../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useFonts,Montserrat_100Thin,Montserrat_200ExtraLight,Montserrat_300Light,Montserrat_400Regular,Montserrat_500Medium,Montserrat_600SemiBold,Montserrat_700Bold,Montserrat_800ExtraBold,Montserrat_900Black,Montserrat_100Thin_Italic,Montserrat_200ExtraLight_Italic,Montserrat_300Light_Italic,Montserrat_400Regular_Italic,Montserrat_500Medium_Italic,Montserrat_600SemiBold_Italic,Montserrat_700Bold_Italic,Montserrat_800ExtraBold_Italic,Montserrat_900Black_Italic,} from '@expo-google-fonts/montserrat';
import AppLoading from '../Components/Loader/AppLoading';
import { createStackNavigator} from '@react-navigation/stack';
import { AuthLogin } from '../assets/Contexts/AuthLogin';
import * as Notifications from 'expo-notifications';
import {useNavigation} from '@react-navigation/native';
import Constants from 'expo-constants';
import axios from 'axios';
import Config from '../assets/Config/Config.json';
import config from '../app.json';
//import {enableScreens} from 'react-native-screens';

//telas do app
import Step_1 from './Comecar/Step_1';
import Step_2 from './Comecar/Step_2';
import Step_3 from './Comecar/Step_3';
import Index from './Telas/Home/Index';
import LoginComponent from './Components/ComponentLogin';
import HomeOs from './Telas/Logado';
import Assistencias from './Telas/Logado/Telas/Assistencias';
import InfoOs from './Telas/Logado/Telas/InfoOs';
import IniciarOs from './Telas/Logado/Telas/IniciarOs';
import OsIniciada from './Telas/Logado/Telas/OsIniciada';
import FotoEmbalagem from './Telas/Logado/Telas/FotoEmbalagem';
import FotoMontado from './Telas/Logado/Telas/FotoMontado';
import FotoAmbiente from './Telas/Logado/Telas/FotoAmbiente';
import Assinatura from './Telas/Logado/Telas/Assinatura';
import Filters from './Telas/Logado/Telas/filters';
import NotificarLoja from './Telas/Logado/Telas/NotificarLoja';
import NotificationsUser from './Telas/Logado/Telas/NotificationsUser';
import ProblemaOs from './Telas/Logado/Telas/ProblemaOs';
import Mapa from './Telas/Mapa';
import Faturamento from './Telas/Logado/Telas/faturamento';
import Fechamento from './Telas/Logado/Telas/Fechamento';
import ResetPass from './Telas/Logado/Telas/ResetPass';
import ResetCache from './Telas/Logado/Telas/ResetCache';
import InfoLicenceApp from './Telas/Logado/Telas/InfoLicenceApp';
import ReagendarOs from './Telas/Logado/Telas/ReagendarOs';
import LoginWithGoogle from './Components/LoginWithGoogle';
import RegisterApp from './Telas/Logado/Telas/RegisterApp';
import Mensagens from './Telas/Logado/Telas/Mensagens';
//modais
import ModalDialog from './Modais/ModalDialog';
import ModalLoad from './Modais/ModalLoad';
import ModalError from './Modais/ModalError';
import ModalSuccess from './Modais/ModalSuccess';
import ModalWarning from './Modais/ModalWarning';

//Headers
import HeaderLeftIndex from './Telas/Home/Headers/headerLeftIndex';
import HeaderRightIndex from './Telas/Home/Headers/HeaderRightIndex';
import HeaderFilterIndex from './Telas/Home/Headers/HeaderFilterIndex';
import HeaderRightOsIniciada from './Telas/Home/Headers/HeaderRightOsIniciada';
import { ThemedText } from './Components/ThemedText';
import {enableScreens} from 'react-native-screens';
import HeaderRightInfoOs from './Telas/Home/Headers/HeaderRightInfoOs';
import Roterizacao from './Telas/Logado/Telas/Roterizacao';
import CentralMensagens from './Telas/Logado/Telas/CentralMensagens';
import MensagemWhatsApp from './Telas/Logado/Telas/MensagemWhatsApp';
import DevolverOs from './Telas/Logado/Telas/DevolverOs';
import User from './Telas/Logado/Telas/User';


enableScreens();

const Stack = createStackNavigator();

// Registra o aplicativo principal
//AppRegistry.registerComponent(appName.name, () => App);
// Registra a tarefa em segundo plano para processar as mensagens
/*messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});*/

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Routes(){
    const { theme } = useTheme();
    const navigation = useNavigation();
    let [fontsLoaded] = useFonts({Montserrat_100Thin,Montserrat_200ExtraLight,Montserrat_300Light,Montserrat_400Regular,Montserrat_500Medium,Montserrat_600SemiBold,Montserrat_700Bold,Montserrat_800ExtraBold,Montserrat_900Black,Montserrat_100Thin_Italic,Montserrat_200ExtraLight_Italic,Montserrat_300Light_Italic,Montserrat_400Regular_Italic,Montserrat_500Medium_Italic,Montserrat_600SemiBold_Italic,Montserrat_700Bold_Italic,Montserrat_800ExtraBold_Italic,Montserrat_900Black_Italic,});
    const {dataLoaded,appIsValid,isOffline,setIsOffline,onlineOffline,typeConn,validarApp,setTela,uniqueId,setDataLoaded,buscarNotificacoes,visibleSnackBar,setVisibleSnackBar,msgModal,carregar,isConfigured,isOs,isUser,verificarConexao,page,tela,setPage,notificationsCount,tokenNotification,setTokenNotification,usuario,AlimentarApp,httpAlimentacao,modalId,modalVisible,setModalVisible,osInicada,isConnectedNetwork,apresentaModal,fecharModal,getModalStyle,getModalStyleLabel,getModalStyleLabelAlert} = useContext<any>(AuthLogin);
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const [statusLoad,setStatusLoad] = useState<boolean>(false);
    const [errorMsg, setError] = useState<null | undefined | any>(null);
    const [validating, setValidating] = useState(false);

    async function updateTokenNotification(token_:any){
      const response = await axios({
        method:'get',
        url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
        params:{
            comando:'updateToken',
            id_user:usuario.id_user,
            token:token_,
        }
      });
      if(response.data[0].status === 'OK' && response.data[0].statusCode === 0){
        showToastWithGravityAndOffset(response.data[0].statusMensagem);
        //Alert.alert('Token de notificação',response.data[0].statusMensagem+'"\n\nSeu token:"'+response.data[0].token_id+'", Guarde-o com muito cuidado.');
      }else{
        showToastWithGravityAndOffset(response.data[0].statusMensagem);
      }
    }

    const showToastWithGravityAndOffset = (msg:string) => {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    };

    useEffect(()=> {
        validationApp();
        async function notificationsLoad(){
          notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
          });
        }

        inicio();
        notificationsLoad();
        // Escuta notificações recebidas enquanto o app está aberto (foreground)
          notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            console.log("📩 Notificação Recebida:", notification);
          });

        // Escuta quando o usuário toca em uma notificação
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("📲 Notificação Clicada:", response);
            navigation.navigate('notifications');
          });

        return () => {
          // Remover listeners ao desmontar o componente
          if (notificationListener.current) {
            Notifications.removeNotificationSubscription(
              notificationListener.current
            );
          }
          if (responseListener.current) {
            Notifications.removeNotificationSubscription(responseListener.current);
          }
        };
        // Configure o ID do bloco de anúncios
        /*AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712')//config.expo.android.config.googleMobileAdsAppId);

        // Carregue o anúncio
        AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true }).catch((error) =>
        );*/
    }, []);

    const showAd = async () => {
      try {
        await AdMobInterstitial.showAdAsync();
      } catch (error) {
        console.log('Erro ao apresentar o anuncio=>',error);
      }
    };

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const registerForPushNotificationsAsync = async () => {
      try {
        const  {status}  = await Notifications.getPermissionsAsync();
    
        if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== 'granted') {
            Alert.alert('Permissão para notificações não concedida!');
            return;
          }
        }
    
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,//.manifest?.extra?.projectId
        })


        setTokenNotification(token.data);
        usuario !== null && await updateTokenNotification(token.data);
        console.log(token);// Salve este token para enviar notificações
      } catch (error:any) {
        Alert.alert('Erro',error.message);
      }
      
    };

    function inicioOff(){
      setDataLoaded(true);
      setStatusLoad(true);
    }

    async function inicio(){
        const vc = await verificarConexao();
        if(vc.code === 0){
          const AlApp = await AlimentarApp();
          if(AlApp.code ===0){
            //console.log('User=>',usuario);
            //verifica se o usuário está logado
            if(usuario !== null){
              await registerForPushNotificationsAsync();

              if (Platform.OS === 'android') {
                Notifications.getNotificationChannelsAsync().then(channels => {
                  setChannels(channels ?? []);
                  //console.log('Canais de notificação:', channels);
                });
              }

              // Este listener captura notificações recebidas no background
              Notifications.addNotificationResponseReceivedListener(response => {
                //navigation.navigate(response.notification.request.content.tela);
                //console.log('Notificação recebida em background!', response.notification.request.content);
              });

              // Listener para interações com notificações recebidas (navegação, resposta do usuário)
              responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                try {
                  const { tela, client, userName, password } = response.notification.request.content.data;
                  navigation.navigate(tela, {
                    client,
                    user: userName,
                    pass: password
                  });
                  // Chama a função para buscar notificações do usuário
                  //buscarNotificacoes(usuario.id_user, usuario.id_user);
                } catch (error) {
                  //console.error('Erro ao processar resposta da notificação:', error);
                }
              });
              const sendNotify = await buscarNotificacoes(usuario.id_login[0].id, usuario.id_login[0].id);

              if(sendNotify.code === 0 && sendNotify.count_msg > 0){
                Notifications.scheduleNotificationAsync({
                  content: {
                    title: 'Você possui novas mensagens',
                    body: sendNotify.mensagem,
                  },
                  trigger: null,
                });
              }

              const validApp = await validarApp(uniqueId);
              if(validApp.code ===0){
                  setDataLoaded(true);
                  setStatusLoad(true);              
              }else{
                Alert.alert('Erro de validação!','Código de erro: '+validApp.code+'\n'+validApp.mensagem+':\n\n"'+validApp.retorno+'"');
                setDataLoaded(true);
                setStatusLoad(true);
              }
            }else{
                setDataLoaded(true);
                setStatusLoad(true);
            }
          }
        }else{
          const AlApp = await AlimentarApp();
          if(AlApp.code === 0 && AlApp.status === 'sucesso'){
            inicioOff();
          }else{
            apresentaModal(
              'error',
              'close-circle',
              'Erro de alimentação!',
              ()=>(
                  <View style={[Styles.em_linhaVertical,Styles.w100,{justifyContent:'center',alignItems:'center'}]}>
                      <ThemedText type='title' style={[Styles.w100,Styles.lblwarning,{textAlign:'center',marginVertical:10}]}>Erro de alimentação!</ThemedText>
                      <MaterialCommunityIcons name='close-circle' size={50} style={[Styles.lblwarning,{marginBottom:20}]}/>
                      <ThemedText type='defaultSemiBold' style={[Styles.w95,Styles.lblwarning,{textAlign:'center',marginBottom:20}]}>{'Código de erro: '+AlApp.code+'\n'+AlApp.mensagem+':\n\n"'+AlApp.retorno+'"'}</ThemedText>
                  </View>
              ),
              'default',
              ()=>{
                  return(
                      <TouchableOpacity style={[Styles.btn,Styles.warning,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogcentered,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}
                          onPress={()=>{
                              fecharModal('');
                          }}
                      >
                          <ThemedText type='defaultSemiBold' style={[Styles.ft_regular,Styles.lblwarning]}>Entendi</ThemedText>
                      </TouchableOpacity>
                  )
              }
            );
            //Alert.alert('Erro de alimentação!','Código de erro: '+AlApp.code+'\n'+AlApp.mensagem+':\n\n"'+AlApp.retorno+'"');
            setDataLoaded(true);
            setStatusLoad(true);
          }
        }
        // Limpeza dos listeners quando o componente for desmontado
        return () => {
          if (notificationListener.current) {
            Notifications.removeNotificationSubscription(notificationListener.current);
          }
          if (responseListener.current) {
            Notifications.removeNotificationSubscription(responseListener.current);
          }
        };
    }

    async function validationApp() {
      const vrfConn = await verificarConexao();
      console.log('Status da conexão=>', vrfConn)
      if (vrfConn.code === 0) {
          const licenca = await validarApp(uniqueId)
          console.log('retorno=>',licenca)
          if (licenca.code === 0) {
              setError(licenca);
              setValidating(false);
              console.log('ok=>', licenca);
          } else {
              setError(licenca);
              setValidating(false);
              console.log('Erro=>', licenca);
          }
      } else {
          setError(vrfConn);
      }
  }

    if(!fontsLoaded || !statusLoad || !dataLoaded || !theme){
        //console.log('Liberado para renderizar?=>',dataLoaded);
        return <AppLoading msgTitle={'Trabalhando nisso!'} msgLoad={'Carregando fontes e dados do APP\n\nAguarde...'}/>
    }else{
      try {
          return (
            <>
              <Stack.Navigator 
                initialRouteName={isConfigured === false ? 'comecar' : isUser === false ? 'home' : isOs === false ? 'home os' : osInicada !== null ? osInicada.tela : 'home os'}
              >
                <Stack.Screen name="comecar" component={Step_1} options={{headerShown:true,title:'Início de tudo',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="path configuracao" component={Step_2} options={{headerShown:true,title:'Id único do APP',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="requisicao" component={Step_3} options={{headerShown:true,title:'Alimentação e dados',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="home" component={Index} options={{headerShown:false,title:'Home'}}/>
                <Stack.Screen name="login" component={LoginComponent} options={{headerShown:false,title:'Login',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="home os" component={HomeOs} options={{
                    headerShown:true,
                    title:'Home',
                    headerTitle:()=>(
                      <HeaderLeftIndex/>
                    ),
                    headerRight:()=>(
                      <View style={[Styles.em_linhaHorizontal,{borderTopLeftRadius:10,borderBottomLeftRadius:10,elevation:2,backgroundColor:'#fafafa',marginVertical:0,paddingVertical:5,paddingLeft:10,}]}>
                            <TouchableOpacity  style={[getModalStyle('light'),{marginRight:5,paddingHorizontal:0,paddingVertical:0}]}
                              onPress={()=>{
                                apresentaModal(
                                  isOffline === true ? 'error' : 'success',
                                  'connection',
                                  'Status da conexão',
                                  ()=>{
                                    if(isOffline === false ){ 
                                      return(
                                        <View style={[Styles.em_linhaVertical,Styles.w80,getModalStyle('success'),{maxWidth:'80%',marginHorizontal:0,marginBottom:20,}]}>
                                          <MaterialCommunityIcons name={isOffline === true ? typeConn === 'wifi' ? 'wifi-off' : 'signal-off' : typeConn !== 'wifi' ? 'wifi-check' : 'signal'} size={75} style={[getModalStyleLabel(isOffline === true ? 'success' : 'danger')]}/>
                                          <Text style={[Styles.ft_medium,getModalStyleLabel(isOffline === true ? 'success' : 'danger'),Styles.w100,{marginHorizontal:0,textAlign:'center'}]}>{'Você está usando o modo "online" do aplicativo, isso significa que você pode executar as ordens de serviço em tempo real.\n\nPara ficar offline clique no botão abaixo.'}</Text>
                                        </View>
                                      )
                                    }else{
                                      return(
                                        <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{marginBottom:20,}]}>
                                          <MaterialCommunityIcons name={isOffline === true ? typeConn === 'wifi' ? 'wifi-off' : 'signal-off' : typeConn !== 'wifi' ? 'wifi-check' : 'signal'} size={75} style={[getModalStyleLabel(isOffline === true ? 'success' : 'danger')]}/>
                                          <Text style={[Styles.ft_medium,getModalStyleLabel(isOffline === true ? 'success' : 'danger'),Styles.w100,{textAlign:'center'}]}>{'Você está usando o modo offline do aplicativo, isso significa que quando voltar ao modo online, você terá que enviar as ordens de serviço. Você ficará offline e não receberá notificações de novas ordens de serviço.\n\nPara voltar o modo online clique no botão abaixo.'}</Text>
                                        </View>
                                      )
                                    }
                                  },
                                  isOffline === true ? 'danger' : 'success',
                                  ()=>(
                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.btnDialogcentered,Styles.btnDialog,Styles.w95,getModalStyle(isOffline === true ? 'danger' : 'success'),{elevation:0}]}
                                      onPress={()=>{
                                        if(isOffline){
                                          onlineOffline('online');
                                        }else{
                                          onlineOffline('offline');
                                        }
                                      }}
                                    >
                                      <Text style={[getModalStyleLabel(isOffline === true ? 'danger' : 'success')]}>{isOffline === true ? 'Ficar online' : 'Ficar Offline'}</Text>
                                    </TouchableOpacity>
                                  )
                                )
                              }}
                            >
                              <MaterialCommunityIcons name={isOffline === true ? 'wifi-cancel' : 'wifi-check'} size={18} style={[getModalStyleLabelAlert(isOffline === true ? 'danger' : 'default')]}/>
                            </TouchableOpacity>

                            <TouchableOpacity  style={[getModalStyle('light'),{marginRight:5,paddingHorizontal:0,paddingVertical:0}]}
                              onPress={()=>{
                                navigation.navigate('notifications');
                              }}
                            >
                              <MaterialCommunityIcons name={notificationsCount !== null && notificationsCount !== undefined && notificationsCount !== '' && notificationsCount.length > 0 ? 'bell-alert' : 'bell'} size={25} style={[getModalStyleLabelAlert(notificationsCount !== null &&notificationsCount !== undefined && notificationsCount !== '' && notificationsCount.length > 0 ? 'danger' : 'default')]}/>
                              <Text style={[Styles.w100,Styles.ft_bold,{color:notificationsCount !== null &&notificationsCount !== undefined && notificationsCount !== '' && notificationsCount.length > 0 ? '#FFF' : '#FFF',position:'absolute',textAlign:'center',top:5}]}>{notificationsCount !== null &&notificationsCount !== undefined && notificationsCount !== '' && notificationsCount.length > 0 ? notificationsCount.length : 0}</Text>
                            </TouchableOpacity>
                            {
                              isOffline === false &&

                              <TouchableOpacity  style={[Styles.em_linhaHorizontal]}
                                onPress={()=>{
                                  //console.log(isConnectedNetwork)
                                  apresentaModal(
                                    isConnectedNetwork === true ? 'success' : 'error',
                                    'connection',
                                    'Status da conexão',
                                    ()=>{
                                      if(isConnectedNetwork === true ){ 
                                        return(
                                          <View style={[Styles.em_linhaVertical,Styles.w80,getModalStyle('success'),{maxWidth:'80%',marginHorizontal:0,marginBottom:20,}]}>
                                            <MaterialCommunityIcons name={isOffline === true ? 'cancel' : isConnectedNetwork === true ? typeConn === 'wifi' ? 'wifi-check' : 'signal' : typeConn !== 'wifi' ? 'wifi-off' : 'signal-off'} size={75} style={[getModalStyleLabel(isConnectedNetwork === true ? 'success' : 'danger')]}/>
                                            <Text style={[Styles.ft_medium,getModalStyleLabel(isConnectedNetwork === true ? 'success' : 'danger'),Styles.w100,{marginHorizontal:0,textAlign:'center'}]}>{'Sua conexão está funcionando corretamente, Isso significa que você poderá finalizar as ordens de serviços normalmente.'}</Text>
                                          </View>
                                        )
                                      }else{
                                        return(
                                          <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{marginBottom:20,}]}>
                                            <MaterialCommunityIcons name={isOffline === true ? 'cancel' : isConnectedNetwork === true ? typeConn === 'wifi' ? 'wifi-check' : 'signal' : typeConn !== 'wifi' ? 'wifi-off' : 'signal-off'} size={75} style={[getModalStyleLabel(isConnectedNetwork === true ? 'success' : 'danger')]}/>
                                            <Text style={[Styles.ft_medium,getModalStyleLabel(isConnectedNetwork === true ? 'success' : 'danger'),Styles.w100,{textAlign:'center'}]}>{'Sua conexão não está funcionando corretamente, Isso significa que você poderá finalizar as ordens de serviços "offline" normalmente, Mas, Terá de enviá-las quando estiver online novamente.'}</Text>
                                          </View>
                                        )
                                      }
                                    },
                                    isConnectedNetwork === true ? 'success' : 'danger',
                                    ()=>(
                                      <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.btnDialogcentered,Styles.btnDialog,Styles.w95,getModalStyle(isConnectedNetwork === true ? 'success' : 'danger'),{elevation:0}]}
                                        onPress={()=>{
                                          fecharModal('');
                                        }}
                                      >
                                        <Text style={[getModalStyleLabel(isConnectedNetwork === true ? 'success' : 'danger')]}>ENTENDI!</Text>
                                      </TouchableOpacity>
                                    )
                                  )
                                }}
                              >
                                <MaterialCommunityIcons name={(isOffline === true ? 'cancel' : isConnectedNetwork === true ? typeConn === 'wifi' ? 'wifi-check' : 'signal' : typeConn !== 'wifi' ? 'wifi-off' : 'signal-off')} size={18} style={[getModalStyleLabelAlert(isOffline === true ? 'danger' : isConnectedNetwork === true ? 'success' : 'danger'),{}]}/>
                              </TouchableOpacity>
                            }
                            
                        <HeaderFilterIndex/>
                      </View>
                    ),
                    headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}
                }}/>
                <Stack.Screen name="assistencias os" component={Assistencias} options={{headerShown:true,title:'Home', headerTitle:()=>(<HeaderLeftIndex/>),headerRight:()=>(<HeaderRightIndex/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="info os" component={InfoOs} options={{headerShown:true,title:'Home', headerTitle:()=>(<HeaderLeftIndex/>),headerRight:()=>(<HeaderRightInfoOs/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="iniciar os" component={IniciarOs} options={{headerShown:true,title:'Home', headerTitle:()=>(<HeaderLeftIndex/>),headerRight:()=>(<HeaderRightOsIniciada/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="os iniciada" component={OsIniciada} options={{headerShown:true,title:'Home', headerTitle:()=>(<HeaderLeftIndex/>),headerRight:()=>(<HeaderRightOsIniciada/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="embalagem" component={FotoEmbalagem} options={{headerShown:true,title:'Home', headerTitle:()=>(<HeaderLeftIndex/>),headerRight:()=>(<HeaderRightOsIniciada/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="montado" component={FotoMontado} options={{headerShown:true,title:'Home', headerTitle:()=>(<HeaderLeftIndex/>),headerRight:()=>(<HeaderRightOsIniciada/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="ambiente" component={FotoAmbiente} options={{headerShown:true,title:'Home', headerTitle:()=>(<HeaderLeftIndex/>),headerRight:()=>(<HeaderRightOsIniciada/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="assinatura" component={Assinatura} options={{headerShown:false,title:'Home', headerTitle:()=>(<HeaderLeftIndex/>),headerRight:()=>(<HeaderRightOsIniciada/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="filters" component={Filters} options={{headerShown:true,title:'Filtrar ordens de serviço', headerTitle:()=>(<HeaderLeftIndex/>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="notificar loja" component={NotificarLoja} options={{headerShown:true,title:'Notificação para loja',}}/>
                <Stack.Screen name="notifications" component={NotificationsUser} options={{headerShown:true,title:'Notificações',headerRight:()=>(<View>{notificationsCount !== null && notificationsCount !== undefined && <Text style={[Styles.ft_bold,{marginRight:10,borderRadius:8,backgroundColor:'#FAFAFA',elevation:5,paddingHorizontal:10,paddingVertical:5}]}>{notificationsCount.length+' Notificação(ões)'}</Text>}</View>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="resolucao problema" component={ProblemaOs} options={{headerShown:true,title:'Resolução de problemas',headerRight:()=>(<View>{notificationsCount !== null && notificationsCount !== undefined && <Text style={[Styles.ft_bold,{marginRight:10,borderRadius:8,backgroundColor:'#FAFAFA',elevation:5,paddingHorizontal:10,paddingVertical:5}]}>{notificationsCount.length+' Notificação(ões)'}</Text>}</View>),headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="mapa" component={Mapa} options={{headerShown:true,title:'Localização do cliente',headerTransparent:true,headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="faturamento" component={Faturamento} options={{headerShown:true,title:'Recebimentos',headerTransparent:false,headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="fechamento" component={Fechamento} options={{headerShown:true,title:'Fechamentos',headerTransparent:false,headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="reset pass" component={ResetPass} options={{headerShown:true,title:'Alterar senha',headerTransparent:false,headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="reset cache" component={ResetCache} options={{headerShown:false}}/>
                <Stack.Screen name="info licence app" component={InfoLicenceApp} options={{headerShown:true,title:'Licença do aplicativo'}}/>
                <Stack.Screen name="reagendar os" component={ReagendarOs} options={{headerShown:true,title:'Reagendar Ordem de serviço'}}/>
                <Stack.Screen name="signin google" component={LoginWithGoogle} options={{headerShown:false}}/>
                <Stack.Screen name="register app" component={RegisterApp} options={{headerShown:false}}/>
                <Stack.Screen name="roterizacao" component={Roterizacao} options={{headerShown:true,title:'Roterização de O.S.',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="mensagens" component={CentralMensagens} options={{headerShown:false,title:'Roterização de O.S.',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="Mensagens" component={Mensagens} options={{headerShown:false,title:'Roterização de O.S.',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="mensagem whats" component={MensagemWhatsApp} options={{headerShown:false,title:'Roterização de O.S.',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="devolver os" component={DevolverOs} options={{headerShown:true,headerTransparent:true,headerBackImage:()=>(<MaterialCommunityIcons name="chevron-left" size={30} color={'#000000'}/>),title:'Devolver ordem de serviço',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
                <Stack.Screen name="user" component={User} options={{headerShown:true,headerTransparent:false,headerBackImage:()=>(<MaterialCommunityIcons name="chevron-left" size={30} color={'#000000'}/>),title:'Dados do usuário',headerTintColor:theme.labels.text,headerStyle:{backgroundColor:theme.backgroundColor.background}}}/>
              </Stack.Navigator>
              {
                appIsValid === false && 
                <View style={[getModalStyle('danger'),{position:'absolute',top:0,left:0,right:0,bottom:0,flex:1,alignItems:'center',justifyContent:'center'}]}>
                  <MaterialCommunityIcons name='shield-remove' size={75} style={[Styles.lblsuccess,Styles.mr_5,{marginBottom:20}]}/>
                  <Text style={[getModalStyleLabel('danger'),Styles.ft_bold,{fontSize:24,textAlign:'center'}]}>{'Erro na validação do app!\n\nSua chave parece ser inválida ou expirada.\nEntre em contato pelo telefone\n(43) 98855-9582, \nou clique no botão abaixo para validar.'}</Text>
                  <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.success,Styles.w95]}
                    onPress={()=>{
                      Linking.openURL('https://marketplace.gsapp.com.br/');
                    }}
                  >
                    <MaterialCommunityIcons name='shield-check' size={25} style={[Styles.lblsuccess,Styles.mr_5]}/>
                    <Text style={[Styles.ft_bold,Styles.lblsuccess]}>Validar agora</Text>
                  </TouchableOpacity>
                </View>
              }
              {/* Renderização condicional dos modais */}
              {modalVisible && (
                <>
                  {modalId === 'dialog' && <ModalDialog />}
                  {modalId === 'error' && <ModalError />}
                  {modalId === 'load' && <ModalLoad />}
                  {modalId === 'success' && <ModalSuccess />}
                  {modalId === 'warning' && <ModalWarning />}
                  {modalId === 'menu' && <HeaderRightOsIniciada />}
                </>
              )}
              <StatusBar translucent={false} animated={true} backgroundColor={isOffline === true ? 'red' : isConnectedNetwork === true ? 'green' : 'red'} networkActivityIndicatorVisible={true}/>
            </>
          );
      } catch (error:any) {
        Alert.alert('365=>',error.message);
      }
    }
};
/*
  const navigation = useNavigation();
    const requestUserPermission = async () => {
      const authStatus = await getMessaging().requestPermission();
      const enabled =
      authStatus === getMessaging().AuthorizationStatus.AUTHORIZED ||
      authStatus === getMessaging().AuthorizationStatus.PROVISIONAL;
      
      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };
    
    useEffect(() => {
      if (await requestUserPermission()) {
        getMessaging().getToken().then(
          token => console.log(token)
        );
      }
    }, []);
    
    // Set up the notification handler for the app
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      }),
    });
    
    // Handle user clicking on a notification and open the screen
    const handleNotificationClick = async (response) => {
      const screen = response?.notification?.request?.content?.data?.screen;
      if (screen !== null) {
        navigation.navigate(screen);
      }
    };
    
      // Listen for user clicking on a notification
      const notificationClickSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationClick
      );
    
      // Handle user opening the app from a notification (when the app is in the background)
      getMessaging().onNotificationOpenedApp((remoteMessage:any) => {
        console.log("Notification caused app to open from background state:",remoteMessage.data.screen,navigation);
        if (remoteMessage?.data?.screen) {
          navigation.navigate(`${remoteMessage.data.screen}`);
        }
      });
    
      // Check if the app was opened from a notification (when the app was completely quit)
      getMessaging().getInitialNotification().then((remoteMessage:any) => {
        if (remoteMessage) {
          console.log("Notification caused app to open from quit state:",remoteMessage.notification);
          if (remoteMessage?.data?.screen) {
            navigation.navigate(`${remoteMessage.data.screen}`);
          }
        }
      });
    
      // Handle push notifications when the app is in the background
      getMessaging().setBackgroundMessageHandler(async (remoteMessage:any) => {
        console.log("Message handled in the background!", remoteMessage);
        const notification = {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data, // optional data payload
        };
      
        // Schedule the notification with a null trigger to show immediately
        await Notifications.scheduleNotificationAsync({
          content: notification,
          trigger: null,
        });
      });
    
      // Handle push notifications when the app is in the foreground
      const handlePushNotification = async (remoteMessage:any) => {
        const notification = {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data, // optional data payload
        };
        
        // Schedule the notification with a null trigger to show immediately
          await Notifications.scheduleNotificationAsync({
            content: notification,
            trigger: null,
          });
      };
    
      // Listen for push notifications when the app is in the foreground
      const unsubscribe = getMessaging().onMessage(handlePushNotification);
      
      // Clean up the event listeners
      return () => {
        unsubscribe();
        notificationClickSubscription.remove();
      };
    }
*/