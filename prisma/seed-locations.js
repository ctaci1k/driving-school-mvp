const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const locations = await prisma.location.createMany({
    data: [
      {
        name: 'Warszawa Centrum',
        code: 'WAW-01',
        address: 'ul. Marszałkowska 100',
        city: 'Warszawa',
        postalCode: '00-001',
        maxInstructors: 5,
        maxVehicles: 10,
        isActive: true,
        isPrimary: true
      },
      {
        name: 'Warszawa Mokotów',
        code: 'WAW-02',
        address: 'ul. Puławska 50',
        city: 'Warszawa',
        postalCode: '02-508',
        maxInstructors: 3,
        maxVehicles: 5,
        isActive: true,
        isPrimary: false
      },
      {
        name: 'Warszawa Ursynów',
        code: 'WAW-03',
        address: 'ul. KEN 20',
        city: 'Warszawa',
        postalCode: '02-777',
        maxInstructors: 2,
        maxVehicles: 3,
        isActive: true,
        isPrimary: false
      }
    ]
  })
  console.log(`Created ${locations.count} locations`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })