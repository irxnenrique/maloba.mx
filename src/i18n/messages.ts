import i18n from 'i18next';
import type caseStudySchema from './locales/es/caseStudy.json';
import type commonSchema from './locales/es/common.json';
import type contactSchema from './locales/es/contact.json';
import type heroSchema from './locales/es/hero.json';
import type notFoundSchema from './locales/es/notFound.json';
import type projectsSchema from './locales/es/projects.json';
import type servicesSchema from './locales/es/services.json';
import type studioSchema from './locales/es/studio.json';
import { languageFromPath } from '.';

type MessageLibrary<Schema extends Record<string, unknown>> = {
  namespace: string;
  schema: Schema;
};

function defineMessages<Schema extends Record<string, unknown>>(namespace: string) {
  return { namespace } as MessageLibrary<Schema>;
}

export const common = defineMessages<typeof commonSchema>('common');
export const hero = defineMessages<typeof heroSchema>('hero');
export const projects = defineMessages<typeof projectsSchema>('projects');
export const studio = defineMessages<typeof studioSchema>('studio');
export const services = defineMessages<typeof servicesSchema>('services');
export const contact = defineMessages<typeof contactSchema>('contact');
export const caseStudy = defineMessages<typeof caseStudySchema>('caseStudy');
export const notFound = defineMessages<typeof notFoundSchema>('notFound');

export function getSelectedLanguage() {
  return languageFromPath(window.location.pathname);
}

export default function m<
  Schema extends Record<string, unknown>,
  Key extends keyof Schema & string,
>(library: MessageLibrary<Schema>, key: Key, options: Record<string, unknown> = {}): Schema[Key] {
  const translate = i18n.t.bind(i18n) as unknown as (
    translationKey: string,
    translationOptions: Record<string, unknown>,
  ) => unknown;

  return translate(key, {
    ...options,
    lng: getSelectedLanguage(),
    ns: library.namespace,
    returnObjects: true,
  }) as Schema[Key];
}
