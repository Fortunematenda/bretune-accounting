import React from 'react';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Card, Screen } from '../components/ui';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <Screen scroll>
      <Card title="Profile" subtitle="Your account information">
        <Text>Email: {user?.email || '—'}</Text>
        <Text>First Name: {user?.firstName || '—'}</Text>
        <Text>Last Name: {user?.lastName || '—'}</Text>
        <Text>Company: {user?.companyName || '—'}</Text>
        <Text>Role: {user?.role || '—'}</Text>
        <Text>User ID: {user?.id || '—'}</Text>
      </Card>
    </Screen>
  );
}
