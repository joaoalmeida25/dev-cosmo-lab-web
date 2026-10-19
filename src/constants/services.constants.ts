export const SERVICE_IDS = ['sites', 'applications', 'commerce', 'maintenance'] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];
