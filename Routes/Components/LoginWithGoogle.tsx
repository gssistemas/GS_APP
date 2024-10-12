//project-182722180520
import React, { useState, useEffect } from 'react';
import {View, Button, Dimensions} from 'react-native';
/*import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';*/
import { useTheme } from '../../assets/Styles/ThemeContext';
import { Styles } from '../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
const {width,height} = Dimensions.get('screen');

/*WebBrowser.maybeCompleteAuthSession();

import googleProvider from '../../google-services.json';
import { Styles } from '../../assets/Styles/Styles';

WebBrowser.maybeCompleteAuthSession();

// Configure Firebase
const firebaseConfig = {
    apiKey: googleProvider.client[0].api_key,
    authDomain: "gs-app-e02f5.firebaseapp.com",
    projectId: googleProvider.project_info.project_id,
    storageBucket: googleProvider.project_info.storage_bucket,
    messagingSenderId: "182722180520",
    appId: googleProvider.project_info.project_id,
    measurementId: "5988339001"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);*/

export default function LoginWithGoogle() {
    const theme = useTheme()
    /*const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Obtido no Google Cloud Console
    });
    
    useEffect(() => {
        if (response?.type === 'success') {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
    
          // Autentica com Firebase usando as credenciais do Google
          signInWithCredential(auth, credential)
            .then((userCredential) => {
              // Sucesso no login
              console.log('Login com sucesso:', userCredential.user);
            })
            .catch((error) => {
              // Tratar erros
              console.log('Erro ao fazer login:', error);
            });
        }
    }, [response]);*/

  return (
    <View style={[Styles.em_linhaVertical,{height:height}]}>
        <ThemedText type='title'>Oops'</ThemedText>
        <MaterialCommunityIcons name='emoticon-cry' size={width / 2} color={'#999'}/>
        <ThemedText type='subtitle' style={[{textAlign:'center'}]}>Estamos trabalhando nesta tela, Aguarde uma nova atualização.</ThemedText>
    </View>
  );
}
