import { TouchableOpacity, View, Text, Image, ScrollView, TextInput, Dimensions, SafeAreaView, ToastAndroid, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Styles } from '../../../../assets/Styles/Styles';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import Config from '../../../../assets/Config/Config.json';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import axios from 'axios';
import { rotate } from '@shopify/react-native-skia';
const { width, height } = Dimensions.get('window');

export default function Mensagens({ route, navigation }: any) {
    const { usuario } = useContext<any>(AuthLogin);
    const { theme } = useTheme();
    const [mensagensUser, setMensagensUser] = useState<any>([]);
    const [dadosUser, setDadosUser] = useState(route.params);
    const [mensagem, setMensagem] = useState<any>('');
    const scrollViewRef = useRef<any>(null);
    console.log(width, Math.floor(height));
    useEffect(() => {
        let usr = usuario.id_login[0].codigo;
        let timestamp = 0;
        let lastid = 0;
        BuscarUsers(dadosUser.meuid);
        console.log(dadosUser);
        //verifica(timestamp,lastid,usr);
    }, []);

    async function BuscarUsers(id: string) {
        const users = await axios({
            method: 'get',
            url: 'https://gsapp.com.br/app/chats/sys/busca_user.php',
            params: {
                id: id
            }
        });
        console.log('retorno=>',users);
        if (users.data[0].status === 'OK') {
            var dados = users.data[0].usuarios;
            //console.log('dados=>',dados);

            for (let index = 0; index < dados.length; index++) {
                const element = dados[index];
                //console.log('dados=>',element);
                if (element.codigo === dadosUser.idConversa) {
                    setMensagensUser(element.mensagens.reverse());
                    console.log('minhas mensagens=>', element.mensagens);
                    //setDadosUser(element);
                }
            }
            //setData(users.data[0].usuarios);
            verifica(0, 0, usuario.id_login[0].codigo);
            scrollViewRef.current?.scrollToEnd({ animated: true });
            //return {status:'sucesso',code:0,mensagem:users.data[0].mensagem,users:users.data[0].users};
        } else {
            //setData([]);
        }
    }

    async function verifica(timestamp: number, lastid: number, user: string) {
        var t;
        const retorno = await axios({
            method: 'get',
            url: 'https://gsapp.com.br/app/chats/sys/stream.php',
            params: {
                timestamp: timestamp,
                lastid: lastid,
                user: user
            }
        });
        console.log('retorno 184=>', retorno.data);
        if (retorno.data.status == 'resultados' || retorno.data.status == 'vazio') {
            t = setTimeout(() => {
                let usr = usuario.id_login[0].codigo;
                //setData(retorno.data.users);
                verifica(retorno.data.timestamp, retorno.data.lastid, usr);
            }, 1000);

            if (retorno.data.status == 'resultados') {
                let mensagensAtuais = mensagensUser;
                let dadosUsers = retorno.data.users;
                dadosUsers.push({ 'mensagens': retorno.data.dados });
                retorno.data.dados.forEach(msg => {
                    mensagensAtuais.push(msg);
                    //console.log('dados da mensagem=>',msg);
                });
                setMensagensUser(mensagensAtuais)
                //setData(dadosUsers);
                //console.log('dados inseridos=>',data);
            }
        } else {
            //console.log('retorno 199=>',retorno.data);
            clearInterval(t);
            t = setTimeout(() => {
                let usr = usuario.id_login[0].codigo;
                verifica(retorno.data.timestamp, retorno.data.lastid, usr);
            }, 15000);
        }
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }

    async function lida(user: string, online: string) {
        let formData = new FormData();

        formData.append('user', user);
        formData.append('online', online);
        formData.append('ler', 'sim');


        const retorno = await axios.post('https://gsapp.com.br/app/chats/sys/ler.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log('retorno do ler=>', retorno);
        BuscarUsers(dadosUser.meuid);
    }

    async function submit(user: string, online: string, mensagem: string) {
        let formData = new FormData();

        formData.append('de', user);
        formData.append('para', online);
        formData.append('mensagem', mensagem);


        const retorno = await axios.post('https://gsapp.com.br/app/chats/sys/submit.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log('retorno do ler=>', retorno);
        if (retorno.data === 'ok') {
            setMensagem('');
            BuscarUsers(dadosUser.meuid);
        }
    }

    try {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <SafeAreaView style={[Styles.w100, Styles.em_linhaVertical, { flex: 1, justifyContent: 'space-between', backgroundColor: "#FFF" }]}>
                        <View style={[Styles.w100, { height: 50 }]}>
                            <View style={[Styles.em_linhaHorizontal, Styles.w100, { height: '100%', justifyContent: 'space-between', backgroundColor: theme.backgroundColor.background }]}>
                                <TouchableOpacity style={[Styles.em_linhaHorizontal, { width: '10%', height: '80%', marginLeft: 10, marginRight: -35 }]} onPress={() => { navigation.goBack() }}>
                                    <Ionicons name="chevron-back" size={32} color={theme.labels.text} />
                                </TouchableOpacity>
                                <View style={[Styles.em_linhaHorizontal, Styles.w70, { marginHorizontal: 0, justifyContent: 'flex-start' }]}>
                                    <Image source={{ uri: Config.configuracoes.pathPadrao + '/' + (dadosUser.fotoUser).replace('../../../', '') }} style={[Styles.mr_5, { width: 40, height: 40, resizeMode: 'stretch', borderRadius: 40 }]} />
                                    <View style={{ width: 12, height: 12, backgroundColor: 'green', borderRadius: 12, borderWidth: 2, borderColor: '#FFF', position: 'absolute', left: 30, bottom: 2 }} />
                                    <Text style={[Styles.ft_bold, { marginHorizontal: 0, fontSize: 18, color: theme.labels.text }]}>{dadosUser.nomeUser}</Text>
                                </View>
                                <TouchableOpacity style={[Styles.em_linhaHorizontal, { marginHorizontal: 5 }]}>
                                    <MaterialCommunityIcons name="dots-vertical" size={25} color={theme.labels.text} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[Styles.w100, Styles.em_linhaVertical, { flex: Math.floor(height - 120), justifyContent: 'space-between', backgroundColor: '#FAFAFA' }]}>
                            <ScrollView ref={scrollViewRef} style={[Styles.w100, { height: '100%' }]}>
                                {mensagensUser && mensagensUser.length > 0 ? (
                                    mensagensUser.map((item: any, index: number) => (
                                        <View key={index} style={[Styles.w100, Styles.em_linhaHorizontal, { elevation: 5, marginVertical: 5, marginHorizontal: 0, padding: 10, justifyContent: item.id_de == dadosUser.meuid ? 'flex-start' : 'flex-end' }]}>
                                            <View style={[Styles.w70, { backgroundColor: item.id_de == dadosUser.meuid ? '#00BFFF' : '#cacaca', padding: 10, borderRadius: 8, marginHorizontal: 5 }]}>
                                                <Text style={[Styles.ft_regular, { textAlign: item.id_de == dadosUser.meuid ? 'left' : 'right' }]}>{item.mensagem}</Text>
                                                <View style={[Styles.em_linhaHorizontal, Styles.w100, { justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 5 }]}>
                                                    <Text style={[Styles.ft_regular, { textAlign: 'right' }]}>{item.envio}</Text>
                                                    {item.statusLido === 'nao lida' ? <MaterialCommunityIcons name="check-all" size={15} color={'#999999'} /> : <MaterialCommunityIcons name="check-all" size={15} color={'blue'} />}
                                                </View>
                                            </View>
                                            {item.id_de != dadosUser.meuid && (
                                                <Image source={{ uri: Config.configuracoes.pathPadrao + '/' + (item.fotoUser).replace('../../../', '') }} style={[Styles.mr_5, { width: 40, height: 40, resizeMode: 'stretch', borderRadius: 40 }]} />
                                            )}
                                        </View>
                                    ))
                                ) : (
                                    <View style={[Styles.em_linhaVertical, { justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }]}>
                                        <Text style={[Styles.ft_bold, { fontSize: 16, color: theme.labels.text }]}>Sem mensagens</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>

                        <View style={[Styles.em_linhaHorizontal, { width: '100%', height: 70, backgroundColor: 'transparent', borderRadius: 50, padding: 0 }]}>
                            <TextInput
                                style={[Styles.input, Styles.w100, { backgroundColor: '#cacaca', borderBottomWidth: 0, paddingRight: 40, borderRadius: 50, margin: 0 }]}
                                placeholder="Digite sua mensagem"
                                placeholderTextColor={theme.labels.text}
                                onFocus={() => { lida(dadosUser.meuid, dadosUser.idConversa) }}
                                defaultValue={mensagem}
                                value={mensagem}
                                onChangeText={(msg) => { setMensagem(msg) }}
                            />
                            <TouchableOpacity
                                style={[Styles.em_linhaHorizontal, Styles.btn, Styles.primary, { justifyContent: 'center', alignItems: 'center', margin: 0, marginLeft: -50, zIndex: 1, borderRadius: 50 }]}
                                onPress={() => {
                                    if (mensagem !== '') {
                                        submit(dadosUser.meuid, dadosUser.idConversa, mensagem);
                                    } else {
                                        ToastAndroid.show('Digite uma mensagem para enviar!', ToastAndroid.SHORT);
                                    }
                                }}
                            >
                                <MaterialCommunityIcons name="send" size={25} color={'#FFF'} style={{ transform: [{ rotate: '-20deg' }] }} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    } catch (error: any) {
        console.error(error);
    }
}
const styles = StyleSheet.create({
    trianguloDireita: {
        right: -9,
        borderBottomColor: "#cacaca",
        transform: [{ rotate: "180deg" }],
    },
    trianguloEsquerda: {
        left: -9,
        borderBottomColor: "#00BFFF",
    },
})
//{//<Text style={[Styles.ft_bold,{marginHorizontal:0,fontSize:item.status === 'on' ? 14 : 12,color:item.status === 'on' ? 'green' : '#999999'}]}>{item.status === 'on' ? item.status+'line' : item.visto}</Text>}