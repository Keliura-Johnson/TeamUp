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

export default function PrivateProjectPageScreen() {
  const { activePersona, completionState } = useApp();

  const isTeammate =
    ['ada', 'david', 'john'].includes(String(activePersona).toLowerCase());

  const davidSummary = completionState.memberSummaries.david;
  const adaSummary = completionState.memberSummaries.ada;
  const johnSummary = completionState.memberSummaries.john;

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

        {/* Non-teammate Guard Check */}
        {!isTeammate ? (
          <View style={styles.nonTeammateCard}>
            <Text style={styles.nonTeammateTitle}>This project page is private</Text>
            <Text style={styles.nonTeammateBody}>
              Only accepted teammates can view this page. No project evidence is shown to you.
            </Text>
            <TouchableOpacity
              style={styles.backToProjectsBtn}
              onPress={() => router.push('/myprojects')}
            >
              <Text style={styles.backToProjectsBtnText}>Back to My Projects</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Header Block */}
            <View style={styles.headerBlock}>
              <Text style={styles.projectTitle}>Campus Marketplace</Text>
              <Text style={styles.projectSubtitle}>
                Completed · PRIVATE · {activePersona} · Teammate
              </Text>
              <View style={styles.sectionTagRow}>
                <Text style={styles.sectionTagLabel}>Project section:</Text>
                <View style={styles.sectionTagBadge}>
                  <Text style={styles.sectionTagText}>Project page</Text>
                </View>
              </View>
              <Text style={styles.pageHeading}>Private project page</Text>
              <Text style={styles.datesMeta}>30 Nov 2026 · 19 Oct–30 Nov · 6 weeks</Text>
            </View>

            {/* Status Banner */}
            <View style={styles.statusBanner}>
              <Text style={styles.statusBannerTitle}>Completed · PRIVATE · Team-only</Text>
              <Text style={styles.statusBannerSubtitle}>
                Outcome, at least one deliverable and all 3 member confirmations saved.
                Profiles remain unchanged.
              </Text>
            </View>

            {/* Collective Outcome */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Collective outcome</Text>
              <Text style={styles.outcomeText}>
                {completionState.finalOutcome ||
                  'Delivered a responsive marketplace prototype, implemented sign-up and project browsing, and documented the build.'}
              </Text>
              <Text style={styles.outcomeMeta}>
                Completed 30 Nov 2026 · 19 Oct–30 Nov · 6 weeks
              </Text>
            </View>

            {/* The Team */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>The team</Text>
              <View style={styles.teamMemberList}>
                {/* Ada */}
                <View style={styles.teamMemberRow}>
                  <View style={styles.memberAvatarA}>
                    <Text style={styles.memberAvatarTextA}>A</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teamMemberName}>Ada</Text>
                    <Text style={styles.teamMemberRole}>
                      Product manager · Owner
                    </Text>
                  </View>
                </View>

                {/* David */}
                <View style={styles.teamMemberRow}>
                  <View style={styles.memberAvatarD}>
                    <Text style={styles.memberAvatarTextD}>D</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teamMemberName}>David</Text>
                    <Text style={styles.teamMemberRole}>UI/UX Designer</Text>
                  </View>
                </View>

                {/* John */}
                <View style={styles.teamMemberRow}>
                  <View style={styles.memberAvatarJ}>
                    <Text style={styles.memberAvatarTextJ}>J</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teamMemberName}>John</Text>
                    <Text style={styles.teamMemberRole}>Frontend Developer</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.allJoinedNote}>All joined 19 Oct 2026.</Text>
            </View>

            {/* Project deliverables */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Project deliverables</Text>
              <Text style={styles.deliverablesSubtitle}>Project evidence</Text>

              {completionState.deliverables.map((del) => (
                <View key={del.id} style={styles.deliverableItem}>
                  <Text style={styles.delIcon}>
                    {del.type === 'File' ? '📄' : '🔗'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.delFileName}>{del.fileName}</Text>
                    <Text style={styles.delMeta}>
                      Saved project deliverable ({del.type})
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.openDelBtn}
                    onPress={() =>
                      Alert.alert(
                        'Project Deliverable',
                        `Viewing: ${del.fileName}`
                      )
                    }
                  >
                    <Text style={styles.openDelBtnText}>Open</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={styles.delRuleNote}>
                Completion requires at least one link OR file, not two.
              </Text>
            </View>

            {/* Individual Contributions (6 Attributable Task Records) */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Individual contributions</Text>
              <Text style={styles.contributionsSubtitle}>
                Individual summaries reflect saved Done tasks, separate from the team
                outcome.
              </Text>

              {/* Ada's Contribution */}
              <View style={styles.memberContributionBlock}>
                <View style={styles.memberContribHeader}>
                  <View style={styles.memberAvatarA}>
                    <Text style={styles.memberAvatarTextA}>A</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contribName}>Ada</Text>
                    <Text style={styles.contribRole}>Product manager · Owner</Text>
                  </View>
                  <Text style={styles.contribBadge}>2 Done tasks</Text>
                </View>
                <Text style={styles.contribWording}>
                  {adaSummary.wording}
                </Text>
                <View style={styles.taskMiniList}>
                  {adaSummary.doneTasks.map((t) => (
                    <View key={t.id} style={styles.taskMiniItem}>
                      <Text style={styles.taskMiniDone}>✓</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.taskMiniTitle}>{t.title}</Text>
                        <Text style={styles.taskMiniMeta}>
                          {t.dueDate} · {t.milestone} · Evidence: {t.evidence}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* David's Contribution */}
              <View style={styles.memberContributionBlock}>
                <View style={styles.memberContribHeader}>
                  <View style={styles.memberAvatarD}>
                    <Text style={styles.memberAvatarTextD}>D</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contribName}>David</Text>
                    <Text style={styles.contribRole}>UI/UX Designer</Text>
                  </View>
                  <Text style={styles.contribBadge}>2 Done tasks</Text>
                </View>
                <Text style={styles.contribWording}>
                  {davidSummary?.wording || 'Designed onboarding and prepared the UI handoff.'}
                </Text>
                {davidSummary?.note ? (
                  <Text style={styles.contribNote}>
                    Note: {davidSummary.note}
                  </Text>
                ) : null}
                <View style={styles.taskMiniList}>
                  {davidSummary.doneTasks.map((t) => (
                    <View key={t.id} style={styles.taskMiniItem}>
                      <Text style={styles.taskMiniDone}>✓</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.taskMiniTitle}>{t.title}</Text>
                        <Text style={styles.taskMiniMeta}>
                          {t.dueDate} · {t.milestone} · Evidence: {t.evidence}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* John's Contribution */}
              <View style={styles.memberContributionBlock}>
                <View style={styles.memberContribHeader}>
                  <View style={styles.memberAvatarJ}>
                    <Text style={styles.memberAvatarTextJ}>J</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contribName}>John</Text>
                    <Text style={styles.contribRole}>Frontend Developer</Text>
                  </View>
                  <Text style={styles.contribBadge}>2 Done tasks</Text>
                </View>
                <Text style={styles.contribWording}>
                  {johnSummary.wording}
                </Text>
                <View style={styles.taskMiniList}>
                  {johnSummary.doneTasks.map((t) => (
                    <View key={t.id} style={styles.taskMiniItem}>
                      <Text style={styles.taskMiniDone}>✓</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.taskMiniTitle}>{t.title}</Text>
                        <Text style={styles.taskMiniMeta}>
                          {t.dueDate} · {t.milestone} · Evidence: {t.evidence}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Sharing Settings Button */}
            <View style={styles.actionCard}>
              <Text style={styles.actionCardTitle}>Sharing & Privacy</Text>
              <Text style={styles.actionCardBody}>
                Configure whether this project is displayed on your personal profile or
                test preview link mode.
              </Text>
              <TouchableOpacity
                style={styles.sharingSettingsBtn}
                onPress={() => router.push('/project-privacy')}
              >
                <Text style={styles.sharingSettingsBtnText}>
                  Sharing settings →
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

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
  statusBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statusBannerTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#065F46',
    marginBottom: 4,
  },
  statusBannerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#334155',
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
    marginBottom: 6,
  },
  outcomeText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 8,
  },
  outcomeMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
  },
  teamMemberList: {
    gap: 8,
    marginTop: 6,
  },
  teamMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memberAvatarA: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#EEECFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarTextA: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#6336E4',
  },
  memberAvatarD: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarTextD: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#0284C7',
  },
  memberAvatarJ: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#E0F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarTextJ: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#0D9488',
  },
  teamMemberName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  teamMemberRole: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
  },
  allJoinedNote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    fontStyle: 'italic',
  },
  deliverablesSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  deliverableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  delIcon: {
    fontFamily: fonts.regular,
    fontSize: 18,
    marginRight: 10,
  },
  delFileName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  delMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  openDelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
  },
  openDelBtnText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  delRuleNote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 6,
  },
  contributionsSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 12,
  },
  memberContributionBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  memberContribHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contribName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  contribRole: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  contribBadge: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#15803D',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  contribWording: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
    marginBottom: 6,
  },
  contribNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  taskMiniList: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    gap: 6,
  },
  taskMiniItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  taskMiniDone: {
    color: '#15803D',
    fontSize: 12,
    fontFamily: fonts.bold,
    marginTop: 1,
  },
  taskMiniTitle: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  taskMiniMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  actionCardTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  actionCardBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 10,
  },
  sharingSettingsBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  sharingSettingsBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  nonTeammateCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  nonTeammateTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#991B1B',
  },
  nonTeammateBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#7F1D1D',
    textAlign: 'center',
    lineHeight: 18,
  },
  backToProjectsBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radius.sm,
  },
  backToProjectsBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 13,
  },
});
