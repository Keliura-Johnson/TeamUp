import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import FormField from '../components/FormField';
import Banner from '../components/Banner';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function SignInScreen() {
  const { user, updateUser } = useApp();

  const [email, setEmail] = useState(user.email || 'ada@example.org');
  const [password, setPassword] = useState('1234567890');

  // Interactive demo states for Figma QA
  const [activeState, setActiveState] = useState('default'); // 'default' | 'invalid' | 'network_error' | 'success_incomplete'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      if (!email.trim() || !password.trim()) {
        setActiveState('invalid');
        return;
      }

      updateUser({ email });
      // In this batch, default flow takes user to complete their required profile
      setActiveState('success_incomplete');
    }, 400);
  };

  const handleContinueToProfile = () => {
    router.push('/requiredprofile');
  };

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onRightPress={() => router.back()} rightText="Back" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* State Demo Toggle Toolbar for Figma Review */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
            {[
              { id: 'default', label: 'Default' },
              { id: 'invalid', label: 'Invalid' },
              { id: 'network_error', label: 'Network' },
              { id: 'success_incomplete', label: 'S03.S' },
            ].map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => setActiveState(st.id)}
                style={[styles.demoTab, activeState === st.id && styles.demoTabActive]}
              >
                <Text style={[styles.demoTabText, activeState === st.id && styles.demoTabTextActive]}>
                  {st.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          {activeState === 'success_incomplete' ? (
            // S03.S / Success — required setup incomplete
            <>
              <Banner
                type="success"
                title="Signed in"
                message="Your account is available. Finish your required profile before discovery."
              />

              <Text style={styles.mainTitle}>Continue your profile</Text>

              <View style={styles.readOnlyContainer}>
                <Text style={styles.fieldLabel}>Name from account</Text>
                <View style={styles.readOnlyBox}>
                  <Text style={styles.readOnlyText}>{user.name || 'Ada'}</Text>
                </View>
              </View>

              <Button
                title="Continue required profile"
                onPress={handleContinueToProfile}
                style={styles.primaryButton}
              />

              <Button
                title="Go to Dashboard"
                variant="outline"
                onPress={() => router.push('/dashboard')}
                style={{ marginTop: spacing.xs }}
              />
            </>
          ) : (
            // Default & Companion Sign-In Form
            <>
              <Text style={styles.mainTitle}>Welcome back</Text>
              <Text style={styles.subText}>Sign in to pick up where you left off.</Text>

              {/* State-specific Alert Banners */}
              {activeState === 'invalid' && (
                <Banner
                  type="error"
                  title="Email or password is incorrect"
                  message="Check your details and try again. You have not been signed in."
                />
              )}

              {activeState === 'network_error' && (
                <Banner
                  type="error"
                  title="We could not connect"
                  message="Connection error. Your credentials could not be checked."
                />
              )}

              <FormField
                label="Email *"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (activeState === 'invalid') setActiveState('default');
                }}
                placeholder="ada@example.org"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <FormField
                label="Password *"
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (activeState === 'invalid') setActiveState('default');
                }}
                isPassword
              />

              <Text style={styles.helperText}>Use a password you do not use elsewhere.</Text>

              {activeState === 'network_error' ? (
                <>
                  <Button
                    title="Retry sign in"
                    onPress={handleSignIn}
                    loading={isSubmitting}
                    loadingText="Checking credentials..."
                    style={styles.primaryButton}
                  />
                  <Button
                    title="Create account"
                    variant="link"
                    onPress={handleCreateAccount}
                  />
                </>
              ) : (
                <>
                  <Button
                    title="Sign in"
                    onPress={handleSignIn}
                    loading={isSubmitting}
                    loadingText="Checking credentials..."
                    style={styles.primaryButton}
                  />
                  <Button
                    title="Create account"
                    variant="link"
                    onPress={handleCreateAccount}
                  />
                </>
              )}
            </>
          )}
        </View>
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
    backgroundColor: '#ECEEF2',
    padding: 4,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  demoScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demoLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    marginHorizontal: 8,
    marginBottom: 2,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 6,
  },
  subText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  helperText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 16,
  },
  primaryButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: spacing.xs + 2,
  },
  readOnlyContainer: {
    marginVertical: spacing.lg,
  },
  readOnlyBox: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  readOnlyText: {
    fontSize: 14,
    color: colors.textHeading,
    fontFamily: fonts.medium,
  },
});
