import React from 'react';
import { AuthProvider } from '../src/shared/contexts/AuthContext';
import { AppNavigator } from '../src/navigation/AppNavigator';

export default function Index() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
