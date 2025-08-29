// prisma/seed/data/08-documents.js
const { faker } = require('@faker-js/faker');
const { config } = require('../config.js');

async function seedDocuments(prisma, users) {
  const result = {
    documents: [],
    announcements: []
  };

  // 1. Create Documents for Students
  const documentTypes = [
    {
      name: 'Zaświadczenie lekarskie',
      type: 'pdf',
      category: 'medical',
      status: 'verified',
      sizeBytes: 245000,
      description: 'Zaświadczenie o braku przeciwwskazań do kierowania pojazdami'
    },
    {
      name: 'Umowa szkolenia',
      type: 'pdf',
      category: 'contract',
      status: 'verified',
      sizeBytes: 380000,
      description: 'Umowa na przeprowadzenie kursu prawa jazdy kategorii B'
    },
    {
      name: 'Profil Kandydata na Kierowcę (PKK)',
      type: 'pdf',
      category: 'license',
      status: 'verified',
      sizeBytes: 125000,
      description: 'Numer profilu kandydata na kierowcę'
    },
    {
      name: 'Certyfikat ukończenia części teoretycznej',
      type: 'pdf',
      category: 'certificate',
      status: 'verified',
      sizeBytes: 195000,
      description: 'Zaświadczenie o ukończeniu szkolenia teoretycznego'
    },
    {
      name: 'Zdjęcie do dokumentów',
      type: 'image',
      category: 'license',
      status: 'verified',
      sizeBytes: 85000,
      description: 'Zdjęcie biometryczne 3.5x4.5cm'
    }
  ];

  // Create documents for each student
  for (const student of users.students) {
    const selectedDocs = faker.helpers.arrayElements(documentTypes, { min: 3, max: 5 });
    
    for (const docType of selectedDocs) {
      const uploadDate = faker.date.past({ years: 0.5 });
      const expiryDate = docType.category === 'medical' 
        ? faker.date.future({ years: 2 }) 
        : null;
      
      const document = await prisma.document.create({
        data: {
          userId: student.id,
          name: docType.name,
          type: docType.type,
          category: docType.category,
          fileUrl: `https://storage.drivingschool.pl/documents/${student.id}/${faker.string.uuid()}.${docType.type === 'image' ? 'jpg' : 'pdf'}`,
          sizeBytes: docType.sizeBytes,
          uploadDate,
          expiryDate,
          status: docType.status,
          description: docType.description
        }
      });
      result.documents.push(document);
    }
  }

  // Create some documents for instructors
  for (const instructor of users.instructors.slice(0, 2)) {
    const instructorDoc = await prisma.document.create({
      data: {
        userId: instructor.id,
        name: 'Uprawnienia instruktora',
        type: 'pdf',
        category: 'license',
        fileUrl: `https://storage.drivingschool.pl/documents/${instructor.id}/uprawnienia.pdf`,
        sizeBytes: 520000,
        uploadDate: faker.date.past({ years: 1 }),
        expiryDate: faker.date.future({ years: 3 }),
        status: 'verified',
        description: 'Zaświadczenie o uprawnieniach instruktora nauki jazdy'
      }
    });
    result.documents.push(instructorDoc);
  }

  // 2. Create Announcements
  const announcementData = [
    {
      title: '🎄 Godziny pracy w okresie świątecznym',
      content: `Informujemy, że w okresie świątecznym obowiązują zmienione godziny pracy:

📅 **24 grudnia (Wigilia)** - szkoła nieczynna
📅 **25-26 grudnia** - szkoła nieczynna
📅 **31 grudnia (Sylwester)** - jazdy do godz. 14:00
📅 **1 stycznia (Nowy Rok)** - szkoła nieczynna

Od 2 stycznia wracamy do normalnych godzin pracy.

Życzymy wszystkim Wesołych Świąt i Szczęśliwego Nowego Roku! 🎊`,
      important: true,
      daysAgo: 5,
      expiresInDays: 30
    },
    {
      title: '🚗 Nowe samochody w naszej flocie!',
      content: `Z przyjemnością informujemy, że nasza flota powiększyła się o dwa nowe pojazdy:

✅ **Toyota Yaris Hybrid** - automatyczna skrzynia biegów
✅ **Volkswagen Golf VIII** - manualna skrzynia biegów

Oba samochody są wyposażone w najnowsze systemy bezpieczeństwa i wspomagania kierowcy. 

Rezerwacje jazd nowymi pojazdami są już dostępne w systemie!`,
      important: false,
      daysAgo: 10,
      expiresInDays: 60
    },
    {
      title: '📚 Zmiana w programie szkolenia teoretycznego',
      content: `Od 1 stycznia 2025 wprowadzamy zaktualizowany program szkolenia teoretycznego zgodny z nowymi wytycznymi ministerstwa.

**Najważniejsze zmiany:**
- Zwiększona liczba godzin dotyczących bezpieczeństwa ruchu drogowego
- Nowy moduł: Jazda ekologiczna i ekonomiczna
- Rozszerzone zagadnienia pierwszej pomocy
- Więcej materiałów multimedialnych i symulacji

Wszystkie osoby obecnie uczestniczące w kursie otrzymają bezpłatny dostęp do zaktualizowanych materiałów.`,
      important: true,
      daysAgo: 2,
      expiresInDays: 90
    }
  ];

  for (const data of announcementData) {
    const publishedAt = faker.date.recent({ days: data.daysAgo });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + data.expiresInDays);
    
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: users.admin.id,
        important: data.important,
        publishedAt,
        expiresAt
      }
    });
    result.announcements.push(announcement);
  }

  // 3. Create pending documents (documents awaiting verification)
  const pendingStudent = users.students[0];
  const pendingDoc = await prisma.document.create({
    data: {
      userId: pendingStudent.id,
      name: 'Dodatkowe zaświadczenie lekarskie',
      type: 'pdf',
      category: 'medical',
      fileUrl: `https://storage.drivingschool.pl/documents/${pendingStudent.id}/pending-medical.pdf`,
      sizeBytes: 195000,
      uploadDate: faker.date.recent({ days: 2 }),
      expiryDate: faker.date.future({ years: 2 }),
      status: 'pending',
      description: 'Zaświadczenie specjalistyczne - okulistyczne'
    }
  });
  result.documents.push(pendingDoc);

  // 4. Create rejected document
  const rejectedDoc = await prisma.document.create({
    data: {
      userId: users.students[1].id,
      name: 'Nieczytelne zdjęcie',
      type: 'image',
      category: 'license',
      fileUrl: `https://storage.drivingschool.pl/documents/${users.students[1].id}/rejected-photo.jpg`,
      sizeBytes: 45000,
      uploadDate: faker.date.recent({ days: 7 }),
      status: 'rejected',
      description: 'Zdjęcie nie spełnia wymogów biometrycznych - proszę dostarczyć nowe'
    }
  });
  result.documents.push(rejectedDoc);

  // 5. Create expired document
  const expiredDoc = await prisma.document.create({
    data: {
      userId: users.students[2].id,
      name: 'Nieaktualne zaświadczenie lekarskie',
      type: 'pdf',
      category: 'medical',
      fileUrl: `https://storage.drivingschool.pl/documents/${users.students[2].id}/expired-medical.pdf`,
      sizeBytes: 210000,
      uploadDate: faker.date.past({ years: 2.5 }),
      expiryDate: faker.date.past({ years: 0.5 }),
      status: 'expired',
      description: 'Zaświadczenie straciło ważność - wymagane nowe badanie'
    }
  });
  result.documents.push(expiredDoc);

  return result;
}

module.exports = { seedDocuments };