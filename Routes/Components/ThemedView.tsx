import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '../../assets/Temas/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  paddingHori?:number;
  paddingVert?:number;
};

export function ThemedView({ style, lightColor,paddingHori,paddingVert, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor,paddingVertical:paddingVert,paddingHorizontal:paddingHori}, style]} {...otherProps} />;
}
