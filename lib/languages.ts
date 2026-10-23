export type { LanguageCode } from './types';

export type IndianLanguage = {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  dir: 'ltr' | 'rtl';
  popular?: boolean;
};

export const SUPPORTED_LANGUAGES: IndianLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', dir: 'ltr', popular: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', dir: 'ltr', popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', dir: 'ltr', popular: true },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese', dir: 'ltr' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', dir: 'ltr', popular: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', dir: 'ltr', popular: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Nastaliq / Arabic', dir: 'rtl', popular: true },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', dir: 'ltr' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', dir: 'ltr' },
];

export const LANGUAGE_MAP = new Map<string, IndianLanguage>(
  SUPPORTED_LANGUAGES.map((lang) => [lang.code, lang])
);

export function getLanguage(code: string): IndianLanguage {
  return LANGUAGE_MAP.get(code) || SUPPORTED_LANGUAGES[0];
}

export function isRTL(code: string): boolean {
  return getLanguage(code).dir === 'rtl';
}
