import { router, type Href } from 'expo-router';

import type { ActiveRole } from '@/store/useSessionStore';

/**
 * Customer and Trainer mode are the same account with role-aware navigation
 * (CLAUDE.md), not separate apps — these are the two landing routes each
 * mode is confined to.
 */
export const CUSTOMER_HOME_ROUTE = '/customer/home' as const;
export const TRAINER_HOME_ROUTE = '/trainer/trainer-home' as const;

/** `admin` has no dedicated home yet, so it falls back to the customer feed. */
export function getHomeRouteForRole(role: ActiveRole | undefined) {
  return role === 'trainer' ? TRAINER_HOME_ROUTE : CUSTOMER_HOME_ROUTE;
}

/**
 * Leaves Home as the only entry in the stack — use this to exit a multi-step
 * wizard (diet/workout intake) instead of `router.replace(homeRoute)`, which
 * only swaps the current screen and leaves every earlier wizard step
 * (each pushed on top of the last) buried underneath. Left in place, those
 * stale steps resurface the next time the user backs out of an unrelated
 * screen reached via `replace` (e.g. the Home/Me tab switch), landing them
 * on a random intake step instead of Home.
 *
 * `dismissAll` first pops back to the bottom of the stack — wherever that
 * is, since a first-time user can land in the wizard straight off the
 * post-login redirect, before Home was ever pushed — then `replace` makes
 * sure that bottom screen is actually Home.
 */
export function resetToHome(homeRoute: Href = CUSTOMER_HOME_ROUTE) {
  if (router.canDismiss()) router.dismissAll();
  router.replace(homeRoute);
}
