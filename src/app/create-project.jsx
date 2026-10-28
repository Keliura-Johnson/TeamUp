import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../components/Header';
import Button from '../components/Button';
import Banner from '../components/Banner';
import FormField from '../components/FormField';
import Checkbox from '../components/Checkbox';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function CreateProjectScreen() {
  const {
    currentDraft,
    updateCurrentDraft,
    saveCurrentDraft,
    publishCurrentProject,
    validatePublishReadiness,
  } = useApp();

  // Wizard Step: 1 = Basics, 2 = Roles, 3 = Commitment, 4 = Milestones, 5 = Review
  const [currentStep, setCurrentStep] = useState(1);

  // Companion State Demo Controller: 'default' | 'empty' | 'loading' | 'error' | 'saved'
  const [demoState, setDemoState] = useState('default');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [lastSaveMessage, setLastSaveMessage] = useState(null);

  // Local Form State (synchronized with currentDraft)
  const [name, setName] = useState(currentDraft.name || '');
  const [problem, setProblem] = useState(currentDraft.problem || '');
  const [description, setDescription] = useState(currentDraft.description || '');
  const [projectType, setProjectType] = useState(currentDraft.projectType || 'Web application');
  const [requiredSkills, setRequiredSkills] = useState(currentDraft.requiredSkills || []);
  const [expectedOutcome, setExpectedOutcome] = useState(currentDraft.expectedOutcome || '');

  // Roles State
  const [roles, setRoles] = useState(currentDraft.roles || []);
  const [ownerRole, setOwnerRole] = useState(currentDraft.ownerRole || {
    id: 'role-owner',
    title: 'Product Manager',
    assigneeName: 'Ada',
    isOwner: true,
    hours: '5',
    responsibilities: 'Define user stories and coordinate prototype review',
    skills: ['Product planning', 'User research'],
  });

  // Commitment State
  const [duration, setDuration] = useState(currentDraft.duration || '6 weeks');
  const [plannedStartDate, setPlannedStartDate] = useState(currentDraft.plannedStartDate || '19 Oct 2026');
  const [plannedEndDate, setPlannedEndDate] = useState(currentDraft.plannedEndDate || '30 Nov 2026');
  const [availabilityExpectations, setAvailabilityExpectations] = useState(
    currentDraft.availabilityExpectations || 'Weekday evenings; Saturday afternoon'
  );
  const [responseExpectations, setResponseExpectations] = useState(
    currentDraft.responseExpectations || 'Agree a response window before starting. Suggested: weekday evenings.'
  );

  // Milestones State
  const [milestones, setMilestones] = useState(currentDraft.milestones || []);

  // Modals for Role and Milestone Removal
  const [roleToRemove, setRoleToRemove] = useState(null);
  const [milestoneToRemove, setMilestoneToRemove] = useState(null);

  // Available skill catalog
  const availableSkills = [
    'UI design',
    'Frontend development',
    'Product planning',
    'Backend development',
    'User research',
    'Prototyping',
    'React',
  ];

  // Project Types
  const projectTypeOptions = [
    'Web application',
    'Mobile application',
    'Data analysis',
    'Marketing campaign',
    'Design project',
  ];
  const [projectTypeModalOpen, setProjectTypeModalOpen] = useState(false);

  // Sync state to currentDraft when fields change
  const syncToDraft = () => {
    updateCurrentDraft({
      name,
      problem,
      description,
      projectType,
      requiredSkills,
      expectedOutcome,
      ownerRole,
      roles,
      duration,
      plannedStartDate,
      plannedEndDate,
      availabilityExpectations,
      responseExpectations,
      milestones,
    });
  };

  const handleSaveDraft = async () => {
    setIsActionLoading(true);
    syncToDraft();
    try {
      const res = await saveCurrentDraft();
      if (res.success) {
        setLastSaveMessage('Draft saved. Your entries are persisted.');
        setDemoState('saved');
      }
    } catch (_e) {
      setDemoState('error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsActionLoading(true);
    syncToDraft();
    try {
      const res = await publishCurrentProject();
      if (res.success) {
        router.push('/project-published');
      } else {
        setDemoState('error');
      }
    } catch (_e) {
      setDemoState('error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Skill toggle helper
  const toggleSkill = (skill) => {
    if (requiredSkills.includes(skill)) {
      setRequiredSkills(requiredSkills.filter((s) => s !== skill));
    } else {
      setRequiredSkills([...requiredSkills, skill]);
    }
  };

  const removeSkillChip = (skill) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  // Role management
  const handleAddRole = () => {
    const newRole = {
      id: `role-${Date.now()}`,
      title: 'New Role',
      responsibilities: 'Contribute to core project features and review deliverables.',
      skills: ['UI design'],
      hours: '5',
      isOwner: false,
      filled: false,
    };
    setRoles([...roles, newRole]);
  };

  const updateRoleField = (roleId, field, value) => {
    setRoles(roles.map((r) => (r.id === roleId ? { ...r, [field]: value } : r)));
  };

  const confirmRemoveRole = () => {
    if (roleToRemove) {
      setRoles(roles.filter((r) => r.id !== roleToRemove.id));
      setRoleToRemove(null);
    }
  };

  // Milestone management
  const handleAddMilestone = () => {
    const newMilestone = {
      id: `m-${Date.now()}`,
      name: 'New milestone',
      targetDate: '15 Dec 2026',
      done: false,
    };
    setMilestones([...milestones, newMilestone]);
  };

  const updateMilestoneField = (milestoneId, field, value) => {
    setMilestones(
      milestones.map((m) => (m.id === milestoneId ? { ...m, [field]: value } : m))
    );
  };

  const confirmRemoveMilestone = () => {
    if (milestoneToRemove) {
      setMilestones(milestones.filter((m) => m.id !== milestoneToRemove.id));
      setMilestoneToRemove(null);
    }
  };

  // Evaluate PRD publish readiness
  const currentDraftObject = {
    name,
    problem,
    description,
    projectType,
    requiredSkills,
    expectedOutcome,
    ownerRole,
    roles,
    duration,
    plannedStartDate,
    plannedEndDate,
    milestones,
  };
  const readiness = validatePublishReadiness(currentDraftObject);

  const stepTitles = [
    'Basics',
    'Roles',
    'Commitment',
    'Milestones',
    'Review',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="createproject" />

      {/* Stepper Header (390px mobile layout matching Figma S07.D - S12.D) */}
      <View style={styles.stepHeaderWrapper}>
        <View style={styles.stepTextRow}>
          <Text style={styles.stepCounterText}>
            Step {currentStep} of 5 · {stepTitles[currentStep - 1]}
          </Text>
        </View>
        {/* Progress Bar Line */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(currentStep / 5) * 100}%` },
            ]}
          />
        </View>

        {/* Step Navigation Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stepTabScroll}
        >
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <TouchableOpacity
                key={title}
                style={[styles.stepTab, isActive && styles.stepTabActive]}
                onPress={() => {
                  syncToDraft();
                  setCurrentStep(stepNum);
                }}
              >
                <Text
                  style={[
                    styles.stepTabText,
                    isActive && styles.stepTabTextActive,
                    isCompleted && styles.stepTabTextCompleted,
                  ]}
                >
                  {stepNum}. {title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Companion State Demo Toolbar (for Figma QA testing) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>State Demo:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'default', label: 'Default' },
              { id: 'empty', label: 'S07.E (Unsaved)' },
              { id: 'loading', label: 'S07.L (Save locked)' },
              { id: 'error', label: 'S07.X (Save failed)' },
              { id: 'saved', label: 'S07.S (Persisted)' },
            ].map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => setDemoState(st.id)}
                style={[
                  styles.demoTab,
                  demoState === st.id && styles.demoTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.demoTabText,
                    demoState === st.id && styles.demoTabTextActive,
                  ]}
                >
                  {st.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Companion State Feedback Banners */}
        {demoState === 'loading' && (
          <Banner
            type="info"
            title="Saving project basics..."
            message="Saving. Your entries are retained; save temporarily locked."
          />
        )}
        {demoState === 'error' && (
          <Banner
            type="error"
            title="Draft did not save"
            message="Save failed. Local entries retained; no saved draft yet."
          />
        )}
        {demoState === 'saved' && (
          <Banner
            type="success"
            title="Draft saved"
            message={lastSaveMessage || 'Campus Marketplace draft saved. Team size, roles, and milestones are persisted.'}
          />
        )}

        {/* ========================================================= */}
        {/* STEP 1: PROJECT BASICS (S07)                               */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.statusBadgeRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>New · unsaved</Text>
              </View>
            </View>

            <Text style={styles.screenHeading}>Project basics</Text>
            <Text style={styles.screenSubtitle}>
              {"Describe what you'll build and why."}
            </Text>
            <Text style={styles.requiredNotice}>
              * Required to publish. Incomplete drafts can be saved.
            </Text>

            {/* Field 1: Project Name */}
            <FormField
              label="Project name *"
              value={demoState === 'empty' ? '' : name}
              onChangeText={setName}
              placeholder="e.g. Campus Marketplace"
              error={demoState === 'error' && !name ? 'Add a project name.' : null}
            />

            {/* Field 2: Problem or Opportunity */}
            <FormField
              label="Problem or opportunity *"
              value={demoState === 'empty' ? '' : problem}
              onChangeText={setProblem}
              placeholder="What real problem does this project address?"
              multiline
              numberOfLines={3}
              error={demoState === 'error' && !problem ? 'Add the problem or opportunity.' : null}
            />

            {/* Field 3: Description */}
            <FormField
              label="Description *"
              value={demoState === 'empty' ? '' : description}
              onChangeText={setDescription}
              placeholder="Describe what your team will build and deliver"
              multiline
              numberOfLines={3}
              error={demoState === 'error' && !description ? 'Add a project description.' : null}
            />

            {/* Field 4: Project Type Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Project type *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setProjectTypeModalOpen(true)}
              >
                <Text style={styles.dropdownButtonText}>{projectType}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Field 5: Required Skills Checkboxes & Tag Chips */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Required skills *</Text>
              {availableSkills.map((skill) => (
                <Checkbox
                  key={skill}
                  label={skill}
                  checked={requiredSkills.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                />
              ))}

              {/* Selected Skill Chips with Remove Button */}
              {requiredSkills.length > 0 && (
                <View style={styles.chipsContainer}>
                  {requiredSkills.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={styles.skillChip}
                      onPress={() => removeSkillChip(skill)}
                    >
                      <Text style={styles.skillChipText}>{skill}</Text>
                      <Text style={styles.chipRemoveText}>Remove ✕</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Field 6: Expected Outcome */}
            <FormField
              label="Expected outcome *"
              value={demoState === 'empty' ? '' : expectedOutcome}
              onChangeText={setExpectedOutcome}
              placeholder="What will the team have at the end?"
              multiline
              numberOfLines={3}
              error={demoState === 'error' && !expectedOutcome ? 'Add the intended outcome.' : null}
            />

            {/* Bottom Controls */}
            <Text style={styles.navHelperText}>
              Back and Continue keep local entries; Save draft saves them.
            </Text>

            <Button
              title="Continue to roles"
              onPress={() => {
                syncToDraft();
                setCurrentStep(2);
              }}
              style={styles.primaryActionButton}
            />

            <View style={styles.secondaryActionsRow}>
              <Button
                title="Back to My Projects"
                variant="link"
                onPress={() => router.push('/myprojects')}
              />
              <Button
                title={isActionLoading ? 'Saving...' : 'Save draft'}
                variant="outline"
                loading={isActionLoading}
                onPress={handleSaveDraft}
                style={styles.saveDraftOutlineBtn}
              />
            </View>
            <Text style={styles.saveDraftSubtext}>
              Save draft is available even with incomplete fields.
            </Text>
          </View>
        )}

        {/* ========================================================= */}
        {/* STEP 2: TEAM AND ROLES (S08 / S09)                         */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.statusBadgeRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Draft</Text>
              </View>
            </View>

            <Text style={styles.screenHeading}>Team and roles</Text>
            <Text style={styles.screenSubtitle}>
              Define the roles you need. You are the project owner.
            </Text>

            {/* Team Size */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Team size *</Text>
              <Text style={styles.teamSizeNumber}>{roles.length + 1}</Text>
              <Text style={styles.teamSizeCaption}>
                Ada · Project Owner. {roles.length} roles are open for recruitment.
              </Text>
            </View>

            {/* Owner Role Card (Uneditable Owner) */}
            <View style={styles.roleCard}>
              <View style={styles.roleHeaderRow}>
                <Text style={styles.roleCardTitle}>{ownerRole.title}</Text>
                <View style={styles.ownerBadge}>
                  <Text style={styles.ownerBadgeText}>Ada · Owner</Text>
                </View>
              </View>
              <Text style={styles.roleSectionLabel}>Responsibilities *</Text>
              <Text style={styles.roleBodyText}>{ownerRole.responsibilities}</Text>

              <Text style={styles.roleSectionLabel}>Required skills *</Text>
              <View style={styles.chipsContainer}>
                {ownerRole.skills.map((s) => (
                  <View key={s} style={styles.roleChip}>
                    <Text style={styles.roleChipText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Open Roles (Repeatable Role Editor Cards) */}
            {roles.map((r, index) => (
              <View key={r.id} style={styles.roleCard}>
                <View style={styles.roleHeaderRow}>
                  <Text style={styles.roleCardTitle}>{r.title || `Role ${index + 1}`}</Text>
                  <View style={styles.openRoleBadge}>
                    <Text style={styles.openRoleBadgeText}>Open role</Text>
                  </View>
                </View>

                <FormField
                  label="Role title *"
                  value={r.title}
                  onChangeText={(val) => updateRoleField(r.id, 'title', val)}
                  placeholder="e.g. UI/UX Designer"
                />

                <FormField
                  label="Responsibilities *"
                  value={r.responsibilities}
                  onChangeText={(val) => updateRoleField(r.id, 'responsibilities', val)}
                  placeholder="What will this person deliver?"
                  multiline
                  numberOfLines={2}
                />

                <Text style={styles.roleSectionLabel}>Required skills *</Text>
                <View style={styles.chipsContainer}>
                  {r.skills.map((s) => (
                    <View key={s} style={styles.roleChip}>
                      <Text style={styles.roleChipText}>{s}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.reviewRemovalAction}
                  onPress={() => setRoleToRemove(r)}
                >
                  <Text style={styles.reviewRemovalText}>Review role removal</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Role Button */}
            <Button
              title="+ Add another role"
              variant="outline"
              onPress={handleAddRole}
              style={styles.addDashedButton}
            />

            {/* Navigation Buttons */}
            <Button
              title="Continue to commitment"
              onPress={() => {
                syncToDraft();
                setCurrentStep(3);
              }}
              style={styles.primaryActionButton}
            />

            <View style={styles.secondaryActionsRow}>
              <Button
                title="Back to project basics"
                variant="link"
                onPress={() => setCurrentStep(1)}
              />
              <Button
                title={isActionLoading ? 'Saving...' : 'Save draft'}
                variant="outline"
                loading={isActionLoading}
                onPress={handleSaveDraft}
                style={styles.saveDraftOutlineBtn}
              />
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* STEP 3: COMMITMENT EXPECTATIONS (S10)                       */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.statusBadgeRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Draft</Text>
              </View>
            </View>

            <Text style={styles.screenHeading}>Commitment expectations</Text>
            <Text style={styles.screenSubtitle}>
              Set time commitments and team expectations.
            </Text>
            <Text style={styles.localChangesText}>Local changes · not saved yet.</Text>

            {/* Duration */}
            <FormField
              label="Duration *"
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g. 6 weeks"
            />

            <FormField
              label="Planned start date *"
              value={plannedStartDate}
              onChangeText={setPlannedStartDate}
              placeholder="e.g. 19 Oct 2026"
            />

            <FormField
              label="Planned end date *"
              value={plannedEndDate}
              onChangeText={setPlannedEndDate}
              placeholder="e.g. 30 Nov 2026"
            />

            {/* Time for each role */}
            <View style={styles.sectionDivider}>
              <Text style={styles.sectionHeaderTitle}>Time for each role</Text>
              <Text style={styles.sectionHeaderSubtitle}>
                Set weekly hours for each role.
              </Text>
            </View>

            {/* Owner Role Hours */}
            <View style={styles.card}>
              <Text style={styles.cardTitleText}>{ownerRole.title}</Text>
              <Text style={styles.cardSubtitleText}>Ada · Owner</Text>
              <Text style={styles.cardBodyText}>{ownerRole.responsibilities}</Text>
              <FormField
                label="Time commitment · hours per week *"
                value={ownerRole.hours}
                onChangeText={(val) => setOwnerRole({ ...ownerRole, hours: val })}
                keyboardType="numeric"
                placeholder="e.g. 5"
              />
            </View>

            {/* Open Roles Hours */}
            {roles.map((r) => (
              <View key={r.id} style={styles.card}>
                <Text style={styles.cardTitleText}>{r.title}</Text>
                <Text style={styles.cardSubtitleText}>Open role</Text>
                <Text style={styles.cardBodyText}>{r.responsibilities}</Text>
                <FormField
                  label="Time commitment · hours per week *"
                  value={r.hours}
                  onChangeText={(val) => updateRoleField(r.id, 'hours', val)}
                  keyboardType="numeric"
                  placeholder="e.g. 6"
                />
              </View>
            ))}

            {/* Availability Expectations */}
            <FormField
              label="Availability expectations *"
              value={availabilityExpectations}
              onChangeText={setAvailabilityExpectations}
              placeholder="e.g. Weekday evenings; Saturday afternoon"
              multiline
              numberOfLines={2}
            />

            <FormField
              label="Availability and response expectation *"
              value={responseExpectations}
              onChangeText={setResponseExpectations}
              placeholder="Agree a response window before starting. Suggested: weekday evenings."
              multiline
              numberOfLines={2}
            />

            {/* Default Working Expectations Card */}
            <View style={styles.workingAgreementsCard}>
              <Text style={styles.workingAgreementsTitle}>
                Default working expectations
              </Text>
              <Text style={styles.workingAgreementsSubtitle}>
                Every team shares a short set of working agreements that the project owner can adjust:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>
                  • Respond within the agreed response window.
                </Text>
                <Text style={styles.bulletItem}>
                  • Keep task status up to date.
                </Text>
                <Text style={styles.bulletItem}>
                  • Tell the team early if you are unavailable or a deadline is at risk.
                </Text>
                <Text style={styles.bulletItem}>
                  • Raise blockers early so the team can help.
                </Text>
              </View>
            </View>

            {/* Action buttons */}
            <Button
              title="Continue to milestones"
              onPress={() => {
                syncToDraft();
                setCurrentStep(4);
              }}
              style={styles.primaryActionButton}
            />

            <View style={styles.secondaryActionsRow}>
              <Button
                title="Back to team and roles"
                variant="link"
                onPress={() => setCurrentStep(2)}
              />
              <Button
                title={isActionLoading ? 'Saving...' : 'Save draft'}
                variant="outline"
                loading={isActionLoading}
                onPress={handleSaveDraft}
                style={styles.saveDraftOutlineBtn}
              />
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* STEP 4: CREATE MILESTONES (S11)                            */}
        {/* ========================================================= */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <View style={styles.statusBadgeRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Draft</Text>
              </View>
            </View>

            <Text style={styles.screenHeading}>Create milestones</Text>
            <Text style={styles.screenSubtitle}>
              Set key dates to keep the team on track. At least one dated milestone required; two or more recommended.
            </Text>

            {milestones.length === 0 ? (
              <View style={styles.emptyMilestonesBox}>
                <Text style={styles.emptyMilestonesTitle}>No milestones yet</Text>
                <Text style={styles.emptyMilestonesSubtext}>
                  Add a milestone name and target date to organize project deliverables.
                </Text>
              </View>
            ) : (
              milestones.map((m, index) => (
                <View key={m.id} style={styles.card}>
                  <Text style={styles.milestoneIndexText}>Milestone {index + 1}</Text>
                  <FormField
                    label="Milestone name *"
                    value={m.name}
                    onChangeText={(val) => updateMilestoneField(m.id, 'name', val)}
                    placeholder="e.g. Working prototype"
                  />
                  <FormField
                    label="Target date *"
                    value={m.targetDate}
                    onChangeText={(val) => updateMilestoneField(m.id, 'targetDate', val)}
                    placeholder="e.g. 16 Nov 2026"
                  />
                  <TouchableOpacity
                    style={styles.reviewRemovalAction}
                    onPress={() => setMilestoneToRemove(m)}
                  >
                    <Text style={styles.reviewRemovalText}>Review milestone removal</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            <Button
              title="+ Add milestone"
              variant="outline"
              onPress={handleAddMilestone}
              style={styles.addDashedButton}
            />

            <Button
              title="Continue to review"
              onPress={() => {
                syncToDraft();
                setCurrentStep(5);
              }}
              style={styles.primaryActionButton}
            />

            <View style={styles.secondaryActionsRow}>
              <Button
                title="Back to commitment"
                variant="link"
                onPress={() => setCurrentStep(3)}
              />
              <Button
                title={isActionLoading ? 'Saving...' : 'Save draft'}
                variant="outline"
                loading={isActionLoading}
                onPress={handleSaveDraft}
                style={styles.saveDraftOutlineBtn}
              />
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* STEP 5: REVIEW AND PUBLISH (S12 / S14)                     */}
        {/* ========================================================= */}
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <View style={styles.statusBadgeRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Draft</Text>
              </View>
            </View>

            <Text style={styles.screenHeading}>Review and publish</Text>
            <Text style={styles.screenSubtitle}>
              Review your project before publishing.
            </Text>
            <Text style={styles.localChangesText}>
              Last saved status: Draft · local edits are not saved yet.
            </Text>

            {/* Publication Gate Readiness Indicator */}
            {readiness.isReady ? (
              <Banner
                type="success"
                title="Ready to publish"
                message="Required details complete. Publishing opens recruitment; it does not form or start a team."
              />
            ) : (
              <Banner
                type="error"
                title={`${readiness.missingItems.length} items needed to publish`}
                message={`Add ${readiness.missingItems.map((i) => i.title).join(', ')}. You can still save this draft.`}
              />
            )}

            {/* Review Section 1: Project Basics */}
            <View style={styles.reviewSectionCard}>
              <View style={styles.reviewSectionHeader}>
                <Text style={styles.reviewSectionTitle}>Project basics</Text>
                <TouchableOpacity onPress={() => setCurrentStep(1)}>
                  <Text style={styles.editJumpLink}>Edit basics</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.reviewFieldLabel}>Project name</Text>
              <Text style={styles.reviewFieldValue}>{name || 'Not entered'}</Text>

              <Text style={styles.reviewFieldLabel}>Problem or opportunity</Text>
              <Text style={styles.reviewFieldValue}>{problem || 'Not entered'}</Text>

              <Text style={styles.reviewFieldLabel}>Description</Text>
              <Text style={styles.reviewFieldValue}>{description || 'Not entered'}</Text>

              <Text style={styles.reviewFieldLabel}>Project type</Text>
              <Text style={styles.reviewFieldValue}>{projectType || 'Not entered'}</Text>

              <Text style={styles.reviewFieldLabel}>Required project skills</Text>
              <Text style={styles.reviewFieldValue}>
                {requiredSkills.length > 0 ? requiredSkills.join(' · ') : 'Not entered'}
              </Text>

              <Text style={styles.reviewFieldLabel}>Expected outcome</Text>
              <Text style={styles.reviewFieldValue}>{expectedOutcome || 'Not entered'}</Text>
            </View>

            {/* Review Section 2: Team and Roles */}
            <View style={styles.reviewSectionCard}>
              <View style={styles.reviewSectionHeader}>
                <Text style={styles.reviewSectionTitle}>Team and roles</Text>
                <TouchableOpacity onPress={() => setCurrentStep(2)}>
                  <Text style={styles.editJumpLink}>Edit roles</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.reviewFieldLabel}>Project Owner</Text>
              <Text style={styles.reviewFieldValue}>
                {ownerRole.assigneeName} · {ownerRole.title} ({ownerRole.hours} h/week)
              </Text>

              {roles.map((r, i) => (
                <View key={r.id} style={styles.reviewRoleItem}>
                  <Text style={styles.reviewSubhead}>
                    Role {i + 1}: {r.title} (Open role · {r.hours || 'Unset'} h/week)
                  </Text>
                  <Text style={styles.reviewRoleResp}>{r.responsibilities}</Text>
                  <Text style={styles.reviewRoleSkills}>
                    Skills: {r.skills?.join(' · ') || 'None'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Review Section 3: Commitment */}
            <View style={styles.reviewSectionCard}>
              <View style={styles.reviewSectionHeader}>
                <Text style={styles.reviewSectionTitle}>Commitment summary</Text>
                <TouchableOpacity onPress={() => setCurrentStep(3)}>
                  <Text style={styles.editJumpLink}>Edit commitment</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.reviewFieldLabel}>Duration</Text>
              <Text style={styles.reviewFieldValue}>{duration || 'Not entered'}</Text>

              <Text style={styles.reviewFieldLabel}>Planned dates</Text>
              <Text style={styles.reviewFieldValue}>
                {plannedStartDate} – {plannedEndDate}
              </Text>

              <Text style={styles.reviewFieldLabel}>Availability expectations</Text>
              <Text style={styles.reviewFieldValue}>{availabilityExpectations}</Text>

              <Text style={styles.reviewFieldLabel}>Response expectation</Text>
              <Text style={styles.reviewFieldValue}>{responseExpectations}</Text>
            </View>

            {/* Review Section 4: Milestones */}
            <View style={styles.reviewSectionCard}>
              <View style={styles.reviewSectionHeader}>
                <Text style={styles.reviewSectionTitle}>Planned milestones</Text>
                <TouchableOpacity onPress={() => setCurrentStep(4)}>
                  <Text style={styles.editJumpLink}>Edit milestones</Text>
                </TouchableOpacity>
              </View>
              {milestones.map((m) => (
                <View key={m.id} style={styles.reviewMilestoneRow}>
                  <Text style={styles.reviewMilestoneName}>{m.name}</Text>
                  <Text style={styles.reviewMilestoneDate}>{m.targetDate}</Text>
                </View>
              ))}
            </View>

            {/* Publish & Draft Action Buttons */}
            <Button
              title={isActionLoading ? 'Publishing...' : 'Publish project'}
              disabled={!readiness.isReady || isActionLoading}
              loading={isActionLoading}
              onPress={handlePublish}
              style={styles.primaryActionButton}
            />

            <View style={styles.secondaryActionsRow}>
              <Button
                title="Back to milestones"
                variant="link"
                onPress={() => setCurrentStep(4)}
              />
              <Button
                title="Save draft"
                variant="outline"
                loading={isActionLoading}
                onPress={handleSaveDraft}
                style={styles.saveDraftOutlineBtn}
              />
            </View>
            <Text style={styles.saveDraftSubtext}>
              Back and edits are temporarily locked during submission.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Project Type Picker Modal */}
      <Modal visible={projectTypeModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setProjectTypeModalOpen(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Project Type</Text>
            {projectTypeOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.modalItem,
                  projectType === opt && styles.modalItemActive,
                ]}
                onPress={() => {
                  setProjectType(opt);
                  setProjectTypeModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    projectType === opt && styles.modalItemTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Role Removal Review Modal */}
      <Modal visible={Boolean(roleToRemove)} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Remove {roleToRemove?.title}?
            </Text>
            <Text style={styles.modalMessage}>
              Remove this role? Other role cards stay unchanged.
            </Text>
            <Button
              title="Keep role entry"
              onPress={() => setRoleToRemove(null)}
              style={styles.modalKeepBtn}
            />
            <Button
              title="Remove this role"
              variant="outline"
              onPress={confirmRemoveRole}
            />
          </View>
        </View>
      </Modal>

      {/* Milestone Removal Review Modal */}
      <Modal visible={Boolean(milestoneToRemove)} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Remove {milestoneToRemove?.name}?
            </Text>
            <Text style={styles.modalMessage}>
              {milestones.length <= 1
                ? 'You can save a draft without milestones. Publishing will need at least one named milestone with a target date.'
                : 'Remove this milestone? Other milestones stay unchanged.'}
            </Text>
            <Button
              title="Keep milestone"
              onPress={() => setMilestoneToRemove(null)}
              style={styles.modalKeepBtn}
            />
            <Button
              title={
                milestones.length <= 1
                  ? 'Remove and keep draft incomplete'
                  : 'Remove this milestone'
              }
              variant="outline"
              onPress={confirmRemoveMilestone}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl * 2,
  },
  stepHeaderWrapper: {
    backgroundColor: colors.surface,
    paddingTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepTextRow: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xs,
  },
  stepCounterText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: colors.surfaceMuted,
    width: '100%',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: colors.primary,
  },
  stepTabScroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  stepTab: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  stepTabActive: {
    backgroundColor: colors.primaryTint,
  },
  stepTabText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  stepTabTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  stepTabTextCompleted: {
    color: colors.textHeading,
  },
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.md,
  },
  demoLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  demoScroll: {
    gap: spacing.xs,
  },
  demoTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  demoTabActive: {
    backgroundColor: colors.primary,
  },
  demoTabText: {
    fontSize: 11,
    color: colors.textHeading,
    fontFamily: fonts.semiBold,
  },
  demoTabTextActive: {
    color: colors.textWhite,
  },
  stepContainer: {
    marginTop: spacing.sm,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  statusBadge: {
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  statusBadgeText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  screenHeading: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.xs,
  },
  screenSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  requiredNotice: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSubtle,
    marginBottom: spacing.lg,
  },
  localChangesText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: spacing.xs + 2,
  },
  dropdownButton: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  dropdownButtonText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
  },
  dropdownArrow: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textMuted,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  skillChipText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    marginRight: 6,
  },
  chipRemoveText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.primary,
  },
  navHelperText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  primaryActionButton: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  saveDraftOutlineBtn: {
    width: 130,
    height: 42,
  },
  saveDraftSubtext: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSubtle,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  teamSizeNumber: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginVertical: 4,
  },
  teamSizeCaption: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  roleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  roleCardTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  ownerBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  ownerBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  openRoleBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  openRoleBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#0284C7',
  },
  roleSectionLabel: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    marginBottom: 4,
    marginTop: spacing.xs,
  },
  roleBodyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  roleChip: {
    backgroundColor: colors.primaryTint,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  roleChipText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  reviewRemovalAction: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    paddingVertical: 4,
  },
  reviewRemovalText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },
  addDashedButton: {
    marginBottom: spacing.xl,
    borderStyle: 'dashed',
  },
  sectionDivider: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  sectionHeaderSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardTitleText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  cardSubtitleText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    marginTop: 2,
    marginBottom: 6,
  },
  cardBodyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  workingAgreementsCard: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  workingAgreementsTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: '#581C87',
    marginBottom: 4,
  },
  workingAgreementsSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#7E22CE',
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  bulletList: {
    gap: 4,
  },
  bulletItem: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#581C87',
    lineHeight: 18,
  },
  emptyMilestonesBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyMilestonesTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  emptyMilestonesSubtext: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  milestoneIndexText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  reviewSectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  reviewSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  editJumpLink: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },
  reviewFieldLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  reviewFieldValue: {
    fontSize: 14,
    color: colors.textHeading,
    fontFamily: fonts.medium,
    marginTop: 2,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  reviewRoleItem: {
    backgroundColor: colors.canvas,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  reviewSubhead: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  reviewRoleResp: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textBody,
    marginTop: 2,
  },
  reviewRoleSkills: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  reviewMilestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reviewMilestoneName: {
    fontSize: 14,
    color: colors.textHeading,
    fontFamily: fonts.semiBold,
  },
  reviewMilestoneDate: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textBody,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalKeepBtn: {
    marginBottom: spacing.sm,
  },
  modalItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemActive: {
    backgroundColor: colors.primaryTint,
  },
  modalItemText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textHeading,
  },
  modalItemTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});
