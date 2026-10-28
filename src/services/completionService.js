// Completion & Review Service for TeamUp Batch 5 / Sixth Walkthrough
// Handles Project Completion (S38/S39), Own Contribution Summary (S40/S41),
// Teammate Confirmation (S42/S43), Private Project Page (S44),
// Sharing & Profile Privacy (S45/S46), and Ended Early Preserved Record (S47).

export const initialCompletionState = {
  projectId: 'campus-marketplace',
  projectTitle: 'Campus Marketplace',
  dates: '19 Oct–30 Nov 2026 · 6 weeks',
  currentDate: '30 Nov 2026',
  status: 'In Progress',
  isCompleted: false,
  isOutcomeSaved: true,
  finalOutcome:
    'Delivered a responsive marketplace prototype, implemented sign-up and project browsing, and documented the build.',
  deliverables: [
    {
      id: 'del-1',
      label: 'Marketplace prototype',
      fileName: 'marketplace-prototype.zip',
      type: 'File',
      isSaved: true,
      url: null,
    },
  ],
  overallTasks: { done: 6, total: 6 },
  milestones: [
    { id: 'm1', name: 'M1 Requirements', date: '02 Nov 2026', done: 2, total: 2 },
    { id: 'm2', name: 'M2 Working prototype', date: '16 Nov 2026', done: 3, total: 3 },
    { id: 'm3', name: 'M3 Final demo', date: '30 Nov 2026', done: 1, total: 1 },
  ],
  memberSummaries: {
    ada: {
      id: 'ada',
      name: 'Ada',
      initial: 'A',
      role: 'Product manager',
      roleSubtitle: 'Owner',
      isOwner: true,
      wording: 'Defined user stories and coordinated project milestones.',
      note: 'Aligned sprint deliverables and facilitated regular syncs.',
      doneTasksCount: 2,
      doneTasks: [
        {
          id: 't1',
          title: 'Define user stories',
          owner: 'Ada',
          dueDate: '02 Nov 2026',
          milestone: 'M1 Requirements',
          completedDate: '02 Nov 2026',
          evidence: 'user-stories.pdf',
        },
        {
          id: 't6',
          title: 'Prototype review',
          owner: 'Ada',
          dueDate: '13 Nov 2026',
          milestone: 'M3 Final demo',
          completedDate: '28 Nov 2026',
          evidence: 'prototype-review-notes.pdf',
        },
      ],
      reviewStatus: 'Reviewed',
      confirmedBy: 'John',
      confirmedDate: '02 Nov 2026',
      isConfirmed: true,
    },
    david: {
      id: 'david',
      name: 'David',
      initial: 'D',
      role: 'UI/UX Designer',
      roleSubtitle: 'Accepted member',
      isOwner: false,
      wording: 'Designed onboarding and prepared the UI handoff.',
      note: 'Documented the final sign-up fields and shared handoff context with John.',
      doneTasksCount: 2,
      doneTasks: [
        {
          id: 't3',
          title: 'Design onboarding',
          owner: 'David',
          dueDate: '10 Nov 2026',
          milestone: 'M2 Working prototype',
          completedDate: '16 Nov 2026',
          evidence: 'onboarding-design.pdf',
        },
        {
          id: 't5',
          title: 'UI handoff',
          owner: 'David',
          dueDate: '13 Nov 2026',
          milestone: 'M2 Working prototype',
          completedDate: '16 Nov 2026',
          evidence: 'ui-handoff.pdf',
        },
      ],
      // Default in S40 is Unreviewed, user can save as Reviewed / Awaiting John
      reviewStatus: 'Unreviewed',
      confirmedBy: null,
      confirmedDate: null,
      isConfirmed: false,
    },
    john: {
      id: 'john',
      name: 'John',
      initial: 'J',
      role: 'Frontend Developer',
      roleSubtitle: 'Accepted member',
      isOwner: false,
      wording: 'Built project browsing and implemented sign-up screens.',
      note: 'Connected discovery UI to sample dataset and handled edge cases.',
      doneTasksCount: 2,
      doneTasks: [
        {
          id: 't2',
          title: 'Build discovery',
          owner: 'John',
          dueDate: '10 Nov 2026',
          milestone: 'M1 Requirements',
          completedDate: '10 Nov 2026',
          evidence: 'example.org/discovery',
        },
        {
          id: 't4',
          title: 'Auth screens',
          owner: 'John',
          dueDate: '14 Nov 2026',
          milestone: 'M2 Working prototype',
          completedDate: '20 Nov 2026',
          evidence: 'auth-screens.pdf',
        },
      ],
      reviewStatus: 'Reviewed',
      confirmedBy: 'Ada',
      confirmedDate: '10 Nov 2026',
      isConfirmed: true,
    },
  },
  privacySettings: {
    pageVisibility: 'Team-only (Private)',
    previewModeActive: false,
    previewLink: 'https://teamup.campus/preview/campus-marketplace-99a',
    displayOnProfile: {
      Ada: false,
      David: false,
      John: false,
    },
  },
  endedEarlyRecord: {
    date: '12 Nov 2026',
    status: 'Ended Early',
    plannedDates: '19 Oct–30 Nov 2026 · 6 weeks',
    teamJoined: '19 Oct 2026',
    preservedDoneCount: 2,
    preservedTotalCount: 6,
    milestones: [
      { name: 'M1 Requirements', target: '02 Nov 2026', done: 2, total: 2 },
      { name: 'M2 Working prototype', target: '16 Nov 2026', done: 0, total: 3 },
      { name: 'M3 Final demo', target: '30 Nov 2026', done: 0, total: 1 },
    ],
    preservedTasks: [
      {
        id: 'ee-t1',
        title: 'Define user stories',
        owner: 'Ada',
        role: 'Product manager',
        dueDate: '02 Nov 2026',
        milestone: 'M1 Requirements',
        status: 'Done',
        evidence: 'user-stories.pdf',
        completedDate: '02 Nov 2026',
      },
      {
        id: 'ee-t2',
        title: 'Build discovery',
        owner: 'John',
        role: 'Frontend Developer',
        dueDate: '10 Nov 2026',
        milestone: 'M1 Requirements',
        status: 'Done',
        evidence: 'example.org/discovery',
        completedDate: '10 Nov 2026',
      },
    ],
    unfinishedTasks: [
      {
        id: 'ee-t3',
        title: 'Design onboarding',
        owner: 'David',
        dueDate: '10 Nov 2026',
        milestone: 'M2 Working prototype',
        status: 'Blocked',
        blocker: 'Waiting for agreed sign-up fields.',
      },
      {
        id: 'ee-t4',
        title: 'Auth screens',
        owner: 'John',
        dueDate: '14 Nov 2026',
        milestone: 'M2 Working prototype',
        status: 'In progress',
      },
      {
        id: 'ee-t5',
        title: 'UI handoff',
        owner: 'David',
        dueDate: '13 Nov 2026',
        milestone: 'M2 Working prototype',
        status: 'In review',
      },
      {
        id: 'ee-t6',
        title: 'Prototype review',
        owner: 'Ada',
        dueDate: '13 Nov 2026',
        milestone: 'M3 Final demo',
        status: 'To do',
      },
    ],
  },
};

export async function saveOutcomeAndDeliverablesApi(outcomeText, deliverables) {
  await new Promise((r) => setTimeout(r, 450));
  if (!outcomeText?.trim()) {
    return { success: false, error: 'Add a final outcome before completing.' };
  }
  if (!deliverables || deliverables.length === 0) {
    return { success: false, error: 'At least one project deliverable is required: a link OR a file.' };
  }
  return {
    success: true,
    data: {
      finalOutcome: outcomeText.trim(),
      deliverables,
      isOutcomeSaved: true,
    },
  };
}

export async function saveContributionReviewApi(memberId, wording, note) {
  await new Promise((r) => setTimeout(r, 450));
  if (!wording?.trim()) {
    return { success: false, error: 'Please enter your contribution wording.' };
  }
  return {
    success: true,
    data: {
      memberId,
      wording: wording.trim(),
      note: note ? note.trim() : '',
      reviewStatus: 'Reviewed', // Reviewed / Awaiting confirmation
    },
  };
}

export async function confirmMemberContributionApi(reviewerName, subjectId) {
  await new Promise((r) => setTimeout(r, 450));
  if (reviewerName?.toLowerCase() === subjectId?.toLowerCase()) {
    return { success: false, error: 'You cannot confirm yourself. Summary requires another teammate’s confirmation.' };
  }
  return {
    success: true,
    data: {
      subjectId,
      confirmedBy: reviewerName,
      confirmedDate: '30 Nov 2026',
      isConfirmed: true,
    },
  };
}

export async function returnWordingFeedbackApi(reviewerName, subjectId, feedbackText) {
  await new Promise((r) => setTimeout(r, 400));
  if (!feedbackText?.trim()) {
    return { success: false, error: 'Please enter feedback text.' };
  }
  return {
    success: true,
    data: {
      subjectId,
      reviewerName,
      feedback: feedbackText.trim(),
      date: '30 Nov 2026',
    },
  };
}

export async function completeProjectApi(projectId) {
  await new Promise((r) => setTimeout(r, 500));
  return {
    success: true,
    data: {
      projectId,
      isCompleted: true,
      status: 'Completed',
      completionDate: '30 Nov 2026',
      pageVisibility: 'Team-only (Private)',
    },
  };
}

export async function saveSharingPrivacyApi(memberPersona, displayOnProfile) {
  await new Promise((r) => setTimeout(r, 350));
  return {
    success: true,
    data: {
      memberPersona,
      displayOnProfile: Boolean(displayOnProfile),
      savedAt: '30 Nov 2026',
    },
  };
}
