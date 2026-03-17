import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { colors, headingFontFamily, radii } from '../lib/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

type WalletOption = {
  key: 'ready' | 'braavos' | 'demo';
  title: string;
  subtitle: string;
  accent: string;
};

const features = [
  { icon: 'S', title: 'Stake to focus', description: 'Lock USDC before each session begins.' },
  { icon: 'A', title: 'AI monitors you', description: 'Camera and screen signals verify attention.' },
  { icon: 'R', title: 'Earn rewards', description: 'Finish above threshold and collect upside.' },
];

const walletOptions: WalletOption[] = [
  { key: 'ready', title: 'Ready Wallet', subtitle: 'Secure Starknet signing', accent: '#f97316' },
  { key: 'braavos', title: 'Braavos', subtitle: 'Smart wallet with strong UX', accent: '#facc15' },
  { key: 'demo', title: 'Demo Mode', subtitle: 'Connect fake address 0x0222...1C3a', accent: colors.accent },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [pendingWallet, setPendingWallet] = useState<WalletOption['key'] | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.84)).current;
  const featureOffset = useRef(new Animated.Value(16)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(360)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(featureOffset, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
      featureOffset.stopAnimation();
      logoScale.stopAnimation();
      overlayOpacity.stopAnimation();
      sheetTranslateY.stopAnimation();
    };
  }, [fadeAnim, featureOffset, logoScale, overlayOpacity, sheetTranslateY, slideAnim]);

  const showSheet = () => {
    setSheetVisible(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideSheet = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 360,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSheetVisible(false);
      setPendingWallet(null);
    });
  };

  const connectWallet = async (wallet: WalletOption) => {
    setPendingWallet(wallet.key);

    if (wallet.key === 'demo') {
      await new Promise((resolve) => setTimeout(resolve, 400));
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    hideSheet();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.topBlock}>
          <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>F</Text>
            </View>
            <Text style={styles.wordmark}>focusss</Text>
            <Text style={styles.tagline}>Stake to focus. Earn if you finish.</Text>
          </Animated.View>

          <Animated.View style={{ transform: [{ translateY: featureOffset }] }}>
            {features.map((feature) => (
              <View key={feature.title} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>{feature.icon}</Text>
                </View>
                <View style={styles.featureCopy}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        </View>

        <View style={styles.bottomBlock}>
          <Pressable
            style={({ pressed }) => [styles.connectButton, pressed ? styles.connectButtonPressed : null]}
            onPress={showSheet}
          >
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </Pressable>

          <Text style={styles.walletSupport}>Supports Ready Wallet / Argent / Braavos</Text>
        </View>
      </Animated.View>

      {sheetVisible ? (
        <Animated.View pointerEvents="box-none" style={[styles.sheetOverlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={hideSheet} />
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Choose Wallet</Text>

            {walletOptions.map((wallet) => {
              const loading = pendingWallet === wallet.key;
              return (
                <Pressable
                  key={wallet.key}
                  style={({ pressed }) => [styles.walletRow, pressed ? styles.walletRowPressed : null]}
                  onPress={() => connectWallet(wallet)}
                  disabled={pendingWallet !== null}
                >
                  <View style={[styles.walletBadge, { backgroundColor: wallet.accent }]} />
                  <View style={styles.walletCopy}>
                    <Text style={styles.walletTitle}>{wallet.title}</Text>
                    <Text style={styles.walletSubtitle}>{wallet.subtitle}</Text>
                  </View>
                  {loading ? (
                    <View style={styles.walletStatus}>
                      <ActivityIndicator color={colors.accent} size="small" />
                      <Text style={styles.walletStatusText}>
                        {wallet.key === 'demo' ? 'Connecting...' : 'Opening...'}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </Animated.View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 40 : 16,
    paddingBottom: 22,
    justifyContent: 'space-between',
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -80,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: 'rgba(34,197,94,0.16)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    right: -60,
    bottom: 80,
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: 'rgba(34,197,94,0.10)',
  },
  topBlock: {
    paddingTop: 22,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 54,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#010101',
    fontSize: 42,
    fontWeight: '900',
  },
  wordmark: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureIconText: {
    color: colors.accent,
    fontSize: 18,
    fontFamily: headingFontFamily,
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: headingFontFamily,
    marginBottom: 4,
  },
  featureDescription: {
    color: '#5a5a5a',
    fontSize: 13,
    lineHeight: 18,
  },
  bottomBlock: {
    paddingBottom: 12,
  },
  connectButton: {
    minHeight: 60,
    borderRadius: radii.card,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonPressed: {
    transform: [{ scale: 0.985 }],
  },
  connectButtonText: {
    color: '#041109',
    fontSize: 18,
    fontFamily: headingFontFamily,
  },
  walletSupport: {
    color: '#595959',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 14,
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#d4d4d4',
    alignSelf: 'center',
    marginBottom: 18,
  },
  sheetTitle: {
    color: '#111111',
    fontSize: 24,
    fontFamily: headingFontFamily,
    marginBottom: 18,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  walletRowPressed: {
    opacity: 0.84,
  },
  walletBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 14,
  },
  walletCopy: {
    flex: 1,
  },
  walletTitle: {
    color: '#111111',
    fontSize: 16,
    fontFamily: headingFontFamily,
    marginBottom: 4,
  },
  walletSubtitle: {
    color: '#666666',
    fontSize: 13,
  },
  walletStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletStatusText: {
    color: colors.accent,
    marginLeft: 8,
    fontSize: 12,
    fontFamily: headingFontFamily,
  },
});
