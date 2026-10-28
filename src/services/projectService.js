/**
 * TeamUp Project Service
 * 
 * Centralized API & business logic layer for Projects and Project Creation.
 * Structured cleanly to separate presentation from data access, allowing
 * seamless replacement of mock data with REST/GraphQL endpoints in the future.
 */

// Initial default draft template based on the Walkthrough & PRD specifications (Campus Marketplace)
export const initialDraftProject = {
  id: 'campus-marketplace-draft',
  name: 'Campus Marketplace',
  problem: 'Students struggle to exchange campus items across scattered group chats.',
  description: 'Build a responsive campus marketplace prototype with listings, item details and sign-up. Collaborate on requirements, UI design and frontend implementation.',
  projectType: 'Web application',
  requiredSkills: ['UI design', 'Frontend development', 'Product planning'],
  expectedOutcome: 'A responsive marketplace prototype with sign-up, item browsing and a documented build.',
  
  // Roles & Team
  teamSize: 3,
  ownerRole: {
    id: 'role-owner',
    title: 'Product Manager',
    assigneeName: 'Ada',
    isOwner: true,
    hours: '5',
    responsibilities: 'Define user stories and coordinate prototype review',
    skills: ['Product planning', 'User research'],
  },
  roles: [
    {
      id: 'role-designer',
      title: 'UI/UX Designer',
      isOwner: false,
      hours: '6',
      responsibilities: 'Design onboarding, prototype the sign-up flow and provide a UI handoff.',
      skills: ['UI design', 'Prototyping'],
      filled: false,
    },
    {
      id: 'role-developer',
      title: 'Frontend Developer',
      isOwner: false,
      hours: '8',
      responsibilities: 'Implement authentication screens and marketplace discovery.',
      skills: ['Frontend development', 'React'],
      filled: false,
    },
  ],

  // Commitment & Schedule
  duration: '6 weeks',
  plannedStartDate: '19 Oct 2026',
  plannedEndDate: '30 Nov 2026',
  availabilityExpectations: 'Weekday evenings; Saturday afternoon',
  responseExpectations: 'Agree a response window before starting. Suggested: weekday evenings.',
  workingExpectations: [
    'Respond within the agreed response window.',
    'Keep task status up to date.',
    'Tell the team early if you are unavailable or a deadline is at risk.',
    'Raise blockers early so the team can help.',
  ],

  // Milestones
  milestones: [
    {
      id: 'm-req',
      name: 'Requirements',
      targetDate: '02 Nov 2026',
      done: false,
    },
    {
      id: 'm-proto',
      name: 'Working prototype',
      targetDate: '16 Nov 2026',
      done: false,
    },
    {
      id: 'm-demo',
      name: 'Final demo',
      targetDate: '30 Nov 2026',
      done: false,
    },
  ],

  status: 'Draft',
  lastSaved: '12 Nov 2026',
};

/**
 * Validates whether a project draft satisfies all PRD gating rules to be published.
 * PRD FR-19: A project must not be publishable without at least one role, a duration,
 * a time commitment and one milestone; two or more milestones are recommended.
 */
export function validatePublishReadiness(draft) {
  const missingItems = [];
  const missingBasics = [];

  // Basics check
  if (!draft.name?.trim()) missingBasics.push('project name');
  if (!draft.problem?.trim()) missingBasics.push('problem or opportunity');
  if (!draft.description?.trim()) missingBasics.push('description');
  if (!draft.projectType?.trim()) missingBasics.push('project type');
  if (!draft.requiredSkills || draft.requiredSkills.length === 0) missingBasics.push('required project skills');
  if (!draft.expectedOutcome?.trim()) missingBasics.push('expected outcome');

  // Specific 4 publish-gate requirements (PRD FR-19 / S14.E)
  const hasRoles = draft.roles && draft.roles.length > 0;
  if (!hasRoles) {
    missingItems.push({
      key: 'role',
      title: 'Role',
      message: 'No defined role.',
      step: 2,
    });
  }

  const hasDuration = Boolean(draft.duration?.trim());
  if (!hasDuration) {
    missingItems.push({
      key: 'duration',
      title: 'Duration',
      message: 'Project duration is not entered.',
      step: 3,
    });
  }

  const hasRoleHours = hasRoles && draft.roles.every((r) => r.hours && r.hours.toString().trim().length > 0);
  if (!hasRoleHours) {
    missingItems.push({
      key: 'roleHours',
      title: 'Role hours',
      message: 'Time commitment per role is not entered.',
      step: 3,
    });
  }

  const validMilestones = (draft.milestones || []).filter(
    (m) => m.name?.trim() && m.targetDate?.trim() && m.targetDate !== 'Not entered'
  );
  const hasDatedMilestone = validMilestones.length >= 1;
  if (!hasDatedMilestone) {
    missingItems.push({
      key: 'milestone',
      title: 'Dated milestone',
      message: 'No named milestone with a target date.',
      step: 4,
    });
  }

  const isReady = missingItems.length === 0 && missingBasics.length === 0;

  return {
    isReady,
    missingItems,
    missingBasics,
    validMilestonesCount: validMilestones.length,
    recommendedMilestonesMet: validMilestones.length >= 2,
  };
}

/**
 * Mock API: Saves a project draft.
 * In a real backend, this would POST /api/v1/projects/drafts or PUT /api/v1/projects/:id
 */
export async function saveProjectDraftApi(draft) {
  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));
  return {
    success: true,
    data: {
      ...draft,
      status: 'Draft',
      lastSaved: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
  };
}

/**
 * Mock API: Publishes a project.
 * Enforces PRD publish gate validation before transition to 'Open'.
 * In a real backend, this would POST /api/v1/projects/:id/publish
 */
export async function publishProjectApi(draft) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  
  const validation = validatePublishReadiness(draft);
  if (!validation.isReady) {
    return {
      success: false,
      error: 'Project cannot be published due to missing required fields.',
      missingItems: validation.missingItems,
    };
  }

  const publishedProject = {
    ...draft,
    id: draft.id || `proj-${Date.now()}`,
    status: 'Open',
    publishedAt: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };

  return {
    success: true,
    data: publishedProject,
  };
}
