import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Banner from '../components/Banner';
import Button from '../components/Button';
import Header from '../components/Header';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function WelcomeScreen() {
  const [demoState, setDemoState] = useState('normal'); // 'normal' | 'loading' | 'error'

  const handleCreateAccount = () => {
    if (demoState === 'loading') return;
    router.push('/signup');
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Welcome" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Companion State Switcher (for QA & demoing Figma companion states) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <TouchableOpacity
            onPress={() => setDemoState('normal')}
            style={[styles.demoTab, demoState === 'normal' && styles.demoTabActive]}
          >
            <Text style={[styles.demoTabText, demoState === 'normal' && styles.demoTabTextActive]}>Default</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDemoState('loading')}
            style={[styles.demoTab, demoState === 'loading' && styles.demoTabActive]}
          >
            <Text style={[styles.demoTabText, demoState === 'loading' && styles.demoTabTextActive]}>S01.L</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDemoState('error')}
            style={[styles.demoTab, demoState === 'error' && styles.demoTabActive]}
          >
            <Text style={[styles.demoTabText, demoState === 'error' && styles.demoTabTextActive]}>S01.X</Text>
          </TouchableOpacity>
        </View>

        {demoState === 'loading' ? (
          // S01.L / Loading account access state
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Opening account access...</Text>
            <View style={styles.skeletonBlockLarge} />
            <View style={styles.skeletonBlockSmall} />
            <View style={styles.loadingRow}>
              <Text style={styles.loadingText}>⏳ Please wait...</Text>
            </View>
          </View>
        ) : demoState === 'error' ? (
          // S01.X / Account access error state
          <View style={styles.stateCard}>
            <Text style={styles.stateHeroTitle}>Get started with TeamUp</Text>
            <Banner
              type="error"
              title="Could not open account access"
              message="Account not created. Try opening the form again."
            />
            <Button
              title="Retry opening sign-up"
              onPress={() => {
                setDemoState('normal');
                router.push('/signup');
              }}
            />
            <Button
              title="Sign in"
              variant="outline"
              onPress={handleSignIn}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        ) : (
          // S01.D / Default Screen
          <>
            {/* Visual Graphic Card */}
            <View style={styles.imageCard}>
              <Image
                source={require('../../assets/images/welcome-illustration.png')}
                style={styles.illustration}
                resizeMode="cover"
              />
            </View>

            {/* Hero Card */}
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Learn a skill. Build with a team.</Text>
              <Text style={styles.heroSubtext}>Build a real project with a team.</Text>
            </View>

            {/* Action Buttons */}
            <Button
              title="Create account"
              onPress={handleCreateAccount}
              style={styles.primaryButton}
            />

            <Button
              title="Sign in"
              variant="outline"
              onPress={handleSignIn}
              style={styles.outlineButton}
            />

            {/* Feature Steps */}
            <View style={styles.stepsContainer}>
              <View style={styles.stepRow}>
                <Text style={styles.stepNumber}>01</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Tell us what you bring</Text>
                  <Text style={styles.stepSubtext}>Share your skills and availability.</Text>
                </View>
              </View>

              <View style={styles.stepRow}>
                <Text style={styles.stepNumber}>02</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Choose a real project</Text>
                  <Text style={styles.stepSubtext}>
                    Review the role, hours and deadlines before joining.
                  </Text>
                </View>
              </View>

              <View style={styles.stepRow}>
                <Text style={styles.stepNumber}>03</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Build your evidence</Text>
                  <Text style={styles.stepSubtext}>Record your contributions.</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: '#ECEEF2',
    padding: 4,
    borderRadius: radius.md,
  },
  demoLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    marginHorizontal: 8,
  },
  demoTab: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
  },
  demoTabActive: {
    backgroundColor: colors.surface,
  },
  demoTabText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
  },
  demoTabTextActive: {
    color: colors.primary,
  },
  imageCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  illustration: {
    width: 300,
    height: 180 ,
  },
  heroCard: {
    backgroundColor: colors.surfaceHero,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
  },
  heroTitle: {
    color: colors.textWhite,
    fontSize: 22,
    fontFamily: fonts.bold,
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  heroSubtext: {
    color: colors.textSubtle,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    marginBottom: spacing.md,
  },
  outlineButton: {
    marginBottom: spacing.xxl,
  },
  stepsContainer: {
    gap: spacing.xl,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  stepNumber: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginTop: 1,
    minWidth: 22,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 2,
  },
  stepSubtext: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  stateCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  stateTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.lg,
  },
  stateHeroTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.lg,
  },
  skeletonBlockLarge: {
    height: 90,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  skeletonBlockSmall: {
    height: 36,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
});
