import { useContext, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Dimensions} from 'react-native';
import { List,Text,SegmentedButtons} from 'react-native-paper';
import { Styles } from '../../../../assets/Styles/Styles';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Config from '../../../../assets/Config/Config.json';
import axios from 'axios';
const {width,height} = Dimensions.get('window');

export default function NotificationsUser() {
    const {usuario,getModalStyle,getModalStyleLabel,getModalStyleLabelAlert,buscarNotificacoes,notificationsCount,setNotificationsCount} = useContext<any>(AuthLogin);
    const [value, setValue] = useState('all');
    const [filteredNotifications, setFilteredNotifications] = useState(notificationsCount);

    useEffect(()=>{
        
        buscarNotificacoes(usuario.id_login[0].id,usuario.id_login[0].id);
        console.log(usuario);
        filterNotifications(value);
    },[])

    async function marckerDeleteNotification(comando:string,id:string,action:string,de:string){
        const retorno = await axios({
            method:'get',
            url:Config.configuracoes.pastaProcessos,
            params:{
                comando:comando,
                id:id,
                action:action,
                para:de,
            }
        });
        console.log(retorno.data);
        if(retorno.data[0].status === 'OK'){
            buscarNotificacoes(usuario.id_login[0].id,usuario.id_login[0].id);
            filterNotifications(value);
            /*if(retorno.data[0].statusCode === 200) {
                if(retorno.data[0].count_msg > 0){
                    setNotificationsCount(retorno.data[0].dados_notify_app);
                    return {status:'sucesso',code:0,mensagem:retorno.data[0].statusMensagem,count_msg:retorno.data[0].count_msg,retorno:retorno.data[0].dados_notify_app};
                }else{
                    setNotificationsCount(retorno.data[0].dados_notify_app);
                    return {status:'sucesso',code:0,mensagem:'sucesso',count_msg:retorno.data[0].count_msg,retorno:null};
                }
            }*/
        }
    }

    // Função para filtrar notificações com base no tipo (read ou unread)
    const filterNotifications = (type:string) => {
        setFilteredNotifications(null)
        if (type === 'all') {
            setFilteredNotifications(notificationsCount);
        } else {
            const filtered = notificationsCount.filter(notification => notification.type === type);
            setFilteredNotifications(filtered);
        }
    };

    try {
        return (
            <View style={[Styles.w95,{borderRadius:5}]}>
                <View style={[Styles.w100,Styles.em_linhaHorizontal,{paddingVertical:10,marginTop:10,borderBottomWidth:1,borderBottomColor:'#999',marginBottom:10,justifyContent:'space-between'}]}>
                    <Text style={[Styles.ft_bold]}>Suas notificações</Text>
                    <TouchableOpacity style={[Styles.em_linhaHorizontal]}
                        onPress={()=>{
                            buscarNotificacoes(usuario.id_login[0].id,usuario.id_login[0].id);
                        }}
                    >
                        <MaterialCommunityIcons name='sync' size={18} color={'#999'}/>
                        <Text style={[Styles.ft_regular]}>Atualizar</Text>
                    </TouchableOpacity>
                </View>
                <SegmentedButtons
                    value={value}
                    style={[{marginBottom:5}]}
                    onValueChange={(estado)=>{setValue(estado),filterNotifications(value)}}
                    buttons={[
                    {
                        value: 'all',
                        label: 'Todas',
                    },
                    {
                        value: 'read',
                        label: 'Lidas',
                    },
                    { value: 'unread', label: 'Não lida(s)' },
                    ]}
                />

                {
                    filteredNotifications !== null &&
                    <ScrollView showsVerticalScrollIndicator={false} style={[{paddingBottom:15,height:height - 170}]}>
                        <List.AccordionGroup>
                        {

                            filteredNotifications.map((notify:any,i:number)=>{
                                console.log(notify);
                                return(
                                    <List.Accordion key={i} style={[{borderRadius:10,marginVertical:1,backgroundColor:'#FAFAFA'}]} title={notify.accordionTitle} id={notify.accordionKey} left={()=>{
                                        return(
                                            <MaterialCommunityIcons name={notify.type === 'unread' ? 'email' : 'email-open'} size={18} style={[getModalStyleLabelAlert(notify.type === 'unread' ? 'danger' : 'default'),{position:'relative',left:5,marginTop:10}]}/>
                                        )
                                    }}
                                    
                                    >
                                        <List.Item title={notify.accordionTitleItem} style={[Styles.w100,{height:'auto',overflow:'visible',paddingBottom:55,backgroundColor:'#FAFAFA',borderRadius:5}]} titleNumberOfLines={5} descriptionMaxFontSizeMultiplier={5} centered={false}/>
                                        <View style={[Styles.w100,Styles.em_linhaHorizontal,{marginLeft:-20,marginBottom:10}]}>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.w30,Styles.danger,{marginTop:-50,marginHorizontal:0}]}
                                                onPress={()=>{
                                                    marckerDeleteNotification('excluir',notify.accordionKey,'',usuario.id_login[0].id);
                                                }}
                                            >
                                                <MaterialCommunityIcons name='delete' size={25} color={'#000'} style={[Styles.mr_5,Styles.lbldanger]}/>
                                                <Text style={[Styles.ft_regular,Styles.lbldanger]}>Excluir</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.w65,Styles.primary,{marginTop:-50,marginHorizontal:0}]}
                                                onPress={()=>{
                                                    marckerDeleteNotification('marcarlido',notify.accordionKey,'',usuario.id_login[0].id);
                                                }}
                                            >
                                                <MaterialCommunityIcons name='email-open' size={25} color={'#000'} style={[Styles.mr_5,Styles.lblprimary]}/>
                                                <Text style={[Styles.ft_regular,Styles.lblprimary]}>Marcar como lida</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </List.Accordion>
                                )
                            })
                        }
                        </List.AccordionGroup>
                    </ScrollView>
                }
            </View>
        );
    } catch (error) {
        console.log(error);
    }
    
}