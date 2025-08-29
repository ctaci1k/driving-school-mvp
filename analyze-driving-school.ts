#!/usr/bin/env node
// analyze-driving-school.ts
// Використання: npx ts-node analyze-driving-school.ts

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface MockDataLocation {
  file: string;
  line: number;
  content: string;
  module: 'admin' | 'instructor' | 'student' | 'shared';
  component: string;
}

interface AnalysisResult {
  mockDataFiles: MockDataLocation[];
  entities: Map<string, EntityData>;
  relations: Relation[];
  businessRules: string[];
  recommendations: string[];
}

interface EntityData {
  name: string;
  fields: Map<string, FieldInfo>;
  occurrences: string[];
  recordCount: number;
  module: string;
}

interface FieldInfo {
  name: string;
  types: Set<string>;
  nullable: boolean;
  isArray: boolean;
  isFK: boolean;
  examples: any[];
}

interface Relation {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  field: string;
}

class DrivingSchoolAnalyzer {
  private mockDataFiles: MockDataLocation[] = [];
  private entities = new Map<string, EntityData>();
  private relations: Relation[] = [];
  
  async analyze(): Promise<AnalysisResult> {
    console.log('🚗 DRIVING SCHOOL LMS - Аналіз MockData\n');
    console.log('='.repeat(60) + '\n');
    
    // Крок 1: Знайти всі MockData
    console.log('📂 Крок 1: Пошук MockData файлів...\n');
    this.findMockData();
    
    // Крок 2: Витягнути та проаналізувати
    console.log('\n📊 Крок 2: Аналіз знайдених даних...\n');
    this.extractAndAnalyze();
    
    // Крок 3: Виявити зв'язки
    console.log('\n🔗 Крок 3: Виявлення звязків...\n');
    this.detectRelations();
    
    // Крок 4: Бізнес-правила
    console.log('\n📋 Крок 4: Виявлення бізнес-правил...\n');
    const businessRules = this.extractBusinessRules();
    
    // Крок 5: Генерація рекомендацій
    console.log('\n💡 Крок 5: Формування рекомендацій...\n');
    const recommendations = this.generateRecommendations();
    
    // Крок 6: Звіт
    this.generateReport(businessRules, recommendations);
    
    return {
      mockDataFiles: this.mockDataFiles,
      entities: this.entities,
      relations: this.relations,
      businessRules,
      recommendations
    };
  }
  
  private findMockData() {
    const patterns = [
      'mock', 'Mock', 'MOCK',
      'dummy', 'Dummy', 'DUMMY',  
      'fake', 'Fake', 'FAKE',
      'sample', 'Sample', 'SAMPLE',
      'test.*Data', 'example.*Data'
    ];
    
    const searchPaths = [
      'app',
      'components',
      'lib',
      'hooks'
    ];
    
    let foundCount = 0;
    
    searchPaths.forEach(searchPath => {
      if (!fs.existsSync(searchPath)) return;
      
      patterns.forEach(pattern => {
        try {
          // Використовуємо grep для пошуку
          const command = `grep -r "${pattern}" --include="*.tsx" --include="*.ts" -n ${searchPath} 2>/dev/null || true`;
          const result = execSync(command, { encoding: 'utf-8' });
          
          if (result) {
            const lines = result.split('\n').filter(l => l.trim());
            
            lines.forEach(line => {
              const match = line.match(/^([^:]+):(\d+):(.*)$/);
              if (match) {
                const [, file, lineNum, content] = match;
                
                // Визначаємо модуль
                let module: 'admin' | 'instructor' | 'student' | 'shared' = 'shared';
                if (file.includes('/admin/')) module = 'admin';
                else if (file.includes('/instructor/')) module = 'instructor';
                else if (file.includes('/student/')) module = 'student';
                
                // Визначаємо компонент
                const component = path.basename(path.dirname(file));
                
                // Фільтруємо тільки визначення даних
                if (this.isDataDefinition(content)) {
                  this.mockDataFiles.push({
                    file,
                    line: parseInt(lineNum),
                    content: content.trim(),
                    module,
                    component
                  });
                  foundCount++;
                }
              }
            });
          }
        } catch (error) {
          // Ігноруємо помилки grep
        }
      });
    });
    
    console.log(`✅ Знайдено ${foundCount} визначень MockData`);
    
    // Групуємо по модулях
    const byModule = this.mockDataFiles.reduce((acc, item) => {
      acc[item.module] = (acc[item.module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(byModule).forEach(([module, count]) => {
      console.log(`   • ${module}: ${count} файлів`);
    });
  }
  
  private isDataDefinition(content: string): boolean {
    const dataPatterns = [
      /const\s+\w*[Mm]ock/,
      /const\s+\w*[Dd]ata/,
      /const\s+\w*[Dd]ummy/,
      /const\s+fake/,
      /const\s+sample/,
      /export\s+const\s+\w*[Mm]ock/,
      /=\s*\[[\s\S]*{/,  // масиви об'єктів
      /=\s*{[\s\S]*id:/   // об'єкти з id
    ];
    
    return dataPatterns.some(pattern => pattern.test(content));
  }
  
  private extractAndAnalyze() {
    this.mockDataFiles.forEach(location => {
      try {
        const fileContent = fs.readFileSync(location.file, 'utf-8');
        
        // Витягуємо дані навколо знайденого рядка
        const lines = fileContent.split('\n');
        const startLine = Math.max(0, location.line - 1);
        
        // Шукаємо повне визначення змінної
        let dataStr = '';
        let braceCount = 0;
        let inData = false;
        
        for (let i = startLine; i < lines.length && i < startLine + 200; i++) {
          const line = lines[i];
          
          if (!inData && (line.includes('=') || line.includes('const'))) {
            inData = true;
          }
          
          if (inData) {
            dataStr += line + '\n';
            braceCount += (line.match(/[\[{]/g) || []).length;
            braceCount -= (line.match(/[\]}]/g) || []).length;
            
            if (braceCount === 0 && dataStr.includes('}')) {
              break;
            }
          }
        }
        
        // Парсимо та аналізуємо
        this.parseAndAnalyzeData(dataStr, location);
        
      } catch (error) {
        console.error(`   ⚠️ Не вдалось проаналізувати ${location.file}:${location.line}`);
      }
    });
    
    console.log(`\n📊 Виявлено ${this.entities.size} унікальних сутностей`);
  }
  
  private parseAndAnalyzeData(dataStr: string, location: MockDataLocation) {
    // Визначаємо назву сутності
    const entityMatch = dataStr.match(/const\s+(\w+)/);
    if (!entityMatch) return;
    
    let entityName = entityMatch[1]
      .replace(/Mock|Data|Dummy|Fake|Sample/gi, '')
      .replace(/s$/, ''); // видаляємо множину
    
    // Нормалізуємо назву
    entityName = entityName.charAt(0).toLowerCase() + entityName.slice(1);
    
    // Додаємо або оновлюємо сутність
    if (!this.entities.has(entityName)) {
      this.entities.set(entityName, {
        name: entityName,
        fields: new Map(),
        occurrences: [],
        recordCount: 0,
        module: location.module
      });
    }
    
    const entity = this.entities.get(entityName)!;
    entity.occurrences.push(`${location.file}:${location.line}`);
    
    // Спробуємо витягнути структуру полів
    this.extractFields(dataStr, entity);
  }
  
  private extractFields(dataStr: string, entity: EntityData) {
    // Шукаємо об'єкти в даних
    const objectMatches = dataStr.matchAll(/{\s*([^}]+)\s*}/g);
    
    for (const match of objectMatches) {
      const objectStr = match[1];
      
      // Розбираємо поля
      const fieldMatches = objectStr.matchAll(/(\w+)\s*:\s*([^,]+)/g);
      
      for (const fieldMatch of fieldMatches) {
        const [, fieldName, fieldValue] = fieldMatch;
        
        if (!entity.fields.has(fieldName)) {
          entity.fields.set(fieldName, {
            name: fieldName,
            types: new Set(),
            nullable: false,
            isArray: false,
            isFK: false,
            examples: []
          });
        }
        
        const field = entity.fields.get(fieldName)!;
        
        // Визначаємо тип
        if (fieldValue.includes('[')) {
          field.isArray = true;
        }
        if (fieldValue.includes('null')) {
          field.nullable = true;
        }
        if (fieldName.endsWith('Id') || fieldName.endsWith('_id')) {
          field.isFK = true;
        }
        
        // Визначаємо JavaScript тип
        if (fieldValue.includes('"') || fieldValue.includes("'")) {
          field.types.add('string');
        } else if (fieldValue.match(/\d+/)) {
          field.types.add('number');
        } else if (fieldValue.includes('true') || fieldValue.includes('false')) {
          field.types.add('boolean');
        } else if (fieldValue.includes('new Date')) {
          field.types.add('Date');
        }
        
        // Зберігаємо приклад
        if (field.examples.length < 3) {
          field.examples.push(fieldValue.trim());
        }
      }
      
      entity.recordCount++;
    }
  }
  
  private detectRelations() {
    this.entities.forEach((entity, entityName) => {
      entity.fields.forEach((field, fieldName) => {
        // Foreign Keys
        if (field.isFK) {
          const targetEntity = fieldName.replace(/(_id|Id)$/, '');
          
          this.relations.push({
            from: entityName,
            to: targetEntity,
            type: 'one-to-many',
            field: fieldName
          });
        }
        
        // Arrays of IDs (many-to-many)
        if (field.isArray && fieldName.includes('Id')) {
          const targetEntity = fieldName.replace(/(Ids|Id)$/, '');
          
          this.relations.push({
            from: entityName,
            to: targetEntity,
            type: 'many-to-many',
            field: fieldName
          });
        }
      });
    });
    
    console.log(`✅ Виявлено ${this.relations.length} зв'язків між сутностями`);
  }
  
  private extractBusinessRules(): string[] {
    const rules: string[] = [];
    
    // Специфічні правила для автошколи
    rules.push('Студент може мати лише одного активного інструктора');
    rules.push('Урок не може бути заброньований на минулу дату');
    rules.push('Інструктор не може мати 2 уроки одночасно');
    rules.push('Студент повинен мати мінімум 30 годин практики перед екзаменом');
    rules.push('Оплата повинна бути здійснена перед бронюванням');
    rules.push('Автомобіль повинен мати активну страховку та техогляд');
    
    // Виявляємо правила з даних
    this.entities.forEach((entity, name) => {
      if (name.includes('booking') || name.includes('lesson')) {
        rules.push(`${name}: повинен мати startTime < endTime`);
      }
      
      if (name.includes('payment')) {
        rules.push(`${name}: сума повинна бути > 0`);
      }
      
      if (name.includes('vehicle')) {
        rules.push(`${name}: повинен мати унікальний реєстраційний номер`);
      }
    });
    
    return rules;
  }
  
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Основні таблиці
    recommendations.push('ОСНОВНІ ТАБЛИЦІ:');
    recommendations.push('• users (з полем role: student/instructor/admin)');
    recommendations.push('• vehicles (автомобілі школи)');
    recommendations.push('• bookings (бронювання уроків)');
    recommendations.push('• payments (оплати)');
    recommendations.push('• packages (пакети уроків)');
    
    recommendations.push('\nJUNCTION ТАБЛИЦІ:');
    recommendations.push('• user_packages (студент ↔ пакети)');
    recommendations.push('• instructor_vehicles (інструктор ↔ авто)');
    recommendations.push('• booking_skills (урок ↔ навички)');
    
    recommendations.push('\nLOOKUP ТАБЛИЦІ:');
    recommendations.push('• lesson_types (тип уроку: практика/теорія)');
    recommendations.push('• payment_methods (готівка/картка/перевод)');
    recommendations.push('• booking_statuses (заплановано/завершено/скасовано)');
    
    recommendations.push('\nІНДЕКСИ:');
    recommendations.push('• bookings: (instructor_id, date, time)');
    recommendations.push('• payments: (user_id, created_at)');
    recommendations.push('• vehicles: (registration_number)');
    
    return recommendations;
  }
  
  private generateReport(businessRules: string[], recommendations: string[]) {
    const report = {
      timestamp: new Date().toISOString(),
      projectType: 'Driving School LMS',
      modulesAnalyzed: ['admin', 'instructor', 'student'],
      statistics: {
        mockDataFiles: this.mockDataFiles.length,
        uniqueEntities: this.entities.size,
        relations: this.relations.length,
        businessRules: businessRules.length
      },
      
      // Детальні дані
      entities: Array.from(this.entities.entries()).map(([name, data]) => ({
        name,
        module: data.module,
        fieldCount: data.fields.size,
        occurrences: data.occurrences,
        fields: Array.from(data.fields.entries()).map(([fname, fdata]) => ({
          name: fname,
          types: Array.from(fdata.types),
          isFK: fdata.isFK,
          isArray: fdata.isArray,
          nullable: fdata.nullable
        }))
      })),
      
      relations: this.relations,
      businessRules,
      recommendations,
      
      // SQL приклад
      sqlExample: this.generateSQLExample()
    };
    
    // Зберігаємо звіт
    const reportPath = './driving-school-analysis.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Виводимо підсумок
    console.log('\n' + '='.repeat(60));
    console.log('📈 ПІДСУМОК АНАЛІЗУ');
    console.log('='.repeat(60));
    
    console.log('\n📊 Статистика:');
    console.log(`   • MockData файлів: ${this.mockDataFiles.length}`);
    console.log(`   • Унікальних сутностей: ${this.entities.size}`);
    console.log(`   • Зв'язків: ${this.relations.length}`);
    
    console.log('\n🏗️ Рекомендована структура БД:');
    recommendations.forEach(rec => console.log(rec));
    
    console.log('\n📋 Бізнес-правила автошколи:');
    businessRules.slice(0, 5).forEach(rule => console.log(`   • ${rule}`));
    
    console.log(`\n✅ Повний звіт збережено: ${reportPath}`);
    console.log('\n🎯 НАСТУПНИЙ КРОК:');
    console.log('   Використайте технічний промпт вище разом зі звітом');
    console.log('   для створення правильної Prisma схеми');
  }
  
  private generateSQLExample(): string {
    return `
-- Приклад нормалізованої структури для автошколи

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('student', 'instructor', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    year INT,
    transmission VARCHAR(20) CHECK (transmission IN ('manual', 'automatic')),
    fuel_type VARCHAR(20),
    insurance_expiry DATE NOT NULL,
    inspection_expiry DATE NOT NULL
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id),
    instructor_id UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    lesson_type VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2),
    CONSTRAINT no_time_overlap CHECK (start_time < end_time)
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'PLN',
    method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Індекси для швидкого пошуку
CREATE INDEX idx_bookings_instructor_date ON bookings(instructor_id, start_time);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);
`;
  }
}

// Запуск
async function main() {
  const analyzer = new DrivingSchoolAnalyzer();
  
  try {
    await analyzer.analyze();
    
    console.log('\n✨ Аналіз завершено успішно!');
    console.log('\n📝 Використайте driving-school-analysis.json');
    console.log('   разом з технічним промптом для створення Prisma схеми');
    
  } catch (error) {
    console.error('\n❌ Помилка:', error);
    process.exit(1);
  }
}

// Запускаємо
if (require.main === module) {
  main();
}

export default DrivingSchoolAnalyzer;