/**
 * App Navigation Controller
 * PRD Checklist 2.3 & FR-3, FR-4:
 * - Implements conditional navigation based on auth state (protected routes)
 * - If user is null -> LoginStack (Auth)
 * - If user exists -> MainStack (Leads & CRM)
 * - If isLoading is true -> Shows LoadingSpinner during Keychain token initialization
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../features/auth/hooks/useAuth';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { LeadsListScreen } from '../features/leads/screens/LeadsListScreen';
import { LoadingSpinner } from '../shared/components';

export type RootStackParamList = {
  Login: undefined;
  LeadsList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  // 1. Show loading indicator while reading token from secure storage (Keychain)
  if (isLoading) {
    return <LoadingSpinner message="Memuat sesi..." fullScreen />;
  }

  // 2. Conditional Protected Stack (FR-3 / Checklist 2.3 & 3.4)
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
          component={LeadsListScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
