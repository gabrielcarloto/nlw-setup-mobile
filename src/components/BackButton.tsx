import { TouchableOpacity } from 'react-native';
import colors from 'tailwindcss/colors';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const { goBack } = useNavigation();

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={goBack}>
      <Feather name="arrow-left" size={32} color={colors.zinc[400]}></Feather>
    </TouchableOpacity>
  );
}
