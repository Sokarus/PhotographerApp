import 'i18next';

import enTranslation from './en/translation.json';
import ruTranslation from './ru/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      en: typeof enTranslation;
      ru: typeof ruTranslation;
    };
  }
}
