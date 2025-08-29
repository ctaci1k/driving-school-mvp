// prisma/seed/data/06-communication.js
const { faker } = require('@faker-js/faker');
const { config } = require('../config.js');

async function seedCommunication(prisma, users) {
  const result = {
    conversations: [],
    messages: []
  };

  // 1. Create Direct Conversations between students and instructors
  for (let i = 0; i < 3; i++) {
    const student = users.students[i];
    const instructor = users.instructors[i];
    
    if (!student || !instructor) continue;
    
    const conversation = await prisma.conversation.create({
      data: {
        type: 'direct',
        name: null,
        participants: [student.id, instructor.id],
        pinned: faker.datatype.boolean({ probability: 0.3 }),
        muted: false
      }
    });
    result.conversations.push(conversation);
    
    // Create messages for this conversation
    const messageTemplates = [
      { 
        from: 'student', 
        content: 'Dzień dobry, chciałbym umówić się na dodatkową lekcję jazdy.' 
      },
      { 
        from: 'instructor', 
        content: 'Dzień dobry! Oczywiście. Jakie terminy Panu/Pani odpowiadają?' 
      },
      { 
        from: 'student', 
        content: 'Najlepiej w przyszły wtorek lub czwartek po 16:00.' 
      },
      { 
        from: 'instructor', 
        content: 'Czwartek 16:00 jest wolny. Zapisałem Pana/Panią. Do zobaczenia!' 
      },
      { 
        from: 'student', 
        content: 'Dziękuję bardzo! Do zobaczenia.' 
      }
    ];
    
    let lastMessage = null;
    for (const template of messageTemplates.slice(0, 4)) {
      const senderId = template.from === 'student' ? student.id : instructor.id;
      const sentAt = faker.date.recent({ days: 3 });
      
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId,
          content: template.content,
          type: 'text',
          status: 'read',
          sentAt
        }
      });
      result.messages.push(message);
      lastMessage = message;
    }
    
    // Set last message
    if (lastMessage) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageId: lastMessage.id }
      });
    }
  }

  // 2. Create Group Conversation
  const groupParticipants = [
    users.admin.id,
    ...users.instructors.slice(0, 3).map(i => i.id)
  ];
  
  const groupConversation = await prisma.conversation.create({
    data: {
      type: 'group',
      name: 'Zespół Instruktorów',
      participants: groupParticipants,
      pinned: true,
      muted: false
    }
  });
  result.conversations.push(groupConversation);
  
  // Group messages
  const groupMessages = [
    { 
      senderId: users.admin.id, 
      content: 'Przypominam o jutrzejszym spotkaniu zespołu o 10:00.' 
    },
    { 
      senderId: users.instructors[0].id, 
      content: 'Będę obecny.' 
    },
    { 
      senderId: users.instructors[1].id, 
      content: 'Ja również potwierdzam.' 
    },
    { 
      senderId: users.admin.id, 
      content: 'Świetnie, do zobaczenia jutro!' 
    }
  ];
  
  let lastGroupMessage = null;
  for (const msg of groupMessages) {
    const message = await prisma.message.create({
      data: {
        conversationId: groupConversation.id,
        senderId: msg.senderId,
        content: msg.content,
        type: 'text',
        status: 'delivered',
        sentAt: faker.date.recent({ days: 1 })
      }
    });
    result.messages.push(message);
    lastGroupMessage = message;
  }
  
  if (lastGroupMessage) {
    await prisma.conversation.update({
      where: { id: groupConversation.id },
      data: { lastMessageId: lastGroupMessage.id }
    });
  }

  // 3. Create Announcement Conversation
  const announcementConversation = await prisma.conversation.create({
    data: {
      type: 'announcement',
      name: 'Ogłoszenia Szkoły',
      participants: [users.admin.id, ...users.students.map(s => s.id)],
      pinned: true,
      muted: false
    }
  });
  result.conversations.push(announcementConversation);
  
  // Announcement messages
  const announcements = [
    {
      content: '📢 Informujemy, że w dniach 24-26 grudnia szkoła będzie nieczynna. Życzymy Wesołych Świąt!',
      attachments: []
    },
    {
      content: '🚗 Nowy samochód w naszej flocie! Toyota Yaris Hybrid już dostępna do jazd.',
      attachments: [
        {
          type: 'image',
          name: 'toyota-yaris.jpg',
          url: 'https://example.com/toyota-yaris.jpg',
          size: 245000
        }
      ]
    },
    {
      content: '📚 Przypominamy o nowych zasadach egzaminu teoretycznego obowiązujących od stycznia.',
      attachments: [
        {
          type: 'pdf',
          name: 'nowe-zasady-egzaminu.pdf',
          url: 'https://example.com/nowe-zasady.pdf',
          size: 1200000
        }
      ]
    }
  ];
  
  let lastAnnouncement = null;
  for (const ann of announcements) {
    const message = await prisma.message.create({
      data: {
        conversationId: announcementConversation.id,
        senderId: users.admin.id,
        content: ann.content,
        type: ann.attachments.length > 0 ? 'file' : 'text',
        status: 'sent',
        attachments: ann.attachments,
        sentAt: faker.date.recent({ days: 7 })
      }
    });
    result.messages.push(message);
    lastAnnouncement = message;
  }
  
  if (lastAnnouncement) {
    await prisma.conversation.update({
      where: { id: announcementConversation.id },
      data: { lastMessageId: lastAnnouncement.id }
    });
  }

  // 4. Add lesson info messages
  const lessonConversation = result.conversations[0];
  if (lessonConversation) {
    const lessonMessage = await prisma.message.create({
      data: {
        conversationId: lessonConversation.id,
        senderId: users.instructors[0].id,
        content: null,
        type: 'lesson_info',
        status: 'delivered',
        attachments: [
          {
            type: 'lesson',
            data: {
              date: '2025-09-05',
              time: '16:00',
              duration: 90,
              location: 'Plac Manewrowy Ursynów',
              topic: 'Parkowanie równoległe i prostopadłe',
              vehicleId: 'toyota-yaris-001'
            }
          }
        ],
        sentAt: faker.date.recent({ days: 2 })
      }
    });
    result.messages.push(lessonMessage);
  }

  return result;
}

module.exports = { seedCommunication };