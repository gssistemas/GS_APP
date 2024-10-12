import { View,Dimensions, TouchableOpacity} from 'react-native';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import { TextInput, Text,RadioButton} from 'react-native-paper';
import { useContext, useState } from 'react';
import { Styles } from '../../../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';

const {width,height} = Dimensions.get('window');

export default function NotificarLoja({route}:any) {
    const {osInicada,sendNotification,usuario,getModalStyleLabelAlert,getModalStyle,getModalStyleLabel} = useContext<any>(AuthLogin);
    const [title,setTitle] = useState('');
    const [mensagem,setMensagem] = useState('');
    const [value,setValue] = useState('')
    console.log('dados da OS=>',osInicada,'rota=>',route);

    function prioridade(){
        switch (value) {
            case '0':
                return <ThemedText type='defaultSemiBold' style={[Styles.w95,Styles.btn,getModalStyle('light'),getModalStyleLabel('light'),{textAlign:'center'}]}>Prioridade normal</ThemedText>
                break;
            case '3':
                return <ThemedText type='defaultSemiBold' style={[Styles.w95,Styles.btn,getModalStyle('warning'),getModalStyleLabel('warning'),{textAlign:'center'}]}>Prioridade alta</ThemedText>
                break;
            case '5':
                return <ThemedText type='defaultSemiBold' style={[Styles.w95,Styles.btn,getModalStyle('danger'),getModalStyleLabel('danger'),{textAlign:'center'}]}>Com urgência</ThemedText>
                break;
            case '':
                return <ThemedText type='defaultSemiBold' style={[Styles.w95,Styles.btn,getModalStyle('light'),getModalStyleLabel('light'),{textAlign:'center'}]}>Selecione a prioridade...</ThemedText>
                break;
        }
    }

    try {
        return (
            <>
                <ThemedView style={[Styles.w95,{height:height - 140,marginTop:10,borderRadius:5,elevation:2}]}>
                    <TextInput
                        style={[Styles.w95,{marginVertical:10}]}
                        label="Título da notificação"
                        value={title}
                        onChangeText={text => setTitle(text)}
                    />

                    <TextInput
                        style={[Styles.w95,{marginBottom:10}]}
                        label="Mensagem desejada..."
                        value={mensagem}
                        onChangeText={text => setMensagem(text)}
                        multiline={true}
                    />

                    <Text variant="bodySmall" style={[Styles.ft_medium,Styles.btn,Styles.warning,Styles.lblwarning,Styles.w95]}>{'NOTA:\n\nA notificação será enviada para a loja. A mesma se encarregará de fornecer um novo endereço.'}</Text>
                    <ThemedView style={[Styles.w100,Styles.em_linhaVertical]}>
                        <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,Styles.btn,Styles.warning,{justifyContent:'space-between'}]}>
                            <Text variant="bodySmall" style={[Styles.ft_medium,Styles.lblwarning,{borderRadius:50}]}>Remetente:</Text>
                            <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.lblwarning]}/>
                            <Text variant="bodySmall" style={[Styles.ft_medium,Styles.lblwarning,{borderRadius:50}]}>Você</Text>
                        </ThemedView>
                        <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,Styles.btn,Styles.warning,{justifyContent:'space-between'}]}>
                            <Text variant="bodySmall" style={[Styles.ft_medium,Styles.lblwarning,{borderRadius:50}]}>Recebedor:</Text>
                            <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.lblwarning]}/>
                            <Text variant="bodySmall" style={[Styles.ft_medium,Styles.lblwarning,{borderRadius:50}]}>{osInicada.dadosOs.filial[0].codigo_loja+' - '+ osInicada.dadosOs.filial[0].nome}</Text>
                        </ThemedView>
                        <ThemedText type='defaultSemiBold' style={[Styles.w95,{textAlign:'left',paddingVertical:10}]}>Prioridade da mensagem:</ThemedText>
                        <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                            <View style={[Styles.em_linhaHorizontal,Styles.w95,{justifyContent:'space-between',borderWidth:1,borderColor:'#999',borderRadius:4,paddingRight:5,backgroundColor:'#FFF',elevation:2}]}>
                                <View style={[Styles.em_linhaHorizontal]}>
                                    <RadioButton value="0" />
                                    <Text style={[Styles.ft_regular]}>Normal</Text>
                                </View>
                                <View style={[Styles.em_linhaHorizontal]}>
                                    <RadioButton value="3" />
                                    <Text style={[Styles.ft_regular]}>Importante</Text>
                                </View>
                                <View style={[Styles.em_linhaHorizontal]}>
                                    <RadioButton value="5" />
                                    <Text style={[Styles.ft_regular]}>Urgente</Text>
                                </View>
                            </View>
                        </RadioButton.Group>
                        {
                            prioridade()
                        }
                    </ThemedView>
                </ThemedView>
                {
                    title !== '' && mensagem !== '' &&

                    <TouchableOpacity style={[Styles.w95,Styles.em_linhaHorizontal,Styles.btn,Styles.success]}
                        onPress={()=>{
                            sendNotification('montador',{de:usuario.id_user,para:osInicada.dadosOs.filial[0].id,title:osInicada.dadosOs.filial[0].codigo_loja+' - '+osInicada.dadosOs.filial[0].nome+' - '+title,assunto:osInicada.dadosOs.filial[0].codigo_loja+' - '+osInicada.dadosOs.filial[0].nome+' - '+title,mensagem:mensagem,prioridade:value});
                        }}
                    >
                        <MaterialCommunityIcons name='bell-check' size={25} style={[Styles.lblsuccess]}/>
                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Enviar notificação</Text>
                    </TouchableOpacity>
                }
            </>
        );
    } catch (error) {
        console.log(route);
        return (
            <>
                <ThemedView style={[Styles.w95,{height:height - 140,marginTop:10,borderRadius:5,elevation:2}]}>
                    <TextInput
                        style={[Styles.w95,{marginVertical:10}]}
                        label="Título da notificação"
                        value={title}
                        onChangeText={text => setTitle(text)}
                    />

                    <TextInput
                        style={[Styles.w95,{marginBottom:10}]}
                        label="Mensagem desejada..."
                        value={mensagem}
                        onChangeText={text => setMensagem(text)}
                        multiline={true}
                    />

                    <Text variant="bodySmall" style={[Styles.ft_medium,Styles.btn,Styles.warning,Styles.lblwarning,Styles.w95]}>{'NOTA:\n\nA notificação será enviada para a loja. A mesma se encarregará de fornecer um novo endereço.'}</Text>
                    <ThemedView style={[Styles.w100,Styles.em_linhaVertical]}>
                        <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,Styles.btn,Styles.warning,{justifyContent:'space-between'}]}>
                            <Text variant="bodySmall" style={[Styles.ft_medium,Styles.lblwarning,{borderRadius:50}]}>Remetente:</Text>
                            <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.lblwarning]}/>
                            <Text variant="bodySmall" style={[Styles.ft_medium,Styles.lblwarning,{borderRadius:50}]}>Você</Text>
                        </ThemedView>
                        <ThemedView style={[Styles.w95,Styles.em_linhaHorizontal,Styles.btn,Styles.warning,{justifyContent:'space-between'}]}>
                            <Text variant="bodySmall" style={[Styles.ft_medium,Styles.lblwarning,{borderRadius:50}]}>Recebedor:</Text>
                            <MaterialCommunityIcons name='arrow-right' size={25} style={[Styles.lblwarning]}/>
                            <Text variant="bodySmall" style={[Styles.ft_medium,Styles.lblwarning,{borderRadius:50}]}>{route.params.filial[0].codigo_loja+' - '+ route.params.filial[0].nome}</Text>
                        </ThemedView>
                        <ThemedText type='defaultSemiBold' style={[Styles.w95,{textAlign:'left',paddingVertical:10}]}>Prioridade da mensagem:</ThemedText>
                        <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                            <View style={[Styles.em_linhaHorizontal,Styles.w95,{justifyContent:'space-between',borderWidth:1,borderColor:'#999',borderRadius:4,paddingRight:5,backgroundColor:'#FFF',elevation:2}]}>
                                <View style={[Styles.em_linhaHorizontal]}>
                                    <RadioButton value="0" />
                                    <Text style={[Styles.ft_regular]}>Normal</Text>
                                </View>
                                <View style={[Styles.em_linhaHorizontal]}>
                                    <RadioButton value="3" />
                                    <Text style={[Styles.ft_regular]}>Importante</Text>
                                </View>
                                <View style={[Styles.em_linhaHorizontal]}>
                                    <RadioButton value="5" />
                                    <Text style={[Styles.ft_regular]}>Urgente</Text>
                                </View>
                            </View>
                        </RadioButton.Group>
                        {
                            prioridade()
                        }
                    </ThemedView>
                </ThemedView>
                {
                    title !== '' && mensagem !== '' &&

                    <TouchableOpacity style={[Styles.w95,Styles.em_linhaHorizontal,Styles.btn,Styles.success]}
                        onPress={()=>{
                            sendNotification('montador',{de:usuario.id_user,para:route.params.filial[0].id,title:route.params.filial[0].codigo_loja+' - '+route.params.filial[0].nome+' - '+title,assunto:route.params.filial[0].codigo_loja+' - '+route.params.filial[0].nome+' - '+title,mensagem:mensagem,prioridade:value});
                        }}
                    >
                        <MaterialCommunityIcons name='bell-check' size={25} style={[Styles.lblsuccess]}/>
                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Enviar notificação</Text>
                    </TouchableOpacity>
                }
            </>
        );
    }
    
}