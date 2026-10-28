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

export default function ContributionSummaryScreen() {
  const {
    activePersona,
    setActivePersona,
    completionState,
    saveContributionReview,
  } = useApp();

  const davidSummary = completionState.memberSummaries.david;
  const isDavid = String(activePersona).toLowerCase() === 'david';
  const isOwner = String(activePersona).toLowerCase() === 'ada';

  const [wording, setWording] = useState(
    davidSummary?.wording || 'Designed onboarding and prepared the UI handoff.'
  );
  const [note, setNote] = useState(
    davidSummary?.note ||
      'Documented the final sign-up fields and shared handoff context with John.'
  );
  const [isSaving, setIsSaving] = useState(false);

  const reviewStatus = davidSummary?.reviewStatus || 'Unreviewed';
  const isConfirmed = davidSummary?.isConfirmed;

  const handleSaveReviewed = async () => {
    if (!wording.trim()) {
      Alert.alert('Required', 'Please enter your contribution wording.');
      return;
    }
    setIsSaving(true);
    const res = await saveContributionReview('david', wording, note);
    setIsSaving(false);
    if (res.success) {
      Alert.alert(
        'Review Saved',
        'Your contribution summary is saved as Reviewed and is now awaiting John’s confirmation.'
      );
    } else {
      Alert.alert('Save Failed', res.error || 'Failed to save review.');
    }
  };

  const handleCancelLocal = () => {
    setWording(davidSummary?.wording || '');
    setNote(davidSummary?.note || '');
    Alert.alert('Cancelled', 'Local wording edits were cancelled.');
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
          <TouchableOpacity onPress={() => router.push('/project-completion')}>
            <Text style={styles.breadcrumbLink}>Campus Marketplace</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>/</Text>
          <Text style={styles.breadcrumbCurrent}>Contributions</Text>
        </View>

        {/* Heading Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>
            In Progress · {activePersona} · {isOwner ? 'Owner' : 'Member'}
          </Text>
          <View style={styles.sectionTagRow}>
            <Text style={styles.sectionTagLabel}>Project section:</Text>
            <View style={styles.sectionTagBadge}>
              <Text style={styles.sectionTagText}>Contributions</Text>
            </View>
          </View>
          <Text style={styles.pageHeading}>My contribution summary</Text>
          <Text style={styles.datesMeta}>30 Nov 2026 · 19 Oct–30 Nov · 6 weeks</Text>
        </View>

        {/* Review Status Banner */}
        <View
          style={[
            styles.banner,
            isConfirmed
              ? styles.bannerConfirmed
              : reviewStatus === 'Reviewed'
              ? styles.bannerReviewed
              : styles.bannerUnreviewed,
          ]}
        >
          <Text
            style={[
              styles.bannerTitle,
              isConfirmed
                ? styles.bannerTitleConfirmed
                : reviewStatus === 'Reviewed'
                ? styles.bannerTitleReviewed
                : styles.bannerTitleUnreviewed,
            ]}
          >
            {isConfirmed
              ? 'Confirmed by John · 30 Nov 2026'
              : reviewStatus === 'Reviewed'
              ? 'Your review is saved'
              : 'Your review is not saved yet'}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {isConfirmed
              ? 'Teammate confirmation of contribution wording; not a verified impact claim.'
              : reviewStatus === 'Reviewed'
              ? 'Reviewed · Awaiting John. Two Done tasks are preserved. Summary is Reviewed and Awaiting John’s confirmation.'
              : 'Unreviewed · 2 saved Done tasks. Review your summary before saving.'}
          </Text>
        </View>

        {/* Section 1: Completed Task Evidence */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Your completed-task evidence</Text>
            <View style={styles.readOnlyPill}>
              <Text style={styles.readOnlyPillText}>2 Done tasks · Read only</Text>
            </View>
          </View>
          <Text style={styles.memberMetaText}>
            David · Accepted member · UI/UX Designer
          </Text>

          {/* Task 1 */}
          <View style={styles.taskItem}>
            <View style={styles.taskHeaderRow}>
              <View style={styles.doneIcon}>
                <Text style={styles.doneIconText}>✓ Done</Text>
              </View>
              <Text style={styles.taskName}>Design onboarding</Text>
            </View>
            <Text style={styles.taskOwner}>
              Owner: David · Due: 10 Nov 2026 · M2 Working prototype
            </Text>
            <Text style={styles.taskCompletionDate}>
              Completed 16 Nov 2026 · Evidence: onboarding-design.pdf
            </Text>
            <TouchableOpacity
              style={styles.openEvidenceBtn}
              onPress={() =>
                Alert.alert('Simulated Evidence', 'Viewing file: onboarding-design.pdf')
              }
            >
              <Text style={styles.openEvidenceText}>📄 Open onboarding-design.pdf</Text>
            </TouchableOpacity>
          </View>

          {/* Task 2 */}
          <View style={styles.taskItem}>
            <View style={styles.taskHeaderRow}>
              <View style={styles.doneIcon}>
                <Text style={styles.doneIconText}>✓ Done</Text>
              </View>
              <Text style={styles.taskName}>UI handoff</Text>
            </View>
            <Text style={styles.taskOwner}>
              Owner: David · Due: 13 Nov 2026 · M2 Working prototype
            </Text>
            <Text style={styles.taskCompletionDate}>
              Completed 16 Nov 2026 · Evidence: ui-handoff.pdf
            </Text>
            <TouchableOpacity
              style={styles.openEvidenceBtn}
              onPress={() =>
                Alert.alert('Simulated Evidence', 'Viewing file: ui-handoff.pdf')
              }
            >
              <Text style={styles.openEvidenceText}>📄 Open ui-handoff.pdf</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.evidenceDisclaimer}>
            Task ownership, dates, milestones and history are not changed by summary
            notes.
          </Text>
        </View>

        {/* Section 2: Review your contribution (Wording + Note) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Review your contribution</Text>

          <Text style={styles.fieldLabel}>My contribution wording *</Text>
          <TextInput
            style={[styles.textArea, !isDavid && styles.inputDisabled]}
            value={wording}
            onChangeText={setWording}
            multiline
            numberOfLines={3}
            editable={isDavid}
            placeholder="Summarize your completed tasks and contribution..."
          />

          <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>
            Optional note
          </Text>
          <TextInput
            style={[styles.textArea, !isDavid && styles.inputDisabled]}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
            editable={isDavid}
            placeholder="Add context for teammates reviewing your summary..."
          />

          <View style={styles.localStatusRow}>
            <Text style={styles.localStatusText}>
              {reviewStatus === 'Reviewed'
                ? 'Saved as Reviewed'
                : 'Local wording · Not yet saved as Reviewed'}
            </Text>
          </View>

          {isDavid && (
            <View style={styles.actionButtonGroup}>
              <TouchableOpacity
                style={[styles.saveReviewedBtn, isSaving && styles.btnDisabled]}
                onPress={handleSaveReviewed}
                disabled={isSaving}
              >
                <Text style={styles.saveReviewedBtnText}>
                  {isSaving ? 'Saving...' : 'Save Reviewed'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelLocalBtn}
                onPress={handleCancelLocal}
              >
                <Text style={styles.cancelLocalBtnText}>Cancel local changes</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.guardNote}>
            Save your review, then request teammate confirmation. You cannot confirm
            yourself.
          </Text>
        </View>

        {/* Navigation to Next Step: John Confirms David */}
        <View style={styles.nextStepCard}>
          <Text style={styles.nextStepTitle}>Next Step: Teammate Confirmation</Text>
          <Text style={styles.nextStepBody}>
            Once saved as Reviewed, switch to John’s perspective to review and confirm
            David’s summary.
          </Text>
          <TouchableOpacity
            style={styles.nextStepBtn}
            onPress={() => {
              setActivePersona('John');
              router.push('/teammate-confirmation');
            }}
          >
            <Text style={styles.nextStepBtnText}>
              Review as John (Peer Reviewer) →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    flexWrap: 'wrap',
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
  pageHeading: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginTop: 4,
    marginBottom: 4,
  },
  datesMeta: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: fonts.medium,
  },
  banner: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  bannerUnreviewed: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  bannerReviewed: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  bannerConfirmed: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  bannerTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  bannerTitleUnreviewed: {
    color: '#92400E',
  },
  bannerTitleReviewed: {
    color: '#1E40AF',
  },
  bannerTitleConfirmed: {
    color: '#065F46',
  },
  bannerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
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
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  readOnlyPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  readOnlyPillText: {
    fontSize: 11,
    color: '#475569',
    fontFamily: fonts.semiBold,
  },
  memberMetaText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: fonts.medium,
    marginBottom: 12,
  },
  taskItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  doneIcon: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  doneIconText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#15803D',
  },
  taskName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  taskOwner: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  taskCompletionDate: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#334155',
    marginBottom: 8,
  },
  openEvidenceBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  openEvidenceText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  evidenceDisclaimer: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: '#334155',
    marginBottom: 6,
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
  inputDisabled: {
    backgroundColor: '#F8FAFC',
    color: '#64748B',
  },
  localStatusRow: {
    marginTop: 8,
  },
  localStatusText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  actionButtonGroup: {
    marginTop: spacing.md,
    gap: 8,
  },
  saveReviewedBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  saveReviewedBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  cancelLocalBtn: {
    paddingVertical: 9,
    alignItems: 'center',
  },
  cancelLocalBtnText: {
    color: '#64748B',
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  guardNote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 10,
    lineHeight: 16,
  },
  nextStepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  nextStepTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  nextStepBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  nextStepBtn: {
    backgroundColor: '#0D9488',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  nextStepBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 13,
  },
});
