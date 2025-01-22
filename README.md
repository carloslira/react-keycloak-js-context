# react-keycloak-js-context

A React context provider for easy integration with Keycloak.js.

## Features

* **keycloak.js Wrapper:** Provides a convenient wrapper around the keycloak.js library.
* **Simple Context API Integration:** Easily access Keycloak instance and user information throughout your React application.
* **Customizable:** 
    * Configure Keycloak initialization options.
    * Enable/disable mocking for testing and development.
* **Token Expiration Handling:** 
    * Automatically refresh tokens before expiration if needed.
    * Option to configure token expiring notification time.
* **Event Handling:** 
    * Support for various Keycloak events (onReady, onAuthError, onAuthSuccess, etc.).
* **Hooks:** Provides a React Hook for accessing Keycloak state and performing actions:
    * `useKeycloak`: Accesses the Keycloak instance, user information, and other state.

## Installation

```bash
npm install react-keycloak-js-context
```

## Usage

### 1. Wrap your application with the `KeycloakProvider`

```ts
import { KeycloakProvider } from 'react-keycloak-js-context';

function App() {
  const keycloakConfig = {
    // Your Keycloak configuration here (e.g., 'realm', 'clientId', 'auth-server-url')
  };

  return (
    <KeycloakProvider config={keycloakConfig}>
      <YourApp /> 
    </KeycloakProvider>
  );
}
```

### 2. Use the `useKeycloak` hook to access Keycloak instance and login into your application

```ts
import { useEffect } from 'react';
import { useKeycloak } from 'react-keycloak-js-context';

function MyComponent() {
  const { keycloak, isInitialized } = useKeycloak();

  useEffect(() => {
    if (!isInitialized || keycloak?.authenticated) {
      return;
    }

    keycloak?.login(); // Go to the keycloak login
  }, [isInitialized, keycloak?.authenticated, keycloak?.login]);

  if (!isInitialized) {
    return <div>Initializing Keycloak...</div>;
  }

  if (!keycloak?.authenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <p>Welcome, {keycloak?.tokenParsed.name}!</p>
      {/* ... other components */}
    </div>
  );
}
```

### 3. Use the `useKeycloak` hook to access Keycloak instance and use the logged user info

```ts
import { useEffect } from 'react';
import { useKeycloak } from 'react-keycloak-js-context';

function MyComponent() {
  const { keycloak } = useKeycloak();

  return (
    <div>
      <p>Send the token: {keycloak?.token} to some request</p>
      {/* ... other components */}
    </div>
  );
}
```

## Mocking (for testing and development):

- Set the mocked prop in KeycloakProvider to true.
- Configure mockOptions to define mock behavior for Keycloak instance (e.g., token, authenticated).

## License

MIT
