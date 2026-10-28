import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import Banner from '../components/Banner';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function ProjectUpdatesScreen() {
  const {
    activePersona,
    workspaceUpdates,
    postWorkspaceUpdate,
  } = useApp();

  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Updates');

  // QA State Specimen Switcher ('default' | 'S35.E' | 'S35.L' | 'S35.S')
  const [activeSpecimen, setActiveSpecimen] = useState('default');

  const [updateText, setUpdateText] = useState(
    "I'll share the updated onboarding flow after we agree the sign-up fields."
  );
  const [isPosting, setIsPosting] = useState(false);
  const [lastPostedUpdate, setLastPostedUpdate] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isComposerClosed, setIsComposerClosed] = useState(false);

  const currentPersonaRole =
    activePersona === 'Ada'
      ? 'Owner · Product Manager'
      : activePersona === 'David'
      ? 'Member · UI/UX Designer'
      : 'Member · Frontend Developer';

  const handlePostUpdate = async () => {
    if (!updateText.trim()) return;
    setIsPosting(true);
    const textToPost = updateText;
    const author = activePersona;
    const res = await postWorkspaceUpdate(textToPost, author);
    setIsPosting(false);
    if (res.success) {
      setLastPostedUpdate(res.data);
      setShowSuccessBanner(true);
      setUpdateText('');
      setIsComposerClosed(true);
    }
  };

  const sectionOptions = [
    'Overview',
    'Tasks',
    'Team',
    'Milestones',
    'Updates',
    'Team Health',
    'Reminders',
    'Project completion',
    'Contributions',
    'Project page',
    'Ended Early record',
  ];

  const handleSectionSelect = (sec) => {
    setSectionDropdownOpen(false);
    setSelectedSection(sec);
    if (sec === 'Overview' || sec === 'Tasks' || sec === 'Team' || sec === 'Milestones' || sec === 'Reminders') {
      router.push('/workspace');
    } else if (sec === 'Team Health') {
      router.push('/team-health');
    } else if (sec === 'Project completion') {
      router.push('/project-completion');
    } else if (sec === 'Contributions') {
      router.push('/contribution-summary');
    } else if (sec === 'Project page') {
      router.push('/private-project-page');
    } else if (sec === 'Ended Early record') {
      router.push('/ended-early');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="updates" />
      <PersonaSwitcher />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* QA Specimen Toolbar for Walkthrough Verification */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>Walkthrough Specimen:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'default', label: 'Default' },
              { id: 'S35.E', label: 'S35.E / First update' },
              { id: 'S35.L', label: 'S35.L / Posting' },
              { id: 'S35.S', label: 'S35.S / Posted' },
            ].map((sp) => (
              <TouchableOpacity
                key={sp.id}
                onPress={() => {
                  setActiveSpecimen(sp.id);
                  if (sp.id === 'S35.S') {
                    setShowSuccessBanner(true);
                    setIsComposerClosed(true);
                  } else if (sp.id === 'default') {
                    setIsComposerClosed(false);
                    setShowSuccessBanner(false);
                  }
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

        {/* Sub-nav / Breadcrumb */}
        <View style={styles.subnavRow}>
          <TouchableOpacity onPress={() => router.push('/myprojects')}>
            <Text style={styles.breadcrumbLink}>
              My Projects <Text style={styles.breadcrumbSlash}>/</Text> Campus Marketplace
            </Text>
          </TouchableOpacity>
        </View>

        {/* Project Header */}
        <Text style={styles.projectTitle}>Campus Marketplace</Text>
        <Text style={styles.projectSubtitle}>
          In Progress · {activePersona} · {currentPersonaRole}
        </Text>

        {/* Project section dropdown */}
        <View style={styles.sectionSelectorContainer}>
          <Text style={styles.sectionSelectorLabel}>Project section</Text>
          <TouchableOpacity
            style={styles.sectionSelectorDropdown}
            onPress={() => setSectionDropdownOpen(!sectionDropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionSelectorText}>{selectedSection}</Text>
            <Text style={styles.dropdownChevron}>▾</Text>
          </TouchableOpacity>

          {sectionDropdownOpen && (
            <View style={styles.dropdownList}>
              {sectionOptions.map((sec) => (
                <TouchableOpacity
                  key={sec}
                  style={[
                    styles.dropdownItem,
                    selectedSection === sec && styles.dropdownItemActive,
                  ]}
                  onPress={() => handleSectionSelect(sec)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedSection === sec && styles.dropdownItemTextActive,
                    ]}
                  >
                    {sec}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Updates</Text>
          <Text style={styles.sectionSubtitle}>
            Share a project update with your accepted team.
          </Text>
        </View>

        {/* ========================================================= */}
        {/* SPECIMEN S35.E: EMPTY / FIRST UPDATE                     */}
        {/* ========================================================= */}
        {activeSpecimen === 'S35.E' && (
          <View style={styles.card}>
            <Banner
              type="info"
              title="No updates yet"
              message="Start the project thread. Everyone on the accepted team can read and post."
            />
            <Text style={styles.fieldLabel}>Project update</Text>
            <View style={styles.notEnteredBox}>
              <Text style={styles.notEnteredText}>Not entered</Text>
            </View>
            <Button
              title="Write an update"
              variant="outline"
              onPress={() => setActiveSpecimen('default')}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}

        {/* ========================================================= */}
        {/* SPECIMEN S35.L: POSTING (LOCKED)                          */}
        {/* ========================================================= */}
        {activeSpecimen === 'S35.L' && (
          <View style={styles.card}>
            <Banner
              type="info"
              title="Posting update..."
              message="Posting. Draft retained; fields temporarily locked."
            />
            <Text style={styles.fieldLabel}>Project update</Text>
            <View style={[styles.textArea, styles.textAreaDisabled]}>
              <Text style={styles.textAreaDisabledText}>
                {"I'll share the updated onboarding flow after we agree the sign-up fields."}
              </Text>
            </View>
            <Text style={styles.helperSubtext}>Temporarily locked while saving.</Text>
            <TouchableOpacity style={styles.postingButtonDisabled} disabled>
              <ActivityIndicator size="small" color="#9CA3AF" style={{ marginRight: 8 }} />
              <Text style={styles.postingButtonText}>Posting update...</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================= */}
        {/* SPECIMEN S35.S / SUCCESSFUL POST STATE                     */}
        {/* ========================================================= */}
        {(activeSpecimen === 'S35.S' || showSuccessBanner) && activeSpecimen !== 'S35.E' && activeSpecimen !== 'S35.L' && (
          <View style={styles.card}>
            <Banner
              type="success"
              title="Update posted"
              message="Update posted. Draft cleared."
            />

            <View style={styles.lastPostedPreview}>
              <Text style={styles.lastPostedAuthor}>
                {lastPostedUpdate?.author || activePersona} · 12 Nov 2026
              </Text>
              <Text style={styles.lastPostedBody}>
                {lastPostedUpdate?.text ||
                  "I'll share the updated onboarding flow after we agree the sign-up fields."}
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Project update</Text>
            <View style={styles.notEnteredBox}>
              <Text style={styles.notEnteredText}>Not entered</Text>
            </View>
            <Button
              title="Write another update"
              variant="outline"
              onPress={() => {
                setShowSuccessBanner(false);
                setIsComposerClosed(false);
                setActiveSpecimen('default');
              }}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}

        {/* ========================================================= */}
        {/* DEFAULT COMPOSER CARD (INTERACTIVE)                       */}
        {/* ========================================================= */}
        {activeSpecimen === 'default' && !isComposerClosed && !showSuccessBanner && (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Write an update</Text>
            <Text style={styles.fieldLabel}>Project update</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              value={updateText}
              onChangeText={setUpdateText}
              placeholder="Share an update with your team..."
              placeholderTextColor={colors.textSubtle}
            />
            <Text style={styles.helperSubtext}>Local draft · Not posted</Text>
            <Button
              title="Post update"
              loading={isPosting}
              loadingText="Posting update..."
              onPress={handlePostUpdate}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}

        {/* ========================================================= */}
        {/* PROJECT THREAD LIST                                       */}
        {/* ========================================================= */}
        {activeSpecimen !== 'S35.E' && (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Project thread</Text>
            {workspaceUpdates.map((u) => {
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
  subnavRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  breadcrumbLink: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  breadcrumbSlash: {
    color: colors.textSubtle,
  },
  projectTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textHeading,
    marginTop: spacing.xs,
  },
  projectSubtitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  sectionSelectorContainer: {
    marginBottom: spacing.lg,
    position: 'relative',
    zIndex: 50,
  },
  sectionSelectorLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textHeading,
    marginBottom: 6,
  },
  sectionSelectorDropdown: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  sectionSelectorText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownChevron: {
    fontSize: 14,
    color: colors.textMuted,
  },
  dropdownList: {
    position: 'absolute',
    top: 68,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryTint,
  },
  dropdownItemText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownItemTextActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  sectionHeaderRow: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textHeading,
  },
  sectionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeading: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textHeading,
    marginBottom: 6,
    marginTop: 4,
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
  textAreaDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  textAreaDisabledText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  helperSubtext: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },
  notEnteredBox: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  notEnteredText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSubtle,
  },
  postingButtonDisabled: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  postingButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: '#9CA3AF',
  },
  lastPostedPreview: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  lastPostedAuthor: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textHeading,
    marginBottom: 4,
  },
  lastPostedBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
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
});
