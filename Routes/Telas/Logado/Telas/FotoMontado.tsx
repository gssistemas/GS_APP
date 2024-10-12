import { View, Text,ScrollView,Image,TouchableOpacity} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import { useContext, useEffect, useState } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Checkbox } from 'react-native-paper';

export default function FotoMontado({route,navigation}:any) {
    const {buscarOs,buscarCoordenadas,setLoad,osInicada,imagensEmbalagem,imagensMontado,imagensAmbiente,dataLocal,horaLocal,adicionarImagemEmbalagem,adicionarImagemMontagem,removerImagemEmbalagem,apresentaModal,fecharModal} = useContext<any>(AuthLogin);
    const [checked,setIsChecked] = useState(osInicada.status);
    const [checkedEmbalagem,setIsCheckedEmbalagem] = useState(false);
    const [checkedMontado,setIsCheckedMontado] = useState(false);
    const [checkedAmbiente,setIsCheckedAmbiente] = useState(false);
    //console.log('status da os do arquivo FotoEmbalagem=>',osInicada.dadosOs.dadosOs.os);
    useEffect(()=>{
        const lista = async ()=> await buscarOs('buscarOs',route.params.params.NumOs);
    },[]);

    async function iniciar(numOs:number){
        const ret = await adicionarImagemMontagem(numOs);

        if(ret.code ===0){
            fecharModal('');
            setLoad(false);
        }else{
            
        }
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<MaterialCommunityIcons size={310} name="archive-cog" style={Styles.headerImage} />
        }
        >
            <ThemedView>
                <ThemedText type='defaultSemiBold' style={[{marginVertical:10,borderBottomWidth:1,borderBottomColor:'#999999',paddingVertical:5,}]}>Tire as imagens do produto montado</ThemedText>
                    {
                        imagensMontado !== null &&

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                            {
                                imagensMontado.map((img:any,i:number)=>{
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
                                                                        removerImagemEmbalagem(i);
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
                                    iniciar(osInicada);
                                }}
                            >
                                <MaterialCommunityIcons name='image-plus' size={170} style={[Styles.lblprimary]}/>
                            </TouchableOpacity>
                        </ScrollView>
                    }
                    {
                        imagensMontado === null &&

                        <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary]}
                            onPress={()=>{
                                iniciar(osInicada);
                            }}
                        >
                            <MaterialCommunityIcons name='image-plus' size={25} style={[Styles.lblprimary]}/>
                            <Text style={[Styles.ft_regular,Styles.lblprimary]}>Adicionar Imagens</Text>
                        </TouchableOpacity>
                    }
                    

                </ThemedView>
                {
                    imagensMontado !== null &&

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