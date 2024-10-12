import React, { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import {AuthLogin} from '../../assets/Contexts/AuthLogin';
import { Styles } from '../../assets/Styles/Styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedText } from '../Components/ThemedText';

export default function ModalLoad() {
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
        <View style={[Styles.centeredView,Styles.w100,]}>
          <View style={[Styles.modalView,getModalStyle('light'),Styles.w95]}>
            {
              titleModal !== '' &&

              <View style={[Styles.em_linhaHorizontal,Styles.w100,{marginHorizontal:0,paddingHorizontal:5,alignItems:'center',justifyContent:'flex-start',borderBottomWidth:1,borderBottomColor:'#9999',paddingVertical:5}]}>
                <View style={[Styles.em_linhaHorizontal,Styles.w90,{marginHorizontal:0,paddingHorizontal:5,alignItems:'center',justifyContent:'flex-start'}]}>
                  <MaterialCommunityIcons name={iconeModal === '' ? 'help' : iconeModal} size={25} style={[Styles.mr_5,getModalStyleLabel('light'),]}/>
                  <Text style={[Styles.ft_bold,getModalStyleLabel('light'),]}>{titleModal}</Text>
                </View>
                <TouchableOpacity 
                  style={[Styles.w10,{marginHorizontal:0}]}
                  onPress={()=>{
                    setModalVisible(!modalVisible);
                  }}
                >
                  <MaterialCommunityIcons name='close' size={25}  style={[getModalStyleLabel('light')]}/>
                </TouchableOpacity>
              </View>
            }
            <View style={[Styles.em_linhaVertical,Styles.w100]}>
              {conteudoModal}
            </View>
            <View style={[Styles.em_linhaHorizontal,Styles.w100,{alignItems:'center',justifyContent:'space-between',borderTopWidth:1,borderTopColor:'#9999'}]}>
              {
                actionsModal !== null && actionsModal
              }
            </View>
          </View>
        </View>
      </Modal>
    );
    } catch (error:any) {
      Alert.alert('Erro de inicio','Corrija o erro na linha 56 do modalLoad=>',error.message)
    }
    
}