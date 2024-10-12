import { useContext } from 'react';
import { View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { AuthLogin } from '../../assets/Contexts/AuthLogin';
import { Styles } from '../../assets/Styles/Styles';

export default function SnackBar() {
    const {visibleSnackBar, setVisibleSnackBar,msgModal} = useContext<any>(AuthLogin);
    return (
        <View style={Styles.container}>
            <Snackbar
                visible={visibleSnackBar}
                onDismiss={()=>{setVisibleSnackBar(false)}}
                action={{
                label: 'Undo',
                onPress: () => {
                    setVisibleSnackBar(false);
                },
                }}
            >
                {msgModal}
            </Snackbar>
        </View>
    );
}