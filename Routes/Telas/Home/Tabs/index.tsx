import React,{useEffect, useRef} from 'react';
import { Image, StyleSheet, Platform,View,Text,Animated, Alert} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HelloWave } from '../../../Components/HelloWave';
import ParallaxScrollView from '../../../Components/ParallaxScrollView';
import { ThemedText } from '../../../Components/ThemedText';
import { ThemedView } from '../../../Components/ThemedView';

export default function HomeScreen() {
  const animations = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  useEffect(()=>{
    setTimeout(()=>{
const createAnimation = (index:number) => {
      //Animated.loop(
        return Animated.sequence([
              Animated.timing(animations[index], {
                  toValue: 150,
                  duration: 1000,
                  useNativeDriver: true,
              }),
              Animated.timing(animations[index], {
                  toValue: 0,
                  duration: 1000,
                  useNativeDriver: true,
              }),
        ]);
      //)
    };
    const startAnimation = () => {
        createAnimation(0).start();
        setTimeout(() => createAnimation(1).start(), 250); // Start next animation when the first one is halfway
        setTimeout(() => createAnimation(2).start(), 500); // Start third animation when the second one is halfway
    };
      startAnimation();
    },10000)
    
  },[])

  try {
    return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <View style={[styles.reactLogo,{flexDirection:'column'}]}>
          <View style={[{flexDirection:'row'}]}>
            <MaterialCommunityIcons size={310} name="alpha-g" style={[{color:'#FFFFFF'}]}/>
            <MaterialCommunityIcons size={310} name="alpha-s" style={[{marginLeft:-180,color:'#FFFFFF'}]}/>
            <Animated.View style={{ transform: [{ translateY: animations[0] }], marginTop: 151, marginLeft: -130 }}>
                <MaterialCommunityIcons size={100} name="alpha-a" style={{color:'#FFFFFF'}} />
            </Animated.View>
            <Animated.View style={{ transform: [{ translateY: animations[1] }], marginTop: 151, marginLeft: -70 }}>
                <MaterialCommunityIcons size={100} name="alpha-p" style={{color:'#FFFFFF'}} />
            </Animated.View>
            <Animated.View style={{ transform: [{ translateY: animations[2] }], marginTop: 151, marginLeft: -70 }}>
                <MaterialCommunityIcons size={100} name="alpha-p" style={{color:'#FFFFFF'}} />
            </Animated.View>
          </View>
          <Text style={[{marginLeft:-50,marginTop:-50,zIndex:1,color:'#FFF'}]} >APP</Text>
        </View>}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bem vindo à GS SERVIÇOS!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle"><ThemedText type="defaultSemiBold">{Platform.select({ ios: ' 1-', android: ' 1-' })}</ThemedText> Demanda de serviços</ThemedText>
        <ThemedText>
          É com a <ThemedText type="defaultSemiBold">GS SERVIÇOS</ThemedText>, Nós temos tudo oque você precisa para iniciar 
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: ' seus serviços', android: ' seus serviços' })}
          </ThemedText>{' '}
          Gerencie a demanda de serviços facilmente em tempo real.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle"><ThemedText type="defaultSemiBold">{Platform.select({ ios: ' 2-', android: ' 2-' })}</ThemedText> Dados de seus colaboradores</ThemedText>
        <ThemedText>
          Gerencie de forma <ThemedText type="defaultSemiBold">{Platform.select({ ios: ' fácil e rápida', android: ' fácil e rápida' })}</ThemedText> em tempo real todos  seus colaboradores.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle"><ThemedText type="defaultSemiBold">{Platform.select({ ios: ' 3-', android: ' 3-' })}</ThemedText> Finalizar O.S.</ThemedText>
        <ThemedText>
          Obtenha todos os dados das O.S. finalizadas pelos parceiros{'\n\n'}
          <ThemedText type="defaultSemiBold">a) - Fotos</ThemedText> Todas as fotos tiradas no momento da finalização da O.S.{'\n'}
          <ThemedText type="defaultSemiBold">b) - Localização</ThemedText> Localização exata do parceiro em tempo real, Tirada no momento da execução de cada etapa do serviço.{'\n'}
          <ThemedText type="defaultSemiBold">c) - Assinatura</ThemedText> No momento em que o parceiro finalizar a O.S., Deve-se pegar a assunatura do cliente, como comprovação de que a O.S. foi  finalizada com êxito.{'\n\n'}
          <ThemedText type="defaultSemiBold">Tudo isso em um só app. Facilidade, Organização, Qualidade no atendimento e tudo isso Gerenciado por você.</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
  } catch (error:any) {
    Alert.alert('Erro','Corrija o erro na linha 100 que está impedindo o app de iniciar corretamente.\n'+error.message)
  }
  
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 290,
    width: 290,
    bottom: -50,
    left: -80,
    position: 'absolute',
    resizeMode:'stretch',
    elevation:10,
  },
});
