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
import Checkbox from '../components/Checkbox';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function SettingsScreen() {
  const {
    user,
    notificationPreferences,
    saveSettings,
  } = useApp();

  // QA Specimen toolbar ('default' | 'saved' | 'error')
  const [activeSpecimen, setActiveSpecimen] = useState('default');

  // Profile data form state
  const [name, setName] = useState(user?.name || 'Ada');
  const [goals, setGoals] = useState(
    user?.goals ||
      'Practice defining requirements and coordinating a small product team.'
  );

  // Notification checkboxes state
  const [invitationsOn, setInvitationsOn] = useState(
    notificationPreferences?.invitations ?? true
  );
  const [joinRequestsOn, setJoinRequestsOn] = useState(
    notificationPreferences?.joinRequests ?? true
  );
  const [deadlineRemindersOn, setDeadlineRemindersOn] = useState(
    notificationPreferences?.deadlineReminders ?? true
  );
  const [overduePromptsOn, setOverduePromptsOn] = useState(
    notificationPreferences?.overduePrompts ?? true
  );
  const [roleReleasedOn, setRoleReleasedOn] = useState(
    notificationPreferences?.roleReleased ?? true
  );
  const [weeklyCheckInsOn, setWeeklyCheckInsOn] = useState(
    notificationPreferences?.weeklyCheckIns ?? true
  );
  const [ownerInactivityOn, setOwnerInactivityOn] = useState(
    notificationPreferences?.ownerInactivityPrompts ?? true
  );

  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const updatedPrefs = {
      invitations: invitationsOn,
      joinRequests: joinRequestsOn,
      deadlineReminders: deadlineRemindersOn,
      overduePrompts: overduePromptsOn,
      roleReleased: roleReleasedOn,
      weeklyCheckIns: weeklyCheckInsOn,
      ownerInactivityPrompts: ownerInactivityOn,
    };
    const res = await saveSettings({ name, goals }, updatedPrefs);
    setIsSaving(false);
    if (res.success) {
      setHasSaved(true);
      setActiveSpecimen('saved');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="settings" />
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
              { id: 'saved', label: 'Saved' },
              { id: 'error', label: 'Error' },
            ].map((sp) => (
              <TouchableOpacity
                key={sp.id}
                onPress={() => {
                  setActiveSpecimen(sp.id);
                  if (sp.id === 'saved') setHasSaved(true);
                  if (sp.id === 'default') setHasSaved(false);
                }}
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

        {/* Title & Subtitle */}
        <Text style={styles.mainTitle}>Settings</Text>
        <Text style={styles.subText}>
          Your profile, your notifications, your choices.
        </Text>

        {/* Banner State Specimen */}
        {activeSpecimen === 'error' ? (
          <Banner
            type="error"
            title="Changes didn't save"
            message="Your edits are still here. Previous saved preferences remain active. Please try again."
          />
        ) : activeSpecimen === 'saved' || hasSaved ? (
          <Banner
            type="success"
            title="Settings saved"
            message="Your profile and notification preferences have been saved."
          />
        ) : (
          <Banner
            type="info"
            title="Make these settings yours"
            message="No custom preferences yet. Review the defaults, then save."
          />
        )}

        {/* ========================================================= */}
        {/* 1. PROFILE DATA SECTION                                   */}
        {/* ========================================================= */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Profile data</Text>
          <Text style={styles.sectionSubtitle}>Keep your details up to date.</Text>

          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textSubtle}
          />

          <Text style={styles.fieldLabel}>Goals</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={goals}
            onChangeText={setGoals}
            placeholder="Add your goals"
            placeholderTextColor={colors.textSubtle}
          />

          <TouchableOpacity
            style={styles.skillsProfileLink}
            onPress={() => router.push('/profileandprivacy')}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Edit skills profile</Text>
          </TouchableOpacity>
          <Text style={styles.helperSubtext}>
            Opens your approved Skills Profile form for skills, availability and preferred duration.
          </Text>
        </View>

        {/* ========================================================= */}
        {/* 2. NOTIFICATIONS SECTION                                  */}
        {/* ========================================================= */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Notifications</Text>
          <Text style={styles.sectionSubtitle}>
            Choose each kind of in-app notification. On means enabled.
          </Text>

          <View style={styles.checkboxList}>
            {/* 1. Invitations */}
            <Checkbox
              checked={invitationsOn}
              onChange={setInvitationsOn}
              label={`Invitations · ${invitationsOn ? 'On' : 'Off'}`}
              style={styles.checkboxItem}
            />

            {/* 2. Join requests */}
            <Checkbox
              checked={joinRequestsOn}
              onChange={setJoinRequestsOn}
              label={`Join requests · ${joinRequestsOn ? 'On' : 'Off'}`}
              style={styles.checkboxItem}
            />

            {/* 3. Deadline reminders */}
            <Checkbox
              checked={deadlineRemindersOn}
              onChange={setDeadlineRemindersOn}
              label={`Deadline reminders · ${deadlineRemindersOn ? 'On' : 'Off'}`}
              style={styles.checkboxItem}
            />

            {/* 4. Overdue prompts */}
            <Checkbox
              checked={overduePromptsOn}
              onChange={setOverduePromptsOn}
              label={`Overdue prompts · ${overduePromptsOn ? 'On' : 'Off'}`}
              style={styles.checkboxItem}
            />

            {/* 5. Role-released messages */}
            <Checkbox
              checked={roleReleasedOn}
              onChange={setRoleReleasedOn}
              label={`Role-released messages · ${roleReleasedOn ? 'On' : 'Off'}`}
              style={styles.checkboxItem}
            />

            {/* 6. Weekly check-ins */}
            <Checkbox
              checked={weeklyCheckInsOn}
              onChange={setWeeklyCheckInsOn}
              label={`Weekly check-ins · ${weeklyCheckInsOn ? 'On' : 'Off'}`}
              style={styles.checkboxItem}
            />

            {/* 7. Owner inactivity prompts */}
            <View style={styles.checkboxItem}>
              <Checkbox
                checked={ownerInactivityOn}
                onChange={setOwnerInactivityOn}
                label={`Owner inactivity prompts · ${ownerInactivityOn ? 'On' : 'Off'}`}
              />
              <Text style={styles.checkboxSubtext}>Only for projects you own.</Text>
            </View>
          </View>

          <Text style={styles.prefsFooterNote}>
            {hasSaved ? 'Changes apply after you save.' : 'Default choices · Not saved yet'}
          </Text>

          <Button
            title="Save changes"
            loading={isSaving}
            loadingText="Saving changes..."
            onPress={handleSave}
            style={{ marginTop: spacing.md }}
          />
          <Text style={styles.buttonNote}>Saves profile and notification choices</Text>
        </View>

        {/* ========================================================= */}
        {/* 3. ACCOUNT CONTROLS SECTION                               */}
        {/* ========================================================= */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Account controls</Text>
          <Text style={styles.sectionSubtitle}>{"You're in control of your account."}</Text>

          <Button
            title="Request account deletion"
            variant="outline"
            onPress={() => router.push('/account-deletion')}
            style={{ marginTop: spacing.xs }}
          />
          <Text style={styles.accountControlSubtext}>
            {"You'll review and confirm before a request is sent."}
          </Text>

          <Button
            title="Sign out"
            variant="outline"
            onPress={() => router.push('/sign-in')}
            style={{ marginTop: spacing.md }}
          />
        </View>
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
  subText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textHeading,
  },
  sectionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textHeading,
    marginBottom: 6,
    marginTop: spacing.xs,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  skillsProfileLink: {
    marginTop: 4,
    marginBottom: 4,
  },
  linkText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  helperSubtext: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  checkboxList: {
    marginTop: spacing.xs,
  },
  checkboxItem: {
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  checkboxSubtext: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 32,
    marginTop: -2,
    marginBottom: 6,
  },
  prefsFooterNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  buttonNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  accountControlSubtext: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
