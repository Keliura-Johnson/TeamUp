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

export default function RequestRoleScreen() {
  const { projectId, roleId, status: initialStatus } = useLocalSearchParams();
  const {
    discoverProjects,
    activePersona,
    getActiveUserProfile,
    sendJoinRequest,
  } = useApp();

  const userProfile = getActiveUserProfile();

  // Find project and role
  const project =
    discoverProjects.find((p) => p.id === projectId) || discoverProjects[0];
  const role =
    project.roles.find((r) => r.id === roleId) ||
    (activePersona === 'John' ? project.roles[1] : project.roles[0]);

  // Demo controller state: 'send_form' | 'pending' | 'approved' | 'declined' | 'loading'
  const [activeState, setActiveState] = useState(
    initialStatus === 'pending'
      ? 'pending'
      : initialStatus === 'approved'
      ? 'approved'
      : initialStatus === 'declined'
      ? 'declined'
      : 'pending' // default to demonstrated pending state in walkthrough
  );

  const [isSending, setIsSending] = useState(false);

  const handleSendRequest = async () => {
    setIsSending(true);
    const res = await sendJoinRequest(role, project, userProfile);
    setIsSending(false);
    if (res.success) {
      setActiveState('pending');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="discover" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Companion State Demo Toolbar (for QA testing all S20 / S24 states) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'pending', label: 'S24.Pending (Awaiting approval)' },
              { id: 'approved', label: 'S24.Approved (Approved, not joined)' },
              { id: 'declined', label: 'S24.Declined (Request declined)' },
              { id: 'send_form', label: 'S20 (Before sending)' },
              { id: 'loading', label: 'S20.L (Sending request)' },
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

        {/* Back Link */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/project-details',
                params: { id: project.id },
              })
            }
          >
            <Text style={styles.backLink}>← Back to project details</Text>
          </TouchableOpacity>
        </View>

        {/* S20 BEFORE SENDING FORM */}
        {activeState === 'send_form' && (
          <View>
            <Text style={styles.mainTitle}>Request a role</Text>
            <Text style={styles.subText}>
              {project.title} · {role.title}
            </Text>

            {/* Role and expected contribution Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>
                Your role and expected contribution
              </Text>
              <Text style={styles.roleTitleLarge}>{role.title}</Text>
              <Text style={styles.roleRespText}>{role.responsibilities}</Text>

              <Text style={styles.sectionLabel}>Required skills</Text>
              <Text style={styles.bodyText}>{role.skills.join(' · ')}</Text>

              <Text style={styles.sectionLabel}>Expected contribution</Text>
              <Text style={styles.bodyText}>
                Responsive {role.title.toLowerCase()} artifacts with a documented build.
              </Text>

              <View style={styles.divider} />

              <Text style={styles.metaRowText}>
                <Text style={styles.boldText}>{role.hours} h / week</Text> · {project.duration}
              </Text>
              <Text style={styles.metaRowText}>
                Start: 19 Oct 2026 · End: 30 Nov 2026
              </Text>

              <Text style={styles.sectionLabel}>Availability expectations</Text>
              <Text style={styles.bodyText}>
                {project.availabilityExpectations}
              </Text>
            </View>

            {/* Planned milestones and deadlines */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Planned milestones and deadlines</Text>
              {project.milestones.map((m) => (
                <View key={m.id} style={styles.milestoneItemRow}>
                  <Text style={styles.milestoneItemName}>{m.name}</Text>
                  <Text style={styles.milestoneItemDate}>— {m.targetDate}</Text>
                </View>
              ))}

              <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
                Your planned task deadlines
              </Text>
              {role.deadlines?.map((d, idx) => (
                <View key={idx} style={styles.milestoneItemRow}>
                  <Text style={styles.milestoneItemName}>{d.name}</Text>
                  <Text style={styles.milestoneItemDate}>— {d.date}</Text>
                </View>
              ))}
            </View>

            {/* Before you send Card (S20) */}
            <View style={styles.beforeSendCard}>
              <Text style={styles.beforeSendHeading}>Before you send</Text>
              <Text style={styles.beforeSendRequirements}>
                Stated requirements met: {role.skills.join(', ')}, {role.hours} h / week for {project.duration}.
              </Text>
              <Text style={styles.beforeSendDisclaimer}>
                {project.owner.name} reviews your request. Joining requires approval and saved commitment acceptance.
              </Text>

              <Button
                title="Send request"
                loading={isSending}
                onPress={handleSendRequest}
                style={styles.sendRequestBtn}
              />
            </View>
          </View>
        )}

        {/* S20.L LOADING STATE */}
        {activeState === 'loading' && (
          <View style={styles.card}>
            <Text style={styles.loadingTitle}>Sending request...</Text>
            <Text style={styles.loadingDesc}>
              Submitting role request for {role.title} to {project.owner.name}...
            </Text>
          </View>
        )}

        {/* S24.PENDING / PENDING OWNER'S APPROVAL */}
        {activeState === 'pending' && (
          <View>
            <Text style={styles.mainTitle}>{project.title}</Text>
            <Text style={styles.subText}>
              A responsive marketplace prototype with sign-up, item browsing and a documented build.
            </Text>
            <Text style={styles.ownerMetaText}>
              Owner: {project.owner.name} · Open recruitment
            </Text>

            {/* Role details */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>
                Your role and expected contribution
              </Text>
              <Text style={styles.roleTitleLarge}>{role.title}</Text>
              <Text style={styles.roleRespText}>{role.responsibilities}</Text>

              <Text style={styles.sectionLabel}>Required skills</Text>
              <Text style={styles.bodyText}>{role.skills.join(' · ')}</Text>

              <Text style={styles.sectionLabel}>Expected contribution</Text>
              <Text style={styles.bodyText}>
                Responsive {role.title.toLowerCase()} artifacts with a documented build.
              </Text>

              <View style={styles.divider} />
              <Text style={styles.metaRowText}>
                <Text style={styles.boldText}>{role.hours} h / week</Text> · {project.duration}
              </Text>
              <Text style={styles.metaRowText}>
                Start: 19 Oct 2026 · End: 30 Nov 2026
              </Text>
            </View>

            {/* Milestones Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Planned milestones and deadlines</Text>
              {project.milestones.map((m) => (
                <View key={m.id} style={styles.milestoneItemRow}>
                  <Text style={styles.milestoneItemName}>{m.name}</Text>
                  <Text style={styles.milestoneItemDate}>— {m.targetDate}</Text>
                </View>
              ))}
            </View>

            {/* S24.Pending Status Alert Card (from frame_035) */}
            <View style={styles.pendingStatusCard}>
              <View style={styles.pendingAlertHeader}>
                <View style={styles.pendingDot} />
                <Text style={styles.pendingAlertTitle}>
                  {`Pending ${project.owner.name}'s approval`}
                </Text>
              </View>
              <Text style={styles.pendingAlertBody}>
                Request sent on 18 Oct 2026. You have not joined. Workspace access stays locked until approval and saved dated acceptance.
              </Text>

              <Button
                title="Back to My Projects"
                variant="outline"
                onPress={() => router.push('/myprojects')}
                style={styles.backProjectsBtn}
              />
            </View>
          </View>
        )}

        {/* S24.APPROVED / APPROVED — NOT JOINED */}
        {activeState === 'approved' && (
          <View>
            <Text style={styles.mainTitle}>{project.title}</Text>
            <Text style={styles.subText}>
              A responsive marketplace prototype with sign-up, item browsing and a documented build.
            </Text>

            {/* Role details */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>
                Your role and expected contribution
              </Text>
              <Text style={styles.roleTitleLarge}>{role.title}</Text>
              <Text style={styles.roleRespText}>{role.responsibilities}</Text>

              <View style={styles.divider} />
              <Text style={styles.metaRowText}>
                <Text style={styles.boldText}>{role.hours} h / week</Text> · {project.duration}
              </Text>
            </View>

            {/* Approved Status Alert Card (from frame_035) */}
            <View style={styles.approvedStatusCard}>
              <View style={styles.approvedAlertHeader}>
                <Text style={styles.approvedIconText}>✓</Text>
                <Text style={styles.approvedAlertTitle}>
                  Approved — not joined
                </Text>
              </View>
              <Text style={styles.approvedAlertBody}>
                Approved, not joined. Review and save commitment acceptance to gain workspace access.
              </Text>

              <Button
                title="Review commitment"
                onPress={() =>
                  router.push({
                    pathname: '/review-commitment',
                    params: {
                      projectId: project.id,
                      roleId: role.id,
                      origin: 'approved_request',
                    },
                  })
                }
                style={styles.reviewCommitmentBtn}
              />
            </View>
          </View>
        )}

        {/* S24.DECLINED / REQUEST DECLINED */}
        {activeState === 'declined' && (
          <View>
            <Text style={styles.mainTitle}>{project.title}</Text>
            <Text style={styles.subText}>
              A responsive marketplace prototype with sign-up, item browsing and a documented build.
            </Text>

            {/* Declined Alert Card (from frame_035) */}
            <View style={styles.declinedStatusCard}>
              <View style={styles.declinedAlertHeader}>
                <View style={styles.declinedDot} />
                <Text style={styles.declinedAlertTitle}>Request declined</Text>
              </View>
              <Text style={styles.declinedAlertBody}>
                Request declined. You have not joined. Discover another Open project.
              </Text>

              <Button
                title="Discover Projects"
                onPress={() => router.push('/discover-projects')}
                style={styles.discoverProjectsBtn}
              />
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
  topNavRow: {
    marginBottom: spacing.sm,
  },
  backLink: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
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
    marginBottom: spacing.xs,
  },
  ownerMetaText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSubtle,
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
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: 2,
  },
  bodyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 19,
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
  milestoneItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  milestoneItemName: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textHeading,
  },
  milestoneItemDate: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  beforeSendCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  beforeSendHeading: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.xs,
  },
  beforeSendRequirements: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.successText,
    marginBottom: spacing.xs,
  },
  beforeSendDisclaimer: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 17,
  },
  sendRequestBtn: {
    width: '100%',
  },
  pendingStatusCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  pendingAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  pendingAlertTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  pendingAlertBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  backProjectsBtn: {
    backgroundColor: colors.surface,
  },
  approvedStatusCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  approvedAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  approvedIconText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: '#16A34A',
    marginRight: spacing.sm,
  },
  approvedAlertTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: '#166534',
  },
  approvedAlertBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  reviewCommitmentBtn: {
    width: '100%',
  },
  declinedStatusCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.textMuted,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  declinedAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  declinedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    marginRight: spacing.sm,
  },
  declinedAlertTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  declinedAlertBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  discoverProjectsBtn: {
    width: '100%',
  },
  loadingTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  loadingDesc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
