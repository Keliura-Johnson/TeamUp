import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import Banner from '../components/Banner';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function AccountDeletionScreen() {
  const { user, accountDeletionStatus, requestAccountDeletion } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(
    accountDeletionStatus === 'submitted'
  );

  const handleConfirmDeletion = async () => {
    setIsSubmitting(true);
    const res = await requestAccountDeletion();
    setIsSubmitting(false);
    if (res.success) {
      setIsSubmitted(true);
    }
  };

  const accountName = user?.name || 'Ada';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="settings" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subnav row */}
        <View style={styles.subnavBar}>
          <TouchableOpacity onPress={() => router.push('/myprojects')}>
            <Text style={styles.subnavLink}>My Projects</Text>
          </TouchableOpacity>
        </View>

        {/* Title & Breadcrumb */}
        <Text style={styles.mainTitle}>Account deletion</Text>

        <TouchableOpacity
          onPress={() => router.push('/settings')}
          style={styles.breadcrumbTouch}
        >
          <Text style={styles.breadcrumbText}>
            Settings <Text style={styles.breadcrumbSlash}>/</Text> Account controls
          </Text>
        </TouchableOpacity>

        {/* ========================================================= */}
        {/* CONFIRMATION OR RECEIVED CARD                             */}
        {/* ========================================================= */}
        <View style={styles.card}>
          {isSubmitted ? (
            /* Deletion Request Received (frame_064.jpg) */
            <View>
              <Banner
                type="success"
                title="Deletion request received"
                message="Your request has been submitted. This is not confirmation that your account is deleted."
              />

              <Text style={styles.accountText}>Account: {accountName}</Text>

              <Button
                title="Back to Settings"
                onPress={() => router.push('/settings')}
                style={{ marginTop: spacing.md }}
              />

              <Button
                title="Sign out"
                variant="outline"
                onPress={() => router.push('/sign-in')}
                style={{ marginTop: spacing.xs }}
              />
            </View>
          ) : (
            /* Request Account Deletion Confirmation (frame_063.jpg) */
            <View>
              <Text style={styles.cardHeading}>Request account deletion?</Text>

              <Text style={styles.cardBodyText}>
                This sends a request to delete your TeamUp account. Your account
                has not been deleted.
              </Text>

              <Text style={styles.accountText}>Account: {accountName}</Text>

              <Text style={styles.noRequestText}>
                No request is sent until you confirm.
              </Text>

              <View style={styles.buttonRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => router.push('/settings')}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={styles.dangerButton}
                    onPress={handleConfirmDeletion}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.dangerButtonText}>Confirm request</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {!isSubmitted && (
          <Text style={styles.footerNote}>
            Notification and profile settings remain separate from this account
            request.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl + 20,
  },
  subnavBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  subnavLink: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  mainTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textHeading,
    marginTop: spacing.xs,
  },
  breadcrumbTouch: {
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  breadcrumbText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  breadcrumbSlash: {
    color: colors.textSubtle,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  cardHeading: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  cardBodyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  accountText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  noRequestText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerButton: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: '#991B1B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  dangerButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  footerNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
