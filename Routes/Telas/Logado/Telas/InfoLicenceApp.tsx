import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Styles } from '../../../../assets/Styles/Styles';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import Config from '../../../../assets/Config/Config.json';

export default function InfoLicenceApp() {
    const { theme } = useTheme();
    const { appIsValid, appValidationArray, verificarConexao, validarApp, uniqueId, getModalStyle, getModalStyleLabel, getModalStyleLabelAlert } = useContext<any>(AuthLogin);
    const [errorMsg, setError] = useState<null | undefined | any>(null);
    const [validating, setValidating] = useState(true);
    useEffect(() => {
        iniciar();
    }, [])

    async function iniciar() {
        const vrfConn = await verificarConexao();
        console.log('Status da conexão=>', vrfConn)
        if (vrfConn.code === 0) {
            const licenca = await validarApp(uniqueId)

            if (licenca.code === 0) {
                setError(licenca);
                setValidating(false);
                console.log('ok=>', licenca);
            } else {
                setError(licenca);
                setValidating(false);
                console.log('Erro=>', licenca);
            }
        } else {
            setError(vrfConn);
        }
    }
    if (validating) {
        return(
            <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                <ActivityIndicator size={25} color={'blue'}/>
            </View>
        );
    } else {
        try {
            return (
                <ParallaxScrollView
                    headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                    headerImage={<MaterialCommunityIcons size={310} name="license" style={[Styles.headerImage]} />}
                >
                    <ThemedView style={[{ backgroundColor: theme.backgroundColor.background }]}>
                        <ThemedText type='title' style={[Styles.ft_regular, { backgroundColor: theme.backgroundColor.background, elevation: 2, paddingVertical: 5, borderRadius: 10, paddingHorizontal: 5, marginVertical: 15, }]}>Status de licença de uso</ThemedText>
                        {
                            appIsValid === false &&

                            <ThemedView style={[Styles.em_linhaVertical]}>
                                {
                                    errorMsg.mensagem === 'erro' && errorMsg.mensagem !== null &&
                                    <ThemedView style={[Styles.w100, Styles.em_linhaVertical, { justifyContent: 'center',alignItems:'flex-start'}]}>
                                        <ThemedText type='defaultSemiBold' style={[getModalStyleLabelAlert('danger')]}>Status: {appIsValid === false ? errorMsg.status : 'Licenciado'}</ThemedText>
                                        {
                                            appIsValid === false &&
                                            <ThemedText type='defaultSemiBold' style={[getModalStyleLabelAlert('danger'),{width:'100%'}]}>{'\nMais detalhes:\n'+errorMsg.retorno}</ThemedText>
                                        }
                                    </ThemedView>
                                }
                                {
                                    appValidationArray === null &&

                                    <ThemedView style={[Styles.w100, Styles.em_linhaVertical, { justifyContent: 'center' }]}>
                                        <ThemedText type='defaultSemiBold' style={[Styles.btn, errorMsg !== null && errorMsg.mensagem !== 'erro' && errorMsg.mensagem !== null ? getModalStyleLabelAlert('success') : getModalStyleLabelAlert('danger')]}>Dados do licenciamento:</ThemedText>
                                        <ThemedText type='defaultSemiBold' style={[Styles.btn, errorMsg !== null && errorMsg.mensagem !== 'erro' && errorMsg.mensagem !== null ? getModalStyleLabelAlert('success') : getModalStyleLabelAlert('danger')]}>{errorMsg !== null && errorMsg.mensagem !== 'erro' && errorMsg.mensagem !== null && errorMsg.status !== 'erro' ? 'Aplicativo validado' : errorMsg.retorno}</ThemedText>
                                        <TouchableOpacity style={[Styles.em_linhaHorizontal, Styles.btn, Styles.primary]}
                                            onPress={() => {
                                                iniciar();
                                            }}
                                        >
                                            <MaterialCommunityIcons name='sync' size={25} style={[Styles.lblprimary]} />
                                            <Text style={[Styles.ft_medium, Styles.lblprimary]}>Verificar licença</Text>
                                        </TouchableOpacity>
                                    </ThemedView>
                                }
                                {
                                    errorMsg !== null && errorMsg.mensagem !== 'erro' && errorMsg.mensagem !== null &&

                                    <ThemedView style={[Styles.w100, Styles.em_linhaHorizontal, { justifyContent: 'center' }]}>
                                        <ThemedText type='defaultSemiBold' style={[getModalStyleLabelAlert('success')]}>Status: </ThemedText>
                                        <ThemedText type='defaultSemiBold' style={[getModalStyleLabelAlert('success')]}>{appIsValid === false ? errorMsg.status : 'Licenciado'}</ThemedText>
                                    </ThemedView>
                                }
                            </ThemedView>
                        }
                        {
                            appIsValid === true &&

                            <View style={[Styles.em_linhaVertical]}>

                                {
                                    appValidationArray !== null &&

                                    <View style={[Styles.em_linhaVertical, { justifyContent: 'space-between', alignItems: 'stretch', backgroundColor: '#FAFAFA', elevation: 2, paddingVertical: 15, paddingHorizontal: 10, borderRadius: 10, }]}>
                                        <View style={[]}>
                                            <MaterialCommunityIcons size={45} name="license" style={[appIsValid === true ? getModalStyleLabelAlert('success') : getModalStyleLabelAlert('warning'), { position: 'absolute', top: -35, left: -10, zIndex: 2 }]} />
                                        </View>
                                        <View style={[Styles.em_linhaHorizontal, { justifyContent: 'space-between', marginTop: 10 }]}>
                                            <View style={[Styles.w35, Styles.em_linhaHorizontal, Styles.btn, appIsValid ? getModalStyle('success') : getModalStyle('warning'), { justifyContent: 'space-between', elevation: 2, paddingVertical: 10, marginHorizontal: 0 }]}>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>Código:</Text>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>{appValidationArray.codigo}</Text>
                                            </View>
                                            <View style={[Styles.w65, Styles.em_linhaHorizontal, Styles.btn, appIsValid ? getModalStyle('success') : getModalStyle('warning'), { justifyContent: 'space-between', elevation: 2, paddingVertical: 10, marginHorizontal: 0 }]}>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>ID único:</Text>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>{appValidationArray.id_app}</Text>
                                            </View>
                                        </View>
                                        <View style={[Styles.em_linhaHorizontal, { justifyContent: 'space-between' }]}>
                                            <View style={[Styles.w45, Styles.em_linhaVertical, Styles.btn, appIsValid ? getModalStyle('success') : getModalStyle('warning'), { justifyContent: 'flex-start', alignItems: 'flex-start', elevation: 2, paddingVertical: 10, marginHorizontal: 0, }]}>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>Data ativação:</Text>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>{appValidationArray.dt_cad}</Text>
                                            </View>
                                            <View style={[Styles.w55, Styles.em_linhaVertical, Styles.btn, appIsValid ? getModalStyle('success') : getModalStyle('warning'), { justifyContent: 'flex-start', alignItems: 'flex-start', elevation: 2, paddingVertical: 10, marginHorizontal: 0, }]}>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>Expira em:</Text>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>{appValidationArray.dt_exp}</Text>
                                            </View>
                                        </View>
                                        <View style={[Styles.em_linhaHorizontal, { justifyContent: 'space-between' }]}>
                                            <View style={[Styles.w55, Styles.em_linhaVertical, Styles.btn, appIsValid ? getModalStyle('success') : getModalStyle('warning'), { justifyContent: 'flex-start', alignItems: 'flex-start', elevation: 2, paddingVertical: 10, marginHorizontal: 0, }]}>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>Licenciado para:</Text>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>{appValidationArray.email}</Text>
                                            </View>
                                            <View style={[Styles.w45, Styles.em_linhaVertical, Styles.btn, appIsValid ? getModalStyle('success') : getModalStyle('warning'), { justifyContent: 'flex-start', alignItems: 'flex-start', elevation: 2, paddingVertical: 10, marginHorizontal: 0, }]}>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>Token de validação:</Text>
                                                <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>{appValidationArray.token_validado}</Text>
                                            </View>
                                        </View>
                                        <View style={[Styles.w100, Styles.em_linhaHorizontal, Styles.btn, appIsValid === true ? getModalStyle('success') : getModalStyle('warning'), { justifyContent: 'space-between', elevation: 2, paddingVertical: 10, }]}>
                                            <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>Versão do cliente:</Text>
                                            <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>{appValidationArray.versao_do_cliente}</Text>
                                        </View>
                                        <View style={[Styles.w100, Styles.em_linhaVertical, Styles.btn, appIsValid === true ? getModalStyle('success') : getModalStyle('warning'), { justifyContent: 'space-between', alignItems: 'stretch', elevation: 2, paddingVertical: 10, }]}>
                                            <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, {}]}>Notas da versão atual:</Text>
                                            <Text style={[appIsValid === true ? getModalStyleLabel('success') : getModalStyleLabel('warning'), Styles.ft_regular, { fontWeight: 'bold' }]}>{(Config.configuracoes.notas).replaceAll(',', '\n-').replace('*', '🆕 Alteração!\n')}</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                        }
                    </ThemedView>
                </ParallaxScrollView>
            )
        } catch (error: any) {
            console.log(error);
        }
    }
}