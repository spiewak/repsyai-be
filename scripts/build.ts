import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const functions = ['workoutPlanner', 'helloWorld'];

// Clean dist directory
if (fs.existsSync('dist')) {
  console.log('Cleaning dist directory...');
  fs.rmSync('dist', { recursive: true });
}

// Create dist directory
console.log('Creating dist directory...');
fs.mkdirSync('dist');

// Copy package.json to dist
console.log('Copying package.json...');
fs.copyFileSync('package.json', 'dist/package.json');

// Install production dependencies in dist
console.log('Installing production dependencies...');
execSync('npm install --production --no-package-lock', { cwd: 'dist' });

// Compile TypeScript
console.log('Compiling TypeScript...');
execSync('tsc');

// Create deployment packages for each function
functions.forEach(func => {
  console.log(`\nProcessing function: ${func}`);
  
  // Create function directory
  const funcDir = path.join('dist', 'functions', func);
  console.log(`Creating function directory: ${funcDir}`);
  if (!fs.existsSync(funcDir)) {
    fs.mkdirSync(funcDir, { recursive: true });
  }

  // Copy compiled function code
  const sourceFile = path.join('dist', 'functions', func, 'index.js');
  const targetFile = path.join(funcDir, 'index.js');
  console.log(`Copying function code from ${sourceFile} to ${targetFile}`);
  
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Source file ${sourceFile} does not exist`);
  }
  
  fs.copyFileSync(sourceFile, targetFile);

  // Copy node_modules
  const nodeModulesDir = path.join(funcDir, 'node_modules');
  console.log(`Copying node_modules to ${nodeModulesDir}`);
  
  if (!fs.existsSync(nodeModulesDir)) {
    fs.mkdirSync(nodeModulesDir, { recursive: true });
  }
  
  const distNodeModules = path.join('dist', 'node_modules');
  if (!fs.existsSync(distNodeModules)) {
    throw new Error(`Source node_modules directory ${distNodeModules} does not exist`);
  }
  
  fs.cpSync(distNodeModules, nodeModulesDir, { recursive: true });

  // Create ZIP file
  console.log(`Creating ZIP for ${func}...`);
  const zipCommand = `cd ${funcDir} && zip -r ../${func}.zip .`;
  console.log(`Executing command: ${zipCommand}`);
  
  try {
    execSync(zipCommand);
    console.log(`Successfully created ZIP for ${func}`);
  } catch (error) {
    console.error(`Error creating ZIP for ${func}:`, error);
    throw error;
  }
});

// Verify the ZIP files
console.log('\nVerifying ZIP files...');
functions.forEach(func => {
  const zipPath = path.join('dist', 'functions', `${func}.zip`);
  if (!fs.existsSync(zipPath)) {
    throw new Error(`Failed to create ${zipPath}`);
  }
  const stats = fs.statSync(zipPath);
  console.log(`Verified ${zipPath} exists (${stats.size} bytes)`);
});

console.log('\nBuild completed successfully!'); 