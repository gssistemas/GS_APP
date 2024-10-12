import React, {useContext, useState} from 'react';
import { View,Text, TouchableOpacity, ScrollView,Image} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import { Dropdown } from 'react-native-element-dropdown';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Assistencias() {
    const {buscarCoordenadas,carregarTodasImagens,arlterarModal,getModalStyle,getModalStyleLabel,fecharModal,dataLocal,horaLocal,apresentaModal,osInicada} = useContext<any>(AuthLogin);
    const [value, setValue] = useState<null|string>(null);
    const [imagensProblema,setImagensProblema] = useState<null|any>(null);

    const adicionarImagemProblema = async (dados:any) => {
        //console.log('para atualização do status=>',dados)
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            base64: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            const novaImagem = {url:result.assets[0].uri,location:buscarCoordenadas('embalagem',null,1100,0,()=>{null},''),dataInicio:dataLocal+' '+horaLocal};
            const novasImagens:any|null = imagensProblema ? [...imagensProblema, novaImagem] : [novaImagem];
            setImagensProblema(novasImagens);
            await AsyncStorage.setItem('imagens_problema', JSON.stringify(novasImagens));
            carregarTodasImagens()
        }
    };

    const removerImagemProblema = async (index: number) => {
        // Verifica se o índice fornecido é válido
        if (index < 0 || index >= imagensProblema.length) {
            arlterarModal(
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
        arlterarModal(
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
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
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
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<MaterialCommunityIcons size={310} name="archive-cog" style={Styles.headerImage} />
        }
        >
            <ThemedView>
                <ThemedText type='defaultSemiBold'>Assinalar assistencias</ThemedText>
                <ThemedView style={{}}>
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
                <ThemedText type='subtitle'>Imagens do problema</ThemedText>
                <ThemedView style={{}}>
                {
                    imagensProblema !== null &&

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                        {
                            imagensProblema.map((img:any,i:number)=>{
                                //console.log(img);
                                return(
                                    <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                        <Image source={{uri:img.url}} style={[{width:300,height:250,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                        <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.danger,{position:'absolute',bottom:5,right:5,marginVertical:0,marginHorizontal:0,paddingHorizontal:2,paddingVertical:2}]}
                                            onPress={()=>{
                                                apresentaModal(
                                                    'dialog',
                                                    'help',
                                                    'Remover imagem',
                                                    'Esta ação não pode ser desfeita\n\nTem certeza que deseja excluir a imagem?',
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
        </ParallaxScrollView>
    );
}