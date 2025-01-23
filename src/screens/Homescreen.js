import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import colors from './theme/colours'
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function HomeScreen() {
  const translateY = useSharedValue(0);
  const navigation = useNavigation();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationY < -50) {
      navigation.replace('Login');
    }
  };
  useEffect(() => {
    const fetchTokenFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        
        if (!token) {
          navigation.navigate("Home");
        } else {
          navigation.navigate("Main", { screen: "MovieSearch"});
        }
      } catch (error) {
        console.error("Failed to fetch token from storage", error);
      }
    };

    fetchTokenFromStorage();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Text style={styles.text}>Welcome to OurFlicks!</Text>
          <Text style={styles.swipeText}>Swipe up to get started</Text>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background, // Use theme color
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.text, // Use theme color
  },
  swipeText: {
    fontSize: 16,
    color: colors.mutedText, // Use theme color
  },
});