import Constants from 'expo-constants';
import { Platform } from 'react-native';

const localhost =
  Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';

const ENV = {
  dev: {
    apiUrl: localhost,
    amplitudeApiKey: null,
  },
  staging: {
    apiUrl: '',
    amplitudeApiKey: null,
    // Add other keys you want here
  },
  prod: {
    apiUrl: '',
    amplitudeApiKey: null,
    // Add other keys you want here
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
};

export default getEnvVars;
