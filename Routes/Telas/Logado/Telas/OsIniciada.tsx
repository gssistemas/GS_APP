import { View, Text,TouchableOpacity,ScrollView,Image, SafeAreaView, Alert} from 'react-native';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Styles } from '../../../../assets/Styles/Styles';
import { useContext, useEffect, useState,useRef } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Checkbox } from 'react-native-paper';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
import AppLoading from '../../../../Components/Loader/AppLoading';
import { useThemeColor } from '../../../../assets/Temas/useThemeColor';

export default function OsIniciada({route,navigation}:any) {
    const {theme} = useTheme();
    const {buscarOs,usuario,Config_APP,osInicada,apresentaModal,fecharModal,verificarConexao,imagensEmbalagem,imagensMontado,imagensAmbiente,carregarTodasImagens,limparImagens,getModalStyle,getModalStyleLabel,getModalStyleBorder,getModalStyleLabelAlert} = useContext<any>(AuthLogin);
    const [checked,setIsChecked] = useState<any>(osInicada !== null ? osInicada.status : false);
    const [checkedEmbalagem,setIsCheckedEmbalagem] = useState<boolean>(false);
    const [checkedMontado,setIsCheckedMontado] = useState<boolean>(false);
    const [checkedAmbiente,setIsCheckedAmbiente] = useState<boolean>(false);
    const [conf,setConf] = useState<any|null>(null);
    const [error,setError] = useState<any>([]);
    const [asyncLoad,setAsyncLoad] = useState<boolean>(false);
    const hasFetched = useRef(false);

    async function carregarNovamente(){
        setAsyncLoad(false);
        console.log('OsIniciada=>',osInicada)
        if(osInicada === null){
            if(route.params !== undefined){
                const lista = async ()=> await buscarOs('buscarOs',route.params.params.NumOs);
                const fetchData = async () => {
                    const vrfConn = await verificarConexao();
                    console.log('vrfConn=>',vrfConn);
                    if(vrfConn.code === 0){
                        const response = await lista();
                        if(response.code === 0){
                            setAsyncLoad(true);
                        }else{
                            setAsyncLoad(true);
                        }
                    }else{
                        apresentaModal(
                            'warning',
                            'information',
                            'Iniciar trabalho',
                            ()=>(
                                <View style={[Styles.em_linhaVertical,Styles.w100,{justifyContent:'center',alignItems:'center'}]}>
                                    <ThemedText type='title' style={[Styles.w100,Styles.lblwarning,{textAlign:'center',marginVertical:10}]}>Atenção</ThemedText>
                                    <MaterialCommunityIcons name='information' size={50} style={[Styles.lblwarning,{marginBottom:20}]}/>
                                    <ThemedText type='defaultSemiBold' style={[Styles.w95,Styles.lblwarning,{textAlign:'center',marginBottom:20}]}>{'Você está no modo "offline", Portanto não carregamos as configurações da loja. Iremos carregar as configurações padrão do sistema.'}</ThemedText>
                                </View>
                            ),
                            'default',
                            ()=>{
                                return(
                                    <TouchableOpacity style={[Styles.btn,Styles.warning,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogcentered,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}
                                        onPress={()=>{
                                            fecharModal('');
                                        }}
                                    >
                                        <ThemedText type='defaultSemiBold' style={[Styles.ft_regular,Styles.lblwarning]}>Entendi</ThemedText>
                                    </TouchableOpacity>
                                )
                            }
                        );
                        setDefaultConfig();
                    }
                }
                fetchData();
            }else{
                setAsyncLoad(true);
                setError([
                    {
                        codigo:1,
                        mensagem:'Erro na rota',
                    }
                ]);
                console.log('Erro na rota');
            }
        }
        setDefaultConfig();
    }

    useEffect(()=>{
        iniciar()
    },[]);
    //const lista = async ()=> await buscarOs('buscarOs',route.params.params.NumOs);
    async function iniciar(){
        carregarTodasImagens();
        if(osInicada === null){
            if(route.params !== undefined){
                const vrfConn = await verificarConexao();
                console.log('vrfConn=>',vrfConn);
                if(vrfConn.code === 0){
                        const response = await lista();
                        if(response.code === 0){
                            setAsyncLoad(true);
                        }else{
                            setAsyncLoad(true);
                        }
                }else{
                    apresentaModal(
                            'warning',
                            'information',
                            'Iniciar trabalho',
                            ()=>(
                                <View style={[Styles.em_linhaVertical,Styles.w100,{justifyContent:'center',alignItems:'center'}]}>
                                    <ThemedText type='title' style={[Styles.w100,Styles.lblwarning,{textAlign:'center',marginVertical:10}]}>Atenção</ThemedText>
                                    <MaterialCommunityIcons name='information' size={50} style={[Styles.lblwarning,{marginBottom:20}]}/>
                                    <ThemedText type='defaultSemiBold' style={[Styles.w95,Styles.lblwarning,{textAlign:'center',marginBottom:20}]}>{'Você está no modo "offline", Portanto não carregamos as configurações da loja. Iremos carregar as configurações padrão do sistema.'}</ThemedText>
                                </View>
                            ),
                            'default',
                            ()=>{
                                return(
                                    <TouchableOpacity style={[Styles.btn,Styles.warning,Styles.em_linhaHorizontal,Styles.w100,Styles.btnDialog,Styles.btnDialogcentered,{borderBottomLeftRadius:5,borderBottomRightRadius:5}]}
                                        onPress={()=>{
                                            fecharModal('');
                                        }}
                                    >
                                        <ThemedText type='defaultSemiBold' style={[Styles.ft_regular,Styles.lblwarning]}>Entendi</ThemedText>
                                    </TouchableOpacity>
                                )
                            }
                    );
                    setDefaultConfig()
                }
            }else{
                setAsyncLoad(true);
                setError([
                    {
                        codigo:1,
                        mensagem:'Erro na rota',
                    }
                ]);
                console.log('Erro na rota');
            }
        }
        setDefaultConfig()
    }

    function setDefaultConfig(){
        setConf([{
            "codigo_config": 3,
            "id_config": "20250107000855",
            "tipo_config": "fotos",
            "valor_config": "2"
        }]);
        setAsyncLoad(true);
    }

    try {
        if(!asyncLoad){
            return(
                <AppLoading msgTitle="Trabalhando nisso!" msgLoad="Carregando dados, Aguarde..."/>
            )
        }else{
            if(error.length > 0){
                return(
                    <SafeAreaView style={[Styles.container,{justifyContent:'center',alignItems:'center'}]}>
                        <View style={[Styles.em_linhaVertical,Styles.btn,Styles.w80,getModalStyle('danger'),{justifyContent:'center',alignItems:'center'}]}>
                            <ThemedText type='title' style={[getModalStyleLabel('danger'),{textAlign:'center'}]}>{'^_^\nErro'}</ThemedText>
                            <View style={[Styles.w100,{backgroundColor:'#FFFFFF',height:1}]}/>
                            <ThemedText type='defaultSemiBold' style={[getModalStyleLabel('danger'),{textAlign:'center'}]}>{'Hummm\nParece que temos um erro no carregamento da O.S.\n\nTente novamente mais tarde ou clique em reportar erro.'}</ThemedText>
                            <View style={[Styles.w100,{backgroundColor:'#FFFFFF',height:1}]}/>
                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.w100,getModalStyle('warning')]}
                                onPress={()=>{
                                    setError([]);
                                    carregarNovamente();
                                }}
                            >
                                <MaterialCommunityIcons name='reload' size={20} style={[getModalStyleLabel('warning'),Styles.mr_5]}/>
                                <ThemedText type='defaultSemiBold' style={[getModalStyleLabel('warning')]}>{'Tentar novamente'}</ThemedText>
                            </TouchableOpacity>
                            <ThemedText type='defaultSemiBold' style={[getModalStyleLabel('danger')]}>{'ou'}</ThemedText>
                            <TouchableOpacity style={[Styles.btn,Styles.em_linhaHorizontal,Styles.w100,getModalStyle('warning')]}
                                onPress={()=>{
                                    apresentaModal(
                                        'dialog',
                                        'help',
                                        'Resetar cachê do APP',
                                        ()=>(
                                            <ThemedView style={[Styles.w100,Styles.em_linhaVertical,{paddingVertical:15}]}>
                                                <ThemedText type='title' style={[Styles.w100,{textAlign:'center'}]}>{'ATENÇÃO'}</ThemedText>
                                                <ThemedText>{'\n'}</ThemedText>
                                                <ThemedText type='subtitle' style={[Styles.w100,{textAlign:'center'}]}>{'Ao limpar o cachê do aplicativo você perderá:'}</ThemedText>
                                                <ThemedText>{'\n\n'}</ThemedText>
                                                <ThemedText type='defaultSemiBold' style={[Styles.w100,{textAlign:'left'}]}>{'1-O.S. finalizadas "OFFLINE" Terão que ser executadas as etapas novamente.'}</ThemedText>
                                                <ThemedText type='defaultSemiBold' style={[Styles.w100,{textAlign:'left'}]}>{'2-Imagens das ordens de serviço terão que ser tiradas novamente.'}</ThemedText>
                                                <ThemedText>{'\n\n'}</ThemedText>
                                                <ThemedText type='subtitle' style={[Styles.w100,{textAlign:'center'}]}>{'Deseja continuar?'}</ThemedText>
                                            </ThemedView>
                                        ),
                                        'default',
                                        ()=>{
                                            return(
                                                <>
                                                    <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w50,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                                                        onPress={()=>{
                                                            fecharModal('');
                                                        }}
                                                    >
                                                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Cancelar</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w50,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                                        onPress={()=>{
                                                            navigation.reset({
                                                                index:0,
                                                                routes:[
                                                                    {
                                                                        name:'reset cache',
                                                                    }
                                                                ]
                                                            });
                                                        }}
                                                    >
                                                        <Text style={[Styles.ft_regular,Styles.lbldanger]}>Sim</Text>
                                                    </TouchableOpacity>
                                                </>
                                            )
                                        }
                                    );
                                }}
                            >
                                <MaterialCommunityIcons name='restart-alert' size={20} style={[getModalStyleLabel('warning'),Styles.mr_5]}/>
                                <ThemedText type='defaultSemiBold' style={[getModalStyleLabel('warning')]}>{'Resetar cachê'}</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                )
            }else{
                return (
                    <ParallaxScrollView
                        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                        headerImage={<MaterialCommunityIcons size={310} name="archive-cog" style={Styles.headerImage} />
                    }
                    >
                        <ThemedView style={[{}]}>
                            <ThemedText type='defaultSemiBold' style={[{color:theme.labels.text}]}>Selecione as etapas conforme realizadas</ThemedText>
                            <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                <Checkbox
                                    status={checked === true ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setIsChecked(!checked);
                                    }}
                                    disabled={checked === true ? true : false}
                                    color={'#FFF'}
                                    uncheckedColor={'green'}

                                />
                                <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>O.S. iniciada</Text>
                            </ThemedView>
                            {
                                conf !== null &&

                                <View>
                                    {
                                        conf[0].valor_config === '2' &&

                                        <View>
                                            <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                                <Checkbox
                                                    status={imagensEmbalagem !== null ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        if(checkedEmbalagem === false ){
                                                            navigation.navigate('embalagem');
                                                        }else{

                                                        }
                                                    }}
                                                    disabled={imagensEmbalagem !== null ? true : false}
                                                    color={theme.labels.text}
                                                    uncheckedColor={theme.labels.text}
                                                />
                                                <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Tire ao menos uma foto da embalagem</Text>
                                            </ThemedView>
                                            {
                                                imagensEmbalagem !== null &&

                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                                                    {
                                                        imagensEmbalagem.map((img:any,i:number)=>{
                                                            return(
                                                                <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                                                    <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                                                </ThemedView>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                            }
                                            <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                                <Checkbox
                                                    status={imagensMontado !== null ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        if(checkedMontado === false ){
                                                            navigation.navigate('montado');
                                                        }else{
                                                            
                                                        }
                                                    }}
                                                    disabled={imagensEmbalagem === null ? true : imagensMontado !== null ? true : false}
                                                    color={theme.labels.text}
                                                    uncheckedColor={theme.labels.text}
                                                />
                                                <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Tire ao menos uma foto do produto montado</Text>
                                            </ThemedView>
                                            {
                                                imagensMontado !== null &&

                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                                                    {
                                                        imagensMontado.map((img:any,i:number)=>{
                                                            return(
                                                                <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                                                    <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                                                </ThemedView>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                            }
                                        </View>
                                    }
                                    {
                                        conf[0].valor_config === '3' &&

                                        <View>
                                            <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                                <Checkbox
                                                    status={imagensEmbalagem !== null ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        if(checkedEmbalagem === false ){
                                                            navigation.navigate('embalagem');
                                                        }else{

                                                        }
                                                    }}
                                                    disabled={imagensEmbalagem !== null ? true : false}
                                                    color={theme.labels.text}
                                                    uncheckedColor={theme.labels.text}
                                                />
                                                <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Tire ao menos uma foto da embalagem</Text>
                                            </ThemedView>
                                            {
                                                imagensEmbalagem !== null &&

                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                                                    {
                                                        imagensEmbalagem.map((img:any,i:number)=>{
                                                            return(
                                                                <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                                                    <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                                                </ThemedView>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                            }
                                            <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                                <Checkbox
                                                    status={imagensMontado !== null ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        if(checkedMontado === false ){
                                                            navigation.navigate('montado');
                                                        }else{
                                                            
                                                        }
                                                    }}
                                                    disabled={imagensEmbalagem === null ? true : imagensMontado !== null ? true : false}
                                                    color={theme.labels.text}
                                                    uncheckedColor={theme.labels.text}
                                                />
                                                <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Tire ao menos uma foto do produto montado</Text>
                                            </ThemedView>
                                            {
                                                imagensMontado !== null &&

                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                                                    {
                                                        imagensMontado.map((img:any,i:number)=>{
                                                            return(
                                                                <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                                                    <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                                                </ThemedView>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                            }
                                            <ThemedView style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start'}]}>
                                                <Checkbox
                                                    status={imagensAmbiente !== null ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        if(checkedAmbiente === false ){
                                                            navigation.navigate('ambiente');
                                                        }else{
                                                            
                                                        }
                                                    }}
                                                    disabled={imagensMontado === null ? true : imagensAmbiente !== null ? true : false}
                                                />
                                                <Text style={[Styles.ft_regular,{color:theme.labels.text}]}>Tire ao menos uma foto do embiente de montagem</Text>
                                            </ThemedView>
                                            {
                                                imagensAmbiente !== null &&

                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.w100]}>
                                                    {
                                                        imagensAmbiente.map((img:any,i:number)=>{
                                                            return(
                                                                <ThemedView key={i} style={[{marginHorizontal:5,marginVertical:10,elevation:5,borderRadius:4,padding:2}]}>
                                                                    <Image source={{uri:img.url}} style={[{width:100,height:100,resizeMode:'stretch',backgroundColor:'#FFF',borderRadius:4}]}/>
                                                                </ThemedView>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                            }
                                        </View>
                                    }
                                    
                                    {
                                        <View>
                                            {
                                                //se o valor de configuração de imagens for igual a 2 fotos então
                                                conf[0].valor_config === '2' && imagensEmbalagem !== null && imagensMontado !== null &&

                                                <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w45,Styles.btn,Styles.danger,{marginHorizontal:0,borderRadius:0,borderTopLeftRadius:50,borderBottomLeftRadius:50}]}
                                                        onPress={()=>{
                                                            limparImagens();//buscarCoordenadas('os iniciada',osInicada,1100,osInicada.dadosOs.dadosOs.os,()=>{navigation.navigate('os iniciada')});
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons name='delete-sweep' size={25} style={[Styles.lbldanger,Styles.mr_5]}/>
                                                        <Text style={[Styles.ft_regular,Styles.lbldanger]}>Limpar imagens</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w55,Styles.btn,Styles.success,{marginHorizontal:0,borderRadius:0,borderTopRightRadius:50,borderBottomRightRadius:50}]}
                                                        onPress={()=>{
                                                            navigation.navigate('assinatura');//buscarCoordenadas('os iniciada',osInicada,1100,osInicada.dadosOs.dadosOs.os,()=>{navigation.navigate('os iniciada')});
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons name='lead-pencil' size={25} style={[Styles.lblsuccess,Styles.mr_5]}/>
                                                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Coletar assinatura</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                            {
                                                //se o valor de configuração de imagens for igual a 3 fotos então
                                                conf[0].valor_config === '3' && imagensEmbalagem !== null && imagensMontado !== null && imagensAmbiente !== null &&

                                                <View style={[Styles.em_linhaHorizontal,{justifyContent:'space-between'}]}>
                                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w50,Styles.btn,Styles.danger,{marginHorizontal:0}]}
                                                        onPress={()=>{
                                                            limparImagens();//buscarCoordenadas('os iniciada',osInicada,1100,osInicada.dadosOs.dadosOs.os,()=>{navigation.navigate('os iniciada')});
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons name='close' size={25} style={[Styles.lbldanger,Styles.mr_5]}/>
                                                        <Text style={[Styles.ft_regular,Styles.lbldanger]}>Limpar imagens</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w50,Styles.btn,Styles.success,{marginHorizontal:0}]}
                                                        onPress={()=>{
                                                            navigation.navigate('assinatura');//buscarCoordenadas('os iniciada',osInicada,1100,osInicada.dadosOs.dadosOs.os,()=>{navigation.navigate('os iniciada')});
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons name='content-save' size={25} style={[Styles.lblsuccess,Styles.mr_5]}/>
                                                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Finalizar trabalho</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                        </View>
                                        
                                        
                                    }
                                </View>
                            }
                            {
                                conf === null &&

                                <View style={[]}>
                                    <Text>Erro</Text>
                                </View>
                            }
                        </ThemedView>
                    </ParallaxScrollView>
                );
            }
        }
    } catch (error) {
        console.log('Error=>',error)
    }
    
}