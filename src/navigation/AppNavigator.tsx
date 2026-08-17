/**
 * App Navigation Controller
 * PRD Checklist 2.3 & FR-3, FR-4:
 * - Implements conditional navigation based on auth state (protected routes)
 * - If user is null -> LoginStack (Auth)
 * - If user exists -> MainStack (Leads & CRM)
 * - If isLoading is true -> Shows LoadingSpinner during Keychain token initialization
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../features/auth/hooks/useAuth';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { LoadingSpinner, Button } from '../shared/components';

export type RootStackParamList = {
  Login: undefined;
  LeadsList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Placeholder Main Screen until Fase 3 (LeadsListScreen) is implemented.
 * Includes user profile summary and logout button to verify auth flow.
 */
const MainPlaceholderScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Halo, {user?.name || user?.email}!</Text>
        <Text style={styles.roleText}>Role: {user?.role || 'Sales Rep'}</Text>
        <Text style={styles.infoText}>
          Modul Leads (Fase 3–5) akan dimuat di sini.
        </Text>
        <Button
          title="Keluar (Logout)"
          variant="outline"
          onPress={logout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  // 1. Show loading indicator while reading token from secure storage (Keychain)
  if (isLoading) {
    return <LoadingSpinner message="Memuat sesi..." fullScreen />;
  }

  // 2. Conditional Protected Stack (FR-3 / Checklist 2.3)
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {user === null ? (
        // Auth Stack (Unauthenticated)
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        // Main App Stack (Authenticated)
        <Stack.Screen
          name="LeadsList"
          component={MainPlaceholderScreen}
          options={{
            headerShown: true,
            title: 'CRM Leads',
            headerBackVisible: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    width: '100%',
  },
});

export default AppNavigator;
