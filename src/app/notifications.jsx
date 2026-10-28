import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../components/Header';
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import Banner from '../components/Banner';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function NotificationsScreen() {
  const {
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } = useApp();

  // QA Specimen switcher for Walkthrough QA
  // 'default' | 'empty' | 'loading' | 'error'
  const [activeSpecimen, setActiveSpecimen] = useState('default');
  const [showMarkedSuccess, setShowMarkedSuccess] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setShowMarkedSuccess(true);
  };

  const handleNotificationAction = async (notif) => {
    await markNotificationAsRead(notif.id);
    if (notif.route) {
      if (notif.params) {
        router.push({ pathname: notif.route, params: notif.params });
      } else {
        router.push(notif.route);
      }
    }
  };

  const totalCount = notifications.length;
  const unreadCount = unreadNotificationsCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header rightText="Menu" activeMenuItem="notifications" />
      <PersonaSwitcher />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Walkthrough Specimen State Demo Toolbar */}
        <View style={styles.demoBar}>
          <Text style={styles.demoLabel}>Walkthrough Specimen:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {[
              { id: 'default', label: 'Default' },
              { id: 'empty', label: 'Empty' },
              { id: 'loading', label: 'Loading' },
              { id: 'error', label: 'Error' },
            ].map((sp) => (
              <TouchableOpacity
                key={sp.id}
                onPress={() => {
                  setActiveSpecimen(sp.id);
                  if (sp.id === 'default') {
                    setShowMarkedSuccess(false);
                  }
                }}
                style={[
                  styles.demoTab,
                  activeSpecimen === sp.id && styles.demoTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.demoTabText,
                    activeSpecimen === sp.id && styles.demoTabTextActive,
                  ]}
                >
                  {sp.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sub-navigation bar */}
        <View style={styles.subnavBar}>
          <TouchableOpacity onPress={() => router.push('/myprojects')}>
            <Text style={styles.subnavLink}>My Projects</Text>
          </TouchableOpacity>
        </View>

        {/* Screen Title & Subtitle */}
        <Text style={styles.mainTitle}>Notifications</Text>
        <Text style={styles.subText}>
          Your invitations, updates and gentle reminders.
        </Text>

        {/* ========================================================= */}
        {/* SPECIMEN: EMPTY STATE (0 notifications)                   */}
        {/* ========================================================= */}
        {activeSpecimen === 'empty' && (
          <View>
            <Text style={styles.notificationsCountHeader}>0 notifications</Text>

            <View style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.emptyInboxLine1} />
                <View style={styles.emptyInboxLine2} />
                <View style={styles.emptyInboxLine3} />
              </View>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                Invitations and project updates will appear here.
              </Text>
              <Button
                title="Back to My Projects"
                onPress={() => router.push('/myprojects')}
                style={{ width: '100%', marginTop: spacing.md }}
              />
              <Text style={styles.emptyFooterNote}>
                Choose what you receive in Settings → Notifications.
              </Text>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* SPECIMEN: LOADING STATE                                   */}
        {/* ========================================================= */}
        {activeSpecimen === 'loading' && (
          <View>
            <Banner
              type="info"
              title="Loading notifications..."
              message="We'll show the status when it's available."
            />
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <View style={styles.skeletonTag} />
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonDate} />
                <View style={styles.skeletonBtn} />
              </View>
            ))}
          </View>
        )}

        {/* ========================================================= */}
        {/* SPECIMEN: ERROR STATE                                     */}
        {activeSpecimen === 'error' && (
          <View style={styles.card}>
            <Banner
              type="error"
              title="Couldn't refresh notifications"
              message="Showing your last saved list. Nothing has changed."
            />
            <Button
              title="Retry refresh"
              variant="outline"
              loading={isRetrying}
              onPress={() => {
                setIsRetrying(true);
                setTimeout(() => {
                  setIsRetrying(false);
                  setActiveSpecimen('default');
                }, 400);
              }}
            />
          </View>
        )}

        {/* ========================================================= */}
        {/* DEFAULT / ACTIVE NOTIFICATIONS LIST                       */}
        {/* ========================================================= */}
        {activeSpecimen !== 'empty' && activeSpecimen !== 'loading' && (
          <View>
            {/* Counts & Mark all as read row */}
            <View style={styles.statusActionRow}>
              <Text style={styles.notificationsCountText}>
                {totalCount} notifications · {unreadCount} unread
              </Text>

              {unreadCount > 0 && (
                <TouchableOpacity
                  style={styles.markReadButton}
                  onPress={handleMarkAllRead}
                  activeOpacity={0.7}
                >
                  <Text style={styles.markReadButtonText}>Mark all as read</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Success Banner if all marked as read */}
            {(showMarkedSuccess || (activeSpecimen === 'default' && unreadCount === 0 && showMarkedSuccess)) && (
              <Banner
                type="success"
                title="All marked as read"
                message="Your notifications are still here when you need them."
              />
            )}

            {/* Notification Cards */}
            {notifications.map((notif) => {
              const isUnread = notif.status === 'Unread';

              return (
                <View
                  key={notif.id}
                  style={[
                    styles.notificationCard,
                    isUnread
                      ? styles.notificationCardUnread
                      : styles.notificationCardRead,
                  ]}
                >
                  {/* Category Pill / Tag */}
                  <View style={styles.tagRow}>
                    {isUnread && <View style={styles.unreadDot} />}
                    <Text
                      style={[
                        styles.tagText,
                        isUnread ? styles.tagTextUnread : styles.tagTextRead,
                      ]}
                    >
                      {isUnread ? `Unread · ${notif.category}` : `Read · ${notif.category}`}
                    </Text>
                  </View>

                  {/* Notification Content */}
                  <Text style={styles.notificationTitle}>{notif.title}</Text>
                  <Text style={styles.notificationTime}>{notif.time}</Text>

                  {/* Action Button */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleNotificationAction(notif)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.actionBtnText}>{notif.actionLabel}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl + 20,
  },
  demoBar: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginVertical: spacing.md,
  },
  demoLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  demoScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  demoTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  demoTabText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textHeading,
  },
  demoTabTextActive: {
    color: colors.textWhite,
  },
  subnavBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  subnavLink: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  mainTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textHeading,
    marginTop: spacing.xs,
  },
  subText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  statusActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  notificationsCountText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  notificationsCountHeader: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  markReadButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderInput,
    backgroundColor: colors.surface,
  },
  markReadButtonText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textHeading,
  },
  notificationCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  notificationCardUnread: {
    backgroundColor: colors.primaryTint,
    borderColor: '#DDD6FE',
  },
  notificationCardRead: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  tagTextUnread: {
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
  tagTextRead: {
    color: colors.textMuted,
  },
  notificationTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textHeading,
    lineHeight: 21,
    marginBottom: 4,
  },
  notificationTime: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  actionBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  emptyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 4,
  },
  emptyInboxLine1: {
    width: 20,
    height: 2.5,
    backgroundColor: colors.textSubtle,
    borderRadius: 1,
  },
  emptyInboxLine2: {
    width: 14,
    height: 2.5,
    backgroundColor: colors.textSubtle,
    borderRadius: 1,
  },
  emptyInboxLine3: {
    width: 17,
    height: 2.5,
    backgroundColor: colors.textSubtle,
    borderRadius: 1,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textHeading,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyFooterNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  skeletonTag: {
    width: 100,
    height: 14,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: 8,
  },
  skeletonTitle: {
    width: '80%',
    height: 18,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: 8,
  },
  skeletonDate: {
    width: 140,
    height: 12,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  skeletonBtn: {
    width: 110,
    height: 32,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
  },
});
