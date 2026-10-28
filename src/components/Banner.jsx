import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function Banner({ type = 'error', title, message, style }) {
  if (!title && !message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';
  const isInfo = type === 'info';

  const containerStyle = [
    styles.banner,
    isError && styles.errorBanner,
    isSuccess && styles.successBanner,
    isInfo && styles.infoBanner,
    style,
  ];

  const iconStyle = [
    styles.iconCircle,
    isError && styles.errorIcon,
    isSuccess && styles.successIcon,
    isInfo && styles.infoIcon,
  ];

  const titleStyle = [
    styles.title,
    isError && styles.errorTitle,
    isSuccess && styles.successTitle,
    isInfo && styles.infoTitle,
  ];

  const messageStyle = [
    styles.message,
    isError && styles.errorMessage,
    isSuccess && styles.successMessage,
    isInfo && styles.infoMessage,
  ];

  const iconChar = isError ? '!' : isSuccess ? '✓' : 'ℹ';

  return (
    <View style={containerStyle}>
      <View style={iconStyle}>
        <Text style={styles.iconText}>{iconChar}</Text>
      </View>
      <View style={styles.content}>
        {title ? <Text style={titleStyle}>{title}</Text> : null}
        {message ? <Text style={messageStyle}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    backgroundColor: colors.errorBg,
    borderLeftColor: colors.errorBorder,
  },
  successBanner: {
    backgroundColor: colors.successBg,
    borderLeftColor: colors.successBorder,
  },
  infoBanner: {
    backgroundColor: colors.infoBg,
    borderLeftColor: colors.infoBorder,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 1,
  },
  errorIcon: {
    backgroundColor: colors.errorBorder,
  },
  successIcon: {
    backgroundColor: colors.successBorder,
  },
  infoIcon: {
    backgroundColor: colors.infoBorder,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 2,
  },
  errorTitle: {
    color: colors.errorText,
  },
  successTitle: {
    color: colors.successText,
  },
  infoTitle: {
    color: colors.infoText,
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  errorMessage: {
    color: colors.errorSubtext,
  },
  successMessage: {
    color: colors.successSubtext,
  },
  infoMessage: {
    color: colors.infoSubtext,
  },
});
