import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function ReleaseRoleScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { workspaceMembers, releaseWorkspaceRole } = useApp();

  const memberId = searchParams.memberId ? String(searchParams.memberId) : 'david';
  const member = workspaceMembers.find((m) => m.id === memberId) || workspaceMembers.find((m) => m.id === 'david');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  const handleRelease = async () => {
    setIsSubmitting(true);
    const res = await releaseWorkspaceRole(member.id);
    setIsSubmitting(false);

    if (res.success) {
      setIsReleased(true);
    } else {
      Alert.alert('Error', res.error || 'Failed to release role.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Header activeMenuItem="workspace" rightText="Menu" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Breadcrumb */}
          <Text style={styles.breadcrumb}>My Projects / Campus Marketplace</Text>

          {/* Project Header */}
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>In Progress · Ada · Owner</Text>

          {/* Section Indicator */}
          <View style={styles.sectionSelectorContainer}>
            <Text style={styles.sectionSelectorLabel}>Project section</Text>
            <View style={styles.sectionSelectorDropdown}>
              <Text style={styles.sectionSelectorText}>Team</Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </View>
          </View>

          {/* Screen Title */}
          <Text style={styles.screenHeading}>Release role</Text>
          <Text style={styles.screenSubtitle}>
            Team / {member?.name || 'David'} · Role release review
          </Text>

          {!isReleased ? (
            <View>
              {/* Member & Open Tasks Card */}
              <View style={styles.card}>
                <Text style={styles.memberNameRole}>
                  {member?.name || 'David'} · {member?.roleCategory || member?.role || 'UI/UX Designer'}
                </Text>
                <Text style={styles.memberHours}>
                  {member?.hours || '6 h / week'} · Accepted {member?.acceptedDate || '19 Oct 2026'}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.openTasksHeading}>Open work still assigned to {member?.name || 'David'}</Text>

                <View style={styles.taskItem}>
                  <Text style={styles.taskTitle}>Design onboarding</Text>
                  <Text style={styles.taskMeta}>Blocked · Due 10 Nov 2026</Text>
                </View>

                <View style={styles.taskItem}>
                  <Text style={styles.taskTitle}>UI handoff</Text>
                  <Text style={styles.taskMeta}>In review · Due 13 Nov 2026</Text>
                </View>
              </View>

              {/* Action Buttons (Frame 31) */}
              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => router.back()}
                  style={styles.halfBtn}
                />
                <Button
                  title="Release role"
                  loading={isSubmitting}
                  onPress={handleRelease}
                  style={[styles.halfBtn, styles.releaseBtn]}
                />
              </View>

              <Text style={styles.cancelNote}>Cancel leaves the role and tasks unchanged.</Text>
            </View>
          ) : (
            <View>
              {/* Post-Release State (Frame 34) */}
              <View style={styles.releasedBanner}>
                <Text style={styles.bannerTitle}>Designer role is now Open</Text>
                <Text style={styles.bannerBody}>
                  Project remains In Progress. David&apos;s two open tasks, history, comments and completed work remain unchanged.
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardHeading}>Owner&apos;s next step</Text>
                <Text style={styles.bodyText}>
                  Review Design onboarding and UI handoff individually. A role release does not select a replacement or save a handover.
                </Text>
                <Button
                  title="Review manual reassignment"
                  variant="outline"
                  onPress={() => router.push({ pathname: '/reassign-task', params: { taskId: 't3' } })}
                  style={{ marginTop: spacing.md }}
                />
              </View>

              <Button
                title="Back to team"
                onPress={() => router.push('/workspace?section=team')}
                style={{ marginTop: spacing.sm }}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    backgroundColor: '#FFFFFF',
  },
  breadcrumb: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  projectTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  projectSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  sectionSelectorContainer: {
    marginBottom: spacing.lg,
  },
  sectionSelectorLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textBody,
    marginBottom: 4,
  },
  sectionSelectorDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSelectorText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  dropdownChevron: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  screenHeading: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberNameRole: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  memberHours: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  openTasksHeading: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  taskItem: {
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  taskTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
  },
  taskMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  halfBtn: {
    flex: 0.48,
  },
  releaseBtn: {
    backgroundColor: '#8B1E2D',
  },
  cancelNote: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  releasedBanner: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  bannerTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#166534',
    marginBottom: 2,
  },
  bannerBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#15803D',
    lineHeight: 16,
  },
  cardHeading: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  bodyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
});
