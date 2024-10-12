import React, {useState,useEffect, useContext}from 'react';
import { View, Text,Dimensions, ActivityIndicator} from 'react-native';
import { DataTable } from 'react-native-paper';
import { Styles } from '../../../../assets/Styles/Styles';
import { ThemedText } from '../../../Components/ThemedText';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Dropdown } from 'react-native-element-dropdown';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
const {width,height} = Dimensions.get('window');

export default function Faturamento() {
    const {theme} = useTheme();
    const {usuario,faturamento,itemsFat,qtdOs,totalFat,parceiroSearch,parceiros,getModalStyle,getModalStyleLabel} = useContext<any>(AuthLogin);
    const [page, setPage] = useState<number>(0);
    const [value, setValue] = useState<null|string>(null);
    const [liberado,setLiberado] = useState(false);
    const [numberOfItemsPerPageList] = useState([1,2,3,4,5,7,8,9,10]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[8]
    );
    const [items] = useState(itemsFat);
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

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, itemsFat === null || itemsFat === undefined ? 0 : itemsFat.length);

    useEffect(() => {
        inicio();
        setPage(0);
    }, [itemsPerPage]);
    //console.log(usuario)
    async function inicio(){
        const empresas = await parceiroSearch('carregarlojaparceira',usuario.id_user);

        if(empresas.code ===0){
            setLiberado(true);
        }else{
            setLiberado(false);
        }
    }

    async function fechamento(id_empresa:string){
        const fat = await faturamento('faturamentoApp',null,null,id_empresa,usuario.id_login[0].id);
        if(fat.code === 0){
            setLiberado(true)
            console.log('faturamento=>',fat)
        }else{
            setLiberado(false)
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
                        <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text,borderBottomWidth:1,borderBottomColor:theme.labels.text,paddingVertical:5,width:'100%',marginBottom:10,}]}>Faturamento</ThemedText>
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
                                    setValue(item.value);
                                    fechamento(item.value)
                                }}
                                renderLeftIcon={() => (
                                    <MaterialCommunityIcons style={Styles.icon} color={theme.labels.text} name="list-status" size={20} />
                                )}
                                renderItem={renderItem}
                            />
                        }
                    </View>
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
                        <DataTable style={[Styles.w100,{height:'70%',backgroundColor:theme.backgroundColor.background,marginVertical:5,elevation:2,paddingHorizontal:5,borderRadius:4}]}>
                            <DataTable.Header style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                                <DataTable.Title textStyle={[{color:theme.labels.text}]}>#</DataTable.Title>
                                <DataTable.Title textStyle={[{color:theme.labels.text}]}>NF</DataTable.Title>
                                <DataTable.Title textStyle={[{color:theme.labels.text}]}>Cliente</DataTable.Title>
                                <DataTable.Title textStyle={[{color:theme.labels.text}]}>Valor</DataTable.Title>
                            </DataTable.Header>

                            {itemsFat.slice(from, to).map((item:any) => (
                                <DataTable.Row key={item.key} style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                                    <DataTable.Cell textStyle={[{color:theme.labels.text}]}>{item.key}</DataTable.Cell>
                                    <DataTable.Cell textStyle={[{color:theme.labels.text}]}>{item.nf}</DataTable.Cell>
                                    <DataTable.Cell textStyle={[{color:theme.labels.text}]}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell textStyle={[{color:theme.labels.text}]}>{(item.fat).toFixed(2).replace('.',',')}</DataTable.Cell>
                                </DataTable.Row>
                            ))}

                            {/*<DataTable.Pagination
                                page={page}
                                numberOfPages={Math.ceil(itemsFat === null || itemsFat === undefined ? 0 : itemsFat.length / itemsPerPage +1)}
                                onPageChange={(page) => setPage(page)}
                                label={`Mostrando ${to} de ${itemsFat === null || itemsFat === undefined ? 0 : itemsFat.length} Registros`}
                                numberOfItemsPerPageList={numberOfItemsPerPageList}
                                numberOfItemsPerPage={itemsPerPage}
                                onItemsPerPageChange={onItemsPerPageChange}
                                showFastPaginationControls
                                selectPageDropdownLabel={'Linhas por página'}
                                style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}
                            />*/}
                        </DataTable>
                    }
                    <View style={[Styles.w100,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                        <ThemedText type='defaultSemiBold' style={[Styles.btn,qtdOs === 0 ? getModalStyle('warning'):getModalStyle('success'),{color:qtdOs === 0 ? getModalStyleLabel('warning') : getModalStyleLabel('success')}]}>Qtd O.S.: {qtdOs}</ThemedText>
                        <ThemedText type='defaultSemiBold' style={[Styles.btn,qtdOs === 0 ? getModalStyle('warning'):getModalStyle('success'),{color:qtdOs === 0 ? getModalStyleLabel('warning') : getModalStyleLabel('success')}]}>Total faturado:R$ {(totalFat).toFixed(2).replace('.',',')}</ThemedText>
                    </View>
                </View>
            );
        } catch (error) {
            console.log(error);
        }
    }
}