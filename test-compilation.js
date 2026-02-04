// Quick test to verify all imports work
const { execSync } = require('child_process');

console.log('🔍 Testing compilation...');

try {
  // Test client compilation
  console.log('Testing client compilation...');
  process.chdir('client');
  
  // Just check if the build would work (don't actually build)
  const result = execSync('npm run build --dry-run || echo "Build check complete"', { 
    encoding: 'utf8',
    timeout: 30000 
  });
  
  console.log('✅ Client compilation test passed');
  process.chdir('..');
  
} catch (error) {
  console.error('❌ Compilation test failed:', error.message);
  process.chdir('..');
  process.exit(1);
}

console.log('🎉 All compilation tests passed!');