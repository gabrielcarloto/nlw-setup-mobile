import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { useRoute } from '@react-navigation/native';

import BackButton from '../components/BackButton';
import Checkbox from '../components/Checkbox';
import HabitsEmpty from '../components/HabitsEmpty';
import Loading from '../components/Loading';
import ProgressBar from '../components/ProgressBar';
import { api } from '../lib/axios';
import generateProgressPercentage from '../utils/generate-progress-percentage';

interface DayInfo {
  completedHabits?: string[];
  possibleHabits: Array<{
    id: string;
    title: string;
  }>;
}

interface HabitParams {
  date: string;
}

export default function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfo>();
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length,
      )
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get<DayInfo>('/day', { params: { date } });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits ?? []);
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível carregar os hábitos');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);

      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevHabits) =>
          prevHabits.filter((h) => h !== habitId),
        );
      } else {
        setCompletedHabits((prevHabits) => [...prevHabits, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito');
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="mt-6 text-zinc-400 font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx('mt-6', {
            'opacity-50': isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits?.map((habit) => (
            <Checkbox
              key={habit.id}
              title={habit.title}
              checked={completedHabits.includes(habit.id)}
              onPress={() => handleToggleHabit(habit.id)}
              disabled={isDateInPast}
            />
          )) ?? <HabitsEmpty />}
        </View>

        {isDateInPast && (
          <Text className="text-gray-300 mt-10 text-center">
            Você não pode atualizar hábitos antigos
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
