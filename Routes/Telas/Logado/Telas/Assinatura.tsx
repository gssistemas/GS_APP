import { View, Text,ScrollView,Image,TouchableOpacity,Dimensions, ActivityIndicator, Alert,ToastAndroid} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import React, { Children, useContext, useEffect, useRef, useState } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Checkbox } from 'react-native-paper';
import { Canvas, Patch, Path, Skia, SkPath, useTouchHandler,SkiaDomView, rotate} from '@shopify/react-native-skia';
import * as MediaLibrary from 'expo-media-library';
//import * as ImagePicker from 'expo-image-picker';
//import * as Permissions from 'expo-permissions';
import { captureRef } from 'react-native-view-shot';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import axios from 'axios';
import Config from '../../../../assets/Config/Config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width,height} = Dimensions.get('window')

export default function Assinatura({route,navigation}:any) {
    const {listMinhasOs,removerOsListMinhasOs,setLoad,setCapturedImage,capturedImage,arlterarModal,getModalStyle,verificarConexao,IniciarOsOffline,buscarOs,buscarCoordenadas,uploadImages,IniciarOs,salvarVariaveis,usuario,OsIniciada,osInicada,imagensEmbalagem,getModalStyleLabel,imagensMontado,imagensAmbiente,dataLocal,horaLocal,adicionarImagemEmbalagem,adicionarImagemMontagem,removerImagemEmbalagem,apresentaModal,fecharModal} = useContext<any>(AuthLogin);
    const [checked,setIsChecked] = useState(osInicada !== null ? osInicada.status : false);
    const [checkedEmbalagem,setIsCheckedEmbalagem] = useState(false);
    const [checkedMontado,setIsCheckedMontado] = useState(false);
    const [checkedAmbiente,setIsCheckedAmbiente] = useState(false);
    const [assunatura,setAssinatura] = useState('');
    const canvasRef = useRef(null);
    const currentPath = useRef<SkPath|null>(null)
    const [paths,setPaths] = useState<SkPath[]>([])
    //console.log('Dados da os=>',osInicada.dadosOs.os);
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

    //-----------------------------------------------------começo das configurações de assinatura
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
                            //Alert.alert('Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens da embalagem"');
                            //setModalVisible(false);
                            //setMsg('');
                            break;
                        case 'imagensontagem[]':
                            //Alert.alert('Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do móvel montado"');
                            //setModalVisible(false);
                            //setMsg('');
                            break;
                        case 'imagensmbiente[]':
                            //Alert.alert('Erro','Impossível finalizar a O.S. sem imagens,\n\nVerifique se carregou as imagens do item: "Imagens do ambiente de montagem"');
                            //setModalVisible(false);
                            //setMsg('');
                        break;
                    }
                }
            };

            formData.append('comando',comando);
            formData.append('arquivoAss',{
                uri: imagens,
                name: `arquivoAss`,
                type: `image/jpg`,
            });
            formData.append('location',JSON.stringify())


            const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            
            if(response.data[0].status === 'OK' && response.data[0].statusCode ===200){
                console.log('retorno do envio da assinatura=>',response.data[0]);
                return {status:'sucesso',code:0,mensagem:'sucesso'};
            }else{
                return {status:'erro',code:101,mensagem:'Erro'};
            }
        } catch (error:any) {
            //console.log('Erro no response=>',error)
            return {status:'erro',code:104,mensagem:error.message};
        }
    }
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

    async function saveAssinaturaImage(){
        try {
            await AsyncStorage.setItem('imageAssinatura',assunatura);
            return { status: 'sucesso', code: 0, mensagem: 'salvo com sucesso!', retorno: 'Salvo com sucesso!' };
        } catch (error:any) {
            return { status: 'Erro', code: 137, mensagem: 'Erro', retorno: 'Erro:\n'+error.message };
        }
        
    }

    console.log(osInicada);

    async function iniciar(comando:any,imagens:any,ass:any){
        const vrfConn = await verificarConexao();
        if(vrfConn.code ===0){
            //tela:string,DadosOs:any,codigoStatusOs:number,os:number|string,acao?:Function|ReactElement|ReactNode|undefined,comando:string
            const coords_ = await buscarCoordenadas(null,null,null,null,null,null);

            if(coords_.code ===0){
                const retEnvioImg:any = await enviarImagensFinalizadas(comando,imagens,ass);
                arlterarModal(
                    'load',
                    'archive-check',
                    'Processando pedido...',
                    ()=>(
                        <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                            <ActivityIndicator size={75} color={'blue'}/>
                            <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Processando dados do usuário,\n\nAguarde...'}</Text>
                        </View>
                    ),
                    'default',
                    ()=>{null},
                    'Processando dados do usuário,\n\nAguarde...'
                )
                if(retEnvioImg.code === 0){
                    const retorno = await buscarCoordenadas('home os',osInicada.dadosOs,1200,osInicada.dadosOs.os,'inicio trabalho','inicio trabalho','finalizarOs');
                    if(retorno.code === 0){
                        console.log('retorno iniciar Os=>',retorno);
                        //comando:any,localizacao:any,profissional:any,dados:any,codigoStatus:any,os:any,tela:string,acao:Function|ReactElement|ReactNode|undefined|null
                        const iniOs = await IniciarOs('finalizarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,osInicada.dadosOs,1200,osInicada.dadosOs.os,'home os','');

                        if(iniOs.code === 0){
                            const sv = await salvarVariaveis('OsIniciada','OsIniciada','');

                            if(sv.code === 0){
                                //dadosOs:any,param_1:any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                                const OsIni = await OsIniciada('','','','home os');

                                if(OsIni.code ===0){
                                    console.log('os iniciada=>',OsIni);
                                    //comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                                    //setTimeout(() => {
                                        navigation.reset({
                                            index:0,
                                            routes:[
                                                {
                                                    name:'home os'
                                                }
                                            ]
                                        })
                                    //}, 3000);
                                    fecharModal('');
                                }else{
                                    console.log('Erro 177');
                                }
                            }else{
                                console.log('Erro 179')
                            }
                        }else{
                            console.log('Erro 181',iniOs.code+' - '+iniOs.mensagem);
                        }
                    }else{
                        console.log('Erro')
                    }
                }else{
                    console.log('Erro ',retEnvioImg.code+' - '+retEnvioImg.mensagem);
                }
            }else{
                console.log('Erro 187',coords_.code+' - '+coords_.mensagem);
            }
        }else{
            console.log('dados_os=>',osInicada.dadosOs);

            const retorno = await buscarCoordenadas('home os',osInicada.dadosOs,1200,osInicada.dadosOs.os,'inicio trabalho','inicio trabalho','finalizarOs');
            if(retorno.code === 0){
                const saveAssinatura = await saveAssinaturaImage();

                if(saveAssinatura.code ===0){
                    const iniOs = await IniciarOsOffline('finalizarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,osInicada.dadosOs,1200,osInicada.dadosOs.os,'home os','');

                    if(iniOs.code === 0){
                        const sv = await salvarVariaveis('OsIniciada','OsIniciada','');

                        if(sv.code === 0){
                            const OsIni = await OsIniciada('','','','home os');

                            if(OsIni.code ===0){
                                const removerOsLista = await removerOsListMinhasOs(osInicada.dadosOs.os);

                                if(removerOsLista.code ===0){
                                    //comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                                    //setTimeout(() => {
                                        navigation.reset({
                                            index:0,
                                            routes:[
                                                {
                                                    name:'home os'
                                                }
                                            ]
                                        })
                                    //}, 3000);
                                    fecharModal('');
                                    setLoad(false)
                                    ToastAndroid.showWithGravityAndOffset(
                                        saveAssinatura.retorno,
                                        ToastAndroid.LONG,
                                        ToastAndroid.BOTTOM,
                                        25,
                                        50,
                                    );
                                }else{
                                    fecharModal('');
                                    setLoad(false)
                                    ToastAndroid.showWithGravityAndOffset(
                                        'Erro ao remover a O.S. d lista!',
                                        ToastAndroid.LONG,
                                        ToastAndroid.BOTTOM,
                                        25,
                                        50,
                                    );
                                }
                            }else{
                                console.log('Erro 177');
                            }
                        }
                    }
                    
                }else{
                    ToastAndroid.showWithGravityAndOffset(
                        saveAssinatura.retorno,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                    );
                    fecharModal('');
                }
            }
        }
        //tela:string,DadosOs:any,codigoStatusOs:number,os:number|string,acao?:Function|ReactElement|ReactNode|undefined,comando:string
        
    }

    const saveCanvasAsImage = async () => {
        apresentaModal(
            'load',
            'download-multiple',
            'Iniciando...',
            ()=>(
                <View style={[Styles.w100,Styles.em_linhaVertical,{}]}>
                    <ActivityIndicator size={75} color={'blue'} animating={true}/>
                    <Text style={[Styles.ft_bold,Styles.lbllight,{textAlign:'center'}]}>{'Iniciando processo de finalização\n\nAguarde...'}</Text>
                </View>
            ),
            'default',
            ()=>{
                null
                /*return(
                    <>
                        <TouchableOpacity style={[Styles.btn,Styles.warning,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                            onPress={()=>{
                                fecharModal('');
                            }}
                        >
                            <Text style={[Styles.ft_regular,Styles.lblwarning]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogcentered,{}]}
                            onPress={()=>{
                                fecharModal('');
                            }}
                        >
                            <Text style={[Styles.ft_regular,Styles.lbldanger]}>Não</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogRight,{}]}
                            onPress={()=>{
                                //buscarCoordenadas()buscarCoordenadas('os iniciada',route.params.dadosOs.dadosOs,900);
                                buscarCoordenadas('os iniciada',route.params.dadosOs.dadosOs,600,route.params.dadosOs.dadosOs.os,()=>{navigation.navigate('os iniciada')},'iniciarOs')
                            }}
                        >
                            <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Sim</Text>
                        </TouchableOpacity>
                    </>
                )*/
            }
        );
        try {
            // Captura a visualização do Canvas como uma imagem
            const uri = await captureRef(canvasRef, { format: 'png', quality: 1 });
            console.log(uri);
            setAssinatura(uri);
            //tela:string,DadosOs:any,codigoStatusOs:number,os:number,acao?:Function|ReactElement|ReactNode,comando:string
            //await buscarCoordenadas('home os',osInicada.dadosOs,1200,osInicada.dadosOs.os,()=>{navigation.navigate('home os')},'finalizarOs')//uploadImages(osDados:any,dados:any,loc:string,prof:string)
            iniciar('verificarImagens',uri,null);
        } catch (error) {
            console.error('Erro ao salvar imagem do Canvas:', error);
        }
    };

    const rotateImage = async (imageUri: string|any) => {
        try {
            // Realiza a rotação da imagem utilizando expo-image-manipulator
            console.log('imagem=>',imageUri);
            
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
            console.log('Arquivo capiturado com sucesso!',uri);
            return uri;
            
        } catch (error) {
            console.log('2981=>',error);
        }
        
    };
//-----------------------------------------------------fim
    try {
        return (
            <View style={[{}]}>
                <View style={[{position:'absolute',left:'49%',width:'0.5%',right:'49%',height:height - 70,marginTop:'5%',zIndex:1,backgroundColor:'#000'}]}>

                </View>
                <Canvas
                    ref={canvasRef}
                    onTouch={onTouch}
                    style={[Styles.w100,{height:height,}]}
                >
                    {Children.toArray(
                        paths.map((path:any)=>(
                            <Path path={path} style={'stroke'} />
                        ))
                    )}
                    
                </Canvas>
                <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.danger,{position:'absolute',marginLeft:width / 2 - 17,bottom:30,transform: [{rotate: '90deg'}]}]}
                    onPress={()=>{setPaths([])}}
                >
                    <Text style={[Styles.ft_regular,Styles.lbldanger]}>Limpar</Text>
                </TouchableOpacity>
                <Text style={[Styles.ft_extraBold,Styles.lbldanger,{color:'#000',position:'absolute',marginLeft:width / 2 - 57,bottom: height / 2,transform: [{rotate: '90deg'}]}]}>Assine acima</Text>
                {
                    paths !== null && paths.length > 0 &&
                
                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.success,{position:'absolute',marginLeft:0,bottom:height / 2 - 20,transform: [{rotate: '90deg'}]}]}
                        onPress={()=>{saveCanvasAsImage()}}
                    >
                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Finalizar ordem de servico</Text>
                    </TouchableOpacity>
                }
            </View>
        ); 
    } catch (error) {
        console.log(error);
    }
    
}