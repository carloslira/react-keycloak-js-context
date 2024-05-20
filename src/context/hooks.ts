import {
  useContext,
} from 'react';

import {
  type Keycloak,
  type KeycloakUserInfo,
} from './types';

import KeycloakContext from './context';

export const useKeycloakContext = () => useContext(KeycloakContext);

export const useKeycloak = <T extends KeycloakUserInfo = KeycloakUserInfo>() => {
  const {
    state,
  } = useKeycloakContext();

  const { isMocked, keycloak, mockOptions } = state;
  if (isMocked && keycloak) {
    keycloak.login = () => Promise.resolve();
    keycloak.loadUserInfo = () => Promise.resolve(mockOptions?.userInfo ?? {});
    keycloak.loadUserProfile = () => Promise.resolve(mockOptions?.profile ?? {});

    keycloak.token = mockOptions?.token;
    keycloak.idToken = mockOptions?.idToken;
    keycloak.profile = mockOptions?.profile;
    keycloak.userInfo = mockOptions?.userInfo;
    keycloak.refreshToken = mockOptions?.refreshToken;
    keycloak.authenticated = mockOptions?.authenticated;
  }

  return {
    keycloak: keycloak as Keycloak<T> | undefined,
    isMocked: state.isMocked,
    isInitialized: state.isInitialized,
  };
};
