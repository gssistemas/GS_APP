import Ionicons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Image, Platform, TextInput, View,Text , TouchableOpacity, Alert } from 'react-native';
import { Collapsible } from '../../../Components/Collapsible';
import { ExternalLink } from '../../../Components/ExternalLink';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedText } from '../../../Components/ThemedText';
import { ThemedView } from '../../../Components/ThemedView';
import { useContext, useEffect, useState } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {useNavigation} from '@react-navigation/native';
import Config from '../../../../assets/Config/Config.json';
import { Styles } from '../../../../assets/Styles/Styles';

export default function Explorer({}:any) {
  const navigation = useNavigation()
  const {listParceiros,searchByTitle,pesquiza,buscarEmpresas} = useContext<any>(AuthLogin);
  const [pesq,setPesq] = useState('');

  useEffect(()=>{
    buscarEmpresas('buscarEmpresas','all') && console.log(listParceiros)
  },[])
  try {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="apps" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Parceiros</ThemedText>
      </ThemedView>
      <ThemedText>{'Este app inclui várias empresas parceiras, Escolha a qual você presta serviço.\n'}<ThemedText type="defaultSemiBold" style={[{color:'red'}]}>Nota:{'\nIsso voçê fará apenas no primeiro acesso ou quando sair do app.'}</ThemedText></ThemedText>
      <View style={[{flexDirection:'row',alignItems:'center',paddingHorizontal:'2.5%',elevation:5,backgroundColor:'#FFFFFF',height:45,borderRadius:5}]}>
        <Ionicons name='magnify' size={25} color={'#999999'}/>
        <TextInput placeholder='Não encontrou? pesquize aqui...' style={[{paddingHorizontal:5,height:'100%',minWidth:'82.8%',maxWidth:'82.8%'}]} onChangeText={(text)=>{console.log(setPesq(text))}}/>
        <TouchableOpacity style={[{backgroundColor:'#483D8B',height:'100%',paddingHorizontal:8,borderTopRightRadius:5,borderBottomRightRadius:5,alignItems:'center',justifyContent:'center'}]}
          onPress={()=>{searchByTitle(listParceiros, pesq)}}
        >
          <Ionicons name='magnify' size={25} color={'#FFFFFF'} style={[{marginLeft:-2}]}/>
        </TouchableOpacity>
      </View>
      {
        pesq !== '' &&
        <>
        {
          pesquiza !== undefined && pesquiza !== null  && 

          pesquiza.map((parc:any,i:number)=>{
            //console.log('40=>',parc)
            return(
              <Collapsible key={parc.id} title={parc.title}>
                  <TouchableOpacity onPress={()=>{navigation.navigate(parc.onPress,{loja:parc.title})}} style={[{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                    <ThemedText type="link" style={[{marginRight:10}]}><Text>{parc.titleButton}</Text></ThemedText>
                    <Ionicons name={parc.icon} size={18} style={[{marginLeft:15,lineHeight: 30,fontSize: 16,color: '#0a7ea4'}]}/>
                  </TouchableOpacity>
              </Collapsible>
            )
          })
        }
        </>
        
      }
      {
        pesq === '' &&
          <>
            {
              listParceiros !== undefined &&

              listParceiros.map((parc:any,i:number)=>{
                console.log('61=>',parc)
                return(
                  <Collapsible key={parc.id} title={parc.title}>
                      <TouchableOpacity onPress={()=>{navigation.navigate(parc.onPress,{loja:parc.title,clienteid:parc.id})}} style={[Styles.em_linhaHorizontal,Styles.btn,{paddingHorizontal:0,paddingLeft:-1,paddingVertical:0,width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                        <View style={[Styles.em_linhaHorizontal,{width:'33.5%',marginHorizontal:0}]}>
                          <Image source={{uri:Config.configuracoes.pathPadrao+'/'+parc.imagem}} style={[Styles.mr_5,{paddingHorizontal:2.5,backgroundColor:'green',width:100,height:55,borderRadius:4,borderWidth:1,borderColor:'#999',padding:2,resizeMode:'stretch'}]}/>
                        </View>
                        <View style={[Styles.em_linhaHorizontal,{width:'66.5%',marginHorizontal:0,justifyContent:'space-between',borderWidth:1,borderColor:'#999',paddingHorizontal:10,height:'100%',borderRadius:4}]}>
                          <ThemedText type="link" style={[{marginRight:10}]}>{parc.titleButton}</ThemedText>
                          <Ionicons name={parc.icon} size={18} style={[{marginLeft:5,lineHeight: 30,fontSize: 16,color: '#0a7ea4'}]}/>
                        </View>
                      </TouchableOpacity>
                  </Collapsible>
                )
              })
            }
          </>
      }
    </ParallaxScrollView>
  );
  } catch (error:any) {
    Alert.alert('Erro de inicio','Corrija o erro na linha 88=>',error.message)
  }
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
