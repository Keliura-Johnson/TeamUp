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
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Banner from '../components/Banner';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function ProfileAndPrivacyScreen() {
  const { user, visibility, updateVisibility } = useApp();

  const [draftVisibility, setDraftVisibility] = useState({
    name: visibility.name ?? false,
    role: visibility.role ?? false,
    skills: visibility.skills ?? false,
    skillLevel: visibility.skillLevel ?? false,
    goals: visibility.goals ?? false,
    availability: visibility.availability ?? false,
    duration: visibility.duration ?? false,
  });

  const [displayProject, setDisplayProject] = useState(
    visibility.displayProject ?? false
  );

  const [activeState, setActiveState] = useState('default'); // 'default' | 'save_error' | 'save_success'
  const [isSaving, setIsSaving] = useState(false);

  const toggleDraft = (key) => {
    setDraftVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visitorFields = [
    { key: 'name', label: 'Show name publicly' },
    { key: 'role', label: 'Show professional role publicly' },
    { key: 'skills', label: 'Show skills publicly' },
    { key: 'skillLevel', label: 'Show skill level publicly' },
    { key: 'goals', label: 'Show goals publicly' },
    { key: 'availability', label: 'Show weekly availability publicly' },
    { key: 'duration', label: 'Show preferred project duration publicly' },
  ];

  const handleSaveVisibility = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateVisibility({
        ...draftVisibility,
        displayProject,
      });
      setActiveState('save_success');
    }, 400);
  };

  // Derive dynamic summary of saved choices
  const publicCount = Object.values(draftVisibility).filter(Boolean).length;
  const savedChoicesText =
    publicCount === 0
      ? 'Saved choices: all profile fields private.'
      : `Saved: ${publicCount} selected field${publicCount > 1 ? 's' : ''} public. Other fields private.`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        rightText="Menu"
        activeMenuItem="profile"
      />
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
              { id: 'save_error', label: 'Save Err' },
              { id: 'save_success', label: 'S05.S' },
            ].map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => setActiveState(st.id)}
                style={[styles.demoTab, activeState === st.id && styles.demoTabActive]}
              >
                <Text style={[styles.demoTabText, activeState === st.id && styles.demoTabTextActive]}>
                  {st.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.mainTitle}>Profile and privacy</Text>
        <Text style={styles.subText}>Choose what is public.</Text>

        {/* 1. Your Profile Details Card */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </Text>
            </View>
            <Text style={styles.userNameRole}>
              {user.name || 'Ada'} · {user.role || 'Product Manager'}
            </Text>
          </View>

          <Text style={styles.cardSectionTitle}>Your profile details</Text>

          <Text style={styles.detailTextBold}>
            {user.skills && user.skills.length > 0
              ? user.skills
                  .map((s) =>
                    s === 'planning'
                      ? 'Product planning'
                      : s === 'research'
                      ? 'User research'
                      : s === 'coordination'
                      ? 'Product coordination'
                      : s
                  )
                  .join(' · ')
              : 'Product planning · User research'}
          </Text>

          <Text style={styles.detailTextSub}>
            Skill level: {user.skillLevel || 'Beginner'} · self-reported
          </Text>

          <Text style={[styles.detailTextBold, { marginTop: spacing.md }]}>
            {user.goals ||
              'Practice defining requirements and coordinating a small product team.'}
          </Text>

          <Text style={[styles.detailTextSub, { marginTop: spacing.md }]}>
            Availability: {user.weeklyAvailability || '5 hours/week'}
          </Text>
          <Text style={styles.detailTextSub}>
            Preferred duration: {user.projectDuration || '6 weeks'}
          </Text>
        </View>

        {/* 2. Contact Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Contact details</Text>
          <Text style={styles.detailTextBold}>{user.email || 'ada@example.org'}</Text>
          <Text style={[styles.detailTextSub, { marginTop: spacing.sm }]}>
            Contact details: accepted teammates only, not visitors or pending invitees.
          </Text>
        </View>

        {/* 3. Discovery Preferences Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Discovery preferences</Text>
          <Text style={styles.detailTextBold}>Not yet provided</Text>
          <Text style={[styles.detailTextSub, { marginTop: spacing.sm }]}>
            Interests and collaboration preferences are asked when you first discover projects.
          </Text>
        </View>

        {/* 4. Completed Projects Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Completed projects</Text>
          <Text style={styles.detailTextSub}>Completed 30 Nov 2026</Text>

          <Text style={[styles.detailTextBold, { fontSize: 16, marginTop: 6 }]}>
            Campus Marketplace
          </Text>
          <Text style={styles.detailTextSub}>
            Product Manager & Owner · 19 Oct–30 Nov 2026
          </Text>

          <Text style={[styles.detailTextSub, { marginTop: spacing.sm }]}>
            Contribution: defined requirements and coordinated the project team.
          </Text>

          <Text style={[styles.detailTextSub, { marginTop: spacing.sm, marginBottom: spacing.md }]}>
            Private on your profile · Team-page sharing unchanged
          </Text>

          <Button
            title="View private project page"
            variant="outline"
            onPress={() => Alert.alert('Private Project Page', 'Campus Marketplace archive details.')}
          />
        </View>

        {/* 5. What Visitors Can See Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>What visitors can see</Text>
          <Text style={[styles.detailTextSub, { marginBottom: spacing.md }]}>
            Choose the fields to display publicly. Contact stays same-team only.
          </Text>

          {activeState === 'save_error' && (
            <Banner
              type="error"
              title="Visibility did not save"
              message="Save failed. Your selections are retained for retry. Visitors still see no profile fields."
            />
          )}

          {activeState === 'save_success' && (
            <Banner
              type="success"
              title="Visibility saved"
              message={
                publicCount > 0
                  ? 'Selected profile fields are now public. Other fields remain private.'
                  : 'All profile fields remain private.'
              }
            />
          )}

          {visitorFields.map(({ key, label }) => (
            <Checkbox
              key={key}
              label={label}
              checked={draftVisibility[key]}
              onChange={() => toggleDraft(key)}
            />
          ))}

          <Text style={[styles.detailTextSub, { marginTop: spacing.md }]}>
            {savedChoicesText}
          </Text>

          {/* Completed Project Appearance */}
          <Text style={[styles.cardSectionTitle, { marginTop: spacing.xl }]}>
            Completed-project appearance
          </Text>

          <Checkbox
            label="Display Campus Marketplace on my profile"
            checked={displayProject}
            onChange={setDisplayProject}
          />

          <Text style={[styles.detailTextSub, { marginTop: spacing.xs }]}>
            Saved: {displayProject ? 'on' : 'off'}. Changes your profile only; team-page sharing is unchanged.
          </Text>

          <Button
            title={activeState === 'save_error' ? 'Retry visibility save' : 'Save visibility'}
            onPress={handleSaveVisibility}
            loading={isSaving}
            loadingText="Saving visibility..."
            style={styles.primaryButton}
          />
        </View>

        {/* 6. Public Preview Card */}
        <View style={styles.card}>
          <Text style={styles.previewTag}>Public preview · read only</Text>

          {publicCount === 0 && !displayProject ? (
            <>
              <Text style={[styles.cardSectionTitle, { marginTop: 6 }]}>
                Profile details are private
              </Text>
              <Text style={[styles.detailTextSub, { marginTop: spacing.sm }]}>
                This person has not chosen to share profile details publicly.
              </Text>
              <Text style={[styles.detailTextSub, { marginTop: spacing.sm }]}>
                Contact details are never displayed to visitors.
              </Text>
            </>
          ) : (
            <View style={styles.publicContent}>
              {draftVisibility.name && (
                <Text style={styles.previewName}>{user.name || 'Ada'}</Text>
              )}
              {draftVisibility.role && (
                <Text style={styles.previewRole}>{user.role || 'Product Manager'}</Text>
              )}
              {draftVisibility.skills && (
                <Text style={styles.previewDetail}>
                  Skills:{' '}
                  {user.skills && user.skills.length > 0
                    ? user.skills.join(', ')
                    : 'Product planning, User research'}
                </Text>
              )}
              {draftVisibility.skillLevel && (
                <Text style={styles.previewDetail}>Level: {user.skillLevel || 'Beginner'}</Text>
              )}
              {draftVisibility.goals && (
                <Text style={styles.previewDetail}>Goals: {user.goals}</Text>
              )}
              {draftVisibility.availability && (
                <Text style={styles.previewDetail}>
                  Availability: {user.weeklyAvailability || '5 hours/week'}
                </Text>
              )}
              {draftVisibility.duration && (
                <Text style={styles.previewDetail}>
                  Duration: {user.projectDuration || '6 weeks'}
                </Text>
              )}
              {displayProject && (
                <View style={styles.previewProjectBadge}>
                  <Text style={styles.previewProjectTitle}>Project: Campus Marketplace</Text>
                </View>
              )}
              <Text style={[styles.detailTextSub, { marginTop: spacing.md }]}>
                Contact details are never displayed to visitors.
              </Text>
            </View>
          )}
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
    marginBottom: 2,
  },
  demoTab: {
    paddingVertical: 4,
    paddingHorizontal: 10,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  userNameRole: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  cardSectionTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  detailTextBold: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    lineHeight: 20,
  },
  detailTextSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: spacing.md,
  },
  previewTag: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
    marginBottom: spacing.xs,
  },
  publicContent: {
    marginTop: spacing.sm,
  },
  previewName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  previewRole: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  previewDetail: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    marginTop: 2,
  },
  previewProjectBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  previewProjectTitle: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
  },
});
