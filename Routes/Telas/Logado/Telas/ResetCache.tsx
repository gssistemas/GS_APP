import { ActivityIndicator, SafeAreaView, StatusBar, View } from 'react-native';
import { Styles } from '../../../../assets/Styles/Styles';
import { ThemedText } from '../../../Components/ThemedText';
import { useContext, useEffect } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {useNavigation} from '@react-navigation/native';

export default function ResetCache() {
    const {cacheClear} = useContext<any>(AuthLogin);
    const navigation = useNavigation();

    useEffect(()=>{
        setTimeout(() => {
            fim()
        }, 10000);
    },[]);

    async function fim() {
        const logout = await cacheClear();

        if(logout.code ===0){
            navigation.reset({
                index:0,
                routes:[
                    {
                        name:'comecar',
                    }
                ]
            })
        }
    }
    return (
        <SafeAreaView style={[{flex:1}]}>
            <View style={[Styles.em_linhaVertical,{height:'100%'}]}>
                <ActivityIndicator size={75} color={'blue'} animating={true} style={[{marginBottom:20}]}/>
                <ThemedText type='title' style={[Styles.w100,{textAlign:'center',marginBottom:10}]}>Saindo...</ThemedText>
                <ThemedText type='defaultSemiBold' style={[Styles.w100,{textAlign:'center',marginBottom:10}]}>{'Resetando cachê do aplicativo,\n\nAguarde um momento...'}</ThemedText>
            </View>
            <StatusBar animated={true} translucent={true} hidden={true}/>
        </SafeAreaView>
    );
}