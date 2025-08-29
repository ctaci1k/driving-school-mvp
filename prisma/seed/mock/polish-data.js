// prisma/seed/mock/polish-data.js

const polishNames = {
  male: {
    first: [
      'Piotr', 'Krzysztof', 'Andrzej', 'Tomasz', 'Paweł', 'Jan', 'Michał',
      'Marcin', 'Stanisław', 'Marek', 'Grzegorz', 'Józef', 'Łukasz', 'Adam',
      'Zbigniew', 'Jerzy', 'Tadeusz', 'Mateusz', 'Dariusz', 'Mariusz',
      'Wojciech', 'Ryszard', 'Jakub', 'Henryk', 'Robert', 'Rafał', 'Kazimierz',
      'Maciej', 'Kamil', 'Janusz', 'Marian', 'Mirosław', 'Sławomir', 'Jarosław'
    ],
    last: [
      'Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński',
      'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski',
      'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski', 'Wojciechowski',
      'Krawczyk', 'Kaczmarek', 'Piotrowski', 'Grabowski', 'Pawłowski',
      'Michalski', 'Król', 'Zając', 'Wieczorek', 'Jabłoński', 'Wróbel',
      'Nowakowski', 'Majewski', 'Olszewski', 'Stępień', 'Malinowski',
      'Jaworski', 'Adamczyk', 'Dudek', 'Nowicki', 'Pawlak', 'Górski', 'Witkowski'
    ]
  },
  female: {
    first: [
      'Anna', 'Maria', 'Katarzyna', 'Małgorzata', 'Agnieszka', 'Barbara',
      'Ewa', 'Krystyna', 'Elżbieta', 'Magdalena', 'Joanna', 'Zofia',
      'Teresa', 'Jadwiga', 'Janina', 'Monika', 'Danuta', 'Halina', 'Irena',
      'Dorota', 'Beata', 'Marta', 'Helena', 'Grażyna', 'Stanisława',
      'Jolanta', 'Marianna', 'Urszula', 'Wanda', 'Alicja', 'Bożena',
      'Renata', 'Iwona', 'Justyna', 'Aleksandra', 'Sylwia', 'Paulina',
      'Karolina', 'Edyta', 'Natalia', 'Weronika', 'Aneta', 'Izabela'
    ],
    last: [
      'Nowak', 'Kowalska', 'Wiśniewska', 'Wójcik', 'Kowalczyk', 'Kamińska',
      'Lewandowska', 'Zielińska', 'Szymańska', 'Woźniak', 'Dąbrowska',
      'Kozłowska', 'Jankowska', 'Mazur', 'Kwiatkowska', 'Wojciechowska',
      'Krawczyk', 'Kaczmarek', 'Piotrowska', 'Grabowska', 'Pawłowska',
      'Michalska', 'Król', 'Zając', 'Wieczorek', 'Jabłońska', 'Wróbel',
      'Nowakowska', 'Majewska', 'Olszewska', 'Stępień', 'Malinowska',
      'Jaworska', 'Adamczyk', 'Dudek', 'Nowicka', 'Pawlak', 'Górska', 'Witkowska'
    ]
  }
};

const warsawStreets = [
  'ul. Marszałkowska', 'ul. Puławska', 'ul. Nowy Świat', 'al. Jerozolimskie',
  'ul. Krakowskie Przedmieście', 'ul. Świętokrzyska', 'ul. Chmielna',
  'ul. Złota', 'ul. Emilii Plater', 'ul. Hoża', 'ul. Krucza', 'ul. Piękna',
  'ul. Wilcza', 'ul. Poznańska', 'ul. Lwowska', 'ul. Mokotowska',
  'al. Jana Pawła II', 'ul. Grójecka', 'ul. Żwirki i Wigury', 'ul. Targowa',
  'ul. Ząbkowska', 'ul. Wybrzeże Gdyńskie', 'ul. Modlińska', 'ul. Grochowska',
  'ul. Ostrobramska', 'ul. Waszyngtona', 'al. Niepodległości', 'ul. Belwederska',
  'ul. Sobieskiego', 'ul. Wilanowska', 'ul. Czerniakowska', 'ul. Gagarina',
  'ul. Rzymowskiego', 'al. KEN', 'ul. Stryjeńskich', 'ul. Ciszewskiego',
  'ul. Kłobucka', 'ul. Wołoska', 'ul. Racławicka', 'ul. Batorego',
  'ul. Rakowiecka', 'ul. Filtrowa', 'ul. Towarowa', 'ul. Prosta',
  'ul. Żelazna', 'ul. Chłodna', 'ul. Ogrodowa', 'ul. Solidarności',
  'ul. Okopowa', 'ul. Anielewicza', 'ul. Stawki', 'ul. Inflancka'
];

const warsawDistricts = [
  { name: 'Śródmieście', code: '00', postalPrefix: '00' },
  { name: 'Mokotów', code: '02', postalPrefix: '02' },
  { name: 'Ochota', code: '02', postalPrefix: '02' },
  { name: 'Wola', code: '01', postalPrefix: '01' },
  { name: 'Praga-Południe', code: '04', postalPrefix: '04' },
  { name: 'Praga-Północ', code: '03', postalPrefix: '03' },
  { name: 'Ursynów', code: '02', postalPrefix: '02' },
  { name: 'Bielany', code: '01', postalPrefix: '01' },
  { name: 'Targówek', code: '03', postalPrefix: '03' },
  { name: 'Bemowo', code: '01', postalPrefix: '01' },
  { name: 'Białołęka', code: '03', postalPrefix: '03' },
  { name: 'Wilanów', code: '02', postalPrefix: '02' },
  { name: 'Włochy', code: '02', postalPrefix: '02' },
  { name: 'Wawer', code: '04', postalPrefix: '04' },
  { name: 'Wesoła', code: '05', postalPrefix: '05' },
  { name: 'Żoliborz', code: '01', postalPrefix: '01' },
  { name: 'Ursus', code: '02', postalPrefix: '02' },
  { name: 'Rembertów', code: '04', postalPrefix: '04' }
];

const polishCompanyData = {
  names: [
    'Auto Szkoła Premium',
    'Nauka Jazdy Express',
    'Driving Academy Warszawa',
    'Szkoła Kierowców Professional',
    'AutoMaster Szkoła Jazdy'
  ],
  
  nip: [
    '5213641123',
    '7742904432',
    '9512307844',
    '5252525811',
    '1132476590'
  ],
  
  regon: [
    '142765420',
    '147852369',
    '369852147',
    '258147369',
    '741852963'
  ],
  
  bankAccounts: [
    'PL61 1090 2590 0000 0001 3356 7890',
    'PL27 1140 2004 0000 3002 0135 5387',
    'PL60 1020 3041 0000 8902 0123 4567',
    'PL83 1240 5918 0000 4500 7823 1234',
    'PL12 1050 1025 1000 0090 3017 8953'
  ]
};

const lessonTopics = {
  theory: [
    'Przepisy ruchu drogowego - znaki drogowe',
    'Pierwszeństwo przejazdu',
    'Prędkość i odstępy',
    'Manewry na drodze',
    'Dokumenty i obowiązki kierowcy',
    'Bezpieczeństwo i pierwsza pomoc',
    'Budowa i obsługa pojazdu',
    'Jazda w różnych warunkach',
    'Ekologia i ekonomiczna jazda'
  ],
  
  practical: [
    'Przygotowanie do jazdy i ruszanie',
    'Jazda w ruchu miejskim',
    'Parkowanie równoległe',
    'Parkowanie prostopadłe',
    'Parkowanie skośne',
    'Zawracanie w ograniczonym miejscu',
    'Jazda w ruchu pozamiejskim',
    'Jazda autostradą i drogą ekspresową',
    'Jazda w trudnych warunkach pogodowych',
    'Jazda nocna',
    'Rondo i skrzyżowania',
    'Hamowanie awaryjne',
    'Jazda ekonomiczna',
    'Manewry cofania'
  ]
};

module.exports = {
  polishNames,
  warsawStreets,
  warsawDistricts,
  polishCompanyData,
  lessonTopics
};