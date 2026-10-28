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

export default function SignUpScreen() {
  const { user, updateUser } = useApp();

  const [name, setName] = useState(user.name || 'Ada');
  const [email, setEmail] = useState(user.email || 'ada@example.org');
  const [password, setPassword] = useState('1234567890');

  // Interactive demo states to test each Figma state
  const [activeState, setActiveState] = useState('default'); // 'default' | 'invalid_email' | 'weak_password' | 'existing_account' | 'network_error' | 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Please enter your name.';
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password || password.length < 6) {
      errors.password = 'Choose a stronger password.';
    }
    return errors;
  };

  const handleCreateAccount = () => {
    setIsSubmitting(true);
    setFieldErrors({});

    setTimeout(() => {
      setIsSubmitting(false);
      const errors = validate();

      if (errors.email) {
        setFieldErrors(errors);
        setActiveState('invalid_email');
        return;
      }
      if (errors.password) {
        setFieldErrors(errors);
        setActiveState('weak_password');
        return;
      }

      // Save user to context and transition to success state
      updateUser({ name, email });
      setActiveState('success');
    }, 400);
  };

  const handleContinueToProfile = () => {
    updateUser({ name, email });
    router.push('/requiredprofile');
  };

  const handleSignIn = () => {
    router.push('/signin');
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
              { id: 'invalid_email', label: 'Email Err' },
              { id: 'weak_password', label: 'Pass Err' },
              { id: 'existing_account', label: 'Existing' },
              { id: 'network_error', label: 'Net Err' },
              { id: 'success', label: 'S02.S' },
            ].map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => {
                  setActiveState(st.id);
                  if (st.id === 'invalid_email') {
                    setFieldErrors({ email: 'Enter a valid email address.' });
                  } else if (st.id === 'weak_password') {
                    setFieldErrors({ password: 'Choose a stronger password.' });
                  } else {
                    setFieldErrors({});
                  }
                }}
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
          <Text style={styles.stepBadge}>Step 1 of 2 · Account</Text>

          {activeState === 'success' ? (
            // S02.S / Created — continue to S04
            <>
              <Text style={styles.mainTitle}>Your account is created</Text>
              <Text style={styles.subText}>Next: complete your required profile.</Text>

              <Banner
                type="success"
                title="Account created"
                message={`${name || 'Ada'} · ${email || 'ada@example.org'}. Your required profile is the next step.`}
              />

              <Button
                title="Set up required profile"
                onPress={handleContinueToProfile}
                style={styles.primaryButton}
              />

              <Button
                title="Sign in instead"
                variant="link"
                onPress={handleSignIn}
              />
            </>
          ) : (
            // Default & Companion Sign-up Form
            <>
              <Text style={styles.mainTitle}>Create your account</Text>
              <Text style={styles.subText}>
                Create your account, then complete your profile.
              </Text>

              {/* State-specific Alert Banners */}
              {activeState === 'invalid_email' && (
                <Banner
                  type="error"
                  title="Check your email"
                  message="Enter a valid email address. Your name has been kept."
                />
              )}

              {activeState === 'weak_password' && (
                <Banner
                  type="error"
                  title="Choose a stronger password"
                  message="Choose a stronger password. Your other entries are retained."
                />
              )}

              {activeState === 'existing_account' && (
                <Banner
                  type="info"
                  title="Need to sign in instead?"
                  message="If you already have an account, sign in to continue."
                />
              )}

              {activeState === 'network_error' && (
                <Banner
                  type="error"
                  title="We could not connect"
                  message="Account creation not confirmed. Your other entries are retained. Try again."
                />
              )}

              {/* Input Fields */}
              <FormField
                label="Name *"
                value={name}
                onChangeText={(val) => {
                  setName(val);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="Ada"
                error={fieldErrors.name}
              />

              <FormField
                label="Email *"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }));
                  if (activeState === 'invalid_email') setActiveState('default');
                }}
                placeholder="ada@example.org"
                keyboardType="email-address"
                autoCapitalize="none"
                error={fieldErrors.email || (activeState === 'invalid_email' ? 'Enter a valid email address.' : null)}
              />

              <FormField
                label="Password *"
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }));
                  if (activeState === 'weak_password') setActiveState('default');
                }}
                isPassword
                error={fieldErrors.password || (activeState === 'weak_password' ? 'Choose a stronger password.' : null)}
              />

              <Text style={styles.helperText}>Use a password you do not use elsewhere.</Text>
              <Text style={styles.helperText}>
                Contact details are visible only to accepted teammates.
              </Text>

              {activeState === 'existing_account' ? (
                <>
                  <Button
                    title="Sign in"
                    onPress={handleSignIn}
                    style={styles.primaryButton}
                  />
                  <Button
                    title="Back to sign-up"
                    variant="link"
                    onPress={() => setActiveState('default')}
                  />
                </>
              ) : activeState === 'network_error' ? (
                <>
                  <Button
                    title="Try again"
                    onPress={handleCreateAccount}
                    loading={isSubmitting}
                    loadingText="Connecting..."
                    style={styles.primaryButton}
                  />
                  <Button
                    title="Sign in instead"
                    variant="link"
                    onPress={handleSignIn}
                  />
                </>
              ) : (
                <>
                  <Button
                    title="Create account"
                    onPress={handleCreateAccount}
                    loading={isSubmitting}
                    loadingText="Creating account..."
                    style={styles.primaryButton}
                  />
                  <Button
                    title="Sign in instead"
                    variant="link"
                    onPress={handleSignIn}
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
    paddingHorizontal: 8,
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
  stepBadge: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    fontFamily: fonts.medium,
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
    marginBottom: 6,
    lineHeight: 16,
  },
  primaryButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
});
