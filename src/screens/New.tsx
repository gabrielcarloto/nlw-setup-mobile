import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';

import Feather from '@expo/vector-icons/Feather';

import BackButton from '../components/BackButton';
import Checkbox from '../components/Checkbox';
import { api } from '../lib/axios';

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export default function New() {
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState<string>('');

  function handleToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      setWeekDays((prev) => prev.filter((wday) => wday !== weekDay));
    } else {
      setWeekDays((prev) => [...prev, weekDay]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (title.trim() === '' || !weekDays.length)
        return Alert.alert(
          'Novo Hábito',
          'Informe o nome do hábito e escolha a periodicidade.',
        );

      await api.post('/habits', { title, weekDays });

      setTitle('');
      setWeekDays([]);

      Alert.alert('Novo Hábito', 'Hábito criado com sucesso.');
    } catch (err) {
      console.log(err);
      Alert.alert('Ops', 'Não possível criar o novo hábito.');
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento
        </Text>

        <TextInput
          placeholder="Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          className="h-12 pl-4 text-white rounded-lg mt-3 bg-zinc-900 border-2 border-zinc-800 focus:border-green-600"
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência
        </Text>

        {availableWeekDays.map((day, i) => (
          <Checkbox
            checked={weekDays.includes(i)}
            onPress={() => handleToggleWeekDay(i)}
            key={day}
            title={day}
          />
        ))}

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
