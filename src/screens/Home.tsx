import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import HabitDay, { DAY_SIZE } from '../components/HabitDay';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { api } from '../lib/axios';
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

interface Summary {
  id: string;
  date: string;
  amount: number;
  completed: number;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<Summary[]>();
  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get('/summary');
      setSummary(response.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Ops', 'Não foi possível carregar os hábitos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((day, i) => (
          <Text
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
            key={day + '-' + i}
          >
            {day}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayWithHabits = summary.find((day) =>
                dayjs(date).isSame(day.date, 'day'),
              );

              return (
                <HabitDay
                  onPress={() =>
                    navigate('habit', { date: date.toISOString() })
                  }
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  key={date.toString()}
                />
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                <View
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  key={i}
                ></View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
