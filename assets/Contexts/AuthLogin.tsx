import React, { useMemo, useEffect, useState, useContext, useCallback, createContext, ReactNode, ReactElement, useRef } from 'react';
import { Alert, ToastAndroid, View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import Config from '../Config/Config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Styles } from '../Styles/Styles';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import config from '../../app.json';
//import * as LocalAuthentication from 'expo-local-authentication';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject } from 'expo-location';
import * as Location from 'expo-location';
/*import * as Device from 'expo-device';*/
import NetInfo from '@react-native-community/netinfo';
import * as ImagePicker from 'expo-image-picker';
import * as Application from 'expo-application';
import { ThemedText } from '../../Routes/Components/ThemedText';
//import * as Permissions from 'expo-permissions';
import { captureRef } from 'react-native-view-shot';
import { manipulateAsync, FlipType, SaveFormat, SaveOptions } from 'expo-image-manipulator';
import { Canvas, Patch, Path, Skia, SkPath, useTouchHandler, SkiaDomView, rotate } from '@shopify/react-native-skia';
import { ThemedView } from '../../Routes/Components/ThemedView';
import { list } from 'firebase/storage';

export const AuthLogin = createContext({});

function AuthLoginProvider({ children }: any) {
    const navigation = useNavigation();
    const [load, setLoad] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalId, setModalId] = useState('');
    const [isConnectedNetwork, setIsConectedNetwork] = useState<boolean | null>(false);
    const [typeConn, setTypeConn] = useState('');
    const [tokenNotification, setTokenNotification] = useState('');
    const [errorsLoad, setErrorsLoad] = useState<any>(null);
    const [isConfigured, setIsConfigured] = useState(false);
    const [isOs, setIsOs] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [visibleSnackBar, setVisibleSnackBar] = React.useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    let erros: any = [];
    const [itemsFat, setItemsFat] = useState(null);
    const [qtdOs, setQtdOs] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [parceiros, setParceiros] = useState(null);
    const [fechamentos_, setFechamentos_] = useState(null);
    const [appIsValid, setAppIsValid] = useState(true);
    const [appValidationArray, setAppValidationArray] = useState(null);
    const [configApp, setConfigApp] = useState<null | any>(null);
    const [conf, setConf] = useState<any | null>(null);
    const [asyncLoad, setAsyncLoad] = useState<boolean>(false);
    const [isOffline, setIsOffline] = useState<boolean>(false);
    //---------------------------------------------inicio das opcoes do usuario
    const options = [
        { id: 1, title: 'Ordens de serviços', action: () => { navigation.navigate('home os') }, icone: 'archive', colorText: '#999999', new: false, badge: false, _badgeItem: () => { null } },
        { id: 2, title: 'Notificações', action: () => { userAppMode === false ? navigation.navigate('notifications') : Alert.alert('Ativar Premium', 'Esta opção está disponivel apenas para usuários Premium') }, icone: 'bell', colorText: '#999999', new: false, badge: true, _badgeItem: 'bell-badge' },
        { id: 3, title: 'Assistências', action: () => { userAppMode === false ? navigation.navigate('assistencias os') : Alert.alert('Ativar Premium', 'Esta opção está disponivel apenas para usuários Premium') }, icone: 'assistant', colorText: 'red', new: false, badge: false, _badgeItem: () => { null } },
        { id: 4, title: 'Central de mensagens', action: () => { userAppMode === false ? navigation.navigate('mensagens') : Alert.alert('Ativar Premium', 'Esta opção está disponivel apenas para usuários Premium') }, icone: 'forum', colorText: '#999999', new: false, badge: false, _badgeItem: () => { null } },
        { id: 5, title: 'Parciais de faturamento', action: () => { userAppMode === false ? navigation.navigate('faturamento') : Alert.alert('Ativar Premium', 'Esta opção está disponivel apenas para usuários Premium') }, icone: 'currency-usd', colorText: '#999999', new: true, badge: false, _badgeItem: () => { null } },
        { id: 6, title: 'Fechamentos', action: () => { userAppMode === false ? navigation.navigate('fechamento') : Alert.alert('Ativar Premium', 'Esta opção está disponivel apenas para usuários Premium') }, icone: 'archive-check', colorText: 'green', new: true, badge: false, _badgeItem: () => { null } },
        { id: 7, title: 'Trocar senha', action: () => { navigation.navigate('reset pass') }, icone: 'lock-reset', colorText: '#999999', new: false, badge: false, _badgeItem: () => { null } },
        { id: 8, title: 'Agenda', action: () => console.log('Option 3 selected'), icone: 'calendar-month', colorText: '#999999', new: false, badge: false, _badgeItem: () => { null } },
        {
            id: 9, title: 'Limpar cache', action: () => {
                apresentaModal(
                    'dialog',
                    'help',
                    'Resetar cachê do APP',
                    () => (
                        <ThemedView style={[Styles.w100, Styles.em_linhaVertical, { paddingVertical: 15 }]}>
                            <ThemedText type='title' style={[Styles.w100, { textAlign: 'center' }]}>{'ATENÇÃO'}</ThemedText>
                            <ThemedText>{'\n'}</ThemedText>
                            <ThemedText type='subtitle' style={[Styles.w100, { textAlign: 'center' }]}>{'Ao limpar o cachê do aplicativo você perderá:'}</ThemedText>
                            <ThemedText>{'\n\n'}</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[Styles.w100, { textAlign: 'left' }]}>{'1-O.S. finalizadas "OFFLINE" Terão que ser executadas as etapas novamente.'}</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[Styles.w100, { textAlign: 'left' }]}>{'2-Imagens das ordens de serviço terão que ser tiradas novamente.'}</ThemedText>
                            <ThemedText>{'\n\n'}</ThemedText>
                            <ThemedText type='subtitle' style={[Styles.w100, { textAlign: 'center' }]}>{'Deseja continuar?'}</ThemedText>
                        </ThemedView>
                    ),
                    'default',
                    () => {
                        return (
                            <>
                                <TouchableOpacity style={[Styles.btn, Styles.success, Styles.em_linhaHorizontal, Styles.w50, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                                    onPress={() => {
                                        fecharModal('');
                                    }}
                                >
                                    <Text style={[Styles.ft_regular, Styles.lblsuccess]}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[Styles.btn, Styles.danger, Styles.em_linhaHorizontal, Styles.w50, Styles.btnDialog, Styles.btnDialogRight, {}]}
                                    onPress={() => {
                                        navigation.reset({
                                            index: 0,
                                            routes: [
                                                {
                                                    name: 'reset cache',
                                                }
                                            ]
                                        });
                                    }}
                                >
                                    <Text style={[Styles.ft_regular, Styles.lbldanger]}>Sim</Text>
                                </TouchableOpacity>
                            </>
                        )
                    }
                );
            }, icone: 'cached', colorText: '#999999'
        },
    ];
    //---------------------------------------------fim das opcoes do usuario
    //----------------------------------------------inicio lista os
    const [listOs, setListOs] = useState<any | null>(null)
    const [listMinhasOs, setListMinhasOs] = useState<any>(null)
    const [listOsDisponiveis, setListOsDisponiveis] = useState<any>(null)
    const [listOsOffline, setListOsOffline] = useState<any>(null)
    const [error, setError] = useState<object | null>(null);
    const [page, setPage] = useState<string | any>(null);
    const [montantePgmto, setMontantePgmto] = useState<number>(0);
    //----------------------------------------------fim lista os
    //----------------------------------------------inicio dados login
    const [usuario, setUsuario] = useState<any | null>(null)
    const [email, setEmail] = useState<string | null>('');
    const [senha, setSenha] = useState<string | null>('');
    //----------------------------------------------fim dados loginlogin
    //----------------------------------------------configuração dos modais
    const [iconeModal, setIconeModal] = useState<string>('');
    const [titleModal, setTitleModal] = useState<string>('');
    const [msgModal, setMsgModal] = useState<string>('');
    const [conteudoModal, setConteudoModal] = useState<String | ReactNode | ReactElement | Function>('');
    const [actionsModal, setActionsModal] = useState<Function | null>(() => { setModalVisible(!modalVisible) });
    const [stylesModal, setStylesModal] = useState<string | StyleSheet>();
    //----------------------------------------------fim das configurações dos modais
    //----------------------------------------------inicio do id do app
    const [uniqueId, setUniqueId] = useState<string>('');
    //----------------------------------------------fim do id do app
    //----------------------------------------------Inicio da alimentação do aplicativo
    const [httpAlimentacao, setHttpAlimentacao] = useState<string | null>('');
    //----------------------------------------------Fim da alimentação do aplicativo
    const [listParceiros, setListParceiros] = useState();
    const [pesquiza, setPesquiza] = useState<any | null>(null);
    const dataHoraAtual = new Date();
    //----------------------------------------------inicio filtros de pesquiza de O.S.
    const [dataInicial, setDataInicial] = useState<any>()
    const [dataFinal, setDataFinal] = useState<any>()
    const [idPrceiro, setIdPrceiro] = useState<any>()
    const [statusOs, setStatusOs] = useState<any>();
    const [nomeCliente, setNomeCliente] = useState<any>('');
    const [nf, setNf] = useState<any>('');
    const [ordemServico, setOrdemServico] = useState('');
    const [osInicada, setOsIniciada] = useState<any | null>(null);
    const [tela, setTela] = useState('');
    //----------------------------------------------fim filtros de pesquiza de O.S.
    //----------------------------------------------Obter a data local no formato 'YYYY-MM-DD'
    const dataLocal = dataHoraAtual.toLocaleDateString();
    //----------------------------------------------Obter a hora local no formato 'HH:mm:ss'
    const horaLocal = dataHoraAtual.toLocaleTimeString();
    //----------------------------------------------
    //----------------------------------------------Inicio da configuraçãod de localização
    const [location, setLocation] = useState<LocationObject | null>(null);
    //----------------------------------------------Fim da configuraçãod de localização
    //----------------------------------------------inicio da OS iniciada
    //    const [OsIniciada,setOsIniciada] = useState<any|null>({});
    //----------------------------------------------fim da os iniciada
    //----------------------------------------------inicio da tiragem de fotos da os
    const [imagensEmbalagem, setImagensEmbalagem] = useState(null);
    const [imagensMontado, setImagensMontado] = useState(null);
    const [imagensAmbiente, setImagensAmbiente] = useState(null);
    const [imagensProblema, setImagensProblema] = useState(null);
    //----------------------------------------------Fim da tiragem de fotos da os
    //----------------------------------------------Imagem assinatura
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    //----------------------------------------------Fim imagem assinatura
    function searchByTitle(array: any, title: string) {
        const result = array.find((item: { title: string; }) => item.title.toLowerCase().includes(title.toLowerCase()));
        setPesquiza(result ? [result] : []);
    }
    //----------------------------------------------inicio das variaveis de assinatura
    const canvasRef = useRef(null);
    const currentPath = useRef<SkPath | null>(null)
    const [paths, setPaths] = useState<SkPath[]>([])
    //
    const [notificationsCount, setNotificationsCount] = useState<any | null | undefined>(null);
    //
    //------------------------------------------------user app modo teste
    const [userAppMode, setUserAppMode] = useState<boolean>(false);
    //
    const onTouch = useTouchHandler({
        onStart: ({ x, y }) => {
            currentPath.current = Skia.Path.Make();
            currentPath.current.moveTo(x, y);
        },
        onActive: ({ x, y }) => {
            currentPath.current?.lineTo(x, y)
        },
        onEnd: () => {
            //if(!currentPath.current) return;
            setPaths(values => values.concat(currentPath.current!));
            currentPath.current = null;
        }
    })

    async function verificarConexao(): Promise<{ status: string, code: number, mensagem: string, retorno: any }> {
        //try {
        // Obtém o estado da conexão de rede
        //const alApp = await AlimentarApp();
        const itsOffline = await AsyncStorage.getItem('isOffline');
        if (itsOffline === null || itsOffline === 'false') {
            setIsOffline(false);
        } else {
            setIsOffline(true);
        }
        const state = await NetInfo.fetch();
        setIsConectedNetwork(state.isConnected);
        //console.log('Estado da conexão:', state.isConnected,'modo offline->',itsOffline);
        if (state.isConnected) {
            if (isOffline === true) {
                fecharModal('');
                setTypeConn('mobile');
                setModalVisible(false);
                setIsConectedNetwork(false);
                return { status: 'Erro', code: 210, mensagem: 'Usando modo Offline', retorno: [{ conectado: false, tipo: 'mobile' }] };
            } else {
                fecharModal('');
                setTypeConn('mobile');
                setTypeConn(state.type);
                setModalVisible(false);
                return { status: 'sucesso', code: 0, mensagem: 'Conectado', retorno: [{ conectado: true, tipo: state.type }] };
            }
        } else {
            fecharModal('');
            setTypeConn(state.type);
            setModalVisible(false);
            //setTypeConn('mobile');
            return { status: 'Erro', code: 225, mensagem: 'Offline', retorno: [{ conectado: false, tipo: state.type }] };
        }
        /*} catch (error) {
            console.error('Erro ao verificar a conexão:', error);
            return { status: 'Erro', code: 500, mensagem: 'Erro interno', retorno: null };
        }*/
    }

    async function login(dadosLogin: any) {
        //if(isConnectedNetwork === true){
        apresentaModal(
            'load',
            'account-convert',
            'Realizando login',
            () => (
                <View style={[Styles.w100, Styles.em_linhaVertical, { paddingVertical: 15 }]}>
                    <ActivityIndicator size={75} animating={true} />
                    <Text style={[Styles.ft_regular, Styles.w90, { textAlign: 'center' }]}>{'Realizando login\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            () => { null }
        );
        const response = await axios({
            method: 'post',
            url: Config.configuracoes.pastaProcessos,
            params: dadosLogin
        })
        //console.log('response de login=>', response);
        if (response.data[0].status === 'OK' && response.data[0].statusCode === 200) {
            //Alert.alert('Sucesso',response.data[0].statusMensagem);
            const retorno = await salvarVariaveis(
                'usuario',
                'usuario',
                JSON.stringify(response.data[0].dadosUser),
            );

            if (retorno.code === 0) {
                setLoad(false)
                //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                const alm = await AlimentarApp();

                if (alm.code === 0) {
                    executarAcao('login', null, null, 'home os');
                    arlterarModal(
                        'success',
                        'account-check',
                        'Sucesso',
                        () => (
                            <View style={[Styles.w100, Styles.em_linhaVertical, { paddingVertical: 15 }]}>
                                <MaterialCommunityIcons name='account-check' size={75} style={[getModalStyleLabel('success')]} />
                                <Text style={[Styles.ft_regular, Styles.w90, getModalStyleLabel('success'), { textAlign: 'center' }]}>{'Login realizado com sucesso!'}</Text>
                            </View>
                        ),
                        'success',
                        () => { null },
                        'Login realizado com sucesso!'
                    );
                }
            } else {
                setLoad(false);
                return retorno;
            }
        } else if (response.data[0].status === 'OK' && response.data[0].statusCode === 200 || response.data === '') {
            apresentaModal(
                'error',
                'alert-octagon',
                'Erro',
                () => (
                    <View style={[Styles.w100, Styles.em_linhaVertical, { paddingVertical: 15 }]}>
                        <MaterialCommunityIcons name='alert-octagon' size={75} style={[getModalStyleLabel('danger')]} />
                        <Text style={[Styles.ft_regular, Styles.w90, getModalStyleLabel('danger'), { textAlign: 'center', maxWidth: '90%' }]}>{response.data[0].statusMensagem + '\n\nError code:"' + response.data[0].statusCode + '"'}</Text>
                    </View>
                ),
                'danger',
                () => { null }
            );
            setLoad(false);
            //Alert.alert('Erro',response.data[0].statusMensagem+'\n\nError code:"'+response.data[0].statusCode+'"');
        } else {
            apresentaModal(
                'warning',
                'alert',
                'Erro',
                () => (
                    <View style={[Styles.w100, Styles.em_linhaVertical, { paddingVertical: 15 }]}>
                        <MaterialCommunityIcons name='alert' size={75} style={[getModalStyleLabel('warning')]} />
                        <Text style={[Styles.ft_regular, Styles.w90, getModalStyleLabel('warning'), { textAlign: 'center', maxWidth: '90%' }]}>{response.data[0].statusMensagem + '\n\nError code:"' + response.data[0].statusCode + '"'}</Text>
                    </View>
                ),
                'warning',
                () => { null }
            );
            setLoad(false);
            //Alert.alert('Erro',response.data[0].statusMensagem+'\n\nError code:"GS_APP_'+response.data[0].statusCode+'"');
        }
    }

    async function cacheClear() {
        try {
            /*await AsyncStorage.removeItem('httpsAli');
            await AsyncStorage.removeItem('usuario');
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('senha');*/
            await AsyncStorage.removeItem('OsIniciada');
            const status = await AlimentarApp();

            if (status.code === 0) {
                return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
            } else {
                return { status: 'erro', code: 243, mensagem: 'erro' };
            }
        } catch (error) {
            return { status: 'erro', code: 245, mensagem: 'erro', retorno: error };
        }
    }

    async function AlimentarApp() {
        try {
            const httpsAl = await AsyncStorage.getItem('httpsAli');
            const usr = await AsyncStorage.getItem('usuario');
            const mail = await AsyncStorage.getItem('email');
            const pass = await AsyncStorage.getItem('senha');
            const OsIni = await AsyncStorage.getItem('OsIniciada');
            const os = await AsyncStorage.getItem('listMinhasOs');
            const unq = await AsyncStorage.getItem('idApp');
            const lstOff = await AsyncStorage.getItem('listOffline');
            const itsOnlineOffline = await AsyncStorage.getItem('isOffline');//configApp
            const jsonConfig = await AsyncStorage.getItem('configApp');
            //verifica se existe um lista de O.S. offline

            const verifConn = await verificarConexao();

            if (itsOnlineOffline !== null) {
                let OnlineOffilne = false;

                if (itsOnlineOffline === 'false') {
                    setIsOffline(false);
                    setTypeConn(verifConn.retorno[0].type);
                    //return { status: 'sucesso', code: 0, mensagem: 'Conectado', retorno:verifConn.retorno[0] };
                } else {
                    setIsOffline(true);
                    setTypeConn(verifConn.retorno[0].type);
                    //return { status: 'sucesso', code: 0, mensagem: 'Conectado', retorno: verifConn.retorno[0] };
                }
            } else {
                setIsOffline(false);
                //errorsLoad.push('Você está online!');
            }

            if (lstOff !== null) {
                setListOsOffline(JSON.parse(lstOff));
            } else {
                setListOsOffline(null);
                //errorsLoad.push('Lista de O.S. offline não carregada!');
            }
            //verifica se existe um lista de O.S. online
            if (os !== null) {
                setListMinhasOs(JSON.parse(os));
            } else {
                setListMinhasOs(null);
                //errorsLoad.push('Lista de O.S. não carregada!');
            }

            //---------------------------------verifica se há alimentação de API
            if (httpsAl === null) {
                setHttpAlimentacao(null);
                setTela('comecar');
                //errorsLoad.push('Alimentação não configurada!');
            } else {
                setHttpAlimentacao(httpsAl);
                setIsConfigured(true);
            }
            //verifica se existe um id ùnico do app
            if (unq !== null) {
                setUniqueId(unq);
            } else {
                setUniqueId('');
                //errorsLoad.push('ID do aplicativo não configurado!');
            }
            //---------------------------------verifica se existe alguma OS iniciada

            if (OsIni === null) {
                setOsIniciada(null);
                //errorsLoad.push('Nenhuma O.S. iniciada!');
            } else {
                setIsOs(true);
                setOsIniciada(JSON.parse(OsIni));
                let osini = JSON.parse(OsIni);
                setTela(osini.tela);
            }
            //---------------------------------verifica se existe uma configuração de empresa
            if (jsonConfig === null) {
                setConfigApp(null);
            } else {
                setConfigApp(JSON.parse(jsonConfig));
            }
            //---------------------------------verifica se existe um usuário logado
            if (usr === null) {
                setUsuario(null);
                //errorsLoad.push('Usuário não logado!');
            } else {
                const us = JSON.parse(usr);
                setIsUser(true)
                setTela('home os');
                setUsuario(us);
                //return {status:'sucesso',code:0,mensagem:'sucesso',retorno:{almApp:httpsAl,user:usr,mail:mail,pass:pass,OS:OsIniciada,erros:null}};
            }
            //---------------------------------verifica se existe um email logado

            if (errorsLoad === null) {
                setDataLoaded(true);
                return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: { almApp: httpsAl, user: usr, mail: mail, pass: pass, OS: OsIni, erros: null } };
            } else {
                return { status: 'sucesso', code: 298, mensagem: 'sucesso', retorno: { almApp: httpsAl, user: usr, mail: mail, pass: pass, OS: JSON.parse(OsIni), erros: errorsLoad } };
            }
            //return {status:'Sem erros',code:0,mensagem:'Sucesso',retorno:null};
        } catch (error: any) {
            setDataLoaded(true);
            return { status: 'com erros', code: 0, mensagem: 'com erros', retorno: error.message };//return {status:'sucesso',code:0,mensagem:error.message,retorno:null,erros:errorsLoad};
        }
    }

    async function montanteLoja(id_loja: string, tipo_montagem: string) {
        const retorno = await axios({
            method: 'get',
            url: Config.configuracoes.pastaProcessos,//.filial[0].id
            params: {
                comando: 'montanteParceiro',
                id_parceiro: id_loja,
                tipo_montagem: tipo_montagem,
                isApp:Config.configuracoes.isApp
            }
        });

        if (retorno.data[0].status === 'OK' && retorno.data[0].statusCode === 0) {
            setMontantePgmto(retorno.data[0].arrayMontante.percent);
        }
    }

    async function buscarConfig(id_empresa: string) {
        const cfg = await verificarConexao();
        //console.log('cfg=>', cfg);
        if (cfg.code !== undefined && cfg.code === 0) {
            const response: any = await Config_APP('config', id_empresa);
            if (response.code === 0) {
                setAsyncLoad(true);
                setModalVisible(false);
                setLoad(false);
                setConf(response.retorno);
                return { status: 'Sucesso', code: 0, mensagem: 'Configuração adicionada com sucesso!', retorno: response.retorno }
            } else {
                setAsyncLoad(false)
                setModalVisible(false);;
                setLoad(false);
                setConf(null);
                return { status: 'Erro', code: 1, mensagem: 'Erro', retorno: null }
            }
        } else {
            setAsyncLoad(true)
            setModalVisible(false);
            setLoad(false);
            setConf(null);
            return { status: 'Erro', code: 1, mensagem: 'Erro', retorno: null }
        }
    }

    async function salvarVariaveis(params: any, id_chave: string, valor: string) {
        apresentaModal(
            'load',
            'download-multiple',
            'Processando',
            () => (
                <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                    <ActivityIndicator size={75} color={'blue'} />
                    <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Salvando ambiente de trabalho,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            () => { null }
        )

        try {
            if (valor === '') {
                await AsyncStorage.removeItem(id_chave);
                const returnAmlApp = await AlimentarApp();

                if (returnAmlApp.code === 0) {
                    return { status: 'sucesso', code: 0, mensagem: 'Sucesso' };
                } else {
                    return { status: 'error', code: 351, mensagem: 'Erro de alimentação do app' };
                }
            } else {
                await AsyncStorage.setItem(id_chave, valor);
                const returnAmlApp = await AlimentarApp();

                if (returnAmlApp.code === 0) {
                    return { status: 'sucesso', code: 0, mensagem: 'Sucesso' };
                } else {
                    return { status: 'error', code: 351, mensagem: 'Erro de alimentação do app' };
                }
            }
        } catch (error: any) {
            return { status: 'error', code: 301, mensagem: error.message };
        }
    }

    async function validarApp(unq: any) {
        //console.warn('Validando app com o id=>', unq,'->buscando em:', Config.configuracoes.pastaProcessos,'->com o id:',unq);

        /*try {*/
            // Monta URL com params
            const baseUrl = Config.configuracoes.pastaProcessos;
            const params = new URLSearchParams({
                comando: 'validarapp',
                id: String(unq),
                isApp:Config.configuracoes.isApp
            });
            const url = `${baseUrl}?${params.toString()}`;

            // Requisição com timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.warn('Retorno da validação=>', data);

            const [firstItem] = data || [];

            if (firstItem?.status === 'OK' && firstItem?.statusCode === 200 && firstItem?.dadosApp !== null) {
                setAppIsValid(true);
                setAppValidationArray(firstItem.dadosApp);
                return {
                    status: 'sucesso',
                    code: 0,
                    mensagem: 'sucesso',
                    retorno: firstItem.dadosApp
                };
            } else {
                setAppIsValid(false);
                setAppValidationArray(firstItem?.dadosApp);
                return {
                    status: 'erro',
                    code: 424,
                    mensagem: 'erro',
                    retorno: 'Aplicativo não registrado ou expirado!'
                };
            }

        /*} catch (error: any) {
            console.error('Erro ao validar app:', error);
            return {
                status: 'erro',
                code: 500,
                mensagem: 'erro',
                retorno: error.message || 'Erro na comunicação com o servidor'
            };
        }*/
    }

    /*async function validarApp(unq: any) {
        console.warn('Validando app com o id=>', unq);
        const req = await axios({
            method: 'get',
            url: httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
            params: {
                comando: 'validarapp',
                id: unq
            }
        });
        console.warn('Retorno da validação=>', req)
        if (req !== undefined) {
            if (req.data[0].status === 'OK' && req.data[0].statusCode === 200 && req.data[0].dadosApp !== null) {
                setAppIsValid(true);
                setAppValidationArray(req.data[0].dadosApp);
                return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: req.data[0].dadosApp };
            } else {
                setAppIsValid(false);
                setAppValidationArray(req.data[0].dadosApp);
                return { status: 'erro', code: 424, mensagem: 'erro', retorno: 'Aplicativo não registrado ou expirado!' };
            }
        } else {
            return { status: 'erro', code: 426, mensagem: 'erro', retorno: 'O servidor não conseguiu lidar com a requisição!' };
        }
    }*/

    async function guardarIdUnico(id: string) {
        try {
            arlterarModal(
                'light',
                'check-all',
                'Aguarde...',
                () => (<View style={[Styles.em_linhaVertical, { marginBottom: 20 }]}><ActivityIndicator size={75} /><Text style={[Styles.ft_regular, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 20 }]}>{msgModal}</Text></View>),
                'light',
                () => (null),
                'Salvando seu id único,\n\nAguarde...'
            );

            const result = await AsyncStorage.setItem('idApp', id);
            setUniqueId(id);
            arlterarModal(
                'success',
                'check-all',
                'Sucesso',
                () => (<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]} /><Text style={[Styles.ft_regular, getModalStyleLabel('success'), { textAlign: 'center', marginBottom: 20, }]}>{'Id único gerado com sucesso,\nSeu id único: "' + id + '"'}</Text></View>),
                'light',
                () => (
                    <>
                        <TouchableOpacity
                            onPress={() => { setModalVisible(false) }}
                            style={[Styles.w50, Styles.light, { marginHorizontal: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderBottomLeftRadius: 5 }]}
                        >
                            <Text style={[Styles.ft_regular, Styles.lbllight, {}]}>Não</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setModalVisible(false) }}
                            style={[Styles.w50, Styles.light, { marginHorizontal: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderBottomRightRadius: 5 }]}
                        >
                            <Text style={[Styles.ft_regular, Styles.lbllight, {}]}>Sim</Text>
                        </TouchableOpacity>
                    </>
                ),
                'Id único gerado com sucesso!\n\nSeu ID único:' + id + '\n\nDeseja prosseguir com o cadastro do app?'
            )
            setLoad(false);
            return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
        } catch (error: any) {
            arlterarModal(
                'error',
                'check-all',
                'Erro',
                () => (<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]} /><Text style={[Styles.ft_regular, getModalStyleLabel('success'), { textAlign: 'center' }]}>{msgModal}</Text></View>),
                'light',
                () => (
                    <>
                        <TouchableOpacity
                            onPress={() => { setModalVisible(false) }}
                            style={[Styles.w50, Styles.light, { marginHorizontal: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderBottomLeftRadius: 5 }]}
                        >
                            <Text style={[Styles.ft_regular, Styles.lbllight, {}]}>Não</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setModalVisible(false) }}
                            style={[Styles.w50, Styles.light, { marginHorizontal: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderBottomRightRadius: 5 }]}
                        >
                            <Text style={[Styles.ft_regular, Styles.lbllight, {}]}>Sim</Text>
                        </TouchableOpacity>
                    </>
                ),
                'Erro ao salvar o id único do aplicativo!\n\nErro: ' + error.message
            )
            setLoad(false);
            return { status: 'erro', code: 525, mensagem: 'erro', retorno: error.message };
        }
    }

    async function gerarIdUnico() {
        try {
            let id: string | null = '';
            if (Application.getAndroidId) {
                id = Application.getAndroidId();
            } else if (Application.getIosIdForVendorAsync) {
                id = await Application.getIosIdForVendorAsync();
            }


            if (id !== '') {
                setUniqueId(id);
                arlterarModal(
                    'light',
                    'check-all',
                    'Aguarde...',
                    () => (<View style={[Styles.em_linhaVertical, { marginBottom: 20 }]}><ActivityIndicator size={75} /><Text style={[Styles.ft_regular, getModalStyleLabel('light'), { textAlign: 'center' }]}>{msgModal}</Text></View>),
                    'light',
                    () => (null),
                    'Gerando seu id único do aplicativo,\n\nAguarde...'
                );
                await guardarIdUnico(id);
            }

            return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: 'ID único gerado com sucesso!', id: id };
        } catch (error: any) {
            arlterarModal(
                'danger',
                'check-all',
                'Aguarde...',
                () => (<View style={[Styles.em_linhaVertical, { marginBottom: 20 }]}><ActivityIndicator size={75} /><Text style={[Styles.ft_regular, getModalStyleLabel('light'), { textAlign: 'center' }]}>{msgModal}</Text></View>),
                'danger',
                () => (null),
                'Erro ao gerar o id único do app,\n\nMais detalhes:' + error.message
            );

            return { status: 'erro', code: 675, mensagem: 'erro', retorno: error.message };
        }

    }

    async function VerificarRegistro(id: any) {
        arlterarModal(
            'success',
            'check-all',
            'Sucesso',
            () => (<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]} /><Text style={[Styles.ft_regular, getModalStyleLabel('success'), { textAlign: 'center', marginBottom: 20, }]}>{'Id único gerado com sucesso,\nSeu id único: "' + id + '"'}</Text></View>),
            'light',
            () => (
                <>
                    <TouchableOpacity
                        onPress={() => { setModalVisible(false) }}
                        style={[Styles.w50, Styles.light, { marginHorizontal: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderBottomLeftRadius: 5 }]}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight, {}]}>Não</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { setModalVisible(false) }}
                        style={[Styles.w50, Styles.light, { marginHorizontal: 0, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderBottomRightRadius: 5 }]}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight, {}]}>Sim</Text>
                    </TouchableOpacity>
                </>
            ),
            'Id único gerado com sucesso!\n\nSeu ID único:' + id + '\n\nDeseja prosseguir com o cadastro do app?'
        )
        setLoad(false);
        return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
    }

    function apresentaModal(idModal: string, iconeM: string, titleM: string, conteudoM: string | ReactNode | ReactElement | Function, styleM: StyleSheet | string, actionsM: Function) {
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

    function arlterarModal(idModal: string, iconeM: string, titleM: string, conteudoM: string | ReactNode | ReactElement | Function, styleM: StyleSheet | string, actionsM: Function, msgModal: string) {
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

    function fecharModal(idModal: string) {
        setIconeModal('');
        setTitleModal('');
        setConteudoModal('');
        setActionsModal(null);
        setModalId(idModal);
        setModalVisible(!modalVisible);
    }

    const getModalStyle = (style: string) => {
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
            case 'dark':
                return Styles.dark;
        }
    };

    const getModalStyleBorder = (style: string) => {
        switch (style) {
            case 'danger':
                return Styles.borderdanger;
            case 'warning':
                return Styles.borderwarning;
            case 'success':
                return Styles.bordersuccess;
            case 'info':
                return Styles.borderinfo;
            case 'light':
                return Styles.borderlight;
            case 'dark':
                return Styles.borderdark;
        }
    };

    const getModalStyleLabel = (style: string) => {
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
            case 'dark':
                return Styles.lbldark;
        }
    };

    const getModalStyleLabelAlert = (style: string) => {
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
            case 'dark':
                return Styles.lbldark;
        }
    };

    async function buscarOs(comando: any, nf_: any, dataInicial_: any, dataFinal_: any, nomeCliente_: any, ordemServico_: any, usr: any, status: number) {

        apresentaModal(
            'load',
            'download-multiple',
            'Processando',
            () => (
                <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                    <ActivityIndicator size={75} style={[getModalStyleLabel('light')]} />
                    <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Buscando ordens de serviço\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            () => { null }
        )
        try {
            const response = await axios({
                method: 'get',
                url: Config.configuracoes.pastaProcessos,
                params: {
                    comando: comando,
                    nf: nf_,
                    dataIni: dataInicial_,
                    dataFim: dataFinal_,
                    cliente: nomeCliente_,
                    os: ordemServico_,
                    prof: usr,
                    status: status,
                    isApp:Config.configuracoes.isApp
                }
            })
            //console.warn('AuthLogin=>', response)
            if (response.data[0].dados !== null) {

                setListMinhasOs(response.data[0].dados)
                const retorno = await salvarVariaveis(
                    'listMinhasOs',
                    'listMinhasOs',
                    JSON.stringify(response.data[0].dados)
                )

                if (retorno?.code === 0) {
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('', null, null, '');
                    const ret = await AlimentarApp();
                    if (ret.code === 0) {
                        return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: response.data[0].dados };
                    } else {
                        return { status: 'erro', code: 258, mensagem: 'erro', retorno: null };
                    }
                } else {
                    return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                }
            } else {
                setListMinhasOs(response.data[0].dados)
                const retorno = await salvarVariaveis(
                    'listMinhasOs',
                    'listMonhasOs',
                    ''
                )

                if (retorno?.code === 0) {
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('', null, null, '');
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
                } else {
                    return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                }
            }
        } catch (error: any) {
            //console.log('Error=>', error)
            return { status: 'error', code: 622, mensagem: error.message + ', em:' + Config.configuracoes.pastaProcessos + '?' + comando };
        }
    }

    async function buscarNotificacoes(id_de: any, id_para: any) {
        //try {
        const notifyApp = await axios({
            method: 'get',
            url: Config.configuracoes.pastaProcessos,
            params: {
                comando: 'all_notifications',
                de: id_de,
                para: id_para,
                isApp:Config.configuracoes.isApp
            }
        })
        if (notifyApp.data[0].count_msg > 0) {
            setNotificationsCount(notifyApp.data[0].dados_notify_app);
            return { status: 'sucesso', code: 0, mensagem: notifyApp.data[0].statusMensagem, count_msg: notifyApp.data[0].count_msg, retorno: notifyApp.data[0].dados_notify_app };
        } else {
            setNotificationsCount(notifyApp.data[0].dados_notify_app);
            return { status: 'sucesso', code: 0, mensagem: 'sucesso', count_msg: notifyApp.data[0].count_msg, retorno: null };
        }
        /*((response)=>{
            
        }).catch((responseCatch)=>{

        })
    //} catch (error) {
        
    //}*/
    }

    async function Config_APP(comando: string, id_empresa: string) {
        const response = await axios({
            method: 'get',
            url: Config.configuracoes.pastaProcessos,
            params: {
                comando: comando,
                id_empresa: id_empresa,
                isApp:Config.configuracoes.isApp
            }
        });

        //console.log('response do arquivo Config_APP=>', response);
        if (response.data[0].status === 'OK') {
            if (response.data[0].statusCode === 200) {
                if (response.data[0].codeMensagem === 0) {
                    setConfigApp(response.data[0].configuracoes);
                    const salvarConfig = await salvarVariaveis('configApp', 'configApp', JSON.stringify(response.data[0].configuracoes));

                    if (salvarConfig.code !== 0) {
                        ToastAndroid.showWithGravity('Erro:' + salvarConfig.code, ToastAndroid.LONG, ToastAndroid.BOTTOM);
                        //Alert.alert('Erro','*_*\nEncontramos um erro!\n\nCódigo de erro:'+);
                    } else {
                        //console.warn('retorno config AuthLogin',response.data[0].configuracoes);
                        setModalVisible(false);
                        setLoad(false);
                        return { status: 'sucesso', code: 0, mensagem: 'Sucesso', retorno: response.data[0].configuracoes };
                    }
                } else {

                }
            }
        }
    }

    //-----------------------------------------------------tratamento de ações do aplicativo
    // Função para verificar e executar ação conforme o tipo do parâmetro
    function executarAcao(comando: string, param: any | Function | ReactElement | ReactNode | null, param_2: any | Function | ReactElement | ReactNode | null, tela: string) {
        apresentaModal(
            'load',
            'download-multiple',
            'Processando',
            () => (
                <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                    <ActivityIndicator size={75} color={'blue'} />
                    <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Carregando ambiente de trabalho,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            () => { null }
        );
        switch (comando) {
            case 'login':
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: tela
                        }
                    ]
                })
                break;
            case 'iniOs':
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: tela
                        }
                    ]
                })
                break;
            case 'fimOs':
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: tela
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
    async function IniciarOs(comando: any, localizacao: any, profissional: any, dados: any, codigoStatus: any, os: any, tela: string, acao: Function | ReactElement | ReactNode | undefined | null) {
        switch (comando) {
            case 'iniciarOs':
                apresentaModal(
                    'load',
                    'download-multiple',
                    'Processando',
                    () => (
                        <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                            <ActivityIndicator size={75} color={'blue'} />
                            <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Iniciando ordem de serviço\n\nAguarde...'}</Text>
                        </View>
                    ),
                    'default',
                    () => { null }
                )

                /*try {*/
                const response = await axios({
                    method: 'get',
                    url: Config.configuracoes.pastaProcessos,
                    params: {
                        comando: comando,
                        location: localizacao,
                        id_profissional: profissional,
                        dados: dados,
                        codigo: codigoStatus,
                        os: os,
                        isApp:Config.configuracoes.isApp
                    }
                })
                if (response.data[0] === undefined) {
                    arlterarModal(
                        'error',
                        'close-circle',
                        '*_* Erro',
                        () => (
                            <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('danger'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                                <MaterialCommunityIcons name='close-circle' size={75} style={[getModalStyleLabel('danger')]} />
                                <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'}</Text>
                            </View>
                        ),
                        'danger',
                        () => {
                            return (
                                <>
                                    <TouchableOpacity style={[Styles.btn, Styles.em_linhaHorizontal, Styles.light, Styles.w50, Styles.btnDialog, Styles.btnDialogLeft]}
                                        onPress={() => {
                                            fecharModal('');
                                        }}
                                    >
                                        <Text style={[Styles.ft_medium, Styles.lbllight]}>Não</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[Styles.btn, Styles.em_linhaHorizontal, Styles.success, Styles.w50, Styles.btnDialog, Styles.btnDialogRight]}
                                        onPress={() => {
                                            buscarCoordenadas(tela, dados, codigoStatus, os, () => { navigation.goBack() }, 'iniciarOs');
                                        }}
                                    >
                                        <Text style={[Styles.ft_medium, Styles.lblsuccess]}>Sim</Text>
                                    </TouchableOpacity>
                                </>
                            )
                        },
                        'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'
                    )

                    return { status: 'erro', code: 0, mensagem: 'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor', retorno: null };
                } else if (response.data[0].status === 'OK' && response.data[0].statusCode === 0) {
                    const retorno = response.data[0];
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: retorno };
                }
                /*} catch (error:any) {
                    return {status:'error',code:0,mensagem:error.message,retorno:null};
                }*/
                break;
            case 'finalizarOs':
                const retorno = await uploadImages(dados.dadosOs, dados.dadosOs, localizacao, profissional, os, 1200);

                if (retorno.code === 0) {
                    return { status: 'sucesso', code: 0, mensagem: 'Ordem de serviço finalizada com sucesso!', location: null };
                } else {
                    return { status: 'Erro', code: 739, mensagem: retorno.mensagem, location: null };
                }
                break;
            case 'relatarProblema':
                apresentaModal(
                    'load',
                    'download-multiple',
                    'Processando',
                    () => (
                        <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                            <ActivityIndicator size={75} color={'blue'} />
                            <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Relatando problema,\n\nAguarde...'}</Text>
                        </View>
                    ),
                    'default',
                    () => { null }
                )

                /*try {*/
                const responseProblema = await axios({
                    method: 'get',
                    url: Config.configuracoes.pastaProcessos,
                    params: {
                        comando: comando,
                        location: localizacao,
                        id_profissional: profissional,
                        dados: dados,
                        codigo: codigoStatus,
                        os: os,
                        isApp:Config.configuracoes.isApp
                    }
                })
                if (responseProblema.data[0] === undefined) {
                    arlterarModal(
                        'error',
                        'close-circle',
                        '*_* Erro',
                        () => (
                            <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('danger'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                                <MaterialCommunityIcons name='close-circle' size={75} style={[getModalStyleLabel('danger')]} />
                                <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'}</Text>
                            </View>
                        ),
                        'danger',
                        () => {
                            return (
                                <>
                                    <TouchableOpacity style={[Styles.btn, Styles.em_linhaHorizontal, Styles.light, Styles.w50, Styles.btnDialog, Styles.btnDialogLeft]}
                                        onPress={() => {
                                            fecharModal('');
                                        }}
                                    >
                                        <Text style={[Styles.ft_medium, Styles.lbllight]}>Não</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[Styles.btn, Styles.em_linhaHorizontal, Styles.success, Styles.w50, Styles.btnDialog, Styles.btnDialogRight]}
                                        onPress={() => {
                                            buscarCoordenadas(tela, dados, codigoStatus, os, () => { navigation.goBack() }, 'iniciarOs');
                                        }}
                                    >
                                        <Text style={[Styles.ft_medium, Styles.lblsuccess]}>Sim</Text>
                                    </TouchableOpacity>
                                </>
                            )
                        },
                        'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'
                    )

                    return { status: 'erro', code: 0, mensagem: 'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor', retorno: null };
                } else if (responseProblema.data[0].status === 'OK' && responseProblema.data[0].statusCode === 0) {
                    const retorno = responseProblema.data[0];
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: retorno };
                }
                /*} catch (error:any) {
                    return {status:'error',code:0,mensagem:error.message,retorno:null};
                }*/
                break;
        }

    }

    async function OsIniciada(dadosOs: any, param_1: any | Function | ReactElement | ReactNode | null, param_2: any | Function | ReactElement | ReactNode | null, tela: string) {
        apresentaModal(
            'load',
            'download-multiple',
            'Processando',
            () => (
                <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                    <ActivityIndicator size={75} color={'blue'} />
                    <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Salvando ordem de serviço,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            () => { null }
        )
        try {
            if (dadosOs === '') {
                await AsyncStorage.removeItem('OsIniciada');
                const amlApp = await AlimentarApp()

                if (amlApp.code === 0) {
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
                } else {
                    return { status: 'error', code: 774, mensagem: 'Erro ao alimentar o app' };
                }
            } else {
                await AsyncStorage.setItem('OsIniciada', dadosOs);
                const amlApp = await AlimentarApp();

                if (amlApp.code === 0) {
                    return { status: 'sucesso', code: 0, mensagem: 'Sucesso' };
                } else {
                    return { status: 'error', code: 293, mensagem: 'Erro ao alimentar o aplicativo!' };
                }
            }
        } catch (error: any) {
            return { status: 'error', code: 781, mensagem: error.message };
        }
    }

    async function buscarCoordenadas(tela: string, DadosOs: any, codigoStatusOs: number, os: number | string, acao?: Function | ReactElement | ReactNode | undefined, comando: string) {
        //tenta pegar a localização
        if (isConnectedNetwork === false) {
            arlterarModal(
                'load',
                'map-marker-plus',
                'Processando pedido...',
                () => (
                    <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                        <ActivityIndicator size={75} color={'blue'} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Carregando localização, Por você estar offline\n a precisão pode não ser exata. \n\nAguarde...'}</Text>
                    </View>
                ),
                'default',
                () => { null },
                'Carregando localização, Por você estar offline\n a precisão pode não ser exata.\n\nAguarde...'
            )
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Permissão para acessar localização foi negada.');
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setLocation(currentLocation);
            if (currentLocation) {
                return { status: 'sucesso', code: 0, mensagem: 'sucesso', location: currentLocation };
            }
            return { status: 'error', code: 788, mensagem: 'Location não carregado!' };
        } else {
            arlterarModal(
                'load',
                'map-marker-plus',
                'Processando pedido...',
                () => (
                    <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                        <ActivityIndicator size={75} color={'blue'} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Carregando localização. \n\nAguarde...'}</Text>
                    </View>
                ),
                'default',
                () => { null },
                'Carregando localização.\n\nAguarde...'
            )
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão negada', 'Permissão para acessar localização foi negada.');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                if (location) {
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso', location: location };
                }
                return { status: 'error', code: 788, mensagem: 'Location não carregado!' };
            } catch (error: any) {
                return { status: 'error', code: 785, mensagem: error.message };
            }
        }
    }
    //-----------------------------------------------------inicio das funções da imagens da os
    const uploadImages = async (osDados: any, dados: any, loc: string, prof: string, os: string, statusOs: number) => {
        await AlimentarApp();
        let formData = new FormData();
        //adiciona as imagens ao formdata
        const addImagesToFormData = (images: any, fieldName: any) => {
            if (images !== null) {

                images.forEach((imageUri: any, index: number) => {
                    if (imageUri.url === undefined) {
                        let uriParts = imageUri.split('.');
                        let carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                        let fileType = uriParts[uriParts.length - 1];
                        formData.append('arquvios[]', {
                            uri: imageUri.url,
                            name: `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`,
                            type: `image/${fileType}`,
                        });
                    } else {
                        let uriParts = (imageUri.url).split('.');
                        let carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                        let fileType = uriParts[uriParts.length - 1];
                        formData.append('arquivos[]', {
                            uri: imageUri.url,
                            name: `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`,
                            type: `image/${fileType}`,
                        });
                    }

                });
            } else {
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
        formData.append('os', os);
        formData.append('usuario', prof);
        formData.append('comando', 'finalizarOs');
        formData.append('location', loc);
        formData.append('codigoStatus', '' + statusOs + '');
        formData.append('isApp',Config.configuracoes.isApp)
        //tenta enviar a requisição para api
        //setMsg('Enviando imagens e informações da O.S.\n\nAguarde...');
        try {
            const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (response.data[0].status === 'OK' && response.data[0].statusCode === 0) {
                //setModalVisible(false);
                arlterarModal(
                    'success',
                    'check-all',
                    'Finalizado',
                    () => (
                        <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('success'), {}]}>
                            <MaterialCommunityIcons name='check-circle' size={75} style={[getModalStyleLabel('success'), { marginBottom: 20 }]} />
                            <Text style={[Styles.w100, Styles.ft_bold, getModalStyleLabel('success'), { textAlign: 'center', marginBottom: 20 }]}>{response.data[0].statusMensagem}</Text>
                        </View>
                    ),
                    'success',
                    () => (
                        <View style={[Styles.em_linhaHorizontal, { justifyContent: 'space-between' }]}>
                            <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogcentered, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}
                                onPress={() => {
                                    setOsIniciada({ status: false, dadosOs: null, tela: 'home os' });
                                    salvarVariaveis('OsIniciada', 'OsIniciada', JSON.stringify({ status: false, dadosOs: null, tela: 'home os' }));
                                    fecharModal('');

                                    setTimeout(() => {
                                        executarAcao('fimOs', '', '', 'home os');
                                    }, 3000);
                                }}
                            >
                                <Text style={[Styles.ft_regular, Styles.lbllight]}>Continuar!</Text>
                            </TouchableOpacity>
                        </View>
                    ),
                    '' + response.data[0].statusMensagem + ''
                )
                return { status: 'sucesso', code: 0, mensagem: 'Ordem de serviço finalizada com sucesso!', location: null };
            } else {
                setModalVisible(false);
                return { status: 'error', code: 914, mensagem: 'Erro ao finalizar a ordem de serviço!\n\n', location: null };
            }
        } catch (error: any) {
            setModalVisible(false);
            return { status: 'error', code: 914, mensagem: 'Erro ao finalizar a ordem de serviço!\n\n' + error.message, location: null };
        }
    };
    //-----------------------------------------------------fim das funções da imagens da os
    async function carregarTodasImagens() {
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
        return { status: 'sucesso', code: 0, mensagem: 'Imagem adicionada com sucesso!', retorno: 'OK' };
    }

    const adicionarImagemEmbalagem = async (dados: any) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 1,
        });

        if (!result.canceled) {
            const coordenadas = await buscarCoordenadas('embalagem', null, 1100, 0, () => { null }, '');
            if (coordenadas?.code === 0) {
                const novaImagem = { url: result.assets[0].uri, location: coordenadas?.location, dataInicio: dataLocal + ' ' + horaLocal };
                const novasImagens: any | null = imagensEmbalagem ? [...imagensEmbalagem, novaImagem] : [novaImagem];
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
                () => (
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                () => {
                    <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                        onPress={() => {
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight]}>OK!</Text>
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
            () => (
                <>
                    <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]} />
                    <Text style={[Styles.ft_medium, getModalStyleLabel('success'), { marginBottom: 25 }]}>Imagem excluida com sucesso!</Text>
                </>
            ),
            'success',
            () => {
                return (
                    <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                        onPress={() => {
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight]}>Fechar</Text>
                    </TouchableOpacity>
                )
            },
            ''
        )
    };

    const adicionarImagemAmbiente = async (tipoImagem: any) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            base64: true,
            quality: .4,
        });

        if (!result.canceled) {
            const coordenadas = await buscarCoordenadas('embalagem', null, 1100, 0, () => { null }, '');
            if (coordenadas.code === 0) {
                const novaImagem = { url: result.assets[0].uri, location: coordenadas?.location, dataInicio: dataLocal + ' ' + horaLocal };
                const novasImagens: any | null = imagensAmbiente ? [...imagensAmbiente, novaImagem] : [novaImagem];
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
                () => (
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                () => {
                    <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                        onPress={() => {
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight]}>OK!</Text>
                    </TouchableOpacity>
                },
                ''
            )
            console.error(`Índice inválido para remoção de imagem: ${index}`);
            return;
        }

        // Remove a imagem do estado
        const novasImagens = imagensAmbiente.filter((_, idx: any) => idx !== index);
        setImagensEmbalagem(novasImagens);

        // Atualiza o AsyncStorage
        await AsyncStorage.setItem('imagens_ambiente', JSON.stringify(novasImagens));

        // Carrega todas as imagens novamente (se necessário)
        carregarTodasImagens();
        arlterarModal(
            'success',
            'check-all',
            'Sucesso',
            () => (
                <>
                    <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]} />
                    <Text style={[Styles.ft_medium, getModalStyleLabel('success'), { marginBottom: 25 }]}>Imagem excluida com sucesso!</Text>
                </>
            ),
            'success',
            () => {
                return (
                    <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                        onPress={() => {
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight]}>Fechar</Text>
                    </TouchableOpacity>
                )
            },
            ''
        )
    };

    const adicionarImagemProblema = async (tipoImagem: any) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            base64: true,
            quality: .4,
        });

        if (!result.canceled) {
            const coords = await buscarCoordenadas('problema', null, 1100, 0, () => { null }, '');

            if (coords?.code === 0) {
                const novaImagem = { url: result.assets[0].uri, location: coords, dataInicio: dataLocal + ' ' + horaLocal };
                const novasImagens: any | null = imagensProblema ? [...imagensProblema, novaImagem] : [novaImagem];
                setImagensProblema(novasImagens);
                await AsyncStorage.setItem('imagens_problemas', JSON.stringify(novasImagens));
                carregarTodasImagens()
                showToastWithGravityAndOffset('Imagem adicionada com sucesso!');
                fecharModal('');
            } else {
                showToastWithGravityAndOffset('Erro ao adicionar a imagem!');
                fecharModal('');
            }

        }
    };

    const showToastWithGravityAndOffset = (mensagem: string) => {
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
                () => (
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                () => {
                    <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                        onPress={() => {
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight]}>OK!</Text>
                    </TouchableOpacity>
                },
                ''
            )
            console.error(`Índice inválido para remoção de imagem: ${index}`);
            return;
        }

        // Remove a imagem do estado
        const novasImagens = imagensProblema.filter((_, idx: any) => idx !== index);
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

    async function limparImagens() {
        setImagensEmbalagem(null);
        setImagensMontado(null);
        setImagensAmbiente(null)
        try {
            await AsyncStorage.removeItem('imagens_embalagem');
            await AsyncStorage.removeItem('imagens_montagem');
            await AsyncStorage.removeItem('imagens_ambiente');
            carregarTodasImagens();
            return { status: 'Sucesso', code: 0, retorno: 'imagens limpas com sucesso!' };
        } catch (error: any) {
            //console.log('Erro ao limpar as imagens=>', error.message)
            return { status: 'Erro', code: 1562, retorno: error.message };
        }
    }

    const adicionarImagemMontagem = async (tipoImagem: any) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            base64: true,
            quality: .4,
        });

        if (!result.canceled) {
            const coordenadas = await buscarCoordenadas('embalagem', null, 1100, 0, () => { null }, '');

            if (coordenadas?.code === 0) {
                const novaImagem = { url: result.assets[0].uri, location: coordenadas?.location, dataInicio: dataLocal + ' ' + horaLocal };
                const novasImagens: any = imagensMontado ? [...imagensMontado, novaImagem] : [novaImagem];
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
                () => (
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                () => {
                    <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                        onPress={() => {
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight]}>OK!</Text>
                    </TouchableOpacity>
                },
                ''
            )
            console.error(`Índice inválido para remoção de imagem: ${index}`);
            return;
        }

        // Remove a imagem do estado
        const novasImagens = imagensMontado.filter((_, idx: any) => idx !== index);
        setImagensMontado(novasImagens);

        // Atualiza o AsyncStorage
        await AsyncStorage.setItem('imagens_montado', JSON.stringify(novasImagens));

        // Carrega todas as imagens novamente (se necessário)
        carregarTodasImagens();
        arlterarModal(
            'success',
            'check-all',
            'Sucesso',
            () => (
                <>
                    <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]} />
                    <Text style={[Styles.ft_medium, getModalStyleLabel('success'), { marginBottom: 25 }]}>Imagem excluida com sucesso!</Text>
                </>
            ),
            'success',
            () => {
                return (
                    <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                        onPress={() => {
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular, Styles.lbllight]}>Fechar</Text>
                    </TouchableOpacity>
                )
            },
            ''
        )
    };

    async function enviarImagensFinalizadas(comando: string, imagens: any, assinatura: any) {
        try {
            let formData = new FormData();

            const addImagesToFormData = (images: any, fieldName: any) => {
                if (images !== null) {
                    images.forEach((imageUri: any, index: number) => {
                        let uriParts = imageUri.split('.');
                        let fileType = uriParts[uriParts.length - 1];
                        formData.append(fieldName, {
                            uri: imageUri,
                            name: `${fieldName}.${fileType}`,
                            type: `image/${fileType}`,
                        });
                    });
                } else {
                    switch (fieldName) {
                        case 'imagensmbalagem[]':
                            Alert.alert('Erro', 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"');
                            setModalVisible(false);
                            //setMsg('');
                            break;
                        case 'imagensontagem[]':
                            Alert.alert('Erro', 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"');
                            setModalVisible(false);
                            //setMsg('');
                            break;
                        case 'imagensmbiente[]':
                            Alert.alert('Erro', 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"');
                            setModalVisible(false);
                            //setMsg('');
                            break;
                    }
                }
            };

            formData.append('comando', 'verificarImagens');
            formData.append('isApp',Config.configuracoes.isApp)
            formData.append('arquivoAss', {
                uri: assinatura,
                name: `arquivoAss`,
                type: `image/jpg`,
            })


            await axios.post(Config.configuracoes.pastaProcessos, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                return response;
            }).catch((responseError) => {
                return responseError;
            })
        } catch (error) {
            return error;
        }
    }
    //-----------------------------------------------------fim das funções da imagens da os
    //-----------------------------------------------------começo das configurações de assinatura
    // Função para manipular a imagem (opcional: salvar na galeria)
    const manipulateAndSaveImage = async (uri: any) => {
        try {
            // Manipula a imagem (por exemplo, redimensionar, comprimir, etc.)
            const manipulatedImage = await manipulateAsync(
                uri,
                [{ resize: { width: 800 } }], // Exemplo de redimensionamento
                { compress: 0.7, format: SaveFormat.JPEG } // Exemplo de compressão e formato
            );

            // Salva a imagem manipulada na galeria (opcional)
            const savedImage = await manipulateAsync(manipulatedImage.uri);

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

            const enviarImagens = await enviarImagensFinalizadas('arquivoAss', null, uri);
            // Define a imagem capturada para exibição na interface (opcional)
            //setCapturedImage(rotatedImageUri);
            apresentaModal(
                'success',
                'alert-circle',
                'Sucesso', () => (
                    <View style={[Styles.em_linhaVertical]}>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('success')]} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('success'), { marginBottom: 25 }]}>{'Montagem finalizada com sucesso!\nSalvamos em:\n\n' + rotatedImageUri}</Text>
                    </View>
                ), 'success',
                () => (
                    <TouchableOpacity style={[Styles.w100, Styles.btn, Styles.em_linhaHorizontal, Styles.success, { marginHorizontal: 0, marginVertical: 0, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}
                        onPress={() => { fecharModal('') }}
                    >
                        <Text style={[Styles.lblsuccess, Styles.ft_regular]}>OK!</Text>
                    </TouchableOpacity>
                )
            );
            //buscarCoordenadas('assinatura',osInicada.dadosOs.dadosOs.dadosOs,1200,osInicada.dadosOs.dadosOs.dadosOs.os,()=>{navigation.navigate('home os')})//uploadImages(osDados:any,dados:any,loc:string,prof:string)
            // Envia a imagem para o servidor (substitua com sua lógica de envio)
            //enviarImagemParaServidor(rotatedImageUri);
        } catch (error: any) {
            apresentaModal(
                'error',
                'alert-circle',
                'Erro', () => (
                    <View style={[Styles.em_linhaVertical]}>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('danger'), { marginBottom: 25 }]}>{'Erro grave no app:\n\nEncontramos um erro ao salvar ou enviar a imagem.'}</Text>
                    </View>
                ), 'danger',
                () => (
                    <TouchableOpacity style={[Styles.w100, Styles.btn, Styles.em_linhaHorizontal, Styles.success, { marginHorizontal: 0, marginVertical: 0, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}
                        onPress={() => { fecharModal('') }}
                    >
                        <Text style={[Styles.lblsuccess, Styles.ft_regular]}>OK!</Text>
                    </TouchableOpacity>
                ));
            //Alert.alert('Erro', 'Não foi possível salvar a imagem.');
        }
    };

    const rotateImage = async (imageUri: string | any) => {
        try {
            // Realiza a rotação da imagem utilizando expo-image-manipulator

            const manipulatedImage = await manipulateAsync(
                imageUri,
                [{ rotate: 90 }], // Configuração de rotação (90 graus no exemplo)
                { compress: 1, format: SaveFormat.JPEG }
            );
            return manipulatedImage.uri;
        } catch (error) {
        }

    };

    const captureCanvas = async () => {
        try {
            // Captura a visualização do Canvas como uma imagem
            const uri = await captureRef(canvasRef, { format: 'jpg', quality: 1 });
            return uri;
        } catch (error) {
        }

    };

    async function logof(acao: Function) {
        apresentaModal(
            'load',
            'logout',
            'realizando logoff',
            () => (
                <View style={[Styles.em_linhaVertical, Styles.w100]}>
                    <ActivityIndicator size={75} color={'blue'} animating={true} style={[{ marginBottom: 20 }]} />
                    <Text style={[Styles.ft_medium, { marginBottom: 20, textAlign: 'center' }]}>{'Realizando logoff\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            () => { null }
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
                () => (
                    <View style={[Styles.em_linhaVertical, Styles.w100]}>
                        <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]} />
                        <Text style={[Styles.ft_medium, getModalStyleLabel('success'), { marginBottom: 20, textAlign: 'center' }]}>{'Logoff, Realizado com sucesso!'}</Text>
                    </View>
                ),
                'success',
                () => { null },
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
    async function sendNotification(comando: string, params: any) {
        switch (comando) {
            case 'montador':
                try {
                    await axios({
                        method: 'get',
                        url: Config.configuracoes.pastaProcessos,
                        params: {
                            comando: 'sendnotification',
                            directionTo: comando,
                            assunto: params.assunto,
                            de: params.de,
                            para: params.para,
                            mensagem: params.mensagem,
                            prioridade: params.prioridade,
                            isApp:Config.configuracoes.isApp
                        }
                    }).then((response) => {
                    }).catch(() => {

                    })
                } catch (error) {

                }
                apresentaModal(
                    'success',
                    'check-all',
                    'sucesso',
                    () => (
                        <View style={[Styles.em_linhaVertical, getModalStyle('success'), { marginBottom: 20 }]}>
                            <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]} />
                            <Text style={[Styles.ft_medium, getModalStyleLabel('success'), { textAlign: 'center' }]}>{'Notificação enviada com sucesso\n\nAguarde o retorno...'}</Text>
                        </View>
                    ),
                    'success',
                    () => (
                        <View style={[Styles.em_linhaHorizontal, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}>
                            <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.w100, Styles.btn, Styles.btnDialog, Styles.btnDialogcentered, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}
                                onPress={() => {
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
    async function testeConfig(url: any) {
        apresentaModal(
            'load',
            'connection',
            'Teste de API',
            () => (
                <View style={[Styles.w100, Styles.em_linhaVertical, getModalStyle('default')]}>
                    <ActivityIndicator size={75} animating color={'blue'} style={[{ marginBottom: 20 }]} />
                    <Text style={[Styles.ft_medium, { textAlign: 'center' }]}>{'testando conexão,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            () => { null }
        )
        try {
            await axios({
                method: 'get',
                url: url,
                params:{
                    isApp:Config.configuracoes.isApp
                }
            }).then((response) => {
                if (response.status === 200) {
                    arlterarModal(
                        'success',
                        'connection',
                        'Sucesso!',
                        () => (
                            <View style={[Styles.w100, Styles.em_linhaVertical, getModalStyle('default')]}>
                                <MaterialCommunityIcons name='check-circle' size={75} style={[getModalStyleLabel('success'), { marginBottom: 20 }]} />
                                <Text style={[Styles.ft_medium, { textAlign: 'center', marginBottom: 20 }]}>{'Teste para API: "' + url + '",\n\n Bem sucedida!'}</Text>
                            </View>
                        ),
                        'default',
                        () => { null },
                        'Teste para API: "' + url + '", Bem sucedida!'
                    )
                } else {

                }
            }).catch((responseCatch) => {

            })
        } catch (error) {

        }
    }
    //
    //

    // ===== MÉTODO 3: Implementação manual (sem dependências) =====
    const Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        encode: function (input: string): string {
            let output = "";
            let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            let i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }

            return output;
        },

        decode: function (input: string): string {
            let output = "";
            let chr1, chr2, chr3;
            let enc1, enc2, enc3, enc4;
            let i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }

            output = Base64._utf8_decode(output);

            return output;
        },

        _utf8_encode: function (string: string): string {
            string = string.replace(/\r\n/g, "\n");
            let utftext = "";

            for (let n = 0; n < string.length; n++) {
                const c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }

            return utftext;
        },

        _utf8_decode: function (utftext: string): string {
            let string = "";
            let i = 0;
            let c = 0;
            let c2 = 0;
            let c3 = 0;

            while (i < utftext.length) {
                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }

            return string;
        }
    };
    async function buscarEmpresas(comando: string, perfil: string) {

        try {
            const response = await axios({
                method: 'get',
                url: Config.configuracoes.pastaProcessos,
                params: {
                    comando: comando,
                    filters: perfil,
                    isApp:Config.configuracoes.isApp
                }
            });
            if (response.data[0].status === 'OK' && response.data[0].statusCode === 0) {
                const retorno = response.data[0];
                setListParceiros(response.data[0].empresas);
                return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: retorno };
            } else {
                //console.log('retorno response', response);
            }
        } catch (error: any) {
            return { status: 'Erro', code: 0, mensagem: error.message, retorno: null };

        }
    }

    async function faturamento(comando: any, dataInicial: any, dataFinal: any, idEmpresa: string, User: string) {
        try {
            const response = await axios({
                method: 'get',
                url:Config.configuracoes.pastaProcessos,
                params: {
                    comando: comando,
                    dataInicial: dataInicial,
                    dataFinal: dataFinal,
                    id_user: idEmpresa,
                    id_loja: User,
                    isApp:Config.configuracoes.isApp
                }
            })
            if (response.data[0].status === 'OK' && response.data[0].statusCode === 200) {
                if (response.data[0].faturamento !== null) {

                    setItemsFat(response.data[0].faturamento)
                    setQtdOs(response.data[0].qtdOs);
                    setTotalFat(response.data[0].totalFat);
                    const retorno = await salvarVariaveis(
                        'Faturamento',
                        'Faturamento',
                        JSON.stringify(response.data[0].faturamento)
                    )

                    if (retorno?.code === 0) {
                        setLoad(false)
                        //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                        //executarAcao('', null, null, '');
                        return { status: 'sucesso', code: 0, mensagem: 'sucesso', return: response.data[0].faturamento };
                    } else {
                        return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                    }
                } else {
                    setItemsFat(response.data[0].faturamento)
                    setQtdOs(0);
                    setTotalFat(0);
                    const retorno = await salvarVariaveis(
                        'Faturamento',
                        'Faturamento',
                        ''
                    )

                    if (retorno?.code === 0) {
                        setLoad(false)
                        //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                        executarAcao('', null, null, '');
                        return { status: 'sucesso', code: 0, mensagem: 'sucesso', return: response.data[0].faturamento };
                    } else {
                        return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                    }
                }
            } else {
                setItemsFat(response.data[0].faturamento)
                setQtdOs(0);
                setTotalFat(0);
                const retorno = await salvarVariaveis(
                    'Faturamento',
                    'Faturamento',
                    ''
                )

                if (retorno?.code === 0) {
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('', null, null, '');
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
                } else {
                    return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                }
            }
        } catch (error: any) {
            return { status: 'error', code: 622, mensagem: error.message };
        }
    }

    async function parceiroSearch(comando: any, idEmpresa: string) {
        try {
            const response = await axios({
                method: 'get',
                url: Config.configuracoes.pastaProcessos,
                params: {
                    comando: comando,
                    id: idEmpresa,
                    isApp:Config.configuracoes.isApp
                }
            })
            if (response.data[0].parceiros !== null) {

                setParceiros(response.data[0].parceiros)
                const retorno = await salvarVariaveis(
                    'parceiros',
                    'parceiros',
                    JSON.stringify(response.data[0].parceiros)
                )

                if (retorno?.code === 0) {
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    //executarAcao('', null, null, '');
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
                } else {
                    return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                }
            } else {
                setParceiros(response.data[0].parceiros)
                const retorno = await salvarVariaveis(
                    'parceiros',
                    'parceiros',
                    ''
                )

                if (retorno?.code === 0) {
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('', null, null, '');
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
                } else {
                    return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                }
            }
        } catch (error: any) {
            return { status: 'error', code: 622, mensagem: error.message };
        }
    }

    async function fechamentos(comando: any, idEmpresa: string, user: any, data_ini: any, data_fim: any) {
        try {
            const response = await axios({
                method: 'get',
                url: Config.configuracoes.pastaProcessos,
                params: {
                    comando: comando,
                    loja: idEmpresa,
                    user: user,
                    dt_ini: data_ini,
                    dt_fim: data_fim,
                    isApp:Config.configuracoes.isApp
                }
            })
            if (response.data[0].fechamentos !== null) {

                setFechamentos_(response.data[0].fechamentos)
                const retorno = await salvarVariaveis(
                    'fechamentos',
                    'fechamentos',
                    JSON.stringify(response.data[0].fechamentos)
                )

                if (retorno?.code === 0) {
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('', null, null, '');
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
                } else {
                    return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                }
            } else {
                setFechamentos_(response.data[0].fechamentos)
                const retorno = await salvarVariaveis(
                    'fechamentos',
                    'fechamentos',
                    ''
                )

                if (retorno?.code === 0) {
                    setLoad(false)
                    //executarAcao(comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string)
                    executarAcao('', null, null, '');
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso' };
                } else {
                    return { status: 'error', code: 581, mensagem: 'Erro ao buscar as ordens de serviço!' };
                }
            }
        } catch (error: any) {
            return { status: 'error', code: 622, mensagem: error.message };
        }
    }

    async function IniciarOsOffline(comando: any, localizacao: any, profissional: any, dados: any, codigoStatus: any, os: any, tela: string, acao: Function | ReactElement | ReactNode | undefined | null) {
        switch (comando) {
            case 'iniciarOs':
                // Atualizar o status
                dados.status = codigoStatus;

                // Adicionar imagens ao array imagens_caixa
                //dados.imagens_caixa.push(imagensEmbalagem);

                // Verificar o resultado
                setListMinhasOs(dados)
                const retorno = await salvarVariaveis(
                    'listMinhasOs',
                    'listMinhasOs',
                    JSON.stringify(dados)
                )

                if (retorno.code === 0) {
                    return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: retorno };
                } else {
                    return { status: 'erro', code: 2168, mensagem: 'erro', retorno: retorno };
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
                }

                try {
                    dados.imagens_montados = dados.imagens_montados || [];
                    dados.imagens_montados.push(imagensMontado);
                } catch (error) {
                }

                try {
                    dados.imagens_ambiente = dados.imagens_ambiente || [];
                    dados.imagens_ambiente.push(imagensAmbiente);
                } catch (error) {
                }
                // Filtra a OS a ser removida da lista principal

                //console.log('Lista de OS:', listMinhasOs);
                let listaArray = Array.isArray(listMinhasOs) ? listMinhasOs : [listMinhasOs];
                if (listaArray !== null && listaArray !== undefined) {
                    if (Array.isArray(listaArray)) {
                        var listMinhasOs_ = [...listaArray]; // Copia segura do array
                        //console.log('OS a ser removida:', dados.os);
                        try {
                            let novaOsList = listMinhasOs_.filter(item => item.os !== dados.os);
                            //console.log('Nova lista de OS após filtro:', novaOsList);

                            setListMinhasOs(novaOsList);

                            let listOffline = listOsOffline || [];
                            listOffline.push(dados);
                            setListOsOffline(listOffline);

                            const retornoSave = await salvarVariaveis(
                                'listMinhasOs',
                                'listMinhasOs',
                                JSON.stringify(novaOsList.length === 0 ? [] : novaOsList)
                            );

                            if (retornoSave?.code === 0) {
                                const listaOffline = await salvarVariaveis('listOffline', 'listOffline', JSON.stringify(listOffline));

                                if (listaOffline.code === 0) {
                                    const almApp = await AlimentarApp();
                                    if (almApp.code === 0) {
                                        return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: retornoSave };
                                    }
                                }
                            }
                            return { status: 'erro', code: 2168, mensagem: 'erro', retorno: retornoSave };
                        } catch (error:any) {
                            console.error('Erro ao processar:', error);
                            return { status: 'erro', code: 2168, mensagem: 'erro', retorno: error.message };
                        }
                    } else {
                        //console.log('Erro: A lista de OS está vazia ou indefinida.');
                        return { status: 'erro', code: 2168, mensagem: 'A lista não é um array' };
                    }
                } else {
                    //console.log('Erro: A lista de OS está vazia ou indefinida.');
                    return { status: 'erro', code: 2168, mensagem: 'Não executou o if.' };
                }
                break;
        }
    }

    /*async function enviarOsOfflines() {
        console.log('inicio do envio---------------------');
        console.log('Total de OS para enviar:', listOsOffline?.length || 0);

        // Valida se existe lista
        if (!listOsOffline || listOsOffline.length === 0) {
            return {
                status: 'Erro',
                code: 1001,
                mensagem: 'Erro',
                retorno: 'Não há O.S. offline para enviar.'
            };
        }

        const totalOS = listOsOffline.length;

        for (let index = 0; index < totalOS; index++) {
            const numeroAtual = index + 1;

            console.log(`\n=== Enviando OS ${numeroAtual} de ${totalOS} ===`);

            // Atualiza o modal ANTES de processar
            arlterarModal(
                'load',
                'archive-check',
                'Enviando...',
                () => (
                    <View style={[
                        Styles.em_linhaVertical,
                        Styles.w100,
                        getModalStyle('light'),
                        { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }
                    ]}>
                        <ActivityIndicator size={75} color={'blue'} />
                        <ThemedText type='title'>
                            Enviando {numeroAtual} de {totalOS}
                        </ThemedText>
                        <Text style={[
                            Styles.ft_medium,
                            getModalStyleLabel('light'),
                            { textAlign: 'center', marginBottom: 25 }
                        ]}>
                            Iniciando envio de O.S. OFFLINE,{'\n'}
                            Isso pode demorar alguns minutos,{'\n\n'}
                            Aguarde...
                        </Text>
                    </View>
                ),
                'default',
                () => null,
                'Iniciando envio de O.S. OFFLINE,\nIsso pode demorar alguns minutos,\n\nAguarde...'
            );

            const element = listOsOffline[index];

            // Valida o elemento antes de enviar
            if (!element) {
                console.log(`Elemento ${numeroAtual} está vazio ou inválido`);
                continue; // Pula para o próximo
            }

            console.log('Verificando elemento antes de enviar:', {
                index: index,
                hasElement: !!element,
                hasFilial: !!element?.filial,
                hasImagensCaixa: !!element?.imagens_caixa,
                imagensCaixaLength: element?.imagens_caixa?.length,
                primeiroItemCaixa: element?.imagens_caixa?.[0],
                hasImagensMontados: !!element?.imagens_montados,
                imagensMontadosLength: element?.imagens_montados?.length,
                primeiroItemMontado: element?.imagens_montados?.[0],
                hasImagensAmbiente: !!element?.imagens_ambiente,
                imagensAmbienteLength: element?.imagens_ambiente?.length,
                os: element?.os,
            });

            // Aguarda um pequeno delay para garantir que o modal seja renderizado
            await new Promise(resolve => setTimeout(resolve, 100));

            try {
                // Envia a OS e aguarda o resultado
                const resultado = await enviarOS(element);

                console.log(`Resultado do envio da OS ${numeroAtual}:`, resultado);

                // Verifica se houve erro
                if (!resultado || resultado.code !== 0) {
                    console.log(`Erro no envio da OS ${numeroAtual}:`, resultado);

                    // Atualiza modal com erro
                    arlterarModal(
                        'error',
                        'alert-circle',
                        'Erro no envio',
                        () => (
                            <View style={[
                                Styles.em_linhaVertical,
                                Styles.w100,
                                getModalStyle('light'),
                                { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }
                            ]}>
                                <Text style={[
                                    Styles.ft_medium,
                                    getModalStyleLabel('light'),
                                    { textAlign: 'center', marginBottom: 25, color: 'red' }
                                ]}>
                                    Erro ao enviar OS {numeroAtual} de {totalOS}:{'\n\n'}
                                    {resultado?.retorno || 'Erro desconhecido'}
                                </Text>
                            </View>
                        ),
                        'default',
                        () => null,
                        resultado?.retorno || 'Erro desconhecido'
                    );

                    return {
                        status: 'Erro',
                        code: resultado?.code || 9999,
                        mensagem: 'Erro',
                        retorno: resultado?.retorno || 'Erro desconhecido ao enviar OS'
                    };
                }

                console.log(`✓ OS ${numeroAtual} enviada com sucesso`);

            } catch (error: any) {
                console.log(`Exceção capturada ao enviar OS ${numeroAtual}:`, error);
                console.log('Stack trace:', error.stack);

                return {
                    status: 'Erro',
                    code: 9998,
                    mensagem: 'Erro',
                    retorno: `Erro ao processar OS ${numeroAtual}: ${error.message}`
                };
            }
        }

        console.log('✓✓✓ Todas as OS foram enviadas com sucesso ✓✓✓');

        // Atualiza modal de sucesso
        arlterarModal(
            'success',
            'check-circle',
            'Sucesso!',
            () => (
                <View style={[
                    Styles.em_linhaVertical,
                    Styles.w100,
                    getModalStyle('light'),
                    { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }
                ]}>
                    <Text style={[
                        Styles.ft_medium,
                        getModalStyleLabel('light'),
                        { textAlign: 'center', marginBottom: 25, color: 'green' }
                    ]}>
                        Todas as {totalOS} O.S. foram enviadas com sucesso!
                    </Text>
                </View>
            ),
            'default',
            () => null,
            'Envio concluído com sucesso'
        );

        return {
            status: 'sucesso',
            code: 0,
            mensagem: 'sucesso',
            retorno: `Todas as ${totalOS} O.S. foram enviadas com sucesso.`
        };
    }*/

    /*async function enviarOsOfflines() {
        console.log('inicio do envio---------------------')
        let NumItemOfList = 0;
        for (let index = 0; index < listOsOffline.length; index++) {
            NumItemOfList++;
            arlterarModal(
                'load',
                'archive-check',
                'Enviando...',
                () => (
                    <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('light'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                        <ActivityIndicator size={75} color={'blue'} />
                        <ThemedText type='title'>Enviando {NumItemOfList + ' de ' + parseInt(listOsOffline.length)}</ThemedText>
                        <Text style={[Styles.ft_medium, getModalStyleLabel('light'), { textAlign: 'center', marginBottom: 25 }]}>{'Iniciando envio de O.S. OFFLINE,\nIsso pode demorar alguns minutos,\n\nAguarde...'}</Text>
                    </View>
                ),
                'default',
                () => { null },
                'Iniciando envio de O.S. OFFLINE,\nIsso pode demorar alguns minutos,\n\nAguarde...'
            )
            const element = listOsOffline[index];
            console.log('verificando itens do array=>', element);
            // Aqui, você envia a OS e espera o retorno da promessa
            const resultado = await enviarOS(element);

            if (resultado?.code !== 0) {
                console.log('Erro no envio--------------------->', resultado);
                return { status: 'Erro', code: resultado?.code, mensagem: 'Erro', retorno: resultado?.retorno };
            }
        }
        console.log('Enviadas com sucesso---------------------')
        return { status: 'sucesso', code: 0, mensagem: 'sucesso', retorno: 'Todas as O.S. foram enviadas com sucesso.' };
    }*/

    async function removerOsOffline(IdOs: number) {
        if (IdOs !== null) {
            let lista = listOsOffline.filter(item => item.os !== IdOs);

            const retornoSaveList = await salvarVariaveis('listOffline', 'listOffline', JSON.stringify(lista));

            if (retornoSaveList.code === 0) {
                setLoad(false);
                fecharModal('');
                return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: retornoSaveList?.mensagem };

            } else {
                setLoad(false);
                fecharModal('');
                return { status: 'Erro', code: 2315, mensagem: 'Erro', retorno: retornoSaveList?.mensagem };
            }
        }
    }

    async function removerOsListMinhasOs(IdOs: number) {
        if (IdOs !== null) {
            try {
                let lista = listMinhasOs.filter(item => item.os !== IdOs);

                const retornoSaveList = await salvarVariaveis('listMinhasOs', 'listMinhasOs', JSON.stringify(lista));

                if (retornoSaveList.code === 0) {
                    setLoad(false);
                    fecharModal('');
                    return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: retornoSaveList?.mensagem };

                } else {
                    setLoad(false);
                    fecharModal('');
                    return { status: 'Erro', code: 2315, mensagem: 'Erro', retorno: retornoSaveList?.mensagem };
                }
            } catch (error: any) {
                setLoad(false);
                fecharModal('');
                return { status: 'Erro', code: 2315, mensagem: 'Erro', retorno: error.message };
            }

        }
    }

    // ===== FUNÇÃO PRINCIPAL: enviarOsOfflines =====
    async function enviarOsOfflines() {
        //console.log('inicio do envio---------------------');
        //console.log('Total de OS para enviar:', listOsOffline?.length || 0);

        // Valida se existe lista
        if (!listOsOffline || listOsOffline.length === 0) {
            return {
                status: 'Erro',
                code: 1001,
                mensagem: 'Erro',
                retorno: 'Não há O.S. offline para enviar.'
            };
        }

        const totalOS = listOsOffline.length;

        for (let index = 0; index < totalOS; index++) {
            const numeroAtual = index + 1;

            //console.log(`\n=== Enviando OS ${numeroAtual} de ${totalOS} ===`);

            // Atualiza o modal ANTES de processar
            arlterarModal(
                'load',
                'archive-check',
                'Enviando...',
                () => (
                    <View style={[
                        Styles.em_linhaVertical,
                        Styles.w100,
                        getModalStyle('light'),
                        { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }
                    ]}>
                        <ActivityIndicator size={75} color={'blue'} />
                        <ThemedText type='title'>
                            Enviando {numeroAtual} de {totalOS}
                        </ThemedText>
                        <Text style={[
                            Styles.ft_medium,
                            getModalStyleLabel('light'),
                            { textAlign: 'center', marginBottom: 25 }
                        ]}>
                            Iniciando envio de O.S. OFFLINE,{'\n'}
                            Isso pode demorar alguns minutos,{'\n\n'}
                            Aguarde...
                        </Text>
                    </View>
                ),
                'default',
                () => null,
                'Iniciando envio de O.S. OFFLINE,\nIsso pode demorar alguns minutos,\n\nAguarde...'
            );

            const element = listOsOffline[index];

            // Valida o elemento antes de enviar
            if (!element) {
                //console.log(`Elemento ${numeroAtual} está vazio ou inválido`);
                continue;
            }

            //console.log('Verificando elemento antes de enviar:', {
            //     index: index,
            //     hasElement: !!element,
            //     hasFilial: !!element?.filial,
            //     hasImagensCaixa: !!element?.imagens_caixa,
            //     imagensCaixaLength: element?.imagens_caixa?.length,
            //     primeiroItemCaixa: element?.imagens_caixa?.[0],
            //     hasImagensMontados: !!element?.imagens_montados,
            //     imagensMontadosLength: element?.imagens_montados?.length,
            //     primeiroItemMontado: element?.imagens_montados?.[0],
            //     hasImagensAmbiente: !!element?.imagens_ambiente,
            //     imagensAmbienteLength: element?.imagens_ambiente?.length,
            //     os: element?.os,
            // });

            // Aguarda um pequeno delay para garantir que o modal seja renderizado
            await new Promise(resolve => setTimeout(resolve, 100));

            try {
                // Envia a OS e aguarda o resultado
                const resultado = await enviarOS(element);

                //console.log(`Resultado do envio da OS ${numeroAtual}:`, resultado);

                // Verifica se houve erro
                if (!resultado || resultado.code !== 0) {
                    //console.log(`Erro no envio da OS ${numeroAtual}:`, resultado);

                    // Atualiza modal com erro
                    arlterarModal(
                        'error',
                        'alert-circle',
                        'Erro no envio',
                        () => (
                            <View style={[
                                Styles.em_linhaVertical,
                                Styles.w100,
                                getModalStyle('light'),
                                { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }
                            ]}>
                                <Text style={[
                                    Styles.ft_medium,
                                    getModalStyleLabel('light'),
                                    { textAlign: 'center', marginBottom: 25, color: 'red' }
                                ]}>
                                    Erro ao enviar OS {numeroAtual} de {totalOS}:{'\n\n'}
                                    {resultado?.retorno || 'Erro desconhecido'}
                                </Text>
                            </View>
                        ),
                        'default',
                        () => null,
                        resultado?.retorno || 'Erro desconhecido'
                    );

                    return {
                        status: 'Erro',
                        code: resultado?.code || 9999,
                        mensagem: 'Erro',
                        retorno: resultado?.retorno || 'Erro desconhecido ao enviar OS'
                    };
                }

                //console.log(`✓ OS ${numeroAtual} enviada com sucesso`);

            } catch (error: any) {
                //console.log(`Exceção capturada ao enviar OS ${numeroAtual}:`, error);
                //console.log('Stack trace:', error.stack);

                return {
                    status: 'Erro',
                    code: 9998,
                    mensagem: 'Erro',
                    retorno: `Erro ao processar OS ${numeroAtual}: ${error.message}`
                };
            }
        }

        //console.log('✓✓✓ Todas as OS foram enviadas com sucesso ✓✓✓');

        // Atualiza modal de sucesso
        arlterarModal(
            'success',
            'check-circle',
            'Sucesso!',
            () => (
                <View style={[
                    Styles.em_linhaVertical,
                    Styles.w100,
                    getModalStyle('light'),
                    { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }
                ]}>
                    <Text style={[
                        Styles.ft_medium,
                        getModalStyleLabel('light'),
                        { textAlign: 'center', marginBottom: 25, color: 'green' }
                    ]}>
                        Todas as {totalOS} O.S. foram enviadas com sucesso!
                    </Text>
                </View>
            ),
            'default',
            () => null,
            'Envio concluído com sucesso'
        );

        return {
            status: 'sucesso',
            code: 0,
            mensagem: 'sucesso',
            retorno: `Todas as ${totalOS} O.S. foram enviadas com sucesso.`
        };
    }

    // ===== FUNÇÃO DE ENVIO: enviarOS =====
    async function enviarOS(element: any) {
        //console.log('Buscando configuraçoes da empresa=>', conf);
        const config = await buscarConfig(element.filial[0].id);

        if (config.code !== undefined && config.code === 0) {
            //console.log('configurações da empresa=>', config.retorno);
            ToastAndroid.show('Configurações atualizadas com sucesso!', ToastAndroid.TOP);
        } else {
            ToastAndroid.show('Erro ao buscar configurações da empresa!', ToastAndroid.LONG);
            //console.log('configurações da empresa=>', config.retorno);
        }

        const loc = await buscarCoordenadas('home os', element, 1200, element.os, null, 'finalizarOs');
        //console.log('Buscando coordenadas---------------------')

        if (loc?.code === 0) {
            //console.log('sucesso=>', loc)
            try {
                // Cria o formulário
                let formData = new FormData();

                // Função para adicionar imagens ao FormData
                const addImagesToFormData = (images: any, fieldName: string) => {
                    //console.log(`Verificando imagens de ${fieldName}=>`, images);

                    // Verifica se images existe e é um array válido
                    if (!images || !Array.isArray(images) || images.length === 0) {
                        const errorMessages: { [key: string]: string } = {
                            'imagensEmbalagem[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"',
                            'imagensMontagem[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"',
                            'imagensAmbiente[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"'
                        };

                        const errorMsg = errorMessages[fieldName] || 'Impossível finalizar a O.S. sem imagens';
                        return { status: 'Error', code: 2578, mensagem: 'Erro', retorno: errorMsg };
                    }

                    //(`Enviando ${images.length} imagem(ns) de ${fieldName}`)

                    images.forEach((imageUri: any, index: number) => {
                        try {
                            // Verifica se imageUri é válido
                            if (!imageUri) {
                                //console.log(`Imagem ${index} está nula ou indefinida`);
                                return;
                            }

                            // Pega a URL da imagem
                            const urlImagem = imageUri.url || imageUri;

                            if (!urlImagem || typeof urlImagem !== 'string') {
                                //console.log(`URL da imagem ${index} inválida:`, urlImagem);
                                return;
                            }

                            // Extrai o tipo do arquivo
                            let uriParts = urlImagem.split('.');
                            let fileType = uriParts[uriParts.length - 1];

                            // Cria o carimbo de data/hora
                            let carimbo = '';
                            if (imageUri.dataInicio) {
                                carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                            } else {
                                carimbo = `img_${Date.now()}_${index}`;
                            }

                            const fileName = `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`;

                            // CORREÇÃO CRÍTICA: Formato correto para React Native FormData
                            const fileObject = {
                                uri: urlImagem,
                                name: fileName,
                                type: `image/${fileType}`
                            };

                            //console.log(`Adicionando imagem ao FormData:`, fileObject);

                            // Adiciona ao FormData com tratamento de erro
                            try {
                                formData.append('arquivos[]', fileObject as any);
                                //console.log(`✓ Imagem adicionada com sucesso: ${fileName}`);
                            } catch (appendError) {
                                //console.log(`✗ Erro ao adicionar imagem ao FormData:`, appendError);
                                throw appendError;
                            }

                        } catch (imgError: any) {
                            //console.log(`Erro ao processar imagem ${index}:`, imgError.message);
                            throw imgError;
                        }
                    });

                    return { success: true };
                };

                // Processa as imagens da caixa
                //console.log('=== Processando imagens da caixa ===');
                const imagensCaixa = element.imagens_caixa?.[0];
                //console.log('imagensCaixa:', imagensCaixa);

                let resultado = addImagesToFormData(imagensCaixa, 'imagensEmbalagem[]');
                if (resultado?.code) return resultado;

                // Processa as imagens montadas
                //console.log('=== Processando imagens montadas ===');
                const imagensMontadas = element.imagens_montados?.[0];
                //console.log('imagensMontadas:', imagensMontadas);

                resultado = addImagesToFormData(imagensMontadas, 'imagensMontagem[]');
                if (resultado?.code) return resultado;

                // Processa as imagens do ambiente (se necessário)
                if (conf && conf[0] && conf[0].valor_config > 2) {
                    //console.log('=== Processando imagens do ambiente ===');
                    const imagensAmbiente = element.imagens_ambiente?.[0];
                    //console.log('imagensAmbiente:', imagensAmbiente);

                    resultado = addImagesToFormData(imagensAmbiente, 'imagensAmbiente[]');
                    if (resultado?.code) return resultado;
                }

                // Adiciona os dados ao FormData
                //console.log('=== Adicionando dados textuais ao FormData ===');
                formData.append('comando', 'finalizarOsOffline');
                formData.append('osDados', JSON.stringify(element));
                formData.append('os', String(element.os));
                formData.append('usuario', String(usuario.id_user));
                formData.append('location', JSON.stringify(loc));
                formData.append('codigoStatus', String(statusOs));
                formData.append('isApp',Config.configuracoes.isApp)

                //console.log('=== Enviando FormData para o servidor ===');
                const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                //console.log('Response recebida:', response.data);

                if (response.data && Array.isArray(response.data) && response.data[0]) {
                    if (response.data[0].status === 'OK' && response.data[0].statusCode === 0) {
                        const lpImg = await limparImagens();

                        if (lpImg.code === 0) {
                            const retornoSaveList = await salvarVariaveis('listOffline', 'listOffline', '');

                            if (retornoSaveList.code === 0) {
                                setListOsOffline(null);
                                //console.log('✓ Lista offline salva com sucesso');
                                return {
                                    status: 'Sucesso',
                                    code: 0,
                                    mensagem: 'Sucesso',
                                    retorno: response.data[0].statusMensagem
                                };
                            }
                        }
                    } else {
                        //console.log('Erro na resposta do servidor:', response.data[0]);
                        return {
                            status: 'Erro',
                            code: response.data[0].statusCode,
                            mensagem: 'Erro',
                            retorno: response.data[0].statusMensagem
                        };
                    }
                } else {
                    //console.log('Formato de resposta inesperado:', response.data);
                    return {
                        status: 'Erro',
                        code: 2500,
                        mensagem: 'Erro',
                        retorno: 'Formato de resposta do servidor inesperado'
                    };
                }
            } catch (error: any) {
                //console.log('=== ERRO CAPTURADO NA FUNÇÃO enviarOS ===');
                //console.log('Tipo:', error.constructor?.name);
                //console.log('Mensagem:', error.message);
                //console.log('Stack:', error.stack);

                if (error.response) {
                    //console.log('Status HTTP:', error.response.status);
                    //console.log('Dados da resposta:', error.response.data);
                }

                return {
                    status: 'Erro',
                    code: 2431,
                    mensagem: 'Erro',
                    retorno: error.message
                };
            }
        } else {
            //console.log('Erro ao buscar coordenadas:', loc);
            return {
                status: 'error',
                code: 788,
                mensagem: 'Localização do usuário não carregada!',
                retorno: 'Não foi possível obter a localização do usuário'
            };
        }
    }

    // Função fictícia que simula o envio da OS
    /*async function enviarOS(element: any) {
        console.log('Buscando configuraçoes da empresa=>',conf);
        const config = await buscarConfig(element.filial[0].id);
    
        if(config.code !== undefined && config.code === 0){
            console.log('configurações da empresa=>',config.retorno);
            ToastAndroid.show('Configurações atualizadas com sucesso!',ToastAndroid.TOP);
        }else{
            ToastAndroid.show('Erro ao buscar configurações da empresa!',ToastAndroid.LONG);
            console.log('configurações da empresa=>',config.retorno);
        }
        let primeiroItemAmbiente;
        let detalhesImagemAmbiente;
        const loc = await buscarCoordenadas('home os', element, 1200, element.os, null, 'finalizarOs');
        console.log('Buscando coordenadas---------------------')
        if (loc?.code === 0) {
            console.log('sucesso=>', loc)
            try {
                //cria o formulário
                let formData = new FormData();

                // Acessando o primeiro item do array externo
                const primeiroItemCaixa = element.imagens_caixa[0];
                console.log('primeiroItemCaixa=>',element.imagens_caixa[0])
                // Acessando o primeiro item do array interno
                const detalhesImagemCaixa = primeiroItemCaixa[0];

                // Acessando o primeiro item do array externo
                const primeiroItemMontado = element.imagens_montados[0];
                console.log('primeiroItemMontado=>',element.imagens_montados[0])
                // Acessando o primeiro item do array interno
                const detalhesImagemMontado = primeiroItemMontado[0];
                if(conf[0].valor_config > 2){    
                    // Acessando o primeiro item do array externo
                    primeiroItemAmbiente = element.imagens_ambiente[0];
                
                    // Acessando o primeiro item do array interno
                    detalhesImagemAmbiente = primeiroItemAmbiente[0];
                }
                const addImagesToFormData = (images: any, fieldName: any) => {
                    console.log('Verificando imagens=>', imagens);
                    if (images !== null) {
                        console.log('Enviando imagem---------------------')
                        images.forEach((imageUri: any, index: number) => {
                            console.log('Enviando imagem---------------------')
                            if (imageUri.url === undefined) {
                                let uriParts = imageUri.split('.');
                                let carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                                let fileType = uriParts[uriParts.length - 1];
                                formData.append('arquivos[]', {
                                    uri: imageUri.url,
                                    name: `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`,
                                    type: `image/${fileType}`,
                                });
                            } else {
                                let uriParts = (imageUri.url).split('.');
                                let carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                                let fileType = uriParts[uriParts.length - 1];
                                formData.append('arquivos[]', {
                                    uri: imageUri.url,
                                    name: `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`,
                                    type: `image/${fileType}`,
                                });
                                console.log('Enviando imagem---------------------', `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`)
                            }

                        });
                    } else {
                        switch (fieldName) {
                            case 'imagensembalagem[]':
                                navigation.navigate('home os');
                                return { status: 'Error', code: 2578, mensagem: 'Erro', retorno: 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"' }; //error.push({'Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"']);                        
                                //setModalVisible(false);
                                //setMsg('');
                                break;
                            case 'imagensmontagem[]':
                                return { status: 'Error', code: 2578, mensagem: 'Erro', retorno: 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"' };
                                //setModalVisible(false);
                                //setMsg('');
                                break;
                            case 'imagensambiente[]':
                                return { status: 'Error', code: 2578, mensagem: 'Erro', retorno: 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"' };//error.push({'Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"']);                        
                                //setModalVisible(false);
                                //setMsg('');
                                break;
                        }
                    }
                };
                //[{"codigo_config": 4, "id_config": "20240726196555", "tipo_config": "fotos", "valor_config": "3"}]
                
                if (conf[0].valor_config > 2) {
                    addImagesToFormData(primeiroItemCaixa, 'imagensembalagem');
                    addImagesToFormData(primeiroItemMontado, 'imagensmontagem');
                    addImagesToFormData(primeiroItemAmbiente, 'imagensambiente');
                } else {
                    addImagesToFormData(primeiroItemCaixa, 'imagensembalagem');
                    addImagesToFormData(primeiroItemMontado, 'imagensmontagem');
                }
                //adiciona o comando de ações
                formData.append('comando', 'finalizarOsOffline');
                //adiciona os dados da os como uma string
                //formData.append('os',JSON.stringify(element));
                formData.append('osDados', JSON.stringify(element));
                formData.append('os', element.os);
                formData.append('usuario', usuario.id_user);
                //formData.append('comando','finalizarOs');
                formData.append('location', JSON.stringify(loc));
                formData.append('codigoStatus', '' + statusOs + '');

                const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                //verifica se foi sucesso ou erro
                console.log('response enviado=>', response);
                if (response.data[0].status === 'OK' && response.data[0].statusCode === 0) {
                    const lpImg = await limparImagens();

                    if (lpImg.code === 0) {
                        const retornoSaveList = await salvarVariaveis('listOffline', 'listOffline', '');

                        if (retornoSaveList.code === 0) {
                            setListOsOffline(null);
                            console.log('salvando lista offline--------------')
                            return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: response.data[0].statusMensagem };
                        }
                    }
                } else {
                    console.log('Detalhes do erro--------------else na linha 2622-->', response.data[0].statusMensagem)
                    return { status: 'Erro', code: response.data[0].statusCode, mensagem: 'Erro', retorno: response.data[0].statusMensagem };
                }
            } catch (error: any) {
                console.log('Detalhes do erro--------------', error)
                return { status: 'Erro', code: 2431, mensagem: 'Erro', retorno: error.message };
            }
        } else {
            console.log('Detalhes do erro--------------else na linha 2630')
            return { status: 'error', code: 788, mensagem: 'Localização do usuário não carregada!' };
        }
    }*/

    /*async function enviarOS(element: any) {
        console.log('Buscando configuraçoes da empresa=>', conf);
        const config = await buscarConfig(element.filial[0].id);

        if (config.code !== undefined && config.code === 0) {
            console.log('configurações da empresa=>', config.retorno);
            ToastAndroid.show('Configurações atualizadas com sucesso!', ToastAndroid.TOP);
        } else {
            ToastAndroid.show('Erro ao buscar configurações da empresa!', ToastAndroid.LONG);
            console.log('configurações da empresa=>', config.retorno);
        }

        const loc = await buscarCoordenadas('home os', element, 1200, element.os, null, 'finalizarOs');
        console.log('Buscando coordenadas---------------------')

        if (loc?.code === 0) {
            console.log('sucesso=>', loc)
            try {
                // Cria o formulário
                let formData = new FormData();

                // Acessando imagens da caixa
                const primeiroItemCaixa = element.imagens_caixa[0];
                console.log('primeiroItemCaixa=>', element.imagens_caixa[0])
                const detalhesImagemCaixa = primeiroItemCaixa?.[0];

                // Acessando imagens montado
                const primeiroItemMontado = element.imagens_montados[0];
                console.log('primeiroItemMontado=>', element.imagens_montados[0])
                const detalhesImagemMontado = primeiroItemMontado?.[0];

                // Declaração correta das variáveis de ambiente
                let primeiroItemAmbiente = null;
                let detalhesImagemAmbiente = null;

                if (conf[0].valor_config > 2) {
                    primeiroItemAmbiente = element.imagens_ambiente[0];
                    detalhesImagemAmbiente = primeiroItemAmbiente?.[0];
                }

                const addImagesToFormData = (images: any, fieldName: string) => {
                    console.log('Verificando imagens=>', images);

                    if (images !== null && images !== undefined) {
                        console.log('Enviando imagem---------------------')
                        images.forEach((imageUri: any, index: number) => {
                            console.log('Enviando imagem---------------------')

                            // Verifica se a URL existe
                            const urlImagem = imageUri.url || imageUri;
                            let uriParts = urlImagem.split('.');
                            let carimbo = imageUri.dataInicio?.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "") || `img_${index}`;
                            let fileType = uriParts[uriParts.length - 1];

                            formData.append('arquivos[]', {
                                uri: urlImagem,
                                name: `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`,
                                type: `image/${fileType}`,
                            });

                            console.log('Enviando imagem---------------------', `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`)
                        });

                        return { success: true };
                    } else {
                        // Mensagens de erro por tipo de imagem
                        const errorMessages: { [key: string]: string } = {
                            'imagensEmbalagem[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"',
                            'imagensMontagem[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"',
                            'imagensAmbiente[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"'
                        };

                        const errorMsg = errorMessages[fieldName] || 'Impossível finalizar a O.S. sem imagens';
                        return { status: 'Error', code: 2578, mensagem: 'Erro', retorno: errorMsg };
                    }
                };

                // Adiciona imagens ao FormData
                let resultado;
                if (conf[0].valor_config > 2) {
                    resultado = addImagesToFormData(primeiroItemCaixa, 'imagensEmbalagem[]');
                    if (resultado?.code) return resultado;

                    resultado = addImagesToFormData(primeiroItemMontado, 'imagensMontagem[]');
                    if (resultado?.code) return resultado;

                    resultado = addImagesToFormData(primeiroItemAmbiente, 'imagensAmbiente[]');
                    if (resultado?.code) return resultado;
                } else {
                    resultado = addImagesToFormData(primeiroItemCaixa, 'imagensEmbalagem[]');
                    if (resultado?.code) return resultado;

                    resultado = addImagesToFormData(primeiroItemMontado, 'imagensMontagem[]');
                    if (resultado?.code) return resultado;
                }

                // Adiciona os dados ao FormData
                formData.append('comando', 'finalizarOsOffline');
                formData.append('osDados', JSON.stringify(element));
                formData.append('os', element.os);
                formData.append('usuario', usuario.id_user);
                formData.append('location', JSON.stringify(loc));
                formData.append('codigoStatus', '' + statusOs + '');

                const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })

                console.log('response enviado=>', response);

                if (response.data[0].status === 'OK' && response.data[0].statusCode === 0) {
                    const lpImg = await limparImagens();

                    if (lpImg.code === 0) {
                        const retornoSaveList = await salvarVariaveis('listOffline', 'listOffline', '');

                        if (retornoSaveList.code === 0) {
                            setListOsOffline(null);
                            console.log('salvando lista offline--------------')
                            return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: response.data[0].statusMensagem };
                        }
                    }
                } else {
                    console.log('Detalhes do erro--------------else na linha 2622-->', response.data[0].statusMensagem)
                    return { status: 'Erro', code: response.data[0].statusCode, mensagem: 'Erro', retorno: response.data[0].statusMensagem };
                }
            } catch (error: any) {
                console.log('Detalhes do erro--------------', error)
                return { status: 'Erro', code: 2431, mensagem: 'Erro', retorno: error.message };
            }
        } else {
            console.log('Detalhes do erro--------------else na linha 2630')
            return { status: 'error', code: 788, mensagem: 'Localização do usuário não carregada!' };
        }
    }*/

    /*async function enviarOS(element: any) {
        console.log('Buscando configuraçoes da empresa=>', conf);
        const config = await buscarConfig(element.filial[0].id);

        if (config.code !== undefined && config.code === 0) {
            console.log('configurações da empresa=>', config.retorno);
            ToastAndroid.show('Configurações atualizadas com sucesso!', ToastAndroid.TOP);
        } else {
            ToastAndroid.show('Erro ao buscar configurações da empresa!', ToastAndroid.LONG);
            console.log('configurações da empresa=>', config.retorno);
        }

        const loc = await buscarCoordenadas('home os', element, 1200, element.os, null, 'finalizarOs');
        console.log('Buscando coordenadas---------------------')

        if (loc?.code === 0) {
            console.log('sucesso=>', loc)
            try {
                // Cria o formulário
                let formData = new FormData();

                // Função para adicionar imagens ao FormData
                const addImagesToFormData = (images: any, fieldName: string) => {
                    console.log(`Verificando imagens de ${fieldName}=>`, images);

                    // Verifica se images existe e é um array válido
                    if (!images || !Array.isArray(images) || images.length === 0) {
                        const errorMessages: { [key: string]: string } = {
                            'imagensEmbalagem[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"',
                            'imagensMontagem[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"',
                            'imagensAmbiente[]': 'Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"'
                        };

                        const errorMsg = errorMessages[fieldName] || 'Impossível finalizar a O.S. sem imagens';
                        return { status: 'Error', code: 2578, mensagem: 'Erro', retorno: errorMsg };
                    }

                    console.log(`Enviando ${images.length} imagem(ns) de ${fieldName}`)

                    images.forEach((imageUri: any, index: number) => {
                        try {
                            // Verifica se imageUri é válido
                            if (!imageUri) {
                                console.log(`Imagem ${index} está nula ou indefinida`);
                                return;
                            }

                            // Pega a URL da imagem
                            const urlImagem = imageUri.url || imageUri;

                            if (!urlImagem || typeof urlImagem !== 'string') {
                                console.log(`URL da imagem ${index} inválida:`, urlImagem);
                                return;
                            }

                            // Extrai o tipo do arquivo
                            let uriParts = urlImagem.split('.');
                            let fileType = uriParts[uriParts.length - 1];

                            // Cria o carimbo de data/hora
                            let carimbo = '';
                            if (imageUri.dataInicio) {
                                carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                            } else {
                                carimbo = `img_${Date.now()}_${index}`;
                            }

                            const fileName = `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`;

                            formData.append('arquivos[]', {
                                uri: urlImagem,
                                name: fileName,
                                type: `image/${fileType}`,
                            });

                            console.log(`Imagem adicionada: ${fileName}`);

                        } catch (imgError) {
                            console.log(`Erro ao processar imagem ${index}:`, imgError);
                        }
                    });

                    return { success: true };
                };

                // Processa as imagens da caixa
                console.log('=== Processando imagens da caixa ===');
                const imagensCaixa = element.imagens_caixa?.[0];
                console.log('imagensCaixa:', imagensCaixa);

                let resultado = addImagesToFormData(imagensCaixa, 'imagensEmbalagem[]');
                if (resultado?.code) return resultado;

                // Processa as imagens montadas
                console.log('=== Processando imagens montadas ===');
                const imagensMontadas = element.imagens_montados?.[0];
                console.log('imagensMontadas:', imagensMontadas);

                resultado = addImagesToFormData(imagensMontadas, 'imagensMontagem[]');
                if (resultado?.code) return resultado;

                // Processa as imagens do ambiente (se necessário)
                if (conf[0].valor_config > 2) {
                    console.log('=== Processando imagens do ambiente ===');
                    const imagensAmbiente = element.imagens_ambiente?.[0];
                    console.log('imagensAmbiente:', imagensAmbiente);

                    resultado = addImagesToFormData(imagensAmbiente, 'imagensAmbiente[]');
                    if (resultado?.code) return resultado;
                }

                // Adiciona os dados ao FormData
                formData.append('comando', 'nciOffline');
                formData.append('osDados', JSON.stringify(element));
                formData.append('os', element.os);
                formData.append('usuario', usuario.id_user);
                formData.append('location', JSON.stringify(loc));
                formData.append('codigoStatus', String(statusOs));

                console.log('=== Enviando FormData ===');
                const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('response enviado=>', response);

                if (response.data[0].status === 'OK' && response.data[0].statusCode === 0) {
                    const lpImg = await limparImagens();

                    if (lpImg.code === 0) {
                        const retornoSaveList = await salvarVariaveis('listOffline', 'listOffline', '');

                        if (retornoSaveList.code === 0) {
                            setListOsOffline(null);
                            console.log('salvando lista offline--------------');
                            return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: response.data[0].statusMensagem };
                        }
                    }
                } else {
                    console.log('Erro na resposta do servidor:', response.data[0].statusMensagem);
                    return { status: 'Erro', code: response.data[0].statusCode, mensagem: 'Erro', retorno: response.data[0].statusMensagem };
                }
            } catch (error: any) {
                console.log('Detalhes do erro completo:', error);
                console.log('Stack trace:', error.stack);
                return { status: 'Erro', code: 2431, mensagem: 'Erro', retorno: error.message };
            }
        } else {
            console.log('Erro ao buscar coordenadas');
            return { status: 'error', code: 788, mensagem: 'Localização do usuário não carregada!' };
        }
    }*/

    async function buscarRotas(comando: string, dataDeHoje: any, profissional: any) {
        const retorno = await axios({
            method: 'get',
            url: Config.configuracoes.pastaProcessos,
            params: {
                comando: comando,
                data: dataDeHoje,
                profissional: profissional,
                isApp:Config.configuracoes.isApp
            }
        });
        if (retorno.data !== '') {
            if (retorno.data[0].status === 'OK' && retorno.data[0].statusCode === 200) {
                setListOsDisponiveis(retorno.data[0].dados);
                return { status: 'sucesso', code: 0, mensagem: 'Rotas lidas com sucesso!', errors: null };
            } else {

                return { status: 'Erro', code: 1, mensagem: 'Erro ao ler as rotas!', errors: retorno.data[0] };
            }
        } else {
            return { status: 'Erro', code: 1, mensagem: 'Erro ao ler as rotas!', errors: retorno.data[0] };
        }
    }

    async function onlineOffline(comando: string) {
        if (comando === 'offline') {
            setIsOffline(true);

            const slvVr = await salvarVariaveis('', 'isOffline', 'true');

            if (slvVr.code === 0) {
                setLoad(false)
                setModalVisible(false);
                return { status: 'sucesso', code: 0, mensagem: 'Você está offline agora!', errors: null };
            }
        } else if (comando === 'online') {
            setIsOffline(false);

            const slvVr = await salvarVariaveis('', 'isOffline', 'false');

            if (slvVr.code === 0) {
                setLoad(false)
                setModalVisible(false);
                return { status: 'sucesso', code: 0, mensagem: 'Você está online novamente!', errors: null };
            }
        }
    }

    return (
        <AuthLogin.Provider value={{
            //variaveis
            load, modalVisible, modalId, iconeModal, titleModal, conteudoModal, actionsModal, stylesModal, httpAlimentacao, listParceiros, pesquiza,
            usuario, email, senha, listOs, listMinhasOs, listOsDisponiveis, listOsOffline, options, dataInicial, dataFinal, idPrceiro, statusOs,
            nomeCliente, nf, ordemServico, osInicada, location, imagensEmbalagem, imagensMontado, imagensAmbiente, dataLocal, horaLocal, capturedImage,
            canvasRef, currentPath, paths, isConnectedNetwork, tokenNotification, notificationsCount, isConfigured, isOs, tela, isUser, visibleSnackBar,
            dataLoaded, montantePgmto, itemsFat, qtdOs, totalFat, parceiros, fechamentos_, uniqueId, imagensProblema, appIsValid, appValidationArray,
            typeConn, configApp, conf, isOffline, asyncLoad, userAppMode,
            //funções
            setLoad, setModalVisible, setModalId, setIconeModal, setTitleModal, setConteudoModal, setActionsModal, setStylesModal, getModalStyle,
            apresentaModal, getModalStyleLabel, fecharModal, gerarIdUnico, AlimentarApp, getModalStyleLabelAlert, salvarVariaveis, setPesquiza,
            login, setListOs, setListMinhasOs, setListOsDisponiveis, setListOsOffline, buscarOs, setDataInicial, setDataFinal, setIdPrceiro, setStatusOs,
            setNomeCliente, setNf, setOrdemServico, setOsIniciada, arlterarModal, buscarCoordenadas, setLocation, setImagensEmbalagem, setImagensMontado,
            setImagensAmbiente, uploadImages, carregarTodasImagens, adicionarImagemEmbalagem, removerImagemEmbalagem, adicionarImagemAmbiente, removerImagemAmbiente, adicionarImagemMontagem,
            removerImagemMontado, setCapturedImage, setPaths, onTouch, saveCanvasAsImage, limparImagens, logof, setTokenNotification, sendNotification, testeConfig, buscarNotificacoes,
            setNotificationsCount, IniciarOs, OsIniciada, executarAcao, buscarEmpresas, verificarConexao, setVisibleSnackBar, setDataLoaded, cacheClear, montanteLoja, setMontantePgmto, setTela,
            faturamento, parceiroSearch, fechamentos, validarApp, adicionarImagemProblema, removerImagemProblema, IniciarOsOffline, enviarOsOfflines, removerOsOffline, removerOsListMinhasOs,
            buscarRotas, setItemsFat, Config_APP, setConfigApp, setConf, setIsOffline, onlineOffline, getModalStyleBorder, buscarConfig, setAsyncLoad, setUserAppMode, Base64,
        }}>
            {children}
        </AuthLogin.Provider>
    )
}

export default AuthLoginProvider;