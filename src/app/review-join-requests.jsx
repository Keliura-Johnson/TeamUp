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
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function ReviewJoinRequestsScreen() {
  const {
    activePersona,
    joinRequests,
    respondToJoinRequest,
    discoverProjects,
  } = useApp();

  const isOwner = activePersona === 'Ada';

  // Demo controller state: 'pending' | 'approved' | 'declined' | 'empty' | 'saving' | 'error' | 'guard'
  const [activeState, setActiveState] = useState('pending');
  const [isProcessing, setIsProcessing] = useState(false);

  const project = discoverProjects[0]; // Campus Marketplace
  const currentRequest = joinRequests[0]; // John - Frontend Developer

  const handleDecision = async (decision) => {
    setIsProcessing(true);
    setActiveState('saving');
    const res = await respondToJoinRequest(currentRequest.id, decision);
    setIsProcessing(false);
    if (res.success) {
      setActiveState(decision === 'Approved' ? 'approved' : 'declined');
    } else {
      setActiveState('error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="joinrequests" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* State Demo Toolbar for Figma Walkthrough Testing */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'pending', label: 'Default (Pending decision)' },
              { id: 'approved', label: 'S50.S (Approved, awaiting commitment)' },
              { id: 'declined', label: 'S50.Declined (Saved decline)' },
              { id: 'empty', label: 'S50.E (No pending requests)' },
              { id: 'saving', label: 'S50.L (Decision saving)' },
              { id: 'error', label: 'S50.X (Decision failure)' },
              { id: 'guard', label: 'S50.Guard (Owner guard)' },
            ].map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => setActiveState(st.id)}
                style={[
                  styles.demoTab,
                  activeState === st.id && styles.demoTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.demoTabText,
                    activeState === st.id && styles.demoTabTextActive,
                  ]}
                >
                  {st.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Persona Switcher Bar */}
        <PersonaSwitcher />

        {/* Sub-navigation tabs (as seen in frame_100) */}
        <View style={styles.subTabsRow}>
          <TouchableOpacity
            style={[styles.subTab, styles.subTabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.subTabText, styles.subTabTextActive]}>
              Join requests · 1 pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subTab}
            onPress={() =>
              router.push({
                pathname: '/invitation-details',
                params: { view: 'owner' },
              })
            }
          >
            <Text style={styles.subTabText}>Sent invitations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subTab}
            onPress={() => router.push('/find-collaborators')}
          >
            <Text style={styles.subTabText}>Find Collaborators</Text>
          </TouchableOpacity>
        </View>

        {/* S50.GUARD VIEW (Non-owner view) */}
        {(!isOwner || activeState === 'guard') && (
          <View style={styles.guardCard}>
            <View style={styles.guardHeader}>
              <Text style={styles.guardIcon}>!</Text>
              <Text style={styles.guardTitle}>
                This review is for the project Owner
              </Text>
            </View>
            <Text style={styles.guardBody}>
              Owner access required. You cannot view private requests or make decisions. Return to My Projects.
            </Text>
            <Button
              title="Return to My Projects"
              variant="outline"
              onPress={() => router.push('/myprojects')}
              style={styles.guardBtn}
            />
          </View>
        )}

        {/* OWNER VIEW */}
        {isOwner && activeState !== 'guard' && (
          <>
            {/* S50.E NO PENDING REQUESTS */}
            {activeState === 'empty' ? (
              <View style={styles.card}>
                <Text style={styles.projectContextTitle}>
                  {project.title}
                </Text>
                <View style={styles.trayIcon}>
                  <Text style={styles.trayIconText}>📋</Text>
                </View>
                <Text style={styles.emptyTitle}>No pending requests</Text>
                <Text style={styles.emptySubtitle}>
                  Find eligible collaborators for a specific open role. Existing invitations do not create membership.
                </Text>
                <Button
                  title="Find Collaborators"
                  onPress={() => router.push('/find-collaborators')}
                  style={styles.findCollaboratorsBtn}
                />
              </View>
            ) : activeState === 'approved' ? (
              /* S50.S APPROVED SPECIMEN */
              <View>
                <Text style={styles.screenHeading}>John&apos;s request</Text>

                <View style={styles.approvedBannerBox}>
                  <View style={styles.approvedBannerHeader}>
                    <Text style={styles.checkIconText}>✓</Text>
                    <Text style={styles.approvedBannerTitle}>
                      Request approved
                    </Text>
                  </View>
                  <Text style={styles.approvedBannerBody}>
                    Awaiting commitment. John must review and save acceptance to join.
                  </Text>
                </View>

                <View style={styles.applicantMiniCard}>
                  <View style={styles.miniAvatarJ}>
                    <Text style={styles.miniAvatarJText}>J</Text>
                  </View>
                  <View style={styles.miniInfo}>
                    <Text style={styles.miniName}>John · Frontend Developer</Text>
                    <Text style={styles.miniMeta}>
                      8 h / week · 6 weeks · Campus Marketplace
                    </Text>
                  </View>
                </View>

                <Button
                  title="Back to join requests"
                  variant="outline"
                  onPress={() => setActiveState('empty')}
                  style={styles.backBtn}
                />
              </View>
            ) : activeState === 'declined' ? (
              /* S50.DECLINED SAVED DECISION */
              <View>
                <Text style={styles.screenHeading}>John&apos;s request</Text>

                <View style={styles.declinedBannerBox}>
                  <Text style={styles.declinedBannerTitle}>
                    Request declined
                  </Text>
                  <Text style={styles.declinedBannerBody}>
                    Your decision is saved. John has not joined and cannot access the workspace.
                  </Text>
                </View>

                <View style={styles.applicantMiniCard}>
                  <View style={styles.miniAvatarJ}>
                    <Text style={styles.miniAvatarJText}>J</Text>
                  </View>
                  <View style={styles.miniInfo}>
                    <Text style={styles.miniName}>John · Frontend Developer</Text>
                    <Text style={styles.miniMeta}>Campus Marketplace</Text>
                  </View>
                </View>

                <Button
                  title="Find Collaborators"
                  onPress={() => router.push('/find-collaborators')}
                  style={styles.findCollaboratorsBtn}
                />
              </View>
            ) : (
              /* PENDING / SAVING / ERROR VIEW */
              <View>
                {/* Owner authority banner */}
                <View style={styles.ownerNoticeBox}>
                  <Text style={styles.ownerNoticeTitle}>Only Ada can decide</Text>
                  <Text style={styles.ownerNoticeBody}>
                    Check John&apos;s availability against current requirements. Owner-only view; applicants have no workspace access.
                  </Text>
                </View>

                {activeState === 'error' && (
                  <View style={styles.errorBannerBox}>
                    <Text style={styles.errorBannerTitle}>
                      Decision could not save
                    </Text>
                    <Text style={styles.errorBannerBody}>
                      John remains pending and has no workspace access. The request and role context are retained.
                    </Text>
                  </View>
                )}

                {/* S50.L Decision Saving State */}
                {activeState === 'saving' && (
                  <View style={styles.savingBannerBox}>
                    <Text style={styles.savingBannerTitle}>
                      Saving Owner decision...
                    </Text>
                    <Text style={styles.savingBannerBody}>
                      John has no access while this saves. Do not submit another decision.
                    </Text>
                  </View>
                )}

                {/* Applicant Card */}
                <View style={styles.card}>
                  <Text style={styles.applicantCardTitle}>John&apos;s request</Text>

                  <View style={styles.applicantHeaderRow}>
                    <View style={styles.miniAvatarJ}>
                      <Text style={styles.miniAvatarJText}>J</Text>
                    </View>
                    <View style={styles.miniInfo}>
                      <Text style={styles.applicantName}>
                        John · Frontend Developer
                      </Text>
                      <Text style={styles.applicantStatusDate}>
                        Pending · Received 18 Oct 2026
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.fieldHeading}>
                    Self-reported skills and availability
                  </Text>
                  <Text style={styles.boldDetailText}>
                    Frontend development · React
                  </Text>
                  <Text style={styles.detailText}>
                    8 h / week · 6 weeks
                  </Text>

                  <Text style={styles.fieldHeading}>Goal</Text>
                  <Text style={styles.detailText}>
                    Build responsive interfaces and practice working in a small team.
                  </Text>

                  <Text style={styles.contactDisclaimer}>
                    Contact hidden until joining; Owner approval alone is not membership.
                  </Text>
                </View>

                {/* Role and Expected Contribution Card */}
                <View style={styles.card}>
                  <Text style={styles.cardHeading}>
                    Your role and expected contribution
                  </Text>
                  <Text style={styles.roleTitleLarge}>Frontend Developer</Text>
                  <Text style={styles.roleRespText}>
                    Implement authentication screens and marketplace discovery.
                  </Text>

                  <Text style={styles.fieldHeading}>Required skills</Text>
                  <Text style={styles.detailText}>
                    Frontend development · React
                  </Text>

                  <Text style={styles.fieldHeading}>Expected contribution</Text>
                  <Text style={styles.detailText}>
                    Responsive authentication screens and marketplace discovery, with a documented build.
                  </Text>

                  <View style={styles.divider} />

                  <Text style={styles.metaRowText}>
                    <Text style={styles.boldText}>8 h / week</Text> · 6 weeks
                  </Text>
                  <Text style={styles.metaRowText}>
                    Start: 19 Oct 2026 · End: 30 Nov 2026
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.actionCard}>
                  {activeState === 'error' && (
                    <Button
                      title="Recheck current request"
                      onPress={() => setActiveState('pending')}
                      style={[styles.actionBtn, { marginBottom: spacing.sm }]}
                    />
                  )}

                  <Button
                    title="Approve request"
                    loading={activeState === 'saving' || isProcessing}
                    disabled={activeState === 'saving' || isProcessing}
                    onPress={() => handleDecision('Approved')}
                    style={[styles.actionBtn, { marginBottom: spacing.sm }]}
                  />

                  <Button
                    title="Decline request"
                    variant="outline"
                    disabled={activeState === 'saving' || isProcessing}
                    onPress={() => handleDecision('Declined')}
                    style={[styles.declineBtn, { marginBottom: spacing.sm }]}
                  />

                  <Text style={styles.actionHelperText}>
                    Owner approval alone is not membership.
                  </Text>
                </View>
              </View>
            )}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl * 2,
  },
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  demoLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  demoScroll: {
    gap: spacing.xs,
  },
  demoTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  demoTabActive: {
    backgroundColor: colors.primary,
  },
  demoTabText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textBody,
  },
  demoTabTextActive: {
    color: colors.textWhite,
    fontFamily: fonts.bold,
  },
  personaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  personaLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
  },
  personaBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  personaBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  personaBtnText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textBody,
  },
  personaBtnTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  subTabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
    marginBottom: spacing.lg,
  },
  subTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  subTabActive: {
    backgroundColor: colors.primaryLight,
  },
  subTabText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    textAlign: 'center',
  },
  subTabTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  ownerNoticeBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  ownerNoticeTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  ownerNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    lineHeight: 17,
  },
  errorBannerBox: {
    backgroundColor: colors.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.errorBorder,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  errorBannerTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.errorText,
    marginBottom: 2,
  },
  errorBannerBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.errorSubtext,
    lineHeight: 17,
  },
  savingBannerBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  savingBannerTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  savingBannerBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    lineHeight: 17,
  },
  approvedBannerBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  approvedBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkIconText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#16A34A',
    marginRight: spacing.sm,
  },
  approvedBannerTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: '#166534',
  },
  approvedBannerBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  declinedBannerBox: {
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 4,
    borderLeftColor: colors.textMuted,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  declinedBannerTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  declinedBannerBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  screenHeading: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  applicantCardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  applicantHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  miniAvatarJ: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  miniAvatarJText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#0D9488',
  },
  miniInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  applicantStatusDate: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  fieldHeading: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: 2,
  },
  boldDetailText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  detailText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  contactDisclaimer: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSubtle,
    fontStyle: 'italic',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardHeading: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  roleTitleLarge: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  roleRespText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  metaRowText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    marginBottom: 4,
  },
  boldText: {
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    width: '100%',
  },
  declineBtn: {
    width: '100%',
    borderColor: '#991B1B',
  },
  actionHelperText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSubtle,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  applicantMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  miniName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  miniMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  backBtn: {
    width: '100%',
  },
  findCollaboratorsBtn: {
    width: '100%',
  },
  projectContextTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  trayIcon: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  trayIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  guardCard: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: colors.errorBorder,
    padding: spacing.xl,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  guardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  guardIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.errorText,
    marginRight: spacing.sm,
  },
  guardTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.errorText,
  },
  guardBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.errorSubtext,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  guardBtn: {
    width: 200,
    backgroundColor: colors.surface,
  },
});
