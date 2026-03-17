import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import SessionScreen from './screens/SessionScreen';
import ResultsScreen from './screens/ResultsScreen';
import ProfileScreen from './screens/ProfileScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import StatsScreen from './screens/StatsScreen';
import { colors } from './lib/theme';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Session: {
    duration: number;
    stake: number;
    sessionId: string;
    reward: number;
    multiplierLabel: string;
    streakBonusLabel: string | null;
  };
  Results: {
    focusScore: number;
    stake: number;
    success: boolean;
    sessionId: string;
    duration: number;
    reward: number;
    multiplierLabel: string;
  };
  Profile: undefined;
  Leaderboard: undefined;
  Stats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accent,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    BitcountPropDoubleInk: require('./assets/fonts/BitcountPropDoubleInk.ttf'),
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const existing = document.getElementById('bitcount-font-link');
    if (existing) {
      return;
    }

    const link = document.createElement('link');
    link.id = 'bitcount-font-link';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Bitcount+Prop+Double+Ink:wght@100..900&display=swap';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar style="light" />
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Session" component={SessionScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
