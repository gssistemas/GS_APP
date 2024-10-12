import { Animated, View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput,Dimensions, ScrollView} from 'react-native';
import { Styles } from '../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../assets/Styles/ThemeContext';
import {AuthLogin} from '../../assets/Contexts/AuthLogin';
const {width,height} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
import Config from '../../assets/Config/Config.json';

export default function Step_3() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const {salvarVariaveis,uniqueId,gerarIdUnico,getModalStyleLabel,fecharModal,apresentaModal,testeConfig,load,setLoad,modalVisible,setModalVisible,iconeModal,setIconeModal,titleModal,setTitleModal,conteudoModal,setConteudoModal,actionsModal,setActionsModal,setStylesModal} = useContext<any>(AuthLogin);
    const [https,setHttps] = useState('');
    const [Loader,setLoader] = useState(false);

    async function iniciar(){
      const ret = await salvarVariaveis('httpsAli','httpsAli',https,'home',()=>[null],'home');

      if(ret.code === 0){
        console.log(ret)
        setLoader(false)
        fecharModal('');
        setTimeout(() => {
          navigation.reset({
            index:0,
            routes:[
                {
                    name:'home'
                }
            ]
          })
        }, 1000);
      }
    }
    try {
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={[Styles.w100,{height:height,backgroundColor:theme.backgroundColor.background,paddingHorizontal:2.5}]}>
              <View style={[Styles.w95,Styles.em_linhaHorizontal]}>
                <Text style={[Styles.title,Styles.ft_regular,{color:theme.labels.text}]}>Requizição de dados.</Text>
              </View>
              <Text style={[Styles.subtitle,Styles.w95,Styles.ft_regular,{color:theme.labels.text}]}>Indique a configuraçã de requisicão de dados, Onde devemos carregar e alimentar o app ativamente.</Text>
              <View style={[Styles.em_linhaHorizontal,Styles.w95,Styles.input,{elevation:2,alignItems:'center',justifyContent:'space-between',borderBottomWidth:0}]}>
                <View style={[Styles.em_linhaHorizontal,Styles.w85,{marginHorizontal:0,justifyContent:'flex-start'}]}>
                  <MaterialCommunityIcons name='dip-switch' size={25} color={'#999'} style={[Styles.mr_5]}/>
                  <TextInput placeholder='Endereço de ip ou API...' autoComplete='url' keyboardType='url' keyboardAppearance='dark' autoCapitalize='none' style={[{maxWidth:'90%',height:'100%'}]} onChangeText={(text)=>{setHttps(text)}} defaultValue={https}/>
                </View>
                {
                  https !== '' &&

                  <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.w15,Styles.primary,{marginHorizontal:0,paddingHorizontal:5,paddingVertical:0,height:'90%',marginRight:-5}]}
                    onPress={()=>{
                      testeConfig(https);
                    }}
                  >
                    <MaterialCommunityIcons name='connection' size={18} style={[Styles.lblprimary]}/>
                  </TouchableOpacity>
                }
              </View>
              <TouchableOpacity style={[Styles.w95,Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{}]}
                onPress={()=>{
                  setStylesModal('warning')
                  apresentaModal(
                    'dialog',
                    'alert',
                    'Atenção!!!',
                    ()=>(<Text style={[Styles.ft_bold,{textAlign:'center'}]}>{'Esta será sua configuração de busca de dados do aplicativo:\n\n"'+https+'"\n\ndeseja continuar com esta configuração?'}</Text>),
                    'warning',
                    ()=>(
                      <>
                        <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15}]}>
                          <Text>Não</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={()=>{//params:any,id_chave:string,valor:any,navegacao?:any|never|null|string,acao?:Function|undefined,tela:string
                            iniciar();
                          }} 
                          style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15}]}>
                        <Text>Sim</Text>
                      </TouchableOpacity>
                      </>
                    )
                  )
                }}
              >
                <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblprimary]}>Salvar configuração</Text>
                <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.lblprimary,Styles.ml_5]}/> 
              </TouchableOpacity>
              <TouchableOpacity style={[Styles.w95,Styles.btn,Styles.em_linhaHorizontal,Styles.warning,{}]}
                onPress={()=>{
                  setStylesModal('warning')
                  apresentaModal(
                    'dialog',
                    'alert',
                    'Atenção!!!',
                    ()=>(<Text style={[Styles.ft_bold,{textAlign:'center'}]}>{'Deseja configurar com a alimentação padrão:\n\n"'+Config.configuracoes.pastaProcessos+'"\n\ndeseja continuar com esta configuração?'}</Text>),
                    'warning',
                    ()=>(
                      <>
                        <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15}]}>
                          <Text>Não</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={()=>{//params:any,id_chave:string,valor:any,navegacao?:any|never|null|string,acao?:Function|undefined,tela:string
                            setHttps(Config.configuracoes.pastaProcessos);
                            fecharModal('');
                          }} 
                          style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:15}]}>
                        <Text>Sim</Text>
                      </TouchableOpacity>
                      </>
                    )
                  )
                }}
              >
                {
                  Loader === true && 
                  
                  <>
                    <ActivityIndicator size={25} color={getModalStyleLabel('warning')} animating={true}/>
                    <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblwarning]}>Aguarde...</Text>
                  </>
                }
                <Text style={[Styles.em_linhaHorizontal,Styles.ft_regular,Styles.lblwarning]}>Carregar padrão de alimentação</Text>
                <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.lblwarning,Styles.ml_5]}/> 
              </TouchableOpacity>
          </ScrollView>
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