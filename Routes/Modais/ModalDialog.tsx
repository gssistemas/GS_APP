import { useContext } from 'react';
import { View, Text, Button,Modal, TouchableOpacity, Alert} from 'react-native';
import { AuthLogin } from '../../assets/Contexts/AuthLogin';
import { Styles } from '../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export default function ModalDialog({route}:any) {
    const {modalVisible,setModalVisible,iconeModal,titleModal,conteudoModal,actionsModal,stylesModal,getModalStyleLabel,getModalStyleLabelAlert} = useContext<any>(AuthLogin);
    //console.log(iconeModal,titleModal,conteudoModal,actionsModal,stylesModal,route)
    try {
      return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={[Styles.centeredView,Styles.w100,Styles.em_linhaVertical,{alignItems:'stretch'}]}>
          <View style={[Styles.modalView,Styles.w95,Styles.em_linhaVertical,{alignItems:'stretch'}]}>
            {
              titleModal !== '' &&

              <View style={[Styles.em_linhaHorizontal,Styles.w100,{paddingHorizontal:5,alignItems:'center',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#9999',paddingVertical:5}]}>
                <MaterialCommunityIcons name={iconeModal === '' ? 'help' : iconeModal} size={25} style={[Styles.mr_5,{color:'#000000'}]}/>
                <Text style={[Styles.ft_bold,{fontSize:18}]}>{titleModal}</Text>
              </View>
            }
            <View style={[Styles.w100,Styles.em_linhaVertical,{marginVertical:10,paddingHorizontal:15,}]}>
              <MaterialCommunityIcons name={iconeModal} size={75} style={[getModalStyleLabelAlert('warning'),{marginBottom:15,}]}/>
              {conteudoModal}
            </View>
            <View style={[Styles.em_linhaHorizontal,Styles.w100,{alignItems:'stretch',justifyContent:'space-between',borderTopWidth:1,borderTopColor:'#9999'}]}>
              {
                actionsModal
                /*actionsModal.map((act:any,i:number)=>{
                  return(
                    <TouchableOpacity key={i}
                      style={[Styles.w50,{marginHorizontal:0,alignItems:'center',justifyContent:'center',paddingVertical:10,borderRightWidth:i === 0 ? 1 : 0,borderRightColor:i === 0 ? '#999999' : 'transparent',borderLeftWidth:i > 0 ? 1 : 0,borderLeftColor:i > 0 ? '#999999' : 'transparent'}]}
                      onPress={act.action}
                    >
                      {
                        act.icone !== '' && act.icone !== 'none' &&
                        <MaterialCommunityIcons name={act.icone} size={25} color={'#ffffff'}/>
                      }
                      <Text style={[Styles.ft_regular]}>{act.title}</Text>
                    </TouchableOpacity>
                  )
                })*/
              }
            </View>
          </View>
        </View>
      </Modal>
    );
    } catch (error:any) {
      Alert.alert('Erro de inicio','Corrija o erro na linha 60 do modalDialog=>',error.message)
    }
    
}