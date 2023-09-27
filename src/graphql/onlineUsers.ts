import { UserDocument } from '../models/User';

export const onlineUsers: UserDocument[] = [];

export const getOnlineUsers = (): UserDocument[] => onlineUsers;

export const addOnlineUser = (user: UserDocument) => {
  if (!user) return;
  const index = onlineUsers.findIndex((u) => u.id === user.id);
  if (index === -1) {
    onlineUsers.push(user);
  } else {
    onlineUsers[index] = user;
  }
};

export const removeOnlineUser = (user: UserDocument) => {
  if (!user) return;
  const index = onlineUsers.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    onlineUsers.splice(index, 1);
  }
};
