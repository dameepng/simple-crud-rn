/**
 * Formatting & Presentation Utilities
 * Shared formatting helpers for dates, badge styles, and text display (DRY principle)
 */
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LeadStatus } from '../../types/Lead';

/**
 * Format ISO date string into Indonesian locale format
 * @param dateString ISO Date string
 * @param includeTime Whether to append hour and minute
 */
export function formatDate(dateString?: string, includeTime: boolean = false): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    if (includeTime) {
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export interface StatusBadgeStyleResult {
  badge: ViewStyle;
  text: TextStyle;
}

const statusStyles = StyleSheet.create({
  badgeBaru: {
    backgroundColor: '#DBEAFE',
  },
  textBaru: {
    color: '#1D4ED8',
  },
  badgeDiproses: {
    backgroundColor: '#FEF3C7',
  },
  textDiproses: {
    color: '#B45309',
  },
  badgeClosed: {
    backgroundColor: '#D1FAE5',
  },
  textClosed: {
    color: '#047857',
  },
  badgeDefault: {
    backgroundColor: '#F3F4F6',
  },
  textDefault: {
    color: '#4B5563',
  },
});

/**
 * Retrieve consistent thematic badge colors for Lead status
 * @param status LeadStatus
 */
export function getStatusBadgeStyle(status: LeadStatus): StatusBadgeStyleResult {
  switch (status) {
    case 'Baru':
      return {
        badge: statusStyles.badgeBaru,
        text: statusStyles.textBaru,
      };
    case 'Diproses':
      return {
        badge: statusStyles.badgeDiproses,
        text: statusStyles.textDiproses,
      };
    case 'Closed':
      return {
        badge: statusStyles.badgeClosed,
        text: statusStyles.textClosed,
      };
    default:
      return {
        badge: statusStyles.badgeDefault,
        text: statusStyles.textDefault,
      };
  }
}
