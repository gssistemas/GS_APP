import React, {useState,useContext,useEffect} from 'react';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import { Styles } from '../../../../assets/Styles/Styles';
import { ThemedText } from '../../../Components/ThemedText';
import { View, Text, TextInput, TouchableOpacity, Linking, Alert, Platform} from 'react-native';
import { ThemedView } from '../../../Components/ThemedView';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function MensagemWhatsApp({route,navigation}:any){
    const [dados,setDados] = useState(route.params.item);
    console.log('dados a serem enviados=>',dados);
    const {theme} = useTheme();
    const [dataAge,setDataAge] = useState<string>('');
    const [horaInicio,setHoraInicio] = useState<string>('');
    const [horaFim,setHoraFim] = useState<string>('');
    const [hour,setHour] = useState<string>('');
    const [mode, setMode] = useState<any>('date');
    const [show, setShow] = useState<boolean>(false);
    const [descriptionEvent,setDescriptionEvent] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    let [dataIni,setDataIni] = useState(new Date());
    let [dataFim,setDataFim] = useState(new Date());
    const [typeDate,setTypeDate] = useState<string>('');
    const [data_ini,setData_ini] = useState<string>('');
    const [data_fim,setData_fim] = useState<string>('');

    const onChangeIni = (event:any, selectedDate:any) => {
        
        /*const currentDate = selectedDate;
        setShow(false);
        //setDate(currentDate);
        setData_ini(currentDate);
        

        if(mode === 'date'){
            const day = String(data.getUTCDate()).padStart(2, '0');
            const month = String(data.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
            const year = String(data.getUTCFullYear()).slice(-4); // Pegando os quatro últimos dígitos do ano

            const formattedDate = `${day}/${month}/${year}`;
            setDate_ini(formattedDate); // Saída: 21/08/20
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
        }*/
            const currentDate = selectedDate;
            setShow(false);
            setData_ini(currentDate);
        
            if (mode === 'date') {
                const day = String(currentDate.getUTCDate()).padStart(2, '0');
                const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
                const year = String(currentDate.getUTCFullYear()).slice(-4); // Pegando os quatro últimos dígitos do ano
        
                const formattedDate = `${day}/${month}/${year}`;
                console.log('Data corrente', currentDate, 'Data selecionada:', formattedDate);
                setData_ini(formattedDate); // Saída: 21/08/2024
        
                // Pegar o dia da semana correspondente
                const daysOfWeek = [
                    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
                    'Quinta-feira', 'Sexta-feira', 'Sábado'
                ];
                const dayOfWeek = daysOfWeek[currentDate.getDay()];
                setDayOfWeek(dayOfWeek);
            } else {
                if (typeDate === 'horaIni') {
                    let hours = currentDate.getUTCHours() - 3; // Ajuste para UTC-3
                    if (hours < 0) hours += 24; // Corrige caso as horas fiquem negativas
                    const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
                    const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');
                
                    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
                    setHoraInicio(formattedTime);
                } else if (typeDate === 'horaFim') {
                    let hours = currentDate.getUTCHours() - 3; // Ajuste para UTC-3
                    if (hours < 0) hours += 24; // Corrige caso as horas fiquem negativas
                    const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
                    const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');
                
                    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
                    setHoraFim(formattedTime);
                }
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

    function separaItens(itens:any){
        let stringItens = '';
        itens.map((its:any,i:number)=>{
            console.log('item=>',its.desc)
            stringItens += '*'+(i+1)+'-'+its.desc+'*\n';
        });

        return (stringItens);
    }

    function pegaEndereco(stringEnd:any){
        let cidade = stringEnd[0].cidade+'-'+stringEnd[0].uf;
        let bairro = stringEnd[0].bairro;
        let rua = stringEnd[0].rua+' N°'+stringEnd[0].n;
        let complemento = stringEnd[0].complemento;

        let stringEndereco = '*'+cidade+', '+bairro+', '+rua+','+'Complemento:'+complemento+'* ';

        return stringEndereco;
    }

    async function abrirWhatsapp(linkWhatsapp:any){
        let Url = linkWhatsapp;
    
        const supported = await Linking.openURL(linkWhatsapp);
    
        if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(linkWhatsapp);
        } else {
            Alert.alert('Erro!','Parece que você não possui o "WhatsApp" ou "WhatsAppBusiness" instalado em seu aparelho, Verifique e tente novamente.');
        }
    }

    const data = [
        { label: 'Mensagem de saudação', value: '1',mensagem:'Olá *'+dados.title+'*, tudo bem?\nNotificamos que a montagem do(s) item(ns):\n\n'+separaItens(dados.itens)+'\nVocê pode acompanhar o status da mesma nesse endereço: *https://appmontagens.gsapp.com.br/?params=psqmtg,'+dados.os+'*'},
        { label: 'Confirmação de endereço', value: '2',mensagem:'Olá *'+dados.title+'*, tudo bem?\nConfirme se o endereço está correto:\n\n'+pegaEndereco(dados.endereco)+'\nVocê pode acompanhar o status da mesma nesse endereço: *https://appmontagens.gsapp.com.br/?params=psqmtg,'+dados.os+'*'},
        { label: 'Confirmação de entrega', value: '3',mensagem:'Olá *'+dados.title+'*, tudo bem?\nConfirme se o(s) produto(s):\n\n'+separaItens(dados.itens)+'\nJá foram entregues, Você pode acompanhar o status da mesma nesse endereço: *https://appmontagens.gsapp.com.br/?params=psqmtg,'+dados.os+'*'},
        { label: 'Desejar bom dia', value: '4',mensagem:'Bom dia *'+dados.title+'*, tudo bem?'},
        { label: 'Confirmar agendamento', value: '5',mensagem:'*'+dados.title+'*, estamos entrando em contato para confirmar o agendamento para: *'+dayOfWeek+' '+data_ini+', com início às '+(horaInicio).slice(0, -3)+'h e término às '+(horaFim).slice(0, -3)+'h*, Lembrando que podem ocorrer atrasos tanto na montagem quanto no deslocamento\n\nDeseja confirmar o agendamento?'},
        { label: 'Pedir avaliação de execução', value: '6',mensagem:'Olá *'+dados.title+'*, tudo bem?\nPor gentileza, Gostaríamos de saber como foi sua experiência com os trabalhos realizados nos seguinte(s) item(ns):\n\n'+separaItens(dados.itens)+'\nAvalie-nos usando este endereço: *https://appmontagens.gsapp.com.br/?params=avaliacao,'+dados.os+'*\n\nPara nós é de extrema importância sua avaliação para continuar-mos aprimorando nosso trabalho.Desde já, Agradecemos seu tempo e esperamos trabalhar novamente com o(a) Sr(a),\n*Tenha um ótimo dia*. '},
        { label: 'Agradecimentos ao cliente', value: '7',mensagem:'Olá *'+dados.title+'*, tudo bem?\nPor gentileza, Gostaríamos de saber como foi sua experiência com os trabalhos realizados nos seguinte(s) item(ns):\n\n'+separaItens(dados.itens)+'\nAvalie-nos usando este endereço: *https://appmontagens.gsapp.com.br/?params=avaliacao,'+dados.os+'*\n\nPara nós é de extrema importância sua avaliação para continuar-mos aprimorando nosso trabalho.Desde já, Agradecemos seu tempo e esperamos trabalhar novamente com o(a) Sr(a),\n*Tenha um ótimo dia*. '},
        { label: 'Execução de assistência', value: '8',mensagem:'Mensagem não pronta, Digite sua mensagem manualmente.'},
    ];
    const [value,setValue] = useState('');
    const [mensagem,setMensagem] = useState('');

    const renderItem = (item:any) => {
        return (
          <View style={Styles.item}>
            <Text style={[Styles.textItem,{color:'#000000'}]}>{item.label}</Text>
            {item.value === value && (
              <MaterialCommunityIcons
                style={Styles.icon}
                color={'green'}
                name="check-all"
                size={20}
              />
            )}
          </View>
        );
    };

    try {
        return(
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#00FF00', dark: '#00FF00' }}
                headerImage={<Ionicons size={310} name='logo-whatsapp' style={[Styles.headerImage,{color:'#FFF'}]} />}
            >
                <ThemedText type='title'>Enviar mensagem de WhatsApp</ThemedText>
                <ThemedView style={[Styles.em_linhaVertical,Styles.w95,{}]}>
                    <ThemedText type='default' style={[Styles.w100,{textAlign:'left',marginBottom:5}]}>Selecione a mensagem:</ThemedText>
                    <Dropdown
                        style={[Styles.dropdown,Styles.w100,{backgroundColor:theme.backgroundColor.background}]}
                        placeholderStyle={[Styles.placeholderStyle,Styles.ft_regular,{color:theme.labels.text}]}
                        selectedTextStyle={[Styles.selectedTextStyle,Styles.ft_regular,{color:theme.labels.text}]}
                        inputSearchStyle={[Styles.inputSearchStyle,Styles.ft_regular,{color:theme.labels.text}]}
                        iconStyle={[Styles.iconStyle,{tintColor:theme.labels.text}]}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Selecione a mensagem..."
                        searchPlaceholder="Buscar..."
                        value={value}
                        onChange={item => {
                            setValue(item.value);
                            setMensagem(item.mensagem);
                        }}
                        renderLeftIcon={() => {
                            return(
                                <MaterialCommunityIcons style={[Styles.icon,{color:theme.labels.text}]} name="list-status" size={20} />
                            )}
                        }
                        renderItem={renderItem}
                    />
                    {
                        value === '5' &&

                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{marginVertical:5,}]}>
                            <ThemedView style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',marginVertical:5}]}>
                                <View style={[Styles.em_linhaVertical,Styles.w45,{marginHorizontal:0,alignItems:'flex-start'}]}>
                                    <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Iniciar às:</Text>
                                    <TextInput style={[Styles.input,Styles.w100,{marginHorizontal:0,textAlign:'center'}]} keyboardType='number-pad' placeholder='Hora inicial' value={horaInicio} defaultValue={horaInicio} onChangeText={(texto)=>{setHoraInicio(texto)}} onPress={()=>{setTypeDate('horaIni'),showDatepicker('time')}}/>
                                </View>
                                <View style={[Styles.em_linhaVertical,Styles.w45,{marginHorizontal:0,alignItems:'flex-start'}]}>
                                    <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Finalizar às:</Text>
                                    <TextInput style={[Styles.input,Styles.w100,{marginHorizontal:0,textAlign:'center'}]} keyboardType='number-pad' placeholder='Hora final' value={horaFim} defaultValue={horaFim} onChangeText={(texto)=>{setHoraFim(texto)}} onPress={()=>{setTypeDate('horaFim'),showDatepicker('time')}}/>
                                </View>
                            </ThemedView>
                            <TextInput style={[Styles.w100,Styles.input,{textAlign:'center'}]} placeholder='Data' value={data_ini} defaultValue={data_ini} onChangeText={(texto)=>{setDataAge(texto)}} keyboardType='decimal-pad' onPress={()=>{setTypeDate('data'),showDatepicker('date')}}/>
                        </ThemedView>
                    }
                    <View style={[Styles.w100,{height:1,backgroundColor:theme.labels.text,marginVertical:5}]}/>
                    <ThemedText type='default' style={[Styles.w100,{textAlign:'left',marginBottom:5}]}>Mensagem a ser enviada:</ThemedText>
                    <ThemedText type='defaultSemiBold' style={[Styles.input,Styles.w100,{minHeight:50,borderWidth:1,borderColor:'blue',height:'auto',textAlign:'left',color:'#000000'}]}>{mensagem === '' ? 'Selecione ou digite uma mensagem' : mensagem}</ThemedText>
                    {
                        mensagem !== '' &&

                        <TouchableOpacity style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,Styles.success]}
                            onPress={()=>{
                                dados.endereco[0].contato !== null && dados.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'whatsapp://send?text='+mensagem+'\nAgradecemos sua atenção\n\nAtt:*Equipe de montagem GS MONTAGENS*&phone=+55'+dados.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                            }}
                        >
                            <MaterialCommunityIcons name='whatsapp' size={25} style={[Styles.lblsuccess,Styles.mr_5]}/>
                            <Text style={[Styles.ft_medium,Styles.lblsuccess]}>Enviar pelo WhatsApp</Text>
                        </TouchableOpacity>
                    }
                </ThemedView>
                {show && 
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={typeDate === 'data' ? dataIni : dataFim}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChangeIni}
                    />
                }
            </ParallaxScrollView>
        );
    } catch (error:any) {
        //
    }
}