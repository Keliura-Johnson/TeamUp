import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

export default function DashboardScreen() {
  const {
    user,
    activeProject,
    needsAttentionTask,
    pendingInvitation,
    upcomingTasks,
    initiateNewDraft,
    joinRequests,
  } = useApp();

  const [activeState, setActiveState] = useState('default'); // 'default' | 'refresh_error'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setActiveState('default');
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="dashboard" />
      <PersonaSwitcher />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* State Demo Toolbar for Figma QA */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <TouchableOpacity
            onPress={() => setActiveState('default')}
            style={[styles.demoTab, activeState === 'default' && styles.demoTabActive]}
          >
            <Text
              style={[
                styles.demoTabText,
                activeState === 'default' && styles.demoTabTextActive,
              ]}
            >
              Default
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveState('refresh_error')}
            style={[
              styles.demoTab,
              activeState === 'refresh_error' && styles.demoTabActive,
            ]}
          >
            <Text
              style={[
                styles.demoTabText,
                activeState === 'refresh_error' && styles.demoTabTextActive,
              ]}
            >
              S48.X (Cache Refresh Error)
            </Text>
          </TouchableOpacity>
        </View>

        {activeState === 'refresh_error' && (
          <View style={{ marginBottom: spacing.md }}>
            <Banner
              type="error"
              title="Dashboard could not refresh"
              message="Connection error. Showing your cached dashboard snapshot from 12 Nov 2026."
            />
            <Button
              title="Retry refresh"
              variant="outline"
              loading={isRefreshing}
              onPress={handleRefresh}
              style={{ marginTop: spacing.xs }}
            />
          </View>
        )}

        {/* Date & Greeting */}
        <Text style={styles.dateText}>Thursday, 12 November 2026</Text>
        <Text style={styles.greetingTitle}>
          Good to see you, {user.name || 'Ada'}
        </Text>
        <Text style={styles.subtitle}>
          {"Here's what needs your attention today."}
        </Text>

        {/* Action Buttons */}
        <Button
          title="Discover Projects"
          onPress={() => router.push('/discover-projects')}
          style={styles.primaryButton}
        />
        <Button
          title="Create project"
          variant="outline"
          onPress={() => {
            initiateNewDraft();
            router.push('/create-project');
          }}
          style={styles.createButton}
        />

        {/* 1. ACTIVE PROJECT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionOverline}>ACTIVE PROJECT</Text>
            <View style={styles.statusPillPurple}>
              <Text style={styles.statusPillTextPurple}>
                {activeProject.status}
              </Text>
            </View>
          </View>

          <Text style={styles.projectTitle}>{activeProject.title}</Text>
          <Text style={styles.projectMeta}>{activeProject.role}</Text>
          <Text style={styles.projectDates}>{activeProject.dates}</Text>

          {/* Teammates Avatars Row */}
          <View style={styles.teammatesRow}>
            <View style={styles.avatarCluster}>
              {activeProject.teammates.map((tm) => (
                <View
                  key={tm.id}
                  style={[styles.memberAvatar, { backgroundColor: tm.bg }]}
                >
                  <Text style={[styles.avatarInitial, { color: tm.color }]}>
                    {tm.initial}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.teammatesLabel}>
              {activeProject.teammates.length} accepted teammates ·{' '}
              {activeProject.teammates.map((t) => t.name).join(', ')}
            </Text>
          </View>

          {/* Overall Tasks Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressLabel}>Overall tasks</Text>
              <Text style={styles.progressCount}>
                {activeProject.completedTasksCount} of{' '}
                {activeProject.totalTasksCount} Done
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${
                      (activeProject.completedTasksCount /
                        activeProject.totalTasksCount) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Milestones Breakdown */}
          <View style={styles.milestonesList}>
            {activeProject.milestones.map((m) => (
              <View key={m.id} style={styles.milestoneRow}>
                <Text style={styles.milestoneName}>
                  {m.name} · {m.date}
                </Text>
                <Text style={styles.milestoneCount}>
                  {m.done} of {m.total} Done
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Open project workspace"
            variant="outline"
            onPress={() => router.push('/workspace')}
            style={styles.cardActionButton}
          />
        </View>

        {/* PENDING JOIN REQUEST CARD (Owner review) */}
        {joinRequests && joinRequests.some((r) => r.status === 'Pending') && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardSectionHeading}>Pending join request</Text>
              <View style={styles.statusPillSoftPurple}>
                <Text style={styles.statusPillTextSoftPurple}>1 Pending</Text>
              </View>
            </View>

            <View style={styles.invitationContent}>
              <Text style={styles.invitationTitle}>
                {joinRequests.find((r) => r.status === 'Pending')?.applicant?.name || 'John'} · {joinRequests.find((r) => r.status === 'Pending')?.roleTitle || 'Frontend Developer'}
              </Text>
              <Text style={styles.invitationDesc}>
                Requested to join Campus Marketplace. Review their stated skills, weekly hours, and commitment before deciding.
              </Text>
              <Text style={styles.invitationMeta}>
                Sent 18 Oct 2026 · {joinRequests.find((r) => r.status === 'Pending')?.applicant?.weeklyAvailability || '8 h / week'}
              </Text>

              <Button
                title="Review join request"
                onPress={() => router.push('/review-join-requests')}
                style={styles.reviewButton}
              />

              <Text style={styles.invitationHelper}>
                Owner approval required. Joining requires approval and saved commitment acceptance.
              </Text>
            </View>
          </View>
        )}

        {/* 2. PENDING INVITATION CARD */}
        {pendingInvitation && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardSectionHeading}>Pending invitation</Text>
            </View>

            <View style={styles.invitationContent}>
              <View style={styles.invitationTopRow}>
                <View style={styles.statusPillSoftPurple}>
                  <Text style={styles.statusPillTextSoftPurple}>
                    {pendingInvitation.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.invitationTitle}>
                {pendingInvitation.title}
              </Text>
              <Text style={styles.invitationDesc}>
                {pendingInvitation.description}
              </Text>
              <Text style={styles.invitationMeta}>
                {pendingInvitation.details}
              </Text>

              <Button
                title="Review invitation"
                onPress={() =>
                  router.push({
                    pathname: '/invitation-details',
                    params: { view: 'recipient' },
                  })
                }
                style={styles.reviewButton}
              />

              <Text style={styles.invitationHelper}>
                Review your commitment. No workspace access until acceptance is
                saved.
              </Text>
            </View>
          </View>
        )}

        {/* 3. NEEDS ATTENTION CARD */}
        {needsAttentionTask && (
          <View style={styles.card}>
            <Text style={styles.cardSectionHeading}>Needs attention</Text>

            <View style={styles.badgeRow}>
              {needsAttentionTask.isBlocked && (
                <View style={styles.blockedPill}>
                  <Text style={styles.blockedText}>! Blocked</Text>
                </View>
              )}
              {needsAttentionTask.isOverdue && (
                <View style={styles.overduePill}>
                  <Text style={styles.overdueText}>
                    Overdue {needsAttentionTask.overdueDays} days
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.taskTitle}>{needsAttentionTask.title}</Text>

            <View style={styles.assigneeRow}>
              <View
                style={[
                  styles.miniAvatar,
                  { backgroundColor: needsAttentionTask.assignee.bg },
                ]}
              >
                <Text
                  style={[
                    styles.miniAvatarText,
                    { color: needsAttentionTask.assignee.color },
                  ]}
                >
                  {needsAttentionTask.assignee.initial}
                </Text>
              </View>
              <Text style={styles.assigneeName}>
                {needsAttentionTask.assignee.name} ·{' '}
                {needsAttentionTask.assignee.role}
              </Text>
            </View>

            <Text style={styles.taskDueDate}>
              {needsAttentionTask.dueDate}
            </Text>

            {needsAttentionTask.blockerNote && (
              <Text style={styles.blockerNote}>
                {needsAttentionTask.blockerNote}
              </Text>
            )}

            <Button
              title="Open task details"
              variant="outline"
              onPress={() =>
                router.push({
                  pathname: '/task-detail',
                  params: { id: 't3' },
                })
              }
              style={styles.cardActionButton}
            />

            <View style={styles.taskLinksRow}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/workspace',
                    params: { section: 'reminders', action: 'request-date' },
                  })
                }
              >
                <Text style={styles.purpleLink}>Request new date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/workspace',
                    params: { section: 'reminders', action: 'handover' },
                  })
                }
              >
                <Text style={styles.purpleLink}>Hand over</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 4. UPCOMING TASKS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardSectionHeading}>Upcoming tasks</Text>

          {upcomingTasks.map((task, index) => (
            <View
              key={task.id}
              style={[
                styles.upcomingTaskItem,
                index < upcomingTasks.length - 1 && styles.upcomingTaskBorder,
              ]}
            >
              <View style={styles.upcomingTaskTextContainer}>
                <Text style={styles.upcomingTaskTitle}>{task.title}</Text>
                <Text style={styles.upcomingTaskSubtitle}>{task.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.taskStatusPill,
                  task.statusType === 'todo'
                    ? styles.pillTodo
                    : styles.pillReview,
                ]}
              >
                <Text
                  style={[
                    styles.taskStatusText,
                    task.statusType === 'todo'
                      ? styles.textTodo
                      : styles.textReview,
                  ]}
                >
                  {task.status}
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.viewTasksLinkContainer}
            onPress={() =>
              Alert.alert('Project Tasks', 'Opening full task board...')
            }
          >
            <Text style={styles.purpleLink}>View project tasks</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: '#ECEEF2',
    padding: 4,
    borderRadius: radius.md,
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
  dateText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    marginBottom: spacing.xs,
  },
  greetingTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    marginBottom: spacing.sm,
  },
  createButton: {
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionOverline: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  cardSectionHeading: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  statusPillPurple: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusPillTextPurple: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  statusPillSoftPurple: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  statusPillTextSoftPurple: {
    color: '#7E22CE',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  projectTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  projectMeta: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    marginBottom: 2,
  },
  projectDates: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  teammatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  avatarCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  avatarInitial: {
    fontSize: 13,
    fontFamily: fonts.bold,
  },
  teammatesLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  progressCount: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 3,
  },
  milestonesList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneName: {
    fontSize: 13,
    color: colors.textHeading,
    fontFamily: fonts.semiBold,
  },
  milestoneCount: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  cardActionButton: {
    marginTop: spacing.xs,
  },
  invitationContent: {
    marginTop: 2,
  },
  invitationTopRow: {
    marginBottom: spacing.xs,
  },
  invitationTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  invitationDesc: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    marginBottom: 4,
  },
  invitationMeta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  reviewButton: {
    marginBottom: spacing.sm,
  },
  invitationHelper: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  blockedPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  blockedText: {
    color: '#DC2626',
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  overduePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  overdueText: {
    color: '#D97706',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  taskTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  assigneeName: {
    fontSize: 13,
    color: colors.textBody,
    fontFamily: fonts.medium,
  },
  taskDueDate: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  blockerNote: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  taskLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: spacing.md,
  },
  purpleLink: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },
  upcomingTaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  upcomingTaskBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  upcomingTaskTextContainer: {
    flex: 1,
  },
  upcomingTaskTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 2,
  },
  upcomingTaskSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  taskStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  pillTodo: {
    backgroundColor: '#F3F4F6',
  },
  textTodo: {
    color: '#4B5563',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  pillReview: {
    backgroundColor: '#E0F2FE',
  },
  textReview: {
    color: '#0284C7',
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  viewTasksLinkContainer: {
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
});
