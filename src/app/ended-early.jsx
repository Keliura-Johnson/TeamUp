import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function EndedEarlyScreen() {
  const { activePersona, completionState } = useApp();
  const record = completionState.endedEarlyRecord;

  return (
    <View style={styles.container}>
      <Header activeMenuItem="projectpage" rightText="Menu" />
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
          <Text style={styles.breadcrumbCurrent}>Campus Marketplace</Text>
        </View>

        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>
            Ended Early · 12 Nov 2026 · Planned 19 Oct–30 Nov · 6 weeks
          </Text>
          <View style={styles.sectionTagRow}>
            <Text style={styles.sectionTagLabel}>Project section:</Text>
            <View style={styles.sectionTagBadge}>
              <Text style={styles.sectionTagText}>Project record</Text>
            </View>
          </View>
          <Text style={styles.pageHeading}>Ended Early record</Text>
          <Text style={styles.datesMeta}>12 Nov 2026 · Viewing as {activePersona}</Text>
        </View>

        {/* Ended Early Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Ended Early not Completed</Text>
          <Text style={styles.bannerSubtitle}>
            Project ended before the planned finish. Tasks, artifacts, comments and history
            preserved.
          </Text>
        </View>

        {/* Project Record & Team */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Project record</Text>
          <Text style={styles.recordMeta}>
            Team joined 19 Oct 2026 · Planned 19 Oct–30 Nov · 6 weeks
          </Text>

          <View style={styles.teamList}>
            <View style={styles.teamMemberItem}>
              <Text style={styles.teamMemberName}>Ada</Text>
              <Text style={styles.teamMemberRole}>Product manager / Owner</Text>
            </View>
            <View style={styles.teamMemberItem}>
              <Text style={styles.teamMemberName}>David</Text>
              <Text style={styles.teamMemberRole}>UI/UX Designer</Text>
            </View>
            <View style={styles.teamMemberItem}>
              <Text style={styles.teamMemberName}>John</Text>
              <Text style={styles.teamMemberRole}>Frontend Developer</Text>
            </View>
          </View>

          <View style={styles.preservedTasksSummary}>
            <Text style={styles.summaryLabel}>Preserved task record</Text>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>2 of 6 Done</Text>
            </View>
          </View>

          <View style={styles.milestoneList}>
            {record.milestones.map((m, idx) => (
              <View key={idx} style={styles.milestoneRow}>
                <Text style={styles.milestoneCheck}>
                  {m.done === m.total ? '✓' : '○'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.milestoneName}>{m.name}</Text>
                  <Text style={styles.milestoneTarget}>target {m.target}</Text>
                </View>
                <Text
                  style={[
                    styles.milestoneScore,
                    m.done > 0 && { color: '#15803D', fontWeight: '700' },
                  ]}
                >
                  {m.done}/{m.total} Done
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Preserved Completed Work (Done Tasks) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preserved completed work</Text>
          <Text style={styles.cardSubtitle}>
            Two task records preserved. No Completed project page created.
          </Text>

          {record.preservedTasks.map((t) => (
            <View key={t.id} style={styles.doneTaskCard}>
              <View style={styles.taskHeaderRow}>
                <View style={styles.donePill}>
                  <Text style={styles.donePillText}>Done</Text>
                </View>
                <Text style={styles.doneTaskTitle}>{t.title}</Text>
              </View>
              <Text style={styles.doneTaskMeta}>
                Owner: {t.owner} · Due: {t.dueDate} · {t.milestone}
              </Text>
              <Text style={styles.doneTaskEvidence}>
                Completed {t.completedDate} · Evidence: {t.evidence}
              </Text>
              <TouchableOpacity
                style={styles.openEvidenceBtn}
                onPress={() =>
                  Alert.alert('Preserved Evidence', `Opening: ${t.evidence}`)
                }
              >
                <Text style={styles.openEvidenceText}>📄 Open {t.evidence}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Unfinished Task Records */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Unfinished task records</Text>
          <Text style={styles.cardSubtitle}>
            Tasks retain exact status, due date, assignee and blocker context.
          </Text>

          {record.unfinishedTasks.map((ut) => (
            <View key={ut.id} style={styles.unfinishedTaskCard}>
              <View style={styles.taskHeaderRow}>
                <View
                  style={[
                    styles.statusPill,
                    ut.status === 'Blocked'
                      ? styles.statusPillBlocked
                      : ut.status === 'In progress'
                      ? styles.statusPillProgress
                      : ut.status === 'In review'
                      ? styles.statusPillReview
                      : styles.statusPillTodo,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      ut.status === 'Blocked'
                        ? styles.statusPillTextBlocked
                        : ut.status === 'In progress'
                        ? styles.statusPillTextProgress
                        : ut.status === 'In review'
                        ? styles.statusPillTextReview
                        : styles.statusPillTextTodo,
                    ]}
                  >
                    {ut.status}
                  </Text>
                </View>
                <Text style={styles.unfinishedTitle}>{ut.title}</Text>
              </View>
              <Text style={styles.unfinishedMeta}>
                Owner: {ut.owner} · Due: {ut.dueDate} · {ut.milestone}
              </Text>
              {ut.blocker ? (
                <Text style={styles.blockerText}>Blocker: {ut.blocker}</Text>
              ) : (
                <Text style={styles.retainedText}>Saved task status retained.</Text>
              )}
            </View>
          ))}
        </View>

        {/* Preservation Guarantee Note */}
        <View style={styles.guaranteeCard}>
          <Text style={styles.guaranteeTitle}>Preservation Guarantee</Text>
          <Text style={styles.guaranteeBody}>
            Safe local input, all tasks and history are retained. No closure occurred
            without confirmation. The saved status and task history remain immutable.
          </Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push('/myprojects')}
          >
            <Text style={styles.backBtnText}>← Back to My Projects</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  banner: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#92400E',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#78350F',
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 10,
  },
  recordMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  teamList: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    gap: 6,
  },
  teamMemberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamMemberName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  teamMemberRole: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
  },
  preservedTasksSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: '#334155',
  },
  summaryBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#15803D',
  },
  milestoneList: {
    gap: 6,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  milestoneCheck: {
    fontSize: 13,
    color: '#15803D',
    fontFamily: fonts.bold,
    marginRight: 8,
  },
  milestoneName: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  milestoneTarget: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: '#64748B',
  },
  milestoneScore: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  doneTaskCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  donePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  donePillText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#15803D',
  },
  doneTaskTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  doneTaskMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  doneTaskEvidence: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#334155',
    marginBottom: 6,
  },
  openEvidenceBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  openEvidenceText: {
    fontSize: 11,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  unfinishedTaskCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillBlocked: {
    backgroundColor: '#FEE2E2',
  },
  statusPillTextBlocked: {
    color: '#DC2626',
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  statusPillProgress: {
    backgroundColor: '#E0F2FE',
  },
  statusPillTextProgress: {
    color: '#0284C7',
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  statusPillReview: {
    backgroundColor: '#FEF3C7',
  },
  statusPillTextReview: {
    color: '#D97706',
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  statusPillTodo: {
    backgroundColor: '#F1F5F9',
  },
  statusPillTextTodo: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  unfinishedTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  unfinishedMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  blockerText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
    fontFamily: fonts.medium,
  },
  retainedText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  guaranteeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  guaranteeBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 13,
  },
});
