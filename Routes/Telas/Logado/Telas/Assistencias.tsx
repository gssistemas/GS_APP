import React, {useContext, useState} from 'react';
import { View,Text, TouchableOpacity, ScrollView,Image, TextInput, ActivityIndicator} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import { Dropdown } from 'react-native-element-dropdown';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import axios from 'axios';
import Config from '../../../../assets/Config/Config.json';

export default function Assistencias({route,navigation}:any) {
    const {theme} = useTheme();
    const {usuario,buscarCoordenadas,setModalVisible,carregarTodasImagens,arlterarModal,getModalStyle,getModalStyleLabel,fecharModal,dataLocal,horaLocal,apresentaModal,osInicada} = useContext<any>(AuthLogin);
    const [value, setValue] = useState<null|string>(null);
    const [nfPv,setNfPv] = useState('');
    const [imagensProblema,setImagensProblema] = useState<null|any>(null);
    const [descProblema,setDescProblema] = useState('');
    const [outro,setOutro] = useState('');

    console.log(usuario)

    const adicionarImagemProblema = async (dados:any) => {
        //console.log('para atualização do status=>',dados)
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            base64: true,
            quality: .4,
        });
    
        if (!result.canceled) {
            const novaImagem = {url:result.assets[0].uri,location:buscarCoordenadas('embalagem',null,1100,0,()=>{null},''),dataInicio:dataLocal+' '+horaLocal};
            const novasImagens:any|null = imagensProblema ? [...imagensProblema, novaImagem] : [novaImagem];
            setImagensProblema(novasImagens);
            await AsyncStorage.setItem('imagens_problema', JSON.stringify(novasImagens));
            carregarTodasImagens()
        }
    };

    async function sendAssistencias() {
        let formData = new FormData();
    
        const addImagesToFormData = (images:any, fieldName:any) => {
            if (images) {
                images.forEach((imageUri:any) => {
                    const uri = imageUri.url || imageUri;
                    const uriParts = uri.split('.');
                    const carimbo = imageUri.dataInicio.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
                    const fileType = uriParts[uriParts.length - 1];
    
                    formData.append('arquivos[]', {
                        uri,
                        name: `${fieldName.replace('[]', '')}_${carimbo}.${fileType}`,
                        type: `image/${fileType}`,
                    });
                });
            } else {
                console.warn(`Nenhuma imagem para ${fieldName}`);
            }
        };
    
        // Adicionar imagens e outros dados
        addImagesToFormData(imagensProblema, 'imagensProblema');
        formData.append('os', nfPv);
        formData.append('usuario',usuario.id_login[0].id+'-'+usuario.id_login[0].nome_montador)
        formData.append('descricao_problema', descProblema);
        formData.append('comando', 'registrar_assistencia');
        formData.append('problema_relatado', value || '');
        formData.append('outro', outro || '');
    
        // Enviar para o servidor
        try {
            const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            if (!response.data) {
                console.error('Erro no servidor, sem resposta.');
                throw new Error('Erro no servidor. Tente novamente mais tarde.');
            }

            console.log('84=>',response)
    
            const serverResponse = response.data[0];
            if (serverResponse?.status === 'OK' && serverResponse?.statusCode === 200) {
                console.log('Sucesso:', serverResponse.statusMensagem);
                setModalVisible(false);
                fecharModal('');
                navigation.goBack();
                return { status: 'sucesso', mensagem: serverResponse.statusMensagem };
            } else {
                console.error('Erro no processamento:', response.data[0].erros);
                throw new Error(serverResponse?.statusMensagem || 'Erro desconhecido.');
            }
        } catch (error:any) {
            console.error('Erro ao finalizar a ordem:', error.message);
            return { status: 'error', mensagem: `Erro ao finalizar: ${error.message}` };
        }
    }

    const removerImagemProblema = async (index: number) => {
        // Verifica se o índice fornecido é válido
        if (index < 0 || index >= imagensProblema.length) {
            apresentaModal(
                'danger',
                'check-all',
                'Erro',
                ()=>(
                    <>
                        <MaterialCommunityIcons name='alert-circle' size={75} style={[getModalStyleLabel('danger')]}/>
                        <Text style={[Styles.ft_medium,getModalStyleLabel('danger')]}>Erro ao excluir a imagem!</Text>
                    </>
                ),
                'danger',
                ()=>{
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>OK!</Text>
                    </TouchableOpacity>
                },
                ''
            )
            console.error(`Índice inválido para remoção de imagem: ${index}`);
            return;
        }
    
        // Remove a imagem do estado
        const novasImagens = imagensProblema.filter((_:any, idx:any) => idx !== index);
        setImagensProblema(novasImagens);
    
        // Atualiza o AsyncStorage
        await AsyncStorage.setItem('imagens_problema', JSON.stringify(novasImagens));
    
        // Carrega todas as imagens novamente (se necessário)
        //carregarTodasImagens();
        apresentaModal(
            'success',
            'check-all',
            'Sucesso',
            ()=>(
                <>
                    <MaterialCommunityIcons name='check-all' size={75} style={[getModalStyleLabel('success')]}/>
                    <Text style={[Styles.ft_medium,getModalStyleLabel('success'),{marginBottom:25}]}>Imagem excluida com sucesso!</Text>
                </>
            ),
            'success',
            ()=>{
                return(
                    <TouchableOpacity style={[Styles.btn,Styles.light,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                        onPress={()=>{
                            fecharModal('');
                        }}
                    >
                        <Text style={[Styles.ft_regular,Styles.lbllight]}>Fechar</Text>
                    </TouchableOpacity>
                )
            },
            ''
        )
    };
    const data = [
        { label: 'Produto montado - Montagem recusada', value: '1' },
        { label: 'Tonalidade de cor diferente', value: '2' },
        { label: 'Peça danificada', value: '3' },
        { label: 'Sem condições de montagem', value: '4' },
        { label: 'Código do produto incorreto ou diferente', value: '5' },
        { label: 'Recusou montagem - (produto muito danificado)', value: '6' },
        { label: 'Cliente irá trocar o produto', value: '7' },
        { label: 'Outro motivo', value: '8' },
    ];
    const renderItem = (item:any) => {
        return (
          <View style={Styles.item}>
            <Text style={Styles.textItem}>{item.label}</Text>
            {item.value === value && (
              <MaterialCommunityIcons
                style={Styles.icon}
                color="blue"
                name="check-all"
                size={20}
              />
            )}
          </View>
        );
    };

    //console.log('252=>',imagensProblema)
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<MaterialCommunityIcons size={310} name="archive-cog" style={Styles.headerImage} />
        }
        >
            <ThemedView>
                <ThemedText type='title'>Assinalar assistencias</ThemedText>
                <ThemedView style={[Styles.btn,{backgroundColor:theme.backgroundColor.background}]}>
                    <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>N° da nota, PV ou rota:</ThemedText>
                    <ThemedView style={{backgroundColor:'#FFF'}}>
                        <TextInput placeholder='N° da nota, PV ou rota...' keyboardType='decimal-pad' style={[Styles.input]} defaultValue={nfPv} value={nfPv} onChangeText={(text)=>{setNfPv(text)}}/>
                    </ThemedView>
                </ThemedView>

                <ThemedView style={[Styles.btn,{backgroundColor:theme.backgroundColor.background}]}>
                    <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>Adicione as informações da peça:</ThemedText>
                    <ThemedView style={{backgroundColor:'#FFF'}}>
                        <TextInput placeholder='Ex.: PV: 99999, N° da peça:99999, defeito: Peça avariada...' style={[Styles.input]} multiline  defaultValue={descProblema} value={descProblema} onChangeText={(text)=>{setDescProblema(text)}}/>
                    </ThemedView>
                </ThemedView>
                
                <ThemedView style={[Styles.btn,{backgroundColor:theme.backgroundColor.background}]}>
                    <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>Selecione...</ThemedText>
                    <Dropdown
                        style={Styles.dropdown}
                        placeholderStyle={Styles.placeholderStyle}
                        selectedTextStyle={Styles.selectedTextStyle}
                        inputSearchStyle={Styles.inputSearchStyle}
                        iconStyle={Styles.iconStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Selecione o problema..."
                        searchPlaceholder="Search..."
                        value={value}
                        onChange={item => {
                        setValue(item.value);
                        }}
                        renderLeftIcon={() => (
                            <MaterialCommunityIcons style={Styles.icon} color="black" name="list-status" size={20} />
                        )}
                        renderItem={renderItem}
                    />
                </ThemedView>
                {
                    value === '8' &&

                    <ThemedView style={[Styles.btn]}>
                        <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>Qual o motivo?</ThemedText>
                        <ThemedView style={{backgroundColor:'#FFF'}}>
                            <TextInput placeholder='Descreva o motivo' style={[Styles.input]} multiline defaultValue={outro} value={outro} onChangeText={(text)=>{setOutro(text)}}/>
                        </ThemedView>
                    </ThemedView>
                }
                <ThemedView style={[Styles.btn,{}]}>
                    <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'space-between',backgroundColor:'#FFF'}]}>
                        <ThemedText type='defaultSemiBold' style={[{color:theme.backgroundColor.background}]}>Imagens do problema</ThemedText>
                        {
                            imagensProblema !== null &&

                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary,{marginHorizontal:0,paddingHorizontal:0,marginVertical:0,paddingVertical:0}]}
                                onPress={()=>{
                                    adicionarImagemProblema(osInicada);
                                }}
                            >
                                <MaterialCommunityIcons name='image-plus' size={25} style={[Styles.lblprimary]}/>
                            </TouchableOpacity>
                        }
                    </ThemedView>
                    <ThemedView style={{backgroundColor:'#FFF'}}>
                    {
                        imagensProblema !== null &&

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                            {
                                imagensProblema.map((img:any,i:number)=>{
                                    //console.log(img);
                                    return(
                                        <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                            <ThemedText type='defaultSemiBold' style={[{position:'absolute',left:2,top:2,backgroundColor:theme.backgroundColor.background,color:theme.labels.text,zIndex:1,paddingHorizontal:5,borderBottomRightRadius:4,textAlign:'center',width:22,paddingBottom:3}]}>{i+1}</ThemedText>
                                            <Image source={{uri:img.url}} style={[{width:200,height:150,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                            <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.danger,{position:'absolute',bottom:5,right:5,marginVertical:0,marginHorizontal:0,paddingHorizontal:2,paddingVertical:2}]}
                                                onPress={()=>{
                                                    apresentaModal(
                                                        'dialog',
                                                        'help',
                                                        'Remover imagem',
                                                        ()=>(
                                                            <View style={[Styles.em_linhaVertical]}>
                                                                <ThemedText type='title'>ATENÇÃO!!</ThemedText>
                                                                <ThemedText type='defaultSemiBold'>{'Esta ação não pode ser desfeita\n\nTem certeza que deseja excluir a imagem?'}</ThemedText>
                                                            </View>
                                                            ),
                                                        'warning',
                                                        ()=>(
                                                            <>
                                                                <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w50,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                                                                    onPress={()=>{
                                                                        fecharModal('');
                                                                    }}
                                                                >
                                                                    <Text style={[Styles.ft_regular,Styles.lbldanger]}>Não</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w50,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                                                    onPress={()=>{
                                                                        removerImagemProblema(i);
                                                                    }}
                                                                >
                                                                    <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Sim</Text>
                                                                </TouchableOpacity>
                                                            </>
                                                        )
                                                    )
                                                    //idModal:string,iconeM:string,titleM:string,conteudoM:string|ReactNode|ReactElement|Function,styleM:StyleSheet|string,actionsM:Function
                                                    //removerImagemEmbalagem(i);
                                                }}
                                            >
                                                <MaterialCommunityIcons name='image-remove' size={25} style={[Styles.lbldanger]}/>
                                            </TouchableOpacity>
                                        </ThemedView>
                                    )
                                })
                            }
                        </ScrollView>
                    }
                    {
                        imagensProblema === null &&

                        <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary]}
                            onPress={()=>{
                                adicionarImagemProblema(osInicada);
                            }}
                        >
                            <MaterialCommunityIcons name='image-plus' size={25} style={[Styles.lblprimary]}/>
                            <Text style={[Styles.ft_regular,Styles.lblprimary]}>Adicionar Imagens</Text>
                        </TouchableOpacity>
                    }
                    </ThemedView>
                </ThemedView>
                {
                    value !== '' && nfPv !=='' && descProblema !== '' &&
                    
                    <ThemedView style={[Styles.btn,{backgroundColor:'#FFF'}]}>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.primary]}
                            onPress={()=>{
                                setModalVisible(true);
                                sendAssistencias();
                            }}
                        >
                            <MaterialCommunityIcons name='content-save' size={25} style={[Styles.lblprimary]}/>
                            <Text style={[Styles.ft_regular,Styles.lblprimary]}>Cadastrar atendimento</Text>
                        </TouchableOpacity>
                    </ThemedView>
                }
            </ThemedView>
        </ParallaxScrollView>
    );
}