import { useContext, useEffect, useState } from 'react';
import { View, Text,ActivityIndicator, TouchableOpacity, ScrollView,Image,Dimensions, Alert} from 'react-native';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Styles } from '../../../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedText } from '../../../Components/ThemedText';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';
import Config from '../../../../assets/Config/Config.json';
const {width,height} = Dimensions.get('window');

export default function Fechamento() {
    const {usuario,parceiroSearch,parceiros,fechamentos,fechamentos_,dataLocal,getModalStyle} = useContext<any>(AuthLogin);
    const [liberado,setLiberado] = useState(false);
    const [data_ini,setData_ini] = useState('');
    const [data_fim,setData_fim] = useState(dataLocal);
    const [value,setValue] = useState('');
    const data = parceiros;

    function formatDateToDMY(inputDate:string) {
        // Verifica se o inputDate é uma string, caso seja, cria um objeto Date
        const date = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
        
        // Extração dos componentes de data
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque os meses são indexados de 0 a 11
        const year = date.getFullYear();
    
        // Retorna a data no formato d/m/Y
        setData_ini(`${day}/${month}/${year}`);
        return `${day}/${month}/${year}`;
    }

    function applyDateMask(inputText:string) {
        // Remove todos os caracteres que não são números
        let sanitized = inputText.replace(/\D/g, '');
        
        // Limita o número de caracteres a 8 (ddmmyyyy)
        if (sanitized.length > 8) {
            sanitized = sanitized.slice(0, 8);
        }
        
        // Adiciona as barras conforme necessário
        if (sanitized.length > 4) {
            sanitized = sanitized.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
        } else if (sanitized.length > 2) {
            sanitized = sanitized.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }
        setData_ini(sanitized);
        return sanitized;
    }

    function applyDateMaskFim(inputText:string) {
        // Remove todos os caracteres que não são números
        let sanitized = inputText.replace(/\D/g, '');
        
        // Limita o número de caracteres a 8 (ddmmyyyy)
        if (sanitized.length > 8) {
            sanitized = sanitized.slice(0, 8);
        }
        
        // Adiciona as barras conforme necessário
        if (sanitized.length > 4) {
            sanitized = sanitized.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
        } else if (sanitized.length > 2) {
            sanitized = sanitized.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }
        setData_fim(sanitized);
        return sanitized;
    }

    useEffect(()=>{
        inicio();
        console.log(fechamentos_)
    },[fechamentos_]);

    async function inicio(){
        const empresas = await parceiroSearch('carregarlojaparceira',usuario.id_user);

        if(empresas.code ===0){
            setLiberado(true);
        }else{
            setLiberado(false);
        }
    }

    function estiloCard(stts:string){
        if(stts ==='Aguardando nota fiscal') {
            return getModalStyle('warning');
        }else if(stts === 'Nota fiscal enviada, Aguardando pagamento'){
            return getModalStyle('info');
        }else if(stts === 'Finalizado, Pagamento efetuado'){
            return getModalStyle('success');
        }
    }

    async function fechamento_(id_empresa:string){
        //modelo: comando:any,idEmpresa:string,user:any,data_ini:any,data_fim:any
        const fat = await fechamentos('buscarfechamento',id_empresa,usuario.id_user,data_ini,data_fim);
        console.log('Lista de fechamentos=>',fat)
        if(fat.code === 0){
            setLiberado(true)
        }else{
            setLiberado(false)
        }
    }

    const renderItem = (item:any) => {
        return (
          <View style={Styles.item}>
            <Text style={Styles.textItem}>{item.label}</Text>
            {item.value === value && (
              <MaterialCommunityIcons
                style={Styles.icon}
                color="blue"
                name="check-all"
                size={20}
              />
            )}
          </View>
        );
    };

    if(!liberado){
        return(
            <View style={[Styles.w100,Styles.em_linhaVertical,{alignItems:'center',justifyContent:'flex-start',height:'100%'}]}>
                <View style={[Styles.w100,Styles.em_linhaVertical,{paddingVertical:10,backgroundColor:'#FFF',alignItems:'flex-start',justifyContent:'space-between',marginVertical:5,elevation:2,paddingHorizontal:5,borderRadius:4}]}>
                    <ThemedText type='defaultSemiBold'>Faturamento</ThemedText>
                    {
                        data !== null &&

                        <Dropdown
                            style={[Styles.dropdown,{minWidth:'100%'}]}
                            placeholderStyle={Styles.placeholderStyle}
                            selectedTextStyle={Styles.selectedTextStyle}
                            inputSearchStyle={Styles.inputSearchStyle}
                            iconStyle={Styles.iconStyle}
                            data={data}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecione a empresa..."
                            searchPlaceholder="Buscar..."
                            value={value}
                            onChange={item => {
                                setValue(item.value);
                                console.log(item.value)
                                setTimeout(() => {
                                    inicio()
                                }, 3000);
                                
                            }}
                            renderLeftIcon={() => (
                                <MaterialCommunityIcons style={Styles.icon} color="black" name="list-status" size={20} />
                            )}
                            renderItem={renderItem}
                        />
                    }
                    
                </View>
                <ActivityIndicator animating={true} size={75}/>
                <ThemedText type='title'>{'Carregando'}</ThemedText>
                <ThemedText type='subtitle'>{'Aguarde um momento...'}</ThemedText>
            </View>
        )
    }else{
        try {
            return (
                <View style={[Styles.em_linhaVertical,Styles.w95,{alignItems:'stretch'}]}>
                    <View style={[Styles.w100,Styles.em_linhaVertical,{paddingVertical:10,backgroundColor:'#FFF',alignItems:'flex-start',justifyContent:'space-between',marginVertical:5,elevation:2,paddingHorizontal:5,borderRadius:4}]}>
                        <ThemedText type='defaultSemiBold'>Fechamentos</ThemedText>
                        {
                            data !== null &&

                            <Dropdown
                                style={[Styles.dropdown,{minWidth:'100%'}]}
                                placeholderStyle={Styles.placeholderStyle}
                                selectedTextStyle={Styles.selectedTextStyle}
                                inputSearchStyle={Styles.inputSearchStyle}
                                iconStyle={Styles.iconStyle}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Selecione a empresa..."
                                searchPlaceholder="Buscar..."
                                value={value}
                                onChange={item => {
                                    setValue(item.value);
                                    //fechamento_(item.value)
                                }}
                                renderLeftIcon={() => (
                                    <MaterialCommunityIcons style={Styles.icon} color="black" name="list-status" size={20} />
                                )}
                                renderItem={renderItem}
                            />
                        }
                    </View>
                    {
                        value !== '' &&

                        <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between'}]}>
                            <View style={[Styles.em_linhaVertical,Styles.w45,{marginHorizontal:0,alignItems:'flex-start'}]}>
                                <ThemedText type='defaultSemiBold'>Data inicial:</ThemedText>
                                <TextInput mode='flat' style={[Styles.w100]} keyboardType='decimal-pad' defaultValue={data_ini} value={data_ini} onFocus={()=>{}} onChangeText={(text)=>{applyDateMask(text)}} placeholder='Ex.: 01/01/1970'/>
                            </View>
                            <View style={[Styles.em_linhaVertical,Styles.w45,{marginHorizontal:0,alignItems:'flex-start'}]}>
                                <ThemedText type='defaultSemiBold'>Data final:</ThemedText>
                                <TextInput mode='flat' style={[Styles.w100]} keyboardType='decimal-pad' defaultValue={data_fim} value={data_fim} onChangeText={(text)=>{applyDateMaskFim(text)}} placeholder='Ex.: 01/01/1970'/>
                            </View>
                        </View>
                    }
                    {
                        value !== '' && data_ini !== '' && data_fim !== '' &&

                        <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.success]}
                            onPress={()=>{
                                if(data_ini === ''){
                                    Alert.alert('ATENÇÃO!!!','Por favor, Inidique uma data inicial para pesquizar os fechamentos.');
                                }else{
                                    fechamento_(value);
                                }
                            }}
                        >
                            <MaterialCommunityIcons name='magnify' size={25} style={[Styles.lblsuccess,Styles.mr_5]}/>
                            <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Buscar fechamentos</Text>
                        </TouchableOpacity>
                    }
                    {
                        fechamentos_ === null &&

                        <View style={[Styles.w100,Styles.em_linhaVertical,Styles.btn,Styles.warning]}>
                            <MaterialCommunityIcons name='alert-circle' size={75} style={[Styles.lblwarning,Styles.mr_5]}/>
                            <Text style={[Styles.ft_bold,Styles.lblwarning]}>{'Nenhum fechamento encontrado!'}</Text>
                        </View>
                    }
                    {
                        fechamentos_ !== null &&

                        <ScrollView style={[{height:height - 305}]}>
                            {
                                fechamentos_.map((fech:any,i:number)=>{
                                    console.log(fech);
                                    return(
                                        <View key={i} style={[Styles.em_linhaVertical,Styles.btn,Styles.w100,estiloCard(fech.status),{}]}>
                                            <View style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,{justifyContent:'space-between'}]}>
                                                <ThemedText type='subtitle'>Cóc. fechamento:</ThemedText>
                                                <ThemedText type='subtitle'>{'#'+fech.codigo}</ThemedText>
                                            </View>
                                            <View style={[Styles.em_linhaVertical,Styles.btn,Styles.w100,{justifyContent:'flex-start',alignItems:'flex-start'}]}>
                                                <ThemedText type='subtitle'>Solicitante:</ThemedText>
                                                <View style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                                    {
                                                        fech.id_loja[0].imagem === '' ?

                                                        <MaterialCommunityIcons name='account-circle' size={32} color={'#000'}/>
                                                        :
                                                        <Image source={{uri:Config.configuracoes.pathPadrao+fech.id_loja[0].imagem}} style={[Styles.mr_5,{width:64,height:32,resizeMode:'stretch',borderRadius:4}]}/>
                                                    }
                                                    <ThemedText type='defaultSemiBold'>{fech.id_loja[0].nome}</ThemedText>
                                                </View>
                                            </View>
                                            <View style={[Styles.em_linhaVertical,Styles.btn,Styles.w100,{justifyContent:'flex-start',alignItems:'flex-start'}]}>
                                                <ThemedText type='subtitle'>Profissional:</ThemedText>
                                                <View style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                                    {
                                                        fech.id_profissional.imagem === '' ?

                                                        <MaterialCommunityIcons name='account-circle' size={32} color={'#000'}/>
                                                        :
                                                        <Image source={{uri:Config.configuracoes.pathPadrao+fech.id_profissional.imagem}} style={[Styles.mr_5,{width:32,height:32,resizeMode:'stretch',borderRadius:50}]}/>
                                                    }
                                                    <ThemedText type='subtitle'>{fech.id_profissional.nome}</ThemedText>
                                                </View>
                                            </View>
                                            <View style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,{justifyContent:'space-between'}]}>
                                                <ThemedText type='subtitle'>Id fechamento:</ThemedText>
                                                <ThemedText type='subtitle'>{fech.id}</ThemedText>
                                            </View>
                                            <View style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,{justifyContent:'space-between'}]}>
                                                <ThemedText type='subtitle'>{fech.data_ini}</ThemedText>
                                                <ThemedText type='subtitle'>{fech.data_fim}</ThemedText>
                                            </View>
                                            <View style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,{justifyContent:'space-between'}]}>
                                                <ThemedText type='subtitle'>Data:</ThemedText>
                                                <ThemedText type='subtitle'>{fech.data_fechamento}</ThemedText>
                                            </View>
                                            <View style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,{justifyContent:'space-between'}]}>
                                                <View style={[Styles.w45,Styles.btn,Styles.em_linhaVertical,Styles.primary,{marginHorizontal:0,justifyContent:'flex-start',alignItems:'flex-start'}]}>
                                                    <ThemedText type='subtitle' style={[Styles.lblprimary]}>Acréssimos:</ThemedText>
                                                    <ThemedText type='subtitle' style={[Styles.lblprimary]}>{'R$ '+(fech.acressimos).toFixed(2).replace('.',',')}</ThemedText>
                                                </View>
                                                <View style={[Styles.w45,Styles.btn,Styles.em_linhaVertical,Styles.danger,{marginHorizontal:0,justifyContent:'flex-start',alignItems:'flex-start'}]}>
                                                    <ThemedText type='subtitle' style={[Styles.lbldanger]}>Descontos:</ThemedText>
                                                    <ThemedText type='subtitle' style={[Styles.lbldanger]}>{'R$ '+(fech.descontos).toFixed(2).replace('.',',')}</ThemedText>
                                                </View>
                                            </View>
                                            <View style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,{justifyContent:'space-between'}]}>
                                                <ThemedText type='subtitle'>Nota fiscal:</ThemedText>
                                                <ThemedText type='subtitle'>{fech.nf === '' ? 'Aguardando envio da nota':'Nota enviada'}</ThemedText>
                                            </View>
                                            <View style={[Styles.em_linhaVertical,Styles.btn,Styles.w100,{justifyContent:'flex-start',alignItems:'flex-start'}]}>
                                                <ThemedText type='subtitle'>Status:</ThemedText>
                                                <ThemedText type='subtitle'>{fech.status}</ThemedText>
                                            </View>
                                            <View style={[Styles.em_linhaHorizontal,Styles.btn,Styles.w100,{justifyContent:'space-between'}]}>
                                                <ThemedText type='subtitle'>Total:</ThemedText>
                                                <ThemedText type='subtitle'>{'R$'+(fech.total).toFixed(2).replace('.',',')}</ThemedText>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    }
                </View>
            );
        } catch (error) {
            console.log(error);
        }
    }
}