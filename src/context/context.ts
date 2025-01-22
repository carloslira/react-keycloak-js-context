import { createContext } from 'react';

import type { KeycloakContextValue } from './types';

const KeycloakContext = createContext({} as KeycloakContextValue);

export default KeycloakContext;
