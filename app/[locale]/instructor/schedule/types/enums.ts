// app/[locale]/instructor/schedule/types/enums.ts
// Enumy i stałe typu dla modułu harmonogramu

export type TabValue = 'kalendarz' | 'szablony' | 'wnioski' | 'statystyki'

export type ViewMode = 'dzień' | 'tydzień' | 'miesiąc'

export enum SlotStatusEnum {
  DOSTEPNY = 'dostępny',
  ZAREZERWOWANY = 'zarezerwowany',
  ZABLOKOWANY = 'zablokowany',
  ZAKONCZONY = 'zakończony',
  ANULOWANY = 'anulowany',
  NIEOBECNOSC = 'nieobecność',
  W_TRAKCIE = 'w_trakcie'
}

export enum LessonTypeEnum {
  JAZDA = 'jazda',
  PLAC = 'plac',
  TEORIA = 'teoria',
  EGZAMIN = 'egzamin'
}

export enum LocationTypeEnum {
  PLAC = 'plac',
  MIASTO = 'miasto',
  TRASA = 'trasa'
}

export enum PaymentStatusEnum {
  OPLACONY = 'opłacony',
  NIEOPLACONY = 'nieopłacony',
  CZESCIOWO = 'częściowo'
}

export enum PaymentMethodEnum {
  GOTOWKA = 'gotówka',
  PRZELEW = 'przelew',
  KARTA = 'karta'
}

export enum ExceptionTypeEnum {
  URLOP = 'urlop',
  CHOROBA = 'choroba',
  SWIETO = 'święto',
  SZKOLENIE = 'szkolenie',
  INNE = 'inne'
}

export enum CancellationStatusEnum {
  OCZEKUJACY = 'oczekujący',
  ZATWIERDZONY = 'zatwierdzony',
  ODRZUCONY = 'odrzucony'
}

export enum PackageTypeEnum {
  PODSTAWOWY = 'podstawowy',
  ROZSZERZONY = 'rozszerzony',
  PREMIUM = 'premium'
}

export enum RecurringPatternEnum {
  ROCZNIE = 'rocznie',
  MIESIECZNE = 'miesięcznie',
  TYGODNIOWO = 'tygodniowo',
  CODZIENNIE = 'codziennie'
}

export enum WeekDayEnum {
  PONIEDZIALEK = 'poniedziałek',
  WTOREK = 'wtorek',
  SRODA = 'środa',
  CZWARTEK = 'czwartek',
  PIATEK = 'piątek',
  SOBOTA = 'sobota',
  NIEDZIELA = 'niedziela'
}

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc'
}

export enum FilterOperatorEnum {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  IN = 'in',
  NOT_IN = 'not_in'
}

// Kolory dla statusów
export const STATUS_COLORS = {
  [SlotStatusEnum.DOSTEPNY]: 'green',
  [SlotStatusEnum.ZAREZERWOWANY]: 'blue',
  [SlotStatusEnum.ZABLOKOWANY]: 'gray',
  [SlotStatusEnum.ZAKONCZONY]: 'purple',
  [SlotStatusEnum.ANULOWANY]: 'red',
  [SlotStatusEnum.NIEOBECNOSC]: 'orange',
  [SlotStatusEnum.W_TRAKCIE]: 'yellow'
} as const

// Ikony dla typów zajęć
export const LESSON_TYPE_ICONS = {
  [LessonTypeEnum.JAZDA]: 'Car',
  [LessonTypeEnum.PLAC]: 'MapPin',
  [LessonTypeEnum.TEORIA]: 'BookOpen',
  [LessonTypeEnum.EGZAMIN]: 'Award'
} as const

// Priorytety dla typów wyjątków
export const EXCEPTION_PRIORITY = {
  [ExceptionTypeEnum.SWIETO]: 1,
  [ExceptionTypeEnum.URLOP]: 2,
  [ExceptionTypeEnum.CHOROBA]: 3,
  [ExceptionTypeEnum.SZKOLENIE]: 4,
  [ExceptionTypeEnum.INNE]: 5
} as const