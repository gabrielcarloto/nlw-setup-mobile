import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import colors from 'tailwindcss/colors';

import Feather from '@expo/vector-icons/Feather';

interface CheckboxProps extends TouchableOpacityProps {
  checked?: boolean;
  title: string;
}

export default function Checkbox({
  title,
  checked = false,
  ...props
}: CheckboxProps) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      className="flex-row mb-2 items-center"
    >
      {checked ? (
        <Animated.View
          entering={ZoomIn}
          exiting={ZoomOut}
          className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center"
        >
          <Feather name="check" size={20} color={colors.white} />
        </Animated.View>
      ) : (
        <View className="h-8 w-8 bg-zinc-900 rounded-lg" />
      )}

      <Text className="text-white text-base font-semibold ml-3">{title}</Text>
    </TouchableOpacity>
  );
}
