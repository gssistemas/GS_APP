import { StyleSheet, Dimensions} from "react-native";
import Config from '../Config/Config.json';
//import Config from '../src/config/Config.json';
const { width,height} = Dimensions.get('window');

export const Styles = StyleSheet.create({
    title:{
      fontSize:36,
      textAlign:'center',
      fontFamily:'Montserrat_800ExtraBold_Italic',
    },
    subtitle:{
      fontSize:18,
      textAlign:'center',
    },
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      width:width,
      height:height,
    },
    input:{
      backgroundColor:'#FFFFFF',
      height:50,
      paddingHorizontal:8,
      borderRadius:8,
      fontSize:18,
      borderBottomWidth:1,
      borderBottomColor:'blue',
    },
    //tamanhos buttons
    w10:{
      width:'10%',
      marginHorizontal:'45%',
    },
    w15:{
      width:'15%',
      marginHorizontal:'42.5%',
    },
    w20:{
      width:'20%',
      marginHorizontal:'40%',
    },
    w25:{
      width:'25%',
      marginHorizontal:'37.5%',
    },
    w30:{
      width:'30%',
      marginHorizontal:'35%',
    },
    w33:{
      width:'33%',
      marginHorizontal:'0%',
    },
    w35:{
      width:'35%',
      marginHorizontal:'32.5%',
    },
    w40:{
      width:'40%',
      marginHorizontal:'30%',
    },
    w45:{
      width:'45%',
      marginHorizontal:'27.5%',
    },
    w50:{
      width:'50%',
      marginHorizontal:'25%',
    },
    w55:{
      width:'55%',
      marginHorizontal:'22.5%',
    },
    w60:{
      width:'60%',
      marginHorizontal:'20%',
    },
    w65:{
      width:'65%',
      marginHorizontal:'17.5%',
    },
    w70:{
      width:'70%',
      marginHorizontal:'15%',
    },
    w75:{
      width:'75%',
      marginHorizontal:'12.5%',
    },
    w80:{
      width:'80%',
      marginHorizontal:'10%',
    },
    w85:{
      width:'85%',
      marginHorizontal:'7.5%',
    },
    w90:{
      width:'90%',
      marginHorizontal:'5%',
    },
    w95:{
      width:'95%',
      marginHorizontal:'2.5%',
    },
    w100:{
      width:'100%',
      marginHorizontal:'0%',
    },
  separator:{
      height:1,
      backgroundColor:'#999',
      marginVertical:5,
  },
  em_linhaVertical:{
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column'
  },
  em_linhaHorizontal:{
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row'
  },
  ft_regular:{
    fontFamily:'Montserrat_400Regular',
  },
  ft_medium:{
      fontFamily:'Montserrat_500Medium',
  },
  ft_bold:{
      fontFamily:'Montserrat_700Bold',
  },
  ft_thin:{
      fontFamily:'Montserrat_100Thin',
  },
  ft_light:{
      fontFamily:'Montserrat_300Light',
  },
  ft_extraBold:{
      fontFamily:'Montserrat_800ExtraBold',
  },
  ft_black:{
      fontFamily:'Montserrat_900Black',
  },
  btn:{
    paddingHorizontal:10,
    paddingVertical:10,
    marginVertical:10,
    borderWidth:1,
    borderColor:'#fff',
    elevation:5,
    backgroundColor:'#fff',
    borderRadius:4,
  },
  btnDialog:{
    marginHorizontal:0,
    marginVertical:0,
    borderWidth:0,
    borderRadius:0
  },
  btnDialogLeft:{
    borderRadius:0,
    marginHorizontal:0,
    borderBottomLeftRadius:5,
  },
  btnDialogRight:{
    borderRadius:0,
    marginHorizontal:0,
    borderBottomRightRadius:5,
  },
  btnDialogcentered:{
    borderRadius:0,
    marginHorizontal:0,
  },
  ml_5:{
    marginRight:5,
  },
  mr_5:{
    marginRight:5,
  },
  button:{
      marginHorizontal:'5%',elevation:5,backgroundColor:'#FFF',borderRadius:20,paddingVertical:3,marginVertical:5
  },
  primary:{
      backgroundColor:'#0d6efd',
  },
  secondary:{
      backgroundColor:'#6c757d',
  },
  success:{
      backgroundColor:'#198754',
  },
  info:{
      backgroundColor:'#0dcaf0',
  },
  warning:{
      backgroundColor:'#ffc107',
  },
  danger:{
      backgroundColor:'#dc3545',
  },
  light:{
      backgroundColor:'#f8f9fa',
  },
  btn_primary:{
      color:'#0d6efd',
  },
  btn_secondary:{
      color:'#6c757d',
  },
  btn_success:{
      color:'#198754',
  },
  btn_info:{
      color:'#0dcaf0',
  },
  btn_warning:{
      color:'#ffc107',
  },
  btn_danger:{
      color:'#dc3545',
  },

  lblprimary:{
      color:'#FFFFFF',
  },
  lblsecondary:{
      color:'#FFFFFF',
  },
  lblsuccess:{
      color:'#FFFFFF',
  },
  lblinfo:{
      color:'#000000',
  },
  lblwarning:{
      color:'#000000',
  },
  lbldanger:{
      color:'#FFFFFF',
  },
  lbllight:{
      color:'#000000',
  },
  containerHome:{
      width:'100%',height:'100%',
  },
  alertprimary:{
      color:'#0d6efd',
  },
  alertsecondary:{
      color:'#6c757d',
  },
  alertsuccess:{
      color:'#198754',
  },
  alertinfo:{
      color:'#0dcaf0',
  },
  alertwarning:{
      color:'#ffc107',
  },
  alertdanger:{
      color:'#dc3545',
  },
  alertlight:{
    color:'#000000',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 5,
    top:-10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  cardPromoEmpresa:{
      width:250,backgroundColor:Config.configuracoes.cor_fonte_base,elevation:8,marginVertical:10,marginHorizontal:5,borderRadius:10,
      paddingHorizontal:5,paddingVertical:10,
  },
  borderedBottomLeft:{
    borderBottomWidth:1,
    borderLeftWidth:2,
    borderBottomColor:Config.configuracoes.cor_fonte_base,
    borderLeftColor:Config.configuracoes.cor_fonte_base,paddingHorizontal:10,paddingVertical:10,marginVertical:5,borderBottomLeftRadius:5,
  },
  borderedTopLeft:{
      borderTopWidth:1,
      borderLeftWidth:2,
      borderTopColor:Config.configuracoes.cor_base,
      borderLeftColor:Config.configuracoes.cor_base,paddingHorizontal:10,paddingVertical:10,marginVertical:5,borderTopLeftRadius:5,
  },
  cardProduto:{
      width:'95%',height:'auto',elevation:5,backgroundColor:Config.configuracoes.cor_fonte_base,borderRadius:8,marginVertical:10,marginHorizontal:'2.5%',
  },
  headerContentContainer: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 20,
  },
  syncContentContainer: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title1: {
    fontWeight: '700',
    fontSize: 32,
  },
  title3: {
    fontWeight: '700',
    fontSize: 18,
  },
  body2: {
    fontSize: 14,
  },
  syncProgressBarContainer: {
    flexDirection: 'row',
  },
  syncProgressBar: {
    height: 4,
    marginHorizontal: 10,
    width: '50%',
    backgroundColor: '#0000ff',
  },
  centeredView: {
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width:width - 20,
    height:'auto',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 0,
    paddingHorizontal:0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -90,
    position: 'absolute',
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  offlineIndicator: {
    backgroundColor: '#f44336',
    padding: 10,
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 5,
  },
});