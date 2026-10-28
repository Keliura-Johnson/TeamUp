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
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function TaskDetailScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const {
    activePersona,
    workspaceTasks,
    updateWorkspaceTaskStatus,
    addWorkspaceTaskComment,
  } = useApp();

  const taskId = searchParams.id ? String(searchParams.id) : 't3';
  const task = workspaceTasks.find((t) => t.id === taskId) || workspaceTasks.find((t) => t.id === 't3');

  const [status, setStatus] = useState(task?.status || 'Blocked');
  const [blockerNote, setBlockerNote] = useState(task?.blockerNote || 'Waiting for agreed sign-up fields.');
  const [artifactLink, setArtifactLink] = useState('https://example.org/onboarding');
  const [completionNote, setCompletionNote] = useState('Updated the flow after agreeing sign-up fields.');
  const [commentText, setCommentText] = useState("I'll update the flow once the fields are agreed.");

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery inline forms
  const [showDateRequest, setShowDateRequest] = useState(false);
  const [showHandover, setShowHandover] = useState(false);
  const [proposedDate, setProposedDate] = useState('16 Nov 2026');
  const [dateRequestMsg, setDateRequestMsg] = useState('Waiting for agreed sign-up fields before finishing screens.');
  const [handoverNote, setHandoverNote] = useState('Need another member to take over onboarding designs.');
  const [recoveryNotice, setRecoveryNotice] = useState(null);

  const isOwner = String(activePersona).toLowerCase() === 'ada';
  const isDavid = String(activePersona).toLowerCase() === 'david';
  const isAssignee = isDavid || String(activePersona).toLowerCase() === String(task?.ownerId || 'david').toLowerCase();
  const currentPersonaName = isOwner ? 'Ada' : isDavid ? 'David' : 'John';
  const currentPersonaRole = isOwner ? 'Owner' : 'Member';

  const handleSaveStatus = async () => {
    if (status === 'Blocked' && !blockerNote.trim()) {
      Alert.alert('Required', 'Add a short blocker note before saving.');
      return;
    }

    setIsSubmitting(true);
    const res = await updateWorkspaceTaskStatus(task.id, {
      status,
      blockerNote: status === 'Blocked' ? blockerNote : undefined,
      isOverdue: status === 'Done' ? false : task.isOverdue,
    });
    setIsSubmitting(false);

    if (res.success) {
      Alert.alert('Status Saved', `Task status updated to ${status}.`);
      router.push('/workspace?section=tasks');
    } else {
      Alert.alert('Error', res.error || 'Failed to save status.');
    }
  };

  const handleMarkDone = async () => {
    setIsSubmitting(true);
    const res = await updateWorkspaceTaskStatus(task.id, {
      status: 'Done',
      isOverdue: false,
    });
    setIsSubmitting(false);
    if (res.success) {
      setStatus('Done');
      Alert.alert('Task Done', 'Marked task as Done.');
    }
  };

  const handleSendDateRequest = () => {
    setShowDateRequest(false);
    setRecoveryNotice({
      type: 'success',
      text: `New date requested: Proposed ${proposedDate} sent to Ada. Status remains Blocked until confirmed.`,
    });
  };

  const handleSendHandover = () => {
    setShowHandover(false);
    setRecoveryNotice({
      type: 'success',
      text: 'Handover request sent to Ada. David remains the task owner until confirmed.',
    });
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    await addWorkspaceTaskComment(task.id, commentText, currentPersonaName);
    setCommentText('');
    Alert.alert('Comment Posted', 'Comment added to task thread.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Header activeMenuItem="workspace" rightText="Menu" />
        <PersonaSwitcher />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Breadcrumb */}
          <Text style={styles.breadcrumb}>My Projects / Campus Marketplace</Text>

          {/* Project Header */}
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>
            In Progress · {currentPersonaName} · {currentPersonaRole}
          </Text>

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

          {/* Screen Title */}
          <Text style={styles.screenHeading}>Task detail</Text>

          {/* Task Info Card (Frame 54) */}
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              {task?.status === 'Blocked' && (
                <View style={styles.badgeBlocked}>
                  <Text style={styles.badgeBlockedText}>! Blocked</Text>
                </View>
              )}
              {task?.status === 'Done' && (
                <View style={styles.badgeDone}>
                  <Text style={styles.badgeDoneText}>✓ Done</Text>
                </View>
              )}
              {task?.status !== 'Blocked' && task?.status !== 'Done' && (
                <View style={styles.badgeGeneral}>
                  <Text style={styles.badgeGeneralText}>{task?.status}</Text>
                </View>
              )}
              {task?.isOverdue && (
                <View style={styles.badgeOverdue}>
                  <Text style={styles.badgeOverdueText}>Overdue {task.overdueDays || 2} days</Text>
                </View>
              )}
            </View>

            <Text style={styles.taskCardTitle}>{task?.title || 'Design onboarding'}</Text>
            <View style={styles.ownerRow}>
              <View style={[styles.miniAvatar, { backgroundColor: '#EDE9FE' }]}>
                <Text style={[styles.miniAvatarText, { color: colors.primary }]}>
                  {task?.ownerName?.charAt(0) || 'D'}
                </Text>
              </View>
              <Text style={styles.ownerText}>Owner: {task?.ownerName || 'David'}</Text>
            </View>
            <Text style={styles.taskMetaText}>
              Due: {task?.dueDate || '10 Nov 2026'} · Milestone: {task?.milestoneName || 'M2 Working prototype'}
            </Text>
            {task?.blockerNote && (
              <Text style={styles.blockerNoteText}>
                Blocker note: {task.blockerNote}
              </Text>
            )}
          </View>

          {/* Status Modification Form (Assignee Only) */}
          {isAssignee ? (
            <View style={styles.card}>
              <Text style={styles.assigneePrompt}>
                You&apos;re the assignee. Only you can change this task&apos;s status.
              </Text>

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

              {status === 'Blocked' && (
                <View style={{ marginTop: spacing.md }}>
                  <Text style={styles.fieldLabel}>Blocker note *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={blockerNote}
                    onChangeText={setBlockerNote}
                    placeholder="Waiting for agreed sign-up fields."
                  />
                </View>
              )}

              {status === 'Done' && (
                <View style={{ marginTop: spacing.md }}>
                  <Text style={styles.fieldLabel}>Artifact link (optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={artifactLink}
                    onChangeText={setArtifactLink}
                    placeholder="https://example.org/onboarding"
                  />

                  <Button
                    title="Attach a file (optional)"
                    variant="outline"
                    onPress={() => Alert.alert('Attach File', 'Select local file to attach.')}
                    style={{ marginTop: spacing.sm }}
                  />

                  <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Completion note (optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={completionNote}
                    onChangeText={setCompletionNote}
                    placeholder="Updated the flow after agreeing sign-up fields."
                  />
                  <Text style={styles.helperSubtext}>
                    Link, file and note optional. Done not saved; no contribution added yet.
                  </Text>
                </View>
              )}

              <Button
                title="Save task status"
                loading={isSubmitting}
                onPress={handleSaveStatus}
                style={{ marginTop: spacing.lg }}
              />

              {/* Cancel local changes is PURPLE UNDERLINED TEXT LINK (Frame 56) */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.underlinedLinkRow}
              >
                <Text style={styles.underlinedLink}>Cancel local changes</Text>
              </TouchableOpacity>
            </View>
          ) : isOwner ? (
            <View style={styles.card}>
              <Text style={styles.ownerNoticeTitle}>Owner review</Text>
              <Text style={styles.ownerNoticeBody}>
                Status is set by assignee ({task?.ownerName}). As Owner, you can reassign this task to another member.
              </Text>
              <Button
                title="Review manual reassignment"
                variant="outline"
                onPress={() => router.push({ pathname: '/reassign-task', params: { taskId: task?.id || 't3' } })}
                style={{ marginTop: spacing.md }}
              />
            </View>
          ) : (
            <View style={styles.readOnlyNoticeBox}>
              <Text style={styles.readOnlyNoticeTitle}>Status is read only</Text>
              <Text style={styles.readOnlyNoticeBody}>
                Only {task?.ownerName} can update the status of this task.
              </Text>
            </View>
          )}

          {/* Recovery Actions Card (Frame 83) */}
          <View style={styles.card}>
            {recoveryNotice && (
              <View style={styles.noticeBox}>
                <Text style={styles.noticeText}>{recoveryNotice.text}</Text>
              </View>
            )}

            <Button
              title="Mark done"
              variant="outline"
              onPress={handleMarkDone}
              style={{ marginBottom: spacing.sm }}
            />

            {/* Request new date is PURPLE UNDERLINED TEXT LINK (Frame 83) */}
            <TouchableOpacity
              onPress={() => {
                setShowDateRequest(!showDateRequest);
                setShowHandover(false);
              }}
              style={styles.underlinedLinkRow}
            >
              <Text style={styles.underlinedLink}>Request new date</Text>
            </TouchableOpacity>

            {/* Hand it over is PURPLE UNDERLINED TEXT LINK (Frame 83) */}
            <TouchableOpacity
              onPress={() => {
                setShowHandover(!showHandover);
                setShowDateRequest(false);
              }}
              style={styles.underlinedLinkRow}
            >
              <Text style={styles.underlinedLink}>Hand it over</Text>
            </TouchableOpacity>

            <Text style={styles.helperSubtextCentered}>
              Update status or request a date change or handover from Ada.
            </Text>

            {/* Inline Date Request Form */}
            {showDateRequest && (
              <View style={styles.inlineFormCard}>
                <Text style={styles.inlineFormTitle}>Request new date</Text>
                <Text style={styles.inlineFormSub}>Ask Ada for a new date. Status stays Blocked.</Text>
                <Text style={styles.fieldLabel}>Proposed due date</Text>
                <TextInput
                  style={styles.textInput}
                  value={proposedDate}
                  onChangeText={setProposedDate}
                  placeholder="16 Nov 2026"
                />
                <Text style={[styles.fieldLabel, { marginTop: spacing.sm }]}>Message (optional)</Text>
                <TextInput
                  style={styles.textArea}
                  value={dateRequestMsg}
                  onChangeText={setDateRequestMsg}
                  multiline
                  numberOfLines={2}
                />
                <Button
                  title="Send date request"
                  onPress={handleSendDateRequest}
                  style={{ marginTop: spacing.md }}
                />
                <TouchableOpacity
                  onPress={() => setShowDateRequest(false)}
                  style={styles.underlinedLinkRow}
                >
                  <Text style={styles.underlinedLink}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Inline Handover Form */}
            {showHandover && (
              <View style={styles.inlineFormCard}>
                <Text style={styles.inlineFormTitle}>Hand it over</Text>
                <Text style={styles.inlineFormSub}>Ask Ada to reassign task. You remain owner until confirmed.</Text>
                <Text style={styles.fieldLabel}>Handover note</Text>
                <TextInput
                  style={styles.textArea}
                  value={handoverNote}
                  onChangeText={setHandoverNote}
                  multiline
                  numberOfLines={2}
                />
                <Button
                  title="Send handover request"
                  onPress={handleSendHandover}
                  style={{ marginTop: spacing.md }}
                />
                <TouchableOpacity
                  onPress={() => setShowHandover(false)}
                  style={styles.underlinedLinkRow}
                >
                  <Text style={styles.underlinedLink}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Task Comments Card (Frame 56) */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Task comments</Text>

            <View style={styles.commentItem}>
              <Text style={styles.commentAuthorDate}>Ada · 12 Nov 2026</Text>
              <Text style={styles.commentBody}>
                I&apos;ll help agree the sign-up fields today. Keep the blocker note until that is resolved.
              </Text>
            </View>

            {task?.comments && task.comments.map((c) => (
              <View key={c.id} style={styles.commentItem}>
                <Text style={styles.commentAuthorDate}>{c.author} · {c.date}</Text>
                <Text style={styles.commentBody}>{c.text}</Text>
              </View>
            ))}

            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Comment</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="I'll update the flow once the fields are agreed."
            />

            <Button
              title="Post comment"
              onPress={handlePostComment}
              style={{ marginTop: spacing.md }}
            />
            <Text style={styles.helperSubtext}>Task comments stay with this task.</Text>
            <Text style={styles.footerSavedText}>
              Saved: Blocked · Due 10 Nov · David · M2 Working prototype
            </Text>
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
  personaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  personaLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
  },
  personaBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  personaBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  personaBtnText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textBody,
  },
  personaBtnTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
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
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeading: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeBlocked: {
    backgroundColor: '#FDE8E8',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  badgeBlockedText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#DC2626',
  },
  badgeDone: {
    backgroundColor: '#DEF7EC',
    borderColor: '#86EFAC',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  badgeDoneText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#166534',
  },
  badgeGeneral: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  badgeGeneralText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#374151',
  },
  badgeOverdue: {
    backgroundColor: '#FFEDD5',
    borderColor: '#FED7AA',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeOverdueText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#C2410C',
  },
  taskCardTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  miniAvatarText: {
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  ownerText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
  },
  taskMetaText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 4,
  },
  blockerNoteText: {
    fontSize: 13,
    color: '#DC2626',
    fontFamily: fonts.medium,
    marginBottom: spacing.xs,
  },
  assigneePrompt: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: 4,
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
    marginTop: spacing.sm,
    lineHeight: 16,
  },
  helperSubtextCentered: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
    lineHeight: 16,
  },
  footerSavedText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 16,
  },
  underlinedLinkRow: {
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    marginVertical: 2,
  },
  underlinedLink: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  ownerNoticeTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  ownerNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    marginTop: 4,
    lineHeight: 18,
  },
  readOnlyNoticeBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  readOnlyNoticeTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  readOnlyNoticeBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    marginTop: 2,
    lineHeight: 16,
  },
  commentItem: {
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  commentAuthorDate: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  commentBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    marginTop: 2,
  },
  noticeBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  noticeText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
  },
  inlineFormCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  inlineFormTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  inlineFormSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
});
