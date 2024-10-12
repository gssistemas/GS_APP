import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { View,Text, TouchableOpacity, Modal, StyleSheet, Image, Animated, Dimensions, ActivityIndicator, Alert, TouchableWithoutFeedback, ScrollView} from 'react-native';
import Config from '../../../../assets/Config/Config.json';
import config from '../../../../app.json';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
const {width,height} = Dimensions.get('window');
import { ThemedText } from '../../../Components/ThemedText';
import { ThemedView } from '../../../Components/ThemedView';
import { Styles } from '../../../../assets/Styles/Styles';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import AppLoading from '../../../../Components/Loader/AppLoading';

export default function HeaderLeftIndex({data}:any) {
    const navigation = useNavigation()
    const {theme} = useTheme()
    const {usuario,login,email,senha,options,logof,getModalStyle,osInicada,getModalStyleLabel,apresentaModal,fecharModal,getModalStyleLabelAlert,appIsValid,appValidationArray,} = useContext<any>(AuthLogin)
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const [isLoad,setIsLoad] = useState(false);
    //console.log('dados user=>',usuario);
    const openModal = () => {
        setModalVisible(true);
        Animated.timing(slideAnim, {
          toValue: 0, // Desliza para o centro
          duration: 300,
          useNativeDriver: true,
        }).start();
    };

    console.log('user',usuario);
    
    const closeModal = () => {
        Animated.timing(slideAnim, {
          toValue: -300, // Desliza para fora da tela à esquerda
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setModalVisible(false);
        });
    };

    useEffect(()=>{

    },[usuario]);

    if(usuario === null || !theme){
        //console.log('Liberado para renderizar?=>',dataLoaded);
        return (
            <View style={[Styles.em_linhaHorizontal]}>
                <ActivityIndicator size={18} color={'blue'} style={[Styles.mr_5]}/>
                <Text style={[Styles.ft_regular]}>Carregando...</Text>
            </View>
        )
    }else{
        try {
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => openModal()} style={[]}>
                        {usuario === null ? <Text style={[{color:'#000',fontSize:width / 16 }]}>Faça login</Text> : <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'center'}]}><Image source={{uri:usuario.imagem !== null ? Config.configuracoes.pathPadrao+'/'+usuario.imagem : 'https://gsapp.com.br/favicon.ico'}} style={[styles.avatar,{width:40,height:40,resizeMode:'stretch',marginRight:5}]}/><ThemedText type='title'>{usuario.apelido}</ThemedText></View>}
                    </TouchableOpacity>
            
                    <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => closeModal()}
                    >
                    <TouchableWithoutFeedback onPress={()=>closeModal()}>
                    <View style={styles.modalBackground}>
                        <Animated.View style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}>
                            <ThemedView style={styles.modalTitle}>
                                {usuario === null ? 
                                    <Text style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,getModalStyle('danger'),getModalStyleLabel('danger'),{color:'#000',textAlign:'center'}]}>Login incorreto!</Text> 
                                    : 
                                    <View style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                        <Image source={{uri:usuario !== null && usuario.imagem !== undefined ? Config.configuracoes.pathPadrao+'/'+usuario.imagem : 'https://gsapp.com.br/favicon.ico'}} style={[styles.avatar,Styles.mr_5,{width:45,height:45,resizeMode:'stretch'}]}/>
                                        {usuario === null ? <TouchableOpacity><ThemedText type='defaultSemiBold'>Faça login</ThemedText></TouchableOpacity> : <ThemedText type='defaultSemiBold' style={[{color:'#FFF',marginVertical:10}]}>{usuario.apelido+'\n'+usuario.nome}</ThemedText>}
                                    </View>
                                    }
                                {usuario === null ? <TouchableOpacity style={[Styles.btn,usuario === null ? getModalStyle('danger') : '',{marginTop:10,}]}
                                    onPress={()=>{
                                        Alert.alert('Sair','Tem certeza que deseja sair?',[
                                            {
                                                text:'não'
                                            },
                                            {
                                                text:'sim',
                                                onPress:()=>{
                                                    logof()
                                                }
                                            }
                                        ])
                                    }}
                                ><ThemedText style={[usuario === null ? getModalStyleLabel('danger') : '']}>Conta de usuário inválida</ThemedText></TouchableOpacity> : <ThemedText type='defaultSemiBold' style={[{color:'#FFF',marginVertical:0,paddingVertical:0}]}>{usuario.email}</ThemedText>}
                            </ThemedView>
                            <ScrollView style={[Styles.w100,{marginVertical:10,height:'50%'}]} showsVerticalScrollIndicator={false}>
                                {options.map((option:any,i:number) => {
                                    //console.log(option)
                                    return(
                                    <TouchableOpacity
                                    key={option.id}
                                    style={[styles.optionButton,{justifyContent:'space-between',alignItems:'center'}]}
                                    onPress={() => {
                                        option.action();
                                        closeModal();
                                    }}
                                    >
                                        <View style={[Styles.em_linhaHorizontal,]}>
                                            <MaterialCommunityIcons name={option.icone} size={25} color={'#CCCCCC'} style={[{marginRight:10,color:option.colorText}]}/>
                                            <Text style={[styles.optionText,{color:option.colorText}]}>{option.title}</Text>
                                        </View>
                                        {
                                            option.new === true &&

                                            <View style={[getModalStyle('danger'),{paddingHorizontal:5,paddingVertical:2.5,borderRadius:5,elevation:2}]}>
                                                <Text style={[getModalStyleLabel('danger')]}>Novo</Text>
                                            </View>
                                        }
                                        
                                    </TouchableOpacity>
                                )})}
                                <TouchableOpacity
                                    style={[Styles.em_linhaHorizontal,Styles.btn,Styles.danger,{justifyContent:'space-between',borderBottomWidth:0,marginVertical:0,marginHorizontal:0,paddingHorizontal:6,paddingVertical:5}]}
                                    onPress={()=>{
                                        apresentaModal(
                                            'dialog',
                                            'logout',
                                            'Sair',
                                            ()=>(<ThemedText type='defaultSemiBold' style={[Styles.w100,{textAlign:'left',fontSize:width / 26}]}>{'Ao sair você perderá os seguintes benefícios:\n\n1 - Dados de login(Terá que fazer login novamente).\n2 - Notificações(Voê não receberá notificações em seu aparelho).\n3 - Token de acesso(Seu token de acesso será apagado).\n\nTem certeza que deseja sair?'}</ThemedText>),
                                            'default',
                                            ()=>{
                                                return(
                                                    <>
                                                        <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w50,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                                                            onPress={()=>{
                                                                fecharModal('');
                                                            }}
                                                        >
                                                            <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Não</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w50,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                                            onPress={()=>{
                                                                logof();
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
                                    <Text style={[styles.optionText,Styles.lbldanger]}>{'Logoff'}</Text>
                                    <MaterialCommunityIcons name='logout-variant' size={25} style={[Styles.lbldanger]}/>
                                </TouchableOpacity>
                            </ScrollView>
                            <TouchableOpacity style={[{flexDirection:'column',position:'absolute',left:0,right:0,bottom:'0%',borderBottomRightRadius:9,paddingVertical:15,justifyContent:'center',backgroundColor:theme.backgroundColor.background}]}
                                onPress={()=>{
                                    navigation.navigate('info licence app');
                                    closeModal();
                                }}
                            >
                                <ThemedText type='title' style={[Styles.ft_bold,{textAlign:'center'}]}>{(config.expo.slug).replace('_',' ')}</ThemedText>
                                <ThemedText type='defaultSemiBold'  style={[{textAlign:'center'}]}>{'Versão:'+config.expo.version+' ('+Config.configuracoes.release+')'}</ThemedText>
                                <ThemedText style={[Styles.ft_regular,{textAlign:'center'}]}>Status da licença: {appIsValid === true ? 'Licenciado' : 'Licença expirada'}</ThemedText>
                                <ThemedText style={[Styles.ft_regular,{textAlign:'center'}]}>TODOS OS DIREITOS RESERVADOS.</ThemedText>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                    </TouchableWithoutFeedback>
                    <TouchableOpacity style={[styles.optionButton, styles.closeButton]}onPress={() => setModalVisible(false)}></TouchableOpacity>
                    </Modal>
                </View>
            );
        } catch (error:any) {
            Alert.alert('Erro de inicio','Corrija o erro na linha 113\n\n'+error.message)
        }
    }
}
/*


*/

const styles = StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContainer: {
      width: width - 60,
      marginLeft:0,
      padding: 5,
      backgroundColor: 'white',
      borderRadius: 10,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      alignItems: 'flex-start',
      height:'100%'
    },
    modalTitle: {
        flexDirection:'column',
        backgroundColor:'slateblue',
        alignItems:'flex-start',
        justifyContent:'flex-start',
        paddingHorizontal:15,
        width:'100%',
        paddingVertical:20,
        fontSize: 20,elevation:2,borderRadius:2
    },
    optionButton: {
        flexDirection:'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent:'flex-start'
    },
    optionText: {
      fontSize: 18,
    },
    closeButton: {
        position:'absolute',
        top:0,left:(width - 60),
        bottom:0,
        width:'auto',
        backgroundColor: 'transparent',
        borderRadius: 5,
    },
    avatar:{
        resizeMode:'stretch',
        width:45,
        height:45,
        borderRadius:50,
        borderTopLeftRadius:0
    }
});