import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  helperText,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            !editable && styles.disabledText,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>! {error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textHeading,
    marginBottom: spacing.xs + 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.md,
    minHeight: 46,
    paddingHorizontal: spacing.md,
  },
  multilineWrapper: {
    minHeight: 80,
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textHeading,
    paddingVertical: spacing.sm,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.errorBorder,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  disabledText: {
    color: colors.textBody,
  },
  toggleButton: {
    paddingLeft: spacing.sm,
  },
  toggleText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  errorText: {
    fontSize: 12,
    color: colors.errorBorder,
    marginTop: 4,
    fontFamily: fonts.medium,
  },
  helperText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
});
