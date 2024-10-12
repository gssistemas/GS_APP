import { ThemedText } from '../../../Components/ThemedText';
import { ThemedView } from '../../../Components/ThemedView';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect } from 'react';
import { View,Text,Dimensions, PixelRatio, ScrollView, useColorScheme, TouchableOpacity, Alert,RefreshControl, ActivityIndicator,ToastAndroid} from 'react-native';
import { Styles } from '../../../../assets/Styles/Styles';
import { Linking,Platform, TextInput} from 'react-native';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
const { width,height } = Dimensions.get('window');

const normalizeFontSize = (size:number) => {
    const scale = width / 500; // 320 é o tamanho base de referência (pode ajustar)
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default function MinhasOs({navigation}:any) {
  const {theme} = useTheme();
  const {usuario,AlimentarApp,setLoad,buscarNotificacoes,isConnectedNetwork,setListOsOffline,verificarConexao,listMinhasOs,listOsDisponiveis,listOsOffline,isModalVisible,setModalVisible,modalVisible,apresentaModal,fecharModal,getModalStyle,getModalStyleLabel,buscarOs,dataInicial,dataFinal,idPrceiro,statusOs,nomeCliente,nf,ordemServico,osInicada,setNomeCliente} = useContext<any>(AuthLogin);
  useEffect(()=>{
    usuario !== null && onRefresh();
  },[])

  

  async function abrirWhatsapp(linkWhatsapp:any){
    let Url = linkWhatsapp;

    const supported = await Linking.openURL(linkWhatsapp);

    if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(linkWhatsapp);
    } else {
        Alert.alert('Erro!','Parece que você não possui o "WhatsApp" ou "WhatsAppBusiness" instalado em seu aparelho, Verifique e tente novamente.');
    }
  }
  //console.log('32=>',listMinhasOs)
  const onRefresh = async () => {
    console.log('buscarOs=>',nf+'|'+dataInicial === '' ? null : dataInicial+'|'+dataFinal === '' ? null : dataFinal+'|'+nomeCliente === '' ? null : nomeCliente+'|'+ordemServico === '' ? null : ordemServico+'|'+usuario.id_login[0].id)
    const vrfConn = await verificarConexao();
    console.log('Verificação de conexão=>',vrfConn)
    if(vrfConn.code === 0/*vrfConn.code ===  0*/){
      //verifica se existe osOffline
      if(listOsOffline === null){
        const os = await buscarOs('buscarOs',nf+'|'+dataInicial === '' ? null : dataInicial+'|'+dataFinal === '' ? null : dataFinal+'|'+nomeCliente === '' ? null : nomeCliente+'|'+ordemServico === '' ? null : ordemServico+'|'+usuario.id_login[0].id);
        //console.log('34 da tab minhas OS',os)
        if(os.code === 0){
          fecharModal('');
          setModalVisible(false);
        }
      }else if(listOsOffline !== null){
        fecharModal('');
        setModalVisible(false);
      }
    }else{
      apresentaModal(
        'error',
        'wifi-alert',
        'Não conectado!',
        ()=>(
            <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                <MaterialCommunityIcons name='wifi-alert' size={75} style={[getModalStyleLabel('danger')]}/>
                <Text style={[Styles.ft_medium,getModalStyleLabel('danger'),{textAlign:'center',marginBottom:25}]}>{'Parece que você está "OFFLINE", Para carregar novas O.S. é necessário estar "ONLINE".\n\nTente novamente quando estiver "ONLINE".'}</Text>
            </View>
        ),
        'danger',
        ()=>(
          <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogcentered,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}
              onPress={()=>{
                fecharModal('');
                setModalVisible(false);
              }}
          >
              <Text style={[Styles.ft_regular,Styles.lbllight]}>OK!</Text>
          </TouchableOpacity>
        )
      )
    }
    
  };

  async function inicioOff(){
    AlimentarApp();
  }
  try {
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
      setTimeout(() => {
        navigation.reset({
        index:0,
        routes:[
            {
                name:osInicada.tela
            }
        ]
      });
      }, 5000);
      
    }else{*/
      return (
      <ThemedView style={[{height:height - 100,width:'100%',paddingHorizontal:5,paddingVertical:10,alignItems:'center',justifyContent:'center',backgroundColor:theme.backgroundColor.background}]}>
        <ThemedView style={[{width:width,marginTop:0,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#999',paddingVertical:7,backgroundColor:theme.backgroundColor.background}]}>
          <ThemedText type='defaultSemiBold' style={[Styles.w75,{marginHorizontal:0,marginLeft:'2.5%'/*borderBottomWidth:1,borderBottomColor:'#999999'*/}]}>{listMinhasOs !== null ? listMinhasOs.length+'-': ''}Ordens de serviço</ThemedText>
          <TouchableOpacity
            style={[Styles.w10,{marginHorizontal:0/*borderWidth:1,borderColor:'#FFF',backgroundColor:'seagreen',paddingHorizontal:15,paddingVertical:10,borderRadius:10,elevation:5*/}]}
            onPress={()=>{
              apresentaModal(
                'dialog',
                'magnify',
                'Buscar O.S.',
                ()=>(
                  <View style={[Styles.em_linhaVertical,Styles.w100,{justifyContent:'center',alignItems:'stretch',borderBottomLeftRadius:5,borderBottomRightRadius:5}]}>
                    <Text style={[Styles.ft_regular,Styles.w100]}>Digite um nome para buscar:</Text>
                    <TextInput style={[Styles.w100,Styles.input,{minWidth:'100%',width:'100%'}]}
                      placeholder="Nome"
                      onChangeText={(text)=>{setNomeCliente(text)}}
                      defaultValue={nomeCliente}
                      selectTextOnFocus={true}
                    />
                    {
                      nomeCliente !== null || nomeCliente !== '' &&

                      <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.warning]}
                        onPress={()=>{
                          setNomeCliente('');
                        }}
                      >
                        <MaterialCommunityIcons name='delete' size={25} style={[Styles.lblwarning]}/>
                        <Text style={[Styles.lblwarning]}>Limpar</Text>
                      </TouchableOpacity>
                    }
                    
                  </View>
                ),
                'light',
                ()=>(
                  <View style={[Styles.em_linhaHorizontal,Styles.w100,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}>
                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.btnDialog,Styles.btnDialogLeft,Styles.w50,getModalStyle('light'),{marginBottom:2,marginHorizontal:0,elevation:0}]}
                      onPress={()=>{
                        fecharModal()
                      }}
                    >
                      <Text style={[getModalStyleLabel('light')]}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.btnDialog,Styles.btnDialogRight,Styles.w50,getModalStyle('light'),{marginBottom:2,marginHorizontal:0,elevation:0}]}
                      onPress={()=>{
                        buscarOs('buscarOs',nf+'|'+dataFinal+'|'+dataFinal+'|'+nomeCliente+'|'+ordemServico+'|'+usuario.id_user);
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
            <MaterialCommunityIcons name='magnify' size={25} style={{color:theme.labels.text}}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Styles.w10,{marginHorizontal:0/*borderWidth:1,borderColor:'#FFF',backgroundColor:'seagreen',paddingHorizontal:15,paddingVertical:10,borderRadius:10,elevation:5*/}]}
            onPress={()=>{onRefresh();}}
          >
            <MaterialCommunityIcons name='sync' size={25} style={{color:theme.labels.text}}/>
          </TouchableOpacity>
        </ThemedView>
        {
          (dataInicial !== undefined && dataInicial !== '' || 
            dataFinal !== undefined && dataFinal !== '' || 
            nomeCliente !== undefined && nomeCliente !== '' || 
            ordemServico !== undefined && ordemServico !== '' || 
            nf !== undefined && nf !== ''
          ) &&
          <ThemedView style={[Styles.w100,Styles.warning,{borderRadius:8,marginTop:5,marginBottom:5,flexDirection:'column',alignItems:'center',justifyContent:'space-between',elevation:2,paddingVertical:7}]}>
            <Text style={[Styles.ft_bold,Styles.w95]}>Filtro(s) aplicado(s) buscando por:</Text>
            <View style={[Styles.em_linhaHorizontal,Styles.w95,{justifyContent:'flex-start'}]}>
              {dataInicial && dataInicial !== '' && <Text style={[Styles.ft_regular]}>De: {dataInicial}</Text>}
              {dataFinal && dataFinal !== '' && <Text style={[Styles.ft_regular]}> Até: {dataFinal}</Text>}
            </View>
            {nomeCliente && nomeCliente !== '' && <Text style={[Styles.ft_regular,Styles.w95,{fontSize: normalizeFontSize(20)}]}>Nome: {nomeCliente}</Text>}
            {ordemServico && ordemServico !== '' && <Text style={[Styles.ft_regular,Styles.w95]}>Ordem de Serviço: {ordemServico}</Text>}
            {nf && nf !== '' && <Text>NF: {nf}</Text>}
          </ThemedView>
        }
        {
          listMinhasOs === null &&

          <View style={[{width:'100%',height:height,alignItems:'center',justifyContent:'center'}]}>
            <View style={[{flexDirection:'column',alignItems:'center',justifyContent:'center',width:'80%',height:'auto',marginHorizontal:'10%',borderRadius:20,backgroundColor:'#FAFAFA',elevation:5}]}>
              
              <ThemedView style={[Styles.em_linhaVertical,{alignItems:'center',justifyContent:'center',backgroundColor:'#FAFAFA'}]}>
                <MaterialCommunityIcons name='sleep' size={75} style={[Styles.alertsuccess]}/>
                <ThemedText type='defaultSemiBold' style={[{color:'#000',textAlign:'center',backgroundColor:'transparent'}]}>{'Nenhuma O.S. encontrada'}</ThemedText>
                
                {
                  (dataInicial !== undefined && dataInicial !== '' || 
                    dataFinal !== undefined && dataFinal !== '' || 
                    nomeCliente !== undefined && nomeCliente !== '' || 
                    ordemServico !== undefined && ordemServico !== '' || 
                    nf !== undefined && nf !== ''
                  ) &&
                  <ThemedView style={[Styles.w100,Styles.warning,{borderRadius:8,marginTop:5,marginBottom:5,flexDirection:'column',alignItems:'center',justifyContent:'space-between',elevation:2,paddingVertical:7}]}>
                    <Text style={[Styles.ft_bold,Styles.w95]}>Você possui filtros na pesquiza:</Text>
                    <View style={[Styles.em_linhaHorizontal,Styles.w95,{justifyContent:'flex-start'}]}>
                      {dataInicial && dataInicial !== '' && <Text style={[Styles.ft_regular]}>De: {dataInicial}</Text>}
                      {dataFinal && dataFinal !== '' && <Text style={[Styles.ft_regular]}> Até: {dataFinal}</Text>}
                    </View>
                    {nomeCliente && nomeCliente !== '' && <Text style={[Styles.ft_regular,Styles.w95]}>Nome: {nomeCliente}</Text>}
                    {ordemServico && ordemServico !== '' && <Text style={[Styles.ft_regular,Styles.w95]}>Ordem de Serviço: {ordemServico}</Text>}
                    {nf && nf !== '' && <Text>NF: {nf}</Text>}
                  </ThemedView>
                }
              </ThemedView>
              <TouchableOpacity
                style={[{borderWidth:1,borderColor:'#FFF',backgroundColor:'seagreen',paddingHorizontal:15,paddingVertical:10,borderRadius:10,marginVertical:15,elevation:5}]}
                onPress={()=>{
                  onRefresh()
                  /*console.log(nf+'|'+dataInicial+'|'+dataFinal+'|'+nomeCliente+'|'+ordemServico)
                  navigation.navigate('O.s. offline');
                  if(usuario === null){
                    
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
                <ThemedText type='link' style={[{color:'#FFF'}]}>Buscar novamente...</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        }
        {
          listMinhasOs !== null &&

          <ScrollView style={[{width:'100%'}]} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={modalVisible} onRefresh={onRefresh}/>}>
            {
              listMinhasOs.map((mOs:any,i:number)=>{
                //console.log('list=>',mOs)
                
                //if(existe !== -1){
                  return(
                    <ThemedView key={i} style={[{width:'97%',borderRadius:5,padding:2.5,elevation:2,marginVertical:5,height:'auto',backgroundColor:'#FAFAFA',marginHorizontal:'1.5%'}]}>
                          <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.secondary,{paddingHorizontal:2,paddingVertical:2,marginHorizontal:0,position:'absolute',zIndex:999,right:0,top:-10}]}
                              onPress={()=>{
                                apresentaModal(
                                  'dialog',
                                  'calendar-month',
                                  'Agendar O.S.',
                                  ()=>(
                                    <View style={[Styles.em_linhaVertical,{}]}>
                                      <ThemedText type='defaultSemiBold' style={[Styles.w100,{textAlign:'center',marginBottom:20}]}>{'Verifique os dados antes de continuar.'}</ThemedText>
                                      <ThemedText type='defaultSemiBold' style={[Styles.w100,{textAlign:'left',marginBottom:20}]}>{'O.S.:'+mOs.os+'\nCliente:'+mOs.title}</ThemedText>
                                      <ThemedText type='defaultSemiBold' style={[Styles.w100,{textAlign:'center',marginBottom:20}]}>{'Quer prosseguir com o agendamento da O.S.?'}</ThemedText>
                                    </View>
                                  ),
                                  'default',
                                  ()=>{
                                      return(
                                          <>
                                              <TouchableOpacity style={[Styles.btn,Styles.warning,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                                                  onPress={()=>{
                                                      setLoad(false)
                                                      fecharModal('');
                                                  }}
                                              >
                                                  <Text style={[Styles.ft_regular,Styles.lblwarning]}>Cancelar</Text>
                                              </TouchableOpacity>
                                              <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogcentered,{}]}
                                                  onPress={()=>{
                                                      setLoad(false)
                                                      fecharModal('');
                                                  }}
                                              >
                                                  <Text style={[Styles.ft_regular,Styles.lbldanger]}>Não</Text>
                                              </TouchableOpacity>
                                              <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                                  onPress={()=>{
                                                      setLoad(false)
                                                      fecharModal('');
                                                      navigation.navigate('reagendar os');
                                                  }}
                                              >
                                                  <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Sim</Text>
                                              </TouchableOpacity>
                                          </>
                                      )
                                  }
                                );
                              }}
                            >
                              <MaterialCommunityIcons name='calendar-month' size={15} style={[Styles.lblsecondary]}/>
                          </TouchableOpacity>
                          <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary,{paddingHorizontal:2,paddingVertical:2,marginHorizontal:0,position:'absolute',zIndex:999,right:0,top:15}]}
                              onPress={()=>{
                              }}
                            >
                              <MaterialCommunityIcons name='account-plus' size={15} style={[Styles.lblprimary]}/>
                          </TouchableOpacity>
                          <TouchableOpacity style={[{width:'100%',alignItems:'stretch',justifyContent:'center'}]} onPress={()=>{navigation.navigate('info os',{dadosOs:mOs})}}>
                            <View style={[{flexDirection:'column',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                              <ThemedView style={[{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',paddingVertical:5,paddingHorizontal:10,borderRadius:5,backgroundColor:theme.backgroundColor.background}]}>
                                <MaterialCommunityIcons name='store' size={25} color={'#000000'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                                <ThemedText type='default' style={[{fontSize:width * 0.05}]}>{mOs.filial[0].codigo_loja+' - '+mOs.filial[0].nome}</ThemedText>
                              </ThemedView>
                            </View>
                            <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                              <ThemedView style={[{width:'48%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:5}]}>
                                <MaterialCommunityIcons name='archive' size={25} color={'#000000'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                                <ThemedText type='default'>O.S.:{mOs.os}</ThemedText>
                              </ThemedView>
                              <ThemedView style={[{width:'48%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:4}]}>
                                <MaterialCommunityIcons name='file-document' size={25} color={'#000000'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                                <ThemedText type='default'>NF:{mOs.nota_fiscal}</ThemedText>
                              </ThemedView>
                            </View>
                            <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                              <ThemedView style={[{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:5}]}>
                                <MaterialCommunityIcons name='account' size={25} color={'#000000'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                                <ThemedText type='default' style={[{fontSize:width * 0.05}]}>{mOs.title}</ThemedText>
                              </ThemedView>
                            </View>
                            <View style={[{flexDirection:'column',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                              <ThemedView style={[{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:5}]}>
                                {
                                  mOs.endereco === null ? 
                                  <>
                                    <MaterialCommunityIcons name='map-marker-distance' size={25} color={'red'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                                    <ThemedText type='default' style={[{color:'red'}]}>Endereço: {'Favor verificar junto a filial!'}</ThemedText>
                                  </>
                                  :
                                  <>
                                    <MaterialCommunityIcons name='map-marker-distance' size={25} color={'blue'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                                    <ThemedText type='default' style={[{color:theme.labels.text,maxWidth:'100%'}]} maxFontSizeMultiplier={2}>{mOs.endereco[0].rua+', N° '+mOs.endereco[0].n+'\n'+(mOs.endereco[0].bairro !== 'null' && mOs.endereco[0].bairro !== '' ? mOs.endereco[0].bairro : 'Não informado')+','+mOs.endereco[0].cidade+'-'+mOs.endereco[0].uf}</ThemedText>
                                  </>
                                }
                              </ThemedView>
                            </View>
                            <View style={[{flexDirection:'column',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                              <ThemedView style={[{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:5}]}>
                              {
                                  mOs.endereco === null ? 
                                  <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                                    <MaterialCommunityIcons name='tune-variant' size={25} color={'red'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                                    <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                                      <ThemedText type='default' style={[{color:'red'}]}>{'Contato Inválido!'}</ThemedText>
                                    </View>
                                  </View>
                                  :
                                  <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between'}]}>
                                    <MaterialCommunityIcons name='tune-variant' size={25} color={'blue'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                                    <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                                      <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.light,Styles.w40,{marginHorizontal:0,marginVertical:0,paddingVertical:0,borderRadius:50,paddingLeft:0,justifyContent:'flex-start'}]}
                                        onPress={()=>{
                                            //console.log('OsIniciada=>',mOs);
                                            //console.log('agendamento Status=>',)
                                            //status(agendamento_m[0].status)
                                            //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                                            mOs.endereco[0].contato !== null && mOs.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'tel:'+mOs.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                                        }}
                                      >
                                        <MaterialCommunityIcons name='phone' size={25} style={[Styles.mr_5,getModalStyle(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined ? 'warning' : 'info'),getModalStyleLabel(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                                        <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined ? 'warning' : 'info')]}>{'Chamar'}</ThemedText>
                                      </TouchableOpacity>
                                      <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.light,Styles.w50,{marginHorizontal:0,marginVertical:0,paddingVertical:0,borderRadius:50,paddingLeft:0,justifyContent:'flex-start'}]}
                                          onPress={()=>{
                                              //console.log('OsIniciada=>',mOs);
                                              //console.log('agendamento Status=>',)
                                              //status(agendamento_m[0].status)
                                              //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                                              mOs.endereco[0].contato !== null && mOs.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'whatsapp://send?text=Olá *'+mOs.title+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: *https://appmontagens.gsapp.com.br/gsmontagens/?params=psqmtg,'+mOs.os+'*&phone=+55'+mOs.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                                          }}
                                      >
                                          <MaterialCommunityIcons name='whatsapp' size={25} style={[Styles.mr_5,getModalStyle(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined ? 'warning' : 'info'),getModalStyleLabel(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                                          <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined ? 'warning' : 'info')]}>{'WhatsApp'}</ThemedText>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                }
                              </ThemedView>
                            </View>
                          </TouchableOpacity>
                    </ThemedView>
                  )
                //}
              })
            }
          </ScrollView>
        }
        {
          listOsOffline !== null && listOsOffline.length > 0 &&

          <View style={[{width:'100%',height:height,alignItems:'center',justifyContent:'center'}]}>
            <View style={[{flexDirection:'column',alignItems:'center',justifyContent:'center',width:'80%',height:'auto',marginHorizontal:'10%',borderRadius:20,backgroundColor:'#FAFAFA',elevation:5}]}>
              
              <ThemedView style={[Styles.em_linhaVertical,{alignItems:'center',justifyContent:'center',backgroundColor:'#FAFAFA'}]}>
                <MaterialCommunityIcons name='alert-circle' size={75} style={[Styles.alertsuccess]}/>
                <ThemedText type='defaultSemiBold' style={[{color:'#000',textAlign:'center',backgroundColor:'transparent'}]}>{'Você possui O.S. "OFFLINE" para enviar!'}</ThemedText>
              </ThemedView>
              <TouchableOpacity
                style={[{borderWidth:1,borderColor:'#FFF',backgroundColor:'seagreen',paddingHorizontal:15,paddingVertical:10,borderRadius:10,marginVertical:15,elevation:5}]}
                onPress={()=>{
                  console.log(nf+'|'+dataInicial+'|'+dataFinal+'|'+nomeCliente+'|'+ordemServico)
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
                <ThemedText type='link' style={[{color:'#FFF'}]}>Enviar O.S. "OFFLINE"</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        }
      </ThemedView>
      );
    /*}*/
  } catch (error:any) {
    /*ToastAndroid.showWithGravityAndOffset(
      ,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );*/
    Alert.alert('Erro','Erro de renderização 373=>,\n\n'+error.message);
  }
  
}