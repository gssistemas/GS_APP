import React from "react";
import ParallaxScrollView from "../../../Components/ParallaxScrollView";
import {MaterialCommunityIcons,Ionicons} from '@expo/vector-icons';
import { Styles } from "../../../../assets/Styles/Styles";
import { ThemedView } from "../../../Components/ThemedView";
import { ThemedText } from "../../../Components/ThemedText";
import { TextInput, TouchableOpacity } from "react-native";

export default function DevolverOs({route,navigation}:any){
    try {
        return(
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<MaterialCommunityIcons size={310} name="undo-variant" style={[Styles.headerImage]} />
            }
            >
                <ThemedView>
                    <ThemedText type="title">Devolução de ordem de serviço</ThemedText>
                    <TextInput placeholder="Digite o motivo da devolução..." style={[Styles.input]} multiline/>
                </ThemedView>
            </ParallaxScrollView>
        )
    } catch (error:any) {
        
    }
}