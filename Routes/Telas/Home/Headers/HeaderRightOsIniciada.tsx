import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState} from 'react';
import { View,Text, TouchableOpacity,TouchableWithoutFeedback, Alert, Modal, StyleSheet,Animated,Dimensions} from 'react-native';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import { Styles } from '../../../../assets/Styles/Styles';
import { ThemedView } from '../../../Components/ThemedView';
import {useNavigation} from '@react-navigation/native';
const {width,height} = Dimensions.get('window');


export default function HeaderRightOsIniciada() {
    const navigation = useNavigation();
    const {setModalId,osInicada} = useContext<any>(AuthLogin);
    const [modalVisible,setModalVisible] = useState<any>(false);
    const [iconRotation] = useState(new Animated.Value(0));
    //console.log(osInicada)
    const [optionsMenu,setOptionsMenu] = useState([
        {
            id:0,
            title:'Detalhes da O.S.',
            iconLeft:'information',
            iconRight:'chevron-right',
            onPress:()=>{
                try {
                    navigation.navigate('info os',{voltar:'true',dadosOs:osInicada.dadosOs});//assistencias os
                } catch (error) {
                    console.log(error);
                }
                
            }
        },
        {
            id:1,
            title:'Assinalar problema',
            iconLeft:'cancel',
            iconRight:'chevron-right',
            onPress:()=>{
                navigation.navigate('resolucao problema',{voltar:'true',dadosOs:osInicada.dadosOs});//
            }
        },
        {
            id:2,
            title:'Assistência',
            iconLeft:'face-agent',
            iconRight:'chevron-right',
            onPress:()=>{
                navigation.navigate('assistencia os',{voltar:'true',dadosOs:osInicada.dadosOs});//
            }
        }
    ]);
    const [iconBorderRadius] = useState<Animated.Value>(new Animated.Value(0)); // Estado para o borderRadius do ícone
    const [iconElevation] = useState<Animated.Value>(new Animated.Value(0));
    const iconRef = useRef<any>(null);
    //console.log('dados user=>',data)
    const slideAnim = useRef(new Animated.Value(width)).current;

    useEffect(() => {
        startAlertAnimation(); // Inicia a animação de alerta ao carregar o componente
    }, []);

    const startAlertAnimation = () => {
        setInterval(() => {
            Animated.sequence([
                Animated.timing(iconBorderRadius, {
                    toValue: 25, // Raio do borderRadius
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(iconBorderRadius, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();

            Animated.sequence([
                Animated.timing(iconElevation, {
                    toValue: 10, // Raio do borderRadius
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(iconElevation, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 4000); // Executa a cada 10 segundos
    };

    const openModal = () => {
        //setModalId('menu');
        setModalVisible(true);
        animateIcon(true); // Anima o ícone para horizontal
        Animated.timing(slideAnim, {
            toValue: 60- width, // Desliza para o centro
            duration: 300,
            useNativeDriver: true,
        }).start(()=>{
            setModalVisible(true);
        });
    };

    const closeModal = () => {
        //setModalId('');
        animateIcon(false); // Anima o ícone para horizontal
        Animated.timing(slideAnim, {
            toValue: width, // Desliza para fora da tela à direita
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            setModalVisible(false);
        });
    };

    const animateIcon = (isVertical: boolean) => {
        Animated.timing(iconRotation, {
            toValue: isVertical ? 1 : 0, // 1 para vertical, 0 para horizontal
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const iconRotationInterpolate = iconRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'], // Horizontal para 90 graus (vertical)
    });
    try {
        return (
            <>
                <TouchableOpacity
                    onPress={()=>{
                        if(modalVisible === false){
                            openModal()
                        }else{
                            closeModal()
                        }
                    }}
                >
                    <Animated.View style={[Styles.mr_5,{borderRadius:50,backgroundColor:'slateblue', transform: [{ rotate: iconRotationInterpolate }],elevation:iconElevation, overflow: 'hidden' }]}>
                        <MaterialCommunityIcons size={25} name='dots-horizontal' style={[{color:'#FFF'}]}/>
                    </Animated.View>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => closeModal()}
                >
                <TouchableWithoutFeedback onPress={()=>closeModal()}>
                <View style={styles.modalBackground}>
                    <TouchableOpacity style={[/*Styles.btn,Styles.danger,Styles.em_linhaHorizontal,*/styles.closeButton,{zIndex:999,/*backgroundColor:'#fff'*/}]}>
                        
                    </TouchableOpacity>
                    <Animated.View style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}>
                        {
                            optionsMenu.map((opt:any,i:number)=>{
                                //console.log(opt,i,optionsMenu.length);
                                return(
                                    <TouchableOpacity key={i} style={[Styles.em_linhaHorizontal,Styles.w100,{justifyContent:'space-between',paddingVertical:10,borderBottomWidth: (i < optionsMenu.length - 1 ? 1 : 0),borderBottomColor:(i < optionsMenu.length - 1 ? '#999999' : 'transparent')}]}
                                        onPress={()=>{opt.onPress(),closeModal()}}
                                    >
                                        <View style={[Styles.em_linhaHorizontal]}>
                                            <MaterialCommunityIcons name={opt.iconLeft} size={25} style={[Styles.mr_5]}/>
                                            <Text style={[Styles.ft_regular]}>{opt.title}</Text>
                                        </View>
                                        <MaterialCommunityIcons name={opt.iconRight} size={25}/>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </Animated.View>
                </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity style={[styles.optionButton, styles.closeButton]}onPress={() => closeModal()}></TouchableOpacity>
                </Modal>
            </>
            
        );
    } catch (error:any) {
        Alert.alert('Erro de inicio','Corrija o erro na linha 88=>',error.message)
    }
    
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
      container: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      modalBackground: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
      modalContainer: {
        width: width-60,
        marginLeft:width,
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'flex-start',
        height:'auto',
        marginTop:60,
      },
      modalTitle: {
          flexDirection:'column',
          backgroundColor:'slateblue',
          alignItems:'flex-start',
          justifyContent:'flex-start',
          paddingHorizontal:15,
          width:'100%',
          paddingVertical:20,
          fontSize: 20,elevation:2,borderRadius:2
      },
      optionButton: {
          flexDirection:'row',
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          width: '100%',
          alignItems: 'flex-start',
          justifyContent:'flex-start'
      },
      optionText: {
        fontSize: 18,
      },
      closeButton: {
          position:'absolute',
          top:0,left:0,
          bottom:0,
          width:57,
          backgroundColor: 'transparent',
          borderRadius: 5,
      },
      avatar:{
          resizeMode:'stretch',
          width:45,
          height:45,
          borderRadius:50,
          borderTopLeftRadius:0
      }
})