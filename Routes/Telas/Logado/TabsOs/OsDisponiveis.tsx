import React, {useEffect, useState} from 'react';
import { View,Text,Dimensions,TouchableOpacity,TextInput, Alert, Linking, Platform} from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Config from '../../../../assets/Config/Config.json';
import { Styles } from '../../../../assets/Styles/Styles';
import { FlatList } from 'react-native-gesture-handler';
import { useContext } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import axios from 'axios';
import AppLoading from '../../../../Components/Loader/AppLoading';
const {width,height} = Dimensions.get('window');

export default function OsDisponiveis({navigation}:any) {
    const {theme} = useTheme()
    const {listOsDisponiveis,setListOsDisponiveis,buscarRotas,usuario,dataLocal,httpAlimentacao,apresentaModal,getModalStyle,getModalStyleLabel,getModalStyleLabelAlert,fecharModal} = useContext<any>(AuthLogin);
    const [date, setDate] = useState('');
    const [hour,setHour] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [descriptionEvent,setDescriptionEvent] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    let [data,setData] = useState(new Date());
    //const [OsDisponiveis,setOsDisponiveis] = useState(null);
    const [load,setLoda] = useState(false);
    const [ret,setRet] = useState<any>(null);
    const [dadosAtuais,setDadosAtuais] = useState<null|any>(null);
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
          // Pegar o dia da semana correspondente
          const daysOfWeek = [
              'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
              'Quinta-feira', 'Sexta-feira', 'Sábado'
          ];
          const day_ = daysOfWeek[currentDate.getDay()];
          setDayOfWeek(day_);
          setLoda(false);
          setTimeout(() => {
            inicio();
          }, 2000);
      }else{
          //const time = formatTimeWithTimezone(data);
          const hours = String(data.getUTCHours()).padStart(2, '0');
          const minutes = String(data.getUTCMinutes()).padStart(2, '0');
          const seconds = String(data.getUTCSeconds()).padStart(2, '0');

          const formattedTime = `${hours}:${minutes}:${seconds}`;
          const time = formatTimeWithTimezone(currentDate); // Saída: 23:15:00
          setHour(time);
      }
    };

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

  async function inicio(){
    setListOsDisponiveis(null);
    const retorno = await buscarRotas('buscarrotas',date === '' ? dataLocal : date,usuario.id_login[0].id);

    if(retorno.code === 0){
      setLoda(true);
      setRet(null);
    }else{
      setLoda(true);
      setRet(retorno.errors);
    }
  }

  useEffect(()=>{
    inicio();
  },[]);

  try {
    if(!load){
      return <AppLoading msgTitle={'Trabalhando nisso!'} msgLoad={'Buscando rotas de hoje,\n\nAguarde...'}/>
    }else{
      return(
        <View style={[Styles.em_linhaVertical,Styles.w100,{height:height - 110,backgroundColor:theme.backgroundColor.background}]}>
          <FlatList 
            data={listOsDisponiveis}
            style={[Styles.w95,{backgroundColor:theme.backgroundColor.background}]}
            renderItem={({item})=>{
              return(
                <ThemedView style={[{width:'97%',borderRadius:5,padding:2.5,elevation:2,marginVertical:5,height:'auto',backgroundColor:'#FAFAFA',marginHorizontal:'1.5%'},item.status !== 1200 && item.status !== 1500 && getModalStyle('warning')]}>
                  {
                    item.status !== 1200 && item.status !== 1500 ?

                    <ThemedText type='defaultSemiBold' style={[Styles.btn,{marginVertical:0,textAlign:'center',backgroundColor:theme.backgroundColor.background,color:theme.labels.text,borderRadius:5}]}>{'Aguardando -> '+item.data_ini+' até '+item.data_fim}</ThemedText>
                    :
                    <ThemedText type='defaultSemiBold' style={[Styles.em_linhaHorizontal,Styles.btn,getModalStyle('success'),{alignItems:'center',marginVertical:0,textAlign:'center',borderRadius:5}]}>
                      <MaterialCommunityIcons name='check-circle' size={18} style={[getModalStyleLabel('success'),Styles.mr_5]}/>
                      <Text style={[getModalStyleLabel('success'),Styles.ft_thin]}>{'O.S. finalizada'}</Text>
                    </ThemedText>
                  }
                  <TouchableOpacity onLongPress={()=>{setDadosAtuais(item)/*toggleMenu()*/}} style={[{width:'100%',alignItems:'stretch',justifyContent:'center'}]} onPress={()=>{navigation.navigate('info os',{dadosOs:item})}}>
                    <View style={[{flexDirection:'column',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                      <ThemedView style={[{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',paddingVertical:5,paddingHorizontal:10,borderRadius:5,backgroundColor:theme.backgroundColor.background}]}>
                        <MaterialCommunityIcons name='store' size={25} color={'#000000'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                        <ThemedText type='default' style={[{fontSize:width * 0.05}]}>{item.filial[0].codigo_loja !== undefined ? item.filial[0].codigo_loja+' - '+item.filial[0].nome : ''+' - '+item.filial[0].nome}</ThemedText>
                      </ThemedView>
                    </View>
                    <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                      <ThemedView style={[{width:'48%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:5}]}>
                        <MaterialCommunityIcons name='archive' size={25} color={'#000000'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                        <ThemedText type='default'>O.S.:{item.os}</ThemedText>
                      </ThemedView>
                      <ThemedView style={[{width:'48%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:4}]}>
                        <MaterialCommunityIcons name='file-document' size={25} color={'#000000'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                        <ThemedText type='default'>NF:{item.nota_fiscal}</ThemedText>
                      </ThemedView>
                    </View>
                    <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                      <ThemedView style={[{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:5}]}>
                        <MaterialCommunityIcons name='account' size={25} color={'#000000'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                        <ThemedText type='default' style={[{fontSize:width * 0.05}]}>{item.title}</ThemedText>
                      </ThemedView>
                    </View>
                    <View style={[{flexDirection:'column',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                      <ThemedView style={[{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:5}]}>
                        {
                          item.endereco === null ? 
                          <>
                            <MaterialCommunityIcons name='map-marker-distance' size={25} color={'red'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                            <ThemedText type='default' style={[{color:'red'}]}>Endereço: {'Favor verificar junto a filial!'}</ThemedText>
                          </>
                          :
                          <>
                            <MaterialCommunityIcons name='map-marker-distance' size={25} color={'blue'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                            <ThemedText type='default' style={[{color:theme.labels.text,maxWidth:'100%'}]} maxFontSizeMultiplier={2}>{item.endereco[0].rua+', N° '+item.endereco[0].n+'\n'+(item.endereco[0].bairro !== 'null' && item.endereco[0].bairro !== '' ? item.endereco[0].bairro : 'Não informado')+','+item.endereco[0].cidade+'-'+item.endereco[0].uf}</ThemedText>
                          </>
                        }
                      </ThemedView>
                    </View>
                    <View style={[{flexDirection:'column',alignItems:'center',justifyContent:'space-between',marginVertical:2.5}]}>
                      <ThemedView style={[{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background,paddingVertical:5,paddingHorizontal:10,borderRadius:5}]}>
                      {
                          item.endereco === null ? 
                          <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                            <MaterialCommunityIcons name='tune-variant' size={25} color={'red'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                            <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                              <ThemedText type='default' style={[{color:'red'}]}>{'Contato Inválido!'}</ThemedText>
                            </View>
                          </View>
                          :
                          <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between'}]}>
                            <MaterialCommunityIcons name='tune-variant' size={25} color={'blue'} style={[{backgroundColor:'#CACACA',marginLeft:-10,borderRadius:5,borderTopLeftRadius:5,borderBottomLeftRadius:5,paddingVertical:10,marginVertical:-5,paddingHorizontal:10,marginRight:5}]}/>
                            <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                              <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.light,Styles.w40,{marginHorizontal:0,marginVertical:0,paddingVertical:0,borderRadius:50,paddingLeft:0,justifyContent:'flex-start'}]}
                                onPress={()=>{
                                    //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                                    item.endereco[0].contato !== null && item.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'tel:'+item.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                                }}
                              >
                                <MaterialCommunityIcons name='phone' size={25} style={[Styles.mr_5,getModalStyle(item.endereco[0].endereco === null && item.endereco[0].endereco !== undefined ? 'warning' : 'info'),getModalStyleLabel(item.endereco[0].endereco === null && item.endereco[0].endereco !== undefined ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                                <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(item.endereco[0].endereco === null && item.endereco[0].endereco !== undefined ? 'warning' : 'info')]}>{'Chamar'}</ThemedText>
                              </TouchableOpacity>
                              <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.light,Styles.w50,{marginHorizontal:0,marginVertical:0,paddingVertical:0,borderRadius:50,paddingLeft:0,justifyContent:'flex-start'}]}
                                  onPress={()=>{
                                      //osInicada.dadosOs.endereco[0].contato === null && Alert.alert('ATENÇÃO!!!','Não encontramos um número de telefone para este cliente, Edite os dados do endereço do mesmo e tente novamente');
                                      item.endereco[0].contato !== null && item.endereco[0].contato !== '' && abrirWhatsapp((Platform.OS === 'android') ? 'whatsapp://send?text=Olá *'+item.title+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: *https://appmontagens.gsapp.com.br/gsmontagens/?params=psqmtg,'+item.os+'*&phone=+55'+item.endereco[0].contato : Alert.alert('Erro','Erro'));//'whatsapp://send?text=Olá *'+route.params.params.cliente+'*, Notificamos que sua montagem foi agendada.\n\nVocê pode acompanhar o status da mesma nesse endereço: https://gsapp.net.br/gsmontagens/?params='+route.params.params.nota+'\nSegue dados do agendamento:\n\n*1. '+agendamento_m[0].descricao+'*\n*2. Horário de inicio:* '+agendamento_m[0].horario_inicio+'\n*3. Horário término:* '+agendamento_m[0].horario_fim+'\n*4. Status:* '+statusMontagem+'&phone=+55'+end.contato);
                                  }}
                              >
                                  <MaterialCommunityIcons name='whatsapp' size={25} style={[Styles.mr_5,getModalStyle(item.endereco[0].endereco === null && item.endereco[0].endereco !== undefined ? 'warning' : 'info'),getModalStyleLabel(item.endereco[0].endereco === null && item.endereco[0].endereco !== undefined ? 'warning' : 'info'),{paddingHorizontal:5,paddingVertical:5,elevation:5,borderRadius:50}]}/>
                                  <ThemedText type='defaultSemiBold' style={[getModalStyleLabel(item.endereco[0].endereco === null && item.endereco[0].endereco !== undefined ? 'warning' : 'info')]}>{'WhatsApp'}</ThemedText>
                              </TouchableOpacity>
                            </View>
                          </View>
                        }
                      </ThemedView>
                    </View>
                  </TouchableOpacity>
                </ThemedView>
              )
            }}
            ListHeaderComponent={()=>{
              return(
              <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#999'}]}>
                <ThemedView>
                    {
                      listOsDisponiveis !== null ? 
                      <ThemedText style={[{backgroundColor:theme.backgroundColor.background,color:theme.labels.text}]}>
                        <ThemedText type='default' style={[{backgroundColor:theme.backgroundColor.background,color:theme.labels.text}]}>{listOsDisponiveis.length+' - O.S. ROTERIZADA(S) '}</ThemedText>
                          {
                            date !== '' ? 
                            <ThemedText type='defaultSemiBold'>{' '+date}</ThemedText>
                            :
                            <ThemedText type='defaultSemiBold'>{' '+dataLocal}</ThemedText>
                          }
                        </ThemedText>
                        :
                        <ThemedText type='default' style={[{backgroundColor:theme.backgroundColor.background,color:theme.labels.text}]}>
                          <ThemedText>{'O.S. ROTERIZADA(S)'}</ThemedText>
                          {
                            date !== '' ? 
                            <ThemedText type='defaultSemiBold'>{' '+date}</ThemedText>
                            :
                            <ThemedText type='defaultSemiBold'>{' '+dataLocal}</ThemedText>
                          }
                      </ThemedText>
                    }
                </ThemedView>
                <View style={[Styles.em_linhaHorizontal]}>
                  <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.success,Styles.mr_5,{paddingHorizontal:1,paddingVertical:1,marginHorizontal:0,marginVertical:0}]} onPress={()=>{
                    setLoda(false);
                    inicio();
                  }}
                  >
                    <MaterialCommunityIcons name='sync' size={18} style={[Styles.lblsuccess]}/>  
                  </TouchableOpacity> 
                  <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.info,Styles.mr_5,{paddingHorizontal:1,paddingVertical:1,marginHorizontal:0,marginVertical:0}]} onPress={()=>{
                    apresentaModal(
                      'dialog',
                      'information-variant',
                      'O.S. ROTERIZADAS',
                      ()=>(
                        <View style={[Styles.em_linhaVertical,Styles.w100,{justifyContent:'center',alignItems:'stretch',borderBottomLeftRadius:5,borderBottomRightRadius:5}]}>
                          <ThemedText type='title' style={[Styles.ft_regular,Styles.w100]}>Oque é roterização de O.S.?</ThemedText>
                          <View style={[Styles.w100,{height:2,backgroundColor:theme.labels.text}]}/>
                          <ThemedText type='subtitle'>São Ordens de serviço que tem uma rota definida ou planejada pelo montador e que ja foi agendada e confirmada pelo cliente.</ThemedText>
                        </View>
                      ),
                      'light',
                      ()=>(
                        <View style={[Styles.em_linhaHorizontal,Styles.w100,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}>
                          <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.btnDialog,Styles.btnDialogcentered,Styles.w100,getModalStyle('light'),{marginBottom:2,marginHorizontal:0,elevation:0,borderBottomRightRadius:8,borderBottomLeftRadius:8}]}
                            onPress={()=>{
                              fecharModal()
                            }}
                          >
                            <Text style={[getModalStyleLabel('light')]}>Entendi</Text>
                          </TouchableOpacity>
                        </View>
                      )
                    )
                  }}>
                    <MaterialCommunityIcons name='information-variant' size={18} style={[Styles.lblinfo]}/>  
                  </TouchableOpacity>  
                  <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{paddingHorizontal:1,paddingVertical:1,marginHorizontal:0,marginVertical:0}]} onPress={()=>{showDatepicker('date')}}>
                    <MaterialCommunityIcons name='calendar' size={18} style={[Styles.lblprimary]}/>  
                  </TouchableOpacity>
                </View>                
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={data}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    />
                )}
              </View>

            )}}
            ListEmptyComponent={()=>{
              return(
                <View style={[{width:'95%',marginHorizontal:'2.5%',height:height - 180,alignItems:'center',justifyContent:'center',backgroundColor:theme.backgroundColor.background}]}>
                  {
                    date !=='' &&

                    <TextInput defaultValue={''+date} placeholder='Data' value={''+date} style={[Styles.input,Styles.w100,{marginHorizontal:0,textAlign:'center'}]} onPress={()=>{showDatepicker('date')}}/>
                  }
                  <View style={[Styles.warning,{flexDirection:'column',alignItems:'center',paddingVertical:20,justifyContent:'center',width:'100%',height:'auto',borderRadius:20,elevation:5,}]}>
                    <MaterialCommunityIcons name='sleep' size={57} style={[Styles.lblwarning]}/>
                    <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,Styles.w100,{textAlign:'center'}]}>Sem O.S. ROTERIZADAS EM :{date !== '' ? <ThemedText type='defaultSemiBold' style={[Styles.lblwarning]}>{'\n'+date}</ThemedText>:<ThemedText type='defaultSemiBold' style={[Styles.lblwarning]}>{' '+dataLocal}</ThemedText>}</ThemedText>
                  </View>
                </View>
              )
            }}
          />
        </View>
      )
    }
  } catch (error) {
    console.log('Erro=>',error);
  }
}