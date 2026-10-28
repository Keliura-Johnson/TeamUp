import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function Checkbox({
  checked = false,
  onChange,
  label,
  sublabel,
  style,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => !disabled && onChange && onChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.textContainer}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs + 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    lineHeight: 20,
  },
  sublabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
