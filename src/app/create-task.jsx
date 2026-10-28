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
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function CreateTaskScreen() {
  const router = useRouter();
  const { workspaceMembers, workspaceMilestones, createWorkspaceTask } = useApp();

  const [title, setTitle] = useState('Check responsive layouts');
  const [ownerId, setOwnerId] = useState('david');
  const [dueDate, setDueDate] = useState('16 Nov 2026');
  const [milestoneId, setMilestoneId] = useState('m2');
  const [status, setStatus] = useState('To do');
  const [description, setDescription] = useState(
    'Review phone and tablet layouts before the next prototype demo.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState(null);

  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const [milestoneDropdownOpen, setMilestoneDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const selectedOwner = workspaceMembers.find((m) => m.id === ownerId);
  const selectedMilestone = workspaceMilestones.find((m) => m.id === milestoneId);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Enter a task title.');
      return;
    }
    if (!ownerId) {
      Alert.alert('Required', 'Choose one accepted member.');
      return;
    }
    if (!dueDate.trim()) {
      Alert.alert('Required', 'Enter a due date.');
      return;
    }

    setIsSubmitting(true);
    const res = await createWorkspaceTask({
      title: title.trim(),
      ownerId,
      ownerName: selectedOwner?.name || 'David',
      ownerRole: selectedOwner?.roleCategory || 'Member',
      milestoneId,
      milestoneName: selectedMilestone?.name || 'M2 Working prototype',
      dueDate: dueDate.trim(),
      status,
      description: description.trim(),
    });
    setIsSubmitting(false);

    if (res.success) {
      setSavedSuccess(true);
      if (res.task?.id) {
        setCreatedTaskId(res.task.id);
      }
    } else {
      Alert.alert('Error', res.error || 'Failed to create task.');
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
              onPress={() => router.push('/workspace?section=tasks')}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionSelectorText}>Tasks</Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* Screen Title & Subtitle */}
          <Text style={styles.screenHeading}>Create task</Text>
          <Text style={styles.screenSubtitle}>
            Choose one accepted member. Required fields are marked *.
          </Text>

          {savedSuccess ? (
            /* State specimen S28.S / saved alternative (Frame 46) */
            <View style={styles.successCard}>
              <View style={styles.successHeaderRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.successTitle}>Task created</Text>
              </View>
              <Text style={styles.successDetailText}>
                {title} · {selectedOwner?.name || 'David'} · {dueDate} · {selectedMilestone?.name?.split(' ')[0] || 'M2'} · {status}. Now 7 total, 2 Done, 5 not Done; M2 is 0/4.
              </Text>
              <Button
                title="View task"
                variant="outline"
                onPress={() => router.push({ pathname: '/task-detail', params: { id: createdTaskId || 't3' } })}
                style={styles.viewTaskBtn}
              />
            </View>
          ) : (
            /* Form Card */
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Task title *</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Check responsive layouts"
              />

              <Text style={styles.fieldLabel}>Task owner *</Text>
              <TouchableOpacity
                style={styles.dropdownBox}
                onPress={() => setOwnerDropdownOpen(!ownerDropdownOpen)}
              >
                <Text style={styles.dropdownValue}>
                  {selectedOwner ? `${selectedOwner.name} · ${selectedOwner.roleCategory || selectedOwner.role}` : 'Select owner'}
                </Text>
                <Text style={styles.dropdownChevron}>▾</Text>
              </TouchableOpacity>
              {ownerDropdownOpen && (
                <View style={styles.dropdownList}>
                  {workspaceMembers.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.dropdownItem, ownerId === m.id && styles.dropdownItemActive]}
                      onPress={() => {
                        setOwnerId(m.id);
                        setOwnerDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, ownerId === m.id && styles.dropdownItemTextActive]}>
                        {m.name} · {m.roleCategory || m.role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.fieldLabel}>Due date *</Text>
              <TextInput
                style={styles.textInput}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="16 Nov 2026"
              />

              <Text style={styles.fieldLabel}>Milestone *</Text>
              <TouchableOpacity
                style={styles.dropdownBox}
                onPress={() => setMilestoneDropdownOpen(!milestoneDropdownOpen)}
              >
                <Text style={styles.dropdownValue}>
                  {selectedMilestone?.name || 'Select milestone'}
                </Text>
                <Text style={styles.dropdownChevron}>▾</Text>
              </TouchableOpacity>
              {milestoneDropdownOpen && (
                <View style={styles.dropdownList}>
                  {workspaceMilestones.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.dropdownItem, milestoneId === m.id && styles.dropdownItemActive]}
                      onPress={() => {
                        setMilestoneId(m.id);
                        setMilestoneDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, milestoneId === m.id && styles.dropdownItemTextActive]}>
                        {m.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.fieldLabel}>Task status *</Text>
              <TouchableOpacity
                style={styles.dropdownBox}
                onPress={() => setStatusDropdownOpen(!statusDropdownOpen)}
              >
                <Text style={styles.dropdownValue}>{status}</Text>
                <Text style={styles.dropdownChevron}>▾</Text>
              </TouchableOpacity>
              {statusDropdownOpen && (
                <View style={styles.dropdownList}>
                  {['To do', 'In progress', 'In review', 'Blocked', 'Done'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[styles.dropdownItem, status === st && styles.dropdownItemActive]}
                      onPress={() => {
                        setStatus(st);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, status === st && styles.dropdownItemTextActive]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.fieldLabel}>Description (optional)</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
                placeholder="Review phone and tablet layouts before the next prototype demo."
              />

              <Text style={styles.helperSubtext}>
                Local draft · Not saved. Tasks are private to accepted team members.
              </Text>

              <Button
                title="Save task"
                loading={isSubmitting}
                onPress={handleSave}
                style={{ marginTop: spacing.lg }}
              />

              {/* Cancel local draft is PURPLE UNDERLINED TEXT LINK (Frame 46) */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.cancelLinkRow}
              >
                <Text style={styles.cancelLinkText}>Cancel local draft</Text>
              </TouchableOpacity>
            </View>
          )}
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
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 18,
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
  dropdownBox: {
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
  dropdownValue: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryLight,
  },
  dropdownItemText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
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
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
  },
  successHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  checkIcon: {
    fontSize: 16,
    color: '#16A34A',
    fontFamily: fonts.bold,
    marginRight: spacing.xs,
  },
  successTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: '#166534',
  },
  successDetailText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  viewTaskBtn: {
    marginTop: spacing.xs,
  },
});
