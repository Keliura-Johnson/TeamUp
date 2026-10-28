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

export default function EditRoleScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { workspaceMembers, editWorkspaceRole } = useApp();

  const memberId = searchParams.memberId ? String(searchParams.memberId) : 'david';
  const member = workspaceMembers.find((m) => m.id === memberId) || workspaceMembers.find((m) => m.id === 'david');

  const [roleTitle, setRoleTitle] = useState(member?.roleCategory || member?.role || 'UI/UX Designer');
  const [responsibilities, setResponsibilities] = useState(
    member?.responsibilities || 'Design onboarding, UI handoff and responsive layout review'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!roleTitle.trim() || !responsibilities.trim()) {
      Alert.alert('Required', 'Role and responsibilities cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    const res = await editWorkspaceRole(member.id, roleTitle.trim(), responsibilities.trim());
    setIsSubmitting(false);

    if (res.success) {
      Alert.alert('Role Updated', `${member.name}'s role has been updated.`);
      router.push('/workspace?section=team');
    } else {
      Alert.alert('Error', res.error || 'Failed to update role.');
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

          {/* Section Indicator */}
          <View style={styles.sectionSelectorContainer}>
            <Text style={styles.sectionSelectorLabel}>Project section</Text>
            <TouchableOpacity
              style={styles.sectionSelectorDropdown}
              onPress={() => router.push('/workspace?section=team')}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionSelectorText}>Team</Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Screen Title */}
          <Text style={styles.screenHeading}>Edit role</Text>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Member</Text>
            <TextInput
              style={[styles.textInput, styles.inputDisabled]}
              value={member?.name || 'David'}
              editable={false}
            />

            <Text style={styles.fieldLabel}>Role *</Text>
            <TextInput
              style={styles.textInput}
              value={roleTitle}
              onChangeText={setRoleTitle}
              placeholder="UI/UX Designer"
            />

            <Text style={styles.fieldLabel}>Responsibilities *</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              value={responsibilities}
              onChangeText={setResponsibilities}
              placeholder="Design onboarding, UI handoff and responsive layout review"
            />

            <Text style={styles.helperSubtext}>
              Unsaved role changes for {member?.name || 'David'}. Commitment unchanged: {member?.hours || '6 h / week'}, 19 Oct–30 Nov.
            </Text>

            <Button
              title="Confirm role changes"
              loading={isSubmitting}
              onPress={handleSave}
              style={{ marginTop: spacing.lg }}
            />

            {/* Cancel is PURPLE UNDERLINED TEXT LINK */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.cancelLinkRow}
            >
              <Text style={styles.cancelLinkText}>Cancel</Text>
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
    marginBottom: spacing.md,
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
    marginTop: spacing.md,
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
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    textAlignVertical: 'top',
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
});
