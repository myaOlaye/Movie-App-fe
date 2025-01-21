import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import colors from './theme/colours'

export default function HomeScreen({ navigation }) {
  const translateY = useSharedValue(0);

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