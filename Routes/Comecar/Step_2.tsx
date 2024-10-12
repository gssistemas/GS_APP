import { Animated, View, Text, TouchableOpacity, ActivityIndicator, Alert,Linking} from 'react-native';
import { Styles } from '../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useContext, useEffect, useRef } from 'react';
import { useTheme } from '../../assets/Styles/ThemeContext';
import {AuthLogin} from '../../assets/Contexts/AuthLogin';
import { ExternalLink } from '../Components/ExternalLink';
import { ThemedText } from '../Components/ThemedText';

export default function Step_2({navigation}:any) {
    const { theme } = useTheme();
    const {uniqueId,gerarIdUnico,apresentaModal,load,setLoad,modalVisible,setModalVisible,iconeModal,setIconeModal,titleModal,setTitleModal,conteudoModal,setConteudoModal,actionsModal,setActionsModal} = useContext<any>(AuthLogin);
    console.log(uniqueId,load)

    const openWebsite = (href:string) => {
      Linking.openURL(href).catch(err => console.error("Couldn't load page", err));
    };

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
                    apresentaModal('load','close','',()=>(<View style={[Styles.em_linhaVertical]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,{textAlign:'center',marginBottom:20}]}>{'Gerando id único do aplicativo\n\nAguarde...'}</Text></View>),'light',()=>(null))
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
                      openWebsite('https://sejaparceiro.gsapp.com.br/?comando=register_app&uniqueId='+uniqueId+'&returnUrl=../telas/dashboard/');
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
                    navigation.navigate('requisicao');
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