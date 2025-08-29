// prisma/seed/data/05-financial.js
const { faker } = require('@faker-js/faker');
const { config } = require('../config.js');
const { 
  generateInvoiceNumber, 
  calculateInvoiceAmounts,
  generateNIP 
} = require('../utils/helpers.js');
const { polishCompanyData } = require('../mock/polish-data.js');

async function seedFinancial(prisma, users, bookings, packages) {
  const result = {
    payments: [],
    invoices: []
  };

  // 1. Create Payments for Bookings
  const completedBookings = bookings.bookings.filter(b => b.status === 'completed');
  
  for (const booking of completedBookings) {
    const payment = await prisma.payment.create({
      data: {
        studentId: booking.studentId,
        bookingId: booking.id,
        amount: booking.price,
        currency: 'PLN',
        method: faker.helpers.arrayElement(['cash', 'card', 'transfer', 'blik']),
        status: 'completed',
        paidAt: new Date(booking.endTime),
        metadata: {
          bookingType: booking.type,
          duration: booking.durationMinutes,
          instructorId: booking.instructorId
        }
      }
    });
    result.payments.push(payment);
  }

  // 2. Create Payments for Packages
  for (const studentPackage of packages.studentPackages) {
    const payment = await prisma.payment.create({
      data: {
        studentId: studentPackage.studentId,
        packageId: studentPackage.packageId,
        amount: studentPackage.pricePaid,
        currency: 'PLN',
        method: faker.helpers.arrayElement(['transfer', 'card', 'blik']),
        status: 'completed',
        paidAt: studentPackage.purchaseDate,
        metadata: {
          packageName: packages.packages.find(p => p.id === studentPackage.packageId)?.name,
          validUntil: studentPackage.expiryDate.toISOString()
        }
      }
    });
    result.payments.push(payment);
  }

  // 3. Create some pending payments
  const upcomingBookings = bookings.bookings.filter(b => b.status === 'scheduled').slice(0, 3);
  
  for (const booking of upcomingBookings) {
    const payment = await prisma.payment.create({
      data: {
        studentId: booking.studentId,
        bookingId: booking.id,
        amount: booking.price,
        currency: 'PLN',
        method: null,
        status: 'pending',
        paidAt: null,
        metadata: {
          dueDate: booking.startTime.toISOString(),
          reminderSent: false
        }
      }
    });
    result.payments.push(payment);
  }

  // 4. Create Invoices for Package Payments
  const packagePayments = result.payments.filter(p => p.packageId);
  
  for (let i = 0; i < Math.min(5, packagePayments.length); i++) {
    const payment = packagePayments[i];
    const student = users.students.find(s => s.id === payment.studentId);
    const pkg = packages.packages.find(p => p.id === payment.packageId);
    
    if (!student || !pkg) continue;
    
    const issueDate = payment.paidAt || new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 14);
    
    const amounts = calculateInvoiceAmounts(parseFloat(payment.amount), config.locale.vatRate);
    
    const invoice = await prisma.invoice.create({
      data: {
        number: generateInvoiceNumber(issueDate),
        type: 'regular',
        status: payment.status === 'completed' ? 'paid' : 'issued',
        customerId: student.id,
        issueDate,
        dueDate,
        paymentDate: payment.paidAt,
        subtotal: amounts.subtotal,
        taxRate: config.locale.vatRate,
        taxAmount: amounts.taxAmount,
        total: amounts.total,
        paid: payment.status === 'completed' ? amounts.total : 0,
        due: payment.status === 'completed' ? 0 : amounts.total,
        items: [
          {
            name: pkg.name,
            description: `Kurs prawa jazdy - ${pkg.theoryHours}h teorii, ${pkg.practicalHours}h praktyki`,
            quantity: 1,
            unitPrice: amounts.subtotal,
            vatRate: config.locale.vatRate,
            total: amounts.total
          }
        ],
        billingDetails: {
          seller: {
            name: polishCompanyData.names[0],
            nip: polishCompanyData.nip[0],
            regon: polishCompanyData.regon[0],
            address: 'ul. Marszałkowska 140',
            postalCode: '00-061',
            city: 'Warszawa',
            country: 'Polska',
            bankAccount: polishCompanyData.bankAccounts[0],
            email: 'faktury@drivingschool.pl',
            phone: '+48 22 123 45 67'
          },
          buyer: {
            name: `${student.firstName} ${student.lastName}`,
            pesel: student.student.pesel,
            address: student.student.address,
            postalCode: student.student.postalCode,
            city: student.student.city,
            country: 'Polska',
            email: student.email,
            phone: student.phone
          }
        }
      }
    });
    result.invoices.push(invoice);
    
    // Update payment with invoice reference
    await prisma.payment.update({
      where: { id: payment.id },
      data: { invoiceId: invoice.id }
    });
  }

  // 5. Create a correction invoice
  if (result.invoices.length > 0) {
    const originalInvoice = result.invoices[0];
    const correctionDate = new Date(originalInvoice.issueDate);
    correctionDate.setDate(correctionDate.getDate() + 7);
    
    const correctionAmount = parseFloat(originalInvoice.total) * 0.9; // 10% discount
    const correctionAmounts = calculateInvoiceAmounts(correctionAmount / 1.23, config.locale.vatRate);
    
    const correctionInvoice = await prisma.invoice.create({
      data: {
        number: generateInvoiceNumber(correctionDate).replace('FV/', 'FK/'),
        type: 'correction',
        status: 'issued',
        customerId: originalInvoice.customerId,
        issueDate: correctionDate,
        dueDate: new Date(correctionDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        paymentDate: null,
        subtotal: correctionAmounts.subtotal - parseFloat(originalInvoice.subtotal),
        taxRate: config.locale.vatRate,
        taxAmount: correctionAmounts.taxAmount - parseFloat(originalInvoice.taxAmount),
        total: correctionAmounts.total - parseFloat(originalInvoice.total),
        paid: 0,
        due: correctionAmounts.total - parseFloat(originalInvoice.total),
        items: [
          {
            name: 'Korekta - rabat 10%',
            description: `Korekta do faktury ${originalInvoice.number}`,
            quantity: 1,
            unitPrice: correctionAmounts.subtotal - parseFloat(originalInvoice.subtotal),
            vatRate: config.locale.vatRate,
            total: correctionAmounts.total - parseFloat(originalInvoice.total),
            originalInvoiceNumber: originalInvoice.number
          }
        ],
        billingDetails: originalInvoice.billingDetails
      }
    });
    result.invoices.push(correctionInvoice);
  }

  return result;
}

module.exports = { seedFinancial };