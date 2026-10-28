import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

export default function TeamHealthScreen() {
  const {
    activePersona,
    teamHealthData,
    workspaceUpdates,
    sendInactivityFollowUp,
    sendWeeklyCheckIn,
    isFollowUpSent,
    isWeeklyCheckInSent,
  } = useApp();

  // QA Specimen switcher ('default' | 'loading')
  const [activeSpecimen, setActiveSpecimen] = useState('default');

  // Follow-up state
  const [isComposingFollowUp, setIsComposingFollowUp] = useState(false);
  const [followUpText, setFollowUpText] = useState(
    teamHealthData?.inactiveMember?.defaultFollowUpMessage ||
      '@John, how are things going? Is there anything we can help with, or would a different commitment work better?'
  );
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);
  const [followUpSuccess, setFollowUpSuccess] = useState(isFollowUpSent);

  // Weekly check-in state
  const [isComposingWeekly, setIsComposingWeekly] = useState(false);
  const [weeklyText, setWeeklyText] = useState(
    teamHealthData?.weeklyCheckIn?.defaultMessage ||
      "We agreed the requirements. Next, I'll help unblock sign-up fields. Could we review them together?"
  );
  const [isSendingWeekly, setIsSendingWeekly] = useState(false);
  const [weeklySuccess, setWeeklySuccess] = useState(isWeeklyCheckInSent);

  const isOwner = activePersona === 'Ada';

  const handleSendFollowUp = async () => {
    if (!followUpText.trim()) return;
    setIsSendingFollowUp(true);
    const res = await sendInactivityFollowUp(followUpText);
    setIsSendingFollowUp(false);
    if (res.success) {
      setFollowUpSuccess(true);
      setIsComposingFollowUp(false);
    }
  };

  const handleSendWeekly = async () => {
    if (!weeklyText.trim()) return;
    setIsSendingWeekly(true);
    const res = await sendWeeklyCheckIn(weeklyText);
    setIsSendingWeekly(false);
    if (res.success) {
      setWeeklySuccess(true);
      setIsComposingWeekly(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="teamhealth" />
      <PersonaSwitcher />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Walkthrough Specimen Switcher */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>Walkthrough Specimen:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'default', label: 'Default' },
              { id: 'loading', label: 'Loading (S30.L)' },
            ].map((sp) => (
              <TouchableOpacity
                key={sp.id}
                onPress={() => setActiveSpecimen(sp.id)}
                style={[
                  styles.demoTab,
                  activeSpecimen === sp.id && styles.demoTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.demoTabText,
                    activeSpecimen === sp.id && styles.demoTabTextActive,
                  ]}
                >
                  {sp.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sub-nav row */}
        <View style={styles.subnavBar}>
          <TouchableOpacity onPress={() => router.push('/myprojects')}>
            <Text style={styles.subnavLink}>My Projects</Text>
          </TouchableOpacity>
        </View>

        {/* Screen Title */}
        <Text style={styles.mainTitle}>Team health & check-ins</Text>

        {/* Breadcrumb link */}
        <TouchableOpacity
          onPress={() => router.push('/workspace')}
          style={styles.breadcrumbTouch}
        >
          <Text style={styles.breadcrumbText}>
            My Projects <Text style={styles.breadcrumbSlash}>/</Text> Campus Marketplace{' '}
            <Text style={styles.breadcrumbSlash}>/</Text> Overview
          </Text>
        </TouchableOpacity>

        {/* Project Section Heading */}
        <Text style={styles.projectTitle}>Campus Marketplace</Text>
        <View style={styles.badgeMetaRow}>
          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>In Progress</Text>
          </View>
          <Text style={styles.metaSubtext}>
            {activePersona} · {isOwner ? 'Owner' : 'Member'} · 12 Nov 2026
          </Text>
        </View>

        {/* Tabs Bar: Overview | Tasks | Updates */}
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
            <Text style={[styles.tabItemText, styles.tabItemTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push('/workspace')}
          >
            <Text style={styles.tabItemText}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push('/project-updates')}
          >
            <Text style={styles.tabItemText}>Updates</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* SPECIMEN: LOADING STATE                                   */}
        {/* ========================================================= */}
        {activeSpecimen === 'loading' ? (
          <View>
            <Banner
              type="info"
              title="Loading team health..."
              message="We'll show the status when it's available."
            />
            <Text style={styles.loadingNote}>
              Loading check-ins and activity prompts...
            </Text>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <View style={styles.skeletonTag} />
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonDesc} />
              </View>
            ))}
          </View>
        ) : (
          /* ========================================================= */
          /* DEFAULT / INTERACTIVE VIEW                                */
          /* ========================================================= */
          <View>
            {/* 1. Team Health Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardHeading}>Team health</Text>
                <View style={styles.needsAttentionPill}>
                  <Text style={styles.needsAttentionPillText}>! Needs attention</Text>
                </View>
              </View>

              <Text style={styles.cardSubtitle}>
                A shared team view, not an assessment of individual members.
              </Text>

              {/* Status Levels Row */}
              <View style={styles.statusLevelsRow}>
                <View style={styles.levelPillInactive}>
                  <Text style={styles.levelPillInactiveText}>✓ On track</Text>
                </View>
                <View style={styles.levelPillActiveAmber}>
                  <Text style={styles.levelPillActiveAmberText}>! Needs attention</Text>
                </View>
                <View style={styles.levelPillInactive}>
                  <Text style={styles.levelPillInactiveText}>△ At risk</Text>
                </View>
              </View>

              <Text style={styles.cardFooterNote}>
                Team status levels · No individual scores or rankings
              </Text>
            </View>

            {/* 2. Shared Progress Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Shared progress</Text>
              <Text style={styles.progressSummary}>
                2 of 6 tasks Done · 1 overdue
              </Text>
              <Text style={styles.progressSubtext}>Project remains In Progress.</Text>

              {/* Teammates Avatars */}
              <View style={styles.avatarRow}>
                <View style={[styles.avatarCircle, { backgroundColor: '#EEECFC' }]}>
                  <Text style={[styles.avatarText, { color: '#6336E4' }]}>A</Text>
                </View>
                <View style={[styles.avatarCircle, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={[styles.avatarText, { color: '#0284C7' }]}>D</Text>
                </View>
                <View style={[styles.avatarCircle, { backgroundColor: '#E0F7F4' }]}>
                  <Text style={[styles.avatarText, { color: '#0D9488' }]}>J</Text>
                </View>
              </View>

              <Text style={styles.teammatesLabel}>
                Ada, David and John · Accepted teammates
              </Text>

              <Button
                title="View tasks"
                variant="outline"
                onPress={() => router.push('/workspace')}
                style={{ marginTop: spacing.md }}
              />
            </View>

            {/* 3. Owner Only: Inactivity Prompt Card */}
            {isOwner && (
              <View style={styles.card}>
                <Text style={styles.cardTagHeader}>
                  OWNER ONLY · INACTIVITY PROMPT
                </Text>

                {followUpSuccess ? (
                  <View>
                    <Banner
                      type="success"
                      title="Follow-up posted to Updates"
                      message="Message posted to team thread. John's role remains active."
                    />
                    <Text style={styles.checkedInNote}>
                      You checked in with John. No role change requested.
                    </Text>
                    <Button
                      title="Open team Updates"
                      variant="outline"
                      onPress={() => router.push('/project-updates')}
                      style={{ marginTop: spacing.sm }}
                    />
                  </View>
                ) : isComposingFollowUp ? (
                  /* Form View matching frame_035.jpg */
                  <View style={styles.followUpFormBox}>
                    <Text style={styles.notReleaseTag}>NOT A ROLE RELEASE</Text>
                    <Text style={styles.followUpTitle}>Check in with John</Text>
                    <Text style={styles.followUpSubtitle}>
                      No activity for 5 days. Ask what would help, without making
                      assumptions.
                    </Text>

                    <Text style={styles.fieldLabel}>Message in team Updates</Text>
                    <TextInput
                      style={styles.textArea}
                      multiline
                      numberOfLines={3}
                      value={followUpText}
                      onChangeText={setFollowUpText}
                      placeholder="Ask what would help..."
                      placeholderTextColor={colors.textSubtle}
                    />

                    <Text style={styles.helperSubtext}>
                      {"Visible in the team Updates thread. John's role stays unchanged."}
                    </Text>

                    <View style={styles.buttonRow}>
                      <View style={{ flex: 1, marginRight: spacing.sm }}>
                        <Button
                          title="Send follow-up"
                          loading={isSendingFollowUp}
                          loadingText="Sending..."
                          onPress={handleSendFollowUp}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button
                          title="Cancel"
                          variant="outline"
                          onPress={() => setIsComposingFollowUp(false)}
                        />
                      </View>
                    </View>

                    <Text style={styles.formFooterNote}>
                      2 of 6 tasks Done · 1 overdue · Contribution history retained
                    </Text>
                  </View>
                ) : (
                  /* Initial prompt card matching frame_021.jpg */
                  <View>
                    <Text style={styles.inactivityTitle}>
                      A gentle check-in with John
                    </Text>
                    <Text style={styles.inactivityDesc}>
                      John has had no activity for 5 days. They may need support or a
                      different commitment.
                    </Text>

                    <View style={styles.buttonRow}>
                      <View style={{ flex: 1, marginRight: spacing.sm }}>
                        <Button
                          title="Follow up"
                          onPress={() => setIsComposingFollowUp(true)}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button
                          title="Release role"
                          variant="outline"
                          onPress={() => router.push('/release-role')}
                        />
                      </View>
                    </View>

                    <Text style={styles.helperSubtext}>
                      Following up does not release a role. Release needs your
                      confirmation.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* 4. Weekly Check-in Card (frame_022.jpg & frame_026.jpg) */}
            <View style={styles.card}>
              <Text style={styles.cardTagHeader}>
                WEEKLY CHECK-IN · {teamHealthData?.weeklyCheckIn?.period || '9–15 NOV'}
              </Text>
              <Text style={styles.weeklyTitle}>How is the team doing?</Text>
              <Text style={styles.weeklyDesc}>
                {"Share what moved forward, what's next and where support would help."}
              </Text>

              {weeklySuccess ? (
                <View>
                  <Banner
                    type="success"
                    title="Check-in posted"
                    message="Your weekly check-in has been shared in Updates."
                  />
                  <Button
                    title="View team Updates"
                    variant="outline"
                    onPress={() => router.push('/project-updates')}
                  />
                </View>
              ) : isComposingWeekly ? (
                <View style={{ marginTop: spacing.sm }}>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={3}
                    value={weeklyText}
                    onChangeText={setWeeklyText}
                    placeholder="Share what moved forward..."
                    placeholderTextColor={colors.textSubtle}
                  />
                  <Text style={styles.helperSubtext}>
                    Posts to Campus Marketplace → Updates. Visible to your accepted team.
                  </Text>
                  <View style={styles.buttonRow}>
                    <View style={{ flex: 1, marginRight: spacing.sm }}>
                      <Button
                        title="Post check-in"
                        loading={isSendingWeekly}
                        loadingText="Posting..."
                        onPress={handleSendWeekly}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        title="Cancel"
                        variant="outline"
                        onPress={() => setIsComposingWeekly(false)}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                <Button
                  title="Open team Updates"
                  onPress={() => setIsComposingWeekly(true)}
                  style={{ marginTop: spacing.sm }}
                />
              )}
            </View>

            {/* 5. Updates · Team Thread Preview */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardHeading}>Updates · Team thread</Text>
                <TouchableOpacity onPress={() => router.push('/project-updates')}>
                  <Text style={styles.subnavLink}>View all</Text>
                </TouchableOpacity>
              </View>

              {workspaceUpdates.slice(0, 3).map((u) => {
                const avatarColor =
                  u.author === 'David'
                    ? '#0284C7'
                    : u.author === 'Ada'
                    ? '#6336E4'
                    : '#0D9488';
                const avatarBg =
                  u.author === 'David'
                    ? '#E0F2FE'
                    : u.author === 'Ada'
                    ? '#EEECFC'
                    : '#E0F7F4';

                return (
                  <View key={u.id} style={styles.updateItem}>
                    <View style={styles.updateHeaderRow}>
                      <View style={[styles.miniAvatar, { backgroundColor: avatarBg }]}>
                        <Text style={[styles.miniAvatarText, { color: avatarColor }]}>
                          {u.initial || u.author.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.updateMeta}>
                        <Text style={styles.updateAuthor}>{u.author}</Text>
                        <Text style={styles.updateDate}>{u.date}</Text>
                      </View>
                    </View>
                    <Text style={styles.updateBody}>{u.text}</Text>
                  </View>
                );
              })}
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
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl + 20,
  },
  demoBar: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.md,
  },
  demoLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  demoScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  demoTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  demoTabText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textHeading,
  },
  demoTabTextActive: {
    color: colors.textWhite,
  },
  subnavBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  subnavLink: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  mainTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textHeading,
    marginTop: spacing.xs,
  },
  breadcrumbTouch: {
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  breadcrumbText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  breadcrumbSlash: {
    color: colors.textSubtle,
  },
  projectTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textHeading,
    marginTop: spacing.sm,
  },
  badgeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  progressPill: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  progressPillText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
  metaSubtext: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  },
  tabItem: {
    paddingVertical: 8,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabItemText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  tabItemTextActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardHeading: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textHeading,
  },
  needsAttentionPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  needsAttentionPillText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: '#D97706',
  },
  cardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  statusLevelsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  levelPillInactive: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelPillInactiveText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  levelPillActiveAmber: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#D97706',
  },
  levelPillActiveAmberText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#D97706',
  },
  cardFooterNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  progressSummary: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textHeading,
    marginTop: 2,
  },
  progressSubtext: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  teammatesLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  cardTagHeader: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  inactivityTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textHeading,
    marginBottom: 4,
  },
  inactivityDesc: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  helperSubtext: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },
  followUpFormBox: {
    marginTop: 2,
  },
  notReleaseTag: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  followUpTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textHeading,
    marginBottom: 2,
  },
  followUpSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textHeading,
    marginBottom: 6,
  },
  textArea: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
  },
  formFooterNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  checkedInNote: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    marginBottom: spacing.sm,
  },
  weeklyTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textHeading,
    marginBottom: 4,
  },
  weeklyDesc: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  updateItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  updateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  miniAvatarText: {
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  updateMeta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateAuthor: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textHeading,
  },
  updateDate: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  updateBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
    marginTop: 2,
  },
  loadingNote: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  skeletonTag: {
    width: 120,
    height: 14,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: 8,
  },
  skeletonTitle: {
    width: '60%',
    height: 18,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: 8,
  },
  skeletonDesc: {
    width: '90%',
    height: 14,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
  },
});
