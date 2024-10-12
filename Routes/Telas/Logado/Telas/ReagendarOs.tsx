import React,{useState}from 'react';
import { TextInput, TouchableOpacity, View, Text} from 'react-native';
import { Styles } from '../../../../assets/Styles/Styles';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import Config from '../../../../assets/Config/Config.json';

export default function ReagendarOs({route}:any) {
    const {theme} = useTheme();
    const [date, setDate] = useState('');
    const [hour,setHour] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [descriptionEvent,setDescriptionEvent] = useState('');
    let [data,setData] = useState(new Date());

    console.log('22=>',route)

    const onChange = (event:any, selectedDate:any) => {
        
        const currentDate = selectedDate;
        setShow(false);
        //setDate(currentDate);
        setData(currentDate);

        if(mode === 'date'){
            const day = String(data.getUTCDate()).padStart(2, '0');
            const month = String(data.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
            const year = String(data.getUTCFullYear()).slice(-4); // Pegando os quatro últimos dígitos do ano

            const formattedDate = `${day}/${month}/${year}`;
            setDate(formattedDate); // Saída: 21/08/20
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

    async function reagendar(dt:any,hr:any,motivo:any,idOs:any){
        const formData = new FormData();
        formData.append('data',dt);
        formData.append('hora',hr);
        formData.append('motivo',motivo);
        formData.append('id_os',idOs);
        formData.append('comando','reagendarOs');

        const ret = await axios.post(Config.configuracoes.pastaProcessos, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if(ret !== null && ret !== undefined){
            return { status: 'Sucesso', code: 0, mensagem: 'Sucesso', retorno: ret.data[0].statusMensagem };
        }else{
            return { status: 'Erro', code: 0, mensagem: 'Erro', retorno: 'Erro no servidor' };
        }
    }

    async function iniciar(){
        const ini = await reagendar(date,hour,descriptionEvent,'');

        if(ini.code === 0){

        }else{

        }
    }
    try {
        return(
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<MaterialCommunityIcons size={310} name="calendar-refresh" style={[Styles.headerImage]} />
            }
            >
                <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'center',justifyContent:'flex-start'}]}>
                    <ThemedText type='title' style={[Styles.w100,{color:theme.labels.text}]}>Selecione a data e horário</ThemedText>
                    <ThemedText type='defaultSemiBold' style={[Styles.w100,{color:theme.labels.text}]}>Selecione a data e horário do reagendamento</ThemedText>
                </ThemedView>
                <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between'}]}>
                    <ThemedView style={[Styles.em_linhaVertical,Styles.w45,{alignItems:'flex-start',marginHorizontal:0}]}>
                        <ThemedText type='defaultSemiBold' style={[{marginBottom:5}]}>Data:</ThemedText>
                        <TextInput defaultValue={''+date} placeholder='Data' value={''+date} style={[Styles.input,Styles.w100,{marginHorizontal:0,textAlign:'center'}]} onPress={()=>{showDatepicker('date')}}/>
                    </ThemedView>
                    <ThemedView style={[Styles.em_linhaVertical,Styles.w45,{alignItems:'flex-start',marginHorizontal:0}]}>
                        <ThemedText type='defaultSemiBold' style={[{marginBottom:5}]}>Hora:</ThemedText>
                        <TextInput defaultValue={''+hour} placeholder='Hora' value={''+hour} style={[Styles.input,Styles.w100,{marginHorizontal:0,textAlign:'center'}]} onPress={()=>{showDatepicker('time')}}/>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{alignItems:'flex-start'}]}>
                    <ThemedText type='defaultSemiBold' style={[{marginBottom:5}]}>Hora:</ThemedText>
                    <TextInput defaultValue={''+descriptionEvent} multiline placeholder='Porque está reagendando?' value={''+descriptionEvent} style={[Styles.input,Styles.w100,{marginHorizontal:0,height:'auto'}]} onChangeText={(text)=>{setDescriptionEvent(text)}}/>
                </ThemedView>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={data}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    />
                )}
                {
                    date !== '' && hour !== '' &&

                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.primary]}>
                        <Text style={[Styles.ft_regular,Styles.lblprimary]}>Reagendar O.S.</Text>
                    </TouchableOpacity>
                }
            </ParallaxScrollView>
        )
    } catch (error:any) {
        console.log(error);
    }
}