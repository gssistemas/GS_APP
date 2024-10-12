import { View,Text,Dimensions,TouchableOpacity} from 'react-native';
import { Styles } from '../../../../assets/Styles/Styles';
import { FlatList } from 'react-native-gesture-handler';
import { useContext } from 'react';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { ThemedView } from '../../../Components/ThemedView';
import { ThemedText } from '../../../Components/ThemedText';
import { useTheme } from '../../../../assets/Styles/ThemeContext';
const {width,height} = Dimensions.get('window');

export default function OsDisponiveis() {
    const {theme} = useTheme()
    const {OsDisponiveis} = useContext<any>(AuthLogin);
    return(
      <View style={[Styles.em_linhaVertical,Styles.w100,{height:height - 110,backgroundColor:theme.backgroundColor.background}]}>
        <FlatList 
          data={OsDisponiveis}
          style={[Styles.w95,{backgroundColor:theme.backgroundColor.background}]}
          renderItem={({item})=>{
            return(
              <View style={[Styles.em_linhaHorizontal]}>

              </View>
            )
          }}
          ListHeaderComponent={()=>{
            return(
            <View style={[Styles.em_linhaHorizontal,{justifyContent:'flex-start',paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#999'}]}>
              <ThemedText type='defaultSemiBold'>Ordens de serviço DISPONÍVES</ThemedText>
            </View>

          )}}
          ListEmptyComponent={()=>{
            return(
              <View style={[{width:'95%',marginHorizontal:'2.5%',height:height - 180,alignItems:'center',justifyContent:'center',backgroundColor:theme.backgroundColor.background}]}>
                <View style={[Styles.warning,{flexDirection:'column',alignItems:'center',paddingVertical:20,justifyContent:'center',width:'100%',height:'auto',borderRadius:20,elevation:5,}]}>
                  <MaterialCommunityIcons name='sleep' size={57} style={[Styles.lblwarning]}/>
                  <ThemedText type='defaultSemiBold' style={[Styles.lblwarning,Styles.w100,{textAlign:'center'}]}>Sem O.S. DISPONÍVEIS no momento!</ThemedText>
                </View>
              </View>
            )
          }}
        />
      </View>
    )
}