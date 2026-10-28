import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import FormField from '../components/FormField';
import Checkbox from '../components/Checkbox';
import Banner from '../components/Banner';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function RequiredProfileScreen() {
  const { user, updateUser } = useApp();

  const [role, setRole] = useState(user.role || 'Product Manager');
  const [skillLevel, setSkillLevel] = useState(user.skillLevel || 'Beginner');
  const [goals, setGoals] = useState(user.goals || 'Practice defining requirements and coordinating a small product team.');
  const [weeklyAvailability, setWeeklyAvailability] = useState(user.weeklyAvailability || '5 hours / week');
  const [projectDuration, setProjectDuration] = useState(user.projectDuration || '6 weeks');

  const skillsList = [
    { id: 'planning', label: 'Product planning' },
    { id: 'research', label: 'User research' },
    { id: 'coordination', label: 'Product coordination' },
  ];

  const [selectedSkills, setSelectedSkills] = useState(user.skills || ['planning', 'research']);

  // Modal selector states for clean dropdowns
  const [activePicker, setActivePicker] = useState(null); // 'role' | 'level' | 'duration' | null

  // Interactive demo states for Figma QA
  const [activeState, setActiveState] = useState('default'); // 'default' | 'saving' | 'save_error' | 'save_success'
  const [isSaving, setIsSaving] = useState(false);

  const toggleSkill = (id) => {
    if (selectedSkills.includes(id)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== id));
    } else {
      setSelectedSkills([...selectedSkills, id]);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateUser({
        role,
        skillLevel,
        skills: selectedSkills,
        goals,
        weeklyAvailability,
        projectDuration,
      });
      setActiveState('save_success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    }, 500);
  };

  const roleOptions = [
    'Product Manager',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Data Analyst',
  ];

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];

  const durationOptions = ['4 weeks', '6 weeks', '8 weeks', '12 weeks'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onRightPress={() => router.back()} rightText="Back" />

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
              { id: 'save_success', label: 'S04.S' },
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

        <View style={styles.card}>
          <Text style={styles.stepBadge}>Step 2 of 2 · Required profile</Text>
          <Text style={styles.mainTitle}>Tell us what you bring</Text>
          <Text style={styles.subText}>Find projects that fit your skills and availability.</Text>

          <Text style={styles.accountInfoText}>
            Name from your account: {user.name || 'Ada'}
          </Text>

          {/* Error Banner when save failed */}
          {activeState === 'save_error' && (
            <Banner
              type="error"
              title="Your profile did not save"
              message="Your entries are still here. Retry when you are connected."
            />
          )}

          {/* Success Banner when saved */}
          {activeState === 'save_success' && (
            <View style={{ marginBottom: spacing.md }}>
              <Banner
                type="success"
                title="Required profile saved"
                message={`${role} · ${skillLevel} · ${weeklyAvailability} · ${projectDuration}. You can now discover projects.`}
              />
              <Button
                title="Go to Dashboard"
                onPress={() => router.push('/dashboard')}
              />
            </View>
          )}

          {/* Professional Role Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Professional role *</Text>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => setActivePicker('role')}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>{role}</Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Skills Multi-select Checkboxes */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Skills *</Text>
            <View style={styles.checkboxGroup}>
              {skillsList.map((skill) => (
                <Checkbox
                  key={skill.id}
                  label={skill.label}
                  checked={selectedSkills.includes(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                />
              ))}
            </View>
            <Text style={styles.helperText}>You can select more than one skill.</Text>
          </View>

          {/* Skill Level Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Skill level *</Text>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => setActivePicker('level')}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>{skillLevel}</Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </TouchableOpacity>
            <Text style={styles.helperText}>Your own assessment, not a score.</Text>
          </View>

          {/* Goals Multiline Input */}
          <FormField
            label="Goals *"
            value={goals}
            onChangeText={setGoals}
            multiline
            numberOfLines={3}
          />

          {/* Weekly Availability Input */}
          <FormField
            label="Weekly availability (hours) *"
            value={weeklyAvailability}
            onChangeText={setWeeklyAvailability}
            placeholder="5 hours / week"
          />

          {/* Preferred Project Duration Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Preferred project duration *</Text>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => setActivePicker('duration')}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>{projectDuration}</Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Save profile and continue"
            onPress={handleSaveProfile}
            loading={isSaving}
            loadingText="Saving profile..."
            style={styles.primaryButton}
          />

          <Text style={styles.footerNote}>These entries are local until you save.</Text>
        </View>

        {/* Modal Picker for cleanly selecting options */}
        <Modal
          visible={activePicker !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setActivePicker(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setActivePicker(null)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Select {activePicker === 'role' ? 'Professional Role' : activePicker === 'level' ? 'Skill Level' : 'Project Duration'}
              </Text>
              <FlatList
                data={
                  activePicker === 'role'
                    ? roleOptions
                    : activePicker === 'level'
                    ? levelOptions
                    : durationOptions
                }
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      if (activePicker === 'role') setRole(item);
                      if (activePicker === 'level') setSkillLevel(item);
                      if (activePicker === 'duration') setProjectDuration(item);
                      setActivePicker(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        (activePicker === 'role' && role === item) ||
                        (activePicker === 'level' && skillLevel === item) ||
                        (activePicker === 'duration' && projectDuration === item)
                          ? styles.optionTextActive
                          : null,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBadge: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    fontFamily: fonts.medium,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 6,
  },
  subText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  accountInfoText: {
    fontSize: 13,
    color: colors.textBody,
    marginBottom: spacing.xl,
    fontFamily: fonts.medium,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: spacing.xs + 2,
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    height: 46,
    paddingHorizontal: spacing.md,
  },
  inputText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownArrow: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  checkboxGroup: {
    marginVertical: spacing.xs,
  },
  helperText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  primaryButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  footerNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    maxHeight: 320,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.md,
  },
  optionRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  optionTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});
