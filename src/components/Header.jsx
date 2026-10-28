import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  useWindowDimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';

// Vector Bell Icon Component
function BellIcon({ unreadCount = 0 }) {
  return (
    <View style={styles.bellWrapper}>
      <View style={styles.bellTopNub} />
      <View style={styles.bellBody} />
      <View style={styles.bellRim} />
      <View style={styles.bellClapper} />
      {unreadCount > 0 && (
        <View style={styles.badgeCountPill}>
          <Text style={styles.badgeCountText}>{unreadCount}</Text>
        </View>
      )}
    </View>
  );
}

// Vector Cog/Settings Icon Component
function CogIcon() {
  return (
    <View style={styles.cogWrapper}>
      <View style={[styles.cogTooth, { transform: [{ rotate: '0deg' }] }]} />
      <View style={[styles.cogTooth, { transform: [{ rotate: '45deg' }] }]} />
      <View style={[styles.cogTooth, { transform: [{ rotate: '90deg' }] }]} />
      <View style={[styles.cogTooth, { transform: [{ rotate: '135deg' }] }]} />
      <View style={styles.cogInnerCircle}>
        <View style={styles.cogCenterHole} />
      </View>
    </View>
  );
}

export default function Header({
  rightAction,
  onRightPress,
  rightText = 'Menu',
  activeMenuItem,
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const appContext = useApp();
  const unreadCount = appContext?.unreadNotificationsCount || 0;

  const drawerWidth = Math.min(320, windowWidth * 0.8);

  const [slideAnim] = useState(() => new Animated.Value(-320));
  const [backdropAnim] = useState(() => new Animated.Value(0));

  const isMenuMode = rightText === 'Menu' || rightText === 'Close menu';

  const openMenu = () => {
    slideAnim.setValue(-drawerWidth);
    backdropAnim.setValue(0);
    setMenuVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = (onFinished) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuVisible(false);
      if (typeof onFinished === 'function') {
        onFinished();
      }
    });
  };

  const handleToggleMenu = () => {
    if (onRightPress && !isMenuMode) {
      onRightPress();
    } else {
      if (menuVisible) {
        closeMenu();
      } else {
        openMenu();
      }
    }
  };

  const navItems = [
    { label: 'Dashboard', route: '/dashboard', id: 'dashboard' },
    { label: 'Discover Projects', route: '/discover-projects', id: 'discover' },
    { label: 'Find Collaborators', route: '/find-collaborators', id: 'collaborators' },
    {
      label: 'Review Join Requests',
      route: '/review-join-requests',
      id: 'joinrequests',
      badge: '1 pending',
    },
    { label: 'Create Project', route: '/create-project', id: 'createproject' },
    { label: 'My Projects', route: '/myprojects', id: 'myprojects' },
    { label: 'Workspace', route: '/workspace', id: 'workspace' },
    { label: 'Project Updates', route: '/project-updates', id: 'updates' },
    { label: 'Team Health', route: '/team-health', id: 'teamhealth' },
    {
      label: 'Notifications',
      route: '/notifications',
      id: 'notifications',
      badge: unreadCount > 0 ? `${unreadCount} unread` : undefined,
    },
    { label: 'Settings', route: '/settings', id: 'settings' },
    { label: 'Project Completion', route: '/project-completion', id: 'completion' },
    { label: 'Private Project Page', route: '/private-project-page', id: 'projectpage' },
    { label: 'Profile & Privacy', route: '/profileandprivacy', id: 'profile' },
  ];

  const handleNavigate = (route) => {
    setMenuVisible(false);
    slideAnim.setValue(-drawerWidth);
    backdropAnim.setValue(0);
    if (route) {
      router.push(route);
    }
  };

  // Determine which item is currently active
  const currentActive =
    activeMenuItem ||
    (pathname?.includes('notification')
      ? 'notifications'
      : pathname?.includes('setting') || pathname?.includes('deletion')
      ? 'settings'
      : pathname?.includes('team-health') || pathname?.includes('teamhealth')
      ? 'teamhealth'
      : pathname?.includes('project-updates') || pathname?.includes('projectupdates')
      ? 'updates'
      : pathname?.includes('discover')
      ? 'discover'
      : pathname?.includes('review-join') || pathname?.includes('reviewjoin')
      ? 'joinrequests'
      : pathname?.includes('collaborator')
      ? 'collaborators'
      : pathname?.includes('create')
      ? 'createproject'
      : pathname?.includes('dashboard')
      ? 'dashboard'
      : pathname?.includes('myprojects') || pathname?.includes('my-projects')
      ? 'myprojects'
      : pathname?.includes('workspace')
      ? 'workspace'
      : pathname?.includes('completion') || pathname?.includes('contribution') || pathname?.includes('teammate')
      ? 'completion'
      : pathname?.includes('private-project') || pathname?.includes('project-page') || pathname?.includes('privacy') || pathname?.includes('ended-early')
      ? 'projectpage'
      : pathname?.includes('profile')
      ? 'profile'
      : null);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/')}
          style={styles.logoContainer}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/images/teamup-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {rightAction ? (
          rightAction
        ) : isMenuMode ? (
          <View style={styles.headerRightActions}>
            {/* Notification Bell */}
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              style={styles.headerIconButton}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
              accessibilityLabel="Notifications"
            >
              <BellIcon unreadCount={unreadCount} />
            </TouchableOpacity>

            {/* Settings Cog */}
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              style={styles.headerIconButton}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
              accessibilityLabel="Settings"
            >
              <CogIcon />
            </TouchableOpacity>

            {/* Menu */}
            <TouchableOpacity
              onPress={handleToggleMenu}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 12 }}
            >
              <Text style={styles.actionText}>Menu</Text>
            </TouchableOpacity>
          </View>
        ) : onRightPress ? (
          <TouchableOpacity
            onPress={onRightPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.actionText}>{rightText}</Text>
          </TouchableOpacity>
        ) : rightText ? (
          <Text style={styles.headerStatusText}>{rightText}</Text>
        ) : null}
      </View>

      {/* Side-Drawer Modal appearing from the left */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => closeMenu()}
      >
        <View style={styles.modalOverlay}>
          {/* Dimmed backdrop covering the whole screen */}
          <TouchableWithoutFeedback onPress={() => closeMenu()}>
            <Animated.View
              style={[
                styles.backdrop,
                { opacity: backdropAnim },
              ]}
            />
          </TouchableWithoutFeedback>

          {/* Drawer container sliding from the left */}
          <Animated.View
            style={[
              styles.drawer,
              {
                width: drawerWidth,
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 16),
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <TouchableOpacity
                onPress={() => handleNavigate('/')}
                style={styles.logoContainer}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../assets/images/teamup-logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => closeMenu()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.drawerCloseButton}
              >
                <Text style={styles.drawerCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerDivider} />

            {/* Nav list */}
            <ScrollView
              contentContainerStyle={styles.drawerScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.drawerSectionLabel}>NAVIGATION</Text>
              {navItems.map((item) => {
                const isActive = currentActive === item.id;
                return (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                    onPress={() => handleNavigate(item.route)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.menuItemText,
                        isActive && styles.menuItemTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.badge ? (
                      <View style={styles.badgePill}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Drawer Footer */}
            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>TeamUp · Campus Collaboration</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    zIndex: 100,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    justifyContent: 'center',
  },
  logoImage: {
    width: 104,
    height: 28,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellTopNub: {
    width: 3,
    height: 2,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
  bellBody: {
    width: 13,
    height: 11,
    borderTopLeftRadius: 6.5,
    borderTopRightRadius: 6.5,
    borderWidth: 1.8,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  bellRim: {
    width: 17,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
    marginTop: -1,
  },
  bellClapper: {
    width: 4,
    height: 2.5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: colors.primary,
  },
  badgeCountPill: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontFamily: fonts.bold,
    lineHeight: 11,
  },
  cogWrapper: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cogTooth: {
    position: 'absolute',
    width: 19,
    height: 4.5,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  cogInnerCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  cogCenterHole: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },
  headerStatusText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  modalOverlay: {
    flex: 1,
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 10,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  drawerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCloseText: {
    fontSize: 14,
    color: colors.textHeading,
    fontFamily: fonts.bold,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  drawerScrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  drawerSectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginVertical: 2,
  },
  menuItemActive: {
    backgroundColor: colors.primaryTint,
  },
  menuItemText: {
    fontSize: 15,
    color: colors.textHeading,
    fontFamily: fonts.medium,
  },
  menuItemTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  badgePill: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  drawerFooter: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  drawerFooterText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
