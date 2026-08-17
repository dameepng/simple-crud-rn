/**
 * Lead Card Component
 * PRD Checklist 3.3: Pure presentational component for a single Lead item in FlatList
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Lead } from '../../../types/Lead';
import { formatDate, getStatusBadgeStyle } from '../../../shared/utils';

export interface LeadCardProps {
  lead: Lead;
  onPress?: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onPress }) => {
  const statusStyle = getStatusBadgeStyle(lead.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(lead)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Lead ${lead.nama}, Status ${lead.status}`}
      testID={`lead-card-${lead.id}`}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name} numberOfLines={1}>
          {lead.nama}
        </Text>
        <View style={[styles.badge, statusStyle.badge]}>
          <Text style={[styles.badgeText, statusStyle.text]}>{lead.status}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {lead.email}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Telepon:</Text>
          <Text style={styles.infoValue}>{lead.telepon}</Text>
        </View>

        {lead.sumber ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sumber:</Text>
            <Text style={styles.sourceTag}>{lead.sumber}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.dateText}>Dibuat: {formatDate(lead.createdAt)}</Text>
        {lead.catatan ? (
          <Text style={styles.notesText} numberOfLines={1}>
            📝 {lead.catatan}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 10,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    width: 65,
  },
  infoValue: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  sourceTag: {
    fontSize: 12,
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  footerRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  notesText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    maxWidth: '55%',
  },
});

export default LeadCard;
