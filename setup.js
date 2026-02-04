const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Recipe Sharing Platform...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
  console.error('❌ Node.js version 14 or higher is required');
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
try {
  process.chdir('server');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed');
  process.chdir('..');
} catch (error) {
  console.error('❌ Failed to install server dependencies');
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
try {
  process.chdir('client');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Client dependencies installed');
  process.chdir('..');
} catch (error) {
  console.error('❌ Failed to install client dependencies');
  process.exit(1);
}

// Check if .env file exists
const envPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n⚠️  No .env file found. Creating from template...');
  const envExamplePath = path.join(__dirname, 'server', '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
    console.log('📝 Please update the .env file with your configuration');
  }
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update server/.env with your MongoDB URI and other settings');
console.log('2. Make sure MongoDB is running');
console.log('3. Run "npm run dev" to start both client and server');
console.log('\n🌐 The app will be available at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');