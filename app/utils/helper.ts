import type { User } from "@auth0/auth0-react";

export function formatName(user: User | undefined) {
  if (!user) return "Unknown";
  if (user.family_name && user.given_name)
    return `${user.given_name}  ${user.family_name}`;
  return user.nickname;
}

export function generateMessageId() {
  return "gid-" + new Date().getTime()
}