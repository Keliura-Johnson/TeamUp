import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function ProjectCompletionScreen() {
  const {
    activePersona,
    completionState,
    saveOutcomeAndDeliverables,
    completeCampusProject,
  } = useApp();

  const isOwner = String(activePersona).toLowerCase() === 'ada';
  const isJohn = String(activePersona).toLowerCase() === 'john';

  const [outcomeText, setOutcomeText] = useState(completionState.finalOutcome);
  const [deliverableLabel, setDeliverableLabel] = useState(
    completionState.deliverables[0]?.label || 'Marketplace prototype'
  );
  const [deliverables, setDeliverables] = useState(completionState.deliverables);
  const [isSavingOutcome, setIsSavingOutcome] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');

  const davidSummary = completionState.memberSummaries.david;
  const isDavidConfirmed = davidSummary?.isConfirmed;
  const confirmedCount = 2 + (isDavidConfirmed ? 1 : 0);
  const allConfirmed = confirmedCount === 3;

  const handleSaveOutcome = async () => {
    setIsSavingOutcome(true);
    const res = await saveOutcomeAndDeliverables(outcomeText, deliverables);
    setIsSavingOutcome(false);
    if (res.success) {
      Alert.alert('Outcome Saved', 'Final outcome and project deliverables have been saved.');
    } else {
      Alert.alert('Save Failed', res.error || 'Failed to save outcome.');
    }
  };

  const handleResetOutcome = () => {
    setOutcomeText(completionState.finalOutcome);
    setDeliverables(completionState.deliverables);
  };

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) {
      Alert.alert('Required', 'Please enter a valid URL.');
      return;
    }
    const newDel = {
      id: `del-${Date.now()}`,
      label: newLinkLabel.trim() || 'Project link',
      fileName: newLinkUrl.trim(),
      type: 'Link',
      isSaved: true,
      url: newLinkUrl.trim(),
    };
    setDeliverables((prev) => [...prev, newDel]);
    setShowAddLinkModal(false);
    setNewLinkUrl('');
    setNewLinkLabel('');
  };

  const handleAddFileSimulated = () => {
    const newDel = {
      id: `del-${Date.now()}`,
      label: 'Design assets bundle',
      fileName: 'design-assets-spec.pdf',
      type: 'File',
      isSaved: true,
      url: null,
    };
    setDeliverables((prev) => [...prev, newDel]);
    Alert.alert('File Added', 'Attached simulated file: design-assets-spec.pdf');
  };

  const handleCompleteProject = async () => {
    if (!allConfirmed) {
      Alert.alert(
        'Confirmation Pending',
        "David's contribution must be confirmed by John before the project can be completed."
      );
      return;
    }
    setIsCompleting(true);
    const res = await completeCampusProject();
    setIsCompleting(false);
    if (res.success) {
      router.push('/private-project-page');
    } else {
      Alert.alert('Error', res.error || 'Could not complete project.');
    }
  };

  return (
    <View style={styles.container}>
      <Header activeMenuItem="completion" rightText="Menu" />
      <PersonaSwitcher />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb */}
        <View style={styles.breadcrumbRow}>
          <TouchableOpacity onPress={() => router.push('/myprojects')}>
            <Text style={styles.breadcrumbLink}>My Projects</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>/</Text>
          <Text style={styles.breadcrumbCurrent}>Campus Marketplace</Text>
        </View>

        {/* Project Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>
            In Progress · {activePersona} · {isOwner ? 'Owner' : 'Member'}
          </Text>
          <View style={styles.sectionTagRow}>
            <Text style={styles.sectionTagLabel}>Project section:</Text>
            <View style={styles.sectionTagBadge}>
              <Text style={styles.sectionTagText}>Project completion</Text>
            </View>
          </View>
          <Text style={styles.datesMeta}>30 Nov 2026 · 19 Oct–30 Nov · 6 weeks</Text>
        </View>

        {/* Member Alternate Read-Only Notice */}
        {!isOwner && (
          <View style={styles.memberNoticeCard}>
            <View style={styles.memberNoticeHeader}>
              <Text style={styles.memberNoticeBadge}>
                Member alternate / {activePersona} · read only
              </Text>
            </View>
            <Text style={styles.memberNoticeTitle}>Only the Owner can complete</Text>
            <Text style={styles.memberNoticeBody}>
              You can view evidence and review your own contribution. Ada saves final evidence and
              completes the project.
            </Text>
            <TouchableOpacity
              style={styles.reviewMyContributionBtn}
              onPress={() => router.push('/contribution-summary')}
            >
              <Text style={styles.reviewMyContributionBtnText}>Review my contribution</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Top Status Banner */}
        <View
          style={[
            styles.statusBanner,
            allConfirmed ? styles.statusBannerSuccess : styles.statusBannerPending,
          ]}
        >
          <Text
            style={[
              styles.statusBannerTitle,
              allConfirmed ? styles.statusBannerTitleSuccess : styles.statusBannerTitlePending,
            ]}
          >
            {allConfirmed
              ? 'All 3 member confirmations saved'
              : 'One confirmation remaining'}
          </Text>
          <Text style={styles.statusBannerSubtitle}>
            {allConfirmed
              ? 'Outcome, deliverables and all 3 member confirmations saved. Ready for Owner Ada to complete.'
              : "Outcome and deliverable saved. David awaits John's confirmation. Project still In progress."}
          </Text>
        </View>

        {/* Section 1: Final outcome and deliverables */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Final outcome and deliverables</Text>
            <View style={styles.savedPill}>
              <Text style={styles.savedPillText}>Required evidence · Saved</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Final outcome *</Text>
          <TextInput
            style={[styles.textArea, !isOwner && styles.inputReadOnly]}
            value={outcomeText}
            onChangeText={setOutcomeText}
            multiline
            numberOfLines={3}
            editable={isOwner}
            placeholder="Describe the final collective outcome delivered..."
          />

          <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>
            Project deliverable label
          </Text>
          <TextInput
            style={[styles.input, !isOwner && styles.inputReadOnly]}
            value={deliverableLabel}
            onChangeText={setDeliverableLabel}
            editable={isOwner}
          />

          <View style={styles.deliverablesList}>
            {deliverables.map((del) => (
              <View key={del.id} style={styles.deliverableItem}>
                <View style={styles.deliverableIcon}>
                  <Text style={styles.deliverableIconText}>
                    {del.type === 'File' ? '📄' : '🔗'}
                  </Text>
                </View>
                <View style={styles.deliverableInfo}>
                  <Text style={styles.deliverableName}>{del.fileName}</Text>
                  <Text style={styles.deliverableMeta}>
                    {del.type} · Saved
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.ruleNote}>
            At least one project deliverable is required: a link OR a file.
          </Text>

          {isOwner && (
            <View style={styles.deliverableActionsRow}>
              <TouchableOpacity
                style={styles.outlineActionBtn}
                onPress={handleAddFileSimulated}
              >
                <Text style={styles.outlineActionBtnText}>+ Add file</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlineActionBtn}
                onPress={() => setShowAddLinkModal(true)}
              >
                <Text style={styles.outlineActionBtnText}>+ Add link</Text>
              </TouchableOpacity>
            </View>
          )}

          {isOwner && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.primaryBtn, isSavingOutcome && styles.btnDisabled]}
                onPress={handleSaveOutcome}
                disabled={isSavingOutcome}
              >
                <Text style={styles.primaryBtnText}>
                  {isSavingOutcome ? 'Saving...' : 'Save outcome and deliverables'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleResetOutcome}
              >
                <Text style={styles.cancelBtnText}>Cancel local changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Section 2: Saved Work */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saved work</Text>
          <View style={styles.taskCountRow}>
            <Text style={styles.taskCountHeading}>Overall tasks</Text>
            <View style={styles.donePill}>
              <Text style={styles.donePillText}>6 of 6 Done</Text>
            </View>
          </View>

          <View style={styles.milestoneList}>
            {completionState.milestones.map((m) => (
              <View key={m.id} style={styles.milestoneRow}>
                <View style={styles.milestoneIcon}>
                  <Text style={styles.milestoneCheck}>✓</Text>
                </View>
                <View style={styles.milestoneInfo}>
                  <Text style={styles.milestoneName}>{m.name}</Text>
                  <Text style={styles.milestoneDate}>{m.date}</Text>
                </View>
                <Text style={styles.milestoneDone}>
                  {m.done}/{m.total} Done
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section 3: Member Confirmations */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>
              Member confirmations · {confirmedCount}/3
            </Text>
          </View>

          {/* Ada */}
          <View style={styles.memberCard}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>A</Text>
            </View>
            <View style={styles.memberDetails}>
              <View style={styles.memberNameRow}>
                <Text style={styles.memberName}>Ada</Text>
                <Text style={styles.memberRoleTag}>Product manager · Owner</Text>
              </View>
              <Text style={styles.memberSummaryText}>
                Defined user stories and coordinated project milestones.
              </Text>
              <View style={styles.memberConfirmRow}>
                <Text style={styles.confirmedBadge}>✓ Confirmed by John</Text>
                <Text style={styles.memberTasksMeta}>2 Done tasks</Text>
              </View>
            </View>
          </View>

          {/* David */}
          <View style={styles.memberCard}>
            <View style={[styles.memberAvatar, { backgroundColor: '#E0F2FE' }]}>
              <Text style={[styles.memberAvatarText, { color: '#0284C7' }]}>D</Text>
            </View>
            <View style={styles.memberDetails}>
              <View style={styles.memberNameRow}>
                <Text style={styles.memberName}>David</Text>
                <Text style={styles.memberRoleTag}>UI/UX Designer</Text>
              </View>
              <Text style={styles.memberSummaryText}>
                {davidSummary?.wording || 'Designed onboarding and prepared the UI handoff.'}
              </Text>
              <View style={styles.memberConfirmRow}>
                {isDavidConfirmed ? (
                  <Text style={styles.confirmedBadge}>✓ Confirmed by John</Text>
                ) : (
                  <View style={styles.awaitingBadge}>
                    <Text style={styles.awaitingBadgeText}>
                      ⏳ Awaiting John
                    </Text>
                  </View>
                )}
                <Text style={styles.memberTasksMeta}>2 Done tasks</Text>
              </View>
              <View style={styles.memberActionLinksRow}>
                <TouchableOpacity
                  onPress={() => router.push('/contribution-summary')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.viewContributionLink}>
                    {"View David's contribution"}
                  </Text>
                </TouchableOpacity>
                {!isDavidConfirmed && isJohn && (
                  <TouchableOpacity
                    onPress={() => router.push('/teammate-confirmation')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[styles.viewContributionLink, { color: colors.primary }]}>
                      Review as John →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* John */}
          <View style={styles.memberCard}>
            <View style={[styles.memberAvatar, { backgroundColor: '#E0F7F4' }]}>
              <Text style={[styles.memberAvatarText, { color: '#0D9488' }]}>J</Text>
            </View>
            <View style={styles.memberDetails}>
              <View style={styles.memberNameRow}>
                <Text style={styles.memberName}>John</Text>
                <Text style={styles.memberRoleTag}>Frontend Developer</Text>
              </View>
              <Text style={styles.memberSummaryText}>
                Built project browsing and implemented sign-up screens.
              </Text>
              <View style={styles.memberConfirmRow}>
                <Text style={styles.confirmedBadge}>✓ Confirmed by Ada</Text>
                <Text style={styles.memberTasksMeta}>2 Done tasks</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 4: Before you complete (Checklist) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Before you complete</Text>

          <View style={styles.checkItem}>
            <Text style={styles.checkIconSuccess}>✓</Text>
            <Text style={styles.checkText}>Saved final outcome</Text>
          </View>

          <View style={styles.checkItem}>
            <Text style={styles.checkIconSuccess}>✓</Text>
            <Text style={styles.checkText}>At least one saved project deliverable</Text>
          </View>

          <View style={styles.checkItem}>
            {allConfirmed ? (
              <Text style={styles.checkIconSuccess}>✓</Text>
            ) : (
              <Text style={styles.checkIconPending}>⏳</Text>
            )}
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.checkText,
                  !allConfirmed && { color: '#B45309', fontWeight: '600' },
                ]}
              >
                {allConfirmed
                  ? 'All 3 members confirmed'
                  : "Pending · David's contribution needs John's confirmation."}
              </Text>
              {!allConfirmed && (
                <TouchableOpacity
                  onPress={() => router.push('/teammate-confirmation')}
                  style={{ marginTop: 2 }}
                >
                  <Text style={styles.viewContributionLink}>
                    Go to teammate confirmation →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Complete Button */}
          {isOwner && (
            <View style={{ marginTop: spacing.lg }}>
              <TouchableOpacity
                style={[
                  styles.completeProjectBtn,
                  !allConfirmed && styles.completeProjectBtnDisabled,
                ]}
                onPress={handleCompleteProject}
                disabled={!allConfirmed || isCompleting}
              >
                <Text style={styles.completeProjectBtnText}>
                  {isCompleting ? 'Completing...' : 'Complete project'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.ownerCompleteNote}>
                Only Owner Ada can complete after all members are peer-confirmed. Page
                remains private; profiles unchanged.
              </Text>
            </View>
          )}
        </View>

        {/* Ended Early Alternative link */}
        <View style={styles.endedEarlyCard}>
          <Text style={styles.endedEarlyHeading}>Alternative Scenario</Text>
          <Text style={styles.endedEarlyBody}>
            View the 12 Nov preserved record alternative where the project ended early
            with 2 of 6 tasks Done.
          </Text>
          <TouchableOpacity
            style={styles.endedEarlyLinkBtn}
            onPress={() => router.push('/ended-early')}
          >
            <Text style={styles.endedEarlyLinkBtnText}>
              View Ended Early record alternative →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Link Modal */}
      {showAddLinkModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Project Deliverable Link</Text>
            <Text style={styles.modalLabel}>Link Label</Text>
            <TextInput
              style={styles.modalInput}
              value={newLinkLabel}
              onChangeText={setNewLinkLabel}
              placeholder="e.g. Live demo or Repo"
            />
            <Text style={styles.modalLabel}>URL *</Text>
            <TextInput
              style={styles.modalInput}
              value={newLinkUrl}
              onChangeText={setNewLinkUrl}
              placeholder="https://..."
              autoCapitalize="none"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAddLinkModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleAddLink}
              >
                <Text style={styles.modalSubmitText}>Add Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  breadcrumbLink: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },
  breadcrumbSeparator: {
    marginHorizontal: 6,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  headerBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  projectTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  projectSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: fonts.semiBold,
    marginBottom: 8,
  },
  sectionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTagLabel: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 6,
    fontFamily: fonts.medium,
  },
  sectionTagBadge: {
    backgroundColor: '#EEECFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  sectionTagText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  datesMeta: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: fonts.medium,
  },
  statusBanner: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  statusBannerPending: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  statusBannerSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusBannerTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  statusBannerTitlePending: {
    color: '#92400E',
  },
  statusBannerTitleSuccess: {
    color: '#065F46',
  },
  statusBannerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  memberNoticeCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  memberNoticeHeader: {
    marginBottom: 6,
  },
  memberNoticeBadge: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#1D4ED8',
    textTransform: 'uppercase',
  },
  memberNoticeTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: '#1E3A8A',
    marginBottom: 4,
  },
  memberNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
  },
  reviewMyContributionBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  reviewMyContributionBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  savedPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  savedPillText: {
    fontSize: 11,
    color: '#475569',
    fontFamily: fonts.semiBold,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    backgroundColor: '#FFFFFF',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  inputReadOnly: {
    backgroundColor: '#F8FAFC',
    color: '#64748B',
  },
  deliverablesList: {
    marginTop: spacing.md,
    gap: 8,
  },
  deliverableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.sm,
    padding: 10,
  },
  deliverableIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  deliverableIconText: {
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  deliverableInfo: {
    flex: 1,
  },
  deliverableName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  deliverableMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ruleNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 10,
    fontStyle: 'italic',
  },
  deliverableActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  outlineActionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
  },
  outlineActionBtnText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  buttonRow: {
    marginTop: spacing.md,
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#64748B',
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  taskCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  taskCountHeading: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: '#334155',
  },
  donePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  donePillText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: '#15803D',
  },
  milestoneList: {
    gap: 8,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  milestoneIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  milestoneCheck: {
    color: '#15803D',
    fontSize: 13,
    fontFamily: fonts.bold,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  milestoneDate: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  milestoneDone: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: '#15803D',
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: '#EEECFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#6336E4',
  },
  memberDetails: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  memberRoleTag: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: fonts.medium,
  },
  memberSummaryText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    marginBottom: 6,
  },
  memberConfirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmedBadge: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#15803D',
  },
  awaitingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  awaitingBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#B45309',
  },
  memberTasksMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  memberActionLinksRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  viewContributionLink: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  checkIconSuccess: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#15803D',
    marginRight: 8,
    marginTop: 1,
  },
  checkIconPending: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#B45309',
    marginRight: 8,
    marginTop: 1,
  },
  checkText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textHeading,
  },
  completeProjectBtn: {
    backgroundColor: '#15803D',
    paddingVertical: 13,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  completeProjectBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  completeProjectBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  ownerCompleteNote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  endedEarlyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  endedEarlyHeading: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  endedEarlyBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 8,
  },
  endedEarlyLinkBtn: {
    alignSelf: 'flex-start',
  },
  endedEarlyLinkBtnText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  modalLabel: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: '#334155',
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: fonts.regular,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCancelText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: fonts.semiBold,
  },
  modalSubmitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
  },
  modalSubmitText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
});
