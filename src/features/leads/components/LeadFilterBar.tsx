/**
 * Lead Filter Bar Component
 * PRD Checklist 3.4 & Section 7: Filter chips for selecting Lead status
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StatusFilterOption } from '../hooks/useLeads';

export interface LeadFilterBarProps {
  selectedStatus: StatusFilterOption;
  onSelectStatus: (status: StatusFilterOption) => void;
  statusCounts?: {
    Semua?: number;
    Baru?: number;
    Diproses?: number;
    Closed?: number;
  };
}

const FILTER_OPTIONS: StatusFilterOption[] = ['Semua', 'Baru', 'Diproses', 'Closed'];

export const LeadFilterBar: React.FC<LeadFilterBarProps> = ({
  selectedStatus,
  onSelectStatus,
  statusCounts,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTER_OPTIONS.map((status) => {
          const isSelected = selectedStatus === status;
          const count = statusCounts ? statusCounts[status] : undefined;

          return (
            <TouchableOpacity
              key={status}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectStatus(status)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              testID={`filter-chip-${status}`}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {status}
              </Text>
              {typeof count === 'number' && (
                <View
                  style={[
                    styles.countBadge,
                    isSelected && styles.countBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected && styles.countTextSelected,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  countTextSelected: {
    color: '#FFFFFF',
  },
});

export default LeadFilterBar;
