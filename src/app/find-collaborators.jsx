import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import Banner from '../components/Banner';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function FindCollaboratorsScreen() {
  const {
    discoverProjects,
    candidates,
    sendInvitation,
    checkRoleEligibility,
  } = useApp();

  // State Demo Controller: 'default' | 'zero' | 'loading' | 'no_project' | 'error'
  const [activeState, setActiveState] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Filter sheet state
  const [filterSkill, setFilterSkill] = useState('All skills');
  const [filterRole, setFilterRole] = useState('All roles');
  const [filterType, setFilterType] = useState('All types');
  const [filterDuration, setFilterDuration] = useState('All durations');
  const [filterHours, setFilterHours] = useState('All hours');

  // Owned Project & Role selection
  const ownedProject = discoverProjects[0]; // Campus Marketplace · Open
  const [selectedRoleId, setSelectedRoleId] = useState(
    ownedProject?.roles?.[0]?.id || 'role-designer'
  );

  const selectedRole =
    ownedProject?.roles?.find((r) => r.id === selectedRoleId) ||
    ownedProject?.roles?.[0];

  // Review invitation modal / state
  const [reviewingCandidate, setReviewingCandidate] = useState(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const filterCount =
    (filterSkill !== 'All skills' ? 1 : 0) +
    (filterRole !== 'All roles' ? 1 : 0) +
    (filterType !== 'All types' ? 1 : 0) +
    (filterDuration !== 'All durations' ? 1 : 0) +
    (filterHours !== 'All hours' ? 1 : 0);

  const resetOptionalFilters = () => {
    setFilterSkill('All skills');
    setFilterRole('All roles');
    setFilterType('All types');
    setFilterDuration('All durations');
    setFilterHours('All hours');
    setSearchQuery('');
    setActiveState('default');
  };

  // Filter candidates strictly according to PRD FR-23 for selected role
  const eligibleCandidates = candidates.filter((c) => {
    if (activeState === 'zero') return false;

    // Hard eligibility requirement per PRD FR-23:
    // Exclude people who lack required skills or weekly availability
    const eligibility = checkRoleEligibility(
      { skills: c.skills, weeklyAvailability: c.weeklyAvailability },
      selectedRole,
      ownedProject?.duration
    );
    if (!eligibility.isEligible) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchRole = c.role.toLowerCase().includes(q);
      const matchSkill = c.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchRole && !matchSkill) return false;
    }

    if (filterSkill !== 'All skills' && !c.skills.includes(filterSkill)) return false;
    if (filterRole !== 'All roles' && c.role !== filterRole) return false;

    return true;
  });

  const handleSendInvite = async (candidate) => {
    setIsSendingInvite(true);
    const res = await sendInvitation(candidate, selectedRole, ownedProject);
    setIsSendingInvite(false);
    setReviewingCandidate(null);
    if (res.success) {
      router.push({
        pathname: '/invitation-details',
        params: { id: res.data.id, view: 'owner' },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="collaborators" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Companion State Demo Toolbar (for QA testing) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'default', label: 'Default (Eligible candidate)' },
              { id: 'zero', label: 'S17.Zero (No eligible people)' },
              { id: 'loading', label: 'S17.L (Loading)' },
              { id: 'no_project', label: 'S17.Empty (No owned project)' },
              { id: 'error', label: 'S17.X (Error banner)' },
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

        {/* Sub-navigation tabs (matching review-join-requests frame_100) */}
        <View style={styles.subTabsRow}>
          <TouchableOpacity
            style={styles.subTab}
            onPress={() => router.push('/review-join-requests')}
          >
            <Text style={styles.subTabText}>Join requests · 1 pending</Text>
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
            style={[styles.subTab, styles.subTabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.subTabText, styles.subTabTextActive]}>
              Find Collaborators
            </Text>
          </TouchableOpacity>
        </View>

        {activeState === 'error' && (
          <Banner
            type="error"
            title="Could not refresh collaborator list"
            message="Connection interrupted. Displaying cached collaborator availability."
          />
        )}

        {/* Screen Title */}
        <Text style={styles.mainTitle}>Find Collaborators</Text>
        <Text style={styles.subText}>
          Choose an owned Open project and a specific open role.
        </Text>

        {activeState === 'no_project' ? (
          /* S17.Empty / No owned project */
          <View style={styles.card}>
            <View style={styles.trayIcon}>
              <Text style={styles.trayIconText}>📂</Text>
            </View>
            <Text style={styles.emptyTitle}>No owned Open projects</Text>
            <Text style={styles.emptySubtitle}>
              You must have an active Open project to invite collaborators.
            </Text>
            <Button
              title="Create project"
              onPress={() => router.push('/create-project')}
              style={styles.createProjBtn}
            />
          </View>
        ) : (
          <>
            {/* Owned Project Picker */}
            <View style={styles.selectorCard}>
              <Text style={styles.selectorLabel}>Owned project</Text>
              <View style={styles.selectorBox}>
                <Text style={styles.selectorText}>
                  {ownedProject.title} · {ownedProject.status}
                </Text>
              </View>

              {/* Open Role Selector */}
              <Text style={[styles.selectorLabel, { marginTop: spacing.md }]}>
                Open role
              </Text>
              <View style={styles.roleTabsWrap}>
                {ownedProject.roles.map((r) => {
                  const isSel = r.id === selectedRoleId;
                  return (
                    <TouchableOpacity
                      key={r.id}
                      style={[styles.roleSelectTab, isSel && styles.roleSelectTabActive]}
                      onPress={() => {
                        setSelectedRoleId(r.id);
                        setReviewingCandidate(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.roleSelectTabText,
                          isSel && styles.roleSelectTabTextActive,
                        ]}
                      >
                        {r.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Required for this role Banner (PRD FR-23) */}
            <View style={styles.requiredNoticeBox}>
              <Text style={styles.requiredNoticeTitle}>Required for this role</Text>
              <Text style={styles.requiredNoticeText}>
                {selectedRole.skills.join(' + ')} · {selectedRole.hours} h / week ·{' '}
                {ownedProject.duration}, {ownedProject.plannedDates}. People who do not meet all required skills, hours and duration are excluded.
              </Text>
            </View>

            {/* Search and Filters */}
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search people..."
                placeholderTextColor={colors.textSubtle}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => setFilterModalOpen(true)}
              >
                <Text style={styles.filterBtnText}>
                  Filters {filterCount > 0 ? `(${filterCount})` : ''}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Candidate List / Results */}
            {activeState === 'loading' ? (
              <View style={styles.card}>
                <Text style={styles.loadingText}>Loading eligible candidates...</Text>
              </View>
            ) : eligibleCandidates.length === 0 ? (
              /* S17.Zero / No eligible people found */
              <View style={styles.emptyCard}>
                <View style={styles.trayIcon}>
                  <Text style={styles.trayIconText}>👤</Text>
                </View>
                <Text style={styles.emptyTitle}>No eligible people found</Text>
                <Text style={styles.emptySubtitle}>
                  {`Adjust optional filters or edit role's ${selectedRole.skills.join(', ')}, hours and duration.`}
                </Text>
                <Button
                  title="Reset optional filters"
                  variant="outline"
                  onPress={resetOptionalFilters}
                  style={styles.resetBtn}
                />
              </View>
            ) : (
              <>
                <Text style={styles.resultsCount}>
                  {eligibleCandidates.length} eligible collaborator{eligibleCandidates.length > 1 ? 's' : ''}
                </Text>

                {eligibleCandidates.map((cand) => (
                  <View key={cand.id} style={styles.candidateCard}>
                    <View style={styles.cardHeaderTop}>
                      <Text style={styles.cardSectionOverline}>
                        Public profile preview
                      </Text>
                      <View style={styles.matchPill}>
                        <Text style={styles.matchPillText}>{cand.matchLabel}</Text>
                      </View>
                    </View>

                    <View style={styles.candHeaderRow}>
                      <View
                        style={[
                          styles.candAvatar,
                          { backgroundColor: cand.bg || '#E0F2FE' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.candAvatarText,
                            { color: cand.color || colors.primary },
                          ]}
                        >
                          {cand.initial}
                        </Text>
                      </View>
                      <View style={styles.candHeaderInfo}>
                        <Text style={styles.candName}>{cand.name}</Text>
                        <Text style={styles.candRole}>{cand.role}</Text>
                      </View>
                    </View>

                    <Text style={styles.candFieldLabel}>
                      Self-reported skills and availability
                    </Text>
                    <Text style={styles.candSkills}>
                      {cand.skills.join(' · ')}
                    </Text>
                    <Text style={styles.candAvailability}>
                      Beginner · {cand.weeklyAvailability} · {cand.preferredDuration}
                    </Text>

                    <Text style={styles.candFieldLabel}>Goal</Text>
                    <Text style={styles.candGoal}>{cand.goals}</Text>

                    {/* PRD FR-15: Contact hidden from Owner before joining */}
                    <Text style={styles.privacyNoticeText}>
                      Public fields only. Contact details hidden, including from the Owner.
                    </Text>

                    <Button
                      title={`Review invitation to ${cand.name}`}
                      onPress={() => setReviewingCandidate(cand)}
                      style={styles.reviewInviteBtn}
                    />
                  </View>
                ))}
              </>
            )}

            {/* Review Invitation Drawer / Card */}
            {reviewingCandidate && (
              <View style={styles.reviewModalCard}>
                <Text style={styles.reviewModalHeading}>Review invitation</Text>
                <Text style={styles.reviewModalSub}>
                  Invite {reviewingCandidate.name} to {ownedProject.title}
                </Text>

                <View style={styles.reviewDetailsBox}>
                  <Text style={styles.reviewRoleTitle}>
                    {selectedRole.title} · {selectedRole.hours} h / week · {ownedProject.duration}
                  </Text>
                  <Text style={styles.reviewRoleResp}>
                    {selectedRole.responsibilities}
                  </Text>
                  <Text style={styles.reviewDates}>
                    {ownedProject.plannedDates} · {ownedProject.availabilityExpectations}
                  </Text>
                </View>

                {/* Explicit statement from walkthrough */}
                <View style={styles.infoCallout}>
                  <Text style={styles.infoCalloutText}>
                    Sending is not joining. {reviewingCandidate.name} must review and save his commitment acceptance.
                  </Text>
                </View>

                <Button
                  title={`Send invitation to ${reviewingCandidate.name}`}
                  loading={isSendingInvite}
                  onPress={() => handleSendInvite(reviewingCandidate)}
                  style={styles.confirmSendBtn}
                />

                <TouchableOpacity
                  onPress={() => setReviewingCandidate(null)}
                  style={styles.cancelLinkWrap}
                >
                  <Text style={styles.cancelLinkText}>Cancel invitation review</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Filter Sheet Modal */}
      <Modal visible={filterModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter collaborators</Text>
              <TouchableOpacity onPress={() => setFilterModalOpen(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalProjectContext}>
              {ownedProject.title} · {selectedRole.title}
            </Text>
            <Text style={styles.modalSub}>
              Apply to update results. Close to discard filter changes.
            </Text>

            <Text style={styles.filterGroupHeading}>Optional filters</Text>

            <Text style={styles.filterFieldLabel}>Skill</Text>
            <View style={styles.filterChipRow}>
              {['All skills', 'UI design', 'Prototyping', 'Frontend development', 'React'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.filterChip, filterSkill === s && styles.filterChipActive]}
                  onPress={() => setFilterSkill(s)}
                >
                  <Text style={[styles.filterChipText, filterSkill === s && styles.filterChipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterFieldLabel}>Role</Text>
            <View style={styles.filterChipRow}>
              {['All roles', 'UI/UX Designer', 'Frontend Developer', 'Data Analyst'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.filterChip, filterRole === r && styles.filterChipActive]}
                  onPress={() => setFilterRole(r)}
                >
                  <Text style={[styles.filterChipText, filterRole === r && styles.filterChipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterFieldLabel}>Weekly hours</Text>
            <View style={styles.filterChipRow}>
              {['All hours', '5 h / week', '6 h / week', '8 h / week'].map((h) => (
                <TouchableOpacity
                  key={h}
                  style={[styles.filterChip, filterHours === h && styles.filterChipActive]}
                  onPress={() => setFilterHours(h)}
                >
                  <Text style={[styles.filterChipText, filterHours === h && styles.filterChipTextActive]}>
                    {h}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={resetOptionalFilters}
              style={styles.modalResetBtn}
            >
              <Text style={styles.modalResetText}>Reset optional filters</Text>
            </TouchableOpacity>
            <Text style={styles.resetExplanation}>
              {"Reset never removes the selected role's required skills, hours and duration."}
            </Text>

            <Button
              title="Apply filters"
              onPress={() => setFilterModalOpen(false)}
              style={styles.modalApplyBtn}
            />
          </View>
        </View>
      </Modal>
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
  selectorCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  selectorLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.xs,
  },
  selectorBox: {
    backgroundColor: colors.surfaceMuted,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
  },
  roleTabsWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleSelectTab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
  },
  roleSelectTabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  roleSelectTabText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  roleSelectTabTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  requiredNoticeBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  requiredNoticeTitle: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  requiredNoticeText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    lineHeight: 17,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  filterBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
  },
  resultsCount: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  candidateCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  cardHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardSectionOverline: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  matchPill: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  matchPillText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#03543F',
  },
  candHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  candAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  candAvatarText: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  candHeaderInfo: {
    flex: 1,
  },
  candName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  candRole: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  candFieldLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  candSkills: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
  },
  candAvailability: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    marginBottom: spacing.sm,
  },
  candGoal: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  privacyNoticeText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSubtle,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  reviewInviteBtn: {
    width: '100%',
  },
  reviewModalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  reviewModalHeading: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 2,
  },
  reviewModalSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  reviewDetailsBox: {
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  reviewRoleTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  reviewRoleResp: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
    marginBottom: 4,
  },
  reviewDates: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  infoCallout: {
    backgroundColor: '#F5F3FF',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  infoCalloutText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    lineHeight: 17,
  },
  confirmSendBtn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  cancelLinkWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  cancelLinkText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  trayIcon: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  trayIconText: {
    fontSize: 32,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  resetBtn: {
    width: 200,
  },
  createProjBtn: {
    width: 200,
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  modalCloseText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  modalProjectContext: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    marginBottom: 2,
  },
  modalSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  filterGroupHeading: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  filterFieldLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
  },
  filterChipTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  modalResetBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  modalResetText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },
  resetExplanation: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSubtle,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalApplyBtn: {
    width: '100%',
  },
});
