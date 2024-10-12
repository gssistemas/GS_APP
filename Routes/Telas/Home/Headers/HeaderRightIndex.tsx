import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect } from 'react';
import { View,Text, TouchableOpacity, Alert} from 'react-native';
import {AuthLogin} from '../../../../assets/Contexts/AuthLogin';
import { Styles } from '../../../../assets/Styles/Styles';

export default function HeaderRightIndex({navigation}:any) {
    const {logof,osInicada,usuario,buscarNotificacoes} = useContext<any>(AuthLogin);
    //console.log('Dados os=>',osInicada);
    useEffect(()=>{
        //buscarNotificacoes(usuario.id_user,usuario.id_user);
    },[])

    try {
        return (
            <TouchableOpacity
                style={[Styles.em_linhaHorizontal,{marginVertical:0,marginHorizontal:0,paddingHorizontal:6,paddingVertical:2}]}
                onPress={()=>{
                    Alert.alert('Sair','Tem certeza que deseja sair?',[
                        {
                            text:'não'
                        },
                        {
                            text:'sim',
                            onPress:()=>{
                                if(osInicada === null){
                                    logof()
                                }else{
                                    console.log(osInicada);
                                    Alert.alert('Não permitido!','Você não poderá sair até concluir a O.S.');
                                }
                            }
                        }
                    ])
                }}
            >
                <MaterialCommunityIcons name='logout-variant' size={25} style={[Styles.alertdanger]}/>
            </TouchableOpacity>   
        );
    } catch (error:any) {
        Alert.alert('Erro de inicio','Corrija o erro na linha 88=>',error.message)
    }
    
}