import type { Dispatch } from 'react';

import type { KeycloakProfile, KeycloakInitOptions } from 'keycloak-js';
import type KeycloakJS from 'keycloak-js';

import type KeycloakActions from './actions';

export type Action<T> = {
  type: T;
};

export type KeycloakUserInfo<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  sub?: string;
  name?: string;
  email?: string;
  locale?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  preferred_username?: string;
};

export type Keycloak<
  T extends Record<string, unknown> = Record<string, unknown>,
> = Omit<KeycloakJS, 'userInfo' | 'loadUserInfo'> & {
  userInfo?: KeycloakUserInfo<T>;
  loadUserInfo: () => Promise<KeycloakUserInfo<T>>;
};

export type KeycloakMockOptions = {
  token?: string;
  idToken?: string;
  profile?: KeycloakProfile;
  userInfo?: KeycloakUserInfo;
  refreshToken?: string;
  authenticated?: boolean;
};

export type KeycloakCustomInitOptions = KeycloakInitOptions & {
  loadUserInfo?: boolean;
  loadUserProfile?: boolean;
};

export type KeycloakState = {
  keycloak?: Keycloak;
  isMocked: boolean;
  mockOptions?: KeycloakMockOptions;
  initOptions: KeycloakInitOptions;
  isInitialized: boolean;
};

export type KeycloakContextValue = {
  state: KeycloakState;
  dispatch: Dispatch<KeycloakActions>;
};
