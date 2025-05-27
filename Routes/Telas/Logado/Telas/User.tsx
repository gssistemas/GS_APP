import { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthLogin } from '../../../../assets/Contexts/AuthLogin';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Styles } from '../../../../assets/Styles/Styles';

export default function User() {
    const { usuario } = useContext<any>(AuthLogin);
    console.log('Usuário Logado=>', usuario)
    try {
        return (
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<MaterialCommunityIcons size={310} name="account-details" style={Styles.headerImage} />
                }
            >
                <View>
                    <Text style={[Styles.ft_bold,{}]}>{usuario.nome}</Text>
                </View>
            </ParallaxScrollView>
        );
    } catch (error: any) {

    }
}