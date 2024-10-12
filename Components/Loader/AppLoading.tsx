import { ActivityIndicator, SafeAreaView, StatusBar, View, Text} from 'react-native';
import { Styles } from '../../assets/Styles/Styles';
import { useContext } from 'react';
import { AuthLogin } from '../../assets/Contexts/AuthLogin';

export default function AppLoading({msgLoad}:any) {
  const {setMsg} = useContext<any>(AuthLogin);
  return (
    <>
      <SafeAreaView style={[{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'column'}]}>
          <ActivityIndicator size={75} color={'#000000'} style={[{}]}/>
          <Text style={[Styles.w100,{textAlign:'center'}]}>{msgLoad}</Text>
      </SafeAreaView>
      <StatusBar translucent={true} hidden={true}/>
    </>
  );
}