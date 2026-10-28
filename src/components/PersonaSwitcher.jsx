import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius, spacing } from '../constants/theme';

export default function PersonaSwitcher({ style }) {
  const { activePersona, setActivePersona } = useApp();

  const personas = [
    { key: 'Ada', label: 'Ada (Owner)', role: 'Owner / Product Manager' },
    { key: 'David', label: 'David (Member)', role: 'UI/UX Designer' },
    { key: 'John', label: 'John (Member)', role: 'Frontend Developer' },
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>VIEW AS:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {personas.map((p) => {
          const isActive = String(activePersona).toLowerCase() === p.key.toLowerCase();
          return (
            <TouchableOpacity
              key={p.key}
              style={[styles.personaButton, isActive && styles.personaButtonActive]}
              onPress={() => setActivePersona(p.key)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Switch persona to ${p.label}`}
            >
              <Text
                style={[
                  styles.personaButtonText,
                  isActive && styles.personaButtonTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 7,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 90,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: '#64748B',
    letterSpacing: 0.8,
    marginRight: 8,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  personaButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.full || 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  personaButtonActive: {
    backgroundColor: colors.primary || '#6336E4',
    borderColor: colors.primary || '#6336E4',
  },
  personaButtonText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: '#475569',
  },
  personaButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
  },
});
