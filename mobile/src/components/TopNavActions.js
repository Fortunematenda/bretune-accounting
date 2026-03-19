import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function TopNavActions() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  function openNotifications() {
    navigation.navigate('Notifications');
  }

  function openProfile() {
    navigation.navigate('Profile');
  }

  function openSettings() {
    setOpen(false);
    navigation.navigate('Settings');
  }

  async function handleLogout() {
    setOpen(false);
    await logout();
  }

  return (
    <>
      <View style={styles.actionsRow}>
        <Pressable onPress={openNotifications} style={styles.trigger}>
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
        </Pressable>
        <Pressable onPress={openProfile} style={styles.trigger}>
          <Ionicons name="person-circle-outline" size={22} color={colors.text} />
        </Pressable>
        <Pressable onPress={() => setOpen(true)} style={styles.trigger}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </Pressable>
      </View>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Pressable style={styles.item} onPress={openSettings}>
              <Ionicons name="settings-outline" size={18} color={colors.text} />
              <Text style={styles.itemText}>Settings</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={colors.danger} />
              <Text style={[styles.itemText, { color: colors.danger }]}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trigger: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.18)',
    alignItems: 'flex-end',
    paddingTop: 88,
    paddingRight: 18,
    zIndex: 999,
  },
  menu: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});
