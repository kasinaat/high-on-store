export const ROLES = {
  superAdmin: "super_admin",
  outletAdmin: "outlet_admin",
  deliveryAgent: "delivery_agent",
  customer: "customer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const privilegedRoles: Role[] = [
  ROLES.superAdmin,
  ROLES.outletAdmin,
];
