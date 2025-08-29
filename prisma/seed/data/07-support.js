// prisma/seed/data/07-support.js
const { faker } = require('@faker-js/faker');
const { config } = require('../config.js');
const { generateTicketNumber } = require('../utils/helpers.js');

async function seedSupport(prisma, users) {
  const result = {
    tickets: [],
    ticketMessages: [],
    faqs: []
  };

  // 1. Create Support Tickets
  const ticketData = [
    {
      subject: 'Nie mogę zarezerwować terminu jazdy',
      category: 'technical',
      priority: 'high',
      status: 'open',
      messages: [
        {
          isUser: true,
          content: 'Dzień dobry, od wczoraj nie mogę zarezerwować terminu jazdy przez aplikację. Po wybraniu daty i godziny pojawia się błąd.'
        },
        {
          isUser: false,
          content: 'Dzień dobry! Przepraszamy za problemy. Czy mógłby Pan/Pani podać dokładną treść błędu oraz jaką przeglądarkę Pan/Pani używa?'
        },
        {
          isUser: true,
          content: 'Używam Chrome 120. Błąd to "Nie można przetworzyć żądania. Spróbuj ponownie później."'
        },
        {
          isUser: false,
          content: 'Dziękuję za informację. Problem został zidentyfikowany i naprawiony. Proszę spróbować ponownie. Jeśli problem będzie się powtarzał, proszę o kontakt.'
        }
      ]
    },
    {
      subject: 'Pytanie o zwrot płatności',
      category: 'billing',
      priority: 'medium',
      status: 'in_progress',
      messages: [
        {
          isUser: true,
          content: 'Witam, musiałem odwołać lekcję z powodu choroby. Czy mogę otrzymać zwrot płatności?'
        },
        {
          isUser: false,
          content: 'Dzień dobry! Zgodnie z regulaminem, odwołanie lekcji z powodu choroby z zaświadczeniem lekarskim uprawnia do zwrotu. Proszę przesłać skan zaświadczenia.'
        },
        {
          isUser: true,
          content: 'Przesyłam zaświadczenie w załączniku.',
          attachments: ['zaswiadczenie-lekarskie.pdf']
        }
      ]
    },
    {
      subject: 'Zmiana instruktora',
      category: 'scheduling',
      priority: 'low',
      status: 'resolved',
      messages: [
        {
          isUser: true,
          content: 'Czy mogę zmienić instruktora? Obecny styl nauczania mi nie odpowiada.'
        },
        {
          isUser: false,
          content: 'Oczywiście! Proszę podać preferowane terminy i ewentualnie imię instruktora, jeśli ma Pan/Pani kogoś na myśli.'
        },
        {
          isUser: true,
          content: 'Chciałbym spróbować z Panem Tomaszem Wójcikiem. Terminy: wtorki i czwartki po 17:00.'
        },
        {
          isUser: false,
          content: 'Zmiana została dokonana. Od przyszłego tygodnia będzie Pan miał zajęcia z Panem Tomaszem w wybrane dni.'
        }
      ]
    },
    {
      subject: 'Certyfikat ukończenia kursu',
      category: 'other',
      priority: 'low',
      status: 'closed',
      messages: [
        {
          isUser: true,
          content: 'Gdzie mogę pobrać certyfikat ukończenia kursu teoretycznego?'
        },
        {
          isUser: false,
          content: 'Certyfikat jest dostępny w zakładce "Moje dokumenty" po zalogowaniu do aplikacji. Można go pobrać w formacie PDF.'
        }
      ]
    },
    {
      subject: 'Problem z płatnością online',
      category: 'billing',
      priority: 'urgent',
      status: 'open',
      messages: [
        {
          isUser: true,
          content: 'Próbowałem zapłacić za pakiet Premium kartą, ale transakcja została odrzucona, a pieniądze zostały pobrane z konta!'
        },
        {
          isUser: false,
          content: 'Przepraszamy za problem! To pilna sprawa. Proszę podać numer transakcji z wyciągu bankowego, sprawdzę to natychmiast.'
        }
      ]
    }
  ];

  for (const data of ticketData) {
    const student = faker.helpers.arrayElement(users.students);
    const assignee = data.status !== 'open' ? users.admin : null;
    
    const ticket = await prisma.supportTicket.create({
      data: {
        number: generateTicketNumber(),
        userId: student.id,
        subject: data.subject,
        category: data.category,
        status: data.status,
        priority: data.priority,
        assignedTo: assignee?.id,
        createdAt: faker.date.recent({ days: 10 })
      }
    });
    result.tickets.push(ticket);
    
    // Create ticket messages
    for (const msg of data.messages) {
      const authorId = msg.isUser ? student.id : (assignee?.id || users.admin.id);
      
      const ticketMessage = await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          authorId,
          content: msg.content,
          attachments: msg.attachments || [],
          createdAt: faker.date.recent({ days: 5 })
        }
      });
      result.ticketMessages.push(ticketMessage);
    }
  }

  // 2. Create FAQs
  const faqData = [
    {
      question: 'Ile kosztuje kurs prawa jazdy kategorii B?',
      answer: 'Oferujemy różne pakiety kursów. Pakiet podstawowy kosztuje 2000 zł, Standard - 3000 zł, a Premium - 4500 zł. Szczegółowe informacje o każdym pakiecie znajdą Państwo w zakładce "Pakiety".',
      category: 'pricing',
      helpful: 156,
      notHelpful: 12,
      tags: ['ceny', 'pakiety', 'kategoria B']
    },
    {
      question: 'Jak długo trwa kurs na prawo jazdy?',
      answer: 'Czas trwania kursu zależy od wybranego pakietu i indywidualnego tempa nauki. Średnio kurs trwa od 1 do 3 miesięcy. Pakiet intensywny pozwala zdać egzamin w 30 dni.',
      category: 'course',
      helpful: 142,
      notHelpful: 8,
      tags: ['czas trwania', 'kurs', 'egzamin']
    },
    {
      question: 'Czy mogę odwołać zarezerwowaną lekcję?',
      answer: 'Tak, lekcję można odwołać do 24 godzin przed planowanym terminem bez żadnych konsekwencji. Odwołanie w krótszym terminie wiąże się z naliczeniem 50% opłaty, chyba że przedstawią Państwo zaświadczenie lekarskie.',
      category: 'scheduling',
      helpful: 98,
      notHelpful: 5,
      tags: ['odwołanie', 'rezerwacja', 'lekcja']
    },
    {
      question: 'Jakie dokumenty są potrzebne do rozpoczęcia kursu?',
      answer: 'Do rozpoczęcia kursu potrzebne są: dowód osobisty lub paszport, zaświadczenie lekarskie o braku przeciwwskazań do kierowania pojazdami, aktualne zdjęcie do dokumentów, oraz numer PESEL.',
      category: 'documents',
      helpful: 178,
      notHelpful: 3,
      tags: ['dokumenty', 'wymagania', 'rejestracja']
    },
    {
      question: 'Czy zapewniacie samochód na egzamin państwowy?',
      answer: 'Tak, zapewniamy samochód na egzamin państwowy. Jest to ten sam pojazd, na którym odbywały się lekcje praktyczne. Koszt wynajmu samochodu na egzamin jest wliczony w cenę pakietów Standard i Premium.',
      category: 'exam',
      helpful: 134,
      notHelpful: 7,
      tags: ['egzamin', 'samochód', 'WORD']
    },
    {
      question: 'Czy mogę zmienić instruktora w trakcie kursu?',
      answer: 'Tak, zmiana instruktora jest możliwa. Wystarczy zgłosić taką potrzebę w biurze obsługi klienta lub przez system zgłoszeń. Postaramy się dopasować nowego instruktora do Państwa preferencji.',
      category: 'instructors',
      helpful: 67,
      notHelpful: 4,
      tags: ['instruktor', 'zmiana', 'kurs']
    },
    {
      question: 'Czy prowadzicie jazdy w weekendy?',
      answer: 'Tak, jazdy odbywają się również w soboty w godzinach 9:00-15:00. Niektórzy instruktorzy oferują także jazdy w niedziele, ale wymaga to indywidualnych ustaleń i może wiązać się z dodatkową opłatą.',
      category: 'scheduling',
      helpful: 89,
      notHelpful: 11,
      tags: ['weekend', 'sobota', 'godziny']
    },
    {
      question: 'Jak wygląda egzamin wewnętrzny?',
      answer: 'Egzamin wewnętrzny składa się z części teoretycznej (test 32 pytań) oraz praktycznej (jazda po mieście). Jest przeprowadzany przez naszych egzaminatorów i stanowi symulację egzaminu państwowego.',
      category: 'exam',
      helpful: 145,
      notHelpful: 6,
      tags: ['egzamin wewnętrzny', 'test', 'praktyka']
    },
    {
      question: 'Czy można płacić w ratach?',
      answer: 'Tak, oferujemy możliwość płatności w ratach 0% dla pakietów Standard i Premium. Raty można rozłożyć na 3, 6 lub 12 miesięcy. Szczegóły w biurze obsługi klienta.',
      category: 'pricing',
      helpful: 203,
      notHelpful: 9,
      tags: ['raty', 'płatność', 'finansowanie']
    },
    {
      question: 'Co w przypadku niezdanego egzaminu państwowego?',
      answer: 'W przypadku niezdanego egzaminu oferujemy dodatkowe lekcje doszkalające w promocyjnej cenie. Pakiety Standard i Premium zawierają gwarancję ponownego podejścia do egzaminu.',
      category: 'exam',
      helpful: 167,
      notHelpful: 14,
      tags: ['egzamin państwowy', 'niezdany', 'powtórka']
    }
  ];

  for (const data of faqData) {
    const faq = await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        helpful: data.helpful,
        notHelpful: data.notHelpful,
        tags: data.tags,
        relatedQuestions: faker.helpers.arrayElements(
          faqData.filter(f => f !== data).map(f => f.question),
          { min: 2, max: 3 }
        )
      }
    });
    result.faqs.push(faq);
  }

  return result;
}

module.exports = { seedSupport };