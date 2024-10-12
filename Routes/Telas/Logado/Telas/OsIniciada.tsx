import { View, Text,TouchableOpacity,ScrollView,Image} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import { useContext, useEffect, useState } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Checkbox } from 'react-native-paper';
import { useTheme } from '../../../../assets/Styles/ThemeContext';

export default function OsIniciada({route,navigation}:any) {
    const {theme} = useTheme();
    const {buscarOs,osInicada,imagensEmbalagem,imagensMontado,imagensAmbiente,carregarTodasImagens,limparImagens} = useContext<any>(AuthLogin);
    const [checked,setIsChecked] = useState(osInicada !== null ? osInicada.status : false);
    const [checkedEmbalagem,setIsCheckedEmbalagem] = useState(false);
    const [checkedMontado,setIsCheckedMontado] = useState(false);
    const [checkedAmbiente,setIsCheckedAmbiente] = useState(false);

    //imagensEmbalagem !== null && console.log('imagens caixa=>',imagensEmbalagem[0].location)
    //imagensMontado !== null && console.log('imagens montado=>',imagensMontado[0].location)
    //imagensAmbiente !== null && console.log('imagens ambiente=>',imagensAmbiente[0].location);
    useEffect(()=>{
        carregarTodasImagens();
        const lista = async ()=> await buscarOs('buscarOs',route.params.params.NumOs);
    },[]);

    try {
        return (
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<MaterialCommunityIcons size={310} name="archive-cog" style={Styles.headerImage} />
            }
            >
                <ThemedView style={[{}]}>
                    <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>Selecione as etapas conforme realizadas</ThemedText>
                    <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                        <Checkbox
                            status={checked === true ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setIsChecked(!checked);
                            }}
                            disabled={checked === true ? true : false}
                            color={theme.labels.text}
                            uncheckedColor={theme.labels.text}
                        />
                        <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>O.S. iniciada</Text>
                    </ThemedView>

                    <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                        <Checkbox
                            status={imagensEmbalagem !== null ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if(checkedEmbalagem === false ){
                                    navigation.navigate('embalagem');
                                }else{

                                }
                            }}
                            disabled={imagensEmbalagem !== null ? true : false}
                            color={theme.labels.text}
                            uncheckedColor={theme.labels.text}
                        />
                        <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Tire ao menos uma foto da embalagem</Text>
                    </ThemedView>
                    {
                        imagensEmbalagem !== null &&

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                            {
                                imagensEmbalagem.map((img:any,i:number)=>{
                                    return(
                                        <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                            <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                        </ThemedView>
                                    )
                                })
                            }
                        </ScrollView>
                    }
                    <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                        <Checkbox
                            status={imagensMontado !== null ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if(checkedMontado === false ){
                                    navigation.navigate('montado');
                                }else{
                                    
                                }
                            }}
                            disabled={imagensEmbalagem === null ? true : imagensMontado !== null ? true : false}
                            color={theme.labels.text}
                            uncheckedColor={theme.labels.text}
                        />
                        <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Tire ao menos uma foto do produto montado</Text>
                    </ThemedView>
                    {
                        imagensMontado !== null &&

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                            {
                                imagensMontado.map((img:any,i:number)=>{
                                    return(
                                        <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                            <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                        </ThemedView>
                                    )
                                })
                            }
                        </ScrollView>
                    }
                    <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                        <Checkbox
                            status={imagensAmbiente !== null ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if(checkedAmbiente === false ){
                                    navigation.navigate('ambiente');
                                }else{
                                    
                                }
                            }}
                            disabled={imagensMontado === null ? true : imagensAmbiente !== null ? true : false}
                        />
                        <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Tire ao menos uma foto do embiente de montagem</Text>
                    </ThemedView>
                    {
                        imagensAmbiente !== null &&

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                            {
                                imagensAmbiente.map((img:any,i:number)=>{
                                    return(
                                        <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                            <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                        </ThemedView>
                                    )
                                })
                            }
                        </ScrollView>
                    }
                    {
                        imagensEmbalagem !== null && imagensMontado !== null && imagensAmbiente !== null &&

                        <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w50,Styles.btn,Styles.danger,{marginHorizontal:0}]}
                                onPress={()=>{
                                    limparImagens();//buscarCoordenadas('os iniciada',osInicada,1100,osInicada.dadosOs.dadosOs.os,()=>{navigation.navigate('os iniciada')});
                                }}
                            >
                                <MaterialCommunityIcons name='close' size={25} style={[Styles.lbldanger,Styles.mr_5]}/>
                                <Text style={[Styles.ft_regular,Styles.lbldanger]}>Limpar imagens</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w50,Styles.btn,Styles.success,{marginHorizontal:0}]}
                                onPress={()=>{
                                    navigation.navigate('assinatura');//buscarCoordenadas('os iniciada',osInicada,1100,osInicada.dadosOs.dadosOs.os,()=>{navigation.navigate('os iniciada')});
                                }}
                            >
                                <MaterialCommunityIcons name='content-save' size={25} style={[Styles.lblsuccess,Styles.mr_5]}/>
                                <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Finalizar trabalho</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ThemedView>
            </ParallaxScrollView>
        );
    } catch (error) {
        console.log('Error=>',error)
    }
    
}