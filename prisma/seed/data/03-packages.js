// prisma/seed/data/03-packages.js
const { faker } = require('@faker-js/faker');
const { config } = require('../config.js');

async function seedPackages(prisma, users) {
  const result = {
    packages: [],
    studentPackages: []
  };

  // 1. Create Packages
  const packageData = [
    {
      name: 'Pakiet Podstawowy',
      description: 'Idealny dla początkujących. Zawiera podstawowy kurs teorii i praktyki.',
      category: 'basic',
      price: 2000,
      discountedPrice: 1800,
      durationDays: 90,
      theoryHours: 30,
      practicalHours: 20,
      additionalHours: 0,
      examAttempts: 1,
      features: [
        'Materiały do nauki teorii online',
        'Dostęp do aplikacji mobilnej',
        '20 godzin jazd praktycznych',
        'Jeden egzamin wewnętrzny'
      ],
      pricingRules: {
        hourlyRate: 120,
        additionalHourPrice: 130,
        examRetakePrice: 200
      }
    },
    {
      name: 'Pakiet Standard',
      description: 'Najpopularniejszy wybór. Rozszerzony kurs z dodatkowymi godzinami praktyki.',
      category: 'standard',
      price: 3000,
      discountedPrice: 2800,
      durationDays: 180,
      theoryHours: 35,
      practicalHours: 30,
      additionalHours: 5,
      examAttempts: 2,
      features: [
        'Wszystko z pakietu podstawowego',
        '30 godzin jazd praktycznych',
        '5 dodatkowych godzin w cenie',
        'Dwa podejścia do egzaminu wewnętrznego',
        'Jazdy w różnych warunkach pogodowych'
      ],
      pricingRules: {
        hourlyRate: 110,
        additionalHourPrice: 120,
        examRetakePrice: 150
      }
    },
    {
      name: 'Pakiet Premium',
      description: 'Kompleksowy kurs z gwarancją zdania. Maksymalne wsparcie i elastyczność.',
      category: 'premium',
      price: 4500,
      discountedPrice: 4200,
      durationDays: 365,
      theoryHours: 40,
      practicalHours: 40,
      additionalHours: 10,
      examAttempts: 3,
      features: [
        'Wszystko z pakietu standard',
        '40 godzin jazd praktycznych',
        '10 dodatkowych godzin w cenie',
        'Trzy podejścia do egzaminu',
        'Priorytetowa rezerwacja terminów',
        'Jazdy nocne i autostradowe',
        'Indywidualny plan nauki'
      ],
      pricingRules: {
        hourlyRate: 100,
        additionalHourPrice: 110,
        examRetakePrice: 100,
        priorityBooking: true
      }
    },
    {
      name: 'Pakiet Intensywny',
      description: 'Szybki kurs dla zdeterminowanych. Egzamin w 30 dni!',
      category: 'intensive',
      price: 3500,
      discountedPrice: null,
      durationDays: 45,
      theoryHours: 30,
      practicalHours: 30,
      additionalHours: 0,
      examAttempts: 1,
      features: [
        'Przyspieszona nauka teorii',
        'Codzienne jazdy praktyczne',
        'Dedykowany instruktor',
        'Egzamin w ciągu 30 dni',
        'Wsparcie 24/7'
      ],
      pricingRules: {
        hourlyRate: 140,
        additionalHourPrice: 150,
        examRetakePrice: 250,
        fastTrack: true
      }
    },
    {
      name: 'Pakiet Indywidualny',
      description: 'Dostosowany do Twoich potrzeb. Elastyczne godziny i tempo nauki.',
      category: 'premium',
      price: 5000,
      discountedPrice: 4800,
      durationDays: 365,
      theoryHours: 35,
      practicalHours: 35,
      additionalHours: 15,
      examAttempts: 4,
      features: [
        'Pełna elastyczność terminów',
        'Wybór instruktora',
        'Plan nauki dostosowany do potrzeb',
        'Nielimitowane konsultacje',
        'Jazdy w wybranym samochodzie',
        'Kurs eco-driving gratis'
      ],
      pricingRules: {
        hourlyRate: 90,
        additionalHourPrice: 100,
        examRetakePrice: 0,
        customSchedule: true,
        instructorChoice: true
      }
    }
  ];

  for (const data of packageData) {
    const pkg = await prisma.package.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        status: 'active',
        price: data.price,
        discountedPrice: data.discountedPrice,
        durationDays: data.durationDays,
        theoryHours: data.theoryHours,
        practicalHours: data.practicalHours,
        additionalHours: data.additionalHours,
        examAttempts: data.examAttempts,
        features: data.features,
        pricingRules: data.pricingRules
      }
    });
    result.packages.push(pkg);
  }

  // 2. Assign Packages to Students
  for (const student of users.students) {
    const selectedPackage = faker.helpers.arrayElement(result.packages);
    const purchaseDate = faker.date.past({ years: 0.5 });
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + selectedPackage.durationDays);

    const totalCredits = selectedPackage.practicalHours + selectedPackage.additionalHours;
    const usedCredits = faker.number.int({ 
      min: 0, 
      max: Math.min(totalCredits, student.student.practicalHoursCompleted) 
    });

    const studentPackage = await prisma.studentPackage.create({
      data: {
        studentId: student.id,
        packageId: selectedPackage.id,
        purchaseDate,
        expiryDate,
        totalCredits,
        usedCredits,
        remainingCredits: totalCredits - usedCredits,
        status: expiryDate > new Date() ? 'active' : 'expired',
        pricePaid: selectedPackage.discountedPrice || selectedPackage.price
      }
    });
    result.studentPackages.push(studentPackage);

    // Update student's package info
    await prisma.student.update({
      where: { id: student.id },
      data: {
        totalCredits,
        usedCredits,
        packageExpiry: expiryDate
      }
    });
  }

  return result;
}

module.exports = { seedPackages };