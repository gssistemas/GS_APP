import { ThemedText } from '../../../Components/ThemedText';
import { ThemedView } from '../../../Components/ThemedView';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, PixelRatio, ScrollView, Animated, FlatList, useColorScheme, TouchableOpacity, PanResponder, Alert, RefreshControl, ActivityIndicator, ToastAndroid, TouchableWithoutFeedback, Modal } from 'react-native';
import { Styles } from '../../../../assets/Styles/Styles';
import { Linking, Platform, TextInput } from 'react-native';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import AppLoading from '../../../../Components/Loader/AppLoading';
const { width, height } = Dimensions.get('window');

const normalizeFontSize = (size: number) => {
  const scale = width / 500; // 320 é o tamanho base de referência (pode ajustar)
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default function MinhasOs({ navigation }: any) {
  const { theme } = useTheme();
  const { usuario, AlimentarApp, setLoad, buscarNotificacoes,Base64, getModalStyleBorder, isConnectedNetwork, setListOsOffline, verificarConexao, listMinhasOs, listOsDisponiveis, listOsOffline, isModalVisible, setModalVisible, modalVisible, apresentaModal, fecharModal, getModalStyle, getModalStyleLabel, buscarOs, dataInicial, dataFinal, idPrceiro, statusOs, nomeCliente, nf, ordemServico, osInicada, setNomeCliente } = useContext<any>(AuthLogin);
  const [icone, setIcone] = useState<string | symbol>('menu');
  const [dadosAtuais, setDadosAtuais] = useState<null | any>(null);
  const windowHeight = Dimensions.get('window').height;
  const [visibleMenu, setVisibleMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const [asyncLoad, setAsyncLoad] = useState(false);
  let cont = 1;
  async function abrirWhatsapp(linkWhatsapp: any) {
    let Url = linkWhatsapp;

    const supported = await Linking.openURL(linkWhatsapp);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(linkWhatsapp);
    } else {
      Alert.alert('Erro!', 'Parece que você não possui o "WhatsApp" ou "WhatsAppBusiness" instalado em seu aparelho, Verifique e tente novamente.');
    }
  }
  useEffect(() => {
    onRefresh();
    //console.log('execução em minhasOS=>',cont);
    //cont++;
  }, [])

  async function onRefresh() {
    const vrfConn = await verificarConexao();
    //console.warn(vrfConn);
    if (vrfConn.code === 0 || vrfConn === '0'/*vrfConn.code ===  0*/) {
      //verifica se existe osOffline
      /*if (listOsOffline === null || listOsOffline.length === 0) {*/
        const os = await buscarOs('buscarOs', nf, dataInicial, dataFinal, nomeCliente, ordemServico, usuario.id_login[0].id, 1200);
        if (os.code === 0) {
          fecharModal('');
          setModalVisible(false);
          setAsyncLoad(true);
        } else {
          apresentaModal(
            'error',
            'alert-circle',
            'Erro no servidor!',
            () => (
              <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('danger'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
                <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]} />
                <Text style={[Styles.ft_medium, getModalStyleLabel('danger'), { textAlign: 'center', marginBottom: 25 }]}>{'Tivemos uma erro ao buscar informações no servidor, Por esse motivo o app não pôde ser validado. Por favor tente novamente mais tarde. Se o erro persistir contate o administrador.\n\n' + os.code + '-' + os.mensagem}</Text>
              </View>
            ),
            'danger',
            () => (
              <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogcentered, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}
                onPress={() => {
                  fecharModal('');
                  setModalVisible(false);
                }}
              >
                <Text style={[Styles.ft_regular, Styles.lbllight]}>OK!</Text>
              </TouchableOpacity>
            )
          )
        }
      /*} else if (listOsOffline !== null && listOsOffline.length > 0) {
        console.warn('Lista offline=>', listOsOffline)
        fecharModal('');
        setModalVisible(false);
        setAsyncLoad(true);
        apresentaModal(
          'error',
          'wifi-alert',
          'Não conectado!',
          () => (
            <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('danger'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
              <MaterialCommunityIcons name='wifi-alert' size={75} style={[getModalStyleLabel('danger')]} />
              <Text style={[Styles.ft_medium, getModalStyleLabel('danger'), { textAlign: 'center', marginBottom: 25 }]}>{'Tivemos uma erro ao buscar informações no servidor, Por favor tente novamente mais tarde.'}</Text>
            </View>
          ),
          'danger',
          () => (
            <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogcentered, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}
              onPress={() => {
                fecharModal('');
                setModalVisible(false);
              }}
            >
              <Text style={[Styles.ft_regular, Styles.lbllight]}>OK!</Text>
            </TouchableOpacity>
          )
        )
      }*/
    } else {
      setAsyncLoad(true);
      apresentaModal(
        'error',
        'wifi-alert',
        'Não conectado!',
        () => (
          <View style={[Styles.em_linhaVertical, Styles.w100, getModalStyle('danger'), { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, marginBottom: 10 }]}>
            <MaterialCommunityIcons name='wifi-alert' size={75} style={[getModalStyleLabel('danger')]} />
            <Text style={[Styles.ft_medium, getModalStyleLabel('danger'), { textAlign: 'center', marginBottom: 25 }]}>{'Parece que você está "OFFLINE", Para carregar novas O.S. é necessário estar "ONLINE".\n\nTente novamente quando estiver "ONLINE".'}</Text>
          </View>
        ),
        'danger',
        () => (
          <TouchableOpacity style={[Styles.btn, Styles.light, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogcentered, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}
            onPress={() => {
              fecharModal('');
              setModalVisible(false);
            }}
          >
            <Text style={[Styles.ft_regular, Styles.lbllight]}>OK!</Text>
          </TouchableOpacity>
        )
      )
    }
  };

  const toggleMenu = () => {
    if (visibleMenu) {
      // Animar para deslizar para baixo e fechar
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true
      }).start(() => setVisibleMenu(false));
      setIcone('microsoft-xbox-controller-menu');
    } else {
      setVisibleMenu(true);
      // Animar para deslizar para cima e abrir
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
      setIcone('menu');
    }
  };

  // Configurando o PanResponder para detectar o arrastar
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Habilitar o gesto de arraste quando o usuário mover o dedo para baixo
        return gestureState.dy > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        // Atualizar a posição do menu enquanto arrasta para baixo
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Fechar o menu se for arrastado além de 150px
        if (gestureState.dy > 150) {
          toggleMenu();
        } else {
          // Caso contrário, deslizar de volta para cima
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          }).start();
        }
      }
    })
  ).current;

  async function inicioOff() {
    AlimentarApp();
  }

  function OsStatus(status: number) {
    switch (status) {
      case 500:
        return (
          <View style={[getModalStyle('danger'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 550:
        return (
          <View style={[getModalStyle('dark'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 2100:
        return (
          <View style={[getModalStyle('warning'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 600:
        return (
          <View style={[getModalStyle('info'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 800:
        return (
          <View style={[getModalStyle('info'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 900:
        return (
          <View style={[getModalStyle('primary'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 1100:
        return (
          <View style={[getModalStyle('primary'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 1200:
        return (
          <View style={[getModalStyle('sucess'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 1000:
        return (
          <View style={[getModalStyle('primary'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 1500:
        return (
          <View style={[getModalStyle('success'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
      case 2000:
        return (
          <View style={[getModalStyle('warning'), getModalStyleBorder('danger'), { borderRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0, width: 5, height: '100%', marginRight: 5, marginLeft: 0 - 5 }]} />
        );
        break;
    }
  }

  try {
    if (!asyncLoad) {
      return (
        <AppLoading msgLoad={'Carregando ordens de serviço\n\nAguarde...'} msgTitle={'Um momento...'} />
      )
    } else {
      /*if(osInicada !== null && osInicada.status === true && usuario !== null){
        apresentaModal(
          'load',
          'download-multiple',
          'Processando',
          ()=>(
              <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                  <ActivityIndicator size={75} color={'blue'}/>
                  <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Verificando O.S. em andamento,\n\nAguarde...'}</Text>
              </View>
          ),
          'default',
          ()=>{null}
        )
        setAsyncLoad(true);
      }else{*/
      return (
        <ThemedView style={[{ height: height - 100, width: '100%', paddingHorizontal: 5, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.backgroundColor.background }]}>
          {
            listMinhasOs !== null && listMinhasOs !== undefined &&
            <FlatList
              data={listMinhasOs}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: any) => {
                return (
                  <ThemedView style={[{ width: '95%', borderRadius: 5, padding: 0, elevation: 2, marginVertical: 5, height: 'auto', backgroundColor: '#FAFAFA', marginHorizontal: '1.5%', borderTopRightRadius: 20, borderBottomRightRadius: 20 }]}>
                    <View style={[Styles.w100, Styles.em_linhaHorizontal, { marginRight: 2.5 }]}>
                      {
                        OsStatus(item.status)
                      }
                      <TouchableOpacity onLongPress={() => { setDadosAtuais(item), toggleMenu() }} style={[{ width: '96%', alignItems: 'stretch', justifyContent: 'center', borderTopLeftRadius: 20 }]} onPress={() => { navigation.navigate('info os', { dadosOs: item }) }}>
                        <View style={[{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginVertical: 2.5, borderTopRightRadius: 20 }]}>
                          <ThemedView style={[{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, backgroundColor: theme.backgroundColor.background, borderTopRightRadius: 20 }]}>
                            <MaterialCommunityIcons name='store' size={25} color={'#000000'} style={[{ backgroundColor: '#CACACA', marginLeft: -10, borderRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingVertical: 10, marginVertical: -5, paddingHorizontal: 10, marginRight: 5 }]} />
                            <ThemedText type='default' style={[{ fontSize: width / 23 }]}>{item.filial[0].codigo_loja !== null && item.filial[0].codigo_loja !== undefined ? item.filial[0].codigo_loja + ' - ' + item.filial[0].nome : '' + ' - ' + item.filial[0].nome}</ThemedText>
                          </ThemedView>
                        </View>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 2.5 }]}>
                          <ThemedView style={[{ width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: theme.backgroundColor.background, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 }]}>
                            <MaterialCommunityIcons name='archive' size={25} color={'#000000'} style={[{ backgroundColor: '#CACACA', marginLeft: -10, borderRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingVertical: 10, marginVertical: -5, paddingHorizontal: 10, marginRight: 5 }]} />
                            <ThemedText type='default'>O.S.:{item.os}</ThemedText>
                          </ThemedView>
                          <ThemedView style={[{ width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: theme.backgroundColor.background, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4 }]}>
                            <MaterialCommunityIcons name='file-document' size={25} color={'#000000'} style={[{ backgroundColor: '#CACACA', marginLeft: -10, borderRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingVertical: 10, marginVertical: -5, paddingHorizontal: 10, marginRight: 5 }]} />
                            <ThemedText type='default'>NF:{item.nota_fiscal}</ThemedText>
                          </ThemedView>
                        </View>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 2.5 }]}>
                          <ThemedView style={[{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: theme.backgroundColor.background, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 }]}>
                            <MaterialCommunityIcons name='account' size={25} color={'#000000'} style={[{ backgroundColor: '#CACACA', marginLeft: -10, borderRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingVertical: 10, marginVertical: -5, paddingHorizontal: 10, marginRight: 5 }]} />
                            <ThemedText type='default' style={[{ fontSize: width * 0.05 }]}>{item.title}</ThemedText>
                          </ThemedView>
                        </View>
                        <View style={[{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginVertical: 2.5 }]}>
                          <ThemedView style={[{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: theme.backgroundColor.background, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 }]}>
                            {
                              item.endereço === undefined || item.endereco === null || (item.endereco).length > 0 ? (
                                <>
                                  <MaterialCommunityIcons
                                    name='map-marker-distance'
                                    size={25}
                                    color={'blue'}
                                    style={[{
                                      backgroundColor: '#CACACA',
                                      marginLeft: -10,
                                      borderRadius: 5,
                                      borderTopLeftRadius: 5,
                                      borderBottomLeftRadius: 5,
                                      paddingVertical: 10,
                                      marginVertical: -5,
                                      paddingHorizontal: 10,
                                      marginRight: 5
                                    }]}
                                  />
                                  <ThemedText
                                    type='default'
                                    style={{ color: theme.labels.text, maxWidth: '100%' }}
                                    maxFontSizeMultiplier={2}
                                  >
                                    {item.endereco[0]?.rua
                                      ? `${item.endereco[0].rua}, N° ${item.endereco[0].n}\n${item.endereco[0].bairro && item.endereco[0].bairro !== 'null' ? item.endereco[0].bairro : 'Não informado'}, ${item.endereco[0].cidade}-${item.endereco[0].uf}`
                                      : 'Indisponível'}
                                  </ThemedText>
                                </>
                              ) : (
                                <>
                                  <MaterialCommunityIcons
                                    name='map-marker-distance'
                                    size={25}
                                    color={'red'}
                                    style={[{
                                      backgroundColor: '#CACACA',
                                      marginLeft: -10,
                                      borderRadius: 5,
                                      borderTopLeftRadius: 5,
                                      borderBottomLeftRadius: 5,
                                      paddingVertical: 10,
                                      marginVertical: -5,
                                      paddingHorizontal: 10,
                                      marginRight: 5
                                    }]}
                                  />
                                  <ThemedText type='default' style={{ color: 'red' }}>
                                    Endereço: Favor verificar junto a filial!
                                  </ThemedText>
                                </>
                              )
                            }
                          </ThemedView>
                        </View>
                        <View style={[{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginVertical: 2.5, borderBottomRightRadius: 20 }]}>
                          <ThemedView style={[{ width: '100%', borderBottomRightRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: theme.backgroundColor.background, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 }]}>
                            {
                              item.endereço === undefined || item.endereco === null || (item.endereco).length > 0 ?
                                <View style={[Styles.em_linhaHorizontal, Styles.w100, { justifyContent: 'space-between' }]}>
                                  <MaterialCommunityIcons name='tune-variant' size={25} color={'blue'} style={[{ backgroundColor: '#CACACA', marginLeft: -10, borderRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingVertical: 10, marginVertical: -5, paddingHorizontal: 10, marginRight: 5 }]} />
                                  <View style={[Styles.em_linhaHorizontal, { justifyContent: 'space-between' }]}>
                                    <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.btn, Styles.light, Styles.w40, { marginHorizontal: 0, marginVertical: 0, paddingVertical: 0, borderRadius: 50, paddingLeft: 0, justifyContent: 'flex-start' }]}
                                      onPress={() => {
                                        //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                                        item.endereco[0].contato !== null && item.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'tel:' + item.endereco[0].contato : Alert.alert('Erro', 'Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                                      }}
                                    >
                                      <MaterialCommunityIcons name='phone' size={25} style={[Styles.mr_5, getModalStyle(item.endereco[0] === null && item.endereco[0] !== undefined ? 'warning' : 'info'), getModalStyleLabel(item.endereco[0] === null && item.endereco[0] !== undefined ? 'warning' : 'info'), { paddingHorizontal: 5, paddingVertical: 5, elevation: 5, borderRadius: 50 }]} />
                                      <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(item.endereco[0] === null && item.endereco[0] !== undefined ? 'warning' : 'info')]}>{'Chamar'}</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.btn, Styles.light, Styles.w50, { marginHorizontal: 0, marginVertical: 0, paddingVertical: 0, borderRadius: 50, paddingLeft: 0, justifyContent: 'flex-start' }]}
                                      onPress={() => {
                                        if (item === null) {
                                          Alert.alert('Erro', 'Erro ao tentar abrir o WhatsApp!\n\nPorque isso?\nTelefone não encontrado, Favor verificar os dados do cliente e tente novamente.');
                                        } else {
                                          navigation.navigate('mensagem whats', { item });
                                        }
                                        //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                                        //mOs.endereco[0].contato !== null && mOs.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'whatsapp://send?text=Olá *'+mOs.title+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: *https://appmontagens.gsapp.com.br/gsmontagens/?params=psqmtg,'+mOs.os+'*&phone=+55'+mOs.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                                      }}
                                    >
                                      <MaterialCommunityIcons name='whatsapp' size={25} style={[Styles.mr_5, getModalStyle(item.endereco[0] === null && item.endereco[0] !== undefined ? 'warning' : 'info'), getModalStyleLabel(item.endereco[0] === null && item.endereco[0] !== undefined ? 'warning' : 'info'), { paddingHorizontal: 5, paddingVertical: 5, elevation: 5, borderRadius: 50 }]} />
                                      <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(item.endereco[0] === null && item.endereco[0] !== undefined ? 'warning' : 'info')]}>{'WhatsApp'}</ThemedText>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                :
                                <View style={[Styles.em_linhaHorizontal, { justifyContent: 'space-between' }]}>
                                  <MaterialCommunityIcons name='tune-variant' size={25} color={'red'} style={[{ backgroundColor: '#CACACA', marginLeft: -10, borderRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingVertical: 10, marginVertical: -5, paddingHorizontal: 10, marginRight: 5 }]} />
                                  <View style={[Styles.em_linhaHorizontal, { justifyContent: 'space-between' }]}>
                                    <ThemedText type='default' style={[{ color: 'red' }]}>{'Contato Inválido!'}</ThemedText>
                                  </View>
                                </View>

                            }
                          </ThemedView>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </ThemedView>
                )
              }}
              ListHeaderComponent={() => {
                return (
                  <ThemedView>
                    <ThemedView style={[{ width: width, marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#999', paddingVertical: 7, backgroundColor: theme.backgroundColor.background }]}>
                      <ThemedText type='defaultSemiBold' style={[Styles.w65, { marginHorizontal: 0, marginLeft: '2.5%'/*borderBottomWidth:1,borderBottomColor:'#999999'*/ }]}>{listMinhasOs !== null && listMinhasOs !== undefined && listMinhasOs.length > 0 ? listMinhasOs.length + '-' : ''}Ordens de serviço</ThemedText>
                      <TouchableOpacity
                        style={[Styles.w10, { marginHorizontal: 0/*borderWidth:1,borderColor:'#FFF',backgroundColor:'seagreen',paddingHorizontal:15,paddingVertical:10,borderRadius:10,elevation:5*/ }]}
                        onPress={() => {
                          apresentaModal(
                            'dialog',
                            'magnify',
                            'Buscar O.S.',
                            () => (
                              <View style={[Styles.em_linhaVertical, Styles.w100, { justifyContent: 'center', alignItems: 'stretch', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}>
                                <Text style={[Styles.ft_regular, Styles.w100]}>Digite um nome para buscar:</Text>
                                <TextInput style={[Styles.w100, Styles.input, { minWidth: '100%', width: '100%' }]}
                                  placeholder="Nome"
                                  onChangeText={(text) => { setNomeCliente(text) }}
                                  defaultValue={nomeCliente}
                                  selectTextOnFocus={true}
                                />
                                {
                                  nomeCliente !== null || nomeCliente !== '' &&

                                  <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.w100, Styles.btn, Styles.warning]}
                                    onPress={() => {
                                      setNomeCliente('');
                                    }}
                                  >
                                    <MaterialCommunityIcons name='delete' size={25} style={[Styles.lblwarning]} />
                                    <Text style={[Styles.lblwarning]}>Limpar</Text>
                                  </TouchableOpacity>
                                }

                              </View>
                            ),
                            'light',
                            () => (
                              <View style={[Styles.em_linhaHorizontal, Styles.w100, { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }]}>
                                <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.btn, Styles.btnDialog, Styles.btnDialogLeft, Styles.w50, getModalStyle('light'), { marginBottom: 2, marginHorizontal: 0, elevation: 0 }]}
                                  onPress={() => {
                                    fecharModal()
                                  }}
                                >
                                  <Text style={[getModalStyleLabel('light')]}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.btn, Styles.btnDialog, Styles.btnDialogRight, Styles.w50, getModalStyle('light'), { marginBottom: 2, marginHorizontal: 0, elevation: 0 }]}
                                  onPress={() => {
                                    buscarOs('buscarOs', nf, dataInicial !== undefined && dataInicial !== null && dataInicial !== '' ? dataInicial : null, dataFinal !== undefined && dataFinal !== null && dataFinal !== '' ? dataFinal : null, nomeCliente, ordemServico, usuario.id_user, 1200);
                                  }}
                                >
                                  <Text style={[getModalStyleLabel('light')]}>Buscar</Text>
                                </TouchableOpacity>
                              </View>
                            )
                          )
                          //buscarOs('buscarOs',nf+'|'+dataFinal+dataFinal+'|'+nomeCliente+'|'+ordemServico);
                        }}
                      >
                        <MaterialCommunityIcons name='magnify' size={25} style={{ color: theme.labels.text }} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[Styles.w10, { marginHorizontal: 0/*borderWidth:1,borderColor:'#FFF',backgroundColor:'seagreen',paddingHorizontal:15,paddingVertical:10,borderRadius:10,elevation:5*/ }]}
                        onPress={() => { onRefresh(); }}
                      >
                        <MaterialCommunityIcons name='sync' size={25} style={{ color: theme.labels.text }} />
                      </TouchableOpacity>
                      {
                        listOsOffline !== null && listOsOffline.length > 0 && isConnectedNetwork === true &&


                        <TouchableOpacity
                          style={[Styles.em_linhaHorizontal,Styles.w10, { marginHorizontal: 0,marginRight:'2.5%'}]}
                          onPress={() => {
                            navigation.navigate('O.s. offline');
                            /*if(usuario === null){
                              
                            }else{
                              onRefresh();//buscarOs('buscarOs',nf+'|'+dataInicial === undefined ? null : dataInicial+'|'+dataFinal === undefined ? null : dataFinal+'|'+nomeCliente === undefined ? null : nomeCliente+'|'+ordemServico === undefined ? null : ordemServico+'|'+usuario.id_login[0].id);
                            }apresentaModal(
                              'dialog',
                              'code-tags',
                              'Em desenvolvimento',
                              'Lembre-se de implementar o código de carregamento de O.S. neste botão...\n\nEsta tela está em desenvolvimento.',
                              'default',
                              ()=>(
                                <TouchableOpacity style={[Styles.btn]} onPress={()=>{fecharModal('')}}>
                                  <ThemedText type='default'>OK</ThemedText>
                                </TouchableOpacity>
                              )
                            )*/
                          }}
                        >
                          <MaterialCommunityIcons name='send' size={25} style={[Styles.alertsuccess]} />
                        </TouchableOpacity>
                      }
                    </ThemedView>
                    {
                      (dataInicial !== undefined && dataInicial !== '' ||
                        dataFinal !== undefined && dataFinal !== '' ||
                        nomeCliente !== undefined && nomeCliente !== '' ||
                        ordemServico !== undefined && ordemServico !== '' ||
                        nf !== undefined && nf !== ''
                      ) &&
                      <ThemedView style={[Styles.w100, Styles.warning, { borderRadius: 8, marginTop: 5, marginBottom: 5, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', elevation: 2, paddingVertical: 7 }]}>
                        <Text style={[Styles.ft_bold, Styles.w95]}>Filtro(s) aplicado(s) buscando por:</Text>
                        <View style={[Styles.em_linhaHorizontal, Styles.w95, { justifyContent: 'flex-start' }]}>
                          {dataInicial && dataInicial !== '' && <Text style={[Styles.ft_regular]}>De: {dataInicial}</Text>}
                          {dataFinal && dataFinal !== '' && <Text style={[Styles.ft_regular]}> Até: {dataFinal}</Text>}
                        </View>
                        {nomeCliente && nomeCliente !== '' && <Text style={[Styles.ft_regular, Styles.w95, { fontSize: normalizeFontSize(20) }]}>Nome: {nomeCliente}</Text>}
                        {ordemServico && ordemServico !== '' && <Text style={[Styles.ft_regular, Styles.w95]}>Ordem de Serviço: {ordemServico}</Text>}
                        {nf && nf !== '' && <Text>NF: {nf}</Text>}
                      </ThemedView>
                    }
                  </ThemedView>
                )
              }}
              ListEmptyComponent={() => {
                return (
                  <View style={[{ width: '100%', height: height, alignItems: 'center', justifyContent: 'center' }]}>
                    <View style={[{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80%', height: 'auto', marginHorizontal: '10%', borderRadius: 20, backgroundColor: '#FAFAFA', elevation: 5 }]}>
                      <ThemedView style={[Styles.em_linhaVertical, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }]}>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[Styles.alertsuccess]} />
                        <ThemedText type='defaultSemiBold' style={[{ color: '#000', textAlign: 'center', backgroundColor: 'transparent' }]}>{'Nenhuma O.S. encontrada!'}</ThemedText>
                      </ThemedView>
                    </View>
                  </View>
                )
              }}
            />
          }

          <Modal transparent visible={visibleMenu} animationType="none">
            <TouchableWithoutFeedback onPress={() => { toggleMenu() }}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <TouchableWithoutFeedback>
                  <Animated.View
                    {...panResponder.panHandlers}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      transform: [{ translateY: slideAnim }],
                      backgroundColor: '#FFF',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      padding: 20,
                      elevation: 5
                    }}>
                    {/* Conteúdo do menu */}
                    {
                      dadosAtuais !== null &&

                      <View style={[Styles.em_linhaVertical, Styles.w100]}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Opções para "{dadosAtuais.title}"</Text>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.w100, Styles.btn, Styles.secondary, { marginHorizontal: 0, marginVertical: 2.5 }]}
                          onPress={() => {
                            apresentaModal(
                              'dialog',
                              'calendar-month',
                              'Agendar O.S.',
                              () => (
                                <View style={[Styles.em_linhaVertical, {}]}>
                                  <ThemedText type='defaultSemiBold' style={[Styles.w100, { textAlign: 'center', marginBottom: 20 }]}>{'Verifique os dados antes de continuar.'}</ThemedText>
                                  <ThemedText type='defaultSemiBold' style={[Styles.w100, { textAlign: 'left', marginBottom: 20 }]}>{'O.S.:' + dadosAtuais.os + '\nCliente:' + dadosAtuais.title}</ThemedText>
                                  <ThemedText type='defaultSemiBold' style={[Styles.w100, { textAlign: 'center', marginBottom: 20 }]}>{'Quer prosseguir com o agendamento da O.S.?'}</ThemedText>
                                </View>
                              ),
                              'default',
                              () => {
                                return (
                                  <>
                                    <TouchableOpacity style={[Styles.btn, Styles.warning, Styles.em_linhaHorizontal, Styles.w33, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                                      onPress={() => {
                                        toggleMenu()
                                        setLoad(false)
                                        fecharModal('');
                                      }}
                                    >
                                      <Text style={[Styles.ft_regular, Styles.lblwarning]}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[Styles.btn, Styles.danger, Styles.em_linhaHorizontal, Styles.w33, Styles.btnDialog, Styles.btnDialogcentered, {}]}
                                      onPress={() => {
                                        toggleMenu()
                                        setLoad(false)
                                        fecharModal('');
                                      }}
                                    >
                                      <Text style={[Styles.ft_regular, Styles.lbldanger]}>Não</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[Styles.btn, Styles.success, Styles.em_linhaHorizontal, Styles.w33, Styles.btnDialog, Styles.btnDialogRight, {}]}
                                      onPress={() => {
                                        toggleMenu()
                                        setLoad(false)
                                        fecharModal('');
                                        navigation.navigate('reagendar os');
                                      }}
                                    >
                                      <Text style={[Styles.ft_regular, Styles.lblsuccess]}>Sim</Text>
                                    </TouchableOpacity>
                                  </>
                                )
                              }
                            );
                          }}
                        >
                          <MaterialCommunityIcons name='calendar-month' size={15} style={[Styles.lblsecondary, Styles.mr_5]} />
                          <Text style={[Styles.ft_regular, Styles.lblsecondary]}>Agendar montagem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.w100, Styles.btn, Styles.primary, { marginHorizontal: 0, marginVertical: 2.5 }]}
                          onPress={() => {
                            toggleMenu()
                            apresentaModal(
                              'dialog',
                              'map-marker-path',
                              'Roterização de rota!',
                              () => (
                                <View style={[Styles.w100, Styles.em_linhaVertical, { paddingVertical: 15 }]}>
                                  <ThemedText type='title' style={[{ color: theme.labels.text }]}>Roterizar ordem de serviço</ThemedText>
                                  <Text style={[Styles.ft_regular, Styles.w90, getModalStyleLabel('info'), { textAlign: 'center', maxWidth: '90%' }]}>{'Deseja roterizar esta Ordem de serviço?'}</Text>
                                </View>
                              ),
                              'info',
                              () => (
                                <>
                                  <TouchableOpacity style={[Styles.btn, Styles.danger, Styles.em_linhaHorizontal, Styles.w50, Styles.btnDialog, Styles.btnDialogLeft, {}]}
                                    onPress={() => {
                                      toggleMenu()
                                      setLoad(false)
                                      fecharModal('');
                                    }}
                                  >
                                    <Text style={[Styles.ft_regular, Styles.lbldanger]}>CANCELAR</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={[Styles.btn, Styles.success, Styles.em_linhaHorizontal, Styles.w50, Styles.btnDialog, Styles.btnDialogRight, {}]}
                                    onPress={() => {
                                      toggleMenu()
                                      setLoad(false)
                                      fecharModal('');
                                      navigation.navigate('roterizacao', { dados: dadosAtuais });
                                    }}
                                  >
                                    <Text style={[Styles.ft_regular, Styles.lblsuccess]}>CONFIRMAR</Text>
                                  </TouchableOpacity>
                                </>
                              )
                            );
                          }}
                        >
                          <MaterialCommunityIcons name='map-marker-path' size={15} style={[Styles.lblprimary, Styles.mr_5]} />
                          <Text style={[Styles.ft_regular, Styles.lblprimary]}>Roterizar O.S.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.w100, Styles.btn, Styles.primary, { marginHorizontal: 0, marginVertical: 2.5 }]}
                          onPress={() => {
                            toggleMenu()
                            apresentaModal(
                              'dialog',
                              'information',
                              'Oops!',
                              () => (
                                <View style={[Styles.w100, Styles.em_linhaVertical, { paddingVertical: 15 }]}>
                                  <ThemedText type='title' style={[{ color: theme.backgroundColor.background }]}>Trabalhando nisso...</ThemedText>
                                  <MaterialCommunityIcons name='emoticon-cool' size={75} style={[getModalStyleLabel('info')]} />
                                  <Text style={[Styles.ft_regular, Styles.w90, getModalStyleLabel('info'), { textAlign: 'center', maxWidth: '90%' }]}>{'^_^\nHumm, não era pra este botão estar aí, Ainda estamos trabalhando nesta tela, Aguarde uma nova atualização...'}</Text>
                                </View>
                              ),
                              'info',
                              () => (
                                <TouchableOpacity style={[Styles.btn, Styles.success, Styles.em_linhaHorizontal, Styles.w100, Styles.btnDialog, Styles.btnDialogcentered, {}]}
                                  onPress={() => {
                                    toggleMenu()
                                    setLoad(false)
                                    fecharModal('');
                                  }}
                                >
                                  <Text style={[Styles.ft_regular, Styles.lblsuccess]}>OK!</Text>
                                </TouchableOpacity>
                              )
                            );
                          }}
                        >
                          <MaterialCommunityIcons name='account-plus' size={15} style={[Styles.lblprimary, Styles.mr_5]} />
                          <Text style={[Styles.ft_regular, Styles.lblprimary]}>Adicionar parceiro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.w100, Styles.btn, Styles.info, { marginHorizontal: 0, marginVertical: 2.5 }]}
                          onPress={() => {//dadosAtuais.endereco[0].contato !== null && dadosAtuais.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'whatsapp://send?text=Olá *'+dadosAtuais.title+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: *https://appmontagens.gsapp.com.br/gsmontagens/?params=psqmtg,'+dadosAtuais.os+'*&phone=+55'+dadosAtuais.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                          }}
                        >
                          <MaterialCommunityIcons name='whatsapp' size={15} style={[Styles.lblprimary, Styles.mr_5]} />
                          <Text style={[Styles.ft_regular, Styles.lblprimary]}>Chamar no WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.w100, Styles.btn, Styles.warning, { marginHorizontal: 0, marginVertical: 2.5 }]}
                          onPress={() => {
                            navigation.navigate('devolver os', { dadosOs: dadosAtuais });
                          }}
                        >
                          <MaterialCommunityIcons name='undo-variant' size={15} style={[Styles.lblwarning]} />
                          <Text style={[Styles.ft_medium, Styles.lblwarning]}>Devolver O.S.</Text>
                        </TouchableOpacity>
                      </View>
                    }
                    {
                      dadosAtuais === null &&

                      <View style={[Styles.em_linhaVertical, Styles.w100]}>
                        <ActivityIndicator animating color={'blue'} size={45} />
                        <Text>{'Carregando menu\n\nAguarde...'}</Text>
                      </View>
                    }
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ThemedView>
      );
      /*}*/
    }
  } catch (error: any) {
    /*ToastAndroid.showWithGravityAndOffset(
      ,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );*/
    console.log('Corrija o erro de renderização=>', error.message);
    //Alert.alert('Erro','Erro de renderização 373=>,\n\n'+error.message);
  }

}