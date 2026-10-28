// import React, { useState } from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import Header from '../components/Header';
// import Button from '../components/Button';
// import Banner from '../components/Banner';
// import { useApp } from '../context/AppContext';
// import { colors, radius, spacing } from '../constants/theme';

// export default function ProjectPublishedScreen() {
//   const { currentDraft } = useApp();

//   // Companion State Demo Controller: 'default' | 'loading' | 'error'
//   const [activeState, setActiveState] = useState('default'); // 'default' (S13.E) | 'loading' (S13.L) | 'error' (S13.X)
//   const [isChecking, setIsChecking] = useState(false);

//   const handleRecheckStatus = () => {
//     setIsChecking(true);
//     setTimeout(() => {
//       setIsChecking(false);
//       setActiveState('default');
//     }, 600);
//   };

//   const projectTitle = currentDraft.name || 'Campus Marketplace';
//   const projectProblem =
//     currentDraft.problem ||
//     'Students struggle to exchange campus items across scattered group chats.';
//   const projectDuration = currentDraft.duration || '6 weeks';
//   const projectDates = `${currentDraft.plannedStartDate || '19 Oct'}–${currentDraft.plannedEndDate || '30 Nov 2026'}`;
//   const ownerName = currentDraft.ownerRole?.assigneeName || 'Ada';
//   const ownerTitle = currentDraft.ownerRole?.title || 'Product Manager';

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Header rightText="Menu" activeMenuItem="myprojects" />

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Companion State Demo Toolbar (for Figma QA testing) */}
//         <View style={styles.demoBar}>
//           <Text style={styles.demoLabel}>State Demo:</Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.demoScroll}
//           >
//             {[
//               { id: 'default', label: 'Default (S13.E)' },
//               { id: 'loading', label: 'S13.L (Checking status)' },
//               { id: 'error', label: 'S13.X (Status load failed)' },
//             ].map((st) => (
//               <TouchableOpacity
//                 key={st.id}
//                 onPress={() => setActiveState(st.id)}
//                 style={[
//                   styles.demoTab,
//                   activeState === st.id && styles.demoTabActive,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.demoTabText,
//                     activeState === st.id && styles.demoTabTextActive,
//                   ]}
//                 >
//                   {st.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         {/* State Banner Feedback */}
//         {activeState === 'default' && (
//           <Banner
//             type="success"
//             title={`${projectTitle} is Open`}
//             message="Published. You are the Project Owner; no collaborators have joined."
//           />
//         )}

//         {activeState === 'loading' && (
//           <Banner
//             type="info"
//             title="Checking publication status..."
//             message="Loading the existing project. Do not publish another copy."
//           />
//         )}

//         {activeState === 'error' && (
//           <Banner
//             type="error"
//             title="Publication status could not load"
//             message="Draft and local entries retained. Check the existing record before retrying."
//           />
//         )}

//         {/* S13.X Error Alternative View */}
//         {activeState === 'error' ? (
//           <View style={styles.errorContainer}>
//             <View style={styles.statusBadgeRow}>
//               <View style={styles.statusBadgeNeutral}>
//                 <Text style={styles.statusBadgeNeutralText}>Status unknown</Text>
//               </View>
//             </View>
//             <Text style={styles.screenHeading}>{projectTitle}</Text>
//             <Button
//               title="Recheck publication status"
//               loading={isChecking}
//               onPress={handleRecheckStatus}
//               style={styles.primaryBtn}
//             />
//             <Button
//               title="Return to My Projects"
//               variant="outline"
//               onPress={() => router.push('/myprojects')}
//               style={styles.secondaryBtn}
//             />
//             <Button
//               title="Publish again — status unknown"
//               variant="link"
//               onPress={() => router.push('/create-project')}
//             />
//           </View>
//         ) : activeState === 'loading' ? (
//           /* S13.L Loading State View */
//           <View style={styles.loadingContainer}>
//             <View style={styles.statusBadgeRow}>
//               <View style={styles.statusBadgeNeutral}>
//                 <Text style={styles.statusBadgeNeutralText}>Status unknown</Text>
//               </View>
//             </View>
//             <Text style={styles.screenHeading}>{projectTitle}</Text>
//             <Button
//               title="Checking status..."
//               loading={true}
//               disabled={true}
//               style={styles.primaryBtn}
//             />
//             <Button
//               title="Publish again"
//               variant="outline"
//               disabled={true}
//               style={styles.secondaryBtn}
//             />
//           </View>
//         ) : (
//           /* S13.D / S13.E Default Published View */
//           <View>
//             <Text style={styles.screenHeading}>Your project is published</Text>
//             <Text style={styles.screenSubtitle}>
//               Find collaborators for your open roles.
//             </Text>

//             {/* Project Summary Card */}
//             <View style={styles.projectCard}>
//               <View style={styles.ownerRow}>
//                 <View style={styles.avatarCircle}>
//                   <Text style={styles.avatarText}>{ownerName.charAt(0)}</Text>
//                 </View>
//                 <Text style={styles.ownerNameText}>
//                   {ownerName} · Owner / {ownerTitle}
//                 </Text>
//                 <View style={styles.pillOpen}>
//                   <Text style={styles.textOpen}>Open</Text>
//                 </View>
//               </View>

//               <Text style={styles.projectTitleText}>{projectTitle}</Text>
//               <Text style={styles.projectProblemText}>{projectProblem}</Text>
//               <Text style={styles.projectDatesText}>
//                 {projectDuration} · planned {projectDates}
//               </Text>

//               <Button
//                 title="Find collaborators"
//                 onPress={() => router.push('/dashboard')}
//                 style={styles.findCollaboratorsBtn}
//               />
//               <Text style={styles.recruitmentNote}>
//                 Recruitment is open. No team has formed or started yet.
//               </Text>
//             </View>

//             {/* Expected Outcome Card */}
//             <View style={styles.card}>
//               <Text style={styles.cardHeaderTitle}>Expected outcome</Text>
//               <Text style={styles.cardBodyText}>
//                 {currentDraft.expectedOutcome ||
//                   'A responsive marketplace prototype with sign-up, item browsing and a documented build.'}
//               </Text>
//             </View>

//             {/* Open Roles Section */}
//             <View style={styles.card}>
//               <Text style={styles.cardHeaderTitle}>
//                 Open roles ({currentDraft.roles?.length || 2})
//               </Text>
//               {(currentDraft.roles || []).map((r) => (
//                 <View key={r.id} style={styles.roleItemBox}>
//                   <Text style={styles.roleItemTitle}>{r.title}</Text>
//                   <Text style={styles.roleItemMeta}>
//                     Unfilled · {r.hours || '6'} h / week · {projectDuration}
//                   </Text>
//                   <Text style={styles.roleItemResp}>{r.responsibilities}</Text>
//                   <Text style={styles.roleItemSkills}>
//                     Required skills: {r.skills?.join(' · ')}
//                   </Text>
//                 </View>
//               ))}
//             </View>

//             {/* Planned Milestones Section */}
//             <View style={styles.card}>
//               <Text style={styles.cardHeaderTitle}>Planned milestones</Text>
//               {(currentDraft.milestones || []).map((m) => (
//                 <View key={m.id} style={styles.milestoneRow}>
//                   <Text style={styles.milestoneName}>{m.name}</Text>
//                   <Text style={styles.milestoneDate}>{m.targetDate}</Text>
//                 </View>
//               ))}
//             </View>

//             {/* Invitations Section (S13.E) */}
//             <View style={styles.invitationsCard}>
//               <View style={styles.trayIconCircle}>
//                 <Text style={styles.trayIconText}>≡</Text>
//               </View>
//               <Text style={styles.invitationsHeading}>No invitations sent yet</Text>
//               <Text style={styles.invitationsSubtext}>
//                 Find collaborators. Publishing does not invite or accept teammates automatically.
//               </Text>

//               <Button
//                 title="Find collaborators"
//                 onPress={() => router.push('/find-collaborators')}
//                 style={styles.findCollaboratorsSecondaryBtn}
//               />
//               <Button
//                 title="View project details"
//                 variant="outline"
//                 onPress={() => router.push('/project-details')}
//               />
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: colors.canvas,
//   },
//   scrollContent: {
//     paddingHorizontal: spacing.xl,
//     paddingTop: spacing.md,
//     paddingBottom: spacing.xxxl * 2,
//   },
//   demoBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#EDE9FE',
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     borderRadius: radius.md,
//     marginBottom: spacing.md,
//   },
//   demoLabel: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: colors.primary,
//     marginRight: spacing.sm,
//   },
//   demoScroll: {
//     gap: spacing.xs,
//   },
//   demoTab: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: radius.sm,
//     backgroundColor: colors.surface,
//   },
//   demoTabActive: {
//     backgroundColor: colors.primary,
//   },
//   demoTabText: {
//     fontSize: 11,
//     color: colors.textHeading,
//     fontWeight: '600',
//   },
//   demoTabTextActive: {
//     color: colors.textWhite,
//   },
//   screenHeading: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: colors.textHeading,
//     marginBottom: spacing.xs,
//   },
//   screenSubtitle: {
//     fontSize: 14,
//     color: colors.textMuted,
//     marginBottom: spacing.lg,
//   },
//   projectCard: {
//     backgroundColor: colors.surface,
//     borderRadius: radius.md,
//     borderWidth: 1,
//     borderColor: colors.border,
//     padding: spacing.lg,
//     marginBottom: spacing.lg,
//   },
//   ownerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: spacing.sm,
//   },
//   avatarCircle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#EEECFC',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.sm,
//   },
//   avatarText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: colors.primary,
//   },
//   ownerNameText: {
//     fontSize: 13,
//     color: colors.textBody,
//     fontWeight: '500',
//     flex: 1,
//   },
//   pillOpen: {
//     backgroundColor: '#F3E8FF',
//     paddingHorizontal: spacing.sm,
//     paddingVertical: 3,
//     borderRadius: radius.sm,
//   },
//   textOpen: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#7E22CE',
//   },
//   projectTitleText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: colors.textHeading,
//     marginBottom: 4,
//   },
//   projectProblemText: {
//     fontSize: 13,
//     color: colors.textBody,
//     lineHeight: 18,
//     marginBottom: spacing.sm,
//   },
//   projectDatesText: {
//     fontSize: 12,
//     color: colors.textMuted,
//     marginBottom: spacing.md,
//   },
//   findCollaboratorsBtn: {
//     marginTop: spacing.xs,
//   },
//   recruitmentNote: {
//     fontSize: 11,
//     color: colors.textSubtle,
//     marginTop: spacing.xs + 2,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: colors.surface,
//     borderRadius: radius.md,
//     borderWidth: 1,
//     borderColor: colors.border,
//     padding: spacing.lg,
//     marginBottom: spacing.lg,
//   },
//   cardHeaderTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: colors.textHeading,
//     marginBottom: spacing.sm,
//   },
//   cardBodyText: {
//     fontSize: 13,
//     color: colors.textBody,
//     lineHeight: 19,
//   },
//   roleItemBox: {
//     backgroundColor: colors.canvas,
//     borderRadius: radius.sm,
//     padding: spacing.md,
//     marginTop: spacing.sm,
//   },
//   roleItemTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: colors.textHeading,
//   },
//   roleItemMeta: {
//     fontSize: 12,
//     color: '#0284C7',
//     fontWeight: '600',
//     marginTop: 2,
//     marginBottom: 4,
//   },
//   roleItemResp: {
//     fontSize: 13,
//     color: colors.textBody,
//     lineHeight: 18,
//     marginBottom: 4,
//   },
//   roleItemSkills: {
//     fontSize: 11,
//     color: colors.textMuted,
//   },
//   milestoneRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   milestoneName: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: colors.textHeading,
//   },
//   milestoneDate: {
//     fontSize: 12,
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   invitationsCard: {
//     backgroundColor: colors.surface,
//     borderRadius: radius.md,
//     borderWidth: 1,
//     borderColor: colors.border,
//     padding: spacing.xl,
//     alignItems: 'center',
//     marginBottom: spacing.lg,
//   },
//   trayIconCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: colors.primaryLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: spacing.sm,
//   },
//   trayIconText: {
//     fontSize: 18,
//     color: colors.primary,
//     fontWeight: 'bold',
//   },
//   invitationsHeading: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: colors.textHeading,
//     marginBottom: 4,
//   },
//   invitationsSubtext: {
//     fontSize: 13,
//     color: colors.textMuted,
//     textAlign: 'center',
//     lineHeight: 18,
//     marginBottom: spacing.lg,
//   },
//   findCollaboratorsSecondaryBtn: {
//     width: '100%',
//     marginBottom: spacing.sm,
//   },
//   errorContainer: {
//     backgroundColor: colors.surface,
//     borderRadius: radius.md,
//     padding: spacing.lg,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   loadingContainer: {
//     backgroundColor: colors.surface,
//     borderRadius: radius.md,
//     padding: spacing.lg,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   statusBadgeRow: {
//     flexDirection: 'row',
//     marginBottom: spacing.sm,
//   },
//   statusBadgeNeutral: {
//     backgroundColor: colors.surfaceMuted,
//     paddingHorizontal: spacing.sm,
//     paddingVertical: 3,
//     borderRadius: radius.sm,
//   },
//   statusBadgeNeutralText: {
//     fontSize: 12,
//     color: colors.textMuted,
//     fontWeight: '600',
//   },
//   primaryBtn: {
//     marginTop: spacing.md,
//     marginBottom: spacing.sm,
//   },
//   secondaryBtn: {
//     marginBottom: spacing.sm,
//   },
// });
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Banner from '../components/Banner';
import Button from '../components/Button';
import Header from '../components/Header';
import { colors, fonts, radius, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function ProjectPublishedScreen() {
  const { currentDraft } = useApp();

  // Companion State Demo Controller: 'default' | 'loading' | 'error'
  const [activeState, setActiveState] = useState('default'); // 'default' (S13.E) | 'loading' (S13.L) | 'error' (S13.X)
  const [isChecking, setIsChecking] = useState(false);

  const handleRecheckStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setActiveState('default');
    }, 600);
  };

  const projectTitle = currentDraft.name || 'Campus Marketplace';
  const projectProblem =
    currentDraft.problem ||
    'Students struggle to exchange campus items across scattered group chats.';
  const projectDuration = currentDraft.duration || '6 weeks';
  const projectDates = `${currentDraft.plannedStartDate || '19 Oct'}–${currentDraft.plannedEndDate || '30 Nov 2026'}`;
  const ownerName = currentDraft.ownerRole?.assigneeName || 'Ada';
  const ownerTitle = currentDraft.ownerRole?.title || 'Product Manager';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="myprojects" />

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
              { id: 'default', label: 'Default (S13.E)' },
              { id: 'loading', label: 'S13.L (Checking status)' },
              { id: 'error', label: 'S13.X (Status load failed)' },
            ].map((st) => (
              <TouchableOpacity
                key={st.id}
                onPress={() => setActiveState(st.id)}
                style={[
                  styles.demoTab,
                  activeState === st.id && styles.demoTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.demoTabText,
                    activeState === st.id && styles.demoTabTextActive,
                  ]}
                >
                  {st.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* S13.X Error Alternative View */}
        {activeState === 'error' ? (
          <View style={styles.errorContainer}>
            <View style={styles.statusBadgeRow}>
              <View style={styles.statusBadgeNeutral}>
                <Text style={styles.statusBadgeNeutralText}>Status unknown</Text>
              </View>
            </View>
            <Text style={styles.screenHeading}>{projectTitle}</Text>
            <Button
              title="Recheck publication status"
              loading={isChecking}
              onPress={handleRecheckStatus}
              style={styles.primaryBtn}
            />
            <Button
              title="Return to My Projects"
              variant="outline"
              onPress={() => router.push('/myprojects')}
              style={styles.secondaryBtn}
            />
            <Button
              title="Publish again — status unknown"
              variant="link"
              onPress={() => router.push('/create-project')}
            />
          </View>
        ) : activeState === 'loading' ? (
          /* S13.L Loading State View */
          <View style={styles.loadingContainer}>
            <View style={styles.statusBadgeRow}>
              <View style={styles.statusBadgeNeutral}>
                <Text style={styles.statusBadgeNeutralText}>Status unknown</Text>
              </View>
            </View>
            <Text style={styles.screenHeading}>{projectTitle}</Text>
            <Button
              title="Checking status..."
              loading={true}
              disabled={true}
              style={styles.primaryBtn}
            />
            <Button
              title="Publish again"
              variant="outline"
              disabled={true}
              style={styles.secondaryBtn}
            />
          </View>
        ) : (
          /* S13.D / S13.E Default Published View */
          <View>
            {/* Hero Published Image */}
            <Image
              source={require('../../assets/images/published.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Open Badge */}
            <View style={styles.pillOpenWrapper}>
              <View style={styles.pillOpen}>
                <Text style={styles.textOpen}>Open</Text>
              </View>
            </View>

            <Text style={styles.screenHeading}>Your project is published</Text>
            <Text style={styles.screenSubtitle}>
              Find collaborators for your open roles.
            </Text>

            {/* State Banner Feedback */}
            <Banner
              type="success"
              title={`${projectTitle} is Open`}
              message="Published. You are the Project Owner; no collaborators have joined."
            />

            {/* User Owner Info Row */}
            <View style={styles.ownerRowExternal}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{ownerName.charAt(0)}</Text>
              </View>
              <Text style={styles.ownerNameText}>
                {ownerName} · Owner / {ownerTitle}
              </Text>
            </View>

            {/* Project Summary Card */}
            <View style={styles.projectCard}>
              <View style={styles.pillOpenCard}>
                <Text style={styles.textOpen}>Open</Text>
              </View>

              <Text style={styles.projectTitleText}>{projectTitle}</Text>
              <Text style={styles.projectProblemText}>{projectProblem}</Text>
              <Text style={styles.projectDatesText}>
                {projectDuration} · planned {projectDates}
              </Text>

              <Button
                title="Find collaborators"
                onPress={() => router.push('/dashboard')}
                style={styles.findCollaboratorsBtn}
              />
            </View>

            {/* Expected Outcome Card */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Expected outcome</Text>
              <Text style={styles.cardBodyText}>
                {currentDraft.expectedOutcome ||
                  'A responsive marketplace prototype with sign-up, item browsing and a documented build.'}
              </Text>
            </View>

            {/* Open Roles Section */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>
                Open roles ({currentDraft.roles?.length || 2})
              </Text>
              {(currentDraft.roles || []).map((r) => (
                <View key={r.id} style={styles.roleItemBox}>
                  <Text style={styles.roleItemTitle}>{r.title}</Text>
                  <Text style={styles.roleItemMeta}>
                    Unfilled · {r.hours || '6'} h / week · {projectDuration}
                  </Text>
                  <Text style={styles.roleItemResp}>{r.responsibilities}</Text>
                  <Text style={styles.roleItemSkills}>
                    Required skills: {r.skills?.join(' · ')}
                  </Text>
                </View>
              ))}
            </View>

            {/* Planned Milestones Section */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Planned milestones</Text>
              {(currentDraft.milestones || []).map((m) => (
                <View key={m.id} style={styles.milestoneRow}>
                  <Text style={styles.milestoneName}>{m.name}</Text>
                  <Text style={styles.milestoneDate}>{m.targetDate}</Text>
                </View>
              ))}
            </View>

            {/* Invitations Section (S13.E) */}
            <View style={styles.invitationsCard}>
              <View style={styles.trayIconCircle}>
                <Text style={styles.trayIconText}>≡</Text>
              </View>
              <Text style={styles.invitationsHeading}>No invitations sent yet</Text>
              <Text style={styles.invitationsSubtext}>
                Find collaborators. Publishing does not invite or accept teammates automatically.
              </Text>

              <Button
                title="Find collaborators"
                onPress={() => router.push('/find-collaborators')}
                style={styles.findCollaboratorsSecondaryBtn}
              />
              <Button
                title="View project details"
                variant="outline"
                onPress={() => router.push('/project-details')}
              />
            </View>
          </View>
        )}
      </ScrollView>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl * 2,
  },
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
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
  heroImage: {
    width: '100vw', // or dimensions fitting your layout container width
    height: 200,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  pillOpenWrapper: {
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  pillOpen: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  pillOpenCard: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  textOpen: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: '#7E22CE',
  },
  screenHeading: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.xs,
  },
  screenSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  ownerRowExternal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  projectCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEECFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  ownerNameText: {
    fontSize: 13,
    color: colors.textBody,
    fontFamily: fonts.medium,
  },
  projectTitleText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  projectProblemText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  projectDatesText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  findCollaboratorsBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
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
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: spacing.sm,
  },
  cardBodyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 19,
  },
  roleItemBox: {
    backgroundColor: colors.canvas,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  roleItemTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textHeading,
  },
  roleItemMeta: {
    fontSize: 12,
    color: '#0284C7',
    fontFamily: fonts.semiBold,
    marginTop: 2,
    marginBottom: 4,
  },
  roleItemResp: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textBody,
    lineHeight: 18,
    marginBottom: 4,
  },
  roleItemSkills: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  milestoneName: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
  },
  milestoneDate: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  invitationsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  trayIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  trayIconText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  invitationsHeading: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textHeading,
    marginBottom: 4,
  },
  invitationsSubtext: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  findCollaboratorsSecondaryBtn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  errorContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  statusBadgeNeutral: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  statusBadgeNeutralText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
  },
  primaryBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  secondaryBtn: {
    marginBottom: spacing.sm,
  },
});