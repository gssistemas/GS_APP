import { useContext, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View, Dimensions,Image} from 'react-native';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {RadioButton,Text} from 'react-native-paper';
import { Styles } from '../../../../assets/Styles/Styles';
import {useNavigation} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
const {width,height} = Dimensions.get('screen');

export default function ProblemaOs({route}:any) {
    const {theme} = useTheme()
    const navigation = useNavigation();
    const {usuario,osInicada,apresentaModal,buscarCoordenadas,adicionarImagemProblema,removerImagemProblema,totalMontagem,montanteLoja,IniciarOs,OsIniciada,fecharModal,salvarVariaveis,imagensProblema,getModalStyleLabel,montantePgmto} = useContext<any>(AuthLogin);
    const [value, setValue] = useState('');
    console.log(osInicada);

    async function iniciar(){
        const retorno = await buscarCoordenadas('os iniciada',osInicada.dadosOs,2000,osInicada.dadosOs.os,'inicio trabalho','inicio trabalho','iniciarOs');
            if(retorno.code === 0){
                const iniOs = await IniciarOs('iniciarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,osInicada.dadosOs,2000,osInicada.dadosOs.os,'os iniciada','');

                if(iniOs.code === 0){
                    const sv = await salvarVariaveis('OsIniciada','OsIniciada','');

                    if(sv.code === 0){
                        const OsIni = await OsIniciada('OsIniciada','OsIniciada','');

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
                        }
                    }else{
                        apresentaModal(
                            'error',
                            'error',
                            'Erro',
                            'Erro ao devolver a O.S. para central!',
                            'danger',
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
                                                //iniciar()
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
            }
        
    }
    try {
        return (
            <View style={[Styles.w100,{height:'100%',backgroundColor:theme.backgroundColor.background}]}>
                <ParallaxScrollView
                    headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                    headerImage={<MaterialCommunityIcons size={310} name="face-agent" style={[Styles.headerImage]} />
                }
                >
                    <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
                        <ThemedText type='title' style={[Styles.w100,{color:theme.labels.text}]}>Informações da O.S.</ThemedText>
                    </ThemedView>
                    <View style={[Styles.w95,Styles.em_linhaVertical,{justifyContent:'flex-start',marginTop:10,}]}>
                            <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{marginVertical:2.5}]}>
                                <ThemedText type='title' style={[Styles.w100,{textAlign:'center',elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:'#FAFAFA',color:theme.labels.text}]}>{'#PV:'+route.params.dadosOs.codigo+' - '+route.params.dadosOs.data_+' - '+route.params.dadosOs.os}</ThemedText>
                            </ThemedView>
                            <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',marginVertical:2.5}]}>
                                <ThemedView style={[Styles.w45,Styles.em_linhaVertical,{marginHorizontal:0,elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:'#FFF',paddingHorizontal:5}]}>
                                    <ThemedText type='defaultSemiBold' style={{color:theme.labels.text}}>Iniciar em:</ThemedText>
                                    <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>{route.params.dadosOs.data_ini}</ThemedText>
                                </ThemedView>
                                <ThemedView style={[Styles.w45,Styles.em_linhaVertical,{marginHorizontal:0,elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:'#FFF',paddingHorizontal:5}]}>
                                    <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>Finalizar até:</ThemedText>
                                    <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>{route.params.dadosOs.data_fim}</ThemedText>
                                </ThemedView>
                            </ThemedView>
                            
                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{marginVertical:2.5,alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,backgroundColor:'#FFF',paddingHorizontal:5}]}>
                                <ThemedText type='title' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.labels.text}]}>Solicitante:</ThemedText>
                                <ThemedText type='defaultSemiBold' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.labels.text}]}>{route.params.dadosOs.filial[0].codigo_loja+'-'+route.params.dadosOs.filial[0].nome}</ThemedText>
                            </ThemedView>
                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{marginVertical:2.5,alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,backgroundColor:'#FFF',paddingHorizontal:5}]}>
                                <ThemedText type='title' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.labels.text}]}>Cliente:</ThemedText>
                                <ThemedText type='defaultSemiBold' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.labels.text}]}>{route.params.dadosOs.title}</ThemedText>
                            </ThemedView>
                            {
                                route.params.dadosOs.endereco !== null && route.params.dadosOs.endereco.length !== 0 &&
                                <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{marginVertical:2.5,alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
                                    {
                                        route.params.dadosOs.endereco.map((end:any,i:number)=>{
                                            return(
                                                <View key={i} style={[Styles.em_linhaVertical,Styles.w95]}>
                                                    <TouchableOpacity style={[Styles.btn,Styles.w100,Styles.em_linhaHorizontal,Styles.primary]}
                                                        onPress={()=>{
                                                            try {
                                                                navigation.navigate('mapa',{endereco:end.rua+','+end.n+','+end.complemento+','+end.bairro+','+end.cidade+','+end.uf+','+end.cep+','+'Brasil'});
                                                            } catch (error:any) {
                                                                console.log('Erro',error.message);
                                                            }
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons name='map' size={25} style={[Styles.mr_5,getModalStyleLabel('success')]}/>
                                                        <Text style={[Styles.ft_medium,getModalStyleLabel('success')]}>Carregar mapa</Text>
                                                    </TouchableOpacity>
                                                    <ThemedView style={[Styles.w100,{backgroundColor:'transparent'}]}>
                                                        <ThemedText type='title' style={[Styles.lblwarning,{textAlign:'left',borderRadius:5,paddingVertical:5,}]}>Endereço:</ThemedText>
                                                        <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,{textAlign:'left',borderRadius:5,paddingVertical:5}]}>{end.cidade+'-'+end.uf+', '+end.rua+' N°'+end.n+'\n\nComplemento:'+end.complemento+'\n\nObs:'+end.obs}</ThemedText>
                                                    </ThemedView>
                                                </View>
                                            )
                                        })
                                    }
                                </ThemedView>
                            }
                            {
                                route.params.dadosOs.endereco === null || route.params.dadosOs.endereco.length === 0 &&
                                
                                <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{marginVertical:2.5,alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
                                    <ThemedText type='title' style={[Styles.lblwarning,{textAlign:'center',borderRadius:5,paddingVertical:5,}]}>Endereço:</ThemedText>
                                    <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,{textAlign:'left',borderRadius:5,paddingVertical:5}]}>{'Nenhum endereço encontrado para este cliente!'}</ThemedText>
                                </ThemedView>
                            }
                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{marginVertical:2.5,alignItems:'flex-start',justifyContent:'flex-start',marginVertical:0}]}>
                                <ThemedText type='title' style={[Styles.w100,{color:theme.labels.text}]}>Produtos</ThemedText>
                            
                            {
                                route.params.dadosOs.itens !== null &&
        
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {
                                        route.params.dadosOs.itens.map((its:any,i:number)=>{
                                            montanteLoja(route.params.dadosOs.filial[0].id,route.params.dadosOs.tipo_montagem);
                                            return(
                                                <ThemedView style={[Styles.em_linhaVertical]} key={i}>
                                                    <ThemedView style={[Styles.em_linhaVertical,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:'#FFF',paddingHorizontal:5,maxWidth:width - 100,marginHorizontal:2.5,marginVertical:10}]}>
                                                        <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#999'}]}>
                                                            <ThemedText type='normal' style={[{textAlign:'left',color:theme.labels.text}]}>{'Cód.:'}</ThemedText>
                                                            <ThemedText type='defaultSemiBold' style={[{textAlign:'left',color:theme.labels.text}]}>{its.codigo_item}</ThemedText>
                                                        </View>
                                                        <View style={[Styles.em_linhaVertical,Styles.w100,{width:'100%',alignItems:'flex-start',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#999'}]}>
                                                            <ThemedText type='normal' style={[Styles.w100,{textAlign:'left',color:theme.labels.text}]}>{'Descrição:'}</ThemedText>
                                                            <ThemedText type='defaultSemiBold' style={[Styles.w100,{minWidth:'100%',maxWidth:'100%',textAlign:'left',color:theme.labels.text}]}>{its.desc}</ThemedText>
                                                        </View>
                                                        <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',backgroundColor:theme.backgroundColor.background}]}>
                                                            <ThemedText type='normal' style={[{textAlign:'left',color:theme.labels.text}]}>{'Qtd.:'}</ThemedText>
                                                            <ThemedText type='defaultSemiBold' style={[{textAlign:'left',color:theme.labels.text}]}>{its.qtd+ ' Produto(s)'}</ThemedText>
                                                        </View>
                                                        
                                                        <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',borderTopWidth:2,borderTopColor:'#000',backgroundColor:theme.backgroundColor.background}]}>
                                                            <ThemedView style={[Styles.em_linhaVertical,{justifyContent:'flex-start',alignItems:'flex-start',backgroundColor:theme.backgroundColor.background}]}>
                                                                <ThemedText type='defaultSemiBold' style={[{textAlign:'left',color:theme.labels.text}]}>{'Vlr.item.:'}</ThemedText>
                                                                <ThemedText type='normal' style={[{textAlign:'left',color:theme.labels.text}]}>{'R$ '+(its.valor).toFixed(2).replace('.',',')}</ThemedText>
                                                            </ThemedView>
                                                            <ThemedView style={[Styles.em_linhaVertical,{justifyContent:'flex-start',alignItems:'flex-end',backgroundColor:theme.backgroundColor.background}]}>
                                                                <ThemedText type='defaultSemiBold' style={[{textAlign:'left',color:theme.labels.text}]}>{'Vlr. Montagem:'}</ThemedText>
                                                                <ThemedText type='normal' style={[{textAlign:'right',color:theme.labels.text}]}>{'R$: '+(its.valor * its.qtd * montantePgmto / 100).toFixed(2).replace('.',',')}</ThemedText>
                                                            </ThemedView>
                                                        </ThemedView>
                                                    </ThemedView>
                                                </ThemedView>
                                            )
                                        })
                                    }
                                </ScrollView>
                            }
                            </ThemedView>
                            {
                                totalMontagem > 0 &&
        
                                <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{marginVertical:2.5,alignItems:'center',justifyContent:'flex-start'}]}>
                                    <ThemedText type='title' style={[Styles.w100]}>Total da montagem R$: {totalMontagem === 0 ? 0.00 : totalMontagem}</ThemedText>
                                </ThemedView>
                            }
                            {
                                route.params.dadosOs.itens === null || route.params.dadosOs.itens.length === 0 &&
        
                                <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{marginVertical:2.5,margin:0,marginVertical:0,alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
                                    <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,{textAlign:'left',borderRadius:5,paddingVertical:5}]}>{'Nenhum produto encontrado para este cliente!'}</ThemedText>
                                </ThemedView>
                            }
                            {
                                route.params.voltar === undefined  &&
        
                                <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{marginVertical:2.5,alignItems:'center',justifyContent:'flex-start'}]}>
                                    <TouchableOpacity style={[Styles.btn,Styles.primary,Styles.em_linhaHorizontal,Styles.w100]}
                                        onPress={()=>{
                                            apresentaModal(
                                                'dialog',
                                                'help',
                                                'Iniciar trabalho',
                                                ()=>(<Text style={[Styles.w100,{textAlign:'center'}]}>{'Ao iniciar o trabalho você não poderá voltar até que finalize a mesma.\n\nDeseja iniciar a O.S.:'+route.params.dadosOs.os+'?'}</Text>),
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
                                                                    console.log(route.params.dadosOs)//
                                                                    iniciar()
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
                                        <ThemedText type='default' style={[Styles.lblprimary,Styles.ft_regular]}>Iniciar trabalho</ThemedText>
                                    </TouchableOpacity>
                                </ThemedView>
                            }
                    </View>
                    <View style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'flex-start',marginTop:10,borderWidth:1,borderColor:'#999',backgroundColor:'#FFF',elevation:2,borderRadius:10,paddingVertical:10,paddingHorizontal:5}]}>
                        <Text style={[Styles.ft_medium,{fontSize:16}]}>Selecione o problema encontrado.</Text>
                    </View>
                    <View style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'flex-start',marginTop:10,borderWidth:1,borderColor:'#999',backgroundColor:'#FFF',elevation:2,borderRadius:8}]}>
                        <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="0" /><Text style={[Styles.ft_regular]}>Montagem recusada - (Produto ja montado)</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="1" /><Text style={[Styles.ft_regular]}>Montador não atendido</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="2" /><Text style={[Styles.ft_regular]}>Cliente não se encontra</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="3" /><Text style={[Styles.ft_regular]}>Peça danificada - (Impossível montar)</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="4" /><Text style={[Styles.ft_regular]}>Endereço não encontrado</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="5" /><Text style={[Styles.ft_regular]}>Tonalidade de cor diferente</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="6" /><Text style={[Styles.ft_regular]}>Produto divergente</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="7" /><Text style={[Styles.ft_regular]}>Endereço insuficiente</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="8" /><Text style={[Styles.ft_regular]}>Ninguém para atender o profissional</Text>
                                
                            </View>
                            <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <RadioButton value="9" /><Text style={[Styles.ft_regular]}>Outro motivo...</Text>
                                
                            </View>
                        </RadioButton.Group>
                    </View>
                    <View style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'flex-start',marginTop:10,borderWidth:1,borderColor:'#999',backgroundColor:'#FFF',elevation:2,borderRadius:10,paddingVertical:10,paddingHorizontal:5}]}>
                        <Text style={[Styles.ft_medium,{fontSize:16}]}>Imagens do problema.</Text>
                    </View>
                
                    {
                        imagensProblema === null &&

                        <TouchableOpacity style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,Styles.primary,Styles.w95,{}]}
                            onPress={()=>{
                                adicionarImagemProblema()
                            }}
                        >
                            <MaterialCommunityIcons name='file-image-plus' size={25} style={[Styles.lblprimary]}/>
                            <Text style={[Styles.ft_regular,Styles.lblprimary]}>Adicionar imagem(ns)</Text>
                        </TouchableOpacity>
                    }

                    {
                        imagensProblema !== null &&
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w95,{marginTop:10,height:'auto',borderWidth:1,borderColor:'#999',backgroundColor:'#FFF',elevation:2,borderRadius:8}]}>
                            {
                                imagensProblema.map((img:any,i:number)=>{
                                    console.log(img)
                                    return(
                                        <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                            <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.danger,{position:'absolute',right:4,bottom:-6,paddingHorizontal:2,paddingVertical:2}]}
                                                onPress={()=>{
                                                    removerImagemProblema(i);
                                                }}
                                            >
                                                <MaterialCommunityIcons name='file-image-remove' size={18} style={[Styles.lbldanger]}/>
                                            </TouchableOpacity>
                                        </ThemedView>
                                    )
                                })
                            }
                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary,{}]}
                                onPress={()=>{
                                    adicionarImagemProblema()
                                }}
                            >
                                <MaterialCommunityIcons name='file-image-plus' size={75} style={[Styles.lblprimary,{width:80,height:80}]}/>
                            </TouchableOpacity>
                        </ScrollView>
                    }
                    <TextInput multiline={true} placeholder='Adicione uma descrição...' style={[Styles.input,Styles.w95,{}]}/>
                    <View style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'flex-start',marginTop:10,borderWidth:1,borderColor:'#999',backgroundColor:'#FFF',elevation:2,borderRadius:10,paddingVertical:10,paddingHorizontal:5}]}>
                        <TouchableOpacity style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,Styles.primary]}
                            onPress={()=>{
                                apresentaModal(
                                    'dialog',
                                    'archive-cancel',
                                    'Relatar problema',
                                    ()=>(<Text style={[Styles.w100,{textAlign:'center'}]}>{'Deseja devolver a O.S.:123456 para central?'}</Text>),
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
                                                        iniciar();
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
                            <Text style={[Styles.ft_regular,Styles.lblprimary]}>Devolver para loja</Text>
                        </TouchableOpacity>
                    </View>
                </ParallaxScrollView>
            </View>
        );
    } catch (error) {
        console.log(error);
    }
    
}