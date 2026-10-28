import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function EditMilestoneScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { workspaceMilestones, editWorkspaceMilestone } = useApp();

  const milestoneId = searchParams.id ? String(searchParams.id) : 'm2';
  const milestone =
    workspaceMilestones.find((m) => m.id === milestoneId) ||
    workspaceMilestones.find((m) => m.id === 'm2');

  const [targetDate, setTargetDate] = useState('18 Nov 2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const handleSave = async () => {
    if (!targetDate.trim()) {
      Alert.alert('Required', 'Target date cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setSaveFailed(false);
    const res = await editWorkspaceMilestone(
      milestone?.id || 'm2',
      milestone?.name || 'M2 Working prototype',
      targetDate.trim()
    );
    setIsSubmitting(false);

    if (res.success) {
      Alert.alert('Milestone Updated', `Target date updated to ${targetDate}.`);
      router.push('/workspace?section=milestones');
    } else {
      setSaveFailed(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Header activeMenuItem="workspace" rightText="Menu" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Breadcrumb */}
          <Text style={styles.breadcrumb}>My Projects / Campus Marketplace</Text>

          {/* Project Header */}
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>In Progress · Ada · Owner</Text>

          {/* Project Section Indicator */}
          <View style={styles.sectionSelectorContainer}>
            <Text style={styles.sectionSelectorLabel}>Project section</Text>
            <TouchableOpacity
              style={styles.sectionSelectorDropdown}
              onPress={() => router.push('/workspace?section=milestones')}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionSelectorText}>Milestones</Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Screen Title & Subtitle */}
          <Text style={styles.screenHeading}>Edit milestone</Text>
          <Text style={styles.screenSubtitle}>
            Milestones / {milestone?.name || 'M2 Working prototype'}
          </Text>

          {/* S32.X / Failed Target Save Specimen (Frame 68) */}
          {saveFailed && (
            <View style={styles.errorCard}>
              <View style={styles.errorHeaderRow}>
                <Text style={styles.errorIcon}>!</Text>
                <Text style={styles.errorTitle}>Target date did not save</Text>
              </View>
              <Text style={styles.errorBody}>
                {milestone?.name || 'M2'} stays {milestone?.targetDate || '16 Nov 2026'} with 0/3 Done. Your proposed {targetDate} is retained locally.
              </Text>
              <Button
                title="Retry date save"
                variant="outline"
                onPress={handleSave}
                style={{ marginTop: spacing.sm }}
              />
            </View>
          )}

          {/* Form Card (Frame 67) */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Milestone</Text>
            <TextInput
              style={[styles.textInput, styles.inputDisabled]}
              value={milestone?.name || 'M2 Working prototype'}
              editable={false}
            />

            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Target date *</Text>
            <TextInput
              style={styles.textInput}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="18 Nov 2026"
            />

            <View style={styles.metaBox}>
              <Text style={styles.metaLine}>
                Stored target: {milestone?.targetDate || '16 Nov 2026'}
              </Text>
              <Text style={styles.metaLine}>
                Proposed target: {targetDate}
              </Text>
              <Text style={styles.metaLine}>
                Linked tasks: {milestone?.totalTasks || 3} · Done: {milestone?.doneTasks || 0}
              </Text>
            </View>

            <Text style={styles.helperSubtext}>
              Changing the milestone target does not automatically change task dates.
            </Text>

            <Button
              title="Save milestone"
              loading={isSubmitting}
              onPress={handleSave}
              style={{ marginTop: spacing.lg }}
            />

            {/* Cancel local changes is PURPLE UNDERLINED TEXT (Frame 67) */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.cancelLinkRow}
            >
              <Text style={styles.cancelLinkText}>Cancel local changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    backgroundColor: '#FFFFFF',
  },
  breadcrumb: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  projectTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  projectSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  sectionSelectorContainer: {
    marginBottom: spacing.lg,
  },
  sectionSelectorLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textBody,
    marginBottom: 4,
  },
  sectionSelectorDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSelectorText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  dropdownChevron: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  screenHeading: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceMuted,
    color: colors.textMuted,
  },
  metaBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: 4,
  },
  metaLine: {
    fontSize: 13,
    color: colors.textBody,
    fontFamily: fonts.medium,
  },
  helperSubtext: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
    lineHeight: 16,
  },
  cancelLinkRow: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  cancelLinkText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  errorIcon: {
    fontSize: 14,
    color: '#DC2626',
    fontFamily: fonts.bold,
    marginRight: spacing.xs,
  },
  errorTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#991B1B',
  },
  errorBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
  },
});
