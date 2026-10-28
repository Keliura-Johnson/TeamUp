import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'outline' | 'link'
  loading = false,
  loadingText,
  disabled = false,
  style,
  textStyle,
}) {
  const isOutline = variant === 'outline';
  const isLink = variant === 'link';

  if (isLink) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.linkContainer, style]}
        activeOpacity={0.7}
      >
        <Text style={[styles.linkText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        isOutline ? styles.outlineButton : styles.primaryButton,
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator
            size="small"
            color={isOutline ? colors.primary : colors.textWhite}
            style={styles.spinner}
          />
          <Text
            style={[
              styles.buttonText,
              isOutline ? styles.outlineButtonText : styles.primaryButtonText,
              textStyle,
            ]}
          >
            {loadingText || 'Please wait...'}
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.buttonText,
            isOutline ? styles.outlineButtonText : styles.primaryButtonText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  primaryButtonText: {
    color: colors.textWhite,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: spacing.sm,
  },
  linkContainer: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.medium,
    textDecorationLine: 'underline',
  },
});
