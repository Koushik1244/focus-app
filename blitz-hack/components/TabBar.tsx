import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, headingFontFamily, radii } from '../lib/theme';
import { AppTab } from '../lib/types';

type Props = {
  activeTab: AppTab;
  onNavigate: (tab: AppTab) => void;
};

const tabs: AppTab[] = ['HOME', 'STATS', 'SOCIAL', 'PROFILE'];

export default function TabBar({ activeTab, onNavigate }: Props) {
  const tabAnim = useRef(new Animated.Value(0)).current;
  const scales = useRef<Record<AppTab, Animated.Value>>({
    HOME: new Animated.Value(activeTab === 'HOME' ? 1 : 0),
    STATS: new Animated.Value(activeTab === 'STATS' ? 1 : 0),
    SOCIAL: new Animated.Value(activeTab === 'SOCIAL' ? 1 : 0),
    PROFILE: new Animated.Value(activeTab === 'PROFILE' ? 1 : 0),
  }).current;

  useEffect(() => {
    const animations = tabs.map((tab) =>
      Animated.spring(scales[tab], {
        toValue: activeTab === tab ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 70,
      })
    );

    Animated.parallel(animations).start();

    return () => {
      tabAnim.stopAnimation();
      tabs.forEach((tab) => {
        scales[tab].stopAnimation();
      });
    };
  }, [activeTab, scales, tabAnim]);

  const navigateTab = (tab: AppTab) => {
    if (tab === activeTab) {
      return;
    }

    tabAnim.setValue(0);
    Animated.spring(tabAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start(() => {
      tabAnim.setValue(0);
      onNavigate(tab);
    });
  };

  return (
    <View style={styles.shell}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const scale = scales[tab].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.04],
          });

          const translateY = tabAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -2],
          });

          return (
            <Pressable key={tab} onPress={() => navigateTab(tab)} style={styles.tabPressable}>
              {({ pressed }) => (
                <Animated.View
                  style={[
                    styles.tab,
                    activeTab === tab ? styles.activeTab : null,
                    {
                      transform: [{ scale: pressed ? 0.97 : scale }, { translateY }],
                    },
                  ]}
                >
                  <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
                    {tab}
                  </Text>
                </Animated.View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
  },
  bar: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabPressable: {
    flex: 1,
  },
  tab: {
    minHeight: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  activeTab: {
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  tabText: {
    color: '#555555',
    fontSize: 11,
    fontFamily: headingFontFamily,
    letterSpacing: 0.8,
  },
  activeTabText: {
    color: colors.accent,
  },
});
