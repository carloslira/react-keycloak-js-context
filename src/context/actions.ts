import {
  type Action,
  type Keycloak,
} from './types';

/*
 * Update keycloak instance
 */
export const UPDATE_KEYCLOAK_INSTANCE = 'UPDATE_KEYCLOAK_INSTANCE';

type UpdateKeycloakInstanceAction = Action<typeof UPDATE_KEYCLOAK_INSTANCE> & {
  keycloak: Keycloak;
};

export const updateKeycloakInstance = (keycloak: Keycloak): UpdateKeycloakInstanceAction => ({
  type: UPDATE_KEYCLOAK_INSTANCE,
  keycloak,
});

/*
 * Update keycloak initialization
 */
export const UPDATE_KEYCLOAK_INITIALIZATION = 'UPDATE_KEYCLOAK_INITIALIZATION';

type UpdateKeycloakInitializationAction = Action<typeof UPDATE_KEYCLOAK_INITIALIZATION> & {
  isInitialized: boolean;
};

export const updateKeycloakInitialization = (isInitialized: boolean): UpdateKeycloakInitializationAction => ({
  type: UPDATE_KEYCLOAK_INITIALIZATION,
  isInitialized,
});

type KeycloakActions =
  | UpdateKeycloakInstanceAction
  | UpdateKeycloakInitializationAction;

export default KeycloakActions;
