export type TransitionMap<TStatus extends string> = Partial<Record<TStatus, TStatus[]>>;

export function getAllowedTransitions<TStatus extends string>(
  map: TransitionMap<TStatus>,
  currentStatus: TStatus,
): TStatus[] {
  return map[currentStatus] ?? [];
}

export function isDeletableStatus<TStatus extends string>(
  deletableStatuses: readonly TStatus[],
  currentStatus: TStatus,
): boolean {
  return deletableStatuses.includes(currentStatus);
}
