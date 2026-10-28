// Workspace Service for TeamUp Batch 4 / High-Fidelity Walkthrough 5
// Manages shared workspace state, tasks, team roles, milestones, updates, reminders and recovery

export const initialWorkspaceMembers = [
  {
    id: 'ada',
    name: 'Ada',
    initial: 'A',
    role: 'Owner / Product manager',
    roleCategory: 'Product Manager',
    hours: '5 h / week',
    acceptedDate: '19 Oct 2026',
    responsibilities: 'prototype review, defined requirements',
    isOwner: true,
    color: '#6336E4',
    bg: '#EEECFC',
  },
  {
    id: 'david',
    name: 'David',
    initial: 'D',
    role: 'UI/UX Designer',
    roleCategory: 'UI/UX Designer',
    hours: '6 h / week',
    acceptedDate: '19 Oct 2026',
    responsibilities: 'Design onboarding and UI handoff',
    isOwner: false,
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    id: 'john',
    name: 'John',
    initial: 'J',
    role: 'Frontend Developer',
    roleCategory: 'Frontend Developer',
    hours: '8 h / week',
    acceptedDate: '19 Oct 2026',
    responsibilities: 'Auth screens and Build discovery',
    isOwner: false,
    color: '#0D9488',
    bg: '#E0F7F4',
  },
];

export const initialMilestones = [
  {
    id: 'm1',
    name: 'M1 Requirements',
    targetDate: '02 Nov 2026',
    storedTarget: '02 Nov 2026',
    totalTasks: 2,
    doneTasks: 2,
  },
  {
    id: 'm2',
    name: 'M2 Working prototype',
    targetDate: '16 Nov 2026',
    storedTarget: '16 Nov 2026',
    totalTasks: 3,
    doneTasks: 0,
  },
  {
    id: 'm3',
    name: 'M3 Final demo',
    targetDate: '30 Nov 2026',
    storedTarget: '30 Nov 2026',
    totalTasks: 1,
    doneTasks: 0,
  },
];

export const initialTasks = [
  {
    id: 't1',
    title: 'Define user stories',
    ownerId: 'ada',
    ownerName: 'Ada',
    ownerRole: 'Product manager',
    milestoneId: 'm1',
    milestoneName: 'M1 Requirements',
    dueDate: '02 Nov 2026',
    status: 'Done',
    note: 'User stories agreed.',
    isOverdue: false,
    artifactLink: '',
    completionNote: 'User stories agreed.',
    comments: [],
  },
  {
    id: 't2',
    title: 'Build discovery',
    ownerId: 'john',
    ownerName: 'John',
    ownerRole: 'Frontend Developer',
    milestoneId: 'm1',
    milestoneName: 'M1 Requirements',
    dueDate: '10 Nov 2026',
    status: 'Done',
    note: 'Discovery build complete.',
    isOverdue: false,
    artifactLink: '',
    completionNote: 'Discovery build complete.',
    comments: [],
  },
  {
    id: 't3',
    title: 'Design onboarding',
    ownerId: 'david',
    ownerName: 'David',
    ownerRole: 'UI/UX Designer',
    milestoneId: 'm2',
    milestoneName: 'M2 Working prototype',
    dueDate: '10 Nov 2026',
    status: 'Blocked',
    blockerNote: 'Waiting for agreed sign-up fields.',
    isOverdue: true,
    overdueDays: 2,
    comments: [
      {
        id: 'c1',
        author: 'Ada',
        date: '12 Nov 2026',
        text: "I'll help agree the sign-up fields today. Keep the blocker note until that is resolved.",
      },
    ],
  },
  {
    id: 't4',
    title: 'Auth screens',
    ownerId: 'john',
    ownerName: 'John',
    ownerRole: 'Frontend Developer',
    milestoneId: 'm2',
    milestoneName: 'M2 Working prototype',
    dueDate: '14 Nov 2026',
    status: 'In progress',
    isOverdue: false,
    comments: [],
  },
  {
    id: 't5',
    title: 'UI handoff',
    ownerId: 'david',
    ownerName: 'David',
    ownerRole: 'UI/UX Designer',
    milestoneId: 'm2',
    milestoneName: 'M2 Working prototype',
    dueDate: '13 Nov 2026',
    status: 'In review',
    note: 'UI handoff ready for review.',
    isOverdue: false,
    comments: [],
  },
  {
    id: 't6',
    title: 'Prototype review',
    ownerId: 'ada',
    ownerName: 'Ada',
    ownerRole: 'Product manager',
    milestoneId: 'm3',
    milestoneName: 'M3 Final demo',
    dueDate: '13 Nov 2026',
    status: 'To do',
    isOverdue: false,
    comments: [],
  },
];

export const initialProjectUpdates = [
  {
    id: 'u1',
    author: 'David',
    initial: 'D',
    date: '12 Nov 2026 · 09:10',
    text: 'Design onboarding is Blocked. Waiting for agreed sign-up fields. UI handoff is In review for 13 Nov.',
  },
  {
    id: 'u2',
    author: 'Ada',
    initial: 'A',
    date: '12 Nov 2026 · 09:35',
    text: "I'll help agree the sign-up fields today. Please keep the task note updated so we have the same context.",
  },
  {
    id: 'u3',
    author: 'John',
    initial: 'J',
    date: '11 Nov 2026 · 18:20',
    text: "Build discovery is Done. Auth screens are In progress, due tomorrow. I'm preparing the sign-up flow.",
  },
];

// Async mock API helpers with clean delays and result packaging

export async function createTaskApi(taskData) {
  await new Promise((r) => setTimeout(r, 450));
  if (!taskData.title?.trim()) {
    return { success: false, error: 'Enter a task title.' };
  }
  if (!taskData.ownerId) {
    return { success: false, error: 'Choose one accepted member.' };
  }
  if (!taskData.dueDate?.trim()) {
    return { success: false, error: 'Enter a due date.' };
  }
  if (!taskData.milestoneId) {
    return { success: false, error: 'Choose a milestone.' };
  }

  const newTask = {
    id: `t-${Date.now()}`,
    title: taskData.title.trim(),
    ownerId: taskData.ownerId,
    ownerName: taskData.ownerName || 'David',
    ownerRole: taskData.ownerRole || 'Member',
    milestoneId: taskData.milestoneId,
    milestoneName: taskData.milestoneName || 'M2 Working prototype',
    dueDate: taskData.dueDate,
    status: taskData.status || 'To do',
    description: taskData.description || '',
    isOverdue: false,
    comments: [],
  };

  return { success: true, data: newTask };
}

export async function updateTaskStatusApi(taskId, updates) {
  await new Promise((r) => setTimeout(r, 400));
  if (updates.status === 'Blocked' && !updates.blockerNote?.trim()) {
    return { success: false, error: 'Add a short blocker note before saving.' };
  }
  return {
    success: true,
    data: {
      taskId,
      ...updates,
    },
  };
}

export async function reassignTaskApi(taskId, newOwnerId, handoverNote) {
  await new Promise((r) => setTimeout(r, 450));
  if (!newOwnerId) {
    return { success: false, error: 'Choose one other accepted member.' };
  }
  return {
    success: true,
    data: {
      taskId,
      newOwnerId,
      handoverNote,
      reassignedAt: '12 Nov 2026',
    },
  };
}

export async function addTaskCommentApi(taskId, commentText, authorName = 'Ada') {
  await new Promise((r) => setTimeout(r, 300));
  if (!commentText?.trim()) {
    return { success: false, error: 'Comment cannot be empty.' };
  }
  const comment = {
    id: `c-${Date.now()}`,
    author: authorName,
    date: '12 Nov 2026',
    text: commentText.trim(),
  };
  return { success: true, data: comment };
}

export async function postProjectUpdateApi(updateText, authorName = 'David') {
  await new Promise((r) => setTimeout(r, 400));
  if (!updateText?.trim()) {
    return { success: false, error: 'Update cannot be empty.' };
  }
  const update = {
    id: `u-${Date.now()}`,
    author: authorName,
    initial: authorName.charAt(0).toUpperCase(),
    date: '12 Nov 2026 · Just now',
    text: updateText.trim(),
  };
  return { success: true, data: update };
}

export async function editMilestoneApi(milestoneId, name, targetDate) {
  await new Promise((r) => setTimeout(r, 350));
  if (!name?.trim() || !targetDate?.trim()) {
    return { success: false, error: 'Name and target date are required.' };
  }
  return {
    success: true,
    data: { milestoneId, name: name.trim(), targetDate: targetDate.trim() },
  };
}

export async function editRoleApi(memberId, roleTitle, responsibilities) {
  await new Promise((r) => setTimeout(r, 400));
  if (!roleTitle?.trim() || !responsibilities?.trim()) {
    return { success: false, error: 'Role title and responsibilities are required.' };
  }
  return {
    success: true,
    data: { memberId, roleTitle: roleTitle.trim(), responsibilities: responsibilities.trim() },
  };
}

export async function releaseRoleApi(memberId) {
  await new Promise((r) => setTimeout(r, 450));
  return {
    success: true,
    data: { memberId, releasedAt: '12 Nov 2026' },
  };
}

export async function requestNewDateApi(taskId, proposedDate, message) {
  await new Promise((r) => setTimeout(r, 400));
  return {
    success: true,
    data: { taskId, proposedDate, message },
  };
}

export async function requestHandoverApi(taskId, message) {
  await new Promise((r) => setTimeout(r, 400));
  return {
    success: true,
    data: { taskId, message },
  };
}
