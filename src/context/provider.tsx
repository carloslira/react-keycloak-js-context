import {
  type PropsWithChildren,
  useRef,
  useMemo,
  useEffect,
  useReducer,
} from 'react';

import Keycloak from 'keycloak-js';

import {
  type KeycloakConfig,
  type KeycloakInitOptions,
} from 'keycloak-js';

import logger from '../logger';

import {
  type KeycloakMockOptions,
  type KeycloakContextValue,
  type KeycloakCustomInitOptions,
} from './types';

import {
  updateKeycloakInstance,
  updateKeycloakInitialization,
} from './actions';

import KeycloakContext from './context';
import keycloakReducer from './reducer';

const defaultTokenExpiringNotificationTime = 10;

const defaultInitOptions: KeycloakInitOptions = {
  onLoad: 'check-sso',
};

export type KeycloakProviderProps = PropsWithChildren<{
  config: KeycloakConfig | string;
  mocked?: boolean;
  mockOptions?: KeycloakMockOptions;
  initOptions?: KeycloakCustomInitOptions;
  autoRefreshToken?: boolean;
  tokenExpiringNotificationTime?: number;
  onReady?: Keycloak['onReady'];
  onInitError?: (reason: unknown) => void;
  onAuthError?: Keycloak['onAuthError'];
  onAuthLogout?: Keycloak['onAuthLogout'];
  onAuthSuccess?: (keycloak?: Keycloak) => void;
  onActionUpdate?: Keycloak['onActionUpdate'];
  onTokenExpired?: Keycloak['onTokenExpired'];
  onTokenExpiring?: () => void;
  onAuthRefreshError?: Keycloak['onAuthRefreshError'];
  onAuthRefreshSuccess?: (keycloak?: Keycloak) => void;
}>;

const KeycloakProvider = ({
  config,
  mocked = false,
  children,
  mockOptions,
  initOptions = defaultInitOptions,
  autoRefreshToken = true,
  tokenExpiringNotificationTime = defaultTokenExpiringNotificationTime,
  onReady,
  onInitError,
  onAuthError,
  onAuthLogout,
  onAuthSuccess,
  onActionUpdate,
  onTokenExpired,
  onTokenExpiring,
  onAuthRefreshError,
  onAuthRefreshSuccess,
}: KeycloakProviderProps) => {
  const tokeExpiringTimeoutRef = useRef<number>();

  const [state, dispatch] = useReducer(keycloakReducer, {
    isMocked: mocked,
    mockOptions,
    initOptions,
    isInitialized: false,
  });

  const updateInstance = () => {
    const { isMocked, keycloak } = state;
    if (keycloak) {
      const promises = [];
      if (!isMocked) {
        if (initOptions.loadUserInfo && !keycloak.userInfo) {
          promises.push(keycloak.loadUserInfo());
        }

        if (initOptions.loadUserProfile && !keycloak.profile) {
          promises.push(keycloak.loadUserProfile());
        }
      }

      Promise.all(promises).finally(() => {
        dispatch(
          updateKeycloakInstance(keycloak),
        );
      });
    }
  };

  const handleTokenExpiring = () => {
    logger.debug('Token is about to expire');

    const { keycloak } = state;
    if (autoRefreshToken) {
      logger.debug('Auto refreshing token...');
      keycloak?.updateToken(tokenExpiringNotificationTime).then(() => {
        logger.debug('Token was updated');
      }).catch(() => {
        logger.error('Fail to update token');
      });
    }

    onTokenExpiring?.();
  };

  const startTokenExpiringMonitor = () => {
    logger.debug('Starting to monitor if the token is about to expire');

    if (tokeExpiringTimeoutRef.current) {
      clearTimeout(tokeExpiringTimeoutRef.current);
    }

    const { keycloak } = state;
    if (keycloak) {
      const expiresIn = ((keycloak.tokenParsed?.exp ?? 0) - (new Date().getTime() / 1000) + (keycloak.timeSkew ?? 0)) * 1000;
      logger.debug(`Token expiring in ${Math.trunc(expiresIn / 1000)} seconds`);
      if (expiresIn <= tokenExpiringNotificationTime * 1000) {
        handleTokenExpiring();
      } else {
        tokeExpiringTimeoutRef.current = setTimeout(handleTokenExpiring, expiresIn - (tokenExpiringNotificationTime * 1000));
      }
    }
  };

  const handleReady: Keycloak['onReady'] = (authenticated) => {
    logger.debug('Keycloak instance is ready');

    const { keycloak } = state;
    if (keycloak) {
      dispatch(
        updateKeycloakInitialization(true),
      );
    }

    onReady?.(authenticated);
  };

  const handleAuthError: Keycloak['onAuthError'] = (errorData) => {
    logger.debug('Keycloak instance raised a auth error event');

    updateInstance();
    onAuthError?.(errorData);
  };

  const handleAuthLogout: Keycloak['onAuthLogout'] = () => {
    logger.debug('Keycloak instance raised a auth logout event');

    updateInstance();
    onAuthLogout?.();
  };

  const handleAuthSuccess: Keycloak['onAuthSuccess'] = () => {
    logger.debug('Keycloak instance raised a auth success event');

    startTokenExpiringMonitor();
    updateInstance();
    onAuthSuccess?.(state.keycloak);
  };

  const handleActionUpdate: Keycloak['onActionUpdate'] = (status) => {
    logger.debug('Keycloak instance raised an action update event: ', status);

    updateInstance();
    onActionUpdate?.(status);
  };

  const handleTokenExpired: Keycloak['onTokenExpired'] = () => {
    logger.debug('Keycloak instance raised an token expired event');

    updateInstance();
    onTokenExpired?.();
  };

  const handleAuthRefreshError: Keycloak['onAuthRefreshError'] = () => {
    logger.debug('Keycloak instance raised a auth refresh error event');

    updateInstance();
    onAuthRefreshError?.();
  };

  const handleAuthRefreshSuccess: Keycloak['onAuthRefreshSuccess'] = () => {
    logger.debug('Keycloak instance raised a auth refresh success event');

    startTokenExpiringMonitor();
    updateInstance();
    onAuthRefreshSuccess?.(state.keycloak);
  };

  useEffect(() => {
    const { isMocked, isInitialized } = state;
    if (isInitialized) {
      return;
    }

    if (isMocked) {
      dispatch(
        updateKeycloakInstance(new Keycloak()),
      );
    } else {
      dispatch(
        updateKeycloakInstance(new Keycloak(config)),
      );
    }
  }, [config]);

  useEffect(() => {
    const { keycloak, isMocked, isInitialized } = state;
    if (!keycloak || isInitialized) {
      return;
    }

    if (isMocked) {
      dispatch(
        updateKeycloakInitialization(true),
      );

      return;
    }

    keycloak.onReady = handleReady;
    keycloak.onAuthError = handleAuthError;
    keycloak.onAuthLogout = handleAuthLogout;
    keycloak.onAuthSuccess = handleAuthSuccess;
    keycloak.onActionUpdate = handleActionUpdate;
    keycloak.onTokenExpired = handleTokenExpired;
    keycloak.onAuthRefreshError = handleAuthRefreshError;
    keycloak.onAuthRefreshSuccess = handleAuthRefreshSuccess;

    keycloak
      .init(initOptions)
      .catch(onInitError);
  }, [state.keycloak]);

  const value = useMemo<KeycloakContextValue>(() => ({
    state,
    dispatch,
  }), [state, dispatch]);

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
};

export default KeycloakProvider;
