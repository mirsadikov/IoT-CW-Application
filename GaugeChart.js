import React from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { View, StyleSheet, Text } from 'react-native';

export default function GaugeChart({ meter, max = 100, min = 0, unit = '%', title }) {
  let percent;

  if (isFinite(meter)) {
    if (meter <= min) {
      percent = 1;
    } else if (meter >= max) {
      percent = 100;
    } else {
      percent = (meter / max) * 100;
    }
  } else {
    percent = 1;
  }

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        style={styles.chart}
        size={120}
        width={12}
        fill={percent}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        // tintColor="#00ff00"
        // tintColorSecondary="#ff0000"
        // backgroundColor="#dddddd"
        arcSweepAngle={240}
        rotation={240}
        lineCap="round"
        backgroundWidth={15}
      >
        {() => (
          <Text>
            {Math.round(meter)} {unit}
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    height: 110,
  },
});
