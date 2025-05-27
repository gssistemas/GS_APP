import React, {useContext, useState}from "react";
import { Text, View, TextInput, TouchableOpacity,ActivityIndicator} from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useTheme } from "../../../../assets/Styles/ThemeContext";
import ParallaxScrollView from "../../../Components/ParallaxScrollView";
import { Styles } from "../../../../assets/Styles/Styles";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedView } from "../../../Components/ThemedView";
import { ThemedText } from "../../../Components/ThemedText";
import { AuthLogin } from "../../../../assets/Contexts/AuthLogin";
import Config from '../../../../assets/Config/Config.json';
import axios from "axios";

export default function Roterizacao({route,navigation}:any){
    const {usuario,getModalStyle,getModalStyleLabel,apresentaModal,fecharModal,setLoad,verificarConexao,httpAlimentacao,arlterarModal} = useContext<any>(AuthLogin);
    const {theme} = useTheme();
    const [date, setDate] = useState('');
    const [hour,setHour] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [descriptionEvent,setDescriptionEvent] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    let [data,setData] = useState(new Date());

    /*const onChange = (event:any, selectedDate:any) => {
        
        const currentDate = selectedDate;
        setShow(false);
        //setDate(currentDate);
        setData(currentDate);
        

        if(mode === 'date'){
            const day = String(data.getUTCDate()).padStart(2, '0');
            const month = String(data.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
            const year = String(data.getUTCFullYear()).slice(-4); // Pegando os quatro últimos dígitos do ano

            const formattedDate = `${day}/${month}/${year}`;
            console.log('data corrente',currentDate,'data selecionada=>',formattedDate);
            setDate(formattedDate); // Saída: 21/08/20
            // Pegar o dia da semana correspondente
            const daysOfWeek = [
                'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
                'Quinta-feira', 'Sexta-feira', 'Sábado'
            ];
            const day_ = daysOfWeek[currentDate.getDay()];
            setDayOfWeek(day_);
        }else{
            //const time = formatTimeWithTimezone(data);
            //console.log(time);  // Saída: 20:15:00
            const hours = String(data.getUTCHours()).padStart(2, '0');
            const minutes = String(data.getUTCMinutes()).padStart(2, '0');
            const seconds = String(data.getUTCSeconds()).padStart(2, '0');

            const formattedTime = `${hours}:${minutes}:${seconds}`;
            const time = formatTimeWithTimezone(currentDate); // Saída: 23:15:00
            setHour(time);
        }
    };*/

    const onChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate || new Date();
        setShow(false);
        setData(currentDate);
    
        if (mode === 'date') {
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
            const year = String(currentDate.getFullYear());
    
            const formattedDate = `${day}/${month}/${year}`;
            console.log('data corrente:', currentDate, 'data selecionada=>', formattedDate);
            setDate(formattedDate);
    
            const daysOfWeek = [
                'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
                'Quinta-feira', 'Sexta-feira', 'Sábado'
            ];
            const dayOfWeek = daysOfWeek[currentDate.getDay()];
            setDayOfWeek(dayOfWeek);
        } else {
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
            const formattedTime = `${hours}:${minutes}:${seconds}`;
            setHour(formattedTime);
        }
    };

    function formatTimeWithTimezone(dateString:any) {
        // Converte a string para um objeto Date
        const date = new Date(dateString);
      
        // Formata diretamente para o time zone UTC-3 (America/Sao_Paulo)
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Sao_Paulo' // Define o fuso horário como UTC-3
        });
    }

    const showMode = (currentMode:any) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = (typeData:string) => {
        showMode(typeData);
    };

    async function iniciar(dadosOS:any,comando:string,data:string,hora:string,dia_selecionado:string,user:any){
        const vrfConn = await verificarConexao();

        if(vrfConn.code === 0){
            apresentaModal(
                'load',
                'upload-multiple',
                'Processando',
                ()=>(
                    <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('light'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                        <ActivityIndicator size={75} color={'blue'}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Iniciando roterização da ordem de serviço\n\nAguarde...'}</Text>
                    </View>
                ),
                'default',
                ()=>{null}
            );
            const response = await axios({
                method:'get',
                url:httpAlimentacao === null ? Config.configuracoes.pastaProcessos : httpAlimentacao,
                params:{
                    comando:comando,
                    id_profissional:user,
                    data_rota:data,
                    dia_selecionado:dia_selecionado,
                    hora_rota:hora,
                    os:dadosOS.os,
                }
            });
            console.log('Retorno do response=>',response);
            if(response.data[0].status === 'OK' && response.data[0].statusCode === 0){
                apresentaModal(
                    'success',
                    'check-circle',
                    'Sucesso',
                    ()=>(
                        <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('success'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                            <MaterialCommunityIcons name='check-circle' size={75} style={[getModalStyleLabel('success')]}/>
                            <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{response.data[0].statusMensagem}</Text>
                        </View>
                    ),
                    'success',
                    ()=>{
                        return(
                            <>
                                <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.light,Styles.w100,Styles.btnDialog,Styles.btnDialogcentered]}
                                    onPress={()=>{
                                        setLoad(false);
                                        fecharModal('');
                                        navigation.goBack();
                                    }}
                                >
                                    <Text style={[Styles.ft_medium,Styles.lbllight]}>OK</Text>
                                </TouchableOpacity>
                            </>
                        )
                    }
                    //'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'
                )
            }else{
                apresentaModal(
                    'error',
                    'close-circle',
                    '*_* Erro',
                    ()=>(
                        <View style={[Styles.em_linhaVertical,Styles.w100,getModalStyle('danger'),{borderBottomLeftRadius:5,borderBottomRightRadius:5,marginBottom:10}]}>
                            <MaterialCommunityIcons name='close-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                            <Text style={[Styles.ft_medium,getModalStyleLabel('light'),{textAlign:'center',marginBottom:25}]}>{'Erro ao processar o pedido.\nError code:0\nMensagem:'+response.data[0].statusMensagem+'\n\nAguarde uns minutos e tente novamente.'}</Text>
                        </View>
                    ),
                    'danger',
                    ()=>{
                        return(
                            <>
                                <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.light,Styles.w100,Styles.btnDialog,Styles.btnDialogcentered]}
                                    onPress={()=>{
                                        setLoad(false);
                                        fecharModal('');
                                    }}
                                >
                                    <Text style={[Styles.ft_medium,Styles.lbllight]}>OK</Text>
                                </TouchableOpacity>
                            </>
                        )
                    }
                    //'Erro ao processar o inicio do trabalho.\nError code:0\nMensagem:Erro no retorno do servidor\n\nDeseja tentar novamente?'
                )
            }
        }else{

        }
    }

    async function roterizar(dds:any,x1:any,x2:any,x3:any,x4:string,x5:any){
        apresentaModal(
            'dialog',
            'help',
            'Iniciar trabalho',
            ()=>(
                <View style={[Styles.em_linhaVertical,Styles.w100,{marginHorizontal:0}]}>
                    <ThemedText type="title" style={[Styles.w100,{textAlign:'center'}]}>{`dados da roterização:`}</ThemedText>
                    <View style={[Styles.em_linhaVertical,Styles.w95,Styles.btn,{marginHorizontal:0,marginBottom:20}]}>
                        <View style={[Styles.w100,Styles.em_linhaHorizontal,{marginVertical:2.5,marginHorizontal:0,justifyContent:'space-between'}]}>
                            <ThemedText type="defaultSemiBold" style={[{textAlign:'center'}]}>{`NF:`}</ThemedText>
                            <ThemedText type="default" style={[{textAlign:'center'}]}>{dds.os}</ThemedText>
                        </View>
                        <View style={[Styles.w100,Styles.em_linhaHorizontal,{marginVertical:2.5,marginHorizontal:0,justifyContent:'space-between'}]}>
                            <ThemedText type="defaultSemiBold" style={[{textAlign:'center'}]}>{`Data do roteiro:`}</ThemedText>
                            <ThemedText type="default" style={[{textAlign:'center'}]}>{date}</ThemedText>
                        </View>
                        <View style={[Styles.w100,Styles.em_linhaHorizontal,{marginVertical:2.5,marginHorizontal:0,justifyContent:'space-between'}]}>
                            <ThemedText type="defaultSemiBold" style={[{textAlign:'center'}]}>{`Hora:`}</ThemedText>
                            <ThemedText type="default" style={[{textAlign:'center'}]}>{hour}</ThemedText>
                        </View>
                        <View style={[Styles.w100,Styles.em_linhaHorizontal,{marginVertical:2.5,marginHorizontal:0,justifyContent:'space-between'}]}>
                            <ThemedText type="defaultSemiBold" style={[{textAlign:'center'}]}>{`Dia selecionado:`}</ThemedText>
                            <ThemedText type="default" style={[{textAlign:'center'}]}>{dayOfWeek}</ThemedText>
                        </View>
                    </View>
                    <ThemedText type="defaultSemiBold" style={[Styles.w100,{textAlign:'center',marginBottom:20}]}>{`Você deseja continuar com a roterização?`}</ThemedText>
                </View>
            ),
            'default',
            ()=>{
                return(
                    <>
                        <TouchableOpacity style={[Styles.btn,Styles.warning,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                            onPress={()=>{
                                fecharModal('');
                                setLoad(false);
                                navigation.goBack();
                            }}
                        >
                            <Text style={[Styles.ft_regular,Styles.lblwarning]}>Cancelar e sair</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogcentered,{}]}
                            onPress={()=>{
                                fecharModal('');
                                setLoad(false);
                            }}
                        >
                            <Text style={[Styles.ft_regular,Styles.lbldanger]}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogRight,{}]}
                            onPress={()=>{
                                iniciar(dds,x1,x2,x3,x4,x5);
                            }}
                        >
                            <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Sim</Text>
                        </TouchableOpacity>
                    </>
                )
            }
        );
    }

    console.log(route.params.dados);
    try {
        return(
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<MaterialCommunityIcons size={310} name="map-marker-path" style={[Styles.headerImage]} />
            }
            >
                <ThemedView style={[Styles.btn,{backgroundColor:theme.backgroundColor.background}]}>
                    <View style={[Styles.w100,Styles.btn,Styles.warning,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                        <MaterialCommunityIcons name="information" size={30} style={[Styles.w15,{marginHorizontal:0}]}/>
                        <View style={[Styles.w85,Styles.em_linhaVertical,{alignItems:'flex-start',justifyContent:'flex-start',marginHorizontal:0}]}>
                            <ThemedText type="title" style={[Styles.w100,{borderBottomWidth:1,borderBottomColor:theme.labels.text}]}>{'ATENÇÃO!!'}</ThemedText>
                            <ThemedText type="defaultSemiBold" style={[Styles.w100,{}]}>{'Para roterização de ordens de serviço é necessário estar online.'}</ThemedText>
                        </View>
                    </View>
                    <ThemedText type="title" style={[{borderBottomWidth:1,borderBottomColor:theme.labels.text}]}>Roterização de O.S.</ThemedText>
                    <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                        <ThemedView style={[Styles.em_linhaVertical,Styles.w45,{alignItems:'flex-start',marginHorizontal:0}]}>
                            <ThemedText type='defaultSemiBold' style={[{marginBottom:5}]}>Data:</ThemedText>
                            <TextInput defaultValue={''+date} placeholder='Data' value={''+date} style={[Styles.input,Styles.w100,{marginHorizontal:0,textAlign:'center'}]} onPress={()=>{showDatepicker('date')}}/>
                        </ThemedView>
                        <ThemedView style={[Styles.em_linhaVertical,Styles.w45,{alignItems:'flex-start',marginHorizontal:0}]}>
                            <ThemedText type='defaultSemiBold' style={[{marginBottom:5}]}>Hora:</ThemedText>
                            <TextInput defaultValue={''+hour} placeholder='Hora' value={''+hour} style={[Styles.input,Styles.w100,{marginHorizontal:0,textAlign:'center'}]} onPress={()=>{showDatepicker('time')}}/>
                        </ThemedView>
                    </View>
                    {
                        dayOfWeek !== '' &&
                        <View style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,getModalStyle('info'),{}]}>
                            <ThemedText type="defaultSemiBold" style={[getModalStyleLabel('info')]}>{'Rota de "'+dayOfWeek+'"'}</ThemedText>
                        </View>
                    }
                </ThemedView>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    />
                )}
                {
                    date !== '' && hour !== '' &&

                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.primary]}
                        onPress={()=>{
                            //dadosOS:any,comando:string,data:string,hora:string,dia_selecionado:string,user:any
                            roterizar(route.params.dados,'roterizar',date,hour,dayOfWeek,usuario.id_login[0].id);
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lblprimary]}>Roterizar O.S.</Text>
                    </TouchableOpacity>
                }
            </ParallaxScrollView>
        )
    } catch (error:any) {
        
    }
}