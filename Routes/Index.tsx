import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity,Animated, Alert, SafeAreaView,AppRegistry,ToastAndroid,Platform} from 'react-native';
import App from '../App';
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

enableScreens();

const Stack = createStackNavigator();

// Registra o aplicativo principal
/*AppRegistry.registerComponent(appName.name, () => App);
// Registra a tarefa em segundo plano para processar as mensagens
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});*/

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Este listener captura notificações recebidas no background
Notifications.addNotificationResponseReceivedListener(response => {
  console.log('Notificação recebida em background!', response.notification.request.content);
});

export default function Routes(){
    const { theme } = useTheme();
    const navigation = useNavigation();
    let [fontsLoaded] = useFonts({Montserrat_100Thin,Montserrat_200ExtraLight,Montserrat_300Light,Montserrat_400Regular,Montserrat_500Medium,Montserrat_600SemiBold,Montserrat_700Bold,Montserrat_800ExtraBold,Montserrat_900Black,Montserrat_100Thin_Italic,Montserrat_200ExtraLight_Italic,Montserrat_300Light_Italic,Montserrat_400Regular_Italic,Montserrat_500Medium_Italic,Montserrat_600SemiBold_Italic,Montserrat_700Bold_Italic,Montserrat_800ExtraBold_Italic,Montserrat_900Black_Italic,});
    const {dataLoaded,typeConn,validarApp,setTela,uniqueId,setDataLoaded,buscarNotificacoes,visibleSnackBar,setVisibleSnackBar,msgModal,carregar,isConfigured,isOs,isUser,verificarConexao,page,tela,setPage,notificationsCount,tokenNotification,setTokenNotification,usuario,AlimentarApp,httpAlimentacao,modalId,modalVisible,setModalVisible,osInicada,isConnectedNetwork,apresentaModal,fecharModal,getModalStyle,getModalStyleLabel,getModalStyleLabelAlert} = useContext<any>(AuthLogin);
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    //console.log('no index linha 55=>',isConfigured,isUser,isOs);
    const [statusLoad,setStatusLoad] = useState(false);


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

      //console.log('retorno da atualização=>',response.data[0]);
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
      inicio();
    }, [theme/*osInicada,httpAlimentacao,usuario*/]);

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
        console.log(token.data);// Salve este token para enviar notificações
      } catch (error:any) {
        Alert.alert('Erro',error.message);
      }
      
    };

    async function inicioOff(){
      const AlApp = await AlimentarApp();
      if(AlApp.code ===0){
        console.log(AlApp);
        setDataLoaded(true);
        setStatusLoad(true);
      }
    }

    useEffect(()=>{
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
        console.log('Notificação recebida no primeiro plano:', notification)
      });
    },[])

    async function inicio(){
        const vc = await verificarConexao();
        if(vc.code ===0){
          const validApp = await validarApp(uniqueId);
          if(validApp.code ===0){
            const AlApp = await AlimentarApp();
            if(AlApp.code ===0){
              setDataLoaded(true);
              setStatusLoad(true);
              usuario !== null && buscarNotificacoes(usuario.id_user,usuario.id_user);
              await registerForPushNotificationsAsync();
              /*notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
                console.log('Notificações=>',notification)
              });
        
              if (Platform.OS === 'android') {
                Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
                console.log('canais=>',channels)
              }
          
              responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                try {
                  navigation.navigate(response.notification.request.content.data.tela,{client:response.notification.request.content.data.client,user:response.notification.request.content.data.userName,pass:response.notification.request.content.data.password})
                  buscarNotificacoes(usuario.id_user,usuario.id_user);
                } catch (error) {
                  console.log(error);
                }
                
                //console.log(response.notification.request.content.data);
              });
          
              return () => {
                notificationListener.current &&
                  Notifications.removeNotificationSubscription(notificationListener.current);
                responseListener.current &&
                  Notifications.removeNotificationSubscription(responseListener.current);
              };*/
              // Listener para notificações recebidas enquanto o app está em uso (primeiro plano)

              // Tratamento de notificações para Android
              if (Platform.OS === 'android') {
                Notifications.getNotificationChannelsAsync().then(channels => {
                  setChannels(channels ?? []);
                  console.log('Canais de notificação:', channels);
                });
              }

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
                  buscarNotificacoes(usuario.id_user, usuario.id_user);
                } catch (error) {
                  console.error('Erro ao processar resposta da notificação:', error);
                }
              });

              // Limpeza dos listeners quando o componente for desmontado
              return () => {
                if (notificationListener.current) {
                  Notifications.removeNotificationSubscription(notificationListener.current);
                }
                if (responseListener.current) {
                  Notifications.removeNotificationSubscription(responseListener.current);
                }
              };
            }else{
              setDataLoaded(true);
              setStatusLoad(true);
              setTela('home os');
            }
          }else{
            Alert.alert('Erro de validação!','Código de erro: '+validApp.code+'\n'+validApp.mensagem+':\n\n"'+validApp.retorno+'"');
            setDataLoaded(true);
            setStatusLoad(true);
          }
        }else{
          inicioOff()
        }

       //console.log('64=>',vc)
       //console.log('66=>',AlApp);
    }

    if(!fontsLoaded || !statusLoad || !dataLoaded || !theme){
        //console.log('Liberado para renderizar?=>',dataLoaded);
        return <AppLoading msgLoad={'Carregando fontes e dados do APP\n\nAguarde...'}/>
    }else{
      try {
          //console.log('Liberado para renderizar 75?=>',dataLoaded,osInicada,isOs);
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
                <Stack.Screen name="home os" 
                  component={HomeOs} 
                  options={{
                    headerShown:true,
                    title:'Home',
                    headerTitle:()=>(
                      <HeaderLeftIndex/>
                    ),
                    headerRight:()=>(
                      <View style={[Styles.em_linhaHorizontal,{borderTopLeftRadius:10,borderBottomLeftRadius:10,elevation:2,backgroundColor:'#fafafa',marginVertical:0,paddingVertical:5,paddingLeft:10,}]}>
                            <TouchableOpacity  style={[getModalStyle('light'),{marginRight:5,paddingHorizontal:0,paddingVertical:0}]}
                              onPress={()=>{
                                navigation.navigate('notifications');
                              }}
                            >
                              <MaterialCommunityIcons name={notificationsCount !== null &&notificationsCount !== undefined && notificationsCount !== '' && notificationsCount.length > 0 ? 'bell-alert' : 'bell'} size={25} style={[getModalStyleLabelAlert(notificationsCount !== null &&notificationsCount !== undefined && notificationsCount !== '' && notificationsCount.length > 0 ? 'danger' : 'default')]}/>
                              <Text style={[Styles.w100,Styles.ft_bold,{color:notificationsCount !== null &&notificationsCount !== undefined && notificationsCount !== '' && notificationsCount.length > 0 ? '#FFF' : '#FFF',position:'absolute',textAlign:'center',top:5}]}>{notificationsCount !== null &&notificationsCount !== undefined && notificationsCount !== '' && notificationsCount.length > 0 ? notificationsCount.length : 0}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={[Styles.em_linhaHorizontal]}
                              onPress={()=>{
                                console.log(isConnectedNetwork)
                                apresentaModal(
                                  isConnectedNetwork === true ? 'success' : 'error',
                                  'connection',
                                  'Status da conexão',
                                  ()=>{
                                    if(isConnectedNetwork === true ){ 
                                      return(
                                        <View style={[Styles.em_linhaVertical,Styles.w80,getModalStyle('success'),{maxWidth:'80%',marginHorizontal:0,marginBottom:20,}]}>
                                          <MaterialCommunityIcons name={isConnectedNetwork === true ? typeConn === 'wifi' ? 'wifi-check' : 'signal' : typeConn !== 'wifi' ? 'wifi-off' : 'signal-off'} size={75} style={[getModalStyleLabel(isConnectedNetwork === true ? 'success' : 'danger')]}/>
                                          <Text style={[Styles.ft_medium,getModalStyleLabel(isConnectedNetwork === true ? 'success' : 'danger'),Styles.w100,{marginHorizontal:0,textAlign:'center'}]}>{'Sua conexão está funcionando corretamente, Isso significa que você poderá finalizar as ordens de serviços normalmente.'}</Text>
                                        </View>
                                      )
                                    }else{
                                      return(
                                        <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{marginBottom:20,}]}>
                                          <MaterialCommunityIcons name={isConnectedNetwork === true ? typeConn === 'wifi' ? 'wifi-check' : 'signal' : typeConn !== 'wifi' ? 'wifi-off' : 'signal-off'} size={75} style={[getModalStyleLabel(isConnectedNetwork === true ? 'success' : 'danger')]}/>
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
                              <MaterialCommunityIcons name={(isConnectedNetwork === true ? typeConn === 'wifi' ? 'wifi-check' : 'signal' : typeConn !== 'wifi' ? 'wifi-off' : 'signal-off')} size={18} style={[getModalStyleLabelAlert(isConnectedNetwork === true ? 'success' : 'danger'),{}]}/>
                            </TouchableOpacity>
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
              </Stack.Navigator>
        
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
              
              <StatusBar translucent={false} animated={true} backgroundColor={isConnectedNetwork === true ? 'green' : 'red'} networkActivityIndicatorVisible={true}/>
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