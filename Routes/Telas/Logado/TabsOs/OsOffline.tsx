import { View,Text,Dimensions,TouchableOpacity,ScrollView,RefreshControl,Linking,Alert,Platform,ActivityIndicator} from 'react-native';
import { Styles } from '../../../../assets/Styles/Styles';
import { FlatList } from 'react-native-gesture-handler';
import { useContext } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import { TextInput } from 'react-native-paper';
import {useNavigation} from '@react-navigation/native'
const {width,height} = Dimensions.get('window');

export default function OsOffline() {
    const navigation = useNavigation();
    const {theme} = useTheme()
    const {usuario,AlimentarApp,setLoad,arlterarModal,buscarNotificacoes,enviarOsOfflines,removerOsOffline,isConnectedNetwork,setListOsOffline,verificarConexao,listMinhasOs,listOsDisponiveis,listOsOffline,isModalVisible,getModalStyleLabelAlert,setModalVisible,modalVisible,apresentaModal,fecharModal,getModalStyle,getModalStyleLabel,buscarOs,dataInicial,dataFinal,idPrceiro,statusOs,nomeCliente,nf,ordemServico,osInicada,setNomeCliente} = useContext<any>(AuthLogin);
    //console.log('lista de os_offoline=>',listOsOffline)
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

    const onRefresh = async () => {
      const vrfConn = await verificarConexao();
      console.log('Verificação de conexão=>',vrfConn)
      if(vrfConn.code === 0/*vrfConn.code ===  0*/){
        const os = await buscarOs('buscarOs',nf+'|'+dataInicial === undefined ? null : dataInicial+'|'+dataFinal === undefined ? null : dataFinal+'|'+nomeCliente === undefined ? null : nomeCliente+'|'+ordemServico === undefined ? null : ordemServico+'|'+usuario.id_login[0].id);
        //console.log('34 da tab minhas OS',os)
        if(os.code === 0){
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

    async function enviarOsOffline(lista:any){
      const vrfConn = await verificarConexao();

      if(vrfConn.code === 0){
        arlterarModal(
            'load',
            'archive-check',
            'Processando pedido...',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <ActivityIndicator size={75} color={'blue'}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Iniciando envio de O.S. OFFLINE,\nIsso pode demorar alguns minutos,\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{null},
            'Carregando localização\n\nAguarde...'
        )
        const aguardarEnvio = await enviarOsOfflines();

        if(aguardarEnvio.code === 0){
          
          console.log('Erro=> 91-',aguardarEnvio);
          arlterarModal(
            'success',
            'archive-check',
            'Sucesso',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('success'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <MaterialCommunityIcons name='check-circle' size={75} style={[Styles.lblsuccess]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{textAlign:'center',marginBottom:25}]}>{aguardarEnvio.retorno}</Text>
                </View>
            ),
            'default',
            ()=>{null},
            aguardarEnvio.retorno
          )
        }else{
          console.log('Erro=> 107-',aguardarEnvio);
          arlterarModal(
            'error',
            'close-circle',
            '*_* Erro',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <MaterialCommunityIcons name='close-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('danger'),{textAlign:'center',marginBottom:25}]}>{aguardarEnvio.retorno}</Text>
                </View>
            ),
            'danger',
            ()=>{null},
            aguardarEnvio.retorno
          )
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
    }

    async function removerOs(idos:number){
      const ret = await removerOsOffline(idos);

      if(ret.code ===0){
        const almapp = await AlimentarApp();

        if(almapp.code === 0){
          arlterarModal(
            'success',
            'archive-check',
            'Sucesso',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('success'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <MaterialCommunityIcons name='check-circle' size={75} style={[Styles.lblsuccess]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{textAlign:'center',marginBottom:25}]}>{ret.retorno}</Text>
                </View>
            ),
            'default',
            ()=>{null},
            ret.retorno
          )
        }else{
          apresentaModal(
            'error',
            'wifi-alert',
            'Erro na remoção!',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                    <MaterialCommunityIcons name='close-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('danger'),{textAlign:'center',marginBottom:25}]}>{ret.retorno}</Text>
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
      }else{
        apresentaModal(
          'error',
          'wifi-alert',
          'Não conectado!',
          ()=>(
              <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                  <MaterialCommunityIcons name='close-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                  <Text style={[Styles.ft_medium,getModalStyleLabel('danger'),{textAlign:'center',marginBottom:25}]}>{ret.retorno}</Text>
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
    }

    return(
      <ThemedView style={[{height:height - 100,width:'100%',paddingHorizontal:5,paddingVertical:10,alignItems:'center',justifyContent:'center',backgroundColor:theme.backgroundColor.background}]}>
        
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
            {nomeCliente && nomeCliente !== '' && <Text style={[Styles.ft_regular,Styles.w95]}>Nome: {nomeCliente}</Text>}
            {ordemServico && ordemServico !== '' && <Text style={[Styles.ft_regular,Styles.w95]}>Ordem de Serviço: {ordemServico}</Text>}
            {nf && nf !== '' && <Text>NF: {nf}</Text>}
          </ThemedView>
        }
        {
          listOsOffline !== null && listOsOffline !== undefined && listOsOffline.length > 0 &&
          <>
            <ThemedView style={[{width:width,marginTop:0,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#999',paddingVertical:7}]}>
              <ThemedText type='defaultSemiBold' style={[Styles.w75,{marginHorizontal:0,marginLeft:'2.5%'/*borderBottomWidth:1,borderBottomColor:'#999999'*/}]}>O.S. Offline {isConnectedNetwork === true && listOsOffline !== null && listOsOffline.length > 0 ? <Text style={[Styles.ft_regular,getModalStyleLabelAlert('success'),{fontSize:width / 25.5}]}>{' - Você pode enviá-las agora'}</Text> : <Text style={[Styles.ft_regular,getModalStyleLabelAlert('danger'),{fontSize:width / 25.5}]}>{' - Envie quando estiver online'}</Text>}</ThemedText>
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
                onPress={()=>{buscarOs('buscarOs',nf+'|'+dataFinal+dataFinal+'|'+nomeCliente+'|'+ordemServico);}}
              >
                <MaterialCommunityIcons name='sync' size={25} style={{color:theme.labels.text}}/>
              </TouchableOpacity>
            </ThemedView>
            <ScrollView style={[{width:'100%'}]} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={modalVisible} onRefresh={onRefresh}/>}>
              {
                listOsOffline.map((mOs:any,i:number)=>{
                  //console.log(mOs.imagens_caixa[0][0])
                  
                  //if(existe !== -1){
                    return(
                      <ThemedView key={i} style={[{width:'100%',borderRadius:5,padding:10,elevation:2,marginVertical:10,height:'auto',backgroundColor:'#FAFAFA'}]}>
                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.danger,{paddingHorizontal:2,paddingVertical:2,marginHorizontal:0,position:'absolute',zIndex:999,right:0,top:-10}]}
                              onPress={()=>{
                                apresentaModal(
                                  'dialog',
                                  'help',
                                  'Remover O.S.',
                                  ()=>(<Text style={[Styles.w100,{textAlign:'center'}]}>{'Esta ação não pode ser revertida e todas as imagens serão pedidas.\n\nDeseja Excluir a O.S.:'+mOs.os+'?'}</Text>),
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
                                                      removerOs(mOs.os);
                                                      //console.log(route.params.dadosOs)//
                                                      //iniciar()
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
                              <MaterialCommunityIcons name='close' size={15} style={[Styles.lbldanger]}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{width:'100%',alignItems:'stretch',justifyContent:'center'}]} onPress={()=>{navigation.navigate('info os',{dadosOs:mOs,voltar:true})}}>
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
                                    mOs.endereco === null || mOs.endereco.length ===0 ? 
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
                                    mOs.endereco === null || mOs.endereco.length ===0 ? 
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
                                              console.log('OsIniciada=>',mOs);
                                              //console.log('agendamento Status=>',)
                                              //status(agendamento_m[0].status)
                                              //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                                              mOs.endereco[0].contato !== null && mOs.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'tel:'+mOs.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                                          }}
                                        >
                                          <MaterialCommunityIcons name='phone' size={25} style={[Styles.mr_5,getModalStyle(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined ? 'warning' : 'info'),getModalStyleLabel(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined && mOs.endereco[0].endereco.length === 0 ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                                          <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined && mOs.endereco[0].endereco.length === 0 ? 'warning' : 'info')]}>{'Chamar'}</ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.light,Styles.w50,{marginHorizontal:0,marginVertical:0,paddingVertical:0,borderRadius:50,paddingLeft:0,justifyContent:'flex-start'}]}
                                            onPress={()=>{
                                                console.log('OsIniciada=>',mOs);
                                                //console.log('agendamento Status=>',)
                                                //status(agendamento_m[0].status)
                                                //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                                                mOs.endereco[0].contato !== null && mOs.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'whatsapp://send?text='+mOs.endereco[0].contato+'?body=Olá '+mOs.title+', Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.com.br/gsmontagens/?params=psqmtg,'+mOs.os+'&phone=+55'+mOs.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                                            }}
                                        >
                                            <MaterialCommunityIcons name='whatsapp' size={25} style={[Styles.mr_5,getModalStyle(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined ? 'warning' : 'info'),getModalStyleLabel(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined && mOs.endereco[0].endereco.length === 0 ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                                            <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(mOs.endereco[0].endereco === null && mOs.endereco[0].endereco !== undefined && mOs.endereco[0].endereco.length === 0 ? 'warning' : 'info')]}>{'WhatsApp'}</ThemedText>
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
          </>
        }
        {
          listOsOffline === null &&

          <View style={[{width:'95%',marginHorizontal:'2.5%',height:height - 180,alignItems:'center',justifyContent:'center'}]}>
            
            <View style={[Styles.success,{flexDirection:'column',alignItems:'center',paddingVertical:20,justifyContent:'center',width:'100%',height:'auto',borderRadius:20,elevation:5,}]}>
              <MaterialCommunityIcons name='emoticon-wink' size={57} style={[Styles.lblsuccess]}/>
              <ThemedText type='title' style={[Styles.lblsuccess,Styles.w100,{textAlign:'center'}]}>Sem O.S.</ThemedText>
              <MaterialCommunityIcons name='sleep' size={57} style={[Styles.lblsuccess]}/>
              <ThemedText type='defaultSemiBold' style={[Styles.lblsuccess,Styles.w100,{textAlign:'center'}]}>Sem O.S. "OFFLINE" para enviar!</ThemedText>
            </View>
          </View>
        }
        {
          listOsOffline !== null && listOsOffline.length === 0 &&

          <View style={[{width:'100%',height:height,alignItems:'center',justifyContent:'center'}]}>
            <View style={[Styles.success,{flexDirection:'column',alignItems:'center',justifyContent:'center',width:'80%',height:'auto',marginHorizontal:'10%',borderRadius:20,elevation:5}]}>
              <MaterialCommunityIcons name='sleep' size={57} style={[Styles.lblsuccess]}/>
              <ThemedView style={[Styles.em_linhaVertical,Styles.success,{alignItems:'center',justifyContent:'center',backgroundColor:'#FAFAFA',marginVertical:20}]}>
                <ThemedText type='title' style={[Styles.success,Styles.lblsuccess,{textAlign:'center'}]}>{'Sem O.S. "OFFLINE" para enviar!'}</ThemedText>
              </ThemedView>
            </View>
          </View>
        }
        {
          listOsOffline !== null && 
          <>
            {
              listOsOffline.length > 0 &&
              
              <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                <TouchableOpacity style={[Styles.w45,Styles.em_linhaHorizontal,Styles.btn,Styles.danger,{marginHorizontal:0,marginRight:'2.5%'}]}
                  onPress={()=>{
                    apresentaModal(
                        'dialog',
                        'help',
                        'Limpar O.S. Offline',
                        ()=>(
                          <View style={[Styles.em_linhaVertical,Styles.w95]}>
                            <ThemedText type='title' style={[getModalStyleLabelAlert('danger'),{marginBottom:15}]}>ATENÇÃO!!!</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[Styles.w100,{color:'#000',marginBottom:15,textAlign:'center'}]}>{'Esta ação é irreverssível e todas as O.S. offline serão perdidas, Envie a(s) ordem(ns) de serviço para não perdê-las.\n\nTEM CERTEZA QUE DESEJA LIMPAR TODAS AS O.S. OFFLINE?'}</ThemedText>
                          </View>
                        ),
                        'default',
                        ()=>{
                            return(
                                <>
                                    <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,isConnectedNetwork !== false ? Styles.w33 : Styles.w50,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                                        onPress={()=>{
                                            fecharModal('');
                                            setLoad(false);
                                        }}
                                    >
                                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Cancelar</Text>
                                    </TouchableOpacity>
                                    {
                                      isConnectedNetwork !== false &&
                                      <TouchableOpacity style={[Styles.btn,Styles.info,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogcentered,{}]}
                                          onPress={()=>{
                                            enviarOsOffline(listOsOffline);
                                          }}
                                      >
                                          <Text style={[Styles.ft_regular,Styles.lblinfo]}>Enviar O.S.</Text>
                                      </TouchableOpacity>
                                    }
                                    <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,isConnectedNetwork !== false ? Styles.w33 : Styles.w50,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                        onPress={()=>{
                                            fecharModal('');
                                            setLoad(false);
                                            setListOsOffline(null);
                                        }}
                                    >
                                        <Text style={[Styles.ft_regular,Styles.lbldanger]}>Sim</Text>
                                    </TouchableOpacity>
                                </>
                            )
                        }
                    );
                  }}
                >
                    <MaterialCommunityIcons name='archive-remove' size={25} style={[Styles.lbldanger,Styles.mr_5,]}/>
                    <Text style={[Styles.ft_medium,Styles.lbldanger,Styles.mr_5]}>Limpar O.S. OFFLINE</Text>
                </TouchableOpacity>
                {
                  isConnectedNetwork && 

                  <TouchableOpacity style={[Styles.w45,Styles.em_linhaHorizontal,Styles.btn,Styles.success,{marginHorizontal:0,marginLeft:'2.5%'}]}
                    onPress={()=>{
                      enviarOsOffline(listOsOffline);
                    }}
                  >
                    <MaterialCommunityIcons name='archive-arrow-up' size={25} style={[Styles.lblsuccess,Styles.mr_5]}/>
                    <Text style={[Styles.ft_medium,Styles.lblsuccess]}>Enviar O.S. OFFLINE</Text>
                  </TouchableOpacity>
                }
                
              </View>
            }
          </>
          
        }
          
      </ThemedView>
    )
    /*return(
      <View style={[Styles.em_linhaVertical,Styles.w100,{height:height - 110,backgroundColor:theme.backgroundColor.background}]}>
        <FlatList 
          style={[Styles.w95]}
          data={OsOffline}
          renderItem={({item})=>{
            return(
              <View style={[Styles.em_linhaHorizontal]}>

              </View>
            )
          }}
          ListHeaderComponent={()=>{
            return(
            <View style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start',paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#999'}]}>
              <ThemedText type='defaultSemiBold'>Ordens de serviço OFFLINE</ThemedText>
            </View>

          )}}
          ListEmptyComponent={()=>{
            return(
              <View style={[{width:'95%',marginHorizontal:'2.5%',height:height - 180,alignItems:'center',justifyContent:'center'}]}>
                <View style={[Styles.warning,{flexDirection:'column',alignItems:'center',paddingVertical:20,justifyContent:'center',width:'100%',height:'auto',borderRadius:20,elevation:5,}]}>
                  <MaterialCommunityIcons name='sleep' size={57} color={'#000'}/>
                  <ThemedText type='title' style={[{color:'#000'}]}>Sem O.S. OFFILNE para enviar</ThemedText>
                </View>
              </View>
            )
          }}
        />
      </View>
    )*/
}