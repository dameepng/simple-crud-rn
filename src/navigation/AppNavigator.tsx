/**
 * App Navigation Controller
 * PRD Checklist 2.3 & FR-3, FR-4, Checklist 4.3:
 * - Implements conditional navigation based on auth state (protected routes)
 * - If user is null -> LoginStack (Auth)
 * - If user exists -> MainStack (LeadsList, LeadForm)
 * - If isLoading is true -> Shows LoadingSpinner during Keychain token initialization
 */
import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../features/auth/hooks/useAuth';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { LeadsListScreen } from '../features/leads/screens/LeadsListScreen';
import { LeadFormScreen } from '../features/leads/screens/LeadFormScreen';
import { LoadingSpinner } from '../shared/components';
import { Lead } from '../types/Lead';

export type RootStackParamList = {
  Login: undefined;
  LeadsList: undefined;
  LeadForm: {
    mode: 'create' | 'edit';
    lead?: Lead;
  };
};

export type LeadsListNavProps = NativeStackScreenProps<RootStackParamList, 'LeadsList'>;
export type LeadFormNavProps = NativeStackScreenProps<RootStackParamList, 'LeadForm'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  // 1. Show loading indicator while reading token from secure storage (Keychain)
  if (isLoading) {
    return <LoadingSpinner message="Memuat sesi..." fullScreen />;
  }

  // 2. Conditional Protected Stack (FR-3 / Checklist 2.3, 3.4, 4.3)
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
        <>
          <Stack.Screen
            name="LeadsList"
            options={{
              headerShown: false,
            }}
          >
            {(props: LeadsListNavProps) => (
              <LeadsListScreen
                onAddNewLead={() =>
                  props.navigation.navigate('LeadForm', { mode: 'create' })
                }
                onSelectLead={(lead) =>
                  props.navigation.navigate('LeadForm', { mode: 'edit', lead })
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="LeadForm"
            options={{
              headerShown: false,
            }}
          >
            {(props: LeadFormNavProps) => (
              <LeadFormScreen
                mode={props.route.params?.mode || 'create'}
                lead={props.route.params?.lead}
                onSuccess={() => props.navigation.goBack()}
                onBack={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
