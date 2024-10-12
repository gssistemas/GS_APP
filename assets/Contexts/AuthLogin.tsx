import React,{useMemo,useEffect,useState,useContext,useCallback,createContext, ReactNode, ReactElement, useRef} from 'react';
import { Alert ,ToastAndroid,View,Text,Image, TouchableOpacity, ActivityIndicator,StyleSheet, Modal} from 'react-native';
import Config from '../Config/Config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Styles} from '../Styles/Styles';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import config from '../../app.json';
//import * as LocalAuthentication from 'expo-local-authentication';
import {requestForegroundPermissionsAsync,getCurrentPositionAsync,LocationObject} from 'expo-location';
import * as Location from 'expo-location';
/*import * as Device from 'expo-device';*/
import NetInfo from '@react-native-community/netinfo';
import * as ImagePicker from 'expo-image-picker';
import * as Application from 'expo-application';
import { ThemedText } from '../../Routes/Components/ThemedText';
//import * as Permissions from 'expo-permissions';
import { captureRef } from 'react-native-view-shot';
import { manipulateAsync, FlipType, SaveFormat, SaveOptions} from 'expo-image-manipulator';
import { Canvas, Patch, Path, Skia, SkPath, useTouchHandler,SkiaDomView, rotate} from '@shopify/react-native-skia';

export const AuthLogin = createContext({});

function AuthLoginProvider({children}:any){
    const navigation = useNavigation();
    const [load,setLoad] = useState(false);
    const [modalVisible,setModalVisible] = useState(false);
    const [modalId,setModalId] = useState('');
    const [isConnectedNetwork,setIsConectedNetwork] = useState<boolean|null>(false);
    const [typeConn,setTypeConn] = useState('');
    const [tokenNotification,setTokenNotification] = useState('');
    const [errorsLoad,setErrorsLoad] = useState<any>(null);
    const [isConfigured,setIsConfigured] = useState(false);
    const [isOs,setIsOs] = useState(false);
    const [isUser,setIsUser] = useState(false);
    const [visibleSnackBar, setVisibleSnackBar] = React.useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    let erros:any = [];
    const [itemsFat,setItemsFat] = useState(null);
    const [qtdOs,setQtdOs] = useState(0);
    const [totalFat,setTotalFat] = useState(0);
    const [parceiros,setParceiros] = useState(null);
    const [fechamentos_,setFechamentos_] = useState(null);
    const [appIsValid,setAppIsValid] = useState(false);
    const [appValidationArray,setAppValidationArray] = useState(null);
//---------------------------------------------inicio das opcoes do usuario
    const options = [
        { id: 1, title: 'Ordens de serviços', action: () => {navigation.navigate('home os')},icone:'archive',colorText:'#999999',new:false},
        { id: 2, title: 'Notificações', action: () => {navigation.navigate('notifications')},icone:'bell',colorText:'#999999',new:false},
        { id: 3, title: 'Assistências', action: () => {navigation.navigate('assistencias os')},icone:'assistant',colorText:'red',new:false},
        { id: 4, title: 'Central de mensagens', action: () => console.log('Option 2 selected'),icone:'forum',colorText:'#999999',new:false},
        { id: 5, title: 'Recebimentos', action: () => {navigation.navigate('faturamento')},icone:'currency-usd',colorText:'#999999',new:true},
        { id: 6, title: 'Fechamentos', action: () => {navigation.navigate('fechamento')},icone:'archive-check',colorText:'green',new:true},
        { id: 7, title: 'Trocar senha', action: () => {navigation.navigate('reset pass')},icone:'lock-reset',colorText:'#999999',new:false},
        { id: 8, title: 'Agenda', action: () => console.log('Option 3 selected'),icone:'calendar-month',colorText:'#999999',new:false},
        { id: 9, title: 'Limpar cache', action: () => {
            Alert.alert('ATENÇÃO!!!','Ao limpar o cachê do aplicativo você perderá:\n\n1-dados de login(Terá que fazer login novamente)\n\n2-O.S. finalizadas "OFFLINE" Terão que ser executadas as etapas novamente.\n\n3-O APP será reiniciado do zero na configuração de alimentação.\n\n Sabendo disso você ainda deseja continuar?',[
                {
                    text:'NÃO',
                },
                {
                    text:'SIM',
                    onPress:()=>{
                        navigation.reset({
                            index:0,
                            routes:[
                                {
                                    name:'reset cache',
                                }
                            ]
                        })
                    }
                }
            ])
        },icone:'cached',colorText:'#999999'},
    ];
//---------------------------------------------fim das opcoes do usuario
//----------------------------------------------inicio lista os
    const [listOs,setListOs] = useState<any|null>(null)
    const [listMinhasOs,setListMinhasOs] = useState<any>(null)
    const [listOsDisponiveis,setListOsDisponiveis] = useState<any>(null)
    const [listOsOffline,setListOsOffline] = useState<any>(null)
    const [error,setError] = useState<object|null>(null);
    const [page,setPage] = useState<string|any>(null);
    const [montantePgmto,setMontantePgmto] = useState<number>(0);
//----------------------------------------------fim lista os
//----------------------------------------------inicio dados login
    const [usuario,setUsuario] = useState<any|null>(null)
    const [email,setEmail] = useState<string|null>('');
    const [senha,setSenha] = useState<string|null>('');
//----------------------------------------------fim dados loginlogin
//----------------------------------------------configuração dos modais
    const [iconeModal,setIconeModal] = useState<string>('');
    const [titleModal,setTitleModal] = useState<string>('');
    const [msgModal,setMsgModal] = useState<string>('');
    const [conteudoModal,setConteudoModal] = useState<String|ReactNode|ReactElement|Function>('');
    const [actionsModal,setActionsModal] = useState<Function|null>(()=>{setModalVisible(!modalVisible)});
    const [stylesModal,setStylesModal] = useState<string|StyleSheet>();
//----------------------------------------------fim das configurações dos modais
//----------------------------------------------inicio do id do app
    const [uniqueId,setUniqueId] = useState<string>('');
//----------------------------------------------fim do id do app
//----------------------------------------------Inicio da alimentação do aplicativo
    const [httpAlimentacao,setHttpAlimentacao] = useState<string|null>('');
//----------------------------------------------Fim da alimentação do aplicativo
    const [listParceiros,setListParceiros] = useState();
    const [pesquiza,setPesquiza] = useState<any|null>(null);
    const dataHoraAtual = new Date();
//----------------------------------------------inicio filtros de pesquiza de O.S.
    const [dataInicial,setDataInicial] = useState<any>()
    const [dataFinal,setDataFinal] = useState<any>()
    const [idPrceiro,setIdPrceiro] = useState<any>()
    const [statusOs,setStatusOs] = useState<any>();
    const [nomeCliente,setNomeCliente] = useState<any>('');
    const [nf,setNf] = useState<any>('');
    const [ordemServico,setOrdemServico] = useState('');
    const [osInicada,setOsIniciada] = useState<any|null>(null);
    const [tela,setTela] = useState('');
//----------------------------------------------fim filtros de pesquiza de O.S.
//----------------------------------------------Obter a data local no formato 'YYYY-MM-DD'
    const dataLocal = dataHoraAtual.toLocaleDateString();
//----------------------------------------------Obter a hora local no formato 'HH:mm:ss'
    const horaLocal = dataHoraAtual.toLocaleTimeString();
//----------------------------------------------
//----------------------------------------------Inicio da configuraçãod de localização
    const [location,setLocation] = useState<LocationObject|null>(null);
//----------------------------------------------Fim da configuraçãod de localização
//----------------------------------------------inicio da OS iniciada
//    const [OsIniciada,setOsIniciada] = useState<any|null>({});
//----------------------------------------------fim da os iniciada
//----------------------------------------------inicio da tiragem de fotos da os
    const [imagensEmbalagem,setImagensEmbalagem] = useState(null);
    const [imagensMontado,setImagensMontado] = useState(null);
    const [imagensAmbiente,setImagensAmbiente] = useState(null);
    const [imagensProblema,setImagensProblema] = useState(null);
//----------------------------------------------Fim da tiragem de fotos da os
//----------------------------------------------Imagem assinatura
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
//----------------------------------------------Fim imagem assinatura
    function searchByTitle(array:any, title:string) {
        const result = array.find((item: { title: string; }) => item.title.toLowerCase().includes(title.toLowerCase()));
        setPesquiza(result ? [result] : []);
        //console.log('dados da pesquiza=>',pesquiza)
    }
//----------------------------------------------inicio das variaveis de assinatura
    const canvasRef = useRef(null);
    const currentPath = useRef<SkPath|null>(null)
    const [paths,setPaths] = useState<SkPath[]>([])
//
    const [notificationsCount,setNotificationsCount] = useState<any|null|undefined>(null);
//
    const onTouch = useTouchHandler({
        onStart:({x,y})=>{
            currentPath.current = Skia.Path.Make();
            currentPath.current.moveTo(x,y);
        },
        onActive:({x,y})=>{
            currentPath.current?.lineTo(x,y)
        },
        onEnd:()=>{
            //if(!currentPath.current) return;
            setPaths(values=> values.concat(currentPath.current!));
            currentPath.current = null;
        }
    })

    async function verificarConexao(): Promise<{status: string, code: number, mensagem: string, retorno: any}> {
        //try {
            // Obtém o estado da conexão de rede
            const state = await NetInfo.fetch();
            setIsConectedNetwork(state.isConnected);
            
            // Atualiza o estado de conexão
            
            //console.log('status real da conexão=>',state.isConnected)
            // Retorna o status com base na conexão de rede
            if (isConnectedNetwork === true) {
                fecharModal('');
                setTypeConn(state.type);
                return { status: 'sucesso', code: 0, mensagem: 'Conectado', retorno: state };
            } else {
                fecharModal('');
                setTypeConn(state.type);
                //setTypeConn('mobile');
                return { status: 'Erro', code: 149, mensagem: 'Offline', retorno: state };
            }
        /*} catch (error) {
            console.error('Erro ao verificar a conexão:', error);
            return { status: 'Erro', code: 500, mensagem: 'Erro interno', retorno: null };
        }*/
    }

    async function login(dadosLogin:any){
        if(isConnectedNetwork === true){
            apresentaModal(
                'load',
                'account-convert',
                'Realizando login',
                ()=>(
                    <View style={[Styles.w100,Styles.em_linhaVertical,{paddingVertical:15}]}>
                        <ActivityIndicator size={75} animating={true}/>
                        <Text style={[Styles.ft_regular,Styles.w90,{textAlign:'center'}]}>{'Realizando login\n\nAguarde...'}</Text>
                    </View>
                ),
                'default',
                ()=>{null}
            );
            try {
                const response = await axios({
                    method:'post',
                    url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
                    params:dadosLogin,
                })

                console.log(response.data);
                if(response.data[0].status === 'OK' && response.data[0].statusCode === 200){
                        //Alert.alert('Sucesso',response.data[0].statusMensagem);
                        const retorno = await salvarVariaveis(
                            'usuario',
                            'usuario',
                            JSON.stringify(response.data[0].dadosUser),
                        );
                        if(retorno?.code ===0){
                            setLoad(false)
                            //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                            const alm = await AlimentarApp();

                            if(alm.code ===0){
                                executarAcao('login',null,null,'home os');
                                arlterarModal(
                                    'success',
                                    'account-check',
                                    'Sucesso',
                                    ()=>(
                                        <View style={[Styles.w100,Styles.em_linhaVertical,{paddingVertical:15}]}>
                                            <MaterialCommunityIcons name='account-check' size={75} style={[getModalStyleLabel('success')]}/>
                                            <Text style={[Styles.ft_regular,Styles.w90,getModalStyleLabel('success'),{textAlign:'center'}]}>{'Login realizado com sucesso!'}</Text>
                                        </View>
                                    ),
                                    'success',
                                    ()=>{null},
                                    'Login realizado com sucesso!'
                                );
                            }
                            //console.log('retorno=>',retorno);
                        }else{
                            //console.log('209=>',retorno)
                            setLoad(false);
                            return retorno;
                        }
                }else if(response.data[0].status ==='OK' && response.data[0].statusCode === 200 || response.data === ''){
                        Alert.alert('Erro',response.data[0].statusMensagem+'\n\nError code:"'+response.data[0].statusCode+'"');
                }else{
                        Alert.alert('Erro',response.data[0].statusMensagem+'\n\nError code:"GS_APP_'+response.data[0].statusCode+'"');
                }
            } catch (error:any) {
                console.log(error)
            }
        }else{
            setLoad(false);
            console.log(isConnectedNetwork,usuario)
        }
    }

    async function cacheClear() {
        try {
            await AsyncStorage.removeItem('httpsAli');
            await AsyncStorage.removeItem('usuario');
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('senha');
            await AsyncStorage.removeItem('OsIniciada');
            const status = await AlimentarApp();

            if(status.code ===0){
                //console.log('cache limpo com sucesso!')
                return {status:'sucesso',code:0,mensagem:'sucesso'};
            }else{
                //console.log('Erro ao limpar o cache do aplicativo',error)
                return {status:'erro',code:243,mensagem:'erro'};
            }
        } catch (error) {
            //console.log('Erro ao limpar o cache do aplicativo',error)
            return {status:'erro',code:245,mensagem:'erro',retorno:error};
        }
    }

    async function AlimentarApp(){
        try {
            const httpsAl = await AsyncStorage.getItem('httpsAli');
            const usr = await AsyncStorage.getItem('usuario');
            const mail = await AsyncStorage.getItem('email');
            const pass = await AsyncStorage.getItem('senha');
            const OsIni = await AsyncStorage.getItem('OsIniciada');
            const os = await AsyncStorage.getItem('listMinhasOs');
            const unq = await AsyncStorage.getItem('idApp');
            const lstOff = await AsyncStorage.getItem('listOffline');
            //verifica se existe um lista de O.S. offline
            //console.log('290=>',lstOff);
            if(lstOff !== null){
                setListOsOffline(JSON.parse(lstOff));
            }else{
                setListOsOffline(null);
            }
            //verifica se existe um lista de O.S. online
            if(os !== null){
                setListMinhasOs(JSON.parse(os));
            }else{
                setListMinhasOs(null);
            }
            //verifica se existe um id ùnico do app
            if(unq !== null){
                setUniqueId(unq);
            }else{
                setUniqueId('');
            }
            //console.log('258=>',typeof OsIni)
//---------------------------------verifica se há alimentação de API
            if(httpsAl === null){
                setHttpAlimentacao(null);
                setTela('comecar');
            }else{
                setHttpAlimentacao(httpsAl);
                setIsConfigured(true);
            }
//---------------------------------verifica se existe alguma OS iniciada
            
            if(OsIni === null){
                setOsIniciada(null);
            }else{
                
                setIsOs(true);
                const jsonValue = JSON.parse(OsIni)
                setOsIniciada(jsonValue);
                setTela(jsonValue.tela);              
            }
//---------------------------------verifica se o email esta vazio
            /*if(mail === null){
                setEmail('');
            }else{
                setEmail(mail);
            }
//---------------------------------verifica se a senha está vazia
            if(pass === null){
                setSenha('');
            }else{
                setSenha(pass);
            }*/
//---------------------------------verifica se um usuário está logado
            if(usr === null){
                setUsuario(null);
            }else{
                const us = JSON.parse(usr);
                setIsUser(true)
                setTela('home os');
                setUsuario(us);
                return {status:'sucesso',code:0,mensagem:'sucesso',retorno:{almApp:httpsAl,user:usr,mail:mail,pass:pass,OS:OsIniciada,erros:null}};
            }
            //console.log('294=>','alimentação=>',httpsAl+'\nusuario=>',usr+'\nemail=>',mail+'\nsenha=>',pass+'\nOs iniciada=>',OsIniciada+'\n')
            if(errorsLoad === null){
                setDataLoaded(true);
                return {status:'sucesso',code:0,mensagem:'sucesso',retorno:{almApp:httpsAl,user:usr,mail:mail,pass:pass,OS:OsIni,erros:null}};
            }else{
                //console.log('297=>',errorsLoad)
                //console.log('302=>',errorsLoad)
                return {status:'sucesso',code:298,mensagem:'sucesso',retorno:{almApp:httpsAl,user:usr,mail:mail,pass:pass,OS:OsIni,erros:errorsLoad}};
            }
        } catch (error:any) {
            console.log('259=>',error.message);
            setDataLoaded(true);
            return {status:'com erros',code:0,mensagem:'com erros',retorno:null};//return {status:'sucesso',code:0,mensagem:error.message,retorno:null,erros:errorsLoad};
        }
    }

    async function montanteLoja(id_loja:string,tipo_montagem:string){
        const retorno = await axios({
            method:'get',
            url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,//.filial[0].id
            params:{
                comando:'montanteParceiro',
                id_parceiro:id_loja,
                tipo_montagem:tipo_montagem,
            }
        });
        //console.log(retorno.data[0]);
        if(retorno.data[0].status === 'OK' && retorno.data[0].statusCode === 0){
            setMontantePgmto(retorno.data[0].arrayMontante.percent);
        }
    }

    async function salvarVariaveis(params:any,id_chave:string,valor:string){
        apresentaModal(
            'load',
            'download-multiple',
            'Processando',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <ActivityIndicator size={75} color={'blue'}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Salvando ambiente de trabalho,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{null}
        )
        //console.log('Chave=>',id_chave,'\nValores passados=>',valor)
            //try {
                if(valor === ''){
                    await AsyncStorage.removeItem(id_chave);
                    //const amlApp = await AlimentarApp();

                    //if(amlApp.code ===0){
                        return {status:'sucesso',code:0,mensagem:'Sucesso'};
                    /*}else{
                        return {status:'error',code:293,mensagem:'Erro ao alimentar o aplicativo!'}; 
                    }*/
                }else{
                    const salvar = await AsyncStorage.setItem(id_chave,valor);
                    /*const amlApp = await AlimentarApp();

                    console.log('salvar=>',salvar);
                    if(amlApp.code ===0){*/
                        return {status:'sucesso',code:0,mensagem:'Sucesso'};
                    /*}else{
                        return {status:'error',code:293,mensagem:'erro'}; 
                    }*/
                }
            //} catch (error:any) {
            //    return {status:'error',code:301,mensagem:error.message};
            //}
        /*}*/
        
    }

    async function validarApp(unq:any){
        //rtry {
        const req = await axios({
            method:'get',
            url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
            params:{
                comando:'validarapp',
                id:unq
            }
        });
        
        console.log('retorno da validação do app=>',req);
        if(req !== undefined){
            if(req.data[0].status === 'OK' && req.data[0].statusCode === 200 && req.data[0].dadosApp !== null){
                setAppIsValid(true);
                setAppValidationArray(req.data[0].dadosApp);
                return {status:'sucesso',code:0,mensagem:'sucesso',retorno:req.data[0].dadosApp};
            }else{
                return {status:'erro',code:424,mensagem:'erro',retorno:'Aplicativo não registrado!'};
            }
        }else{
            return {status:'erro',code:426,mensagem:'erro',retorno:'O servidor não conseguiu lidar com a requisição!'};
        }
            /*if(uniqueId === ''){
                
                try {
                    const unq = await AsyncStorage.getItem('idApp');
                    console.log('411=>',unq)
                    if(unq !== '' && unq !== null && unq !== undefined){
                        
                    }
                } catch (error:any) {
                    return {status:'erro',code:429,mensagem:'sucesso',retorno:error.message};
                }
            }else{
                try {
                    const req = await axios({
                        method:'get',
                        url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
                        params:{
                            comando:'validarapp',
                            id:uniqueId
                        }
                    });

                    console.log('retorno da validação do app=>',req);
                    if(req !== undefined){
                        if(req.data[0].status === 'OK' && req.data[0].statusCode === 200 && req.data[0].dadosApp !== null){
                            return {status:'sucesso',code:0,mensagem:'sucesso',retorno:req.data[0].dadosApp};
                        }else{
                            return {status:'erro',code:424,mensagem:'erro',retorno:'Aplicativo não registrado!'};
                        }
                    }else{
                        return {status:'erro',code:426,mensagem:'erro',retorno:'O servidor não conseguiu lidar com a requisição!'};
                    }
                } catch (error:any) {
                    return {status:'erro',code:429,mensagem:'sucesso',retorno:error.message};
                }
            }*/
        /*} catch (error:any) {
            return {status:'erro',code:429,mensagem:'sucesso',retorno:error.message};
        }*/
        
    }

    async function guardarIdUnico(id:string){
        try {
            arlterarModal(
                'light',
                'check-all',
                'Aguarde...',
                ()=>(<View style={[Styles.em_linhaVertical,{marginBottom:20}]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,getModalStyleLabel('light'),{textAlign:'center',marginBottom:20}]}>{msgModal}</Text></View>),
                'light',
                ()=>(null),
                'Salvando seu id único,\n\nAguarde...'
            );

            const result = await AsyncStorage.setItem('idApp',id);
            setUniqueId(id);
            //console.log(result);
            arlterarModal(
                'success',
                'check-all',
                'Sucesso',
                ()=>(<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/><Text style={[Styles.ft_regular,getModalStyleLabel('success'),{textAlign:'center',marginBottom:20,}]}>{'Id único gerado com sucesso,\nSeu id único: "'+id+'"'}</Text></View>),
                'light',
                ()=>(
                    <>
                    <TouchableOpacity 
                        onPress={()=>{setModalVisible(false)}} 
                        style={[Styles.w50,Styles.light,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomLeftRadius:5}]}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight,{}]}>Não</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{setModalVisible(false)}} 
                        style={[Styles.w50,Styles.light,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomRightRadius:5}]}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight,{}]}>Sim</Text>
                    </TouchableOpacity>
                    </>
                ),
                'Id único gerado com sucesso!\n\nSeu ID único:'+id+'\n\nDeseja prosseguir com o cadastro do app?'
            )
            setLoad(false);
            return {status:'sucesso',code:0,mensagem:'sucesso'};
        } catch (error:any) {
            arlterarModal(
                'error',
                'check-all',
                'Erro',
                ()=>(<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/><Text style={[Styles.ft_regular,getModalStyleLabel('success'),{textAlign:'center'}]}>{msgModal}</Text></View>),
                'light',
                ()=>(
                    <>
                    <TouchableOpacity 
                        onPress={()=>{setModalVisible(false)}} 
                        style={[Styles.w50,Styles.light,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomLeftRadius:5}]}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight,{}]}>Não</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{setModalVisible(false)}} 
                        style={[Styles.w50,Styles.light,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomRightRadius:5}]}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight,{}]}>Sim</Text>
                    </TouchableOpacity>
                    </>
                ),
                'Erro ao salvar o id único do aplicativo!\n\nErro: '+error.message
            )
            setLoad(false);
            return {status:'erro',code:525,mensagem:'erro',retorno:error.message};
        }
    }

    async function gerarIdUnico(){
        let id:string|null = '';
        if (Application.getAndroidId) {
            id = Application.getAndroidId();
        } else if (Application.getIosIdForVendorAsync) {
            id = await Application.getIosIdForVendorAsync();
        }
        

        if(id !== ''){
            setUniqueId(id);
            arlterarModal(
                'light',
                'check-all',
                'Agurade...',
                ()=>(<View style={[Styles.em_linhaVertical]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,getModalStyleLabel('light'),{textAlign:'center'}]}>{msgModal}</Text></View>),
                'light',
                ()=>(null),
                'Gerando seu id único do aplicativo,\n\nAguarde...'
            );
            setTimeout(() => {
                guardarIdUnico(id);
            }, 5000);
        }
    }

    async function VerificarRegistro(id:any){
        //console.log(result);
        arlterarModal(
            'success',
            'check-all',
            'Sucesso',
            ()=>(<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/><Text style={[Styles.ft_regular,getModalStyleLabel('success'),{textAlign:'center',marginBottom:20,}]}>{'Id único gerado com sucesso,\nSeu id único: "'+id+'"'}</Text></View>),
            'light',
            ()=>(
                <>
                <TouchableOpacity 
                    onPress={()=>{setModalVisible(false)}} 
                    style={[Styles.w50,Styles.light,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomLeftRadius:5}]}
                >
                    <Text style={[Styles.ft_regular,Styles.lbllight,{}]}>Não</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{setModalVisible(false)}} 
                    style={[Styles.w50,Styles.light,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomRightRadius:5}]}
                >
                    <Text style={[Styles.ft_regular,Styles.lbllight,{}]}>Sim</Text>
                </TouchableOpacity>
                </>
            ),
            'Id único gerado com sucesso!\n\nSeu ID único:'+id+'\n\nDeseja prosseguir com o cadastro do app?'
        )
        setLoad(false);
        return {status:'sucesso',code:0,mensagem:'sucesso'};
    }

    function apresentaModal(idModal:string,iconeM:string,titleM:string,conteudoM:string|ReactNode|ReactElement|Function,styleM:StyleSheet|string,actionsM:Function){
        //console.log('teste de modal','OK=>',idModal,modalVisible)
        switch (idModal) {
            case 'dialog':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setActionsModal(actionsM);
                setModalId(idModal);
                setModalVisible(true);
                break;
            case 'error':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setActionsModal(actionsM);
                setModalId(idModal);
                setModalVisible(true);
                break;
            case 'load':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setActionsModal(actionsM);
                setModalId(idModal);
                setModalVisible(true);
                break;
            case 'success':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setActionsModal(actionsM);
                setModalId(idModal);
                setModalVisible(true);
                break;
            case 'warning':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setActionsModal(actionsM);
                setModalId(idModal);
                setModalVisible(true);
                break;
        }
    }

    function arlterarModal(idModal:string,iconeM:string,titleM:string,conteudoM:string|ReactNode|ReactElement|Function,styleM:StyleSheet|string,actionsM:Function,msgModal:string){
        //console.log('teste de modal','OK=>',idModal,modalVisible)
        switch (idModal) {
            case 'dialog':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setMsgModal(msgModal);
                setActionsModal(actionsM);
                setModalId(idModal);
                break;
            case 'error':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setMsgModal(msgModal);
                setActionsModal(actionsM);
                setModalId(idModal);
                break;
            case 'load':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setMsgModal(msgModal);
                setActionsModal(actionsM);
                setModalId(idModal);
                break;
            case 'success':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setMsgModal(msgModal);
                setActionsModal(actionsM);
                setModalId(idModal);
                break;
            case 'warning':
                setIconeModal(iconeM);
                setTitleModal(titleM);
                setConteudoModal(conteudoM);
                setMsgModal(msgModal);
                setActionsModal(actionsM);
                setModalId(idModal);
                break;
        }
    }

    function fecharModal(idModal:string){
        setIconeModal('');
        setTitleModal('');
        setConteudoModal('');
        setActionsModal(null);
        setModalId(idModal);
        setModalVisible(!modalVisible);
    }

    const getModalStyle = (style:string) => {
        switch (style) {
            case 'danger':
                return Styles.danger;
            case 'warning':
                return Styles.warning;
            case 'success':
                return Styles.success;
            case 'info':
                return Styles.info;
            case 'light':
                return Styles.light;
        }
    };

    const getModalStyleLabel = (style:string) => {
        switch (style) {
            case 'danger':
                return Styles.lbldanger;
            case 'warning':
                return Styles.lblwarning;
            case 'success':
                return Styles.lblsuccess;
            case 'info':
                return Styles.lblinfo;
            case 'light':
                return Styles.lbllight;
        }
    };

    const getModalStyleLabelAlert = (style:string) => {
        switch (style) {
            case 'danger':
                return Styles.alertdanger;
            case 'warning':
                return Styles.alertwarning;
            case 'success':
                return Styles.alertsuccess;
            case 'info':
                return Styles.alertinfo;
            case 'light':
                return Styles.alertlight;
        }
    };

    async function buscarOs(comando:any,filtro:any) {
        apresentaModal(
            'load',
            'download-multiple',
            'Processando',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <ActivityIndicator size={75} style={[getModalStyleLabel('light')]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Buscando ordens de serviço\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{null}
        )
        /*try {*/
            const response = await axios({
              method:'get',
              url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
              params:{
                comando:comando,
                filtro:filtro,
              }
            })
            console.log('lista de os=>',response)
            if(response.data[0].dados !== null){

                setListMinhasOs(response.data[0].dados)
                const retorno = await salvarVariaveis(
                    'listMinhasOs',
                    'listMinhasOs',
                    JSON.stringify(response.data[0].dados)
                )

                if(retorno?.code ===0){
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('',null,null,'');
                    const ret = await AlimentarApp();
                    if(ret.code ===0){
                        //console.log('retorno=>',ret);
                        return {status:'sucesso',code:0,mensagem:'sucesso'};
                    }else{
                        //console.log('retorno=>',ret);
                        return {status:'erro',code:258,mensagem:'erro'};
                    }
                }else{
                    return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                }
            }else{
                setListMinhasOs(response.data[0].dados)
                const retorno = await salvarVariaveis(
                    'listMinhasOs',
                    'listMonhasOs',
                    ''
                )

                if(retorno?.code ===0){
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('',null,null,'');
                    return {status:'sucesso',code:0,mensagem:'sucesso'};
                }else{
                    return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                }
            }
        /*} catch (error:any) {
            return {status:'error',code:622,mensagem:error.message};
        }*/
    }

    async function buscarNotificacoes(id_de:any,id_para:any){
        try {
            axios({
                method:'get',
                url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
                params:{
                    comando:'all_notifications',
                    de:id_de,
                    para:id_para,
                }
            }).then((response)=>{
                setNotificationsCount(response.data[0].dados_notify_app);
                //console.log('response de notifications=>',response.data);
            }).catch((responseCatch)=>{

            })
        } catch (error) {
            
        }
    }

//-----------------------------------------------------tratamento de ações do aplicativo
    // Função para verificar e executar ação conforme o tipo do parâmetro
    function executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string) {
        apresentaModal(
            'load',
            'download-multiple',
            'Processando',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <ActivityIndicator size={75} color={'blue'}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Carregando ambiente de trabalho,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{null}
        );
        switch (comando) {
            case 'login':
                navigation.reset({
                    index:0,
                    routes:[
                        {
                            name:tela
                        }
                    ]
                })
                break;
            case 'iniOs':
                navigation.reset({
                    index:0,
                    routes:[
                        {
                            name:tela
                        }
                    ]
                })
                break;
            case 'fimOs':
                navigation.reset({
                    index:0,
                    routes:[
                        {
                            name:tela
                        }
                    ]
                })
                break;
            default:
                fecharModal('');
                break;
        }
    }
//-------------------------------------------------------fim do tratamento de ações do aplicativo
//tipo do envio: 
    async function IniciarOs(comando:any,localizacao:any,profissional:any,dados:any,codigoStatus:any,os:any,tela:string,acao:Function|ReactElement|ReactNode|undefined|null) {
        switch (comando) {
            case 'iniciarOs':
                apresentaModal(
                    'load',
                    'download-multiple',
                    'Processando',
                    ()=>(
                        <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                            <ActivityIndicator size={75} color={'blue'}/>
                            <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Iniciando ordem de serviço\n\nAguarde...'}</Text>
                        </View>
                    ),
                    'default',
                    ()=>{null}
                )

                /*try {*/
                    const response = await axios({
                        method:'get',
                        url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
                        params:{
                            comando:comando,
                            location:localizacao,
                            id_profissional:profissional,
                            dados:dados,
                            codigo:codigoStatus,
                            os:os,
                        }
                    })
                    //console.log('Ret=>',response.data[0])
                    if(response.data[0] === undefined){
                            arlterarModal(
                                'error',
                                'close-circle',
                                '*_* Erro',
                                ()=>(
                                    <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                                        <MaterialCommunityIcons name='close-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                                        <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'}</Text>
                                    </View>
                                ),
                                'danger',
                                ()=>{
                                    return(
                                        <>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.light,Styles.w50,Styles.btnDialog,Styles.btnDialogLeft]}
                                                onPress={()=>{
                                                    fecharModal('');
                                                }}
                                            >
                                                <Text style={[Styles.ft_medium,Styles.lbllight]}>Não</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.success,Styles.w50,Styles.btnDialog,Styles.btnDialogRight]}
                                                onPress={()=>{
                                                    buscarCoordenadas(tela,dados,codigoStatus,os,()=>{navigation.goBack()},'iniciarOs');
                                                }}
                                            >
                                                <Text style={[Styles.ft_medium,Styles.lblsuccess]}>Sim</Text>
                                            </TouchableOpacity>
                                        </>
                                    )
                                },
                                'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'
                            )

                            return {status:'erro',code:0,mensagem:'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor',retorno:null};
                    }else if(response.data[0].status === 'OK' && response.data[0].statusCode === 0){
                        const retorno = response.data[0];
                        return {status:'sucesso',code:0,mensagem:'sucesso',retorno:retorno};
                    }
                /*} catch (error:any) {
                    return {status:'error',code:0,mensagem:error.message,retorno:null};
                }*/
                break;
            case 'finalizarOs':
                const retorno = await uploadImages(dados.dadosOs,dados.dadosOs,localizacao,profissional,os,1200);

                if(retorno.code === 0){
                    return {status:'sucesso',code:0,mensagem:'Ordem de serviço finalizada com sucesso!',location:null};
                }else{
                    return {status:'Erro',code:739,mensagem:retorno.mensagem,location:null};
                }
                break;
            case 'relatarProblema':
                apresentaModal(
                    'load',
                    'download-multiple',
                    'Processando',
                    ()=>(
                        <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                            <ActivityIndicator size={75} color={'blue'}/>
                            <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Relatando problema,\n\nAguarde...'}</Text>
                        </View>
                    ),
                    'default',
                    ()=>{null}
                )

                /*try {*/
                    const responseProblema = await axios({
                        method:'get',
                        url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
                        params:{
                            comando:comando,
                            location:localizacao,
                            id_profissional:profissional,
                            dados:dados,
                            codigo:codigoStatus,
                            os:os,
                        }
                    })
                    //console.log('Ret=>',responseProblema.data[0])
                    if(responseProblema.data[0] === undefined){
                            arlterarModal(
                                'error',
                                'close-circle',
                                '*_* Erro',
                                ()=>(
                                    <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                                        <MaterialCommunityIcons name='close-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                                        <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'}</Text>
                                    </View>
                                ),
                                'danger',
                                ()=>{
                                    return(
                                        <>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.light,Styles.w50,Styles.btnDialog,Styles.btnDialogLeft]}
                                                onPress={()=>{
                                                    fecharModal('');
                                                }}
                                            >
                                                <Text style={[Styles.ft_medium,Styles.lbllight]}>Não</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.success,Styles.w50,Styles.btnDialog,Styles.btnDialogRight]}
                                                onPress={()=>{
                                                    buscarCoordenadas(tela,dados,codigoStatus,os,()=>{navigation.goBack()},'iniciarOs');
                                                }}
                                            >
                                                <Text style={[Styles.ft_medium,Styles.lblsuccess]}>Sim</Text>
                                            </TouchableOpacity>
                                        </>
                                    )
                                },
                                'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'
                            )

                            return {status:'erro',code:0,mensagem:'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor',retorno:null};
                    }else if(responseProblema.data[0].status === 'OK' && responseProblema.data[0].statusCode === 0){
                        const retorno = responseProblema.data[0];
                        return {status:'sucesso',code:0,mensagem:'sucesso',retorno:retorno};
                    }
                /*} catch (error:any) {
                    return {status:'error',code:0,mensagem:error.message,retorno:null};
                }*/
                break;
        }
        
    }

    async function OsIniciada(dadosOs:any,param_1:any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string){
        apresentaModal(
            'load',
            'download-multiple',
            'Processando',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <ActivityIndicator size={75} color={'blue'}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Salvando ordem de serviço,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{null}
        )
        try {
            if(dadosOs === ''){
                await AsyncStorage.removeItem('OsIniciada');
                const amlApp = await AlimentarApp()

                if(amlApp.code ===0){
                    return {status:'sucesso',code:0,mensagem:'sucesso'};
                }else{
                    return {status:'error',code:774,mensagem:'Erro ao alimentar o app'};
                }
            }else{
                await AsyncStorage.setItem('OsIniciada',dadosOs);
                const amlApp = await AlimentarApp();
                    
                if(amlApp.code ===0){
                    return {status:'sucesso',code:0,mensagem:'Sucesso'};
                }else{
                    return {status:'error',code:293,mensagem:'Erro ao alimentar o aplicativo!'}; 
                }
            }
        } catch (error:any) {
            return {status:'error',code:781,mensagem:error.message};
        }
    }

    async function buscarCoordenadas(tela:string,DadosOs:any,codigoStatusOs:number,os:number|string,acao?:Function|ReactElement|ReactNode|undefined,comando:string){
        //roda o modal load 
        arlterarModal(
            'load',
            'archive-check',
            'Processando pedido...',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <ActivityIndicator size={75} color={'blue'}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Carregando localização\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{null},
            'Carregando localização\n\nAguarde...'
        )
        //tenta pegar a localização
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Permissão para acessar localização foi negada.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            if(location){
                return {status:'sucesso',code:0,mensagem:'sucesso',location:location};
            }
            return {status:'error',code:788,mensagem:'Location não carregado!'};
        } catch (error:any) {
            return {status:'error',code:785,mensagem:error.message};
        }
        
    }
//-----------------------------------------------------inicio das funções da imagens da os
    const uploadImages = async (osDados:any,dados:any,loc:string,prof:string,os:string,statusOs:number) => {
        await AlimentarApp();
        //console.log(imagensAmbiente,imagensEmbalagem,imagensMontado)
        //setModalVisible(!modalVisible);
        //console.log('|Imagens embalagem=>',imagensEmbalagem,'|Imagens montado=>',imagensMontado,'|Imagens Ambiente=>',imagensAmbiente)
        //setMsg('Processando informações da O.S.\n\nAguarde...');
        let formData = new FormData();
        //adiciona as imagens ao formdata
        const addImagesToFormData = (images:any, fieldName:any) => {
            if(images !== null){
                //console.log('Imagem(ns)=>',images)
                
                images.forEach((imageUri:any, index:number) => {
                    if(imageUri.url === undefined){
                        let uriParts = imageUri.split('.');
                        let carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                        let fileType = uriParts[uriParts.length - 1];
                        //console.log('669=>',uriParts,'\n\nCaminho:=>',imageUri);
                        formData.append('arquvios[]', {
                            uri: imageUri.url,
                            name: `${fieldName.replace('[]','')}_${carimbo}.${fileType}`,
                            type: `image/${fileType}`,
                        });
                    }else{
                        let uriParts = (imageUri.url).split('.');
                        let carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                        let fileType = uriParts[uriParts.length - 1];
                        //console.log('669=>',uriParts,'\n\nCaminho:=>',imageUri);
                        formData.append('arquivos[]', {
                            uri: imageUri.url,
                            name: `${fieldName.replace('[]','')}_${carimbo}.${fileType}`,
                            type: `image/${fileType}`,
                        });
                    }
                    
                });
            }else{
                //console.log('Erro nas imagens=>')
                switch (fieldName) {
                    case 'imagensmbalagem[]':
                        navigation.navigate('home os');
                        //error.push({'Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"']);                        
                        //setModalVisible(false);
                        //setMsg('');
                        break;
                    case 'imagensontagem[]':
                        //error.push({'Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"']);                        
                        //setModalVisible(false);
                        //setMsg('');
                        break;
                    case 'imagensmbiente[]':
                        //error.push({'Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"']);                        
                        //setModalVisible(false);
                        //setMsg('');
                    break;
                }
            }
        };
        //adiciona as imagens ao formData
        addImagesToFormData(imagensEmbalagem, 'imagensEmbalagem');
        addImagesToFormData(imagensMontado, 'imagensMontagem');
        addImagesToFormData(imagensAmbiente, 'imagensAmbiente');
        
    
        // Adicione os dados da ordem de serviço (osDados) ao FormData
        formData.append('osDados', JSON.stringify(osDados));
        formData.append('os',os);
        formData.append('usuario',prof);
        formData.append('comando','finalizarOs');
        formData.append('location',loc);
        formData.append('codigoStatus',''+statusOs+'');
        //tenta enviar a requisição para api
        //setMsg('Enviando imagens e informações da O.S.\n\nAguarde...');
        try {
            const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            //console.log('Sucesso 695=>',response.data)//response.config.data._parts);
            //console.log('formData=>',formData.parts_[0].imagensEmbalagem);
            if(response.data[0].status === 'OK' && response.data[0].statusCode === 0){
                    //setModalVisible(false);
                    arlterarModal(
                        'success',
                        'check-all',
                        'Finalizado',
                        ()=>(
                            <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('success'),{}]}>
                                <MaterialCommunityIcons name='check-circle' size={75} style={[getModalStyleLabel('success'),{marginBottom:20}]}/>
                                <Text style={[Styles.w100,Styles.ft_bold,getModalStyleLabel('success'),{textAlign:'center',marginBottom:20}]}>{response.data[0].statusMensagem}</Text>
                            </View>
                        ),
                        'success',
                        ()=>(
                            <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                                <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogcentered,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}
                                    onPress={()=>{
                                        setOsIniciada({status:false,dadosOs:null,tela:'home os'});
                                        salvarVariaveis('OsIniciada','OsIniciada',JSON.stringify({status:false,dadosOs:null,tela:'home os'}));
                                        fecharModal('');
                                        
                                        setTimeout(() => {
                                            executarAcao('fimOs','','','home os');
                                        }, 3000);
                                    }}
                                >
                                    <Text style={[Styles.ft_regular,Styles.lbllight]}>Continuar!</Text>
                                </TouchableOpacity>
                            </View>
                        ),
                        ''+response.data[0].statusMensagem+''
                    )
                    return {status:'sucesso',code:0,mensagem:'Ordem de serviço finalizada com sucesso!',location:null};
            }else{
                    setModalVisible(false);
                    return {status:'error',code:914,mensagem:'Erro ao finalizar a ordem de serviço!',location:null};
            }
        } catch (error:any) {
            setModalVisible(false);
            return {status:'error',code:914,mensagem:'Erro ao finalizar a ordem de serviço!\n\n'+error.message,location:null};
        }
    };
//-----------------------------------------------------fim das funções da imagens da os
    async function carregarTodasImagens(){
        const carregarImagensAmbiente = async () => {
            const inicioOs = await AsyncStorage.getItem('imagens_ambiente');
            if (inicioOs !== null) {
                setImagensAmbiente(JSON.parse(inicioOs));
            }
        };

        const carregarImagensEmbalagem = async () => {
            const inicioOs = await AsyncStorage.getItem('imagens_embalagem');
            if (inicioOs !== null) {
                setImagensEmbalagem(JSON.parse(inicioOs));
            }
        };

        const carregarImagensMontagem = async () => {
            const inicioOs = await AsyncStorage.getItem('imagens_montagem');
            if (inicioOs !== null) {
                setImagensMontado(JSON.parse(inicioOs));
            }
        };

        const carregarImagensProblema = async () => {
            const inicioOs = await AsyncStorage.getItem('imagens_problemas');
            if (inicioOs !== null) {
                setImagensProblema(JSON.parse(inicioOs));
            }
        };

        carregarImagensAmbiente();
        carregarImagensEmbalagem();
        carregarImagensMontagem();
        carregarImagensProblema();
        return {status:'sucesso',code:0,mensagem:'Imagem adicionada com sucesso!',retorno:'OK'};
    }

    const adicionarImagemEmbalagem = async (dados:any) => {
        //console.log('para atualização do status=>',dados)
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            base64: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            const coordenadas = await buscarCoordenadas('embalagem',null,1100,0,()=>{null},'');
            if(coordenadas?.code ===0){
                const novaImagem = {url:result.assets[0].uri,location:coordenadas?.location,dataInicio:dataLocal+' '+horaLocal};
                const novasImagens:any|null = imagensEmbalagem ? [...imagensEmbalagem, novaImagem] : [novaImagem];
                setImagensEmbalagem(novasImagens);
                await AsyncStorage.setItem('imagens_embalagem', JSON.stringify(novasImagens));
                return carregarTodasImagens()
            }
        }
    };

    const removerImagemEmbalagem = async (index: number) => {
        // Verifica se o índice fornecido é válido
        if (index < 0 || index >= imagensEmbalagem.length) {
            arlterarModal(
                'danger',
                'check-all',
                'Erro',
                ()=>(
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                ()=>{
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>OK!</Text>
                    </TouchableOpacity>
                },
                ''
            )
            console.error(`Índice inválido para remoção de imagem: ${index}`);
            return;
        }
    
        // Remove a imagem do estado
        const novasImagens = imagensEmbalagem.filter((_, idx) => idx !== index);
        setImagensEmbalagem(novasImagens);
    
        // Atualiza o AsyncStorage
        await AsyncStorage.setItem('imagens_embalagem', JSON.stringify(novasImagens));
    
        // Carrega todas as imagens novamente (se necessário)
        carregarTodasImagens();
        arlterarModal(
            'success',
            'check-all',
            'Sucesso',
            ()=>(
                <>
                    <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{marginBottom:25}]}>Imagem excluida com sucesso!</Text>
                </>
            ),
            'success',
            ()=>{
                return(
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>Fechar</Text>
                    </TouchableOpacity>
                )
            },
            ''
        )
    };

    const adicionarImagemAmbiente = async (tipoImagem:any) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            base64: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            const coordenadas = await buscarCoordenadas('embalagem',null,1100,0,()=>{null},'');
            if(coordenadas?.code ===0){
                const novaImagem = {url:result.assets[0].uri,location:coordenadas?.location,dataInicio:dataLocal+' '+horaLocal};
                const novasImagens:any|null = imagensAmbiente ? [...imagensAmbiente, novaImagem] : [novaImagem];
                setImagensAmbiente(novasImagens);
                await AsyncStorage.setItem('imagens_ambiente', JSON.stringify(novasImagens));
                return carregarTodasImagens()
            }
        }
    };

    const removerImagemAmbiente = async (index: number) => {
        // Verifica se o índice fornecido é válido
        if (index < 0 || index >= imagensAmbiente.length) {
            arlterarModal(
                'danger',
                'check-all',
                'Erro',
                ()=>(
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                ()=>{
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>OK!</Text>
                    </TouchableOpacity>
                },
                ''
            )
            console.error(`Índice inválido para remoção de imagem: ${index}`);
            return;
        }
    
        // Remove a imagem do estado
        const novasImagens = imagensAmbiente.filter((_, idx:any) => idx !== index);
        setImagensEmbalagem(novasImagens);
    
        // Atualiza o AsyncStorage
        await AsyncStorage.setItem('imagens_ambiente', JSON.stringify(novasImagens));
    
        // Carrega todas as imagens novamente (se necessário)
        carregarTodasImagens();
        arlterarModal(
            'success',
            'check-all',
            'Sucesso',
            ()=>(
                <>
                    <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{marginBottom:25}]}>Imagem excluida com sucesso!</Text>
                </>
            ),
            'success',
            ()=>{
                return(
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>Fechar</Text>
                    </TouchableOpacity>
                )
            },
            ''
        )
    };

    const adicionarImagemProblema = async (tipoImagem:any) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            base64: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            const coords = await buscarCoordenadas('problema',null,1100,0,()=>{null},'');

            if(coords?.code === 0){
                const novaImagem = {url:result.assets[0].uri,location:coords,dataInicio:dataLocal+' '+horaLocal};
                const novasImagens:any|null = imagensProblema ? [...imagensProblema, novaImagem] : [novaImagem];
                setImagensProblema(novasImagens);
                await AsyncStorage.setItem('imagens_problemas', JSON.stringify(novasImagens));
                carregarTodasImagens()
                showToastWithGravityAndOffset('Imagem adicionada com sucesso!');
                fecharModal('');
            }else{
                showToastWithGravityAndOffset('Erro ao adicionar a imagem!');
                fecharModal('');
            }
            
        }
    };

    const showToastWithGravityAndOffset = (mensagem:string) => {
        ToastAndroid.showWithGravityAndOffset(
            mensagem,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        );
    };

    const removerImagemProblema = async (index: number) => {
        // Verifica se o índice fornecido é válido
        if (index < 0 || index >= imagensProblema.length) {
            arlterarModal(
                'danger',
                'check-all',
                'Erro',
                ()=>(
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                ()=>{
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>OK!</Text>
                    </TouchableOpacity>
                },
                ''
            )
            console.error(`Índice inválido para remoção de imagem: ${index}`);
            return;
        }
    
        // Remove a imagem do estado
        const novasImagens = imagensProblema.filter((_, idx:any) => idx !== index);
        setImagensEmbalagem(novasImagens);
    
        // Atualiza o AsyncStorage
        await AsyncStorage.setItem('imagens_problemas', JSON.stringify(novasImagens));
    
        // Carrega todas as imagens novamente (se necessário)
        showToastWithGravityAndOffset('Imagem excluída com sucesso!');
        carregarTodasImagens();
        /*arlterarModal(
            'success',
            'check-all',
            'Sucesso',
            ()=>(
                <>
                    <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{marginBottom:25}]}>Imagem excluida com sucesso!</Text>
                </>
            ),
            'success',
            ()=>{
                return(
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>Fechar</Text>
                    </TouchableOpacity>
                )
            },
            ''
        )*/
    };

    async function limparImagens(){
        setImagensEmbalagem(null);
        setImagensMontado(null);
        setImagensAmbiente(null)
        try {
            await AsyncStorage.removeItem('imagens_embalagem');
            await AsyncStorage.removeItem('imagens_montagem');
            await AsyncStorage.removeItem('imagens_ambiente');
            //console.log('Sucesso ao remover todas as imagens.');
            carregarTodasImagens();
            return {status:'Sucesso',code:0,retorno:'imagens limpas com sucesso!'};
        } catch (error:any) {
            console.log('Erro ao remover todas as imagens.');
            return {status:'Erro',code:1562,retorno:error.message};
        }
    }

    const adicionarImagemMontagem = async (tipoImagem:any) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            base64: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            const coordenadas = await buscarCoordenadas('embalagem',null,1100,0,()=>{null},'');

            if(coordenadas?.code ===0){
                const novaImagem = {url:result.assets[0].uri,location:coordenadas?.location,dataInicio:dataLocal+' '+horaLocal};
                const novasImagens:any = imagensMontado ? [...imagensMontado, novaImagem] : [novaImagem];
                setImagensMontado(novasImagens);
                await AsyncStorage.setItem('imagens_montagem', JSON.stringify(novasImagens));
                return carregarTodasImagens()
            }
        }
    };

    const removerImagemMontado = async (index: number) => {
        // Verifica se o índice fornecido é válido
        if (index < 0 || index >= imagensMontado.length) {
            arlterarModal(
                'danger',
                'check-all',
                'Erro',
                ()=>(
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                ()=>{
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>OK!</Text>
                    </TouchableOpacity>
                },
                ''
            )
            console.error(`Índice inválido para remoção de imagem: ${index}`);
            return;
        }
    
        // Remove a imagem do estado
        const novasImagens = imagensMontado.filter((_, idx:any) => idx !== index);
        setImagensMontado(novasImagens);
    
        // Atualiza o AsyncStorage
        await AsyncStorage.setItem('imagens_montado', JSON.stringify(novasImagens));
    
        // Carrega todas as imagens novamente (se necessário)
        carregarTodasImagens();
        arlterarModal(
            'success',
            'check-all',
            'Sucesso',
            ()=>(
                <>
                    <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{marginBottom:25}]}>Imagem excluida com sucesso!</Text>
                </>
            ),
            'success',
            ()=>{
                return(
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>Fechar</Text>
                    </TouchableOpacity>
                )
            },
            ''
        )
    };

    async function enviarImagensFinalizadas(comando:string,imagens:any,assinatura:any){
        try {
            let formData = new FormData();
            
            const addImagesToFormData = (images:any, fieldName:any) => {
                if(images !== null){
                    images.forEach((imageUri:any, index:number) => {
                        let uriParts = imageUri.split('.');
                        let fileType = uriParts[uriParts.length - 1];
                        //console.log('669=>',uriParts,'\n\nCaminho:=>',imageUri);
                        formData.append(fieldName, {
                        uri: imageUri,
                        name: `${fieldName}.${fileType}`,
                        type: `image/${fileType}`,
                        });
                    });
                }else{
                    switch (fieldName) {
                        case 'imagensmbalagem[]':
                            Alert.alert('Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"');
                            setModalVisible(false);
                            //setMsg('');
                            break;
                        case 'imagensontagem[]':
                            Alert.alert('Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"');
                            setModalVisible(false);
                            //setMsg('');
                            break;
                        case 'imagensmbiente[]':
                            Alert.alert('Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"');
                            setModalVisible(false);
                            //setMsg('');
                        break;
                    }
                }
            };

            formData.append('comando','verificarImagens');
            formData.append('arquivoAss',{
                uri: assinatura,
                name: `arquivoAss`,
                type: `image/jpg`,
            })


            await axios.post(Config.configuracoes.pastaProcessos, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response)=>{
                //console.log('Retorno do response=>',response.data)
                return response;
            }).catch((responseError)=>{
                //console.log('Erro no catch=>',responseError);
                return responseError;
            })
        } catch (error) {
            //console.log('Erro no response=>',error)
            return error;
        }
    }
//-----------------------------------------------------fim das funções da imagens da os
//-----------------------------------------------------começo das configurações de assinatura
    // Função para manipular a imagem (opcional: salvar na galeria)
    const manipulateAndSaveImage = async (uri:any) => {
        try {
            // Manipula a imagem (por exemplo, redimensionar, comprimir, etc.)
            const manipulatedImage = await manipulateAsync(
                uri,
                [{ resize: { width: 800 } }], // Exemplo de redimensionamento
                { compress: 0.7, format:SaveFormat.JPEG} // Exemplo de compressão e formato
            );
        
            // Salva a imagem manipulada na galeria (opcional)
            const savedImage = await manipulateAsync(manipulatedImage.uri);
            //console.log('Imagem salva na galeria:', savedImage);
        
            return manipulatedImage.uri;
        } catch (error) {
            console.error('Erro ao manipular e salvar a imagem:', error);
            return null;
        }
    };

    const saveCanvasAsImage = async () => {
        try {
            // Captura a visualização do Canvas como uma imagem base64
            const uri = await captureCanvas();
    
            // Realiza a rotação da imagem (opcional)
            const rotatedImageUri = await rotateImage(uri);

            // Manipula e salva a imagem (opcional)
            const manipulatedImageUri = await manipulateAndSaveImage(rotatedImageUri);
            //console.log('Imagem manipulada:', manipulatedImageUri);

            const enviarImagens = await enviarImagensFinalizadas('arquivoAss',null,uri);
            // Define a imagem capturada para exibição na interface (opcional)
            //setCapturedImage(rotatedImageUri);
            apresentaModal(
                'success',
                'alert-circle',
                'Sucesso',()=>(
                    <View style={[Styles.em_linhaVertical]}>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('success')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{marginBottom:25}]}>{'Montagem finalizada com sucesso!\nSalvamos em:\n\n'+rotatedImageUri}</Text>
                    </View>
                ),'success',
                ()=>(
                    <TouchableOpacity style={[Styles.w100,Styles.btn,Styles.em_linhaHorizontal,Styles.success,{marginHorizontal:0,marginVertical:0,borderBottomLeftRadius:5,borderBottomRightRadius:5}]}
                        onPress={()=>{fecharModal('')}}
                    >
                        <Text style={[Styles.lblsuccess,Styles.ft_regular]}>OK!</Text>
                    </TouchableOpacity>
                )
            );
            //buscarCoordenadas('assinatura',osInicada.dadosOs.dadosOs.dadosOs,1200,osInicada.dadosOs.dadosOs.dadosOs.os,()=>{navigation.navigate('home os')})//uploadImages(osDados:any,dados:any,loc:string,prof:string)
            // Envia a imagem para o servidor (substitua com sua lógica de envio)
            //enviarImagemParaServidor(rotatedImageUri);
        } catch (error:any) {
            apresentaModal(
                'error',
                'alert-circle',
                'Erro',()=>(
                    <View style={[Styles.em_linhaVertical]}>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('danger'),{marginBottom:25}]}>{'Erro grave no app:\n\nEncontramos um erro ao salvar ou enviar a imagem.'}</Text>
                    </View>
                ),'danger',
                ()=>(
                    <TouchableOpacity style={[Styles.w100,Styles.btn,Styles.em_linhaHorizontal,Styles.success,{marginHorizontal:0,marginVertical:0,borderBottomLeftRadius:5,borderBottomRightRadius:5}]}
                        onPress={()=>{fecharModal('')}}
                    >
                        <Text style={[Styles.lblsuccess,Styles.ft_regular]}>OK!</Text>
                    </TouchableOpacity>
                ));
            //Alert.alert('Erro', 'Não foi possível salvar a imagem.');
        }
    };

    const rotateImage = async (imageUri: string|any) => {
        try {
            // Realiza a rotação da imagem utilizando expo-image-manipulator
            //console.log('imagem=>',imageUri);
            
            const manipulatedImage = await manipulateAsync(
            imageUri,
            [{ rotate: 90 }], // Configuração de rotação (90 graus no exemplo)
            { compress: 1, format:SaveFormat.JPEG }
            );
            return manipulatedImage.uri;
        } catch (error) {
            console.log('2970=>',error);
        }
        
    };

    const captureCanvas = async () => {
        try {
            // Captura a visualização do Canvas como uma imagem
        const uri = await captureRef(canvasRef, { format: 'jpg', quality: 1 });
        return uri;
        } catch (error) {
            console.log('2981=>',error);
        }
        
    };

    async function logof(acao:Function){
        apresentaModal(
            'load',
            'logout',
            'realizando logoff',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100]}>
                    <ActivityIndicator size={75} color={'blue'} animating={true} style={[{marginBottom:20}]}/>
                    <Text style={[Styles.ft_medium,{marginBottom:20,textAlign:'center'}]}>{'Realizando logoff\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{null}
        )
        try {
            await AsyncStorage.removeItem('usuario');
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('senha');
            setUsuario(null);
            setEmail(null);
            setSenha(null);

            arlterarModal(
                'success',
                'check-all',
                'Realizado com sucesso',
                ()=>(
                    <View style={[Styles.em_linhaVertical,Styles.w100]}>
                        <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{marginBottom:20,textAlign:'center'}]}>{'Logoff, Realizado com sucesso!'}</Text>
                    </View>
                ),
                'success',
                ()=>{null},
                'Logoff, Realizado com sucesso!'
            )
            setTimeout(() => {
                fecharModal('');
                navigation.navigate('home');
            }, 3000);
        } catch (error) {
            
        }
    }
//-----------------------------------------------------fim
//
    async function sendNotification(comando:string,params:any) {
        switch (comando) {
            case 'montador':
                try {
                    await axios({
                        method:'get',
                        url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
                        params:{
                            comando:'sendnotification',
                            directionTo:comando,
                            assunto:params.assunto,
                            de:params.de,
                            para:params.para,
                            mensagem:params.mensagem,
                            prioridade:params.prioridade,
                        }
                    }).then((response)=>{
                        //console.log(response.data);
                    }).catch(()=>{

                    })
                } catch (error) {
                    
                }
                apresentaModal(
                    'success',
                    'check-all',
                    'sucesso',
                    ()=>(
                        <View style={[Styles.em_linhaVertical,getModalStyle('success'),{marginBottom:20}]}>
                            <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/>
                            <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{textAlign:'center'}]}>{'Notificação enviada com sucesso\n\nAguarde o retorno...'}</Text>
                        </View>
                    ),
                    'success',
                    ()=>(
                        <View style={[Styles.em_linhaHorizontal,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}>
                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.btnDialog,Styles.btnDialogcentered,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}
                                onPress={()=>{
                                    fecharModal('');
                                    navigation.goBack();
                                }}
                            >
                                <Text style={[Styles.ft_regular]}>OK!</Text>
                            </TouchableOpacity>
                        </View>
                    )
                )
                break;
            case 'logista':

                break;
            case 'admin':

                break;
        }
    }
//
//
    async function testeConfig(url:any){
        apresentaModal(
            'load',
            'connection',
            'Teste de API',
            ()=>(
                <View style={[Styles.w100,Styles.em_linhaVertical,getModalStyle('default')]}>
                    <ActivityIndicator size={75} animating color={'blue'} style={[{marginBottom:20}]}/>
                    <Text style={[Styles.ft_medium,{textAlign:'center'}]}>{'testando conexão,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{null}
        )
        try {
            await axios({
                method:'get',
                url:url,
            }).then((response)=>{
                if(response.status === 200){
                    arlterarModal(
                        'success',
                        'connection',
                        'Sucesso!',
                        ()=>(
                            <View style={[Styles.w100,Styles.em_linhaVertical,getModalStyle('default')]}>
                                <MaterialCommunityIcons name='check-circle' size={75} style={[getModalStyleLabel('success'),{marginBottom:20}]}/>
                                <Text style={[Styles.ft_medium,{textAlign:'center',marginBottom:20}]}>{'Teste para API: "'+url+'",\n\n Bem sucedida!'}</Text>
                            </View>
                        ),
                        'default',
                        ()=>{null},
                        'Teste para API: "'+url+'", Bem sucedida!'
                    )
                }else{

                }
                //console.log('Retorno do teste=>',response.status);
            }).catch((responseCatch)=>{

            })
        } catch (error) {
            
        }
    }
//
//
    async function buscarEmpresas(comando:string,perfil:string){

        try {
            const response = await axios({
                method:'get',
                url:httpAlimentacao === null || httpAlimentacao === undefined || httpAlimentacao === '' ? Config.configuracoes.pastaProcessos : httpAlimentacao,
                params:{
                    comando:comando,
                    filters:perfil,
                }
            })
            //console.log('alimentação do app=>',httpAlimentacao,'\nResposta servidor=>',response.data);
            if(response.data[0].status === 'OK' && response.data[0].statusCode === 0){
                const retorno = response.data[0];
                setListParceiros(response.data[0].empresas);
                return {status:'sucesso',code:0,mensagem:'sucesso',retorno:retorno};
            }
            //console.log('retorno das empresas=>',response)
        } catch (error:any) {
            //console.log(error)
            return {status:'Erro',code:0,mensagem:error.message,retorno:null};
            
        }
    }

    async function faturamento(comando:any,dataInicial:any,dataFinal:any,idEmpresa:string,User:string){
        try {
            const response = await axios({
              method:'get',
              url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
              params:{
                comando:comando,
                dataInicial:dataInicial,
                dataFinal:dataFinal,
                id_user:idEmpresa,
                id_loja:User,
              }
            })
            console.log('lista de faturamentos=>',response)
            if(response.data[0].status === 'OK' && response.data[0].statusCode ===200){
                if(response.data[0].faturamento !== null){
                    
                    setItemsFat(response.data[0].faturamento)
                    setQtdOs(response.data[0].qtdOs);
                    setTotalFat(response.data[0].totalFat);
                    const retorno = await salvarVariaveis(
                        'Faturamento',
                        'Faturamento',
                        JSON.stringify(response.data[0].faturamento)
                    )

                    if(retorno?.code ===0){
                        setLoad(false)
                        //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                        executarAcao('',null,null,'');
                        return {status:'sucesso',code:0,mensagem:'sucesso',return:response.data[0].faturamento};
                    }else{
                        return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                    }
                }else{
                    setItemsFat(response.data[0].faturamento)
                    setQtdOs(0);
                    setTotalFat(0);
                    const retorno = await salvarVariaveis(
                        'Faturamento',
                        'Faturamento',
                        ''
                    )

                    if(retorno?.code ===0){
                        setLoad(false)
                        //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                        executarAcao('',null,null,'');
                        return {status:'sucesso',code:0,mensagem:'sucesso',return:response.data[0].faturamento};
                    }else{
                        return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                    }
                }
            }else{
                setItemsFat(response.data[0].faturamento)
                    setQtdOs(0);
                    setTotalFat(0);
                    const retorno = await salvarVariaveis(
                        'Faturamento',
                        'Faturamento',
                        ''
                    )

                    if(retorno?.code ===0){
                        setLoad(false)
                        //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                        executarAcao('',null,null,'');
                        return {status:'sucesso',code:0,mensagem:'sucesso'};
                    }else{
                        return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                    }
            }
        } catch (error:any) {
            return {status:'error',code:622,mensagem:error.message};
        }
    }

    async function parceiroSearch(comando:any,idEmpresa:string){
        try {
            const response = await axios({
              method:'get',
              url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
              params:{
                comando:comando,
                id:idEmpresa
              }
            })
            //console.log('lista de parceiros=>',response.data[0].parceiros)
            if(response.data[0].parceiros !== null){
                
                setParceiros(response.data[0].parceiros)
                const retorno = await salvarVariaveis(
                    'parceiros',
                    'parceiros',
                    JSON.stringify(response.data[0].parceiros)
                )

                if(retorno?.code ===0){
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('',null,null,'');
                    return {status:'sucesso',code:0,mensagem:'sucesso'};
                }else{
                    return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                }
            }else{
                setParceiros(response.data[0].parceiros)
                const retorno = await salvarVariaveis(
                    'parceiros',
                    'parceiros',
                    ''
                )

                if(retorno?.code ===0){
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('',null,null,'');
                    return {status:'sucesso',code:0,mensagem:'sucesso'};
                }else{
                    return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                }
            }
        } catch (error:any) {
            return {status:'error',code:622,mensagem:error.message};
        }
    }

    async function fechamentos(comando:any,idEmpresa:string,user:any,data_ini:any,data_fim:any){
        try {
            const response = await axios({
              method:'get',
              url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
              params:{
                comando:comando,
                loja:idEmpresa,
                user:user,
                dt_ini:data_ini,
                dt_fim:data_fim,
              }
            })
            //console.log('lista de fechamentos=>',response)
            if(response.data[0].fechamentos !== null){
                
                setFechamentos_(response.data[0].fechamentos)
                const retorno = await salvarVariaveis(
                    'fechamentos',
                    'fechamentos',
                    JSON.stringify(response.data[0].fechamentos)
                )

                if(retorno?.code ===0){
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('',null,null,'');
                    return {status:'sucesso',code:0,mensagem:'sucesso'};
                }else{
                    return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                }
            }else{
                setFechamentos_(response.data[0].fechamentos)
                const retorno = await salvarVariaveis(
                    'fechamentos',
                    'fechamentos',
                    ''
                )

                if(retorno?.code ===0){
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('',null,null,'');
                    return {status:'sucesso',code:0,mensagem:'sucesso'};
                }else{
                    return {status:'error',code:581,mensagem:'Erro ao buscar as ordens de serviço!'};
                }
            }
        } catch (error:any) {
            return {status:'error',code:622,mensagem:error.message};
        }
    }

    async function IniciarOsOffline(comando:any,localizacao:any,profissional:any,dados:any,codigoStatus:any,os:any,tela:string,acao:Function|ReactElement|ReactNode|undefined|null){
        switch (comando) {
            case 'iniciarOs':
                // Atualizar o status
                dados.status = codigoStatus;

                // Adicionar imagens ao array imagens_caixa
                //dados.imagens_caixa.push(imagensEmbalagem);

                // Verificar o resultado
                //console.log(dados);
                setListMinhasOs(dados)
                const retorno = await salvarVariaveis(
                    'listMinhasOs',
                    'listMonhasOs',
                    JSON.stringify(dados)
                )

                if(retorno?.code ===0){
                    return {status:'sucesso',code:0,mensagem:'sucesso',retorno:retorno};
                }else{
                    return {status:'erro',code:2168,mensagem:'erro',retorno:retorno};
                }
                break;
        
            case 'finalizarOs':
                // Atualiza o status da OS
                dados.status = codigoStatus;

                // Adiciona as imagens aos arrays correspondentes
                try {
                    dados.imagens_caixa = dados.imagens_caixa || []; // Garante que é um array
                    dados.imagens_caixa.push(imagensEmbalagem);
                } catch (error) {
                    console.log('Erro em: ', 'imagens Caixa');
                }

                try {
                    dados.imagens_montados = dados.imagens_montados || [];
                    dados.imagens_montados.push(imagensMontado);
                } catch (error) {
                    console.log('Erro em: ', 'imagens Montados');
                }

                try {
                    dados.imagens_ambiente = dados.imagens_ambiente || [];
                    dados.imagens_ambiente.push(imagensAmbiente);
                } catch (error) {
                    console.log('Erro em: ', 'imagens Ambiente');
                }

                // Filtra a OS a ser removida da lista principal
                let listMinhasOs_ = listMinhasOs || []; // Garante que a lista está inicializada
                let novaOsList = listMinhasOs_.filter(item => item.os !== dados.os);

                //console.log('Dados=>', dados);
                //console.log('Nova Lista de OS=>', novaOsList);

                // Atualiza a lista de OS offline e a lista principal
                try {
                    let listOffline = listOsOffline || []; // Garante que está inicializado
                    setListMinhasOs(novaOsList);
                    listOffline.push(dados);
                    setListOsOffline(listOffline);
                    const retornoSave = await salvarVariaveis(
                        'listMinhasOs',
                        'listMinhasOs',
                        JSON.stringify(novaOsList === null || novaOsList === undefined ? '' : novaOsList)
                    );

                    if (retornoSave?.code === 0) {
                        const listaOffline = await salvarVariaveis('listOffline','listOffline',JSON.stringify(listOffline));

                        if(listaOffline.code === 0){
                            const almApp = await AlimentarApp();

                            if (almApp.code === 0) {
                                return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: retornoSave };
                            } else {
                                return { status: 'erro', code: 2168, mensagem: 'erro', retorno: retornoSave };
                            }
                        }else{
                            return { status: 'erro', code: 2168, mensagem: 'erro', retorno: retornoSave };
                        }
                    } else {
                        return { status: 'erro', code: 2168, mensagem: 'erro', retorno: retornoSave };
                    }
                    
                } catch (error:any) {
                    //console.log('Erro em: ', 'setar lista de os offline!\nMais detalhes: ',error.message);
                }

                // Salva as variáveis atualizadas
                //try {
                    
                /*} catch (error) {
                    console.log('Erro ao salvar variáveis: ', error);
                }*/
                break;
        }
    }

    async function enviarOsOfflines(){
        let NumItemOfList = 0;
        for (let index = 0; index < listOsOffline.length; index++) {
            NumItemOfList ++;
            arlterarModal(
                'load',
                'archive-check',
                'Enviando...',
                ()=>(
                    <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                        <ActivityIndicator size={75} color={'blue'}/>
                        <ThemedText type='title'>Enviando {NumItemOfList+' de '+parseInt(listOsOffline.length)}</ThemedText>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Iniciando envio de O.S. OFFLINE,\nIsso pode demorar alguns minutos,\n\nAguarde...'}</Text>
                    </View>
                ),
                'default',
                ()=>{null},
                'Iniciando envio de O.S. OFFLINE,\nIsso pode demorar alguns minutos,\n\nAguarde...'
            )
            const element = listOsOffline[index];
            //console.log('processando lista=>',element);

            // Aqui, você envia a OS e espera o retorno da promessa
            const resultado = await enviarOS(element);

            if (resultado.code !== 0) {
                //console.log('Erro ao enviar OS:', resultado);
                return { status: 'Erro', code: resultado.code, mensagem: 'Erro', retorno: resultado.retorno };
            }
        }
        return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: 'Todas as O.S. foram enviadas com sucesso.' };
    }

    async function removerOsOffline(IdOs:number){
        if(IdOs !== null){
            let lista = listOsOffline.filter(item => item.os !== IdOs);

            const retornoSaveList = await salvarVariaveis('listOffline','listOffline',JSON.stringify(lista));

            if(retornoSaveList.code ===0){
                setLoad(false);
                fecharModal('');
                return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: retornoSaveList?.mensagem };
                
            }else{
                setLoad(false);
                fecharModal('');
                return { status: 'Erro', code: 2315, mensagem: 'Erro', retorno: retornoSaveList?.mensagem };
            }
        }
    }

    async function removerOsListMinhasOs(IdOs:number){
        if(IdOs !== null){
            let lista = listMinhasOs.filter(item => item.os !== IdOs);

            const retornoSaveList = await salvarVariaveis('listMinhasOs','listMinhasOs',JSON.stringify(lista));

            if(retornoSaveList.code ===0){
                setLoad(false);
                fecharModal('');
                return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: retornoSaveList?.mensagem };
                
            }else{
                setLoad(false);
                fecharModal('');
                return { status: 'Erro', code: 2315, mensagem: 'Erro', retorno: retornoSaveList?.mensagem };
            }
        }
    }

    // Função fictícia que simula o envio da OS
    async function enviarOS(element:any) {
        const loc = await buscarCoordenadas('home os',element,1200,element.os,null,'finalizarOs');

        if(loc?.code === 0){
            try {
                //cria o formulário
                let formData = new FormData();

                // Acessando o primeiro item do array externo
                const primeiroItemCaixa = element.imagens_caixa[0];
                
                // Acessando o primeiro item do array interno
                const detalhesImagemCaixa = primeiroItemCaixa[0];
                console.log('imagens caixa',detalhesImagemCaixa);
                
                // Acessando o primeiro item do array externo
                const primeiroItemMontado = element.imagens_montados[0];

                // Acessando o primeiro item do array interno
                const detalhesImagemMontado = primeiroItemMontado[0];
                console.log('imagens montado',detalhesImagemMontado);
                
                // Acessando o primeiro item do array externo
                const primeiroItemAmbiente = element.imagens_ambiente[0];

                // Acessando o primeiro item do array interno
                const detalhesImagemAmbiente = primeiroItemAmbiente[0];
                console.log('imagens ambiente',detalhesImagemAmbiente);
                const addImagesToFormData = (images:any, fieldName:any) => {
                    if(images !== null){
                        //console.log('Imagem(ns)=>',images)
                        
                        images.forEach((imageUri:any, index:number) => {
                            if(imageUri.url === undefined){
                                let uriParts = imageUri.split('.');
                                let carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                                let fileType = uriParts[uriParts.length - 1];
                                //console.log('669=>',uriParts,'\n\nCaminho:=>',imageUri);
                                formData.append('arquvios[]', {
                                    uri: imageUri.url,
                                    name: `${fieldName.replace('[]','')}_${carimbo}.${fileType}`,
                                    type: `image/${fileType}`,
                                });
                            }else{
                                let uriParts = (imageUri.url).split('.');
                                let carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                                let fileType = uriParts[uriParts.length - 1];
                                //console.log('669=>',uriParts,'\n\nCaminho:=>',imageUri);
                                formData.append('arquivos[]', {
                                    uri: imageUri.url,
                                    name: `${fieldName.replace('[]','')}_${carimbo}.${fileType}`,
                                    type: `image/${fileType}`,
                                });
                            }
                            
                        });
                    }else{
                        //console.log('Erro nas imagens=>')
                        switch (fieldName) {
                            case 'imagensmbalagem[]':
                                navigation.navigate('home os');
                                //error.push({'Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"']);                        
                                //setModalVisible(false);
                                //setMsg('');
                                break;
                            case 'imagensontagem[]':
                                //error.push({'Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"']);                        
                                //setModalVisible(false);
                                //setMsg('');
                                break;
                            case 'imagensmbiente[]':
                                //error.push({'Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"']);                        
                                //setModalVisible(false);
                                //setMsg('');
                            break;
                        }
                    }
                };
                addImagesToFormData(primeiroItemCaixa, 'imagensEmbalagem');
                addImagesToFormData(primeiroItemMontado, 'imagensMontagem');
                addImagesToFormData(primeiroItemAmbiente, 'imagensAmbiente');
                //adiciona o comando de ações
                formData.append('comando','finalizarOsOffline');
                //adiciona os dados da os como uma string
                //formData.append('os',JSON.stringify(element));
                formData.append('osDados', JSON.stringify(element));
                formData.append('os',element.os);
                formData.append('usuario',usuario.id_user);
                //formData.append('comando','finalizarOs');
                formData.append('location',JSON.stringify(loc));
                formData.append('codigoStatus',''+statusOs+'');
                
                const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                console.log('retorno da finalização de O.S.=>',response.data);
                //verifica se foi sucesso ou erro
                if(response.data[0].status === 'OK' && response.data[0].statusCode === 0){
                    const lpImg = await limparImagens();

                    if(lpImg.code ===0){
                        const retornoSaveList = await salvarVariaveis('listOffline','listOffline','');

                        if(retornoSaveList.code ===0){
                            setListOsOffline(null);
                            return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: response.data[0].statusMensagem };
                        }
                    }
                }else{
                    return { status: 'Erro', code: response.data[0].statusCode, mensagem: 'Erro', retorno: response.data[0].statusMensagem };
                }   
            } catch (error:any) {
                return { status: 'Erro', code: 2431, mensagem: 'Erro', retorno: error.message };
            }
        }else{
            return {status:'error',code:788,mensagem:'Localização do usuário não carregada!'};
        }
        
        // Simulando uma chamada assíncrona de API
        /*return new Promise((resolve) => {
            setTimeout(() => {
                resolve([{ status: 'OK',statusCode:222,statusMensagem:'Erro no envio da O.S.!\n\nTente novamente.' }]);//resolve([{ status: 'OK',statusCode:0,statusMensagem:'Sucesso no envio da(s) odem(ns) de serviço!' }]); // Mude para { status: 'erro' } para simular um erro
            }, 1000);
        });*/
    }

    return(
        <AuthLogin.Provider value={{
            //variaveis
            load,modalVisible,modalId,iconeModal,titleModal,conteudoModal,actionsModal,stylesModal,httpAlimentacao,listParceiros,pesquiza,
            usuario,email,senha,listOs,listMinhasOs,listOsDisponiveis,listOsOffline,options,dataInicial,dataFinal,idPrceiro,statusOs,
            nomeCliente,nf,ordemServico,osInicada,location,imagensEmbalagem,imagensMontado,imagensAmbiente,dataLocal,horaLocal,capturedImage,
            canvasRef,currentPath,paths,isConnectedNetwork,tokenNotification,notificationsCount,isConfigured,isOs,tela,isUser,visibleSnackBar,
            dataLoaded,montantePgmto,itemsFat,qtdOs,totalFat,parceiros,fechamentos_,uniqueId,imagensProblema,appIsValid,appValidationArray,
            typeConn,
            //funções
            setLoad,setModalVisible,setModalId,setIconeModal,setTitleModal,setConteudoModal,setActionsModal,setStylesModal,getModalStyle,
            apresentaModal,getModalStyleLabel,fecharModal,gerarIdUnico,AlimentarApp,getModalStyleLabelAlert,salvarVariaveis,setPesquiza,
            login,setListOs,setListMinhasOs,setListOsDisponiveis,setListOsOffline,buscarOs,setDataInicial,setDataFinal,setIdPrceiro,setStatusOs,
            setNomeCliente,setNf,setOrdemServico,setOsIniciada,arlterarModal,buscarCoordenadas,setLocation,setImagensEmbalagem,setImagensMontado,
            setImagensAmbiente,uploadImages,carregarTodasImagens,adicionarImagemEmbalagem,removerImagemEmbalagem,adicionarImagemAmbiente,removerImagemAmbiente,adicionarImagemMontagem,
            removerImagemMontado, setCapturedImage,setPaths,onTouch,saveCanvasAsImage,limparImagens,logof,setTokenNotification,sendNotification,testeConfig,buscarNotificacoes,
            setNotificationsCount,IniciarOs,OsIniciada,executarAcao,buscarEmpresas,verificarConexao,setVisibleSnackBar,setDataLoaded,cacheClear,montanteLoja,setMontantePgmto,setTela,
            faturamento,parceiroSearch,fechamentos,validarApp,adicionarImagemProblema,removerImagemProblema,IniciarOsOffline,enviarOsOfflines,removerOsOffline,removerOsListMinhasOs,
        }}>
            {children}
        </AuthLogin.Provider>
    )
}

export default AuthLoginProvider;
/*
    const canvasRef = useRef(null);
    const currentPath = useRef<SkPath|null>(null)
    const [paths,setPaths] = useState<SkPath[]>([])
    console.log('Dados da os=>',osInicada.dadosOs.dadosOs.dadosOs);
    const onTouch = useTouchHandler({
        onStart:({x,y})=>{
            currentPath.current = Skia.Path.Make();
            currentPath.current.moveTo(x,y);
        },
        onActive:({x,y})=>{
            currentPath.current?.lineTo(x,y)
        },
        onEnd:()=>{
            //if(!currentPath.current) return;
            setPaths(values=> values.concat(currentPath.current!));
            currentPath.current = null;
        }
    })
*/