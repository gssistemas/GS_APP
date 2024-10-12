import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import {View,Text, Platform,Linking, TouchableOpacity, Alert} from 'react-native';
import { Styles } from '../../assets/Styles/Styles';
import { ActivityIndicator } from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';

/*type Props = Omit<ComponentProps<typeof Linking>, 'href'> & { href: string };*/

export function ExternalLink({ href, ...rest }:any) {
  const openWebsite = () => {
    Linking.openURL(href).catch(err => console.error("Couldn't load page", err));
  };
  try {
    return (
    <View style={[Styles.em_linhaVertical,Styles.w100,{height:'100%'}]}>
        <TouchableOpacity style={[Styles.w100,Styles.em_linhaHorizontal,Styles.btn,Styles.primary,{backgroundColor:'transparent',borderWidth:0,elevation:0}]}
          onPress={()=>{
            openWebsite();
          }}
        >
          <Text style={[Styles.ft_regular,Styles.lblprimary,{color:'#0d6efd'}]}>Conhecer mais</Text>
          <MaterialCommunityIcons size={25} style={[Styles.lblprimary,{color:'#0d6efd'}]} name='chevron-double-right'/>
        </TouchableOpacity>
    </View>
  );
  } catch (error:any) {
    Alert.alert('Erro de inicio','Corrija o erro na linha 88=>',error.message)
  }
  
  /*return (
    <Linking
      target="_blank"
      {...rest}
      href={href}
      style={[{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}]}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    />
  );*/
}
