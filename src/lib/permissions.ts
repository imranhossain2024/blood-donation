import type { Role } from "@prisma/client";

export const roleWeight: Record<Role, number> = {
  USER: 1,
  DONOR: 2,
  AGENT: 2,
  ADMIN: 3,
};

export function hasRole(userRole: Role, required: Role) {
  return roleWeight[userRole] >= roleWeight[required];
}
