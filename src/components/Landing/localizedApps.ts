import { APP_EXAMPLES, type AppExample } from './appsData';
import { APP_EXAMPLES_KO } from './appsData.ko';

const KO_APPS: AppExample[] = APP_EXAMPLES.map((app) => ({ ...app, ...APP_EXAMPLES_KO[app.id] }));

/** The 21 examples in the given locale. English returns appsData.ts untouched. */
export function getAppExamples(locale: 'en' | 'ko'): AppExample[] {
  return locale === 'ko' ? KO_APPS : APP_EXAMPLES;
}
