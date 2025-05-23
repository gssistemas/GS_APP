import { ActivityIndicator, SafeAreaView, StatusBar, View, Text,Dimensions} from 'react-native';
import { Styles } from '../../assets/Styles/Styles';
import { useContext } from 'react';
import { AuthLogin } from '../../assets/Contexts/AuthLogin';
import { ThemedText } from '../../Routes/Components/ThemedText';
import { useTheme } from '../../assets/Styles/ThemeContext';
const {width,height} = Dimensions.get('window');

export default function AppLoading({msgLoad,msgTitle,loading}:any) {
  const {theme} = useTheme()
  const {setMsg} = useContext<any>(AuthLogin);
  return (
    <SafeAreaView style={[Styles.w100,Styles.em_linhaVertical,{backgroundColor:theme.backgroundColor.background}]} >
      <View style={[{height:'100%',width:'100%',alignItems:'center',backgroundColor:theme.backgroundColor.background,justifyContent:'center',flexDirection:'column'}]}>
          <ThemedText type='title' style={[Styles.w100,{color:theme.labels.text,textAlign:'center',marginBottom:20}]}>{msgTitle}</ThemedText>
          <ActivityIndicator size={75} color={theme.labels.text} style={[{marginBottom:20}]}/>
          <Text style={[Styles.w100,{textAlign:'center',color:theme.labels.text}]}>{msgLoad}</Text>
      </View>
      <StatusBar translucent={true} hidden={true}/>
    </SafeAreaView>
  );
}