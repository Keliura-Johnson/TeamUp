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

export default function TeammateConfirmationScreen() {
  const {
    activePersona,
    setActivePersona,
    completionState,
    confirmMemberContribution,
    returnWordingFeedback,
  } = useApp();

  const isJohn = String(activePersona).toLowerCase() === 'john';
  const isDavid = String(activePersona).toLowerCase() === 'david';
  const isOwner = String(activePersona).toLowerCase() === 'ada';

  const davidSummary = completionState.memberSummaries.david;
  const isDavidConfirmed = davidSummary?.isConfirmed;
  const isDavidReviewed = davidSummary?.reviewStatus === 'Reviewed';

  const [isConfirming, setIsConfirming] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnFeedbackText, setReturnFeedbackText] = useState(
    'Please clarify the handoff context in your wording.'
  );

  const handleConfirmDavid = async () => {
    if (!isDavidReviewed) {
      Alert.alert(
        'Prerequisite Missing',
        'David must save his summary as Reviewed before you can confirm his contribution.'
      );
      return;
    }
    setIsConfirming(true);
    const res = await confirmMemberContribution('John', 'david');
    setIsConfirming(false);
    if (res.success) {
      Alert.alert(
        'Contribution Confirmed',
        'You have confirmed David’s contribution summary. All 3 member confirmations are now saved!'
      );
    } else {
      Alert.alert('Error', res.error || 'Failed to confirm contribution.');
    }
  };

  const handleSendReturnFeedback = async () => {
    if (!returnFeedbackText.trim()) {
      Alert.alert('Required', 'Please enter feedback text.');
      return;
    }
    const res = await returnWordingFeedback('John', 'david', returnFeedbackText);
    setShowReturnModal(false);
    if (res.success) {
      Alert.alert(
        'Feedback Sent',
        'Wording feedback has been returned to David. His summary remains Awaiting John.'
      );
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
          <TouchableOpacity onPress={() => router.push('/project-completion')}>
            <Text style={styles.breadcrumbLink}>Campus Marketplace</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>/</Text>
          <Text style={styles.breadcrumbCurrent}>{"Review David's contribution"}</Text>
        </View>

        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>
            In Progress · {activePersona} ·{' '}
            {isJohn ? 'Peer reviewer' : isOwner ? 'Owner' : 'Member'}
          </Text>
          <View style={styles.sectionTagRow}>
            <Text style={styles.sectionTagLabel}>Project section:</Text>
            <View style={styles.sectionTagBadge}>
              <Text style={styles.sectionTagText}>Contributions</Text>
            </View>
          </View>
          <Text style={styles.pageHeading}>{"Review David's contribution"}</Text>
          <Text style={styles.datesMeta}>30 Nov 2026 · 19 Oct–30 Nov · 6 weeks</Text>
        </View>

        {/* Self Confirmation Guard Notice if David is active */}
        {isDavid && (
          <View style={styles.selfGuardCard}>
            <Text style={styles.selfGuardTitle}>You cannot confirm yourself</Text>
            <Text style={styles.selfGuardBody}>
              {"David's summary requires another teammate's confirmation (John). Switch to John's perspective to perform the peer confirmation."}
            </Text>
            <TouchableOpacity
              style={styles.switchJohnBtn}
              onPress={() => setActivePersona('John')}
            >
              <Text style={styles.switchJohnBtnText}>Switch to John (Peer Reviewer)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status Banner */}
        <View
          style={[
            styles.banner,
            isDavidConfirmed
              ? styles.bannerConfirmed
              : isDavidReviewed
              ? styles.bannerReviewed
              : styles.bannerUnreviewed,
          ]}
        >
          <Text
            style={[
              styles.bannerTitle,
              isDavidConfirmed
                ? styles.bannerTitleConfirmed
                : isDavidReviewed
                ? styles.bannerTitleReviewed
                : styles.bannerTitleUnreviewed,
            ]}
          >
            {isDavidConfirmed
              ? 'Confirmed by John · 30 Nov 2026'
              : isDavidReviewed
              ? "David's own review is saved"
              : "David's summary is Unreviewed"}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {isDavidConfirmed
              ? 'Teammate confirmation of contribution wording; not a verified impact claim. All 3 members confirmed!'
              : isDavidReviewed
              ? "Reviewed · Awaiting John. Compare David's summary with saved task evidence."
              : 'David needs to Save Reviewed before you can confirm his contribution.'}
          </Text>
        </View>

        {/* David's Summary Card */}
        <View style={styles.card}>
          <View style={styles.memberAvatarRow}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>D</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>David</Text>
              <Text style={styles.memberRole}>UI/UX Designer</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>
                {isDavidConfirmed
                  ? 'Confirmed'
                  : isDavidReviewed
                  ? 'Reviewed · Awaiting John'
                  : 'Unreviewed'}
              </Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          <Text style={styles.contentLabel}>{"David's wording:"}</Text>
          <View style={styles.wordingBox}>
            <Text style={styles.wordingText}>
              {davidSummary?.wording || 'Designed onboarding and prepared the UI handoff.'}
            </Text>
          </View>

          <Text style={[styles.contentLabel, { marginTop: 10 }]}>{"David's note:"}</Text>
          <View style={styles.wordingBox}>
            <Text style={styles.wordingText}>
              {davidSummary?.note ||
                'Documented the final sign-up fields and shared handoff context with John.'}
            </Text>
          </View>

          <View style={styles.evidenceFileRow}>
            <Text style={styles.evidenceFileIcon}>📄</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.evidenceFileName}>ui-handoff.pdf</Text>
              <Text style={styles.evidenceFileMeta}>File reference · not uploaded</Text>
            </View>
            <TouchableOpacity
              style={styles.openEvidenceLink}
              onPress={() =>
                Alert.alert('Evidence', 'Viewing file reference: ui-handoff.pdf')
              }
            >
              <Text style={styles.openEvidenceLinkText}>Open</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardDisclaimer}>
            Own review and teammate confirmation are separate.
          </Text>
        </View>

        {/* Confirmation Actions Block */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{"John's confirmation"}</Text>
          <Text style={styles.confirmInstruction}>
            {"Confirm David's summary matches these two Done tasks."}
          </Text>

          {isDavidConfirmed ? (
            <View style={styles.alreadyConfirmedBox}>
              <Text style={styles.alreadyConfirmedText}>
                {"✓ You have confirmed David's contribution summary."}
              </Text>
              <TouchableOpacity
                style={styles.goToCompletionBtn}
                onPress={() => router.push('/project-completion')}
              >
                <Text style={styles.goToCompletionBtnText}>
                  Go to Project Completion (Owner Ada) →
                </Text>
              </TouchableOpacity>
            </View>
          ) : isJohn ? (
            <View style={styles.actionGroup}>
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  (!isDavidReviewed || isConfirming) && styles.btnDisabled,
                ]}
                onPress={handleConfirmDavid}
                disabled={!isDavidReviewed || isConfirming}
              >
                <Text style={styles.confirmBtnText}>
                  {isConfirming
                    ? 'Confirming David...'
                    : "Confirm David's contribution"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.returnWordingBtn}
                onPress={() => setShowReturnModal(true)}
              >
                <Text style={styles.returnWordingBtnText}>Return wording</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelLink}
                onPress={() => router.push('/project-completion')}
              >
                <Text style={styles.cancelLinkText}>Cancel</Text>
              </TouchableOpacity>

              <Text style={styles.actionFootnote}>
                David remains Awaiting John until confirmation saves. Current project
                gate: 2/3 confirmed.
              </Text>
            </View>
          ) : (
            <View style={styles.nonJohnCard}>
              <Text style={styles.nonJohnText}>
                {"Switch persona to John to confirm David's contribution."}
              </Text>
              <TouchableOpacity
                style={styles.switchJohnPill}
                onPress={() => setActivePersona('John')}
              >
                <Text style={styles.switchJohnPillText}>Switch to John</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Return Wording Modal */}
      {showReturnModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{"Return David's wording?"}</Text>
            <Text style={styles.modalSubtitle}>
              Returning feedback does not confirm David or change completion eligibility.
            </Text>

            <Text style={styles.modalFieldLabel}>Feedback for David</Text>
            <TextInput
              style={styles.modalTextArea}
              value={returnFeedbackText}
              onChangeText={setReturnFeedbackText}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowReturnModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSendReturnFeedback}
              >
                <Text style={styles.modalSubmitText}>Return wording</Text>
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
  selfGuardCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  selfGuardTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#991B1B',
    marginBottom: 4,
  },
  selfGuardBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 17,
    marginBottom: 10,
  },
  switchJohnBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  switchJohnBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 12,
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
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 6,
  },
  memberAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#0284C7',
  },
  memberName: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  memberRole: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
  },
  statusPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#475569',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  contentLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: '#475569',
    marginBottom: 4,
  },
  wordingBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.sm,
    padding: 10,
    marginBottom: 6,
  },
  wordingText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
  },
  evidenceFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  evidenceFileIcon: {
    fontFamily: fonts.regular,
    fontSize: 16,
    marginRight: 8,
  },
  evidenceFileName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  evidenceFileMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  openEvidenceLink: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  openEvidenceLinkText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  cardDisclaimer: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 8,
  },
  confirmInstruction: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 18,
  },
  actionGroup: {
    gap: 8,
  },
  confirmBtn: {
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  returnWordingBtn: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  returnWordingBtnText: {
    color: '#334155',
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  cancelLink: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelLinkText: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  actionFootnote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 4,
  },
  alreadyConfirmedBox: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    gap: 10,
  },
  alreadyConfirmedText: {
    fontSize: 13,
    color: '#065F46',
    fontFamily: fonts.bold,
  },
  goToCompletionBtn: {
    backgroundColor: '#15803D',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
  },
  goToCompletionBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  nonJohnCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 8,
  },
  nonJohnText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
  },
  switchJohnPill: {
    backgroundColor: '#0D9488',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.full,
  },
  switchJohnPillText: {
    color: '#FFFFFF',
    fontSize: 12,
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
    marginBottom: 4,
  },
  modalSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  modalFieldLabel: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: '#334155',
    marginBottom: 6,
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: fonts.regular,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  modalActionsRow: {
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
