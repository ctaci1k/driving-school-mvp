// scripts/fix-prisma-relations.js

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

function fixRelations() {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Знаходимо модель User
  const userModelRegex = /model User \{([\s\S]*?)\n\}/;
  const match = schema.match(userModelRegex);
  
  if (match) {
    let userModel = match[1];
    
    // Додаємо відношення якщо їх немає
    if (!userModel.includes('examsConducted')) {
      const insertPoint = userModel.lastIndexOf('  // Relations');
      if (insertPoint > -1) {
        const before = userModel.substring(0, insertPoint);
        const after = userModel.substring(insertPoint);
        userModel = before + 
          '  examsConducted       ExamResult[]        @relation("ExamInstructor")\n' +
          '  feedbacksGiven       LessonFeedback[]    @relation("InstructorFeedback")\n' +
          after;
      }
    }
    
    schema = schema.replace(userModelRegex, `model User {${userModel}\n}`);
    fs.writeFileSync(schemaPath, schema);
    console.log('✅ Relations fixed successfully');
  }
}

fixRelations();