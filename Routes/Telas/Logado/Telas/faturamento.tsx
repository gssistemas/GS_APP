import React, {useState,useEffect, useContext, useRef}from 'react';
import { View, Text,Dimensions, ActivityIndicator, TouchableOpacity, Modal, TouchableWithoutFeedback, Animated, PanResponder} from 'react-native';
import { DataTable,TextInput} from 'react-native-paper';
import { Styles } from '../../../../assets/Styles/Styles';
import { ThemedText } from '../../../Components/ThemedText';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Dropdown } from 'react-native-element-dropdown';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import { ThemedView } from '../../../Components/ThemedView';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
const {width,height} = Dimensions.get('window');

export default function Faturamento() {
    const {theme} = useTheme();
    const {usuario,faturamento,setFa,itemsFat,setItemsFat,qtdOs,dataLocal,totalFat,parceiroSearch,parceiros,getModalStyle,getModalStyleLabel} = useContext<any>(AuthLogin);
    const [page, setPage] = useState<number>(0);
    const [value, setValue] = useState<null|string>(null);
    const [liberado,setLiberado] = useState(false);
    const [numberOfItemsPerPageList] = useState([1,2,3,4,5,6,7,8]);
    const [data_ini,setData_ini] = useState('');
    const [data_fim,setData_fim] = useState('');
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[7]
    );
    const windowHeight = Dimensions.get('window').height;
    const [icone,setIcone] = useState<string|symbol>('menu');
    const [items] = useState(itemsFat);
    const [hour,setHour] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [descriptionEvent,setDescriptionEvent] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    let [dataIni,setDataIni] = useState(new Date());
    let [dataFim,setDataFim] = useState(new Date());
    const [typeDate,setTypeDate] = useState('');
    /*const [items] = useState([
        {
          key: 1,
          name: 'Cupcake',
          calories: 356,
          fat: 16,
        },
        {
          key: 2,
          name: 'Eclair',
          calories: 262,
          fat: 16,
        },
        {
          key: 3,
          name: 'Frozen yogurt',
          calories: 159,
          fat: 6,
        },
        {
          key: 4,
          name: 'Gingerbread',
          calories: 305,
          fat: 3.7,
        },
    ]);*/

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
                const hours = String(currentDate.getUTCHours()).padStart(2, '0');
                const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
                const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');
        
                const formattedTime = `${hours}:${minutes}:${seconds}`;
                setHour(formattedTime);
            }
    };

    const onChange = (event:any, selectedDate:any) => {
        
        const currentDate = selectedDate;
        setShow(false);
        //setDate(currentDate);
        console.log(typeDate);
        if(mode === 'date'){
            if(typeDate === 'dataIni'){
                /*setDataIni(currentDate);
                const day = String(dataIni.getUTCDate() - 1).padStart(2, '0');
                const month = String(dataIni.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
                const year = String(dataIni.getUTCFullYear()).slice(-4); // Pegando os quatro últimos dígitos do ano

                const formattedDate = `${day}/${month}/${year}`;
                setData_ini(formattedDate); // Saída: 21/08/20
                // Pegar o dia da semana correspondente
                const daysOfWeek = [
                    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
                    'Quinta-feira', 'Sexta-feira', 'Sábado'
                ];
                const day_ = daysOfWeek[currentDate.getDay()];
                setDayOfWeek(day_);*/
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
            }else if(typeDate === 'dataFim'){
                /*setDataFim(currentDate);
                const day = String(dataFim.getUTCDate() - 1).padStart(2, '0');
                const month = String(dataFim.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
                const year = String(dataFim.getUTCFullYear()).slice(-4); // Pegando os quatro últimos dígitos do ano

                const formattedDate = `${day}/${month}/${year}`;
                setData_fim(formattedDate); // Saída: 21/08/20
                // Pegar o dia da semana correspondente
                const daysOfWeek = [
                    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
                    'Quinta-feira', 'Sexta-feira', 'Sábado'
                ];
                const day_ = daysOfWeek[currentDate.getDay()];
                setDayOfWeek(day_);*/
                const day = String(currentDate.getUTCDate()).padStart(2, '0');
                const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
                const year = String(currentDate.getUTCFullYear()).slice(-4); // Pegando os quatro últimos dígitos do ano
        
                const formattedDate = `${day}/${month}/${year}`;
                console.log('Data corrente', currentDate, 'Data selecionada:', formattedDate);
                setData_fim(formattedDate); // Saída: 21/08/2024
        
                // Pegar o dia da semana correspondente
                const daysOfWeek = [
                    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
                    'Quinta-feira', 'Sexta-feira', 'Sábado'
                ];
                const dayOfWeek = daysOfWeek[currentDate.getDay()];
                setDayOfWeek(dayOfWeek);
            }
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

    const [visibleMenu, setVisibleMenu] = useState(false);
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

    const toggleMenu = () => {
        if (visibleMenu) {
            // Animar para deslizar para baixo e fechar
            Animated.timing(slideAnim, {
                toValue: Dimensions.get('window').height,
                duration: 300,
                useNativeDriver: true
            }).start(() => setVisibleMenu(false));
            setIcone('microsoft-xbox-controller-menu');
        } else {
            setVisibleMenu(true);
            // Animar para deslizar para cima e abrir
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
            setIcone('menu');
        }
    };

    const panResponder = useRef(
        PanResponder.create({
          onMoveShouldSetPanResponder: (_, gestureState) => {
            // Habilitar o gesto de arraste quando o usuário mover o dedo para baixo
            return gestureState.dy > 20;
          },
          onPanResponderMove: (_, gestureState) => {
            // Atualizar a posição do menu enquanto arrasta para baixo
            if (gestureState.dy > 0) {
              slideAnim.setValue(gestureState.dy);
            }
          },
          onPanResponderRelease: (_, gestureState) => {
            // Fechar o menu se for arrastado além de 150px
            if (gestureState.dy > 150) {
              toggleMenu();
            } else {
              // Caso contrário, deslizar de volta para cima
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
              }).start();
            }
          }
        })
    ).current;

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, itemsFat === null || itemsFat === undefined ? 0 : itemsFat.length);

    useEffect(() => {
        inicio();
        setPage(0);
    }, [itemsPerPage]);
    
    async function inicio(){
        const empresas = await parceiroSearch('carregarlojaparceira',usuario.id_user);

        if(empresas.code ===0){
            setLiberado(true);
        }else{
            setLiberado(false);
        }
    }

    async function fechamento(id_empresa:string){
        const fat = await faturamento('faturamentoApp',data_ini !== '' ? data_ini : null,data_fim !== '' ? data_fim : null,usuario.id_login[0].id,id_empresa);
        if(fat.code === 0){
            setLiberado(true)
            setShow(false);
            setItemsFat(fat.return);
            console.log('faturamento=>',fat)
        }else{
            setLiberado(false);
            setItemsFat(null);
        }
    }

    const data = parceiros;

    const renderItem = (item:any) => {
        return (
          <View style={[Styles.item,{backgroundColor:theme.backgroundColor.background}]}>
            <Text style={[Styles.textItem,{color:theme.labels.text}]}>{item.label}</Text>
            {item.value === value && (
              <MaterialCommunityIcons
                style={[Styles.icon,{color:theme.labels.text}]}
                color={theme.labels.text}
                name="check-all"
                size={20}
              />
            )}
          </View>
        );
    };

    if(!liberado){
        return(
            <View style={[Styles.w100,Styles.em_linhaVertical,{alignItems:'center',justifyContent:'flex-start',height:'100%',backgroundColor:theme.backgroundColor.background}]}>
                <View style={[Styles.w100,Styles.em_linhaVertical,{paddingVertical:10,backgroundColor:theme.backgroundColor.background,alignItems:'flex-start',justifyContent:'space-between',marginVertical:5,elevation:2,paddingHorizontal:5,borderRadius:4}]}>
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
                <ActivityIndicator animating={true} size={75} color={theme.labels.text}/>
                <ThemedText type='title' style={[{color:theme.labels.text}]}>{'Carregando'}</ThemedText>
                <ThemedText type='subtitle' style={[{color:theme.labels.text}]}>{'Aguarde um momento...'}</ThemedText>
            </View>
        )
    }else{
        try {
            return (
                <View style={[Styles.em_linhaVertical,Styles.w100,{height:'100%',alignItems:'stretch',justifyContent:'flex-start',backgroundColor:theme.backgroundColor.background}]}>
                    <View style={[Styles.w100,Styles.em_linhaVertical,{paddingVertical:10,backgroundColor:theme.backgroundColor.background,alignItems:'flex-start',justifyContent:'space-between',marginVertical:5,elevation:2,paddingHorizontal:5,borderRadius:4}]}>
                        <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'space-between',borderBottomWidth:1,marginBottom:10,}]}>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text,paddingVertical:5,marginBottom:5,}]}>Faturamento</ThemedText>
                            <View style={[Styles.em_linhaHorizontal,Styles.btn,getModalStyle('success'),{justifyContent:'space-between',paddingHorizontal:10,paddingVertical:0,borderRadius:5,}]}>
                                <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>{qtdOs}</ThemedText>
                                <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}> - R$ {(totalFat).toFixed(2).replace('.',',')}</ThemedText>
                            </View>
                            <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between',borderBottomColor:theme.labels.text,}]}>
                                <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{paddingHorizontal:0,paddingVertical:0}]} onPress={()=>{fechamento(value)}}>
                                    <MaterialCommunityIcons name='sync' size={18} style={[Styles.lblprimary]}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.primary,{paddingHorizontal:0,paddingVertical:0}]} onPress={()=>{toggleMenu()}}>
                                    <MaterialCommunityIcons name='calendar-multiselect' size={18} style={[Styles.lblprimary]}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            data !== null &&

                            <Dropdown
                                style={[Styles.dropdown,{minWidth:'100%',backgroundColor:theme.backgroundColor.background}]}
                                placeholderStyle={[Styles.placeholderStyle,{color:theme.labels.text}]}
                                selectedTextStyle={[Styles.selectedTextStyle,{color:theme.labels.text}]}
                                inputSearchStyle={[Styles.inputSearchStyle,{color:theme.labels.text}]}
                                iconStyle={[Styles.iconStyle,{tintColor:theme.labels.text}]}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Selecione a empresa..."
                                searchPlaceholder="Buscar..."
                                value={value}
                                onChange={item => {
                                    setValue(item.value)
                                }}
                                renderLeftIcon={() => (
                                    <MaterialCommunityIcons style={Styles.icon} color={theme.labels.text} name="list-status" size={20} />
                                )}
                                renderItem={renderItem}
                            />
                        }
                    </View>
                    {
                        data_ini !=='' && data_fim !== '' &&
                    
                        <ThemedView style={[Styles.w100,Styles.btn,Styles.info,Styles.em_linhaHorizontal,{justifyContent:'center'}]}>
                            <ThemedText type='default' style={[Styles.lblinfo]}>De: {data_ini}</ThemedText>
                            <ThemedText type='default' style={[Styles.lblinfo]}> à </ThemedText>
                            <ThemedText type='default' style={[Styles.lblinfo,Styles.mr_5]}>{data_fim}</ThemedText>
                            
                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary,{paddingHorizontal:2,paddingVertical:2}]}
                                onPress={()=>{
                                    setData_ini('');
                                    setData_fim('');
                                    fechamento(value);
                                }}
                            >
                                <MaterialCommunityIcons name='filter-remove' size={18} style={[Styles.lblprimary,Styles.mr_5]}/>
                                <Text style={[Styles.primary,Styles.lblprimary]}>Limpar datas</Text>
                            </TouchableOpacity>
                        </ThemedView>
        }
                    {
                        itemsFat === null && 

                        <View style={[Styles.em_linhaVertical,Styles.btn,Styles.warning]}>
                            <ThemedText type='defaultSemiBold' style={[{textAlign:'center'}]}>Sem faturamento</ThemedText>
                            <MaterialCommunityIcons name='archive-alert' size={75} style={[Styles.lblwarning]}/>
                            <Text style={[Styles.ft_bold,Styles.lblwarning,{textAlign:'center'}]}>{'Nenhum faturamento encontrado para esta empresa, Verifique se as Ordem de Sserviços foram baixadas pela solicitante, Você pode acompanhar os detalhes na tela de "fechamentos".'}</Text>
                        </View>
                    }
                    {
                        itemsFat === undefined &&

                        <View style={[Styles.em_linhaVertical,Styles.btn,Styles.warning]}>
                            <ThemedText type='defaultSemiBold' style={[{textAlign:'center'}]}>Sem faturamento</ThemedText>
                            <MaterialCommunityIcons name='archive-alert' size={75} style={[Styles.lblwarning]}/>
                            <Text style={[Styles.ft_bold,Styles.lblwarning,{textAlign:'center'}]}>{'Nenhum faturamento encontrado para esta empresa, Verifique se as Ordem de Sserviços foram baixadas pela solicitante, Você pode acompanhar os detalhes na tela de "fechamentos".'}</Text>
                        </View>
                    }
                    {
                        itemsFat !== null && itemsFat !== undefined &&
                        <>
                            <DataTable style={[Styles.w100,{height:'60%',backgroundColor:theme.backgroundColor.background,marginVertical:5,elevation:2,paddingHorizontal:5,borderRadius:4}]}>
                                <DataTable.Header style={{}}>
                                    <DataTable.Title maxFontSizeMultiplier={5} textStyle={[{marginHorizontal:0,paddingHorizontal:0,color:theme.labels.text,maxWidth:15,minWidth:15,width:15}]}>#</DataTable.Title>
                                    <DataTable.Title maxFontSizeMultiplier={5} textStyle={[{marginHorizontal:0,paddingHorizontal:0,color:theme.labels.text,maxWidth:15,minWidth:15,width:15}]}>NF</DataTable.Title>
                                    <DataTable.Title maxFontSizeMultiplier={5} textStyle={[{marginHorizontal:0,paddingHorizontal:0,color:theme.labels.text,width:'100%'}]}>Cliente</DataTable.Title>
                                    <DataTable.Title maxFontSizeMultiplier={5} textStyle={[{marginHorizontal:0,paddingHorizontal:0,color:theme.labels.text}]}>Valor</DataTable.Title>
                                </DataTable.Header>

                                {itemsFat.slice(from, to).map((item:any) => (
                                    <DataTable.Row key={item.key} style={[]}>
                                        <DataTable.Cell maxFontSizeMultiplier={5} textStyle={[{color:theme.labels.text}]}>{item.key}</DataTable.Cell>
                                        <DataTable.Cell maxFontSizeMultiplier={5} textStyle={[{color:theme.labels.text,marginHorizontal:0,paddingHorizontal:0}]}>{item.nf}</DataTable.Cell>
                                        <DataTable.Cell maxFontSizeMultiplier={5} textStyle={[{color:theme.labels.text,width:'100%'}]}>{item.name}</DataTable.Cell>
                                        <DataTable.Cell maxFontSizeMultiplier={5} textStyle={[{color:theme.labels.text}]}>{(item.fat).toFixed(2).replace('.',',')}</DataTable.Cell>
                                    </DataTable.Row>
                                ))}

                                {<DataTable.Pagination
                                    page={page}
                                    numberOfPages={Math.ceil(itemsFat === null || itemsFat === undefined ? 0 : itemsFat.length / itemsPerPage +1)}
                                    onPageChange={(page) => setPage(page)}
                                    label={`Mostrando "${to}" registros de "${itemsFat === null || itemsFat === undefined ? 0 : itemsFat.length}" registros`}
                                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                                    //numberOfItemsPerPage={itemsPerPage}
                                    onItemsPerPageChange={onItemsPerPageChange}
                                    showFastPaginationControls
                                    //selectPageDropdownLabel={'Linhas por página'}
                                    style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'center'}]}
                                />}
                            </DataTable>
                        </>
                    }
                    <Modal transparent visible={visibleMenu} animationType="none">
                        <TouchableWithoutFeedback onPress={()=>{toggleMenu()}}>
                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <TouchableWithoutFeedback>
                                <Animated.View
                                    {...panResponder.panHandlers}
                                    style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    transform: [{ translateY: slideAnim }],
                                    backgroundColor: '#FFF',
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 20,
                                    elevation: 5
                                    }}>
                                    {/* Conteúdo do menu */}
                                    <View style={[Styles.em_linhaVertical,{}]}>
                                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{backgroundColor:'#FFF',alignItems:'flex-start',marginHorizontal:0}]}>
                                            <ThemedText type='defaultSemiBold' style={[{marginBottom:5,color:'#000000'}]}>Data inicial:</ThemedText>
                                            <TextInput defaultValue={''+data_ini} placeholder='Data inicial' value={''+data_ini} style={[Styles.input,Styles.w100,{borderBottomWidth:0,marginHorizontal:0,textAlign:'center'}]} onPress={()=>{setTypeDate('dataIni'),showDatepicker('date')}}/>
                                        </ThemedView>
                                        <ThemedView style={[Styles.em_linhaVertical,Styles.w100,{backgroundColor:'#FFF',alignItems:'flex-start',marginHorizontal:0}]}>
                                            <ThemedText type='defaultSemiBold' style={[{marginBottom:5,color:'#000000'}]}>Data final:</ThemedText>
                                            <TextInput defaultValue={''+data_fim} placeholder='Data final' value={''+data_fim} style={[Styles.input,Styles.w100,{borderBottomWidth:0,marginHorizontal:0,textAlign:'center'}]} onPress={()=>{setTypeDate('dataFim'),showDatepicker('date')}}/>
                                        </ThemedView>
                                        {
                                            data_ini !== '' && data_fim !== '' && value !== null &&

                                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.primary]} onPress={()=>{setShow(false),fechamento(value),setLiberado(false),setItemsFat(null)}}>
                                                <MaterialCommunityIcons name='magnify' size={25} style={[Styles.lblprimary]}/>
                                                <Text style={[Styles.ft_regular,Styles.lblprimary]}>Buscar</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </Animated.View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    {show && 
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={typeDate === 'dataIni' ? dataIni : dataFim}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                        />
                    }
                </View>
            );
        } catch (error) {
            console.log(error);
        }
    }
}