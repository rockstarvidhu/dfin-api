export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  USER_ADMIN: "USER_ADMIN",
  GUEST: "GUEST",
} as const;

export type RoleType = keyof typeof Role;

export const Status = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
};

export type StatusType = keyof typeof Status;

export type ValidRoles = RoleType[] & { _brand?: never };
