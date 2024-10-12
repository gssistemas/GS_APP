import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,Image, TouchableOpacity} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import googleJson from '../../google-services.json';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { AuthLogin } from '../../assets/Contexts/AuthLogin';
import { ThemedView } from '../Components/ThemedView';
import { Styles } from '../../assets/Styles/Styles';
import { ThemedText } from '../Components/ThemedText';
import configJson from '../../app.json';

export default function Mapa({route,navigation}:any) {
    const GOOGLE_MAPS_API_KEY = configJson.expo.android.config.googleMaps.apiKey;
    const [address, setAddress] = useState(route.params.endereco);
    const [region, setRegion] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [error, setError] = useState('');
    const [currentLocation, setCurrentLocation] = useState<null|never|any>(null);
    const parseEndereco = address.split(',');


    const mapRef = useRef(null);

    console.log('Endereco do cliente:',address);
    const {osInicada,usuario,fecharModal,apresentaModal,buscarCoordenadas,IniciarOs,salvarVariaveis,OsIniciada} = useContext<any>(AuthLogin);

    async function iniciar(){
        if(usuario !== null){
            //tela:string,DadosOs:any,codigoStatusOs:number,os:number|string,acao?:Function|ReactElement|ReactNode|undefined,comando:string
            const retorno = await buscarCoordenadas('os iniciada',osInicada.dadosOs,900,osInicada.dadosOs.os,'inicio trabalho','inicio trabalho','iniciarOs');
            if(retorno.code === 0){
                console.log('retorno iniciar Os=>',retorno);
                //comando:any,localizacao:any,profissional:any,dados:any,codigoStatus:any,os:any,tela:string,acao:Function|ReactElement|ReactNode|undefined|null
                const iniOs = await IniciarOs('iniciarOs',retorno.location.coords.latitude+','+retorno.location.coords.longitude,usuario.id_user,osInicada.dadosOs,900,osInicada.dadosOs.os,'os iniciada','');

                if(iniOs.code === 0){
                    const sv = await salvarVariaveis('OsIniciada','OsIniciada',JSON.stringify({status:true,dadosOs:osInicada.dadosOs,tela:'os iniciada'}));

                    if(sv.code === 0){
                        //dadosOs:any,param_1:any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                        const OsIni = await OsIniciada(JSON.stringify({status:true,dadosOs:osInicada.dadosOs,tela:'iniciar os'}),'','','os iniciada');

                        if(OsIni.code ===0){
                            console.log('os iniciada=>',OsIni);
                            //comando:string,param: any|Function|ReactElement|ReactNode|null,param_2:any|Function|ReactElement|ReactNode|null,tela:string
                            //setTimeout(() => {
                                navigation.reset({
                                    index:0,
                                    routes:[
                                        {
                                            name:'os iniciada'
                                        }
                                    ]
                                })
                            //}, 3000);
                            fecharModal('');
                        }
                    }
                }
            }
        }else{
            apresentaModal(
                'dialog',
                'help',
                'Iniciar trabalho',
                'Você deve fazer login para contuinuar a O.S.\n\nDeseja fazer isso agora?',
                'default',
                ()=>{
                    return(
                        <>
                            <TouchableOpacity style={[Styles.btn,Styles.warning,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                                onPress={()=>{
                                    fecharModal('');
                                }}
                            >
                                <Text style={[Styles.ft_regular,Styles.lblwarning]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogcentered,{}]}
                                onPress={()=>{
                                    fecharModal('');
                                }}
                            >
                                <Text style={[Styles.ft_regular,Styles.lbldanger]}>Não</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                onPress={()=>{
                                    fecharModal('');
                                    navigation.navigate('login');
                                }}
                            >
                                <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Sim</Text>
                            </TouchableOpacity>
                        </>
                    )
                }
            );
        }
    }

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Erro', 'Permissão para acessar a localização não concedida.');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
          const { latitude, longitude } = location.coords;
          setCurrentLocation({
            latitude,
            longitude,
          });
          updateRegion(latitude, longitude);
        })();
    }, []);
    
    useEffect(() => {
        if (currentLocation && address) {
          handleSearch(currentLocation.latitude, currentLocation.longitude);
        }
    }, [address, currentLocation]);
    
    const handleSearch = async (userLat:any, userLng:any) => {
        if (!userLat || !userLng) {
          Alert.alert('Erro', 'Localização atual não disponível.');
          return;
        }
    
        try {
          const geocodeResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
              params: {
                address: address,
                key: GOOGLE_MAPS_API_KEY,
              },
            }
          );
    
          if (geocodeResponse.data.status === 'OK') {
            const destination = geocodeResponse.data.results[0].geometry.location;
            console.log('Destino=>',destination);
            updateRegion(userLat, userLng);
            setError('');
    
            const directionsResponse = await axios.get(
              `https://maps.googleapis.com/maps/api/directions/json`,
              {
                params: {
                  origin: `${userLat},${userLng}`,
                  destination: `${destination.lat},${destination.lng}`,
                  key: GOOGLE_MAPS_API_KEY,
                },
              }
            );
    
            if (directionsResponse.data.status === 'OK') {
              const route = directionsResponse.data.routes[0].overview_polyline.points;
              const decodedRoute:any|null|never = decodePolyline(route);
              setRouteCoords(decodedRoute);
            } else {
              setError('Erro ao calcular a rota.');
            }
          } else {
            setError('Endereço não encontrado.');
          }
        } catch (err) {
          console.error(err);
          setError('Erro ao buscar endereço.');
        }
    };
    
    const updateRegion = (latitude:any, longitude:any) => {
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
    
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }, 1000);
        }
    };
    
    const decodePolyline = (encoded:any) => {
        let points = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;
    
        while (index < len) {
          let b, shift = 0, result = 0;
          do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
          let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
          lat += dlat;
    
          shift = 0;
          result = 0;
          do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
          let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
          lng += dlng;
    
          points.push({
            latitude: (lat / 1E5),
            longitude: (lng / 1E5),
          });
        }
    
        return points;
    };

    return (
        <View style={styles.container}>   
            {error ? <Text>[error]</Text> : null}
    
            {region && (
                <MapView
                    style={styles.map}
                    ref={mapRef}
                    region={region}
                    showsUserLocation={false}
                    zoomEnabled={true}
                    zoomControlEnabled={true}
                    followsUserLocation={true}
                    userLocationUpdateInterval={1000}
                    loadingEnabled={true}
                >
                {routeCoords.length > 0 && (
                  <>
                    <Marker
                      coordinate={region} // Última coordenada da rota
                      title={"Voçê"}
                      description="voçê"

                    />
                    <Polyline
                        coordinates={routeCoords}
                        strokeColor="blue"
                        strokeWidth={5}
                    />
                    <Marker
                      coordinate={routeCoords[routeCoords.length - 1]} // Última coordenada da rota
                      title={"Cliente"}
                      description={parseEndereco[0]+'-'+parseEndereco[1]+'\n'+'-'+parseEndereco[2]+'-'+parseEndereco[3]+'\n'+parseEndereco[4]+','+parseEndereco[5]+'\n'+parseEndereco[6]+','+parseEndereco[7]}

                    />
                  </>
                )}
            </MapView>
            )}
            <TouchableOpacity style={[Styles.btn,Styles.primary,Styles.em_linhaHorizontal,Styles.w100,{borderBottomLeftRadius:27,borderBottomRightRadius:27}]}
                onPress={()=>{
                    apresentaModal(
                        'dialog',
                        'help',
                        'Iniciar trabalho',
                        'Ao iniciar o trabalho você não poderá voltar até que finalize a mesma.\n\nDeseja iniciar a O.S.:'+osInicada.dadosOs.os+'?',
                        'default',
                        ()=>{
                            return(
                                <>
                                    <TouchableOpacity style={[Styles.btn,Styles.warning,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogLeft,{}]}
                                        onPress={()=>{
                                            fecharModal('');
                                        }}
                                    >
                                        <Text style={[Styles.ft_regular,Styles.lblwarning]}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[Styles.btn,Styles.danger,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogcentered,{}]}
                                        onPress={()=>{
                                            fecharModal('');
                                        }}
                                    >
                                        <Text style={[Styles.ft_regular,Styles.lbldanger]}>Não</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[Styles.btn,Styles.success,Styles.em_linhaHorizontal,Styles.w33,Styles.btnDialog,Styles.btnDialogRight,{}]}
                                        onPress={()=>{
                                            iniciar()
                                        }}
                                    >
                                        <Text style={[Styles.ft_regular,Styles.lblsuccess]}>Sim</Text>
                                    </TouchableOpacity>
                                </>
                            )
                        }
                    );
                }}
            >
                <ThemedText type='default' style={[Styles.lblprimary,Styles.ft_regular]}>Cheguei</ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      width: '80%',
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    map: {
      width: '100%',
      height: '94.5%',
      minHeight:'94.5%',
    },
});
/*
    <TextInput
            style={styles.input}
            placeholder="Digite o endereço"
            value={address}
            onChangeText={setAddress}
          />
          <Button title="Buscar no Mapa" onPress={() => currentLocation && handleSearch(currentLocation.latitude, currentLocation.longitude)} />
    {currentLocation && (
                <Marker coordinate={currentLocation} title="Sua localização"/>
              )}
          {region && (
                <Marker coordinate={region} title="Cliente"/>
              )}
*/