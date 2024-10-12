import Ionicons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Image, Platform, TextInput, View, Alert } from 'react-native';

import { Collapsible } from '../../../Components/Collapsible';
import { ExternalLink } from '../../../Components/ExternalLink';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedText } from '../../../Components/ThemedText';
import { ThemedView } from '../../../Components/ThemedView';

export default function PraVoce() {
  try {
      return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="store" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Pra você oque conta?</ThemedText>
        </ThemedView>
        <ThemedText>{'Faça uma cotação para obter oque há de mais tecnológico em controle de gestão de pessoas e parceiros\n'}<ThemedText type="defaultSemiBold" style={[{color:'green'}]}>{'\nNós te damos 15 dias de teste pra você testar e aprovar toda a nossa tecnologia.'}</ThemedText></ThemedText>
        <View style={[{flexDirection:'row',alignItems:'center',paddingHorizontal:'2.5%',elevation:5,backgroundColor:'#FFFFFF',height:45,borderRadius:5}]}>
          <Ionicons name='magnify' size={25} color={'#999999'}/>
          <TextInput placeholder='Não encontrou? pesquize aqui...' style={[{paddingHorizontal:5,height:'100%',minWidth:'85%'}]}/>
        </View>
        
        <Collapsible title="Oque você ganha?">
          
            <View style={[{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
              <ExternalLink href="https://sejaparceiro.gsapp.com.br/">
                <ThemedText type="link" style={[{marginRight:10}]}>Abrir APP</ThemedText>
                <Ionicons name='application-export' size={18} style={[{marginLeft:15,lineHeight: 30,fontSize: 16,color: '#0a7ea4'}]}/>
              </ExternalLink>
            </View>
          
        </Collapsible>
      </ParallaxScrollView>
    );
  } catch (error:any) {
    Alert.alert('Erro','Corrija o erro na linha 100 que está impedindo o app de iniciar corretamente.\n'+error.message)
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
