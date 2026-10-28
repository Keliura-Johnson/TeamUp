import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import Banner from '../components/Banner';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function MyProjectsScreen() {
  const { projectsList, resumeDraft, initiateNewDraft } = useApp();

  const [filterStatus, setFilterStatus] = useState('All statuses');
  const [filterPickerOpen, setFilterPickerOpen] = useState(false);
  const [inProgressSectionOpen, setInProgressSectionOpen] = useState(false);

  // Companion state demos
  const [activeState, setActiveState] = useState('default'); // 'default' | 'loading' | 'refresh_error' | 'loaded_success'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusOptions = [
    'All statuses',
    'Draft',
    'Open',
    'Team Formed',
    'In Progress',
    'Completed',
    'Ended Early',
  ];

  const filteredProjects =
    filterStatus === 'All statuses'
      ? projectsList
      : projectsList.filter((p) => p.status === filterStatus);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'In Progress':
        return { pill: styles.pillProgress, text: styles.textProgress };
      case 'Draft':
        return { pill: styles.pillDraft, text: styles.textDraft };
      case 'Open':
        return { pill: styles.pillOpen, text: styles.textOpen };
      case 'Team Formed':
        return { pill: styles.pillFormed, text: styles.textFormed };
      case 'Completed':
        return { pill: styles.pillCompleted, text: styles.textCompleted };
      case 'Ended Early':
        return { pill: styles.pillEnded, text: styles.textEnded };
      default:
        return { pill: styles.pillDraft, text: styles.textDraft };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="myprojects" />
      <PersonaSwitcher />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* State Demo Toolbar for Figma QA */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
            {[
              { id: 'default', label: 'Default' },
              { id: 'loading', label: 'S49.L' },
              { id: 'refresh_error', label: 'S49.X' },
              { id: 'loaded_success', label: 'S49.S' },
            ].map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => setActiveState(st.id)}
                style={[styles.demoTab, activeState === st.id && styles.demoTabActive]}
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

        <Text style={styles.mainTitle}>My Projects</Text>
        <Text style={styles.subText}>
          Your drafts, active work and project records.
        </Text>

        <Button
          title="Create project"
          onPress={() => {
            initiateNewDraft();
            router.push('/create-project');
          }}
          style={styles.createButton}
        />

        {/* Filter by project status */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by project status</Text>
          <TouchableOpacity
            style={styles.dropdownBox}
            onPress={() => setFilterPickerOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownValue}>{filterStatus}</Text>
            <Text style={styles.dropdownArrow}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* S49.X / Load failure banner */}
        {activeState === 'refresh_error' && (
          <View style={styles.card}>
            <Banner
              type="error"
              title="Project records could not refresh"
              message="Load failed. Filter retained; showing your last saved records."
            />
            <Button
              title="Retry refresh"
              variant="outline"
              loading={isRefreshing}
              onPress={() => {
                setIsRefreshing(true);
                setTimeout(() => {
                  setIsRefreshing(false);
                  setActiveState('loaded_success');
                }, 400);
              }}
            />
          </View>
        )}

        {/* S49.S / Six saved records loaded banner */}
        {activeState === 'loaded_success' && (
          <Banner
            type="success"
            title="Six project records loaded"
            message="Project statuses updated."
          />
        )}

        {/* S49.L / Skeleton Loader state */}
        {activeState === 'loading' ? (
          <View>
            <Text style={styles.loadingNote}>Loading your project records...</Text>
            {[1, 2, 3, 4].map((n) => (
              <View key={n} style={styles.skeletonCard}>
                <View style={styles.skeletonPill} />
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonDesc} />
                <View style={styles.skeletonButton} />
              </View>
            ))}
          </View>
        ) : filteredProjects.length === 0 ? (
          // S49.E / Filtered response — no records found
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>☰</Text>
            </View>
            <Text style={styles.emptyTitle}>No projects in this status</Text>
            <Text style={styles.emptySubtitle}>
              No {filterStatus} projects. Reset the filter to see your other
              projects.
            </Text>
            <Button
              title="Reset status filter"
              onPress={() => setFilterStatus('All statuses')}
              style={styles.resetButton}
            />
            <Button
              title="Create project"
              variant="outline"
              onPress={() => {
                initiateNewDraft();
                router.push('/create-project');
              }}
            />
          </View>
        ) : (
          // List of Project Cards
          filteredProjects.map((project) => {
            const badgeStyle = getStatusBadgeStyle(project.status);
            return (
              <View key={project.id} style={styles.card}>
                <View style={badgeStyle.pill}>
                  <Text style={badgeStyle.text}>{project.status}</Text>
                </View>

                <Text style={styles.cardTitle}>{project.title}</Text>
                <Text style={styles.cardDesc}>{project.description}</Text>
                <Text style={styles.cardMeta}>{project.meta}</Text>

                <Button
                  title={project.actionLabel}
                  onPress={() => {
                    if (project.status === 'Draft') {
                      resumeDraft(project.id);
                      router.push('/create-project');
                    } else if (project.status === 'Open') {
                      if (project.meta?.includes('Owner')) {
                        router.push('/project-published');
                      } else {
                        router.push({
                          pathname: '/project-details',
                          params: { id: project.id === 'proj-2' ? 'student-study-planner' : 'campus-marketplace' },
                        });
                      }
                    } else if (project.status === 'In Progress') {
                      router.push('/workspace');
                    } else if (project.status === 'Completed') {
                      router.push('/private-project-page');
                    } else if (project.status === 'Ended Early') {
                      router.push('/ended-early');
                    } else {
                      Alert.alert(project.title, `${project.actionLabel} clicked.`);
                    }
                  }}
                  style={styles.actionButton}
                />

                {project.status === 'In Progress' && (
                  <View style={styles.projectSectionDropdownContainer}>
                    <Text style={styles.projectSectionLabel}>Jump to section:</Text>
                    <TouchableOpacity
                      style={styles.projectSectionButton}
                      onPress={() => setInProgressSectionOpen(!inProgressSectionOpen)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.projectSectionButtonText}>Choose section...</Text>
                      <Text style={styles.dropdownArrow}>▾</Text>
                    </TouchableOpacity>

                    {inProgressSectionOpen && (
                      <View style={styles.sectionMenuCard}>
                        {[
                          { label: 'Project Updates', route: '/project-updates' },
                          { label: 'Team Health', route: '/team-health' },
                          { label: 'Workspace (Overview & Tasks)', route: '/workspace' },
                          { label: 'Project Completion', route: '/project-completion' },
                        ].map((sec) => (
                          <TouchableOpacity
                            key={sec.label}
                            style={styles.sectionMenuItem}
                            onPress={() => {
                              setInProgressSectionOpen(false);
                              router.push(sec.route);
                            }}
                          >
                            <Text style={styles.sectionMenuItemText}>{sec.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                <Text style={styles.cardFooter}>{project.footerNote}</Text>
              </View>
            );
          })
        )}

        {/* Modal Status Filter Picker */}
        <Modal
          visible={filterPickerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setFilterPickerOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setFilterPickerOpen(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter by Project Status</Text>
              <FlatList
                data={statusOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      setFilterStatus(item);
                      setFilterPickerOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filterStatus === item && styles.optionTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  demoBar: {
    backgroundColor: '#ECEEF2',
    padding: 4,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  demoScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demoLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    marginHorizontal: 8,
  },
  demoTab: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  demoTabActive: {
    backgroundColor: colors.surface,
  },
  demoTabText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
  },
  demoTabTextActive: {
    color: colors.primary,
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
    color: colors.textBody,
    marginBottom: spacing.lg,
  },
  createButton: {
    marginBottom: spacing.xl,
  },
  filterSection: {
    marginBottom: spacing.xl,
  },
  filterLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: spacing.xs + 2,
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    height: 46,
    paddingHorizontal: spacing.md,
  },
  dropdownValue: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownArrow: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 6,
    marginTop: spacing.xs,
  },
  cardDesc: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    marginBottom: 4,
    lineHeight: 20,
  },
  cardMeta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  cardFooter: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  // Status Pills
  pillProgress: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  textProgress: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  pillDraft: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  textDraft: {
    color: '#4B5563',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  pillOpen: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  textOpen: {
    color: '#6336E4',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  pillFormed: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  textFormed: {
    color: '#0369A1',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  pillCompleted: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  textCompleted: {
    color: '#15803D',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  pillEnded: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  textEnded: {
    color: '#475569',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  // Empty State
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  emptyIconContainer: {
    marginBottom: spacing.md,
  },
  emptyIcon: {
    fontFamily: fonts.regular,
    fontSize: 32,
    color: colors.textSubtle,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 18,
  },
  resetButton: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  // Skeleton loader
  loadingNote: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skeletonPill: {
    width: 60,
    height: 18,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 9,
    marginBottom: spacing.md,
  },
  skeletonTitle: {
    width: '70%',
    height: 20,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  skeletonDesc: {
    width: '90%',
    height: 14,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  skeletonButton: {
    width: '100%',
    height: 44,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    maxHeight: 380,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  optionRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  optionTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  projectSectionDropdownContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    position: 'relative',
    zIndex: 20,
  },
  projectSectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  projectSectionButton: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  projectSectionButtonText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
  },
  sectionMenuCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sectionMenuItemText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textHeading,
  },
});
