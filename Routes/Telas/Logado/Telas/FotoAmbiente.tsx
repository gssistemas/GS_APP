import { View, Text,ScrollView,TouchableOpacity,Image} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import { useContext, useEffect, useState } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Checkbox } from 'react-native-paper';

export default function FotoAmbiente({route,navigation}:any) {
    const {buscarOs,usuario,IniciarOs,salvarVariaveis,OsIniciada,buscarCoordenadas,osInicada,imagensEmbalagem,imagensMontado,imagensAmbiente,dataLocal,horaLocal,adicionarImagemEmbalagem,adicionarImagemMontagem,removerImagemEmbalagem,adicionarImagemAmbiente,removerImagemAmbiente,apresentaModal,fecharModal} = useContext<any>(AuthLogin);
    const [checked,setIsChecked] = useState(osInicada.status);
    const [checkedEmbalagem,setIsCheckedEmbalagem] = useState(false);
    const [checkedMontado,setIsCheckedMontado] = useState(false);
    const [checkedAmbiente,setIsCheckedAmbiente] = useState(false);
    //console.log(route.params,'status da os',osInicada);
    useEffect(()=>{
        const lista = async ()=> await buscarOs('buscarOs',route.params.params.NumOs);
    },[]);

    async function iniciar(){
        if(usuario !== null){
            //tela:string,DadosOs:any,codigoStatusOs:number,os:number|string,acao?:Function|ReactElement|ReactNode|undefined,comando:string
            const retorno = await buscarCoordenadas('os iniciada',osInicada.dadosOs,1100,osInicada.dadosOs.os,'inicio trabalho','inicio trabalho','iniciarOs');
            if(retorno.code === 0){
                console.log('retorno iniciar Os=>',retorno);
                //comando:any,localizacao:any,profissional:any,dados:any,codigoStatus:any,os:any,tela:string,acao:Function|ReactElement|ReactNode|undefined|null
                const iniOs = await IniciarOs('iniciarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,osInicada.dadosOs,1100,osInicada.dadosOs.os,'os iniciada','');

                if(iniOs.code === 0){
                    const sv = await salvarVariaveis('OsIniciada','OsIniciada',JSON.stringify({status:true,dadosOs:osInicada.dadosOs,tela:'os iniciada'}));

                    if(sv.code === 0){
                        //dadosOs:any,param_1:any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                        const OsIni = await OsIniciada(JSON.stringify({status:true,dadosOs:osInicada.dadosOs,tela:'iniciar os'}),'','','os iniciada');

                        if(OsIni.code ===0){
                            console.log('os iniciada=>',OsIni);
                            //comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                            //setTimeout(() => {
                                navigation.reset({
                                    index:0,
                                    routes:[
                                        {
                                            name:'os iniciada'
                                        }
                                    ]
                                })
                            //}, 3000);
                            fecharModal('');
                        }
                    }
                }
            }
        }else{
            apresentaModal(
                'dialog',
                'help',
                'Iniciar trabalho',
                'Você deve fazer login para contuinuar a O.S.\n\nDeseja fazer isso agora?',
                'default',
                ()=>{
                    return(
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
                                    fecharModal('');
                                    navigation.navigate('login');
                                }}
                            >
                                <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Sim</Text>
                            </TouchableOpacity>
                        </>
                    )
                }
            );
        }
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<MaterialCommunityIcons size={310} name="archive-cog" style={Styles.headerImage} />
        }
        >
            <ThemedView>
                <ThemedText type='defaultSemiBold' style={[{marginVertical:10,borderBottomWidth:1,borderBottomColor:'#999999',paddingVertical:5,}]}>Tire fotos do ambiente de montagem</ThemedText>
                    {
                        imagensAmbiente !== null &&

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                            {
                                imagensAmbiente.map((img:any,i:number)=>{
                                    //console.log(img);
                                    return(
                                        <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                            <Image source={{uri:img.url}} style={[{width:300,height:250,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.danger,{position:'absolute',bottom:5,right:5,marginVertical:0,marginHorizontal:0,paddingHorizontal:2,paddingVertical:2}]}
                                                onPress={()=>{
                                                    apresentaModal(
                                                        'dialog',
                                                        'help',
                                                        'Remover imagem',
                                                        ()=>(
                                                            <ThemedText type='defaultSemiBold' style={[{textAlign:'center'}]}>{'Esta ação não pode ser desfeita\n\nTem certeza que deseja excluir a imagem?'}</ThemedText>
                                                        ),
                                                        'warning',
                                                        ()=>(
                                                            <>
                                                                <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w50,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                                                                    onPress={()=>{
                                                                        fecharModal('');
                                                                    }}
                                                                >
                                                                    <Text style={[Styles.ft_regular,Styles.lbldanger]}>Não</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w50,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                                                    onPress={()=>{
                                                                        removerImagemAmbiente(i);
                                                                    }}
                                                                >
                                                                    <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Sim</Text>
                                                                </TouchableOpacity>
                                                            </>
                                                        )
                                                    )
                                                    //idModal:string,iconeM:string,titleM:string,conteudoM:string|ReactNode|ReactElement|Function,styleM:StyleSheet|string,actionsM:Function
                                                    //removerImagemEmbalagem(i);
                                                }}
                                            >
                                                <MaterialCommunityIcons name='image-remove' size={25} style={[Styles.lbldanger]}/>
                                            </TouchableOpacity>
                                        </ThemedView>
                                    )
                                })
                            }
                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary,{marginVertical:10,marginHorizontal:5,width:250,height:255}]}
                                onPress={()=>{
                                    adicionarImagemAmbiente(osInicada);
                                }}
                            >
                                <MaterialCommunityIcons name='image-plus' size={170} style={[Styles.lblprimary]}/>
                            </TouchableOpacity>
                        </ScrollView>
                    }
                    {
                        imagensAmbiente === null &&

                        <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary]}
                            onPress={()=>{
                                adicionarImagemAmbiente(osInicada);
                            }}
                        >
                            <MaterialCommunityIcons name='image-plus' size={25} style={[Styles.lblprimary]}/>
                            <Text style={[Styles.ft_regular,Styles.lblprimary]}>Adicionar Imagens</Text>
                        </TouchableOpacity>
                    }
                    

                </ThemedView>
                {
                    imagensAmbiente !== null &&

                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.success,]}
                        onPress={()=>{
                            navigation.goBack();//buscarCoordenadas('os iniciada',osInicada,1100,osInicada.dadosOs.dadosOs.os,()=>{navigation.navigate('os iniciada')});
                        }}
                    >
                        <MaterialCommunityIcons name='content-save' size={25} style={[Styles.lblsuccess,Styles.mr_5]}/>
                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Concluir</Text>
                    </TouchableOpacity>
                }
        </ParallaxScrollView>
    );
}