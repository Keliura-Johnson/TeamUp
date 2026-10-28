import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function ReassignTaskScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { workspaceTasks, workspaceMembers, reassignWorkspaceTask } = useApp();

  const taskId = searchParams.taskId ? String(searchParams.taskId) : 't3';
  const task = workspaceTasks.find((t) => t.id === taskId) || workspaceTasks.find((t) => t.id === 't3');

  const [targetMemberId, setTargetMemberId] = useState('john');
  const [handoverNote, setHandoverNote] = useState('Share the agreed sign-up fields first.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);

  const availableMembers = workspaceMembers.filter((m) => m.id !== (task?.ownerId || 'david'));
  const selectedTarget = availableMembers.find((m) => m.id === targetMemberId) || availableMembers[0];

  const handleConfirmReassignment = async () => {
    if (!targetMemberId) {
      Alert.alert('Required', 'Choose one other accepted member.');
      return;
    }

    setIsSubmitting(true);
    const res = await reassignWorkspaceTask(task?.id || 't3', targetMemberId, handoverNote.trim());
    setIsSubmitting(false);

    if (res.success) {
      setIsConfirmed(true);
    } else {
      Alert.alert('Error', res.error || 'Failed to reassign task.');
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

          {/* Project Section Selector */}
          <View style={styles.sectionSelectorContainer}>
            <Text style={styles.sectionSelectorLabel}>Project section</Text>
            <TouchableOpacity
              style={styles.sectionSelectorDropdown}
              onPress={() => router.push('/workspace?section=tasks')}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionSelectorText}>Tasks</Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Screen Title */}
          <Text style={styles.screenHeading}>Manual reassignment</Text>
          <Text style={styles.screenSubtitle}>
            Reassign {task?.title || 'Design onboarding'} to {selectedTarget?.name || 'John'}?
          </Text>

          {!isConfirmed ? (
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Choose one other accepted member.</Text>
              <TouchableOpacity
                style={styles.dropdownBox}
                onPress={() => setMemberDropdownOpen(!memberDropdownOpen)}
              >
                <Text style={styles.dropdownValue}>
                  {selectedTarget ? `${selectedTarget.name} · ${selectedTarget.roleCategory || selectedTarget.role}` : 'Select member'}
                </Text>
                <Text style={styles.dropdownChevron}>▾</Text>
              </TouchableOpacity>
              {memberDropdownOpen && (
                <View style={styles.dropdownList}>
                  {availableMembers.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.dropdownItem, targetMemberId === m.id && styles.dropdownItemActive]}
                      onPress={() => {
                        setTargetMemberId(m.id);
                        setMemberDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, targetMemberId === m.id && styles.dropdownItemTextActive]}>
                        {m.name} · {m.roleCategory || m.role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Handover note</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                value={handoverNote}
                onChangeText={setHandoverNote}
                placeholder="Share the agreed sign-up fields first."
              />

              <Text style={styles.helperSubtext}>
                Current owner: {task?.ownerName || 'David'} · Saved state unchanged
              </Text>

              <Button
                title="Review reassignment"
                loading={isSubmitting}
                onPress={handleConfirmReassignment}
                style={{ marginTop: spacing.lg }}
              />

              <Button
                title="Cancel"
                variant="outline"
                onPress={() => router.back()}
                style={{ marginTop: spacing.xs }}
              />
            </View>
          ) : (
            <View>
              {/* S36.S / Reassignment Success Card (Frame 98) */}
              <View style={styles.card}>
                <View style={styles.badgeRow}>
                  <View style={styles.badgeBlocked}>
                    <Text style={styles.badgeBlockedText}>! Blocked</Text>
                  </View>
                  <View style={styles.badgeOverdue}>
                    <Text style={styles.badgeOverdueText}>Overdue 2 days</Text>
                  </View>
                </View>

                <Text style={styles.taskCardTitle}>{task?.title || 'Design onboarding'}</Text>
                <View style={styles.ownerRow}>
                  <View style={[styles.miniAvatar, { backgroundColor: '#EDE9FE' }]}>
                    <Text style={[styles.miniAvatarText, { color: colors.primary }]}>J</Text>
                  </View>
                  <Text style={styles.ownerText}>Owner: John</Text>
                </View>
                <Text style={styles.taskMetaText}>
                  Due: 10 Nov 2026 · Milestone: M2 Working prototype
                </Text>
                <Text style={styles.blockerNoteText}>
                  Blocker note: Waiting for agreed sign-up fields.
                </Text>
              </View>

              <View style={styles.noticeCard}>
                <Text style={styles.noticeHeadline}>
                  Team notice: Ada reassigned Design onboarding from David to John.
                </Text>
                <Text style={styles.noticeBody}>
                  No automatic contribution credit is added by reassignment or release.
                </Text>
              </View>

              <Button
                title="Back to tasks"
                onPress={() => router.push('/workspace?section=tasks')}
                style={{ marginTop: spacing.md }}
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
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: 6,
  },
  dropdownBox: {
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
  dropdownValue: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryLight,
  },
  dropdownItemText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    textAlignVertical: 'top',
  },
  helperSubtext: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
    lineHeight: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeBlocked: {
    backgroundColor: '#FDE8E8',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  badgeBlockedText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#DC2626',
  },
  badgeOverdue: {
    backgroundColor: '#FFEDD5',
    borderColor: '#FED7AA',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeOverdueText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#C2410C',
  },
  taskCardTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  miniAvatarText: {
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  ownerText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
  },
  taskMetaText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 4,
  },
  blockerNoteText: {
    fontSize: 13,
    color: '#DC2626',
    fontFamily: fonts.medium,
    marginBottom: spacing.xs,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noticeHeadline: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    lineHeight: 20,
    marginBottom: 6,
  },
  noticeBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
