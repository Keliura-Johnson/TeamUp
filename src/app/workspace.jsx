import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function WorkspaceScreen() {
  const router = useRouter();
  const {
    activePersona,
    workspaceTasks,
    workspaceMembers,
    workspaceMilestones,
    workspaceUpdates,
    postWorkspaceUpdate,
  } = useApp();

  const isOwner = String(activePersona).toLowerCase() === 'ada';
  const isDavid = String(activePersona).toLowerCase() === 'david';
  const currentPersonaName = isOwner ? 'Ada' : isDavid ? 'David' : 'John';
  const currentPersonaRole = isOwner ? 'Owner' : 'Member';

  // Section Selector State ('Overview' | 'Tasks' | 'Team' | 'Milestones' | 'Updates' | 'Reminders')
  const [selectedSection, setSelectedSection] = useState('Overview');
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);

  // Tasks Filter & Tab State
  const [taskTab, setTaskTab] = useState('all'); // 'all' | 'my'
  const [filterAssignee, setFilterAssignee] = useState('All members');
  const [filterStatus, setFilterStatus] = useState('All statuses');
  const [filterMilestone, setFilterMilestone] = useState('All milestones');
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [milestoneDropdownOpen, setMilestoneDropdownOpen] = useState(false);

  // Updates input
  const [updateText, setUpdateText] = useState('');
  const [isPostingUpdate, setIsPostingUpdate] = useState(false);

  // Metrics
  const totalTasks = workspaceTasks.length;
  const doneTasks = workspaceTasks.filter((t) => t.status === 'Done').length;
  const notDoneTasks = totalTasks - doneTasks;
  const overdueTasks = workspaceTasks.filter((t) => t.isOverdue).length;

  // Filter tasks
  const filteredTasks = workspaceTasks.filter((task) => {
    if (taskTab === 'my' && task.ownerId !== 'david') return false;
    if (filterAssignee !== 'All members' && task.ownerName !== filterAssignee) return false;
    if (filterStatus !== 'All statuses' && task.status !== filterStatus) return false;
    if (filterMilestone !== 'All milestones' && task.milestoneName !== filterMilestone) return false;
    return true;
  });

  const myTasksList = workspaceTasks.filter((t) => t.ownerId === 'david');

  const handlePostUpdate = async () => {
    if (!updateText.trim()) {
      Alert.alert('Required', 'Please enter update text.');
      return;
    }
    setIsPostingUpdate(true);
    await postWorkspaceUpdate(updateText.trim(), currentPersonaName);
    setIsPostingUpdate(false);
    setUpdateText('');
    Alert.alert('Update Posted', 'Your update has been shared with the team.');
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
          {/* Breadcrumb (Frame 10) */}
          <Text style={styles.breadcrumb}>My Projects / Campus Marketplace</Text>

          {/* Project Title & Subtitle */}
          <Text style={styles.projectTitle}>Campus Marketplace</Text>
          <Text style={styles.projectSubtitle}>
            In Progress · {currentPersonaName} · {currentPersonaRole}
          </Text>

          {/* Project Section Selector (Frame 10, 22, 29, 54) */}
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
                {[
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
                ].map((sec) => (
                  <TouchableOpacity
                    key={sec}
                    style={[styles.dropdownItem, selectedSection === sec && styles.dropdownItemActive]}
                    onPress={() => {
                      setSectionDropdownOpen(false);
                      if (sec === 'Updates') {
                        router.push('/project-updates');
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
                      } else {
                        setSelectedSection(sec);
                      }
                    }}
                  >
                    <Text style={[styles.dropdownItemText, selectedSection === sec && styles.dropdownItemTextActive]}>
                      {sec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ========================================================= */}
          {/* 1. OVERVIEW SECTION (S25 & S33)                          */}
          {/* ========================================================= */}
          {selectedSection === 'Overview' && (
            <View>
              <Text style={styles.sectionHeaderTitle}>Overview</Text>
              <Text style={styles.dateStamp}>
                Thursday, 12 November 2026 · 19 Oct–30 Nov · 6 weeks
              </Text>

              {/* Artwork */}
              <View style={styles.artworkContainer}>
                <Image
                  source={require('../../assets/images/workspace-artwork.png')}
                  style={styles.artworkImage}
                  resizeMode="contain"
                />
              </View>

              {isOwner ? (
                /* ADA / OWNER OVERVIEW (S25) (Frame 10, 12, 14) */
                <View>
                  {/* Batch 5 Completion Entry Card */}
                  <View style={styles.completionBannerCard}>
                    <View style={styles.completionBannerHeader}>
                      <Text style={styles.completionBannerBadge}>30 Nov 2026 Milestone</Text>
                    </View>
                    <Text style={styles.completionBannerTitle}>Project Completion & Reviews</Text>
                    <Text style={styles.completionBannerText}>
                      Review deliverables, submit individual contribution summaries, and confirm teammate records.
                    </Text>
                    <View style={styles.completionBannerActions}>
                      <TouchableOpacity
                        style={styles.completionBannerBtn}
                        onPress={() => router.push('/project-completion')}
                      >
                        <Text style={styles.completionBannerBtnText}>Open Project Completion →</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.completionBannerSubBtn}
                        onPress={() => router.push('/contribution-summary')}
                      >
                        <Text style={styles.completionBannerSubBtnText}>My Contribution</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Shared View of the Work Card (Frame 12) */}
                  <View style={styles.card}>
                    <Text style={styles.cardHeadingLarge}>A shared view of the work</Text>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>Overall tasks</Text>
                      <Text style={styles.progressCount}>{doneTasks} of {totalTasks} Done</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${(doneTasks / totalTasks) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.taskBreakdownText}>
                      {notDoneTasks} tasks not Done · {overdueTasks} task overdue
                    </Text>

                    {/* Member Initials Circles */}
                    <View style={styles.memberCirclesRow}>
                      <View style={[styles.initialCircle, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.initialText, { color: colors.primary }]}>A</Text>
                      </View>
                      <View style={[styles.initialCircle, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.initialText, { color: colors.primary }]}>D</Text>
                      </View>
                      <View style={[styles.initialCircle, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.initialText, { color: colors.primary }]}>J</Text>
                      </View>
                    </View>
                    <Text style={styles.memberSubText}>
                      3 joined members · Ada, David and John{'\n'}Accepted 19 Oct 2026
                    </Text>

                    {/* Buttons: View tasks (solid purple), Create task (outline purple) */}
                    <Button
                      title="View tasks"
                      onPress={() => setSelectedSection('Tasks')}
                      style={{ marginTop: spacing.md }}
                    />
                    <Button
                      title="Create task"
                      variant="outline"
                      onPress={() => router.push('/create-task')}
                      style={{ marginTop: spacing.xs }}
                    />
                  </View>

                  {/* Milestones Card (Frame 12, 14) */}
                  <View style={styles.card}>
                    <Text style={styles.cardHeading}>Milestones</Text>
                    {workspaceMilestones.map((m) => (
                      <View key={m.id} style={styles.milestoneItem}>
                        <Text style={styles.milestoneTitle}>{m.name}</Text>
                        <Text style={styles.milestoneMeta}>
                          Target {m.targetDate} · {m.doneTasks} / {m.totalTasks} Done
                        </Text>
                      </View>
                    ))}

                    {/* View milestones is PURPLE UNDERLINED TEXT (Frame 14) */}
                    <TouchableOpacity
                      onPress={() => setSelectedSection('Milestones')}
                      style={styles.underlinedLinkRow}
                    >
                      <Text style={styles.underlinedLink}>View milestones</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Needs Attention Card (Frame 14) */}
                  <View style={styles.card}>
                    <Text style={styles.cardHeading}>Needs attention</Text>
                    <View style={styles.badgeRow}>
                      <View style={styles.badgeBlocked}>
                        <Text style={styles.badgeBlockedText}>! Blocked</Text>
                      </View>
                      <View style={styles.badgeOverdue}>
                        <Text style={styles.badgeOverdueText}>Overdue 2 days</Text>
                      </View>
                    </View>

                    <Text style={styles.taskCardTitle}>Design onboarding</Text>
                    <View style={styles.ownerRow}>
                      <View style={[styles.miniAvatar, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.miniAvatarText, { color: colors.primary }]}>D</Text>
                      </View>
                      <Text style={styles.ownerText}>Owner: David</Text>
                    </View>
                    <Text style={styles.taskMetaText}>
                      Due: 10 Nov 2026 · Milestone: M2 Working prototype
                    </Text>
                    <Text style={styles.blockerNoteText}>
                      Blocker note: Waiting for agreed sign-up fields.
                    </Text>

                    {/* Open task details is PURPLE UNDERLINED TEXT (Frame 38) */}
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/task-detail', params: { id: 't3' } })}
                      style={styles.underlinedLinkRow}
                    >
                      <Text style={styles.underlinedLink}>Open task details</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Upcoming Tasks Card (Frame 14) */}
                  <View style={styles.card}>
                    <Text style={styles.cardHeading}>Upcoming tasks</Text>
                    <View style={styles.upcomingItem}>
                      <Text style={styles.upcomingTitle}>Auth screens</Text>
                      <Text style={styles.upcomingMeta}>John · Due 14 Nov · In progress</Text>
                    </View>
                    <View style={styles.upcomingItem}>
                      <Text style={styles.upcomingTitle}>UI handoff</Text>
                      <Text style={styles.upcomingMeta}>David · Due 13 Nov · In review</Text>
                    </View>
                    <View style={styles.upcomingItem}>
                      <Text style={styles.upcomingTitle}>Prototype review</Text>
                      <Text style={styles.upcomingMeta}>Ada · Due 13 Nov · To do</Text>
                    </View>
                  </View>
                </View>
              ) : (
                /* DAVID / MEMBER OVERVIEW (S33) (Frame 18) */
                <View>
                  <View style={styles.card}>
                    <Text style={styles.cardHeadingLarge}>My tasks</Text>
                    {myTasksList.map((task) => (
                      <View key={task.id} style={styles.memberTaskCard}>
                        <View style={styles.badgeRow}>
                          {task.status === 'Blocked' && (
                            <View style={styles.badgeBlocked}>
                              <Text style={styles.badgeBlockedText}>! Blocked</Text>
                            </View>
                          )}
                          {task.status === 'In review' && (
                            <View style={styles.badgeReview}>
                              <Text style={styles.badgeReviewText}>O In review</Text>
                            </View>
                          )}
                          {task.isOverdue && (
                            <View style={styles.badgeOverdue}>
                              <Text style={styles.badgeOverdueText}>Overdue {task.overdueDays || 2} days</Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.taskCardTitle}>{task.title}</Text>
                        <View style={styles.ownerRow}>
                          <View style={[styles.miniAvatar, { backgroundColor: '#EDE9FE' }]}>
                            <Text style={[styles.miniAvatarText, { color: colors.primary }]}>D</Text>
                          </View>
                          <Text style={styles.ownerText}>Owner: David</Text>
                        </View>
                        <Text style={styles.taskMetaText}>
                          Due: {task.dueDate} · Milestone: {task.milestoneName}
                        </Text>
                        {task.blockerNote && (
                          <Text style={styles.blockerNoteText}>
                            Blocker note: {task.blockerNote}
                          </Text>
                        )}
                        {task.note && !task.blockerNote && (
                          <Text style={styles.taskMetaText}>{task.note}</Text>
                        )}

                        {/* Open task details is PURPLE UNDERLINED TEXT (Frame 38) */}
                        <TouchableOpacity
                          onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
                          style={styles.underlinedLinkRow}
                        >
                          <Text style={styles.underlinedLink}>Open task details</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <Button
                      title="View all tasks"
                      onPress={() => {
                        setTaskTab('all');
                        setSelectedSection('Tasks');
                      }}
                      style={{ marginTop: spacing.md }}
                    />

                    <Text style={styles.memberRestrictedFooter}>
                      Create task and role management are not available to members.
                    </Text>
                  </View>

                  <View style={styles.card}>
                    <Text style={styles.cardHeading}>Milestones</Text>
                    {workspaceMilestones.map((m) => (
                      <View key={m.id} style={styles.milestoneItem}>
                        <Text style={styles.milestoneTitle}>{m.name}</Text>
                        <Text style={styles.milestoneMeta}>
                          Target {m.targetDate} · {m.doneTasks} / {m.totalTasks} Done
                        </Text>
                      </View>
                    ))}
                    <TouchableOpacity
                      onPress={() => setSelectedSection('Milestones')}
                      style={styles.underlinedLinkRow}
                    >
                      <Text style={styles.underlinedLink}>View milestones</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ========================================================= */}
          {/* 2. TEAM AND ROLES SECTION (S26 & S37)                     */}
          {/* ========================================================= */}
          {selectedSection === 'Team' && (
            <View>
              <Text style={styles.sectionHeaderTitle}>Team</Text>
              <Text style={styles.sectionSubtitle}>
                3 joined members · Saved acceptance: 19 Oct 2026
              </Text>

              {workspaceMembers.map((member) => (
                <View key={member.id} style={styles.card}>
                  <View style={styles.memberCardHeader}>
                    <View style={[styles.avatarCircle, { backgroundColor: '#EDE9FE' }]}>
                      <Text style={[styles.avatarText, { color: colors.primary }]}>
                        {member.initial || member.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.memberInfoCol}>
                      <Text style={styles.memberNameRole}>
                        {member.name} · {member.roleCategory || member.role}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.roleCategoryHeading}>{member.roleCategory || member.role}</Text>

                  <View style={styles.memberRespBox}>
                    <Text style={styles.respBody}>
                      Responsibilities: {member.responsibilities}
                    </Text>
                  </View>

                  <Text style={styles.memberCommitmentMeta}>
                    Commitment summary · {member.hours || '6 h / week'} · 6 weeks{'\n'}
                    19 Oct–30 Nov 2026 · Self-reported
                  </Text>

                  {/* View commitment summary is PURPLE UNDERLINED TEXT (Frame 23, 27) */}
                  <TouchableOpacity
                    onPress={() => router.push('/review-commitment')}
                    style={styles.underlinedLinkRow}
                  >
                    <Text style={styles.underlinedLink}>View commitment summary</Text>
                  </TouchableOpacity>

                  {/* Owner Controls (Frame 23) vs Read-Only (Frame 27) */}
                  {isOwner ? (
                    <View style={{ marginTop: spacing.sm }}>
                      {/* Edit role is OUTLINE BUTTON with border radius 8 */}
                      <Button
                        title="Edit role"
                        variant="outline"
                        onPress={() => router.push({ pathname: '/edit-role', params: { memberId: member.id } })}
                        style={{ marginTop: spacing.xs }}
                      />

                      {/* Review release of role is PURPLE UNDERLINED TEXT (Frame 23) */}
                      {!member.isOwner && (
                        <TouchableOpacity
                          onPress={() => router.push({ pathname: '/release-role', params: { memberId: member.id } })}
                          style={styles.underlinedLinkRow}
                        >
                          <Text style={styles.underlinedLink}>
                            Review release of {member.name}&apos;s role
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    /* Read-Only Banner for Members (Frame 27) */
                    <View style={styles.readOnlyNoticeBox}>
                      <Text style={styles.readOnlyNoticeTitle}>Role details are read only</Text>
                      <Text style={styles.readOnlyNoticeBody}>
                        Only Ada, the Owner, manages team roles. You can view saved commitment.
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* ========================================================= */}
          {/* 3. TASKS SECTION (S27)                                    */}
          {/* ========================================================= */}
          {selectedSection === 'Tasks' && (
            <View>
              <Text style={styles.sectionHeaderTitle}>Tasks</Text>

              {/* Progress Summary Card */}
              <View style={styles.card}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Overall tasks</Text>
                  <Text style={styles.progressCount}>{doneTasks} of {totalTasks} Done</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${(doneTasks / totalTasks) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.taskBreakdownText}>
                  {totalTasks} tasks · {doneTasks} Done · {notDoneTasks} not Done · {overdueTasks} overdue
                </Text>
              </View>

              {/* Segmented Filter: All vs My */}
              <View style={styles.segmentToggleRow}>
                <TouchableOpacity
                  style={[styles.segmentBtn, taskTab === 'all' && styles.segmentBtnActive]}
                  onPress={() => setTaskTab('all')}
                >
                  <Text style={[styles.segmentBtnText, taskTab === 'all' && styles.segmentBtnTextActive]}>
                    All tasks · {totalTasks}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, taskTab === 'my' && styles.segmentBtnActive]}
                  onPress={() => setTaskTab('my')}
                >
                  <Text style={[styles.segmentBtnText, taskTab === 'my' && styles.segmentBtnTextActive]}>
                    My tasks · {myTasksList.length}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Filter Pickers */}
              <View style={styles.filterRow}>
                {/* Assignee Filter */}
                <TouchableOpacity
                  style={styles.filterDropdown}
                  onPress={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}
                >
                  <Text style={styles.filterValue}>{filterAssignee}</Text>
                  <Text style={styles.dropdownChevron}>▾</Text>
                </TouchableOpacity>

                {/* Status Filter */}
                <TouchableOpacity
                  style={styles.filterDropdown}
                  onPress={() => setStatusDropdownOpen(!statusDropdownOpen)}
                >
                  <Text style={styles.filterValue}>{filterStatus}</Text>
                  <Text style={styles.dropdownChevron}>▾</Text>
                </TouchableOpacity>

                {/* Milestone Filter */}
                <TouchableOpacity
                  style={styles.filterDropdown}
                  onPress={() => setMilestoneDropdownOpen(!milestoneDropdownOpen)}
                >
                  <Text style={styles.filterValue}>{filterMilestone}</Text>
                  <Text style={styles.dropdownChevron}>▾</Text>
                </TouchableOpacity>
              </View>

              {/* Assignee Options */}
              {assigneeDropdownOpen && (
                <View style={styles.dropdownList}>
                  {['All members', 'Ada', 'David', 'John'].map((name) => (
                    <TouchableOpacity
                      key={name}
                      style={[styles.dropdownItem, filterAssignee === name && styles.dropdownItemActive]}
                      onPress={() => {
                        setFilterAssignee(name);
                        setAssigneeDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, filterAssignee === name && styles.dropdownItemTextActive]}>
                        {name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Status Options */}
              {statusDropdownOpen && (
                <View style={styles.dropdownList}>
                  {['All statuses', 'To do', 'In progress', 'In review', 'Blocked', 'Done'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[styles.dropdownItem, filterStatus === st && styles.dropdownItemActive]}
                      onPress={() => {
                        setFilterStatus(st);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, filterStatus === st && styles.dropdownItemTextActive]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Milestone Options */}
              {milestoneDropdownOpen && (
                <View style={styles.dropdownList}>
                  {['All milestones', 'M1 Requirements', 'M2 Working prototype', 'M3 Final demo'].map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.dropdownItem, filterMilestone === m && styles.dropdownItemActive]}
                      onPress={() => {
                        setFilterMilestone(m);
                        setMilestoneDropdownOpen(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, filterMilestone === m && styles.dropdownItemTextActive]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Create Task Button (Owner Only) - Solid purple with border radius 8 */}
              {isOwner && (
                <Button
                  title="Create task"
                  onPress={() => router.push('/create-task')}
                  style={{ marginTop: spacing.md, marginBottom: spacing.lg }}
                />
              )}

              {/* Task Cards List */}
              {filteredTasks.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyCardText}>No tasks match the selected filters.</Text>
                  <Button
                    title="Reset filters"
                    variant="outline"
                    onPress={() => {
                      setFilterAssignee('All members');
                      setFilterStatus('All statuses');
                      setFilterMilestone('All milestones');
                    }}
                    style={{ marginTop: spacing.md }}
                  />
                </View>
              ) : (
                filteredTasks.map((task) => (
                  <View key={task.id} style={styles.card}>
                    <View style={styles.badgeRow}>
                      {task.status === 'Blocked' && (
                        <View style={styles.badgeBlocked}>
                          <Text style={styles.badgeBlockedText}>! Blocked</Text>
                        </View>
                      )}
                      {task.status === 'Done' && (
                        <View style={styles.badgeDone}>
                          <Text style={styles.badgeDoneText}>✓ Done</Text>
                        </View>
                      )}
                      {task.status === 'In review' && (
                        <View style={styles.badgeReview}>
                          <Text style={styles.badgeReviewText}>O In review</Text>
                        </View>
                      )}
                      {task.status === 'In progress' && (
                        <View style={styles.badgeProgress}>
                          <Text style={styles.badgeProgressText}>O In progress</Text>
                        </View>
                      )}
                      {task.status === 'To do' && (
                        <View style={styles.badgeGeneral}>
                          <Text style={styles.badgeGeneralText}>To do</Text>
                        </View>
                      )}
                      {task.isOverdue && (
                        <View style={styles.badgeOverdue}>
                          <Text style={styles.badgeOverdueText}>Overdue {task.overdueDays || 2} days</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.taskCardTitle}>{task.title}</Text>
                    <View style={styles.ownerRow}>
                      <View style={[styles.miniAvatar, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.miniAvatarText, { color: colors.primary }]}>
                          {task.ownerName.charAt(0)}
                        </Text>
                      </View>
                      <Text style={styles.ownerText}>
                        Owner: {task.ownerName} · {task.ownerRole}
                      </Text>
                    </View>
                    <Text style={styles.taskMetaText}>
                      Due: {task.dueDate} · Milestone: {task.milestoneName}
                    </Text>
                    {task.blockerNote && (
                      <Text style={styles.blockerNoteText}>
                        Blocker note: {task.blockerNote}
                      </Text>
                    )}

                    {/* Open task details is PURPLE UNDERLINED TEXT (Frame 38) */}
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/task-detail', params: { id: task.id } })}
                      style={styles.underlinedLinkRow}
                    >
                      <Text style={styles.underlinedLink}>Open task details</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}

          {/* ========================================================= */}
          {/* 4. MILESTONES SECTION (S32)                               */}
          {/* ========================================================= */}
          {selectedSection === 'Milestones' && (
            <View>
              <Text style={styles.sectionHeaderTitle}>Milestones</Text>
              <Text style={styles.sectionSubtitle}>
                Task counts show saved progress. Ada can edit milestone details.
              </Text>

              {workspaceMilestones.map((m) => {
                const linkedTasks = workspaceTasks.filter((t) => t.milestoneId === m.id);
                return (
                  <View key={m.id} style={styles.card}>
                    <Text style={styles.milestoneNameHeading}>{m.name}</Text>
                    <Text style={styles.milestoneProgressLine}>
                      {m.doneTasks} / {m.totalTasks} Done
                    </Text>
                    <Text style={styles.milestoneTargetLine}>Target: {m.targetDate}</Text>

                    <View style={styles.linkedTasksList}>
                      {linkedTasks.map((t) => (
                        <Text key={t.id} style={styles.linkedTaskItem}>
                          • {t.title} · {t.ownerName} · {t.status}
                        </Text>
                      ))}
                    </View>

                    {/* View linked tasks is PURPLE UNDERLINED TEXT */}
                    <TouchableOpacity
                      onPress={() => {
                        setFilterMilestone(m.name);
                        setSelectedSection('Tasks');
                      }}
                      style={styles.underlinedLinkRow}
                    >
                      <Text style={styles.underlinedLink}>View linked tasks</Text>
                    </TouchableOpacity>

                    {isOwner && (
                      <Button
                        title="Edit milestone"
                        variant="outline"
                        onPress={() => router.push({ pathname: '/edit-milestone', params: { id: m.id } })}
                        style={{ marginTop: spacing.md }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* ========================================================= */}
          {/* 5. UPDATES SECTION (S35)                                  */}
          {/* ========================================================= */}
          {selectedSection === 'Updates' && (
            <View>
              <Text style={styles.sectionHeaderTitle}>Updates</Text>
              <Text style={styles.sectionSubtitle}>
                Share a project update with your accepted team.
              </Text>

              <View style={styles.card}>
                <Text style={styles.cardHeading}>Write an update</Text>
                <Text style={styles.fieldLabel}>Project update</Text>
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={3}
                  value={updateText}
                  onChangeText={setUpdateText}
                  placeholder="Share an update..."
                />
                <Text style={styles.helperSubtext}>Local draft · Not posted</Text>
                <Button
                  title="Post update"
                  loading={isPostingUpdate}
                  onPress={handlePostUpdate}
                  style={{ marginTop: spacing.md }}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardHeading}>Project thread</Text>
                {workspaceUpdates.map((u) => (
                  <View key={u.id} style={styles.updateItem}>
                    <View style={styles.updateHeaderRow}>
                      <View style={[styles.miniAvatar, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.miniAvatarText, { color: colors.primary }]}>
                          {u.initial || u.author.charAt(0)}
                        </Text>
                      </View>
                      <Text style={styles.updateAuthor}>{u.author}</Text>
                      <Text style={styles.updateDate}>{u.date}</Text>
                    </View>
                    <Text style={styles.updateBody}>{u.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ========================================================= */}
          {/* 6. REMINDERS & RECOVERY SECTION (S36 & S51)               */}
          {/* ========================================================= */}
          {selectedSection === 'Reminders' && (
            <View>
              <Text style={styles.sectionHeaderTitle}>Reminders and recovery</Text>
              <Text style={styles.sectionSubtitle}>
                Update status or request a date change or handover from Ada.
              </Text>

              <View style={styles.card}>
                <View style={styles.badgeRow}>
                  <View style={styles.badgeBlocked}>
                    <Text style={styles.badgeBlockedText}>! Blocked</Text>
                  </View>
                  <View style={styles.badgeOverdue}>
                    <Text style={styles.badgeOverdueText}>Overdue 2 days</Text>
                  </View>
                </View>

                <Text style={styles.taskCardTitle}>Design onboarding</Text>
                <View style={styles.ownerRow}>
                  <View style={[styles.miniAvatar, { backgroundColor: '#EDE9FE' }]}>
                    <Text style={[styles.miniAvatarText, { color: colors.primary }]}>D</Text>
                  </View>
                  <Text style={styles.ownerText}>Owner: David</Text>
                </View>
                <Text style={styles.taskMetaText}>
                  Due: 10 Nov 2026 · Milestone: M2 Working prototype
                </Text>
                <Text style={styles.blockerNoteText}>
                  Blocker note: Waiting for agreed sign-up fields.
                </Text>

                {/* Mark done is an OUTLINE BUTTON (Frame 83) */}
                <Button
                  title="Mark done"
                  variant="outline"
                  onPress={() => router.push({ pathname: '/task-detail', params: { id: 't3' } })}
                  style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
                />

                {/* Request new date is PURPLE UNDERLINED TEXT (Frame 83) */}
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/task-detail', params: { id: 't3' } })}
                  style={styles.underlinedLinkRow}
                >
                  <Text style={styles.underlinedLink}>Request new date</Text>
                </TouchableOpacity>

                {/* Hand it over is PURPLE UNDERLINED TEXT (Frame 83) */}
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/task-detail', params: { id: 't3' } })}
                  style={styles.underlinedLinkRow}
                >
                  <Text style={styles.underlinedLink}>Hand it over</Text>
                </TouchableOpacity>

                <Text style={styles.helperSubtextCentered}>
                  Update status or request a date change or handover from Ada.
                </Text>

                {/* Owner Manual Reassignment Option */}
                {isOwner && (
                  <View style={{ marginTop: spacing.lg }}>
                    <Button
                      title="Review manual reassignment"
                      variant="outline"
                      onPress={() => router.push({ pathname: '/reassign-task', params: { taskId: 't3' } })}
                    />
                  </View>
                )}
              </View>
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
  completionBannerCard: {
    backgroundColor: '#EEECFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: spacing.md,
  },
  completionBannerHeader: {
    marginBottom: 4,
  },
  completionBannerBadge: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  completionBannerTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: '#312E81',
    marginBottom: 4,
  },
  completionBannerText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#4338CA',
    lineHeight: 17,
    marginBottom: 10,
  },
  completionBannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completionBannerBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
  },
  completionBannerBtnText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  completionBannerSubBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
  },
  completionBannerSubBtnText: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: 12,
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
  sectionHeaderTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  dateStamp: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 20,
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
  cardHeadingLarge: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  artworkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  artworkImage: {
    width: 220,
    height: 120,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 13,
    color: colors.textBody,
    fontFamily: fonts.semiBold,
  },
  progressCount: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: radius.full,
  },
  taskBreakdownText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  memberCirclesRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  initialCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  initialText: {
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  memberSubText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  milestoneItem: {
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  milestoneTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  milestoneMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
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
  badgeReview: {
    backgroundColor: '#F3E8FF',
    borderColor: '#D8B4FE',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  badgeReviewText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#6B21A8',
  },
  badgeProgress: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  badgeProgressText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#0369A1',
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
  upcomingItem: {
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  upcomingTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
  },
  upcomingMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  memberTaskCard: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  memberRestrictedFooter: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
    lineHeight: 16,
  },
  memberCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  memberInfoCol: {
    flex: 1,
  },
  memberNameRole: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  roleCategoryHeading: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  memberRespBox: {
    marginVertical: spacing.xs,
  },
  respBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
  memberCommitmentMeta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginVertical: spacing.xs,
  },
  readOnlyNoticeBox: {
    backgroundColor: '#F5F3FF',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginTop: spacing.md,
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
  segmentToggleRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  segmentBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  segmentBtnText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textBody,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  filterDropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderInput,
    backgroundColor: '#FFFFFF',
  },
  filterValue: {
    fontSize: 11,
    color: colors.textHeading,
    fontFamily: fonts.semiBold,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyCardText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  milestoneNameHeading: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  milestoneProgressLine: {
    fontSize: 13,
    color: colors.textBody,
    fontFamily: fonts.semiBold,
    marginTop: 2,
  },
  milestoneTargetLine: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  linkedTasksList: {
    marginVertical: spacing.sm,
  },
  linkedTaskItem: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    marginVertical: 2,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: 4,
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
    marginTop: spacing.xs,
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
  updateItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  updateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  updateAuthor: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginRight: spacing.sm,
  },
  updateDate: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  updateBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
  },
});
