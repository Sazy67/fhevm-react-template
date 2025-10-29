// Universal FHEVM SDK Test Runner

console.log('Running Universal FHEVM SDK Tests...\n');

async function runTest(testName, testFile) {
  console.log(`\n🧪 Running ${testName}...`);
  
  try {
    // Dynamically import the test file
    await import(testFile);
    console.log(`✅ ${testName} passed`);
    return true;
  } catch (error) {
    console.error(`❌ ${testName} failed:`);
    console.error(error.message);
    return false;
  }
}

async function runAllTests() {
  let passedTests = 0;
  let totalTests = 0;
  
  // Run Node.js test
  totalTests++;
  if (await runTest('Node.js Environment Test', './universal-sdk-node.test.js')) {
    passedTests++;
  }
  
  // Run React test
  totalTests++;
  if (await runTest('React Components Test', './universal-sdk-react.test.js')) {
    passedTests++;
  }
  
  // Run Vue test
  totalTests++;
  if (await runTest('Vue Components Test', './universal-sdk-vue.test.js')) {
    passedTests++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed.');
    process.exit(1);
  }
}

// Run all tests
runAllTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});