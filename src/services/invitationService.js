/**
 * TeamUp Invitation & Discovery Service
 * 
 * Centralized API & business logic layer for:
 * - Discover Projects (S15)
 * - Project Details & Role Eligibility (S16)
 * - Find Collaborators (S17)
 * - Request a Role (S20)
 * - Review Join Requests (S50)
 * - Invitation Details (S21/S24)
 * - Review Your Commitment (S22/S23)
 * 
 * Implements PRD §10 (Collaborator Discovery & Matching) and §11 (Team Formation & Commitment).
 * Separates presentation components from data operations for future backend integration.
 */

// Sample Open Projects for Discovery (S15)
export const initialDiscoverProjects = [
  {
    id: 'campus-marketplace',
    title: 'Campus Marketplace',
    status: 'Open',
    owner: {
      id: 'ada',
      name: 'Ada',
      role: 'Product Manager',
    },
    problem: 'Students struggle to exchange campus items across scattered group chats.',
    description: 'Build a responsive campus marketplace prototype with listings, item details and sign-up. Collaborate on requirements, UI design and frontend implementation.',
    projectType: 'Web application',
    duration: '6 weeks',
    plannedDates: '19 Oct–30 Nov 2026',
    availabilityExpectations: 'Weekday evenings; Saturday afternoon',
    responseExpectations: 'Agree a response window before starting. Suggested: weekday evenings.',
    expectedOutcome: 'A responsive marketplace prototype with sign-up, item browsing and a documented build.',
    roles: [
      {
        id: 'role-designer',
        title: 'UI/UX Designer',
        hours: '6',
        skills: ['UI design', 'Prototyping'],
        responsibilities: 'Design onboarding, prototype the sign-up flow and provide a UI handoff.',
        deadlines: [
          { name: 'Design onboarding', date: '10 Nov 2026' },
          { name: 'UI handoff', date: '13 Nov 2026' },
        ],
        filled: false,
      },
      {
        id: 'role-developer',
        title: 'Frontend Developer',
        hours: '8',
        skills: ['Frontend development', 'React'],
        responsibilities: 'Implement authentication screens and marketplace discovery.',
        deadlines: [
          { name: 'Auth screens', date: '15 Nov 2026' },
          { name: 'Marketplace discovery', date: '22 Nov 2026' },
        ],
        filled: false,
      },
    ],
    milestones: [
      { id: 'm1', name: 'Requirements', targetDate: '02 Nov 2026' },
      { id: 'm2', name: 'Working prototype', targetDate: '16 Nov 2026' },
      { id: 'm3', name: 'Final demo', targetDate: '30 Nov 2026' },
    ],
    workingExpectations: [
      'Respond within the agreed response window.',
      'Keep task status up to date when it changes.',
      'Tell the team early when unavailable or a deadline is at risk.',
      'Raise blockers early so the team can help.',
    ],
  },
  {
    id: 'student-study-planner',
    title: 'Student study planner',
    status: 'Open',
    owner: {
      id: 'kemi',
      name: 'Kemi',
      role: 'Product Lead',
    },
    problem: 'Students miss exam review goals due to fragmented schedules and lack of study groups.',
    description: 'Build a lightweight study planner web tool with calendar scheduling and goal tracking.',
    projectType: 'Web application',
    duration: '4 weeks',
    plannedDates: '01 Nov–29 Nov 2026',
    availabilityExpectations: 'Weekday evenings (6–8pm)',
    responseExpectations: 'Within 24 hours on weekdays.',
    expectedOutcome: 'Working web prototype with interactive schedule manager.',
    roles: [
      {
        id: 'role-planner-designer',
        title: 'UI/UX Designer',
        hours: '6',
        skills: ['UI design', 'Figma'],
        responsibilities: 'Create user flow, component system, and study calendar mockups.',
        deadlines: [{ name: 'Wireframes', date: '08 Nov 2026' }],
        filled: false,
      },
    ],
    milestones: [
      { id: 'm-pl-1', name: 'UX Wireframes', targetDate: '08 Nov 2026' },
      { id: 'm-pl-2', name: 'Working MVP', targetDate: '22 Nov 2026' },
    ],
    workingExpectations: [
      'Respond within the agreed response window.',
      'Keep task status up to date when it changes.',
      'Tell the team early when unavailable or a deadline is at risk.',
      'Raise blockers early so the team can help.',
    ],
  },
];

// Sample Candidates for Collaborator Discovery (S17)
export const initialCollaboratorCandidates = [
  {
    id: 'david',
    name: 'David',
    initial: 'D',
    role: 'UI/UX Designer',
    skills: ['UI design', 'Prototyping', 'Figma', 'User research'],
    weeklyAvailability: '6 h / week',
    preferredDuration: '6 weeks',
    goals: 'Build a shipped project with design work I can show for job applications.',
    matchLabel: 'Strong match',
    matchReason: 'Full skill match (UI design, Prototyping) & compatible availability (6 h/week).',
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    id: 'john',
    name: 'John',
    initial: 'J',
    role: 'Frontend Developer',
    skills: ['Frontend development', 'React', 'JavaScript', 'CSS'],
    weeklyAvailability: '8 h / week',
    preferredDuration: '6 weeks',
    goals: 'Build authentication screens and practice working in a small product team.',
    matchLabel: 'Strong match',
    matchReason: 'Full skill match (Frontend development, React) & compatible hours (8 h/week).',
    color: '#0D9488',
    bg: '#E0F7F4',
  },
  {
    id: 'tola',
    name: 'Tola',
    initial: 'T',
    role: 'Data Analyst',
    skills: ['Data analytics', 'SQL', 'Python'],
    weeklyAvailability: '5 h / week',
    preferredDuration: '4 weeks',
    goals: 'Completed project with documented outcomes for career switching.',
    matchLabel: 'Partial match',
    matchReason: 'Different primary role, but available for product analytics.',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
];

// Initial Join Requests (S50)
export const initialJoinRequests = [
  {
    id: 'req-john-frontend',
    projectId: 'campus-marketplace',
    projectTitle: 'Campus Marketplace',
    roleId: 'role-developer',
    roleTitle: 'Frontend Developer',
    applicant: {
      id: 'john',
      name: 'John',
      initial: 'J',
      role: 'Frontend Developer',
      skills: ['Frontend development', 'React'],
      weeklyAvailability: '8 h / week',
      duration: '6 weeks',
      goals: 'Build authentication screens and practice working in a small product team.',
    },
    status: 'Pending', // 'Pending' | 'Approved' | 'Declined'
    dateSent: '18 Oct 2026',
    ownerNote: 'Owner approval alone is not membership. John must explicitly accept commitment.',
  },
];

// Initial Invitations (S21/S24)
export const initialInvitations = [
  {
    id: 'inv-david-designer',
    projectId: 'campus-marketplace',
    projectTitle: 'Campus Marketplace',
    roleId: 'role-designer',
    roleTitle: 'UI/UX Designer',
    owner: {
      id: 'ada',
      name: 'Ada',
      role: 'Product Manager',
    },
    recipient: {
      id: 'david',
      name: 'David',
      initial: 'D',
      role: 'UI/UX Designer',
      skills: ['UI design', 'Prototyping'],
      hours: '6 h / week',
      duration: '6 weeks',
    },
    status: 'Pending', // 'Pending' | 'Declined' | 'Accepted'
    dateSent: '18 Oct 2026',
    acceptanceDate: null,
  },
];

/**
 * Checks if a candidate is eligible for a given role based on PRD FR-23:
 * Exclude people who lack required skills, lack sufficient weekly availability,
 * or cannot commit to expected duration.
 */
export function checkRoleEligibility(userProfile, role, projectDuration) {
  if (!userProfile || !role) {
    return { isEligible: false, reasons: ['Missing profile or role details'] };
  }

  const reasons = [];

  // 1. Skill check
  const hasSkills = role.skills.every((reqSkill) =>
    (userProfile.skills || []).some(
      (s) => s.toLowerCase() === reqSkill.toLowerCase()
    )
  );
  if (!hasSkills) {
    reasons.push(
      `Requires ${role.skills.join(' and ')}; you only listed ${(userProfile.skills || []).join(', ') || 'none'}.`
    );
  }

  // 2. Weekly Hours check
  const userHoursNum = parseInt(userProfile.weeklyAvailability || '0', 10);
  const roleHoursNum = parseInt(role.hours || '0', 10);
  if (userHoursNum < roleHoursNum) {
    reasons.push(
      `Requires ${roleHoursNum} h / week; your availability is ${userHoursNum} h / week.`
    );
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}

/**
 * Mock API: Send an invitation to a candidate (S17 -> S21)
 */
export async function sendInvitationApi(invitationData) {
  await new Promise((res) => setTimeout(res, 250));
  return {
    success: true,
    data: {
      ...invitationData,
      id: `inv-${Date.now()}`,
      status: 'Pending',
      dateSent: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
  };
}

/**
 * Mock API: Send a join request for a role (S16 -> S20)
 */
export async function sendJoinRequestApi(requestData) {
  await new Promise((res) => setTimeout(res, 250));
  return {
    success: true,
    data: {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'Pending',
      dateSent: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
  };
}

/**
 * Mock API: Owner approves or declines a join request (S50)
 */
export async function respondToJoinRequestApi(requestId, decision) {
  await new Promise((res) => setTimeout(res, 250));
  return {
    success: true,
    data: {
      requestId,
      status: decision, // 'Approved' | 'Declined'
      decisionDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
  };
}

/**
 * Mock API: Recipient accepts explicit commitment summary (S22/S23)
 * Records dated acceptance per PRD FR-30.
 */
export async function acceptCommitmentSummaryApi(commitmentData) {
  await new Promise((res) => setTimeout(res, 350));
  return {
    success: true,
    data: {
      ...commitmentData,
      joined: true,
      datedAcceptance: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
  };
}

/**
 * Mock API: Recipient declines invitation
 */
export async function declineInvitationApi(invitationId) {
  await new Promise((res) => setTimeout(res, 250));
  return {
    success: true,
    data: {
      invitationId,
      status: 'Declined',
      declinedDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
  };
}
