import type { Reducer } from 'react';

import type { KeycloakState } from './types';

import type KeycloakActions from './actions';
import * as KeycloakActionTypes from './actions';

const keycloakReducer: Reducer<KeycloakState, KeycloakActions> = (
  state,
  action,
) => {
  switch (action.type) {
    // Update keycloak instance
    case KeycloakActionTypes.UPDATE_KEYCLOAK_INSTANCE:
      return {
        ...state,
        keycloak: action.keycloak,
      };

    // Update keycloak initialization
    case KeycloakActionTypes.UPDATE_KEYCLOAK_INITIALIZATION:
      return {
        ...state,
        isInitialized: action.isInitialized,
      };

    default:
      return state;
  }
};

export default keycloakReducer;
