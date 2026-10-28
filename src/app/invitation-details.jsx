import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function InvitationDetailsScreen() {
  const { view } = useLocalSearchParams();
  const {
    activePersona,
    invitations,
    declineInvitation,
    discoverProjects,
  } = useApp();

  const isOwnerPersona = activePersona === 'Ada';

  // Demo controller state: 'owner_sent' | 'recipient_pending' | 'recipient_declined' | 'error' | 'loading'
  const [activeState, setActiveState] = useState(
    view === 'owner' || isOwnerPersona ? 'owner_sent' : 'recipient_pending'
  );

  const [isProcessing, setIsProcessing] = useState(false);

  const invitation = invitations[0]; // David UI/UX Designer
  const project = discoverProjects[0]; // Campus Marketplace
  const role = project.roles[0]; // UI/UX Designer

  const handleDecline = async () => {
    setIsProcessing(true);
    const res = await declineInvitation(invitation.id);
    setIsProcessing(false);
    if (res.success) {
      setActiveState('recipient_declined');
    } else {
      setActiveState('error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="collaborators" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* State Demo Toolbar */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'owner_sent', label: 'Owner (Sent — pending response)' },
              { id: 'recipient_pending', label: 'Recipient (Review invitation)' },
              { id: 'recipient_declined', label: 'S24 (Invitation declined)' },
              { id: 'error', label: 'S21.X (Decline failure)' },
              { id: 'loading', label: 'S21.L (Loading invitation)' },
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

        {/* LOADING STATE (S21.L) */}
        {activeState === 'loading' ? (
          <View>
            <Text style={styles.mainTitle}>{project.title}</Text>
            <Text style={styles.subText}>
              Checking current invitation and role terms...
            </Text>

            <View style={styles.skeletonCard}>
              <View style={styles.skeletonLineLarge} />
              <View style={styles.skeletonLineMedium} />
              <View style={styles.skeletonLineSmall} />
            </View>

            <Button
              title="Loading invitation..."
              disabled={true}
              loading={true}
              style={styles.loadingBtn}
            />
          </View>
        ) : activeState === 'owner_sent' ? (
          /* OWNER SENT INVITATION VIEW (from frame_045) */
          <View>
            {/* Sub-navigation tabs (matching review-join-requests frame_100) */}
            <View style={styles.subTabsRow}>
              <TouchableOpacity
                style={styles.subTab}
                onPress={() => router.push('/review-join-requests')}
              >
                <Text style={styles.subTabText}>Join requests · 1 pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, styles.subTabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.subTabText, styles.subTabTextActive]}>
                  Sent invitations
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subTab}
                onPress={() => router.push('/find-collaborators')}
              >
                <Text style={styles.subTabText}>Find Collaborators</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.mainTitle}>Sent invitation</Text>
            <Text style={styles.subText}>
              {project.title} · Ada / Owner
            </Text>

            {/* Purple pending response banner */}
            <View style={styles.ownerSentNoticeBox}>
              <Text style={styles.ownerSentNoticeTitle}>
                Invitation sent — pending response
              </Text>
              <Text style={styles.ownerSentNoticeBody}>
                Sent 18 Oct 2026. David joins only after reviewing and saving dated commitment acceptance.
              </Text>
            </View>

            {/* Recipient status row */}
            <View style={styles.recipientStatusRow}>
              <View style={styles.avatarD}>
                <Text style={styles.avatarDText}>D</Text>
              </View>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>David · UI/UX Designer</Text>
                <Text style={styles.recipientStatus}>
                  Pending recipient response
                </Text>
              </View>
            </View>

            {/* Project Summary Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>{project.title}</Text>
              <Text style={styles.cardSub}>
                {project.projectType} · Open for recruitment
              </Text>

              <Text style={styles.fieldLabel}>Problem</Text>
              <Text style={styles.fieldBody}>{project.problem}</Text>

              <Text style={styles.fieldLabel}>Description</Text>
              <Text style={styles.fieldBody}>{project.description}</Text>

              <Text style={styles.fieldLabel}>Expected outcome</Text>
              <Text style={styles.fieldBody}>{project.expectedOutcome}</Text>

              <Text style={styles.fieldLabel}>Project skills</Text>
              <Text style={styles.skillsHighlightText}>
                {project.roles.flatMap((r) => r.skills).join(' · ')}
              </Text>
            </View>

            {/* Action Buttons */}
            <Button
              title="Back to Find Collaborators"
              variant="outline"
              onPress={() => router.push('/find-collaborators')}
              style={styles.backBtn}
            />
          </View>
        ) : activeState === 'recipient_declined' ? (
          /* RECIPIENT DECLINED VIEW (from frame_045) */
          <View>
            <Text style={styles.mainTitle}>Invitation details</Text>
            <Text style={styles.subText}>
              {project.title} · David / Recipient
            </Text>

            {/* Saved decline banner */}
            <View style={styles.declinedNoticeBox}>
              <Text style={styles.declinedNoticeTitle}>
                Invitation declined
              </Text>
              <Text style={styles.declinedNoticeBody}>
                Your decline is saved. You have not joined {project.title}.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeading}>{project.title}</Text>
              <Text style={styles.fieldBody}>{project.description}</Text>
            </View>

            <Button
              title="Discover Projects"
              onPress={() => router.push('/discover-projects')}
              style={styles.discoverBtn}
            />
          </View>
        ) : (
          /* RECIPIENT PENDING / ERROR VIEW */
          <View>
            <Text style={styles.mainTitle}>Invitation details</Text>
            <Text style={styles.subText}>
              {project.title} · David / Recipient
            </Text>

            {activeState === 'error' ? (
              <View style={styles.errorNoticeBox}>
                <Text style={styles.errorNoticeTitle}>
                  Decline could not save
                </Text>
                <Text style={styles.errorNoticeBody}>
                  Your invitation remains pending. No membership was created. Recheck its current status before retrying.
                </Text>
              </View>
            ) : (
              <View style={styles.pendingInfoBanner}>
                <Text style={styles.pendingInfoTitle}>
                  Review before joining
                </Text>
                <Text style={styles.pendingInfoBody}>
                  Membership begins only after dated acceptance is saved.
                </Text>
              </View>
            )}

            {/* Project Overview Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>{project.title}</Text>
              <Text style={styles.cardSub}>
                {project.projectType} · Open for recruitment
              </Text>

              <Text style={styles.fieldLabel}>Problem</Text>
              <Text style={styles.fieldBody}>{project.problem}</Text>

              <Text style={styles.fieldLabel}>Description</Text>
              <Text style={styles.fieldBody}>{project.description}</Text>

              <Text style={styles.fieldLabel}>Expected outcome</Text>
              <Text style={styles.fieldBody}>{project.expectedOutcome}</Text>
            </View>

            {/* Your role and expected contribution */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>
                Your role and expected contribution
              </Text>
              <Text style={styles.roleTitleLarge}>{role.title}</Text>
              <Text style={styles.roleResp}>{role.responsibilities}</Text>

              <Text style={styles.fieldLabel}>Required skills</Text>
              <Text style={styles.fieldBody}>{role.skills.join(' · ')}</Text>

              <Text style={styles.fieldLabel}>Expected contribution</Text>
              <Text style={styles.fieldBody}>
                Onboarding designs, a sign-up prototype and a UI handoff.
              </Text>

              <View style={styles.divider} />

              <Text style={styles.metaRowText}>
                <Text style={styles.boldText}>{role.hours} h / week</Text> · {project.duration}
              </Text>
              <Text style={styles.metaRowText}>
                Start: 19 Oct 2026 · End: 30 Nov 2026
              </Text>

              <Text style={styles.fieldLabel}>Availability expectations</Text>
              <Text style={styles.fieldBody}>
                {project.availabilityExpectations}
              </Text>
            </View>

            {/* Planned milestones & deadlines */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Planned milestones and deadlines</Text>
              {project.milestones.map((m) => (
                <View key={m.id} style={styles.milestoneRow}>
                  <Text style={styles.milestoneName}>{m.name}</Text>
                  <Text style={styles.milestoneDate}>— {m.targetDate}</Text>
                </View>
              ))}

              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>
                Your planned task deadlines
              </Text>
              {role.deadlines?.map((d, idx) => (
                <View key={idx} style={styles.milestoneRow}>
                  <Text style={styles.milestoneName}>{d.name}</Text>
                  <Text style={styles.milestoneDate}>— {d.date}</Text>
                </View>
              ))}
            </View>

            {/* Team agreements */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Team agreements</Text>
              {project.workingExpectations?.map((exp, idx) => (
                <View key={idx} style={styles.agreementRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.agreementText}>{exp}</Text>
                </View>
              ))}
            </View>

            {/* Actions Card */}
            <View style={styles.actionCard}>
              {activeState === 'error' ? (
                <Button
                  title="Recheck invitation status"
                  onPress={() => setActiveState('recipient_pending')}
                  style={[styles.primaryActionBtn, { marginBottom: spacing.sm }]}
                />
              ) : (
                <Button
                  title="Review commitment"
                  onPress={() =>
                    router.push({
                      pathname: '/review-commitment',
                      params: {
                        projectId: project.id,
                        roleId: role.id,
                        invitationId: invitation.id,
                      },
                    })
                  }
                  style={[styles.primaryActionBtn, { marginBottom: spacing.sm }]}
                />
              )}

              <Button
                title="Decline invitation"
                variant="outline"
                loading={isProcessing}
                onPress={handleDecline}
                style={styles.declineBtn}
              />

              <Text style={styles.actionNote}>
                Joining requires saved, dated acceptance.
              </Text>
            </View>
          </View>
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
  mainTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  subText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  ownerSentNoticeBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  ownerSentNoticeTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  ownerSentNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  declinedNoticeBox: {
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 4,
    borderLeftColor: colors.textMuted,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  declinedNoticeTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  declinedNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  errorNoticeBox: {
    backgroundColor: colors.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.errorBorder,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  errorNoticeTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.errorText,
    marginBottom: 4,
  },
  errorNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.errorSubtext,
    lineHeight: 18,
  },
  pendingInfoBanner: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  pendingInfoTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  pendingInfoBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    lineHeight: 17,
  },
  recipientStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  avatarD: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarDText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#0284C7',
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  recipientStatus: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardHeading: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: 2,
  },
  fieldBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 19,
  },
  skillsHighlightText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  roleTitleLarge: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  roleResp: {
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
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  milestoneName: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textHeading,
  },
  milestoneDate: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs + 2,
  },
  bullet: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.primary,
    marginRight: spacing.sm,
    lineHeight: 18,
  },
  agreementText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  primaryActionBtn: {
    width: '100%',
  },
  declineBtn: {
    width: '100%',
    borderColor: '#991B1B',
  },
  actionNote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSubtle,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  backBtn: {
    width: '100%',
  },
  discoverBtn: {
    width: '100%',
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  skeletonLineLarge: {
    height: 24,
    width: '70%',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  skeletonLineMedium: {
    height: 16,
    width: '90%',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  skeletonLineSmall: {
    height: 16,
    width: '50%',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
  },
  loadingBtn: {
    width: '100%',
  },
});
