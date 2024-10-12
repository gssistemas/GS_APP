import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { View,Text, TouchableOpacity, Alert} from 'react-native';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {useNavigation} from '@react-navigation/native';

export default function HeaderFilterIndex() {
    const navigation = useNavigation();
    const {logof,dataInicial,setDataInicial,dataFinal,setDataFinal,nomeCliente,setNomeCliente,ordemServico,setOrdemServico,dataLocal,nf,setNf} = useContext<any>(AuthLogin);
    //console.log('dados user=>',data)
    //console.log('filtros',dataInicial, dataFinal, nomeCliente,ordemServico,)
    try {
        return (
            <TouchableOpacity
                onPress={()=>{
                    navigation.navigate('filters');
                }}
            >
                <MaterialCommunityIcons name={dataInicial !== '' && dataInicial !== undefined && dataFinal !== '' && dataFinal !== undefined && nomeCliente !== '' && nomeCliente !== undefined && ordemServico !== '' && ordemServico !== undefined && nf !== '' && nf !== undefined ? 'filter-check' : 'filter'} size={25} color={dataInicial !== '' && dataInicial !== undefined && dataFinal !== '' && dataFinal !== undefined && nomeCliente !== '' && nomeCliente !== undefined && ordemServico !== '' && ordemServico !== undefined && nf !== '' && nf !== undefined ? 'blue' : 'black'}/>
            </TouchableOpacity>   
        );
    } catch (error:any) {
        Alert.alert('Erro de inicio','Corrija o erro na linha 88=>',error.message)
    }
    
}