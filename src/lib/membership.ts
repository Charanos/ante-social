"use client"

const STORAGE_KEY = 'ante_social_joined_groups';
const LEGACY_LEFT_KEY = 'ante_social_left_groups';

export const getJoinedGroups = (): string[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  const joined: string[] = stored ? JSON.parse(stored) : [];
  return joined.filter(Boolean);
};

export const joinGroup = (groupId: string | number) => {
  if (typeof window === 'undefined') return;
  const idStr = groupId.toString();

  const stored = localStorage.getItem(STORAGE_KEY);
  const storedJoined: string[] = stored ? JSON.parse(stored) : [];
  if (!storedJoined.includes(idStr)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...storedJoined, idStr]));
  }

  // Cleanup old migration key if it exists.
  const legacy = localStorage.getItem(LEGACY_LEFT_KEY);
  if (legacy) {
    const left: string[] = JSON.parse(legacy);
    localStorage.setItem(LEGACY_LEFT_KEY, JSON.stringify(left.filter((id) => id !== idStr)));
  }
};

export const leaveGroup = (groupId: string | number) => {
  if (typeof window === 'undefined') return;
  const idStr = groupId.toString();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const storedJoined: string[] = JSON.parse(stored);
    if (storedJoined.includes(idStr)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedJoined.filter(id => id !== idStr)));
    }
  }
};

export const isGroupMember = (groupId: string | number): boolean => {
  if (typeof window === 'undefined') return false;
  return getJoinedGroups().includes(groupId.toString());
};
