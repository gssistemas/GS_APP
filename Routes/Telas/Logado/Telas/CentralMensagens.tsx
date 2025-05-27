import React, { useContext, useEffect, useRef, useState } from "react";
import { Styles } from "../../../../assets/Styles/Styles";
import {MaterialCommunityIcons,Ionicons} from '@expo/vector-icons';
import { Text, TouchableOpacity, View, Dimensions, TextInput, Image, FlatList, ToastAndroid} from "react-native";
import { useTheme } from "../../../../assets/Styles/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import { AuthLogin } from "../../../../assets/Contexts/AuthLogin";
import { Dropdown } from "react-native-element-dropdown";
import Config from '../../../../assets/Config/Config.json';
import axios from "axios";
import { ThemedView } from "../../../Components/ThemedView";
const {width,height} = Dimensions.get('window');

export default function CentralMensagens({route,navigation}:any){
    const {usuario,parceiroSearch,parceiros,getModalStyleLabelAlert} = useContext<any>(AuthLogin);
    const {theme} = useTheme()
    const [value,setValue] = useState('');
    const [listLojas,setListLojas] = useState<null|any>(null);
    const [arrayMensagens,setArrayMensagens] = useState<any|null>(null);
    const [liberado,setLiberado] = useState(false);
    const [mensagem,setMensagem] = useState('');
    const [tipoMensagem,setTipoMensagem] = useState('texto');
    const scrollViewRef = useRef(null);
    const [data,setData] = useState<any>([]);//parceiros;
    let id = useState<number>(0);
    //console.log('dados para envio da mensagem=> De:',usuario.id_user+'-> Para:'+value);

    async function conversar(){

    }

    async function sendMessage(comando:string,de:string,para:string,typeMessage:string,message:string){
        let formData = new FormData();
        
        formData.append('comando',comando);
        formData.append('de',de);
        formData.append('para',para);
        formData.append('typeMessage',typeMessage);
        formData.append('message',message);

        const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Log de envio',response.data);

        if(response.data[0].status === 'OK' && response.data[0].statusCode ===200){
            setArrayMensagens(response.data[0].arrayMsgs);
            setMensagem('');
            /*if(value !== ''){
                const search = await searchMessage('buscarconversa',usuario.id_user,value);

                if(search.code === 0){
                    setArrayMensagens(search.msgs);
                    console.log(arrayMensagens);
                }
            }*/
        }else{
            console.log('Mensagem não enviada');
        }
    }

    async function searchMessage(comando:string,de:string,para:string){
        let formData = new FormData();
        
        formData.append('comando',comando);
        formData.append('de',de);
        formData.append('para',para);

        const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Log de busca',response.data);

        if(response.data[0].status === 'OK' && response.data[0].statusCode ===200){
            setArrayMensagens(response.data[0].arrayMsgs);
            return {status:'sucesso',code:0,mensagem:response.data[0].mensagem,msgs:response.data[0].arrayMsgs};
        }else{
            return {status:'Erro',code:1,mensagem:response.data[0].mensagem,msgs:response.data[0].arrayMsgs};
        }
    }

    async function leadMessage(comando:string,de:string,para:string,id:string){
        let formData = new FormData();
        
        formData.append('comando',comando);
        formData.append('de',de);
        formData.append('para',para);
        formData.append('id',id);

        const response = await axios.post(Config.configuracoes.pastaProcessos, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Log de ler mensagem',response.data);

        if(response.data[0].status === 'OK' && response.data[0].statusCode ===200){
            return {status:'sucesso',code:0,mensagem:response.data[0].mensagem,msgs:response.data[0].arrayMsgs};
        }else{
            return {status:'Erro',code:1,mensagem:response.data[0].mensagem,msgs:response.data[0].arrayMsgs};
        }
    }

    async function inicio(){
        const empresas = await parceiroSearch('carregarlojaparceira',usuario.id_user);

        if(empresas.code ===0){
            setLiberado(true);
            if(value !== ''){
                setInterval( async () => {
                    const search = await searchMessage('buscarconversa',usuario.id_user,value);

                    if(search.code === 0){
                        setArrayMensagens(search.msgs);
                        console.log(arrayMensagens);
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }
                },5000);
            }
        }else{
            setLiberado(false);
        }
    }

    const renderItem = (item:any) => {
        return (
          <View style={[Styles.item,{backgroundColor:theme.backgroundColor.background}]}>
            <Text style={[Styles.textItem,{color:theme.labels.text}]}>{item.label}</Text>
            {item.value === value && (
              <MaterialCommunityIcons
                style={[Styles.icon,{color:theme.labels.text}]}
                color={theme.labels.text}
                name="check-all"
                size={20}
              />
            )}
          </View>
        );
    };

    function retornaMensagens(msgs:any){
        if(msgs !== null && msgs !== undefined){
            console.log('retorno da mensagem do usuário=>',msgs[0].mensagem)
            return(
                <Text>{msgs[0].mensagem}</Text>
            )
        }
        /*var array:any = [];
        if(msgs !== null && msgs !== undefined){
            for (let index = 0; index < msgs.length; index++) {
                const element = msgs[index];
                console.log('retorno da mensagem do usuário=>',element)
                array.push(element)
                return(
                    <Text>{element.mensagem}</Text>
                )
            }
            
        }else{
            return(
                <View style={[]}>
                    <Text>{'nenhuma mensagem nova!'}</Text>
                </View>
            )
        }*/
    }

    useEffect(()=>{
        //inicio()
        BuscarUsers(usuario.id_login[0].codigo)
    },[])

    async function BuscarUsers(id:string){
        const users = await axios({
            method:'get',
            url:'https://gsapp.com.br/app/chats/sys/busca_user.php',
            params:{
                id:id
            }
        }).then((users)=>{
            if(users.data[0].status === 'OK'){
                setData(users.data[0].usuarios);
                //verifica(0,0,usuario.id_login[0].codigo);
                //return {status:'sucesso',code:0,mensagem:users.data[0].mensagem,users:users.data[0].users};
            }else{
                setData([]);
            }
        }).catch((error:any)=>{
            ToastAndroid.show(error.message+', Try update your APP.', ToastAndroid.LONG);
        });
    }

    let intervalId:any;

    try {
        return(
            <View style={[Styles.w100,{flex:1}]}>
                <View style={[Styles.w100]}>
                    <View style={[Styles.em_linhaHorizontal,Styles.w100,{height:50,justifyContent:'space-between',backgroundColor:theme.backgroundColor.background}]}>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal,{width:'10%',height:'80%',marginLeft:10,marginRight:-35}]} onPress={()=>{navigation.goBack()}}>
                            <Ionicons name="chevron-back" size={32} color={theme.labels.text}/>
                        </TouchableOpacity>
                        <View style={[Styles.em_linhaHorizontal,Styles.w70,{marginHorizontal:0,justifyContent:'flex-start'}]}>
                            <Image source={{uri:Config.configuracoes.pathPadrao+'/imagens/imagens_users/'+usuario.id_login[0].imagem}} style={[Styles.mr_5,{width:40,height:40,resizeMode:'stretch',borderRadius:40}]}/>
                            <View style={{width:12,height:12,backgroundColor:'green',borderRadius:12,borderWidth:2,borderColor:'#FFF',position:'absolute',left:30,bottom:2}}/>
                            <Text style={[Styles.ft_bold,{marginHorizontal:0,fontSize:18,color:theme.labels.text}]}>{usuario.id_login[0].nome_montador}</Text>
                        </View>
                        <TouchableOpacity style={[Styles.em_linhaHorizontal,{marginHorizontal:5}]}>
                            <MaterialCommunityIcons name="dots-vertical" size={25} color={theme.labels.text}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[Styles.w100,{flex:1}]}>
                    <FlatList 
                        style={[Styles.w100,{backgroundColor:theme.backgroundColor.background}]}
                        data={data}
                        renderItem={({item})=>{
                            item.mensagens.length > 0 && console.log('item=>',item.mensagens[0]);
                            return(
                                <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w95,{marginHorizontal:0,height:70,justifyContent:'space-between',backgroundColor:theme.backgroundColor.background}]} onPress={()=>{setValue(item.value),navigation.navigate('Mensagens',{meuid:usuario.id_login[0].codigo,idConversa:item.codigo,nomeUser:item.nome,fotoUser:item.fotoUser})}}>
                                    <View style={[Styles.em_linhaHorizontal,Styles.w60,{marginHorizontal:0,justifyContent:'flex-start'}]}>
                                        <Image source={{uri:item.fotoUser === '' ? Config.configuracoes.pathPadrao+'/imagens/imagens_users/sem_imagem.png' : Config.configuracoes.pathPadrao+'/'+item.fotoUser}} style={[Styles.mr_5,{width:40,height:40,resizeMode:'stretch',borderRadius:40}]}/>
                                        {
                                            item.status === 'on' &&

                                            <View style={{width:12,height:12,backgroundColor:'green',borderRadius:12,borderWidth:2,borderColor:'#FFF',position:'absolute',left:30,bottom:2}}/>
                                        }
                                        <View style={[Styles.em_linhaVertical,{justifyContent:'flex-start',alignItems:'flex-start'}]}>
                                            <Text style={[Styles.ft_bold,{marginHorizontal:0,fontSize:18,color:theme.labels.text}]}>{item.nome}</Text>
                                            {
                                                <Text  style={[Styles.ft_regular,{color:theme.labels.text}]}>{item.mensagens.length > 0 ? retornaMensagens(item.mensagens) : 'Sem mensagens'}</Text>//<Text style={[Styles.ft_bold,{marginHorizontal:0,fontSize:item.status === 'on' ? 14 : 12,color:item.status === 'on' ? 'green' : '#999999'}]}>{item.mensagens !== null && item.mensagens !== undefined ? item.mensagens[0].mensagem : ''}</Text>//retornaMensagens(item.mensagens !== null && item.mensagens[0].mensagem !== undefined ? item.mensagens : null)
                                            }
                                        </View>
                                    </View>
                                    {
                                        item.mensagens.length > 0 ?

                                        <View style={[Styles.em_linhaVertical,Styles.w40,{marginHorizontal:0,height:30,justifyContent:'space-between',alignItems:'flex-end'}]}>
                                            <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'center',alignItems:'center',backgroundColor:'red',borderRadius:20,width:20,height:20}]}>
                                                <Text>{item.mensagens.length > 0 ? item.mensagens.length : ''}</Text>
                                            </View>
                                            {
                                                item.mensagens[0].statusLido === 'nao lida' ?

                                                <View style={[Styles.em_linhaHorizontal]}>
                                                    <Text style={[Styles.ft_regular,Styles.mr_5,{fontSize:10,color:theme.labels.text}]}>{item.mensagens[0].envio}</Text>
                                                    <MaterialCommunityIcons name="check-all" size={12} style={[{color:'#999999'}]}/>
                                                </View>
                                                :
                                                <View style={[Styles.em_linhaHorizontal]}>
                                                    <Text style={[Styles.ft_regular,Styles.mr_5,{fontSize:10,color:theme.labels.text}]}>{item.mensagens[0].lido}</Text>
                                                    <MaterialCommunityIcons name="check-all" size={12} style={[{color:'blue'}]}/>
                                                </View>
                                            }
                                        </View>
                                        :
                                        ''
                                    }
                                    
                                </TouchableOpacity>
                            )
                        }}
                        ListEmptyComponent={()=>{
                            return(
                                <View style={[Styles.w100,{backgroundColor:theme.backgroundColor.background,alignItems:'center',justifyContent:'center'}]}>
                                    <View style={[Styles.em_linhaVertical,Styles.btn,Styles.warning,{paddingHorizontal:15,paddingVertical:20,borderRadius:10}]}>
                                        <MaterialCommunityIcons name="sleep" size={45} style={[Styles.lblwarning,{marginBottom:20}]}/>
                                        <Text style={[Styles.ft_medium,Styles.lblwarning,{textAlign:'center'}]}>{'HUM...\n\nParece que não há ninguém online no momento!'}</Text>
                                        <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.btn,Styles.success,{marginTop:20,paddingHorizontal:15,paddingVertical:10,borderRadius:10}]} onPress={()=>{BuscarUsers(usuario.id_login[0].id)}}>
                                            <MaterialCommunityIcons name="sync" size={20} style={[Styles.lblsuccess,{marginRight:5}]}/>
                                            <Text style={[Styles.ft_regular,{color:'#FFFFFF'}]}>Atualizar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }}
                        ItemSeparatorComponent={()=>{
                            return(
                                <View style={[Styles.w100,{height:1,backgroundColor:'#999999'}]}/>
                            )
                        }}
                        keyExtractor={(item)=>item.codigo}
                    />
                </View>
            </View>
        )
        /*return(
            <View style={[Styles.w100,{flex:1}]}>
                
                {
                    data === null || value === '' ?
                    <>
                        <View style={[Styles.w100]}>
                            <View style={[Styles.em_linhaHorizontal,Styles.w100,{height:50,justifyContent:'space-between',backgroundColor:theme.backgroundColor.background}]}>
                                <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w10,{marginHorizontal:2.5}]} onPress={()=>{navigation.goBack()}}>
                                    <Ionicons name="chevron-back" size={25} color={theme.labels.text}/>
                                </TouchableOpacity>
                                <Text style={[Styles.ft_bold,Styles.w70,{marginHorizontal:0,fontSize:18,color:theme.labels.text}]}>{'Selecione a empresa'}</Text>
                                <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w10,{marginHorizontal:2.5}]}>
                                    <Ionicons name="options" size={25} color={theme.labels.text}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            data !== null &&
                            <Dropdown
                                style={[Styles.dropdown,{minWidth:'100%'}]}
                                placeholderStyle={Styles.placeholderStyle}
                                selectedTextStyle={Styles.selectedTextStyle}
                                inputSearchStyle={Styles.inputSearchStyle}
                                iconStyle={Styles.iconStyle}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Selecione a empresa..."
                                searchPlaceholder="Buscar..."
                                value={value}
                                onChange={item => {
                                    setValue(item.value);
                                    console.log(item.value)
                                    searchMessage('buscarconversa',usuario.id_user,item.value);
                                }}
                                renderLeftIcon={() => (
                                    <MaterialCommunityIcons style={Styles.icon} color="black" name="list-status" size={20} />
                                )}
                                renderItem={renderItem}
                            />
                        }
                    </>
                :
                    <>
                        {
                            value !== '' &&

                            <View style={[Styles.w100,{flex:1}]}>
                                <View style={[Styles.em_linhaHorizontal,Styles.w100,{height:50,justifyContent:'space-between',backgroundColor:theme.backgroundColor.background}]}>
                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w10,{marginHorizontal:2.5}]} onPress={()=>{navigation.goBack()}}>
                                        <Ionicons name="chevron-back" size={25} color={theme.labels.text}/>
                                    </TouchableOpacity>
                                    <Text style={[Styles.ft_bold,Styles.w70,{marginHorizontal:0,fontSize:18,color:theme.labels.text}]}>{route.name}</Text>
                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w10,{marginHorizontal:2.5}]}>
                                        <Ionicons name="options" size={25} color={theme.labels.text}/>
                                    </TouchableOpacity>
                                </View>
                                {
                                    data !== null &&
                                    <Dropdown
                                        style={[Styles.dropdown,{minWidth:'100%'}]}
                                        placeholderStyle={Styles.placeholderStyle}
                                        selectedTextStyle={Styles.selectedTextStyle}
                                        inputSearchStyle={Styles.inputSearchStyle}
                                        iconStyle={Styles.iconStyle}
                                        data={data}
                                        search
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Selecione a empresa..."
                                        searchPlaceholder="Buscar..."
                                        value={value}
                                        onChange={item => {
                                            setValue(item.value);
                                            //console.log(item.value)
                                            searchMessage('buscarconversa',usuario.id_user,item.value);
                                        }}
                                        renderLeftIcon={() => (
                                            <MaterialCommunityIcons style={Styles.icon} color="black" name="store" size={20} />
                                        )}
                                        renderItem={renderItem}
                                    />
                                }
                                {
                                    arrayMensagens === null &&

                                    <View style={[{backgroundColor:theme.backgroundColor.background,width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}]}>
                                        <View style={[Styles.em_linhaVertical,Styles.btn,Styles.warning,{paddingHorizontal:15,paddingVertical:20,borderRadius:10}]}>
                                            <Ionicons name="alert-circle" size={45} style={[Styles.lblwarning,{marginBottom:20}]}/>
                                            <Text style={[Styles.ft_medium,Styles.lblwarning,{textAlign:'center'}]}>{'Você não enviou nenhuma mensagem para central!\nEnvie uma mensagem caso precise.'}</Text>
                                        </View>
                                    </View>
                                }
                                {
                                    arrayMensagens !== null &&
                                    <ScrollView showsVerticalScrollIndicator={false} style={[Styles.w100,{backgroundColor:theme.backgroundColor.background,height:'auto',marginBottom:50}]} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
                                        {
                                            arrayMensagens.map((msg:any,i:number)=>{
                                                console.log(msg);
                                                id = msg.codigo
                                                return(
                                                    <ThemedView key={i+1} style={[Styles.w100,{backgroundColor:theme.backgroundColor.background}]}>
                                                        {
                                                            msg.id_de === usuario.id_user ?
                                                            <View key={i} style={[Styles.em_linhaVertical,{alignItems:'flex-start',justifyContent:'flex-start',backgroundColor:'#F0F8FF',borderWidth:1,borderColor:'#F0F8FF',width:'auto',maxWidth:'70%',marginVertical:10,marginLeft:35,paddingHorizontal:10,paddingLeft:10,paddingBottom:0,paddingTop:2,borderRadius:8,borderTopLeftRadius:0,marginHorizontal:10,elevation:5}]}>
                                                                <View style={[Styles.trianglePara,{position:'absolute',left:-8,top:-1.6,width:9,height:10,borderLeftWidth: 5,borderRightWidth: 0,borderBottomWidth: 10,borderBottomColor:'#F0F8FF',transform:[{ rotate: '-90deg' }]}]}/>
                                                                <View style={[Styles.em_linhaHorizontal,{alignItems:'flex-start'}]}>
                                                                    
                                                                    <Text style={[Styles.ft_regular]}>{msg.mensagem}</Text>
                                                                </View>
                                                                <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'flex-end'}]}>
                                                                    {
                                                                        msg.status === 0 ?

                                                                        <Text style={[Styles.mr_5,Styles.ft_regular,{fontSize:12,marginRight:5}]}>{msg.data}</Text>

                                                                        :

                                                                        <Text style={[Styles.ft_regular,{fontSize:12,marginRight:5}]}>{msg.data_lido}</Text>
                                                                    }
                                                                    {
                                                                        msg.status === 0 ?

                                                                        <MaterialCommunityIcons name="check-all" size={12} style={[{color:'#999999'}]}/>

                                                                        :

                                                                        <MaterialCommunityIcons name="check-all" size={12} style={[{color:'blue'}]}/>
                                                                    }
                                                                </View>
                                                            </View>

                                                            :

                                                            <View key={i} style={[{maxWidth:'70%',backgroundColor:'#7FFFD4',justifyContent:'flex-end',borderWidth:1,borderColor:'#7FFFD4',marginVertical:10,paddingHorizontal:10,paddingVertical:0,borderRadius:8,borderTopRightRadius:0,marginRight:55,marginLeft:'auto',elevation:5}]}>
                                                                <View style={[Styles.trianglePara,{position:'absolute',right:-4,top:-1.6,width:9,height:10,borderLeftWidth: 0,borderRightWidth: 5,borderBottomWidth: 10,borderBottomColor:'#7FFFD4',transform:[{ rotate: '90deg' }]}]}/>
                                                                    <View style={[Styles.em_linhaHorizontal,{alignItems:'flex-end',justifyContent:'flex-end'}]}>
                                                                        <Text style={[Styles.ft_regular,{textAlign:'left'}]}>{msg.mensagem}</Text>
                                                                        <Image source={{uri:Config.configuracoes.pathPadrao+'/'+usuario.imagem}} style={[{marginTop:-15,width:30,height:30,resizeMode:'stretch',marginRight:-45,marginLeft:15,borderRadius:30}]}/>
                                                                        
                                                                    </View>
                                                                <View style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'flex-end'}]}>
                                                                    {
                                                                        msg.status === 0 ?

                                                                        <Text style={[Styles.mr_5,Styles.ft_regular,{fontSize:12}]}>{msg.data}</Text>

                                                                        :

                                                                        <Text style={[Styles.ft_regular,{fontSize:12}]}>{msg.data_lido}</Text>
                                                                    }
                                                                </View>
                                                            </View>
                                                        }
                                                    </ThemedView>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                }
                                <View style={[Styles.em_linhaHorizontal,Styles.w100,{position:'absolute',bottom:0,left:0,right:0,height:55,justifyContent:'space-between',backgroundColor:theme.backgroundColor.background}]}>
                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w10,{marginHorizontal:2.5}]} onPress={()=>{navigation.goBack()}}>
                                        <MaterialCommunityIcons name="plus" size={25} color={theme.labels.text}/>
                                    </TouchableOpacity>
                                    <TextInput style={[Styles.ft_regular,Styles.w75,Styles.input,{marginHorizontal:0,marginBottom:0,fontSize:16,borderRadius:10,borderWidth:1,borderColor:'#999999',paddingHorizontal:5,paddingVertical:5}]} placeholder="Digite sua mensagem..." multiline={true} value={mensagem} onChangeText={(text)=>{setMensagem(text)}} onFocus={()=>{searchMessage('buscarconversa',usuario.id_user,value),scrollViewRef.current?.scrollToEnd({ animated: true })}} onPress={()=>{leadMessage('marcarlido',usuario.id_user,value,id+1),searchMessage('buscarconversa',usuario.id_user,value),scrollViewRef.current?.scrollToEnd({ animated: true })}} onBlur={()=>{searchMessage('buscarconversa',usuario.id_user,value),scrollViewRef.current?.scrollToEnd({ animated: true })}}/>
                                    <TouchableOpacity style={[Styles.em_linhaHorizontal,Styles.w10,{marginHorizontal:2.5}]}
                                        onPress={()=>{
                                            sendMessage('sendmensagem',usuario.id_user,value,tipoMensagem,mensagem);
                                        }}
                                    >
                                        <Ionicons name="send" size={25} color={theme.labels.text}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </>
                }
            </View>
        )*/
    } catch (error:any) {
        console.warn(error.message);
    }
}