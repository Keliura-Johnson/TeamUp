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
import Checkbox from '../components/Checkbox';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function ReviewCommitmentScreen() {
  const { projectId, roleId, invitationId, origin } = useLocalSearchParams();
  const {
    activePersona,
    discoverProjects,
    acceptCommitment,
    declineInvitation,
  } = useApp();

  // Find project and role
  const project =
    discoverProjects.find((p) => p.id === projectId) || discoverProjects[0];

  const currentRole =
    project.roles.find((r) => r.id === roleId) ||
    (activePersona === 'John' ? project.roles[1] : project.roles[0]);

  const activeUser =
    activePersona === 'John'
      ? { name: 'John', role: 'Frontend Developer', hours: '8', originText: 'Approved request' }
      : { name: 'David', role: 'UI/UX Designer', hours: '6', originText: 'Invitation from Ada' };

  // Demo controller state: 'unchecked' | 'checked' | 'saving' | 'accepted' | 'error' | 'unavailable'
  const [activeState, setActiveState] = useState('unchecked');
  const [isAcceptedLocally, setIsAcceptedLocally] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (checked) => {
    setIsAcceptedLocally(checked);
    if (activeState === 'unchecked' && checked) {
      setActiveState('checked');
    } else if (activeState === 'checked' && !checked) {
      setActiveState('unchecked');
    }
  };

  const handleAcceptAndJoin = async () => {
    setIsSubmitting(true);
    setActiveState('saving');
    const commitmentData = {
      projectId: project.id,
      projectTitle: project.title,
      roleId: currentRole.id,
      roleTitle: currentRole.title,
      invitationId: invitationId || 'inv-david-designer',
      user: activeUser,
    };
    const res = await acceptCommitment(commitmentData);
    setIsSubmitting(false);
    if (res.success) {
      setActiveState('accepted');
    } else {
      setActiveState('error');
    }
  };

  const handleDecline = async () => {
    if (invitationId) {
      await declineInvitation(invitationId);
    }
    router.push('/discover-projects');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="collaborators" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Companion State Demo Toolbar (for QA testing all S22/S23 states) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'unchecked', label: 'Default (Unchecked)' },
              { id: 'checked', label: 'Checked (Ready to save)' },
              { id: 'saving', label: 'S22.L (Saving acceptance)' },
              { id: 'accepted', label: 'S22.S (Accepted · Workspace unlocked)' },
              { id: 'error', label: 'S22.X (Save failure)' },
              { id: 'unavailable', label: 'Role unavailable' },
            ].map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => {
                  setActiveState(st.id);
                  if (st.id === 'checked') setIsAcceptedLocally(true);
                  if (st.id === 'unchecked') setIsAcceptedLocally(false);
                }}
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

        {/* Screen Title & Subtitle */}
        <Text style={styles.mainTitle}>Review your commitment</Text>
        <Text style={styles.subText}>
          {project.title} · {activeUser.name} / {origin === 'approved_request' ? 'Approved request' : activeUser.originText}
        </Text>

        {/* S22.S SUCCESS ACCEPTED VIEW */}
        {activeState === 'accepted' ? (
          <View>
            <View style={styles.acceptedSuccessBox}>
              <View style={styles.acceptedSuccessHeader}>
                <Text style={styles.successIcon}>✓</Text>
                <Text style={styles.acceptedSuccessTitle}>
                  Accepted 19 Oct 2026 · 09:40
                </Text>
              </View>
              <Text style={styles.acceptedSuccessBody}>
                Accepted by {activeUser.name} · {currentRole.title}.
              </Text>
              <Text style={styles.acceptedSuccessSub}>
                Joined. Workspace access unlocked. You can now access project tasks and collaborate with your team.
              </Text>
            </View>

            {/* Role & Workspace Ready Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Joined project workspace</Text>
              <Text style={styles.projectContextTitle}>{project.title}</Text>
              <Text style={styles.roleTitleLarge}>{currentRole.title}</Text>
              <Text style={styles.bodyText}>
                {currentRole.responsibilities}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.metaRowText}>
                <Text style={styles.boldText}>{currentRole.hours} h / week</Text> · {project.duration}
              </Text>
              <Text style={styles.metaRowText}>
                Planned dates: {project.plannedDates}
              </Text>
            </View>

            <Button
              title="Open workspace"
              onPress={() => router.push('/workspace')}
              style={styles.openWorkspaceBtn}
            />
          </View>
        ) : (
          /* UNCHECKED / CHECKED / SAVING / ERROR / UNAVAILABLE VIEW */
          <View>
            {/* PRD explicit commitment gate banner */}
            <View style={styles.preJoinNoticeBox}>
              <Text style={styles.preJoinNoticeTitle}>Review before joining</Text>
              <Text style={styles.preJoinNoticeBody}>
                Membership begins only after dated acceptance is saved.
              </Text>
            </View>

            {/* 1. The Shared Outcome Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>The shared outcome</Text>
              <Text style={styles.outcomeDescription}>
                {project.expectedOutcome}
              </Text>
              <Text style={styles.outcomeMeta}>
                Owner: {project.owner.name} / {project.owner.role} · {project.projectType}
              </Text>
            </View>

            {/* 2. Your role and expected contribution Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>
                Your role and expected contribution
              </Text>
              <Text style={styles.roleTitleLarge}>{currentRole.title}</Text>
              <Text style={styles.roleResp}>{currentRole.responsibilities}</Text>

              <Text style={styles.fieldLabel}>Required skills</Text>
              <Text style={styles.fieldBody}>
                {currentRole.skills.join(' · ')}
              </Text>

              <Text style={styles.fieldLabel}>Expected contribution</Text>
              <Text style={styles.fieldBody}>
                {activeUser.name === 'David'
                  ? 'Onboarding designs, a sign-up prototype and a UI handoff.'
                  : 'Responsive authentication screens and marketplace discovery, with a documented build.'}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.metaRowText}>
                <Text style={styles.boldText}>{currentRole.hours} h / week</Text> · {project.duration}
              </Text>
              <Text style={styles.metaRowText}>
                Start: 19 Oct 2026 · End: 30 Nov 2026
              </Text>

              <Text style={styles.fieldLabel}>Availability expectations</Text>
              <Text style={styles.fieldBody}>
                {project.availabilityExpectations}
              </Text>
            </View>

            {/* 3. Planned milestones and deadlines Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>
                Planned milestones and deadlines
              </Text>
              {project.milestones.map((m) => (
                <View key={m.id} style={styles.milestoneRow}>
                  <Text style={styles.milestoneName}>{m.name}</Text>
                  <Text style={styles.milestoneDate}>— {m.targetDate}</Text>
                </View>
              ))}

              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>
                Your planned task deadlines
              </Text>
              {currentRole.deadlines?.map((d, idx) => (
                <View key={idx} style={styles.milestoneRow}>
                  <Text style={styles.milestoneName}>{d.name}</Text>
                  <Text style={styles.milestoneDate}>— {d.date}</Text>
                </View>
              ))}
            </View>

            {/* 4. Team agreements Card (PRD §11 & frame_060) */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Team agreements</Text>
              {project.workingExpectations?.map((exp, idx) => (
                <View key={idx} style={styles.agreementRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.agreementText}>{exp}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <Text style={styles.fieldLabel}>Response window</Text>
              <Text style={styles.fieldBody}>
                To be agreed before starting; suggested: weekday evenings.
              </Text>
            </View>

            {/* 5. Your explicit acceptance Card (The Gate) */}
            <View style={styles.acceptanceCard}>
              <Text style={styles.acceptanceHeading}>Your explicit acceptance</Text>

              {/* S22.X Error Banner */}
              {activeState === 'error' && (
                <View style={styles.errorAlertBox}>
                  <Text style={styles.errorAlertTitle}>
                    Acceptance could not save
                  </Text>
                  <Text style={styles.errorAlertBody}>
                    Acceptance not saved; you have not joined. Recheck current project and terms.
                  </Text>
                </View>
              )}

              {/* Unavailable Role Banner */}
              {activeState === 'unavailable' && (
                <View style={styles.errorAlertBox}>
                  <Text style={styles.errorAlertTitle}>
                    This role is unavailable
                  </Text>
                  <Text style={styles.errorAlertBody}>
                    Role or eligibility changed. Acceptance not saved; you have not joined. Check current available roles.
                  </Text>
                </View>
              )}

              {/* S22.L Saving Banner */}
              {activeState === 'saving' && (
                <View style={styles.savingAlertBox}>
                  <Text style={styles.savingAlertTitle}>
                    Saving dated acceptance...
                  </Text>
                  <Text style={styles.savingAlertBody}>
                    Saving acceptance. Not joined; workspace locked. Save temporarily disabled.
                  </Text>
                </View>
              )}

              {/* Acceptance Checkbox */}
              <Checkbox
                checked={isAcceptedLocally || activeState === 'checked'}
                disabled={activeState === 'saving' || activeState === 'unavailable'}
                onChange={handleCheckboxChange}
                label="I accept this commitment summary."
                sublabel={
                  isAcceptedLocally || activeState === 'checked'
                    ? 'Checked locally · not saved, not joined.'
                    : 'Explicit acceptance is required before workspace access is granted.'
                }
              />

              {/* Buttons */}
              {activeState === 'error' || activeState === 'unavailable' ? (
                <Button
                  title="Recheck current project and terms"
                  onPress={() => setActiveState('unchecked')}
                  style={[styles.acceptBtn, { marginTop: spacing.md }]}
                />
              ) : (
                <Button
                  title="Accept and join team"
                  disabled={
                    !(isAcceptedLocally || activeState === 'checked') ||
                    activeState === 'saving' ||
                    isSubmitting
                  }
                  loading={activeState === 'saving' || isSubmitting}
                  onPress={handleAcceptAndJoin}
                  style={[styles.acceptBtn, { marginTop: spacing.md }]}
                />
              )}

              <Button
                title="Decline invitation"
                variant="outline"
                disabled={activeState === 'saving'}
                onPress={handleDecline}
                style={styles.declineBtn}
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
  mainTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  subText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  preJoinNoticeBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  preJoinNoticeTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  preJoinNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    lineHeight: 17,
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
    marginBottom: spacing.sm,
  },
  outcomeDescription: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  outcomeMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
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
  acceptanceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  acceptanceHeading: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  acceptBtn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  declineBtn: {
    width: '100%',
  },
  acceptedSuccessBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    padding: spacing.xl,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  acceptedSuccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  successIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16A34A',
    marginRight: spacing.sm,
  },
  acceptedSuccessTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#166534',
  },
  acceptedSuccessBody: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#166534',
    marginBottom: 4,
  },
  acceptedSuccessSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  projectContextTitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 4,
  },
  bodyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
  },
  openWorkspaceBtn: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  errorAlertBox: {
    backgroundColor: colors.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.errorBorder,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  errorAlertTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.errorText,
    marginBottom: 2,
  },
  errorAlertBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.errorSubtext,
    lineHeight: 17,
  },
  savingAlertBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  savingAlertTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  savingAlertBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    lineHeight: 17,
  },
});
