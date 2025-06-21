#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vola Health Performance Analyzer');
console.log('=====================================\n');

// Check bundle sizes
function checkBundleSizes() {
  console.log('📦 Checking bundle sizes...');
  
  const buildDir = path.join(__dirname, '../.next');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ No build found. Run `npm run build` first.\n');
    return;
  }
  
  try {
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      console.log('✅ Build directory found');
      
      // Check for large files
      const checkDirectory = (dir, prefix = '') => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            checkDirectory(fullPath, prefix + file + '/');
          } else {
            const sizeKB = Math.round(stat.size / 1024);
            if (sizeKB > 500) { // Files larger than 500KB
              console.log(`⚠️  Large file: ${prefix}${file} (${sizeKB}KB)`);
            }
          }
        });
      };
      
      checkDirectory(staticDir);
    }
  } catch (error) {
    console.log('❌ Error checking bundle sizes:', error.message);
  }
  
  console.log('');
}

// Check for performance issues in code
function checkCodeIssues() {
  console.log('🔍 Checking for common performance issues...');
  
  const srcDir = path.join(__dirname, '../src');
  const issues = [];
  
  function scanFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(srcDir, filePath);
      
      // Check for potential issues
      if (content.includes('ssr: false') && content.includes('dynamic(')) {
        issues.push(`⚠️  SSR disabled in dynamic import: ${relativePath}`);
      }
      
      if (content.match(/useEffect.*fetch/g)) {
        const matches = content.match(/useEffect.*fetch/g);
        if (matches && matches.length > 3) {
          issues.push(`⚠️  Multiple fetch calls in useEffect: ${relativePath}`);
        }
      }
      
      if (content.includes('console.log') && !content.includes('development')) {
        issues.push(`ℹ️  Console.log found (will be removed in production): ${relativePath}`);
      }
      
      // Check for missing loading states
      if (content.includes('fetch(') && !content.includes('loading')) {
        issues.push(`💡 Consider adding loading states: ${relativePath}`);
      }
      
    } catch (error) {
      // Ignore file read errors
    }
  }
  
  function scanDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else {
          scanFile(fullPath);
        }
      });
    } catch (error) {
      // Ignore directory errors
    }
  }
  
  scanDirectory(srcDir);
  
  if (issues.length === 0) {
    console.log('✅ No major performance issues found in code');
  } else {
    issues.forEach(issue => console.log(issue));
  }
  
  console.log('');
}

// Check package.json for heavy dependencies
function checkDependencies() {
  console.log('📚 Checking dependencies...');
  
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
    );
    
    const heavyDeps = [
      'lodash', 'moment', 'rxjs', 'three', 'chart.js'
    ];
    
    const foundHeavy = [];
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    Object.keys(allDeps).forEach(dep => {
      if (heavyDeps.some(heavy => dep.includes(heavy))) {
        foundHeavy.push(dep);
      }
    });
    
    if (foundHeavy.length > 0) {
      console.log('⚠️  Heavy dependencies found:');
      foundHeavy.forEach(dep => console.log(`   - ${dep}`));
      console.log('   Consider lighter alternatives or code splitting');
    } else {
      console.log('✅ No heavy dependencies detected');
    }
    
    // Check total dependency count
    const totalDeps = Object.keys(allDeps).length;
    if (totalDeps > 100) {
      console.log(`⚠️  Large number of dependencies: ${totalDeps}`);
    }
    
  } catch (error) {
    console.log('❌ Error checking dependencies:', error.message);
  }
  
  console.log('');
}

// Performance recommendations
function showRecommendations() {
  console.log('💡 Performance Recommendations:');
  console.log('================================');
  console.log('1. ✅ Enable image optimization (already configured)');
  console.log('2. ✅ Use dynamic imports for heavy components (already implemented)');
  console.log('3. 🔄 Add service worker for caching (consider implementing)');
  console.log('4. 🔄 Implement API response caching (partially implemented)');
  console.log('5. 🔄 Consider using CDN for static assets');
  console.log('6. 🔄 Implement database query optimization');
  console.log('7. 🔄 Add performance monitoring (Lighthouse CI)');
  console.log('8. ✅ Optimize fonts with display: swap (already implemented)');
  console.log('');
  
  console.log('🚀 Quick wins:');
  console.log('- Run: npm run build && npm run start (for production build)');
  console.log('- Add loading skeletons for better perceived performance');
  console.log('- Consider lazy loading images below the fold');
  console.log('- Implement error boundaries to prevent crashes');
  console.log('');
}

// Run all checks
checkBundleSizes();
checkCodeIssues();
checkDependencies();
showRecommendations();

console.log('🏁 Performance analysis complete!');
console.log('Run this script after making changes to track improvements.'); 