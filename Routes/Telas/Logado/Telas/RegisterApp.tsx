import React, {useState,useRef, useContext} from "react";
import { View, Text, TextInput, Modal, TouchableWithoutFeedback, Animated, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Styles } from "../../../../assets/Styles/Styles";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { AuthLogin } from "../../../../assets/Contexts/AuthLogin";
import axios from "axios";
import Config from '../../../../assets/Config/Config.json';
import config from '../../../../app.json';
const {width,height} = Dimensions.get('window');


export default function RegisterApp({route,navigation}:any){
    const {usuario,apresentaModal,setModalVisible,getModalStyle,getModalStyleLabel,getModalStyleLabelAlert,setLoad,fecharModal} = useContext<any>(AuthLogin);
    const [key,setKey] = useState('');
    const [emailUser,setEmailUser] = useState('');
    console.log(route,usuario);
    async function registrarAplicativo(app:string,keygen:string,versao:string,email:string){
        apresentaModal('load','close','',()=>(<View style={[Styles.em_linhaVertical,{marginBottom:20}]}><ActivityIndicator size={75}/><Text style={[Styles.ft_regular,{textAlign:'center',marginBottom:20}]}>{'Verificando chave de registro do aplicativo\n\nAguarde...'}</Text></View>),'light',()=>(null));
        
        const response = await axios({
            method:'get',
            url:Config.configuracoes.pastaProcessos,
            params:{
              comando:'verificarChave',
              id_app:app,
              key:keygen,
              versao_cliente:versao,
              email:email,
            },
        });
        console.log(response)
        if(response.data[0].status === 'OK'){
            if(response.data[0].codeMensagem !== 0){
              apresentaModal(
                  'success',
                  'shield-check',
                  'Sucesso',
                  ()=>(<View style={[Styles.em_linhaVertical]}><MaterialCommunityIcons name='shield-check' size={75} style={[getModalStyleLabel('success')]}/><Text style={[Styles.ft_regular,getModalStyleLabel('success'),{textAlign:'center',marginBottom:20,}]}>{response.data[0].statusMensagem+'\n\nDeseja prosseguir com o app?'}</Text></View>),
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
                  response.data[0].statusMensagem+'\n\nDeseja prosseguir com o app?'
              )
              //setLoad(false);
            }
            //
        }
    }

    try {
        return(
            <View style={[Styles.em_linhaVertical,{height,justifyContent:'flex-start'}]}>
                <View style={[Styles.em_linhaHorizontal,Styles.w100,{height:50,backgroundColor:'#FFFFFF',justifyContent:'flex-start'}]}>
                    <TouchableOpacity style={[Styles.w10,{marginHorizontal:0,marginLeft:10}]} onPress={()=>{navigation.goBack()}}>
                        <MaterialCommunityIcons name="chevron-left" size={25} color={'#000'}/>
                    </TouchableOpacity>
                    <Text style={[Styles.ft_black,{fontSize:20}]}>Registro de aplicativo</Text>
                </View>
                <MaterialCommunityIcons name="cellphone-key" size={70} color={'blue'}/>
                <Text style={[Styles.ft_extraBold,{fontSize:18,marginVertical:10}]}>Registro de aplicativo</Text>
                <View style={[Styles.em_linhaHorizontal,Styles.w95,Styles.input,{marginVertical:2.5}]}>
                    <MaterialCommunityIcons name="id-card" size={25} color={'#000'} style={[Styles.w10,{marginHorizontal:0}]}/>
                    <TextInput placeholder="Id do app" editable={false} defaultValue={(route.params.id_app).slice(0, 10) + (route.params.id_app).slice(10).replace(/./g, "*")} style={[Styles.w90,{marginHorizontal:0}]}/>
                </View>
                <View style={[Styles.em_linhaHorizontal,Styles.w95,Styles.input,{marginVertical:2.5}]}>
                    <MaterialCommunityIcons name="email" size={25} color={'#000'} style={[Styles.w10,{marginHorizontal:0}]}/>
                    <TextInput placeholder="Email" defaultValue={emailUser} style={[Styles.w90,{marginHorizontal:0}]} onChangeText={(text)=>{setEmailUser(text)}}/>
                </View>
                <View style={[Styles.em_linhaHorizontal,Styles.w95,Styles.input,{marginVertical:2.5,justifyContent:'space-between'}]}>
                    <MaterialCommunityIcons name="numeric" size={25} color={'#000'} style={[{marginHorizontal:0}]}/>
                    <TextInput placeholder="Chave de cadastro" keyboardType="number-pad" style={[{marginHorizontal:0,maxWidth:'82.5%',minWidth:'82.5%',width:'82.5%'}]} onChangeText={(text)=>{setKey(text)}}/>
                    <TouchableOpacity
                        style={[Styles.em_linhaHorizontal,Styles.btn,Styles.light,Styles.mr_5,{marginHorizontal:0,borderTopRightRadius:8,borderBottomRightRadius:8,marginVertical:0,paddingVertical:2,height:'100%'}]}
                        onPress={()=>{
                            apresentaModal(
                                'dialog',
                                'information-variant',
                                'Sobre a chave de registro',
                                ()=>(
                                    <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10,backgroundColor:'transparent'}]}>
                                        <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25,backgroundColor:'transparent'}]}>{'A empresa que registrou-se no site para ser parceiro recebeu uma chave de registro.\nPeça para que o administrador lhe forneça a chave de registro para continuar o registro como profissional.'}</Text>
                                    </View>
                                ),
                                'default',
                                ()=>{
                                    return(
                                        <>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.light,Styles.w100,Styles.btnDialog,Styles.btnDialogcentered]}
                                                onPress={()=>{
                                                    setLoad(false);
                                                    fecharModal('');
                                                    //navigation.goBack();
                                                }}
                                            >
                                                <Text style={[Styles.ft_medium,Styles.lbllight]}>OK</Text>
                                            </TouchableOpacity>
                                        </>
                                    )
                                }
                            );
                        }}
                    >
                        <MaterialCommunityIcons name="information" size={25} color={'#000'} style={[Styles.lbllight,{marginHorizontal:0}]}/>
                    </TouchableOpacity>
                </View>
                {
                    key !== '' &&

                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.primary]}
                        onPress={()=>{
                            registrarAplicativo(route.params.id_app,key,config.expo.version,emailUser);
                        }}
                    >
                        <MaterialCommunityIcons name="content-save" size={25} color={'#000'} style={[Styles.lblprimary,{marginHorizontal:0}]}/>
                        <Text style={[Styles.ft_regular,Styles.lblprimary]}>Registrar meu app</Text>
                    </TouchableOpacity>
                }
                
            </View>
        )
    } catch (error:any) {
        
    }
}