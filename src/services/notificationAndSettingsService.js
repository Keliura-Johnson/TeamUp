// Notification, Settings and Team Health Service for TeamUp Walkthrough 7
// Manages Notifications, User Settings & Preferences, Account Deletion, and Team Health Check-ins

export const initialNotifications = [
  {
    id: 'notif-1',
    category: 'Invitation',
    status: 'Unread',
    title: "You're invited to Student study planner.",
    time: 'Today · 10:30',
    actionLabel: 'Review invitation',
    route: '/invitation-details',
  },
  {
    id: 'notif-2',
    category: 'Join request',
    status: 'Unread',
    title: 'Maya would like to join Campus Marketplace.',
    time: 'Today · 09:45',
    actionLabel: 'Review request',
    route: '/review-join-requests',
  },
  {
    id: 'notif-3',
    category: 'Deadline reminder',
    status: 'Unread',
    title: 'Prototype review is due tomorrow. Need a hand?',
    time: 'Campus Marketplace · Today · 09:00',
    actionLabel: 'Open task',
    route: '/task-detail',
    params: { id: 't6' },
  },
  {
    id: 'notif-4',
    category: 'Overdue prompt',
    status: 'Read',
    title: "Design onboarding is past its due date. Let's plan the next step.",
    time: 'Campus Marketplace · 11 Nov',
    actionLabel: 'Open task',
    route: '/task-detail',
    params: { id: 't3' },
  },
  {
    id: 'notif-5',
    category: 'Role released',
    status: 'Read',
    title: 'A Designer role is available in Library finder.',
    time: '11 Nov',
    actionLabel: 'View role',
    route: '/discover-projects',
  },
  {
    id: 'notif-6',
    category: 'Weekly check-in',
    status: 'Read',
    title: 'How is the team doing this week? Share in Updates.',
    time: 'Campus Marketplace · 10 Nov',
    actionLabel: 'Open Updates',
    route: '/project-updates',
  },
  {
    id: 'notif-7',
    category: 'Inactivity prompt',
    status: 'Read',
    title: 'John has had no activity for 5 days. Consider checking in.',
    time: 'Campus Marketplace · 9 Nov',
    actionLabel: 'Review prompt',
    route: '/team-health',
  },
];

export const initialNotificationPreferences = {
  invitations: true,
  joinRequests: true,
  deadlineReminders: true,
  overduePrompts: true,
  roleReleased: true,
  weeklyCheckIns: true,
  ownerInactivityPrompts: true,
};

export const initialTeamHealthData = {
  projectId: 'campus-marketplace',
  projectTitle: 'Campus Marketplace',
  status: 'Needs attention',
  statusDescription: 'A shared team view, not an assessment of individual members.',
  tasksDone: 2,
  totalTasks: 6,
  overdueTasks: 1,
  projectProgress: 'In Progress',
  teammates: [
    { initial: 'A', name: 'Ada', role: 'Owner' },
    { initial: 'D', name: 'David', role: 'Designer' },
    { initial: 'J', name: 'John', role: 'Developer' },
  ],
  inactiveMember: {
    initial: 'J',
    name: 'John',
    inactiveDays: 5,
    defaultFollowUpMessage:
      '@John, how are things going? Is there anything we can help with, or would a different commitment work better?',
  },
  weeklyCheckIn: {
    period: '9–15 NOV',
    defaultMessage:
      "We agreed the requirements. Next, I'll help unblock sign-up fields. Could we review them together?",
  },
};

// Async mock API helpers

export async function fetchNotificationsApi() {
  await new Promise((r) => setTimeout(r, 400));
  return { success: true, data: initialNotifications };
}

export async function markAllNotificationsAsReadApi() {
  await new Promise((r) => setTimeout(r, 350));
  return { success: true, data: { markedCount: 3 } };
}

export async function markNotificationAsReadApi(notificationId) {
  await new Promise((r) => setTimeout(r, 200));
  return { success: true, data: { id: notificationId, status: 'Read' } };
}

export async function saveUserSettingsApi(profileData, preferences) {
  await new Promise((r) => setTimeout(r, 450));
  if (!profileData?.name?.trim()) {
    return { success: false, error: 'Name cannot be empty.' };
  }
  return {
    success: true,
    data: {
      profile: profileData,
      preferences,
      savedAt: new Date().toLocaleTimeString(),
    },
  };
}

export async function requestAccountDeletionApi(userName) {
  await new Promise((r) => setTimeout(r, 500));
  return {
    success: true,
    data: {
      user: userName,
      submittedDate: '12 Nov 2026',
      status: 'Deletion request received',
      message:
        'Your request has been submitted. This is not confirmation that your account is deleted.',
    },
  };
}
