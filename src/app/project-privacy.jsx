import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function ProjectPrivacyScreen() {
  const {
    activePersona,
    completionState,
    saveSharingPrivacy,
    togglePreviewLinkMode,
  } = useApp();

  const isOwner = String(activePersona).toLowerCase() === 'ada';

  const currentProfileChoice = Boolean(
    completionState.privacySettings.displayOnProfile[activePersona]
  );
  const [displayOnProfile, setDisplayOnProfile] = useState(currentProfileChoice);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(
    currentProfileChoice
      ? `${activePersona}'s profile choice saved · Displayed on ${activePersona}'s profile`
      : `${activePersona}'s profile choice saved · Not displayed on profile (Off)`
  );

  const previewActive = completionState.privacySettings.previewModeActive;

  const handleToggleDisplay = (value) => {
    setDisplayOnProfile(value);
  };

  const handleSaveChoice = async () => {
    setIsSaving(true);
    const res = await saveSharingPrivacy(activePersona, displayOnProfile);
    setIsSaving(false);
    if (res.success) {
      setSavedNotice(
        displayOnProfile
          ? `${activePersona}'s profile choice saved · Displayed on ${activePersona}'s profile.`
          : `${activePersona}'s profile choice saved · Not displayed on profile (Off).`
      );
      Alert.alert(
        'Privacy Choice Saved',
        `${activePersona}'s profile setting saved: ${
          displayOnProfile ? 'On (Displayed on profile)' : 'Off (Private)'
        }. Teammates and team page remain unaffected.`
      );
    }
  };

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
          <TouchableOpacity onPress={() => router.push('/private-project-page')}>
            <Text style={styles.breadcrumbLink}>Campus Marketplace</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>/</Text>
          <Text style={styles.breadcrumbCurrent}>Sharing and profile privacy</Text>
        </View>

        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>
            Completed · PRIVATE · {activePersona} · {isOwner ? 'Owner' : 'Member'}
          </Text>
          <View style={styles.sectionTagRow}>
            <Text style={styles.sectionTagLabel}>Project section:</Text>
            <View style={styles.sectionTagBadge}>
              <Text style={styles.sectionTagText}>Sharing & privacy</Text>
            </View>
          </View>
          <Text style={styles.pageHeading}>Sharing and profile privacy</Text>
          <Text style={styles.datesMeta}>30 Nov 2026 · 19 Oct–30 Nov · 6 weeks</Text>
        </View>

        {/* Section 1: Team Project Page Visibility */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Team project page visibility</Text>
          <View style={styles.visibilityStatusRow}>
            <Text style={styles.visibilityLabel}>Current visibility:</Text>
            <View style={styles.privatePill}>
              <Text style={styles.privatePillText}>Team-only (Private)</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            Team-only saved versus LOCAL PREVIEW link mode; own profile Off. Ada-only
            save; public activation unavailable pending policy.
          </Text>

          <View style={styles.previewModeBox}>
            <Text style={styles.previewModeTitle}>Local preview link mode</Text>
            <Text style={styles.previewModeText}>
              Simulate testing a sharable link without opening the project to the public.
            </Text>
            <TouchableOpacity
              style={[
                styles.previewToggleBtn,
                previewActive && styles.previewToggleBtnActive,
              ]}
              onPress={() => togglePreviewLinkMode()}
            >
              <Text
                style={[
                  styles.previewToggleBtnText,
                  previewActive && styles.previewToggleBtnTextActive,
                ]}
              >
                {previewActive ? '✓ Preview link mode active' : 'Enable local preview link'}
              </Text>
            </TouchableOpacity>

            {previewActive && (
              <View style={styles.linkDisplayBox}>
                <Text style={styles.linkDisplayText}>
                  {completionState.privacySettings.previewLink}
                </Text>
                <Text style={styles.linkSubtext}>
                  Local preview only · Not published publicly
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Section 2: Individual Profile Display */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Individual profile display</Text>
          <Text style={styles.cardSubtitle}>Own profile choice only</Text>

          <Text style={styles.profileRuleText}>
            Changes your profile only. David, John and team-page sharing are unaffected.
          </Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Display on my profile</Text>
              <Text style={styles.switchSubtitle}>
                {displayOnProfile
                  ? `Show Campus Marketplace on ${activePersona}'s profile`
                  : `Keep Campus Marketplace private on ${activePersona}'s profile`}
              </Text>
            </View>
            <Switch
              value={displayOnProfile}
              onValueChange={handleToggleDisplay}
              trackColor={{ false: '#CBD5E1', true: colors.primary }}
              thumbColor={displayOnProfile ? '#FFFFFF' : '#F8FAFC'}
            />
          </View>

          <View style={styles.savedNoticeBox}>
            <Text style={styles.savedNoticeText}>{savedNotice}</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveChoiceBtn, isSaving && styles.btnDisabled]}
            onPress={handleSaveChoice}
            disabled={isSaving}
          >
            <Text style={styles.saveChoiceBtnText}>
              {isSaving ? 'Saving...' : 'Save own profile choice'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.policyFootnote}>
            Ada-only profile On success is a distinct alternative, not automatic
            sharing. Persistent textual saved/local labels, not color alone.
          </Text>
        </View>

        {/* Back Link */}
        <TouchableOpacity
          style={styles.backLinkBtn}
          onPress={() => router.push('/private-project-page')}
        >
          <Text style={styles.backLinkBtnText}>
            ← Back to private project page
          </Text>
        </TouchableOpacity>

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
    flexWrap: 'wrap',
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
  cardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  visibilityStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  visibilityLabel: {
    fontSize: 13,
    color: '#334155',
    fontFamily: fonts.semiBold,
  },
  privatePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  privatePillText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#334155',
  },
  cardDescription: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 12,
  },
  previewModeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewModeTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  previewModeText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  previewToggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: 'flex-start',
  },
  previewToggleBtnActive: {
    backgroundColor: colors.primary,
  },
  previewToggleBtnText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  previewToggleBtnTextActive: {
    color: '#FFFFFF',
  },
  linkDisplayBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  linkDisplayText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  linkSubtext: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  profileRuleText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  switchTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  switchSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  savedNoticeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  savedNoticeText: {
    fontSize: 12,
    color: '#334155',
    fontFamily: fonts.semiBold,
  },
  saveChoiceBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  saveChoiceBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  policyFootnote: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 10,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  backLinkBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  backLinkBtnText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.bold,
    textDecorationLine: 'underline',
  },
});
