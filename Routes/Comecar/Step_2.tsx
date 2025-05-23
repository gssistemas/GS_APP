import { Animated, View, Text, TouchableOpacity, ActivityIndicator, Alert,Linking} from 'react-native';
import { Styles } from '../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useContext, useEffect, useRef } from 'react';
import { useTheme } from '../../assets/Styles/ThemeContext';
import {AuthLogin} from '../../assets/Contexts/AuthLogin';
import { ExternalLink } from '../Components/ExternalLink';
import { ThemedText } from '../Components/ThemedText';
import Config from '../../assets/Config/Config.json';
import axios from 'axios';

export default function Step_2({navigation}:any) {
    const { theme } = useTheme();
    const {uniqueId,gerarIdUnico,apresentaModal,arlterarModal,load,setLoad,modalVisible,setModalVisible,iconeModal,getModalStyle,getModalStyleLabel,getModalStyleLabelAlert,setIconeModal,titleModal,setTitleModal,conteudoModal,setConteudoModal,actionsModal,setActionsModal} = useContext<any>(AuthLogin);
    console.log(uniqueId,load)

    const openWebsite = (href:string) => {
      Linking.openURL(href).catch(err => console.error("Couldn't load page", err));
    };

    async function verificarRegistro(id_do_app:string){
      apresentaModal('load','close','',()=>(<View style={[Styles.em_linhaVertical,{marginBottom:20}]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,{textAlign:'center',marginBottom:20}]}>{'Verificando registro do aplicativo\n\nAguarde...'}</Text></View>),'light',()=>(null));

      const response = await axios({
        method:'get',
        url:Config.configuracoes.pastaProcessos,
        params:{
          comando:'verificarRegistro',
          id_app:id_do_app,
        },
      });
      console.log(response)
      if(response.data[0].status === 'OK'){
        if(response.data[0].codeMensagem === 1){
          apresentaModal(
              'error',
              'shield-remove',
              'Erro',
              ()=>(<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='shield-remove' size={75} style={[getModalStyleLabel('danger')]}/><Text style={[Styles.ft_regular,getModalStyleLabel('danger'),{textAlign:'center',marginBottom:20,}]}>{response.data[0].statusMensagem+'\n\nSeu ID único:'+id_do_app+'\n\nDeseja prosseguir com o cadastro do app?'}</Text></View>),
              'light',
              ()=>(
                  <>
                    <TouchableOpacity 
                        onPress={()=>{setModalVisible(false)}} 
                        style={[Styles.w50,Styles.danger,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomLeftRadius:5}]}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbldanger,{}]}>Não</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{setModalVisible(false),navigation.navigate('register app',{id_app:id_do_app});}} 
                        style={[Styles.w50,Styles.success,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomRightRadius:5}]}
                    >
                        <Text style={[Styles.ft_regular,Styles.lblsuccess,{}]}>Sim</Text>
                    </TouchableOpacity>
                  </>
              ),
              response.data[0].statusMensagem+'\n\nSeu ID único:'+id_do_app+'\n\nDeseja prosseguir com o cadastro do app?'
          )
          //setLoad(false);
        }else{
          apresentaModal(
            'success',
            'shield-check',
            'Sucesso',
            ()=>(<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='shield-remove' size={75} style={[getModalStyleLabel('success')]}/><Text style={[Styles.ft_regular,getModalStyleLabel('success'),{textAlign:'center',marginBottom:20,}]}>{response.data[0].statusMensagem+'\n\nDeseja prosseguir com o app?'}</Text></View>),
            'light',
            ()=>(
                <>
                  <TouchableOpacity 
                      onPress={()=>{setModalVisible(false)}} 
                      style={[Styles.w50,Styles.danger,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomLeftRadius:5}]}
                  >
                      <Text style={[Styles.ft_regular,Styles.lbldanger,{}]}>Não</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                      onPress={()=>{setModalVisible(false),navigation.navigate('requisicao');}} 
                      style={[Styles.w50,Styles.success,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15,borderBottomRightRadius:5}]}
                  >
                      <Text style={[Styles.ft_regular,Styles.lblsuccess,{}]}>Sim</Text>
                  </TouchableOpacity>
                </>
            ),
            response.data[0].statusMensagem+'\n\nDeseja prosseguir com o cadastro do app?'
        )
        }
        //
      }
      
    }

    try {
      return (
          <View style={[Styles.container,{backgroundColor:theme.backgroundColor.background,paddingHorizontal:2.5}]}>
              <View style={[Styles.w95,Styles.em_linhaHorizontal]}>
                <Text style={[Styles.title,Styles.ft_regular,{color:theme.labels.text}]}>Id único do APP.</Text>
              </View>
              <Text style={[Styles.subtitle,Styles.ft_regular,{color:theme.labels.text}]}>Clique em gerar meu APPID para continuar.</Text>

              {
                load === true && 
                <TouchableOpacity style={[Styles.w95,Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{}]}
                  onPress={()=>{
                    apresentaModal('load','close','',()=>(<View style={[Styles.em_linhaVertical,{marginBottom:20}]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,{textAlign:'center',marginBottom:20}]}>{'Gerando id único do aplicativo\n\nAguarde...'}</Text></View>),'light',()=>(null))
                    setLoad(!load),
                    gerarIdUnico()
                  }}
                >
                  <ActivityIndicator size={25} color={theme.labels.text}/>
                  <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblprimary,Styles.ml_5]}>Aguarde...</Text>
                </TouchableOpacity>
              }
              {
                load === false && uniqueId == '' &&

                <TouchableOpacity style={[Styles.w95,Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{}]}
                  onPress={()=>{
                    apresentaModal('load','close','',()=>(<View style={[Styles.em_linhaVertical]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,{textAlign:'center'}]}>{'Gerando id único do aplicativo\n\nAguarde...'}</Text></View>),'light',()=>(null))
                    setLoad(!load),
                    gerarIdUnico()
                  }}
                >
                  <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblprimary]}>Gerar meu APPID</Text>
                  <MaterialCommunityIcons name='sync' size={25} style={[Styles.lblprimary,Styles.ml_5]}/> 
                </TouchableOpacity>
              }
              {
                load === false && uniqueId == undefined &&

                <TouchableOpacity style={[Styles.w95,Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{}]}
                  onPress={()=>{
                    apresentaModal('load','close','',()=>(<View style={[Styles.em_linhaVertical]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,{textAlign:'center'}]}>{'Gerando id único do aplicativo\n\nAguarde...'}</Text></View>),'light',()=>(null))
                    setLoad(!load),
                    gerarIdUnico()
                  }}
                >
                  <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblprimary]}>Gerar meu APPID</Text>
                  <MaterialCommunityIcons name='sync' size={25} style={[Styles.lblprimary,Styles.ml_5]}/> 
                </TouchableOpacity>
              }
              {
                load === false && uniqueId !== '' && uniqueId !== undefined &&
                <>
                  <View style={[Styles.em_linhaHorizontal,Styles.w70,{marginHorizontal:0,paddingVertical:10,borderRadius:50,elevation:5,marginVertical:10,borderWidth:1,borderColor:theme.labels.text,backgroundColor:theme.backgroundColor.background}]}>
                    <Text style={[Styles.ft_medium,{color:theme.labels.text}]}>Id único: </Text>
                    <Text style={[Styles.ft_bold,{color:theme.labels.text}]}>"{uniqueId}"</Text>
                  </View>
                  <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w95,Styles.success]}
                    onPress={()=>{
                      
                      navigation.navigate('register app',{id_app:uniqueId});
                      //openWebsite('https://sejaparceiro.gsapp.com.br/?comando=register_app&uniqueId='+uniqueId+'&returnUrl=../telas/dashboard/');
                    }}
                  >
                    <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblprimary]}>Registrar app</Text>
                    <MaterialCommunityIcons name='cellphone-check' size={25} style={[Styles.lblprimary,Styles.ml_5]}/> 
                  </TouchableOpacity>
                </>
              }
              {
                load === false && uniqueId !== '' && uniqueId !== undefined &&

                <TouchableOpacity style={[Styles.w95,Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{}]}
                  onPress={()=>{
                    verificarRegistro(uniqueId);
                    //navigation.navigate('requisicao');
                  }}
                >
                  <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblprimary]}>Continuar configuração</Text>
                  <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.lblprimary,Styles.ml_5]}/> 
                </TouchableOpacity>
              }
          </View>
      );
    } catch (error:any) {
      Alert.alert('Erro de inicio','Corrija o erro na linha 88=>',error.message)
    }
    
}
/*
<TouchableOpacity
              onPress={()=>{
                apresentaModal('dialog','question','teste de modal dialog','este é um teste de modal doalogo','danger',()=>(<TouchableOpacity onPress={()=>{setModalVisible(false)}} style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:10}]}><Text>Fechar Sucesso</Text></TouchableOpacity>))
              }}
            >
              <Text style={[Styles.ft_regular,Styles.btn,{color:'#000'}]}>Teste de dialogo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                apresentaModal('error','close-box','teste de modal error','este é um teste de modal error','danger',()=>(<TouchableOpacity style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:10}]}><Text>Fechar Sucesso</Text></TouchableOpacity>))
              }}
            >
              <Text style={[Styles.ft_regular,Styles.btn,{color:'#000'}]}>Teste de error</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                apresentaModal('load','close','',()=>(<View style={[Styles.em_linhaVertical]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,{textAlign:'center'}]}>{'Lendo alguma coisa\n\nAguarde...'}</Text></View>),'light',()=>(null))
              }}
            >
              <Text style={[Styles.ft_regular,Styles.btn,{color:'#000'}]}>Teste de load</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                apresentaModal('success','home','teste de modal load','este é um teste de modal load','info',()=>(<TouchableOpacity style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:10}]}><Text>Fechar Sucesso</Text></TouchableOpacity>))
              }}
            >
              <Text style={[Styles.ft_regular,Styles.btn,{color:'#000'}]}>Teste de success</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                apresentaModal('warning','home','teste de modal warning','este é um teste de modal warning','warning',()=>(<TouchableOpacity style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:10}]}><Text>Fechar Sucesso</Text></TouchableOpacity>))
              }}
            >
              <Text style={[Styles.ft_regular,{color:'#000'}]}>Teste de Warning</Text>
            </TouchableOpacity>
*/