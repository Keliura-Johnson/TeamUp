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

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams();
  const {
    discoverProjects,
    getActiveUserProfile,
    checkRoleEligibility,
  } = useApp();

  const userProfile = getActiveUserProfile();

  // Find project
  const project =
    discoverProjects.find((p) => p.id === id) || discoverProjects[0];

  // Selected role to view and request
  const [selectedRoleId, setSelectedRoleId] = useState(
    project.roles?.[0]?.id || 'role-designer'
  );

  // Companion State Demo Controller: 'default' | 'loading' | 'ineligible_view'
  const [activeState, setActiveState] = useState('default');

  const selectedRole =
    project.roles?.find((r) => r.id === selectedRoleId) || project.roles?.[0];

  // Other role in the project
  const otherRole = project.roles?.find((r) => r.id !== selectedRoleId);

  // Check eligibility for selected role
  const eligibility = checkRoleEligibility(
    userProfile,
    selectedRole,
    project.duration
  );
  const isEligible = activeState === 'ineligible_view' ? false : eligibility.isEligible;

  // Check eligibility for other role
  const otherEligibility = otherRole
    ? checkRoleEligibility(userProfile, otherRole, project.duration)
    : { isEligible: false, reasons: [] };

  const handleRequestRole = () => {
    if (!isEligible) return;
    router.push({
      pathname: '/request-role',
      params: {
        projectId: project.id,
        roleId: selectedRole.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="discover" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Companion State Demo Toolbar (for QA & Figma walk-through verification) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'default', label: 'Default (Eligible role)' },
              { id: 'loading', label: 'S16.L (Loading)' },
              { id: 'ineligible_view', label: 'S16.Unavailable (Ineligible role)' },
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

        {/* Navigation Breadcrumb / Link back */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            onPress={() => router.push('/discover-projects')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backLink}>← Back to discovery</Text>
          </TouchableOpacity>
        </View>

        {/* Screen Heading */}
        <Text style={styles.mainTitle}>Project details</Text>
        <Text style={styles.subText}>
          Review the project and role before requesting.
        </Text>

        {activeState === 'loading' ? (
          <View style={styles.card}>
            <Text style={styles.loadingText}>Loading project details...</Text>
          </View>
        ) : (
          <>
            {/* Project Overview Card (S16) */}
            <View style={styles.card}>
              <View style={styles.badgeRow}>
                <View style={styles.pillOpen}>
                  <Text style={styles.textOpen}>{project.status}</Text>
                </View>
              </View>

              <Text style={styles.projectTitle}>{project.title}</Text>
              <Text style={styles.projectSubtitle}>
                {project.projectType} · Open for recruitment
              </Text>

              <Text style={styles.sectionLabel}>Problem</Text>
              <Text style={styles.bodyText}>{project.problem}</Text>

              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.bodyText}>{project.description}</Text>

              <Text style={styles.sectionLabel}>Expected outcome</Text>
              <Text style={styles.bodyText}>{project.expectedOutcome}</Text>

              <Text style={styles.sectionLabel}>Project skills</Text>
              <Text style={styles.skillsSummaryText}>
                {project.roles
                  .flatMap((r) => r.skills)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(' · ')}
              </Text>

              {/* Owner Info & PRD FR-15 Privacy Notice */}
              <View style={styles.ownerRow}>
                <View style={styles.ownerAvatar}>
                  <Text style={styles.ownerInitial}>
                    {project.owner?.name?.[0] || 'A'}
                  </Text>
                </View>
                <Text style={styles.ownerInfoText}>
                  {project.owner?.name} · Owner / {project.owner?.role} · 5 h / week
                </Text>
              </View>
              <Text style={styles.privacyHelper}>
                Contact details are only visible to accepted teammates.
              </Text>
            </View>

            {/* A team of three / Roles Selection Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>A team of three</Text>
              <Text style={styles.teamLeadMeta}>
                {project.owner?.name} · Owner / {project.owner?.role} · 5 h / week
              </Text>
              <Text style={styles.teamRolesSummary}>
                Two open roles: UI/UX Designer and Frontend Developer. No collaborators have joined yet.
              </Text>

              {/* Role Selection Tabs */}
              <Text style={styles.rolePickerLabel}>Role to review</Text>
              <View style={styles.roleTabsContainer}>
                {project.roles.map((r) => {
                  const isSelected = r.id === selectedRoleId;
                  return (
                    <TouchableOpacity
                      key={r.id}
                      style={[
                        styles.roleTab,
                        isSelected && styles.roleTabActive,
                      ]}
                      onPress={() => setSelectedRoleId(r.id)}
                    >
                      <Text
                        style={[
                          styles.roleTabText,
                          isSelected && styles.roleTabTextActive,
                        ]}
                      >
                        {r.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Your role and expected contribution Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>
                Your role and expected contribution
              </Text>
              <Text style={styles.roleTitleLarge}>{selectedRole.title}</Text>
              <Text style={styles.roleRespText}>
                {selectedRole.responsibilities}
              </Text>

              <Text style={styles.sectionLabel}>Required skills</Text>
              <Text style={styles.bodyText}>
                {selectedRole.skills.join(' · ')}
              </Text>

              <Text style={styles.sectionLabel}>Expected contribution</Text>
              <Text style={styles.bodyText}>
                {selectedRole.responsibilities}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.metaRowText}>
                <Text style={styles.boldText}>{selectedRole.hours} h / week</Text> · {project.duration}
              </Text>
              <Text style={styles.metaRowText}>
                Start: 19 Oct 2026 · End: 30 Nov 2026
              </Text>

              <Text style={styles.sectionLabel}>Availability expectations</Text>
              <Text style={styles.bodyText}>
                {project.availabilityExpectations}
              </Text>
            </View>

            {/* Planned milestones and deadlines Card */}
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
              {selectedRole.deadlines?.map((d, idx) => (
                <View key={idx} style={styles.milestoneItemRow}>
                  <Text style={styles.milestoneItemName}>{d.name}</Text>
                  <Text style={styles.milestoneItemDate}>— {d.date}</Text>
                </View>
              ))}
            </View>

            {/* Other Role / Informational Card */}
            {otherRole && (
              <View style={styles.card}>
                <Text style={styles.cardHeading}>
                  {otherRole.title} / informational
                </Text>
                <Text style={styles.bodyText}>
                  {otherRole.responsibilities}
                </Text>
                <Text style={styles.metaRowText}>
                  Required skills: {otherRole.skills.join(' · ')}
                </Text>
                <Text style={styles.metaRowText}>
                  {otherRole.hours} h / week · {project.duration}
                </Text>

                {/* Purple warning banner for ineligible user (as demonstrated in walkthrough) */}
                {!otherEligibility.isEligible && (
                  <View style={styles.ineligibleBox}>
                    <Text style={styles.ineligibleTitle}>
                      Request unavailable for {userProfile.name}
                    </Text>
                    <Text style={styles.ineligibleBody}>
                      {otherEligibility.reasons.join(' ')} Choose another eligible role.
                    </Text>
                  </View>
                )}

                <Button
                  title={`Request ${otherRole.title} role`}
                  variant="outline"
                  disabled={true}
                  style={styles.disabledRoleBtn}
                />
              </View>
            )}

            {/* Team agreements Card (PRD §11 & Figma S16) */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Team agreements</Text>
              {project.workingExpectations?.map((exp, idx) => (
                <View key={idx} style={styles.agreementBulletRow}>
                  <Text style={styles.agreementBullet}>•</Text>
                  <Text style={styles.agreementText}>{exp}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>Response-window proposal</Text>
              <Text style={styles.bodyText}>
                {project.responseExpectations}
              </Text>
              <Text style={styles.responseWindowStatus}>
                Response window: to be agreed.
              </Text>
            </View>

            {/* Action Bar (Sticky or In-flow at bottom) */}
            <View style={styles.actionBarCard}>
              <Text style={styles.actionBarTitle}>
                Selected role: {selectedRole.title}
              </Text>
              {isEligible ? (
                <Text style={styles.actionBarMeta}>
                  ✓ Stated requirements met: {selectedRole.skills.join(', ')}, {selectedRole.hours} h / week for {project.duration}.
                </Text>
              ) : (
                <Text style={styles.actionBarMetaError}>
                  ✕ Requirements not met: {eligibility.reasons.join(' ')}
                </Text>
              )}

              <Button
                title="Request selected role"
                disabled={!isEligible}
                onPress={handleRequestRole}
                style={styles.requestRoleButton}
              />
            </View>
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
    fontSize: 24,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  pillOpen: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  textOpen: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: '#03543F',
  },
  projectTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 2,
  },
  projectSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: 2,
  },
  bodyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
  },
  skillsSummaryText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ownerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEECFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  ownerInitial: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  ownerInfoText: {
    fontSize: 13,
    color: colors.textHeading,
    fontFamily: fonts.semiBold,
  },
  privacyHelper: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSubtle,
    marginTop: 4,
    fontStyle: 'italic',
  },
  cardHeading: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  teamLeadMeta: {
    fontSize: 14,
    color: colors.textBody,
    fontFamily: fonts.medium,
    marginBottom: 4,
  },
  teamRolesSummary: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  rolePickerLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.xs,
  },
  roleTabsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleTab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
  },
  roleTabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  roleTabText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  roleTabTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
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
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textHeading,
  },
  milestoneItemDate: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  ineligibleBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
    padding: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.md,
  },
  ineligibleTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: '#4C1D95',
    marginBottom: 2,
  },
  ineligibleBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#5B21B6',
    lineHeight: 17,
  },
  disabledRoleBtn: {
    opacity: 0.6,
  },
  agreementBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs + 2,
  },
  agreementBullet: {
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
    lineHeight: 19,
  },
  responseWindowStatus: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionBarCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  actionBarTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 2,
  },
  actionBarMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.successText,
    marginBottom: spacing.md,
    lineHeight: 17,
  },
  actionBarMetaError: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.errorText,
    marginBottom: spacing.md,
    lineHeight: 17,
  },
  requestRoleButton: {
    width: '100%',
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
