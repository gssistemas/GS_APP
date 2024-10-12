import { TouchableOpacity, View,Text} from 'react-native';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import { TextInput } from 'react-native-paper';
import { useContext } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Styles } from '../../../../assets/Styles/Styles';

export default function Filters({navigation}:any) {
    const {dataInicial,setDataInicial,dataFinal,setDataFinal,nomeCliente,setNomeCliente,ordemServico,setOrdemServico,dataLocal,nf,setNf} = useContext<any>(AuthLogin);

    const formatDate = (input:string) => {
        // Remove todos os caracteres não numéricos
        const cleaned = input.replace(/\D/g, '');
    
        // Formata a string para d/m/Y
        let formatted = '';
        if (cleaned.length > 0) {
          formatted += cleaned.substring(0, 2); // Dia
        }
        if (cleaned.length >= 3) {
          formatted += '/' + cleaned.substring(2, 4); // Mês
        }
        if (cleaned.length >= 5) {
          formatted += '/' + cleaned.substring(4, 8); // Ano
        }
        return formatted;
    };

    const handleChangeInicial = (text:string) => {
        const formattedDate = formatDate(text);
        setDataInicial(formattedDate);
    };

    const handleChangeFinal = (text:string) => {
        const formattedDate = formatDate(text);
        setDataFinal(formattedDate);
    };

    return (
        <ThemedView style={[{height:'100%'}]}>
            <ThemedText type='defaultSemiBold' style={[Styles.w95,{marginBottom:10,marginTop:15}]}>Filtrar por data:</ThemedText>
            <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                <TextInput
                    style={[Styles.w45,Styles.ft_regular,{marginHorizontal:0}]}
                    label="Data inicial:"
                    value={dataInicial}
                    onChangeText={(text)=>{handleChangeInicial(text)}}
                />
                <TextInput
                    style={[Styles.w45,Styles.ft_regular,{marginHorizontal:0}]}
                    label="Data final:"
                    value={dataFinal === '' ? dataLocal : dataFinal}
                    onChangeText={(text)=>{handleChangeFinal(text)}}
                />
            </ThemedView>
            <ThemedText type='defaultSemiBold' style={[Styles.w95,{marginBottom:10,marginTop:15}]}>Filtrar por Cliente:</ThemedText>
            <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                <TextInput
                    style={[Styles.w100,Styles.ft_regular,{marginHorizontal:0}]}
                    label="Nome do cliente:"
                    value={nomeCliente}
                    onChangeText={(text)=>{setNomeCliente(text)}}
                />
            </ThemedView>
            <ThemedText type='defaultSemiBold' style={[Styles.w95,{marginBottom:10,marginTop:15}]}>N° O.S.:</ThemedText>
            <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                <TextInput
                    style={[Styles.w100,Styles.ft_regular,{marginHorizontal:0}]}
                    label="Digite o número da O.S.:"
                    value={ordemServico}
                    onChangeText={(text)=>{setOrdemServico(text)}}
                />
            </ThemedView>
            <ThemedText type='defaultSemiBold' style={[Styles.w95,{marginBottom:10,marginTop:15}]}>N° nota fiscal:</ThemedText>
            <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                <TextInput
                    style={[Styles.w100,Styles.ft_regular,{marginHorizontal:0}]}
                    label="Digite o número da nota fiscal:"
                    value={nf}
                    onChangeText={(text)=>{setNf(text)}}
                />
            </ThemedView>
            {
                dataInicial !== '' || dataFinal !== '' || nomeCliente !== '' || ordemServico !== '' || nf !== '' &&


                <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.danger]}
                        onPress={()=>{
                            setDataInicial('');
                            setDataFinal('');
                            setNomeCliente('');
                            setOrdemServico('');
                            setNf('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbldanger]}>Limpar filtros</Text>
                    </TouchableOpacity>
                </ThemedView>
            }
            <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.success]}
                    onPress={()=>{navigation.goBack()}}
                >
                    <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Aplicar filtros</Text>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    );
}