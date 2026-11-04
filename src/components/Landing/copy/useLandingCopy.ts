import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { en, type LandingCopy } from './en';
import { ko } from './ko';

export type LandingLocale = 'en' | 'ko';

const COPY: Record<LandingLocale, LandingCopy> = { en, ko };

/**
 * Picks the landing copy for the current Docusaurus locale (same idea as the
 * STRINGS[locale] table on the /download page). Docusaurus builds each locale as a
 * separate static site, so the locale is known at SSR time and hydration matches.
 */
export function useLandingCopy(): { locale: LandingLocale; t: LandingCopy } {
  const { i18n } = useDocusaurusContext();
  const locale: LandingLocale = i18n.currentLocale === 'ko' ? 'ko' : 'en';
  return { locale, t: COPY[locale] };
}
