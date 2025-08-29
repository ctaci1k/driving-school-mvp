// scripts/merge-prisma-schemas.js

const fs = require('fs');
const path = require('path');

class PrismaSchemaMerger {
  constructor() {
    this.models = new Map();
    this.enums = new Map();
    this.generator = null;
    this.datasource = null;
  }

  parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let currentBlock = [];
    let blockType = null;
    let blockName = null;
    let braceCount = 0;
    let inComment = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Handle multi-line comments
      if (trimmed.startsWith('/*')) {
        inComment = true;
      }
      if (inComment) {
        if (blockType) {
          currentBlock.push(line);
        }
        if (trimmed.endsWith('*/')) {
          inComment = false;
        }
        continue;
      }

      // Skip empty lines and single-line comments outside blocks
      if (!blockType && (trimmed === '' || trimmed.startsWith('//'))) {
        continue;
      }

      // Detect block start
      if (!blockType && !inComment) {
        if (trimmed.startsWith('generator ')) {
          blockType = 'generator';
          blockName = trimmed.split(' ')[1];
          currentBlock = [line];
          if (trimmed.includes('{')) {
            braceCount = 1;
          }
        } else if (trimmed.startsWith('datasource ')) {
          blockType = 'datasource';
          blockName = trimmed.split(' ')[1];
          currentBlock = [line];
          if (trimmed.includes('{')) {
            braceCount = 1;
          }
        } else if (trimmed.startsWith('model ')) {
          blockType = 'model';
          blockName = trimmed.split(' ')[1];
          currentBlock = [line];
          if (trimmed.includes('{')) {
            braceCount = 1;
          }
        } else if (trimmed.startsWith('enum ')) {
          blockType = 'enum';
          blockName = trimmed.split(' ')[1];
          currentBlock = [line];
          if (trimmed.includes('{')) {
            braceCount = 1;
          }
        }
      } else if (blockType) {
        // Continue collecting block
        currentBlock.push(line);
        
        // Count braces only in non-comment lines
        if (!trimmed.startsWith('//')) {
          // Count opening braces
          const openBraces = (line.match(/{/g) || []).length;
          const closeBraces = (line.match(/}/g) || []).length;
          braceCount += openBraces - closeBraces;
        }

        // Block ended
        if (braceCount === 0 && trimmed === '}') {
          const blockContent = currentBlock.join('\n');
          this.saveBlock(blockType, blockName, blockContent);
          blockType = null;
          blockName = null;
          currentBlock = [];
          braceCount = 0;
        }
      }
    }

    // Handle unclosed block
    if (blockType && currentBlock.length > 0) {
      console.warn(`⚠️ Unclosed block: ${blockType} ${blockName}`);
      const blockContent = currentBlock.join('\n');
      this.saveBlock(blockType, blockName, blockContent);
    }
  }

  saveBlock(type, name, content) {
    // Clean up the block name (remove opening brace if present)
    name = name.replace('{', '').trim();
    
    switch (type) {
      case 'generator':
        if (!this.generator) {
          this.generator = content;
          console.log(`📦 Found generator: ${name}`);
        }
        break;
      case 'datasource':
        if (!this.datasource) {
          this.datasource = content;
          console.log(`🗄️ Found datasource: ${name}`);
        }
        break;
      case 'model':
        if (!this.models.has(name)) {
          this.models.set(name, content);
          console.log(`📊 Found model: ${name}`);
        } else {
          console.warn(`⚠️ Duplicate model ignored: ${name}`);
        }
        break;
      case 'enum':
        if (!this.enums.has(name)) {
          this.enums.set(name, content);
          console.log(`📝 Found enum: ${name}`);
        } else {
          console.warn(`⚠️ Duplicate enum ignored: ${name}`);
        }
        break;
    }
  }

  merge(schemaFiles) {
    console.log('');
    console.log('📖 Parsing schema files...');
    console.log('━'.repeat(50));
    
    // Parse all files
    schemaFiles.forEach(file => {
      console.log(`\n📄 Processing: ${path.basename(file)}`);
      this.parseFile(file);
    });

    console.log('');
    console.log('🔨 Building merged schema...');
    console.log('━'.repeat(50));

    // Build output
    let output = [];
    
    // Add header
    output.push('// ============================================');
    output.push('// AUTO-GENERATED PRISMA SCHEMA');
    output.push('// Generated at: ' + new Date().toISOString());
    output.push('// DO NOT EDIT DIRECTLY');
    output.push('// ============================================');
    output.push('');

    // Add generator and datasource
    if (this.generator) {
      output.push('// ============================================');
      output.push('// CONFIGURATION');
      output.push('// ============================================');
      output.push('');
      output.push(this.generator);
      output.push('');
    }
    
    if (this.datasource) {
      output.push(this.datasource);
      output.push('');
    }

    // Add all enums first (they're often referenced by models)
    if (this.enums.size > 0) {
      output.push('// ============================================');
      output.push('// ENUMS');
      output.push('// ============================================');
      output.push('');
      
      // Sort enums alphabetically
      const sortedEnums = Array.from(this.enums.entries()).sort((a, b) => 
        a[0].localeCompare(b[0])
      );
      
      sortedEnums.forEach(([name, content]) => {
        output.push(content);
        output.push('');
      });
    }

    // Add all models
    if (this.models.size > 0) {
      output.push('// ============================================');
      output.push('// MODELS');
      output.push('// ============================================');
      output.push('');
      
      // Sort models alphabetically
      const sortedModels = Array.from(this.models.entries()).sort((a, b) => 
        a[0].localeCompare(b[0])
      );
      
      sortedModels.forEach(([name, content]) => {
        output.push(content);
        output.push('');
      });
    }

    console.log(`✅ Merged ${this.enums.size} enums`);
    console.log(`✅ Merged ${this.models.size} models`);

    return output.join('\n');
  }
}

// Main execution
async function main() {
  const schemaDir = path.join(__dirname, '../prisma/schema');
  const outputFile = path.join(__dirname, '../prisma/schema.prisma');

  console.log('🚀 PRISMA SCHEMA MERGER v2.0');
  console.log('═'.repeat(50));

  // Define file order (base.prisma must be first)
const fileOrder = [
  'base.prisma',
  'enums.prisma',
  'user.prisma',
  'auth.prisma',
  'notification.prisma',
  'student.prisma',
  'instructor.prisma',
  'booking.prisma',
  'payment.prisma',
  'vehicle.prisma',
  'location.prisma',
  'relations.prisma'  // <-- Додайте цей рядок
];

  const schemaFiles = fileOrder
    .map(file => path.join(schemaDir, file))
    .filter(file => {
      if (!fs.existsSync(file)) {
        console.warn(`⚠️  File not found: ${path.basename(file)}`);
        return false;
      }
      return true;
    });

  if (schemaFiles.length === 0) {
    console.error('❌ No schema files found in prisma/schema/ directory!');
    process.exit(1);
  }

  console.log(`📁 Found ${schemaFiles.length} schema files`);

  const merger = new PrismaSchemaMerger();
  const mergedSchema = merger.merge(schemaFiles);

  // Write output
  console.log('');
  console.log('💾 Writing merged schema...');
  console.log('━'.repeat(50));
  
  fs.writeFileSync(outputFile, mergedSchema);
  console.log(`✅ Schema written to: ${outputFile}`);

  // Validate with Prisma
  console.log('');
  console.log('🔍 Validating merged schema...');
  console.log('━'.repeat(50));
  
  const { execSync } = require('child_process');
  
  try {
    execSync('npx prisma validate', { stdio: 'pipe' });
    console.log('✅ Schema validation PASSED!');
    
    // Format the schema
    console.log('');
    console.log('🎨 Formatting schema...');
    execSync('npx prisma format', { stdio: 'pipe' });
    console.log('✅ Schema formatted successfully!');
    
  } catch (error) {
    console.error('❌ Schema validation FAILED!');
    console.error('');
    console.error('Error output:');
    console.error(error.stdout?.toString() || error.message);
    
    console.log('');
    console.log('🔧 Attempting to auto-fix with prisma format...');
    try {
      execSync('npx prisma format', { stdio: 'pipe' });
      console.log('✅ Schema formatted and fixed!');
    } catch (formatError) {
      console.error('❌ Auto-fix failed. Manual intervention required.');
      console.error('');
      console.error('Run: npx prisma validate');
      console.error('To see detailed errors');
      process.exit(1);
    }
  }

  console.log('');
  console.log('═'.repeat(50));
  console.log('🎉 MERGE COMPLETED SUCCESSFULLY!');
  console.log('═'.repeat(50));
  console.log('');
  console.log('Next steps:');
  console.log('  1. Run: npx prisma generate');
  console.log('  2. Run: npx prisma db push');
  console.log('  3. Run: npm run dev');
  console.log('');
}

main().catch(error => {
  console.error('');
  console.error('💥 FATAL ERROR:');
  console.error(error);
  process.exit(1);
});