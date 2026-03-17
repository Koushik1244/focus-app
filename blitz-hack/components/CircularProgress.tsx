import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../lib/theme';

type Props = {
  size: number;
  strokeWidth: number;
  progress: number;
  color: string;
  backgroundColor?: string;
  children?: ReactNode;
};

export default function CircularProgress({
  size,
  strokeWidth,
  progress,
  color,
  backgroundColor = colors.borderSoft,
  children,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressAnim = useRef(new Animated.Value(progress)).current;
  const [animatedProgress, setAnimatedProgress] = useState(progress);

  useEffect(() => {
    const listenerId = progressAnim.addListener(({ value }) => {
      setAnimatedProgress(value);
    });

    const animation = Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      progressAnim.removeListener(listenerId);
      progressAnim.stopAnimation();
    };
  }, [progress, progressAnim]);

  const clampedProgress = Math.max(0, Math.min(animatedProgress, 100));
  const strokeDashoffset = circumference - (circumference * clampedProgress) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
