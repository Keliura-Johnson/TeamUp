import React, { createContext, useContext, useState } from 'react';
import {
  initialDraftProject,
  saveProjectDraftApi,
  publishProjectApi,
  validatePublishReadiness,
} from '../services/projectService';
import {
  initialDiscoverProjects,
  initialCollaboratorCandidates,
  initialJoinRequests,
  initialInvitations,
  checkRoleEligibility,
  sendInvitationApi,
  sendJoinRequestApi,
  respondToJoinRequestApi,
  acceptCommitmentSummaryApi,
  declineInvitationApi,
} from '../services/invitationService';
import {
  initialWorkspaceMembers,
  initialMilestones,
  initialTasks,
  initialProjectUpdates,
  createTaskApi,
  updateTaskStatusApi,
  reassignTaskApi,
  addTaskCommentApi,
  postProjectUpdateApi,
  editMilestoneApi,
  editRoleApi,
  releaseRoleApi,
} from '../services/workspaceService';
import {
  initialCompletionState,
  saveOutcomeAndDeliverablesApi,
  saveContributionReviewApi,
  confirmMemberContributionApi,
  returnWordingFeedbackApi,
  completeProjectApi,
  saveSharingPrivacyApi,
} from '../services/completionService';
import {
  initialNotifications,
  initialNotificationPreferences,
  initialTeamHealthData,
  saveUserSettingsApi,
  requestAccountDeletionApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from '../services/notificationAndSettingsService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Ada',
    email: 'ada@example.org',
    role: 'Product Manager',
    skillLevel: 'Beginner',
    skills: ['planning', 'research'],
    goals: 'Practice defining requirements and coordinating a small product team.',
    weeklyAvailability: '5 hours / week',
    projectDuration: '6 weeks',
  });

  const [visibility, setVisibility] = useState({
    name: false,
    role: false,
    skills: false,
    skillLevel: false,
    goals: false,
    availability: false,
    duration: false,
    displayProject: false,
  });

  // Active Project (Campus Marketplace - In Progress snapshot for 12 Nov 2026)
  const [activeProject, setActiveProject] = useState({
    id: 'campus-marketplace',
    title: 'Campus Marketplace',
    status: 'In Progress',
    role: 'Owner · Product Manager · 5 hours/week',
    dates: '19 Oct–30 Nov 2026 · 6 weeks',
    teammates: [
      { id: 'ada', initial: 'A', name: 'Ada', role: 'Product Manager', isOwner: true, color: '#6336E4', bg: '#EEECFC' },
      { id: 'david', initial: 'D', name: 'David', role: 'Designer', isOwner: false, color: '#0284C7', bg: '#E0F2FE' },
      { id: 'john', initial: 'J', name: 'John', role: 'Developer', isOwner: false, color: '#0D9488', bg: '#E0F7F4' },
    ],
    completedTasksCount: 2,
    totalTasksCount: 6,
    milestones: [
      { id: 'm1', name: 'Requirements', date: '02 Nov', done: 2, total: 2 },
      { id: 'm2', name: 'Working prototype', date: '16 Nov', done: 0, total: 3 },
      { id: 'm3', name: 'Final demo', date: '30 Nov', done: 0, total: 1 },
    ],
  });

  // Needs Attention Task
  const [needsAttentionTask, setNeedsAttentionTask] = useState({
    id: 'task-design-onboarding',
    title: 'Design onboarding',
    assignee: { initial: 'D', name: 'David', role: 'Designer', color: '#0284C7', bg: '#E0F2FE' },
    dueDate: 'Due 10 Nov 2026 · Working prototype',
    isBlocked: true,
    isOverdue: true,
    overdueDays: 2,
    blockerNote: 'Waiting for agreed sign-up fields.',
  });

  // Pending Invitation
  const [pendingInvitation, setPendingInvitation] = useState({
    id: 'inv-student-study-planner',
    title: 'Student study planner',
    description: 'Help plan a student study tool.',
    details: 'Product Manager · 4 hours/week · 4 weeks',
    status: 'Pending response',
  });

  // Upcoming Tasks
  const [upcomingTasks, setUpcomingTasks] = useState([
    {
      id: 'task-proto-review',
      title: 'Prototype review',
      subtitle: 'Ada · Due 13 Nov 2026',
      status: 'To do',
      statusType: 'todo',
    },
    {
      id: 'task-ui-handoff',
      title: 'UI handoff',
      subtitle: 'David · Due 13 Nov 2026',
      status: 'In review',
      statusType: 'review',
    },
  ]);

  // All 6 Projects for "My Projects" (S49)
  const [projectsList, setProjectsList] = useState([
    {
      id: 'proj-1',
      title: 'Campus book exchange',
      status: 'Draft',
      statusType: 'draft',
      description: 'Help students exchange course books on campus.',
      meta: 'Owner · Project setup not yet published',
      actionLabel: 'Resume draft',
      footerNote: 'Your draft is private until you publish.',
    },
    {
      id: 'proj-2',
      title: 'Student study planner',
      status: 'Open',
      statusType: 'open',
      description: 'Build a simple tool for planning study sessions.',
      meta: 'Recruiting a Designer · UI design · 6 hours/week · 4 weeks',
      actionLabel: 'View project page',
      footerNote: 'Review the role and commitment before requesting to join.',
    },
    {
      id: 'proj-3',
      title: 'Library finder',
      status: 'Team Formed',
      statusType: 'formed',
      description: 'Find nearby campus libraries and useful study spaces.',
      meta: 'Member · Frontend Developer · Team not started',
      actionLabel: 'Open joined workspace',
      footerNote: 'Joined · Awaiting project start',
    },
    {
      id: 'proj-4',
      title: 'Campus Marketplace',
      status: 'In Progress',
      statusType: 'progress',
      description: 'Build a place for students to list and find campus items.',
      meta: 'Owner · Product Manager · 19 Oct–30 Nov 2026',
      actionLabel: 'Open project workspace',
      footerNote: '12 Nov · 2 of 6 tasks Done.',
    },
    {
      id: 'proj-5',
      title: 'Peer resource directory',
      status: 'Completed',
      statusType: 'completed',
      description: 'A shared directory of learning resources for students.',
      meta: 'Member · Completed project · Individual contribution available',
      actionLabel: 'View private project page',
      footerNote: 'Private on your profile. Team-page sharing is independent.',
    },
    {
      id: 'proj-6',
      title: 'Small campus events',
      status: 'Ended Early',
      statusType: 'ended',
      description: 'A prototype for browsing small campus events.',
      meta: 'Member · Ended Early · Contribution records retained',
      actionLabel: 'View preserved record',
      footerNote: 'Not Completed. Existing work remains available for review.',
    },
  ]);

  const [currentDraft, setCurrentDraft] = useState(initialDraftProject);

  const updateUser = (fields) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  const updateVisibility = (fields) => {
    setVisibility((prev) => ({ ...prev, ...fields }));
  };

  const updateCurrentDraft = (fields) => {
    setCurrentDraft((prev) => ({ ...prev, ...fields }));
  };

  const saveCurrentDraft = async () => {
    const res = await saveProjectDraftApi(currentDraft);
    if (res.success) {
      setCurrentDraft(res.data);
      // Update projectsList draft entry if exists or add it
      setProjectsList((prev) => {
        const idx = prev.findIndex((p) => p.id === currentDraft.id);
        const draftSummary = {
          id: currentDraft.id,
          title: currentDraft.name || 'Untitled Draft',
          status: 'Draft',
          statusType: 'draft',
          description: currentDraft.problem || currentDraft.description || '',
          meta: `Owner · Project setup not yet published · Last saved ${res.data.lastSaved}`,
          actionLabel: 'Resume draft',
          footerNote: 'Your draft is private until you publish.',
        };
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = draftSummary;
          return updated;
        }
        return [draftSummary, ...prev];
      });
    }
    return res;
  };

  const publishCurrentProject = async () => {
    const res = await publishProjectApi(currentDraft);
    if (res.success) {
      const published = res.data;
      setCurrentDraft(published);
      // Add or update to projectsList with 'Open' status
      setProjectsList((prev) => {
        const filtered = prev.filter((p) => p.id !== currentDraft.id && p.id !== published.id);
        const openProjectEntry = {
          id: published.id,
          title: published.name,
          status: 'Open',
          statusType: 'open',
          description: published.problem || published.description,
          meta: `Owner · ${published.duration} · Open for recruitment`,
          actionLabel: 'View project page',
          footerNote: 'Recruitment is open. No team has formed or started yet.',
        };
        return [openProjectEntry, ...filtered];
      });
    }
    return res;
  };

  const resumeDraft = (projectId) => {
    // If resuming the specific draft or default
    if (projectId === 'proj-1' || projectId === currentDraft.id) {
      // Keep or load current draft
      return currentDraft;
    }
    return currentDraft;
  };

  const initiateNewDraft = () => {
    const newDraft = {
      ...initialDraftProject,
      id: `draft-${Date.now()}`,
      name: '',
      problem: '',
      description: '',
      projectType: 'Web application',
      requiredSkills: [],
      expectedOutcome: '',
      roles: [],
      milestones: [],
      status: 'Draft',
    };
    setCurrentDraft(newDraft);
    return newDraft;
  };

  // Discovery & Invitation Global State
  const [discoverProjects, setDiscoverProjects] = useState(initialDiscoverProjects);
  const [candidates, setCandidates] = useState(initialCollaboratorCandidates);
  const [joinRequests, setJoinRequests] = useState(initialJoinRequests);
  const [invitations, setInvitations] = useState(initialInvitations);
  
  // Current active persona for viewing joiner vs owner screens: 'Ada' (Owner) | 'David' (Designer Joiner) | 'John' (Developer Joiner)
  const [activePersona, setActivePersona] = useState('Ada');

  const davidProfile = {
    id: 'david',
    name: 'David',
    initial: 'D',
    email: 'david@example.org',
    role: 'UI/UX Designer',
    skillLevel: 'Intermediate',
    skills: ['UI design', 'Prototyping'],
    goals: 'Contribute to meaningful campus projects and build portfolio.',
    weeklyAvailability: '6 h / week',
    projectDuration: '6 weeks',
  };

  const johnProfile = {
    id: 'john',
    name: 'John',
    initial: 'J',
    email: 'john@example.org',
    role: 'Frontend Developer',
    skillLevel: 'Intermediate',
    skills: ['Frontend development', 'React'],
    goals: 'Learn mobile development and collaborate with cross-functional team.',
    weeklyAvailability: '8 h / week',
    projectDuration: '6 weeks',
  };

  const getActiveUserProfile = () => {
    if (activePersona === 'David') return davidProfile;
    if (activePersona === 'John') return johnProfile;
    return user;
  };

  // Actions for sending invitations
  const sendInvitation = async (candidate, role, project) => {
    const invData = {
      projectId: project.id,
      projectTitle: project.title,
      roleId: role.id,
      roleTitle: role.title,
      owner: { id: user.name.toLowerCase(), name: user.name, role: user.role },
      recipient: candidate,
    };
    const res = await sendInvitationApi(invData);
    if (res.success) {
      setInvitations((prev) => [res.data, ...prev]);
    }
    return res;
  };

  // Actions for join requests
  const sendJoinRequest = async (role, project, applicant) => {
    const reqData = {
      projectId: project.id,
      projectTitle: project.title,
      roleId: role.id,
      roleTitle: role.title,
      applicant: applicant || getActiveUserProfile(),
    };
    const res = await sendJoinRequestApi(reqData);
    if (res.success) {
      setJoinRequests((prev) => [res.data, ...prev]);
    }
    return res;
  };

  // Action for Owner approving/declining join request (S50)
  const respondToJoinRequest = async (requestId, decision) => {
    const res = await respondToJoinRequestApi(requestId, decision);
    if (res.success) {
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: decision } : r))
      );
    }
    return res;
  };

  // Action for Recipient declining invitation (S21/S24)
  const declineInvitation = async (invitationId) => {
    const res = await declineInvitationApi(invitationId);
    if (res.success) {
      setInvitations((prev) =>
        prev.map((i) => (i.id === invitationId ? { ...i, status: 'Declined' } : i))
      );
    }
    return res;
  };

  // Action for accepting commitment and gaining workspace access (S22/S23 -> PRD FR-30)
  const acceptCommitment = async (commitmentData) => {
    const res = await acceptCommitmentSummaryApi(commitmentData);
    if (res.success) {
      // Mark invitation / join request as Accepted
      setInvitations((prev) =>
        prev.map((i) =>
          i.id === commitmentData.invitationId
            ? { ...i, status: 'Accepted', acceptanceDate: res.data.datedAcceptance }
            : i
        )
      );
      // Update projects list with newly joined project
      setProjectsList((prev) => [
        {
          id: commitmentData.projectId,
          title: commitmentData.projectTitle || 'Campus Marketplace',
          status: 'In Progress',
          statusType: 'progress',
          description: commitmentData.description || 'Joined via accepted commitment.',
          meta: `Member · ${commitmentData.roleTitle || 'UI/UX Designer'} · Accepted ${res.data.datedAcceptance}`,
          actionLabel: 'Open joined workspace',
          footerNote: `Accepted on ${res.data.datedAcceptance}. Workspace access unlocked.`,
        },
        ...prev,
      ]);
    }
    return res;
  };

  // Shared Workspace State (Batch 4 / Walkthrough 5)
  const [workspaceMembers, setWorkspaceMembers] = useState(initialWorkspaceMembers);
  const [workspaceTasks, setWorkspaceTasks] = useState(initialTasks);
  const [workspaceMilestones, setWorkspaceMilestones] = useState(initialMilestones);
  const [workspaceUpdates, setWorkspaceUpdates] = useState(initialProjectUpdates);

  const createWorkspaceTask = async (taskData) => {
    const res = await createTaskApi(taskData);
    if (res.success) {
      setWorkspaceTasks((prev) => [res.data, ...prev]);
      setWorkspaceMilestones((prev) =>
        prev.map((m) =>
          m.id === taskData.milestoneId
            ? { ...m, totalTasks: m.totalTasks + 1 }
            : m
        )
      );
    }
    return res;
  };

  const updateWorkspaceTaskStatus = async (taskId, updates) => {
    const res = await updateTaskStatusApi(taskId, updates);
    if (res.success) {
      setWorkspaceTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
      if (updates.status) {
        setWorkspaceMilestones((prevM) =>
          prevM.map((m) => {
            const mTasks = workspaceTasks.map((t) =>
              t.id === taskId ? { ...t, status: updates.status } : t
            ).filter((t) => t.milestoneId === m.id);
            const doneCount = mTasks.filter((t) => t.status === 'Done').length;
            return { ...m, doneTasks: doneCount, totalTasks: mTasks.length };
          })
        );
      }
    }
    return res;
  };

  const reassignWorkspaceTask = async (taskId, newOwnerId, handoverNote) => {
    const res = await reassignTaskApi(taskId, newOwnerId, handoverNote);
    if (res.success) {
      const targetMember = workspaceMembers.find((m) => m.id === newOwnerId);
      setWorkspaceTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                ownerId: newOwnerId,
                ownerName: targetMember?.name || newOwnerId,
                ownerRole: targetMember?.roleCategory || 'Member',
                handoverNote,
              }
            : t
        )
      );
    }
    return res;
  };

  const addWorkspaceTaskComment = async (taskId, commentText, authorName) => {
    const res = await addTaskCommentApi(taskId, commentText, authorName);
    if (res.success) {
      setWorkspaceTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, comments: [...(t.comments || []), res.data] }
            : t
        )
      );
    }
    return res;
  };

  const postWorkspaceUpdate = async (updateText, authorName) => {
    const res = await postProjectUpdateApi(updateText, authorName);
    if (res.success) {
      setWorkspaceUpdates((prev) => [res.data, ...prev]);
    }
    return res;
  };

  const editWorkspaceMilestone = async (milestoneId, name, targetDate) => {
    const res = await editMilestoneApi(milestoneId, name, targetDate);
    if (res.success) {
      setWorkspaceMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId ? { ...m, name, targetDate } : m
        )
      );
    }
    return res;
  };

  const editWorkspaceRole = async (memberId, roleTitle, responsibilities) => {
    const res = await editRoleApi(memberId, roleTitle, responsibilities);
    if (res.success) {
      setWorkspaceMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, role: roleTitle, responsibilities } : m
        )
      );
    }
    return res;
  };

  const releaseWorkspaceRole = async (memberId) => {
    const res = await releaseRoleApi(memberId);
    if (res.success) {
      setWorkspaceMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, isReleased: true, roleStatus: 'Open' } : m
        )
      );
    }
    return res;
  };

  // Batch 5 / Sixth Walkthrough Completion & Review State
  const [completionState, setCompletionState] = useState(initialCompletionState);

  const saveOutcomeAndDeliverables = async (outcomeText, deliverables) => {
    const res = await saveOutcomeAndDeliverablesApi(outcomeText, deliverables);
    if (res.success) {
      setCompletionState((prev) => ({
        ...prev,
        finalOutcome: res.data.finalOutcome,
        deliverables: res.data.deliverables,
        isOutcomeSaved: true,
      }));
    }
    return res;
  };

  const saveContributionReview = async (memberId, wording, note) => {
    const res = await saveContributionReviewApi(memberId, wording, note);
    if (res.success) {
      setCompletionState((prev) => ({
        ...prev,
        memberSummaries: {
          ...prev.memberSummaries,
          [memberId.toLowerCase()]: {
            ...prev.memberSummaries[memberId.toLowerCase()],
            wording: res.data.wording,
            note: res.data.note,
            reviewStatus: 'Reviewed',
          },
        },
      }));
    }
    return res;
  };

  const confirmMemberContribution = async (reviewerName, subjectId) => {
    const res = await confirmMemberContributionApi(reviewerName, subjectId);
    if (res.success) {
      setCompletionState((prev) => ({
        ...prev,
        memberSummaries: {
          ...prev.memberSummaries,
          [subjectId.toLowerCase()]: {
            ...prev.memberSummaries[subjectId.toLowerCase()],
            confirmedBy: res.data.confirmedBy,
            confirmedDate: res.data.confirmedDate,
            isConfirmed: true,
            reviewStatus: 'Reviewed',
          },
        },
      }));
    }
    return res;
  };

  const returnWordingFeedback = async (reviewerName, subjectId, feedbackText) => {
    const res = await returnWordingFeedbackApi(reviewerName, subjectId, feedbackText);
    return res;
  };

  const completeCampusProject = async () => {
    const res = await completeProjectApi('campus-marketplace');
    if (res.success) {
      setCompletionState((prev) => ({
        ...prev,
        isCompleted: true,
        status: 'Completed',
      }));
      setActiveProject((prev) => ({
        ...prev,
        status: 'Completed',
      }));
      setProjectsList((prev) =>
        prev.map((p) =>
          p.id === 'proj-4' || p.id === 'campus-marketplace'
            ? {
                ...p,
                status: 'Completed',
                statusType: 'completed',
                meta: 'Owner · Product Manager · 19 Oct–30 Nov 2026 · Completed',
                actionLabel: 'View private project page',
                footerNote: 'Completed 30 Nov 2026. Outcome, deliverables and all 3 member confirmations saved.',
              }
            : p
        )
      );
    }
    return res;
  };

  const saveSharingPrivacy = async (memberPersona, displayOnProfile) => {
    const res = await saveSharingPrivacyApi(memberPersona, displayOnProfile);
    if (res.success) {
      setCompletionState((prev) => ({
        ...prev,
        privacySettings: {
          ...prev.privacySettings,
          displayOnProfile: {
            ...prev.privacySettings.displayOnProfile,
            [memberPersona]: res.data.displayOnProfile,
          },
        },
      }));
    }
    return res;
  };

  const togglePreviewLinkMode = (active) => {
    setCompletionState((prev) => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        previewModeActive: active !== undefined ? active : !prev.privacySettings.previewModeActive,
      },
    }));
  };

  // Walkthrough 7: Notifications, Settings, and Team Health States
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationPreferences, setNotificationPreferences] = useState(initialNotificationPreferences);
  const [teamHealthData, setTeamHealthData] = useState(initialTeamHealthData);
  const [accountDeletionStatus, setAccountDeletionStatus] = useState('idle'); // 'idle' | 'submitted'
  const [isFollowUpSent, setIsFollowUpSent] = useState(false);
  const [isWeeklyCheckInSent, setIsWeeklyCheckInSent] = useState(false);

  const unreadNotificationsCount = notifications.filter((n) => n.status === 'Unread').length;

  const markAllNotificationsAsRead = async () => {
    const res = await markAllNotificationsAsReadApi();
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'Read' })));
    }
    return res;
  };

  const markNotificationAsRead = async (notificationId) => {
    const res = await markNotificationAsReadApi(notificationId);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, status: 'Read' } : n))
      );
    }
    return res;
  };

  const updateNotificationPreferences = (prefs) => {
    setNotificationPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const saveSettings = async (profileData, prefs) => {
    const res = await saveUserSettingsApi(profileData, prefs);
    if (res.success) {
      setUser((prev) => ({ ...prev, ...profileData }));
      setNotificationPreferences(prefs);
    }
    return res;
  };

  const requestAccountDeletion = async () => {
    const res = await requestAccountDeletionApi(user.name);
    if (res.success) {
      setAccountDeletionStatus('submitted');
    }
    return res;
  };

  const sendInactivityFollowUp = async (messageText) => {
    const text = messageText || teamHealthData.inactiveMember.defaultFollowUpMessage;
    const author = activePersona === 'Ada' ? 'Ada' : activePersona;
    const res = await postWorkspaceUpdate(text, author);
    if (res.success) {
      setIsFollowUpSent(true);
      // Mark inactivity notification as Read if exists
      setNotifications((prev) =>
        prev.map((n) => (n.category === 'Inactivity prompt' ? { ...n, status: 'Read' } : n))
      );
    }
    return res;
  };

  const sendWeeklyCheckIn = async (messageText) => {
    const text = messageText || teamHealthData.weeklyCheckIn.defaultMessage;
    const author = activePersona === 'Ada' ? 'Ada' : activePersona;
    const res = await postWorkspaceUpdate(text, author);
    if (res.success) {
      setIsWeeklyCheckInSent(true);
      // Mark weekly check-in notification as Read if exists
      setNotifications((prev) =>
        prev.map((n) => (n.category === 'Weekly check-in' ? { ...n, status: 'Read' } : n))
      );
    }
    return res;
  };

  return (
    <AppContext.Provider
      value={{
        user: getActiveUserProfile(),
        baseUser: user,
        updateUser,
        visibility,
        updateVisibility,
        activeProject,
        setActiveProject,
        needsAttentionTask,
        setNeedsAttentionTask,
        pendingInvitation,
        setPendingInvitation,
        upcomingTasks,
        setUpcomingTasks,
        projectsList,
        setProjectsList,
        currentDraft,
        setCurrentDraft,
        updateCurrentDraft,
        saveCurrentDraft,
        publishCurrentProject,
        resumeDraft,
        initiateNewDraft,
        validatePublishReadiness,
        discoverProjects,
        setDiscoverProjects,
        candidates,
        setCandidates,
        joinRequests,
        setJoinRequests,
        invitations,
        setInvitations,
        activePersona,
        setActivePersona,
        getActiveUserProfile,
        sendInvitation,
        sendJoinRequest,
        respondToJoinRequest,
        declineInvitation,
        acceptCommitment,
        checkRoleEligibility,
        workspaceMembers,
        setWorkspaceMembers,
        workspaceTasks,
        setWorkspaceTasks,
        workspaceMilestones,
        setWorkspaceMilestones,
        workspaceUpdates,
        setWorkspaceUpdates,
        createWorkspaceTask,
        updateWorkspaceTaskStatus,
        reassignWorkspaceTask,
        addWorkspaceTaskComment,
        postWorkspaceUpdate,
        editWorkspaceMilestone,
        editWorkspaceRole,
        releaseWorkspaceRole,
        completionState,
        setCompletionState,
        saveOutcomeAndDeliverables,
        saveContributionReview,
        confirmMemberContribution,
        returnWordingFeedback,
        completeCampusProject,
        saveSharingPrivacy,
        togglePreviewLinkMode,
        notifications,
        setNotifications,
        notificationPreferences,
        setNotificationPreferences,
        teamHealthData,
        setTeamHealthData,
        accountDeletionStatus,
        setAccountDeletionStatus,
        isFollowUpSent,
        isWeeklyCheckInSent,
        unreadNotificationsCount,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        updateNotificationPreferences,
        saveSettings,
        requestAccountDeletion,
        sendInactivityFollowUp,
        sendWeeklyCheckIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
