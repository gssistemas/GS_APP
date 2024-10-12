import React, {useCallback, useEffect} from 'react';
import { View, Text, TouchableOpacity, ScrollView,Dimensions,Linking,Alert,Platform} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import Config from '../../../../assets/Config/Config.json';
import { useContext } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
const {width,height} = Dimensions.get('window');
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from '../../../../assets/Styles/ThemeContext';

export default function IniciarOs({route,navigation}:any) {
    const {theme} = useTheme()
    const {getModalStyle,osIniciada,verificarConexao,getModalStyleLabel,IniciarOsOffline,apresentaModal,setModalVisible,fecharModal,buscarCoordenadas,osInicada,salvarVariaveis,OsIniciada,IniciarOs,usuario} = useContext<any>(AuthLogin);
    console.log('osIniciada=>',osInicada)
    async function iniciar(){
        const vrfConn = await verificarConexao();
        if(vrfConn.code ===0){
            if(usuario !== null){
                //tela:string,DadosOs:any,codigoStatusOs:number,os:number|string,acao?:Function|ReactElement|ReactNode|undefined,comando:string
                const retorno = await buscarCoordenadas('os iniciada',osInicada.dadosOs,900,osInicada.dadosOs.os,'inicio trabalho','inicio trabalho','iniciarOs');
                if(retorno.code === 0){
                    console.log('retorno iniciar Os=>',retorno);
                    //comando:any,localizacao:any,profissional:any,dados:any,codigoStatus:any,os:any,tela:string,acao:Function|ReactElement|ReactNode|undefined|null
                    const iniOs = await IniciarOs('iniciarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,osInicada.dadosOs,900,osInicada.dadosOs.os,'os iniciada','');

                    if(iniOs.code === 0){
                        const sv = await salvarVariaveis('OsIniciada','OsIniciada',JSON.stringify({status:true,dadosOs:osInicada.dadosOs,tela:'os iniciada'}));

                        if(sv.code === 0){
                            //dadosOs:any,param_1:any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                            const OsIni = await OsIniciada(JSON.stringify({status:true,dadosOs:osInicada.dadosOs,tela:'os iniciada'}),'','','os iniciada');

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
                        }else{
                            console.log(sv.code);
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
        }else{
            const retorno = await buscarCoordenadas('os iniciada',osInicada.dadosOs,900,osInicada.dadosOs.os,'inicio trabalho','inicio trabalho','iniciarOs');
            if(retorno.code === 0){
                const iniOs = await IniciarOsOffline('iniciarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,osInicada.dadosOs,900,osInicada.dadosOs.os,'os iniciada','');

                if(iniOs.code === 0){
                    const sv = await salvarVariaveis('OsIniciada','OsIniciada',JSON.stringify({status:true,dadosOs:osInicada.dadosOs,tela:'os iniciada'}));

                    if(sv.code === 0){
                        const OsIni = await OsIniciada(JSON.stringify({status:true,dadosOs:osInicada.dadosOs,tela:'os iniciada'}),'','','os iniciada');

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
        }
    }

    useEffect(()=>{},[theme])

    /*useFocusEffect(
        useCallback(() => {
          const unsubscribe = navigation.addListener('beforeRemove', (e:any) => {
            if (osIniciada.status === true) {
              // Cancela a navegação se a OS estiver iniciada
              e.preventDefault();
            }
          });
    
          return unsubscribe;
        }, [navigation])
    );*/

    async function abrirWhatsapp(linkWhatsapp:any){
        let Url = linkWhatsapp;

        const supported = await Linking.openURL(linkWhatsapp);

        if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(linkWhatsapp);
        } else {
            Alert.alert('Erro!','Parece que você não possui o "WhatsApp" instalado em seu aparelho, Verifique e tente novamente.');
        }
    }

    async function abrirSMS(linkSms:any){
        const url = linkSms;

        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                Alert.alert('Erro!','Erro ao enviar a mensagem SMS');
            } else {
                return Linking.openURL(url)
            }
        }).catch((err:any)=>{
            Alert.alert('Erro!','Erro ao enviar a mensagem SMS');
        })
    }

    try {
        return (
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<MaterialCommunityIcons size={310} name="archive-cog" style={Styles.headerImage} />
            }
            >
                <ThemedView style={[{}]}>
                    <ThemedText type='title' style={[{color:theme.labels.text}]}>Vá para o cliente</ThemedText>
                </ThemedView>
                <ThemedView style={[Styles.em_linhaHorizontal,Styles.btn,getModalStyle(osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),Styles.w100,{justifyContent:'space-between',alignItems:'center',marginVertical:0}]}>
                    <MaterialCommunityIcons name='map-marker' size={25} style={[Styles.mr_5,getModalStyle(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),getModalStyleLabel(osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{marginHorizontal:0,paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50,width:'11%'}]}/>
                    <ThemedView style={[getModalStyle(osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{marginHorizontal:0,width:'90%'}]}>
                        {
                        osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 
                            <ThemedView>
                                <ThemedText type='defaultSemiBold' style={[Styles.w90,getModalStyleLabel(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{marginHorizontal:0,textAlign:'center'}]}> {'^_^\n\nVerifique se o cliente irá passar o endereço!'}</ThemedText>
                            </ThemedView>
                        : 
                            <ThemedView style={[Styles.em_linhaVertical,getModalStyle(osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{alignItems:'flex-start',justifyContent:'flex-start'}]}>
                                {
                                    osInicada.dadosOs.endereco.map((end:any,i:number)=>{
                                        return(
                                            <TouchableOpacity key={i}>
                                                <Text style={[getModalStyle(osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),Styles.ft_regular,{backgroundColor:'transparent'}]}>{end.cep+', '+end.cidade+'-'+end.uf+', '+(end.bairro !== 'null' ? end.bairro : 'Não informado')+'\n'+end.rua+' N°'+end.n+'\nObs.:'+end.obs}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ThemedView>
                        }
                    </ThemedView>
                </ThemedView>
                {
                    osInicada.dadosOs.endereco === undefined || osInicada.dadosOs.endereco === null || osInicada.dadosOs.endereco.length === 0 ? 
                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.danger]}
                        onPress={()=>{
                            apresentaModal(
                                'dialog',
                                'bell-plus',
                                'Iniciar trabalho',
                                'Quem você deseja notificar?',
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
                                                    navigation.navigate('notificar cliente');
                                                    fecharModal('');
                                                }}
                                            >
                                                <Text style={[Styles.ft_regular,Styles.lbldanger]}>Cliente</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                                onPress={()=>{
                                                    navigation.navigate('notificar loja');
                                                    fecharModal('');
                                                    //buscarCoordenadas()buscarCoordenadas('os iniciada',route.params.dadosOs.dadosOs,900);
                                                    //buscarCoordenadas('os iniciada',osInicada.dadosOs,900,osInicada.dadosOs.os,()=>{navigation.navigate('os iniciada')},'iniciarOs')
                                                }}
                                            >
                                                <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Loja</Text>
                                            </TouchableOpacity>
                                        </>
                                    )
                                }
                            );
                        }}
                    >
                        <MaterialCommunityIcons name='close-circle' size={25} style={[Styles.mr_5,getModalStyleLabel('danger')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('danger')]}>Erro no endereço, contate o cliente ou a loja</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.success]}
                        onPress={()=>{
                            apresentaModal(
                                'dialog',
                                'bell-plus',
                                'Iniciar trabalho',
                                'Deseja carregar o endereço do cliente?',
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
                                                    navigation.navigate('notificar cliente');
                                                    fecharModal('');
                                                }}
                                            >
                                                <Text style={[Styles.ft_regular,Styles.lbldanger]}>Cliente</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                                onPress={()=>{
                                                    console.log(osInicada.dadosOs.endereco);
                                                    try {
                                                        navigation.navigate('mapa',{endereco:osInicada.dadosOs.endereco[0].rua+','+osInicada.dadosOs.endereco[0].n+','+osInicada.dadosOs.endereco[0].complemento+','+osInicada.dadosOs.endereco[0].bairro+','+osInicada.dadosOs.endereco[0].cidade+','+osInicada.dadosOs.endereco[0].uf+','+osInicada.dadosOs.endereco[0].cep+','+'Brasil'});
                                                    } catch (error:any) {
                                                        console.log('Erro',error.message);
                                                    }
                                                    
                                                    setModalVisible(false);
                                                    //fecharModal('');
                                                    //buscarCoordenadas()buscarCoordenadas('os iniciada',route.params.dadosOs.dadosOs,900);
                                                    //buscarCoordenadas('os iniciada',osInicada.dadosOs,900,osInicada.dadosOs.os,()=>{navigation.navigate('os iniciada')},'iniciarOs')
                                                }}
                                            >
                                                <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Ver rota</Text>
                                            </TouchableOpacity>
                                        </>
                                    )
                                }
                            );
                        }}
                    >
                        <MaterialCommunityIcons name='map' size={25} style={[Styles.mr_5,getModalStyleLabel('success')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('success')]}>Carregar mapa</Text>
                    </TouchableOpacity>
                }
                <ThemedView style={[Styles.em_linhaVertical,Styles.btn,getModalStyle(osInicada.dadosOs.endereco === null && route.params.dadosOs.endereco !== undefined  && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),Styles.w100,{justifyContent:'flex-start',marginVertical:0}]}>
                    <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{backgroundColor:'transparent',justifyContent:'space-between',marginVertical:0}]}>
                        <ThemedView style={[Styles.em_linhaVertical,Styles.btn,Styles.light,Styles.w45,{marginHorizontal:0,alignItems:'flex-start',justifyContent:'flex-start',marginVertical:0}]}>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>Iniciar até:</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>{osInicada.dadosOs.data_ini}</ThemedText>
                        </ThemedView>
                        <ThemedView style={[Styles.em_linhaVertical,Styles.btn,Styles.light,Styles.w45,{marginHorizontal:0,alignItems:'flex-start',justifyContent:'flex-start',marginVertical:0}]}>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>Finalizar até:</ThemedText>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>{osInicada.dadosOs.data_fim}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={[Styles.em_linhaHorizontal,Styles.btn,getModalStyle(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined  && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),Styles.w100,{justifyContent:'flex-start',marginVertical:0}]}>
                    <MaterialCommunityIcons name='account' size={25} style={[Styles.mr_5,getModalStyle(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),getModalStyleLabel(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                    <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(osInicada.dadosOs.endereco === null && route.params.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info')]}>{osInicada.dadosOs.title}</ThemedText>
                </ThemedView>
                <ThemedView style={[Styles.em_linhaHorizontal,Styles.btn,getModalStyle(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined  && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),Styles.w100,{justifyContent:'space-between',marginVertical:0}]}>
                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.light,Styles.w45,{marginHorizontal:0,marginVertical:0,paddingVertical:0,borderRadius:50,paddingLeft:0,justifyContent:'flex-start'}]}
                        onPress={()=>{
                            console.log('OsIniciada=>',osInicada.dadosOs);
                            //console.log('agendamento Status=>',)
                            //status(agendamento_m[0].status)
                            //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                            osInicada.dadosOs.endereco[0].contato !== null && osInicada.dadosOs.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'tel:'+osInicada.dadosOs.endereco[0].contato: Alert.alert('Erro','Erro'))
                        }}
                    >
                        <MaterialCommunityIcons name='phone' size={25} style={[Styles.mr_5,getModalStyle(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),getModalStyleLabel(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                        <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info')]}>{'Ligar'}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.light,Styles.w45,{marginHorizontal:0,marginVertical:0,paddingVertical:0,borderRadius:50,paddingLeft:0,justifyContent:'flex-start'}]}
                        onPress={()=>{
                            console.log('OsIniciada=>',osInicada.dadosOs);
                            //console.log('agendamento Status=>',)
                            //status(agendamento_m[0].status)
                            //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                            osInicada.dadosOs.endereco[0].contato !== null && osInicada.dadosOs.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'whatsapp://send?text='+osInicada.dadosOs.endereco[0].contato+'?body=Olá '+osInicada.dadosOs.title+', Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.com.br/gsmontagens/?params=psqmtg,'+osInicada.dadosOs.os+'&phone=+55'+osInicada.dadosOs.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                        }}
                    >
                        <MaterialCommunityIcons name='whatsapp' size={25} style={[Styles.mr_5,getModalStyle(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined ? 'warning' : 'info'),getModalStyleLabel(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                        <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(osInicada.dadosOs.endereco === null && osInicada.dadosOs.endereco !== undefined && osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info')]}>{'WhatsApp'}</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
                {
                    osInicada.dadosOs.itens !== null &&

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {
                            osInicada.dadosOs.itens.map((its:any,i:number)=>{
                                return(
                                    <ThemedView style={[Styles.em_linhaVertical]} key={i}>
                                        <ThemedView style={[Styles.em_linhaVertical,getModalStyle(osInicada.dadosOs.endereco === null ? 'warning' : 'info'),{alignItems:'flex-start',justifyContent:'flex-start',elevation:2,borderRadius:5,paddingVertical:10,paddingHorizontal:5,maxWidth:width - 100,marginHorizontal:2.5,marginVertical:10}]}>
                                            <ThemedText type='normal' style={[{textAlign:'left',color:theme.backgroundColor.background}]}>{its.codigo_item}</ThemedText>
                                            <ThemedText type='normal' style={[{textAlign:'left',color:theme.backgroundColor.background}]}>{its.desc}</ThemedText>
                                            <ThemedText type='normal' style={[{textAlign:'left',color:theme.backgroundColor.background}]}>{its.qtd}</ThemedText>
                                            <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',borderTopWidth:1,borderTopColor:'#999',backgroundColor:'transparent'}]}>
                                                <ThemedView style={[Styles.em_linhaVertical,{justifyContent:'flex-start',alignItems:'flex-start',backgroundColor:'transparent'}]}>
                                                    <ThemedText type='normal' style={[getModalStyleLabel(osInicada.dadosOs.endereco === null || osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{textAlign:'left',backgroundColor:'transparent'}]}>{'Vlr.item.:'}</ThemedText>
                                                    <ThemedText type='normal' style={[getModalStyleLabel(osInicada.dadosOs.endereco === null || osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{textAlign:'left',backgroundColor:'transparent'}]}>{'R$ '+its.valor}</ThemedText>
                                                </ThemedView>
                                                <ThemedView style={[Styles.em_linhaVertical,{justifyContent:'flex-start',alignItems:'flex-start',backgroundColor:'transparent'}]}>
                                                    <ThemedText type='normal' style={[getModalStyleLabel(osInicada.dadosOs.endereco === null || osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{textAlign:'left',backgroundColor:'transparent'}]}>{'Vlr. Mon.:'}</ThemedText>
                                                    <ThemedText type='normal' style={[getModalStyleLabel(osInicada.dadosOs.endereco === null || osInicada.dadosOs.endereco.length === 0 ? 'warning' : 'info'),{textAlign:'left',backgroundColor:'transparent'}]}>{'R$: '+(its.valor * its.qtd * 5 / 100).toFixed(2).replace('.',',')}</ThemedText>
                                                </ThemedView>
                                            </ThemedView>
                                        </ThemedView>
                                    </ThemedView>
                                )
                            })
                        }
                    </ScrollView>
                }
                <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
                    <TouchableOpacity style={[Styles.btn,Styles.primary,Styles.em_linhaHorizontal,Styles.w100]}
                        onPress={()=>{
                            apresentaModal(
                                'dialog',
                                'help',
                                'Iniciar trabalho',
                                ()=>(<Text style={[Styles.w100,{textAlign:'center'}]}>{'Ao iniciar o trabalho você não poderá voltar até que finalize a mesma.\n\nDeseja iniciar a O.S.:'+osInicada.dadosOs.os+'?'}</Text>),
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
                        <ThemedText type='default' style={[Styles.lblprimary,Styles.ft_regular]}>Cheguei</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ParallaxScrollView>
        );
    } catch (error:any) {
        //fecharModal('')
        return(
            <View style={[Styles.em_linhaVertical,Styles.w100,{height:'100%'}]}>
                <View style={[Styles.em_linhaVertical,Styles.danger,Styles.w80,{height:'auto',paddingVertical:20,paddingHorizontal:10,elevation:10,borderRadius:10}]}>
                    <MaterialCommunityIcons name='alert-box' size={75} style={[Styles.lbldanger]}/>
                    <Text style={[Styles.ft_bold,Styles.lbldanger,{textAlign:'center'}]}>{error.message}</Text>
                    <TouchableOpacity style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,Styles.primary]}
                        onPress={()=>{
                            navigation.navigate('notificar loja',{voltar:'true',dadosOs:osInicada.dadosOs});
                        }}
                    >
                        <MaterialCommunityIcons name='bell-plus' size={25} style={[Styles.lblprimary]}/>
                        <Text style={[Styles.ft_bold,Styles.lblprimary,{textAlign:'center'}]}>{'Notificar loja'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,Styles.light]}
                        onPress={()=>{
                            navigation.navigate('resolucao problema',{voltar:'true',dadosOs:osInicada === null ? null : osInicada.dadosOs});
                        }}
                    >
                        <MaterialCommunityIcons name='archive-cancel' size={25} style={[Styles.lbllight]}/>
                        <Text style={[Styles.ft_bold,Styles.lbllight,{textAlign:'center'}]}>{'Relatar problema'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}