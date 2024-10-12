import { View,Text,Dimensions, TouchableOpacity, Alert} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Styles } from '../../../../assets/Styles/Styles';
import React, { useContext, useState } from 'react';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import axios from 'axios';
import Config from '../../../../assets/Config/Config.json';
const {width,height} = Dimensions.get('screen');

export default function ResetPass() {
    const {theme} = useTheme();
    const {usuario} = useContext<any>(AuthLogin);
    const [email,setEmail] = useState(maskEmail(usuario.email));
    const [currentPass,setCurrentPass] = useState('');
    const [nowPass,setNowPass] = useState('');
    const [repeatNowPass,setRepeatNowPass] = useState('');
    const [errorPass,setErrorPass] = useState('');

    const validatePassword = () => {
        if (nowPass === currentPass) {
            setErrorPass('A nova senha não pode ser igual à senha atual.');
            setTimeout(() => {
                setErrorPass('');
            }, 5000);
            return false;
        }else if (nowPass !== repeatNowPass) {
            setErrorPass('A nova senha e a repetição da nova senha não coincidem.');
            setTimeout(() => {
                setErrorPass('');
            }, 5000);
            return false;
        }else{
            resetPassword('resetarsenha',email,currentPass,nowPass);
            setErrorPass('');
            return true;
        }
        
        
    };

    async function resetPassword(comando:any,mail:any,currentPass:any,newPass:any){
        const request = await axios({
            method:'get',
            url:Config.configuracoes.pastaProcessos,
            params:{
                comando:comando,
                email:mail,
                pass:currentPass,
                newPass:newPass,
            },
        });
        console.log(request);
        if(request !== undefined){
            if(request.data[0].status === 'OK' && request.data[0].statusCode === 200){
                Alert.alert('Sucesso!','Senha alterarda com sucesso!');
            }else{

            }
        }else{
            console.log('retorno Vazio!');
        }
    }

    function maskEmail(email:string) {
        const [localPart, domain] = email.split('@');
        
        if (localPart.length <= 2) {
            return email; // Retorna o e-mail original se a parte local tiver 2 ou menos caracteres
        }
    
        // Mantém a primeira e a última letra da parte local e substitui o restante por asteriscos
        const maskedLocalPart = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
    
        return maskedLocalPart + '@' + domain;
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<MaterialCommunityIcons size={310} name="lock-reset" style={[Styles.headerImage]} />
        }
        >
            <View style={[Styles.w100,Styles.em_linhaVertical]}>
                <View style={[Styles.em_linhaVertical,Styles.w100,{justifyContent:'center',paddingTop:10}]}>
                    <TextInput placeholder='E-mail...' style={[Styles.w100,{marginBottom:10,color:theme.labels.text}]} defaultValue={email} onChangeText={(text)=>{setEmail(text)}} disabled={false}/>
                    <TextInput placeholder='Senha atual...' style={[Styles.w100,{marginBottom:10}]} autoFocus={true} defaultValue={currentPass} onChangeText={(text)=>{setCurrentPass(text)}}/>
                    <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',marginBottom:10}]}>
                        <TextInput placeholder='Nova senha...' style={[Styles.w45,{marginHorizontal:0}]} defaultValue={nowPass} onChangeText={(text)=>{setNowPass(text)}}/> 
                        <TextInput placeholder='Repita a nova senha...' style={[Styles.w45,{marginHorizontal:0}]} defaultValue={repeatNowPass} onChangeText={(text)=>{setRepeatNowPass(text)}}/>                
                    </View>
                </View>
                {
                    errorPass !== '' &&

                    <View style={[Styles.btn,Styles.em_linhaVertical,Styles.danger,Styles.w100]}>
                        <MaterialCommunityIcons name='information' size={25} style={[Styles.mr_5,Styles.lbldanger,{marginBottom:15}]}/>
                        <Text style={[Styles.lbldanger,Styles.ft_bold,{textAlign:'center'}]}>{errorPass}</Text>
                    </View>
                }
                <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w100,Styles.btn,Styles.success]}
                    onPress={()=>{validatePassword()}}
                >
                    <MaterialCommunityIcons name='check-circle' size={25} style={[Styles.lblsuccess]}/>
                    <Text style={[Styles.lblsuccess,Styles.ft_bold]}>Confirmar mudança</Text>
                </TouchableOpacity>
            </View>
        </ParallaxScrollView>
    );
}