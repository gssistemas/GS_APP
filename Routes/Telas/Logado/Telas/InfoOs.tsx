import { ScrollView, View, Text,Dimensions, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import { useContext, useState } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { useTheme } from '../../../../assets/Styles/ThemeContext';

const {width,height} = Dimensions.get('screen');

export default function InfoOs({route,navigation}:any) {
    const {theme} = useTheme();
    const {apresentaModal,osInicada,verificarConexao,fecharModal,isConnectedNetwork,montanteLoja,IniciarOsOffline,getModalStyle,arlterarModal,montantePgmto,buscarCoordenadas,getModalStyleLabel,usuario,IniciarOs,OsIniciada,executarAcao,salvarVariaveis} = useContext<any>(AuthLogin);
    const [totalMontagem,setTotalMontagem] = useState(0);
    console.log(route.params,isConnectedNetwork,navigation);

    function calcularMontagem(qtd:number,valor:any,porcentagem:number){
        let total = valor * qtd * porcentagem / 100;
        let result = (totalMontagem + total);

        setTotalMontagem(result);
    }

    async function iniciar(){
        //tela:string,DadosOs:any,codigoStatusOs:number,os:number|string,acao?:Function|ReactElement|ReactNode|undefined,comando:string
        const vrfConn = await verificarConexao();
        if(vrfConn.code ===0){
            const retorno = await buscarCoordenadas('iniciar os',route.params.dadosOs,600,route.params.dadosOs.os,'inicio trabalho','inicio trabalho','iniciarOs');
            if(retorno.code === 0){
                //console.log('retorno iniciar Os=>',retorno);
                //comando:any,localizacao:any,profissional:any,dados:any,codigoStatus:any,os:any,tela:string,acao:Function|ReactElement|ReactNode|undefined|null
                const iniOs = await IniciarOs('iniciarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,route.params.dadosOs,600,route.params.dadosOs.os,'iniciar os','');

                if(iniOs.code === 0){
                    const sv = await salvarVariaveis('OsIniciada','OsIniciada',JSON.stringify({status:true,dadosOs:route.params.dadosOs,tela:'iniciar os'}));

                    if(sv.code === 0){
                        //dadosOs:any,param_1:any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                        const OsIni = await OsIniciada(JSON.stringify({status:true,dadosOs:route.params.dadosOs,tela:'iniciar os'}),'','','iniciar os');

                        if(OsIni.code ===0){
                            console.log('os iniciada=>',OsIni);
                            //comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                            //setTimeout(() => {
                                navigation.reset({
                                    index:0,
                                    routes:[
                                        {
                                            name:'iniciar os'
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
            const retorno = await buscarCoordenadas('iniciar os',route.params.dadosOs,600,route.params.dadosOs.os,'inicio trabalho','inicio trabalho','iniciarOs');
            if(retorno.code === 0){
                const iniOs = await IniciarOsOffline('iniciarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,route.params.dadosOs,600,route.params.dadosOs.os,'iniciar os','');

                if(iniOs.code === 0){
                    const sv = await salvarVariaveis('OsIniciada','OsIniciada',JSON.stringify({status:true,dadosOs:route.params.dadosOs,tela:'iniciar os'}));

                    if(sv.code === 0){
                        const OsIni = await OsIniciada(JSON.stringify({status:true,dadosOs:route.params.dadosOs,tela:'iniciar os'}),'','','iniciar os');

                        if(OsIni.code ===0){
                            console.log('os iniciada=>',OsIni);
                            //comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                            //setTimeout(() => {
                                navigation.reset({
                                    index:0,
                                    routes:[
                                        {
                                            name:'iniciar os'
                                        }
                                    ]
                                })
                            //}, 3000);
                            fecharModal('');
                        }
                    }
                }
            }
        }
    }
    try {
        if(osInicada !== null && usuario !== null){
            if(route.params.voltar === undefined && route.params.voltar !== true){
                navigation.navigate(osInicada.tela);
            }else{
                return (
                    <ParallaxScrollView
                        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                        headerImage={<MaterialCommunityIcons size={310} name="archive-alert" style={[Styles.headerImage]} />
                    }
                    >
                        {
                            isConnectedNetwork === false && route.params.dadosOs.status === 1200 &&

                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,isConnectedNetwork === false && route.params.dadosOs.status === 1200 && getModalStyle('warning'),{alignItems:'center',justifyContent:'flex-start'}]}>
                                <ThemedText style={[getModalStyleLabel('warning')]}>Aguardando envio da O.S.</ThemedText>
                            </ThemedView>
                        }
                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
                            <ThemedText type='title' style={[Styles.w100,{color:theme.labels.text}]}>Informações da O.S.</ThemedText>
                        </ThemedView>
                        <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100]}>
                            <ThemedText type='title' style={[Styles.w100,{textAlign:'center',elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:'#FAFAFA',color:theme.labels.text}]}>{'#PV:'+route.params.dadosOs.codigo+' - '+route.params.dadosOs.data_+' - '+route.params.dadosOs.os}</ThemedText>
                        </ThemedView>
                        <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between'}]}>
                            <ThemedView style={[Styles.w45,Styles.em_linhaVertical,{marginHorizontal:0,elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:'#FFF',paddingHorizontal:5}]}>
                                <ThemedText type='defaultSemiBold' style={{color:theme.labels.text}}>Iniciar em:</ThemedText>
                                <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>{route.params.dadosOs.data_ini}</ThemedText>
                            </ThemedView>
                            <ThemedView style={[Styles.w45,Styles.em_linhaVertical,{marginHorizontal:0,elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:'#FFF',paddingHorizontal:5}]}>
                                <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>Finalizar até:</ThemedText>
                                <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>{route.params.dadosOs.data_fim}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                        
                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,backgroundColor:'#FFF',paddingHorizontal:5}]}>
                            <ThemedText type='title' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.labels.text}]}>Solicitante:</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.labels.text}]}>{route.params.dadosOs.filial[0].codigo_loja+'-'+route.params.dadosOs.filial[0].nome}</ThemedText>
                        </ThemedView>
                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,backgroundColor:'#FFF',paddingHorizontal:5}]}>
                            <ThemedText type='title' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.labels.text}]}>Cliente:</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.labels.text}]}>{route.params.dadosOs.title}</ThemedText>
                        </ThemedView>
                        {
                            route.params.dadosOs.endereco !== null && route.params.dadosOs.endereco.length !== 0 &&
                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
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
                            
                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
                                <ThemedText type='title' style={[Styles.lblwarning,{textAlign:'center',borderRadius:5,paddingVertical:5,}]}>Endereço:</ThemedText>
                                <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,{textAlign:'left',borderRadius:5,paddingVertical:5}]}>{'Nenhum endereço encontrado para este cliente!'}</ThemedText>
                                <TouchableOpacity style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,Styles.info]}>
                                    <Text style={[Styles.lblinfo]}>Notificar a loja</Text>
                                </TouchableOpacity>
                            </ThemedView>
                        }
                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'flex-start',justifyContent:'flex-start',marginVertical:0}]}>
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
    
                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
                                <ThemedText type='title' style={[Styles.w100]}>Total da montagem R$: {totalMontagem === 0 ? 0.00 : totalMontagem}</ThemedText>
                            </ThemedView>
                        }
                        {
                            route.params.dadosOs.itens === null || route.params.dadosOs.itens.length === 0 &&
    
                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{margin:0,marginVertical:0,alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
                                <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,{textAlign:'left',borderRadius:5,paddingVertical:5}]}>{'Nenhum produto encontrado para este cliente!'}</ThemedText>
                            </ThemedView>
                        }
                        {
                            route.params.voltar === undefined  &&
    
                            <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
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
                    </ParallaxScrollView>
                );
            }
        }else{
            return (
                <ParallaxScrollView
                    headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                    headerImage={<MaterialCommunityIcons size={310} name="archive-alert" style={[Styles.headerImage]} />
                }
                >
                    {
                        isConnectedNetwork === false && route.params.dadosOs.status === 1200 &&

                        <ThemedView style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,isConnectedNetwork === false && route.params.dadosOs.status === 1200 && getModalStyle('warning'),{alignItems:'center',justifyContent:'center'}]}>
                            <MaterialCommunityIcons size={25} name='alert-box' style={[getModalStyleLabel('warning'),Styles.mr_5]}/>
                            <ThemedText type='default' style={[getModalStyleLabel('warning')]}>Aguardando envio da O.S. offline</ThemedText>
                        </ThemedView>
                    }
                    <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
                        <ThemedText type='title' style={[Styles.w100,{color:theme.labels.text}]}>Informações da O.S.</ThemedText>
                    </ThemedView>
                    <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{backgroundColor:theme.labels.text,borderRadius:5}]}>
                        <ThemedText type='title' style={[Styles.w100,{textAlign:'center',elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:theme.labels.text,color:theme.backgroundColor.background,fontSize:width / 17}]}>{'#PV:'+route.params.dadosOs.codigo+' - '+route.params.dadosOs.data_+' - '+route.params.dadosOs.os}</ThemedText>
                    </ThemedView>
                    <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between'}]}>
                        <ThemedView style={[Styles.w45,Styles.em_linhaVertical,{marginHorizontal:0,elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:theme.labels.text,paddingHorizontal:5}]}>
                            <ThemedText type='defaultSemiBold' style={{color:theme.backgroundColor.background}}>Iniciar em:</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>{route.params.dadosOs.data_ini}</ThemedText>
                        </ThemedView>
                        <ThemedView style={[Styles.w45,Styles.em_linhaVertical,{marginHorizontal:0,elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:theme.labels.text,paddingHorizontal:5}]}>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>Finalizar até:</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>{route.params.dadosOs.data_fim}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                    
                    <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,backgroundColor:theme.labels.text,paddingHorizontal:5}]}>
                        <ThemedText type='title' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.backgroundColor.background}]}>Solicitante:</ThemedText>
                        <ThemedText type='defaultSemiBold' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.backgroundColor.background}]}>{route.params.dadosOs.filial[0].codigo_loja+'-'+route.params.dadosOs.filial[0].nome}</ThemedText>
                    </ThemedView>
                    <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,backgroundColor:theme.labels.text,paddingHorizontal:5}]}>
                        <ThemedText type='title' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.backgroundColor.background}]}>Cliente:</ThemedText>
                        <ThemedText type='defaultSemiBold' style={[{textAlign:'center',borderRadius:5,paddingVertical:5,color:theme.backgroundColor.background}]}>{route.params.dadosOs.title}</ThemedText>
                    </ThemedView>
                    {
                        route.params.dadosOs.endereco !== null && route.params.dadosOs.endereco.length !== 0 &&
                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
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
                        
                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
                            <ThemedText type='title' style={[Styles.lblwarning,{textAlign:'center',borderRadius:5,paddingVertical:5,}]}>Endereço:</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,{textAlign:'left',borderRadius:5,paddingVertical:5}]}>{'Nenhum endereço encontrado para este cliente!'}</ThemedText>
                            <TouchableOpacity style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,Styles.info]}
                                onPress={()=>{
                                    navigation.navigate('notificar loja',route.params.dadosOs);
                                }}
                            >
                                <Text style={[Styles.lblinfo,Styles.lblinfo]}>Notificar a loja</Text>
                            </TouchableOpacity>
                        </ThemedView>
                    }
                    <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'flex-start',justifyContent:'flex-start',marginVertical:0}]}>
                        <ThemedText type='title' style={[Styles.w100,{color:theme.labels.text}]}>Produtos</ThemedText>
                    
                    {
                        route.params.dadosOs.itens !== null &&

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {
                                route.params.dadosOs.itens.map((its:any,i:number)=>{
                                    montanteLoja(route.params.dadosOs.filial[0].id,route.params.dadosOs.tipo_montagem);
                                    return(
                                        <ThemedView style={[Styles.em_linhaVertical]} key={i}>
                                            <ThemedView style={[Styles.em_linhaVertical,{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingVertical:10,backgroundColor:theme.buttons.info,paddingHorizontal:5,maxWidth:width - 100,marginHorizontal:2.5,marginVertical:10}]}>
                                                <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#999'}]}>
                                                    <ThemedText type='normal' style={[{textAlign:'left',color:theme.labels.text}]}>{'Cód.:'}</ThemedText>
                                                    <ThemedText type='defaultSemiBold' style={[{textAlign:'left',color:theme.labels.text}]}>{its.codigo_item}</ThemedText>
                                                </View>
                                                <View style={[Styles.em_linhaVertical,Styles.w100,{width:'100%',alignItems:'flex-start',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#999'}]}>
                                                    <ThemedText type='normal' style={[Styles.w100,{textAlign:'left',color:theme.labels.text}]}>{'Descrição:'}</ThemedText>
                                                    <ThemedText type='defaultSemiBold' style={[Styles.w100,{minWidth:'100%',maxWidth:'100%',textAlign:'left',color:theme.labels.text}]}>{its.desc}</ThemedText>
                                                </View>
                                                <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between'}]}>
                                                    <ThemedText type='normal' style={[{textAlign:'left',color:theme.labels.text}]}>{'Qtd.:'}</ThemedText>
                                                    <ThemedText type='defaultSemiBold' style={[{textAlign:'left',color:theme.labels.text}]}>{its.qtd+ ' Produto(s)'}</ThemedText>
                                                </View>
                                                
                                                <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',borderTopWidth:2,borderTopColor:'#000',backgroundColor:theme.buttons.info}]}>
                                                    <ThemedView style={[Styles.em_linhaVertical,{justifyContent:'flex-start',alignItems:'flex-start',backgroundColor:theme.buttons.info}]}>
                                                        <ThemedText type='defaultSemiBold' style={[{textAlign:'left',color:theme.labels.text}]}>{'Vlr.item.:'}</ThemedText>
                                                        <ThemedText type='normal' style={[{textAlign:'left',color:theme.labels.text}]}>{'R$ '+(its.valor).toFixed(2).replace('.',',')}</ThemedText>
                                                    </ThemedView>
                                                    <ThemedView style={[Styles.em_linhaVertical,{justifyContent:'flex-start',alignItems:'flex-end',backgroundColor:theme.buttons.info}]}>
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

                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
                            <ThemedText type='title' style={[Styles.w100]}>Total da montagem R$: {totalMontagem === 0 ? 0.00 : totalMontagem}</ThemedText>
                        </ThemedView>
                    }
                    {
                        route.params.dadosOs.itens === null || route.params.dadosOs.itens.length === 0 &&

                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,Styles.warning,{margin:0,marginVertical:0,alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingHorizontal:5}]}>
                            <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,{textAlign:'left',borderRadius:5,paddingVertical:5}]}>{'Nenhum produto encontrado para este cliente!'}</ThemedText>
                        </ThemedView>
                    }
                    {
                        route.params.voltar === undefined  &&

                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
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
                </ParallaxScrollView>
            );
        }
    } catch (error) {
        console.log('linha 209=>',error)
    }
    
}