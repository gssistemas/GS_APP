import { useContext, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Dimensions} from 'react-native';
import { List,Text,SegmentedButtons} from 'react-native-paper';
import { Styles } from '../../../../assets/Styles/Styles';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {MaterialCommunityIcons} from '@expo/vector-icons';
const {width,height} = Dimensions.get('window');

export default function NotificationsUser() {
    const {usuario,getModalStyle,getModalStyleLabel,getModalStyleLabelAlert,buscarNotificacoes,notificationsCount,setNotificationsCount} = useContext<any>(AuthLogin);
    const [value, setValue] = useState('all');
    const [filteredNotifications, setFilteredNotifications] = useState(notificationsCount);

    useEffect(()=>{
        filterNotifications(value);
        buscarNotificacoes(usuario.id_login[0].id,usuario.id_login[0].id);
        console.log(usuario);
    },[])

    

    // Função para filtrar notificações com base no tipo (read ou unread)
    const filterNotifications = (type:string) => {
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
                                
                                return(
                                    <List.Accordion key={i} style={[{borderRadius:10,marginVertical:1,backgroundColor:'#FAFAFA'}]} title={notify.accordionTitle} id={notify.accordionKey} left={()=>{
                                        return(
                                            <MaterialCommunityIcons name={notify.type === 'unread' ? 'email' : 'email-open'} size={18} style={[getModalStyleLabelAlert(notify.type === 'unread' ? 'danger' : 'default'),{position:'relative',left:5,marginTop:10}]}/>
                                        )
                                    }}
                                    
                                    >
                                        <List.Item title={notify.accordionTitleItem} style={[Styles.w100,{height:'auto',overflow:'visible',paddingBottom:55,backgroundColor:'#FAFAFA',borderRadius:5}]} titleNumberOfLines={5} descriptionMaxFontSizeMultiplier={5} centered={false}/>
                                        <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.w100,Styles.primary,{marginTop:-50,}]}>
                                            <MaterialCommunityIcons name='email-open' size={25} color={'#000'} style={[Styles.mr_5,Styles.lblprimary]}/>
                                            <Text style={[Styles.ft_regular,Styles.lblprimary]}>Marcar como lida</Text>
                                        </TouchableOpacity>
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