"use client"

import { mockGroups, mockUser } from "./mockData";

const STORAGE_KEY = 'ante_social_joined_groups';
const LEFT_KEY = 'ante_social_left_groups'; // To handle leaving groups that were initially in mockData

export const getJoinedGroups = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  // 1. Get initial from mockGroups where user is a member
  const initialJoined = mockGroups
    .filter(g => g.members?.includes(mockUser.id))
    .map(g => g.id.toString());

  // 2. Get additions from localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  const storedJoined: string[] = stored ? JSON.parse(stored) : [];
  
  // 3. Get removals (groups the user has left)
  const leftStored = localStorage.getItem(LEFT_KEY);
  const leftGroups: string[] = leftStored ? JSON.parse(leftStored) : [];
  
  // Combine initial and stored, then remove left ones
  const combined = Array.from(new Set([...initialJoined, ...storedJoined]));
  return combined.filter(id => !leftGroups.includes(id));
};

export const joinGroup = (groupId: string | number) => {
  if (typeof window === 'undefined') return;
  const idStr = groupId.toString();
  
  // Remove from "left" list if it was there
  const leftStored = localStorage.getItem(LEFT_KEY);
  if (leftStored) {
    const leftGroups: string[] = JSON.parse(leftStored);
    if (leftGroups.includes(idStr)) {
      localStorage.setItem(LEFT_KEY, JSON.stringify(leftGroups.filter(id => id !== idStr)));
      return; // If it was in mockData, it's now back to "joined" status
    }
  }

  // Add to additions list
  const stored = localStorage.getItem(STORAGE_KEY);
  const storedJoined: string[] = stored ? JSON.parse(stored) : [];
  if (!storedJoined.includes(idStr)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...storedJoined, idStr]));
  }
};

export const leaveGroup = (groupId: string | number) => {
  if (typeof window === 'undefined') return;
  const idStr = groupId.toString();
  
  // 1. Remove from additions list if it was there
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const storedJoined: string[] = JSON.parse(stored);
    if (storedJoined.includes(idStr)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedJoined.filter(id => id !== idStr)));
    }
  }
  
  // 2. Add to "left" list to override mockData
  const leftStored = localStorage.getItem(LEFT_KEY);
  const leftGroups: string[] = leftStored ? JSON.parse(leftStored) : [];
  if (!leftGroups.includes(idStr)) {
    localStorage.setItem(LEFT_KEY, JSON.stringify([...leftGroups, idStr]));
  }
};

export const isGroupMember = (groupId: string | number): boolean => {
  if (typeof window === 'undefined') return false;
  return getJoinedGroups().includes(groupId.toString());
};
