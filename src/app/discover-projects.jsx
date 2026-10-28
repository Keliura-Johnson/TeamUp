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

export default function DiscoverProjectsScreen() {
  const {
    discoverProjects,
    getActiveUserProfile,
  } = useApp();

  const userProfile = getActiveUserProfile();

  // Companion State Demo Controller: 'default' | 'zero' | 'loading' | 'error'
  const [activeState, setActiveState] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Filters State
  const [filterSkill, setFilterSkill] = useState('All skills');
  const [filterRole, setFilterRole] = useState('All roles');
  const [filterType, setFilterType] = useState('All types');
  const [filterDuration, setFilterDuration] = useState('All durations');

  const filterCount =
    (filterSkill !== 'All skills' ? 1 : 0) +
    (filterRole !== 'All roles' ? 1 : 0) +
    (filterType !== 'All types' ? 1 : 0) +
    (filterDuration !== 'All durations' ? 1 : 0);

  const resetFilters = () => {
    setFilterSkill('All skills');
    setFilterRole('All roles');
    setFilterType('All types');
    setFilterDuration('All durations');
    setSearchQuery('');
    setActiveState('default');
  };

  // Filtered projects
  let displayedProjects = discoverProjects.filter((p) => {
    if (activeState === 'zero') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchRole = p.roles.some((r) => r.title.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchRole) return false;
    }
    if (filterType !== 'All types' && p.projectType !== filterType) return false;
    if (filterDuration !== 'All durations' && p.duration !== filterDuration) return false;
    if (filterRole !== 'All roles' && !p.roles.some((r) => r.title === filterRole)) return false;
    if (filterSkill !== 'All skills' && !p.roles.some((r) => r.skills.includes(filterSkill))) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="discover" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Companion State Demo Toolbar (for Figma QA testing) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'default', label: 'Default (Populated)' },
              { id: 'zero', label: 'S15.Zero (Zero results)' },
              { id: 'loading', label: 'S15.L (Loading)' },
              { id: 'error', label: 'S15.X (Cache warning)' },
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

        {/* Persona Switcher Bar for testing Joiner vs Owner perspectives */}
        <PersonaSwitcher />

        {activeState === 'error' && (
          <Banner
            type="error"
            title="Could not refresh projects"
            message="Connection error. Showing cached project records."
          />
        )}

        {/* Header */}
        <Text style={styles.mainTitle}>Discover Projects</Text>
        <Text style={styles.subText}>
          Find a project that fits your skills and availability.
        </Text>

        {/* Self-Reported Availability & PRD FR-23 Notice */}
        <View style={styles.infoNoticeBox}>
          <Text style={styles.infoNoticeTitle}>Your self-reported availability</Text>
          <Text style={styles.infoNoticeBody}>
            {userProfile.name} · {userProfile.role} · {(userProfile.skills || []).join(' + ')} · {userProfile.weeklyAvailability || '6 h / week'} for {userProfile.projectDuration || '6 weeks'}. Results must meet required skills, hours and duration.
          </Text>
        </View>

        {/* Search & Filter Controls */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            placeholderTextColor={colors.textSubtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalOpen(true)}
          >
            <Text style={styles.filterButtonText}>
              Filters {filterCount > 0 ? `(${filterCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Project Results */}
        {activeState === 'loading' ? (
          <View style={styles.card}>
            <Text style={styles.loadingText}>Loading open projects...</Text>
          </View>
        ) : displayedProjects.length === 0 ? (
          /* S15.Zero View */
          <View style={styles.emptyCard}>
            <View style={styles.trayIcon}>
              <Text style={styles.trayIconText}>🔍</Text>
            </View>
            <Text style={styles.emptyTitle}>No matching projects found</Text>
            <Text style={styles.emptySubtitle}>
              Adjust your search keywords or reset optional filters to discover more Open projects.
            </Text>
            <Button
              title="Reset filters"
              variant="outline"
              onPress={resetFilters}
              style={styles.resetBtn}
            />
          </View>
        ) : (
          displayedProjects.map((project) => {
            // Check eligibility for active user
            const matchingRoles = project.roles.filter((r) =>
              (userProfile.skills || []).some((s) => r.skills.includes(s))
            );
            return (
              <View key={project.id} style={styles.projectCard}>
                <View style={styles.badgeRow}>
                  <View style={styles.pillOpen}>
                    <Text style={styles.textOpen}>{project.status}</Text>
                  </View>
                  <Text style={styles.ownerText}>
                    Owner: {project.owner.name} · {project.owner.role}
                  </Text>
                </View>

                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectDesc}>{project.description}</Text>

                <Text style={styles.metaText}>
                  {project.projectType} · {project.duration} ({project.plannedDates})
                </Text>

                <View style={styles.rolesRow}>
                  <Text style={styles.rolesHeading}>Open roles:</Text>
                  <View style={styles.rolesPillsWrap}>
                    {project.roles.map((r) => (
                      <View key={r.id} style={styles.rolePill}>
                        <Text style={styles.rolePillText}>
                          {r.title} ({r.hours} h/week)
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {matchingRoles.length > 0 && (
                  <View style={styles.eligibleNotice}>
                    <Text style={styles.eligibleText}>
                      ✓ Eligible for: {matchingRoles.map((m) => m.title).join(', ')}
                    </Text>
                  </View>
                )}

                <Button
                  title="View project details"
                  onPress={() =>
                    router.push({
                      pathname: '/project-details',
                      params: { id: project.id },
                    })
                  }
                  style={styles.detailsBtn}
                />
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Filter Sheet Modal */}
      <Modal visible={filterModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter projects</Text>
              <TouchableOpacity onPress={() => setFilterModalOpen(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              Apply to update results. Close to discard filter changes.
            </Text>

            {/* Skill Filter */}
            <Text style={styles.filterFieldLabel}>Skill</Text>
            <View style={styles.filterChipRow}>
              {['All skills', 'UI design', 'Frontend development', 'Prototyping', 'React'].map((s) => (
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

            {/* Role Filter */}
            <Text style={styles.filterFieldLabel}>Role</Text>
            <View style={styles.filterChipRow}>
              {['All roles', 'UI/UX Designer', 'Frontend Developer', 'Product Manager'].map((r) => (
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

            {/* Duration Filter */}
            <Text style={styles.filterFieldLabel}>Duration</Text>
            <View style={styles.filterChipRow}>
              {['All durations', '4 weeks', '6 weeks'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.filterChip, filterDuration === d && styles.filterChipActive]}
                  onPress={() => setFilterDuration(d)}
                >
                  <Text style={[styles.filterChipText, filterDuration === d && styles.filterChipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Apply filters"
              onPress={() => setFilterModalOpen(false)}
              style={styles.modalApplyBtn}
            />
            <Button
              title="Reset optional filters"
              variant="link"
              onPress={() => {
                resetFilters();
                setFilterModalOpen(false);
              }}
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
    fontSize: 11,
    color: colors.textHeading,
    fontFamily: fonts.semiBold,
  },
  demoTabTextActive: {
    color: colors.textWhite,
  },
  personaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  personaLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    marginRight: 4,
  },
  personaBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  personaBtnActive: {
    backgroundColor: colors.primaryLight,
  },
  personaBtnText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textBody,
  },
  personaBtnTextActive: {
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
    marginBottom: spacing.md,
  },
  infoNoticeBox: {
    backgroundColor: '#FAF5FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  infoNoticeTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 3,
  },
  infoNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#5B21B6',
    lineHeight: 18,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  filterButton: {
    height: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
  },
  projectCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pillOpen: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  textOpen: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#7E22CE',
  },
  ownerText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  projectDesc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  rolesRow: {
    marginBottom: spacing.sm,
  },
  rolesHeading: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  rolesPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rolePill: {
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rolePillText: {
    fontSize: 11,
    color: colors.textHeading,
    fontFamily: fonts.medium,
  },
  eligibleNotice: {
    backgroundColor: '#F0FDF4',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginVertical: spacing.sm,
  },
  eligibleText: {
    fontSize: 12,
    color: '#15803D',
    fontFamily: fonts.semiBold,
  },
  detailsBtn: {
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  trayIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  trayIconText: {
    fontSize: 20,
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
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  resetBtn: {
    width: 140,
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
    maxHeight: '80%',
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
  modalSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  filterFieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
  },
  filterChipText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textHeading,
  },
  filterChipTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  modalApplyBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
});
