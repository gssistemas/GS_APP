import React, { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert} from 'react-native';
import {AuthLogin} from '../../assets/Contexts/AuthLogin';
import { Styles } from '../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export default function ModalError() {
    const {getModalStyleLabel,getModalStyle,modalVisible,setModalVisible,iconeModal,titleModal,conteudoModal,actionsModal,stylesModal} = useContext<any>(AuthLogin);
    //console.log(iconeModal,titleModal,conteudoModal,actionsModal,stylesModal)
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
        <View style={Styles.centeredView}>
          
          
          <View style={[Styles.modalView,getModalStyle('danger')]}>
            {
              titleModal !== '' &&

              <View style={[Styles.em_linhaHorizontal,Styles.w100,{marginHorizontal:0,paddingHorizontal:5,alignItems:'center',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#9999',paddingVertical:5}]}>
                <View style={[Styles.em_linhaHorizontal,Styles.w90,{marginHorizontal:0,paddingHorizontal:5,alignItems:'center',justifyContent:'flex-start'}]}>
                  <MaterialCommunityIcons name={iconeModal === '' ? 'help' : iconeModal} size={25} style={[Styles.mr_5,getModalStyleLabel('danger'),]}/>
                  <Text style={[Styles.ft_bold,getModalStyleLabel('danger'),]}>{titleModal}</Text>
                </View>
                <TouchableOpacity 
                  style={[Styles.w10,{marginHorizontal:0}]}
                  onPress={()=>{
                    setModalVisible(!modalVisible);
                  }}
                >
                  <MaterialCommunityIcons name='close' size={25}  style={[getModalStyleLabel('danger')]}/>
                </TouchableOpacity>
              </View>
            }
            <View style={[Styles.em_linhaVertical,Styles.w100]}>
              {conteudoModal}
            </View>
            <View style={[Styles.em_linhaHorizontal,Styles.w100,{alignItems:'center',justifyContent:'space-between',borderTopWidth:1,borderTopColor:'#9999'}]}>
              {
                actionsModal
              }
            </View>
          </View>
        </View>
      </Modal>
    );
    } catch (error:any) {
      Alert.alert('Erro de inicio','Corrija o erro na linha 55 do modalError=>',error.message)
    }
    
}