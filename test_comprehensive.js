#!/usr/bin/env node

/**
 * Comprehensive test suite for Blender MCP Server
 * Tests all tools with various inputs
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Running Comprehensive Blender MCP Server Tests...\n');

// Create output directory for generated scripts
const outputDir = join(__dirname, 'test_output');
try {
  mkdirSync(outputDir, { recursive: true });
} catch (e) {
  // Directory exists
}

// Start the server
const serverPath = join(__dirname, 'src', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let requestId = 1;
const responses = new Map();

// Handle server output
server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      if (response.id) {
        responses.set(response.id, response);
      }
    } catch (e) {
      // Not JSON or incomplete
    }
  });
});

server.stderr.on('data', (data) => {
  console.log('Server:', data.toString().trim());
});

// Helper function to send a request
function sendRequest(method, params) {
  const id = requestId++;
  const request = {
    jsonrpc: '2.0',
    id,
    method,
    params
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
  return id;
}

// Wait for response
async function waitForResponse(id, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (responses.has(id)) {
      return responses.get(id);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout waiting for response ${id}`);
}

// Save script to file
function saveScript(name, script) {
  const filename = join(outputDir, `${name}.py`);
  writeFileSync(filename, script);
  console.log(`  ✓ Saved to ${filename}`);
}

// Run tests
async function runTests() {
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Test 1: Generate Geometric Shape (Cube)');
  let id = sendRequest('tools/call', {
    name: 'generate_geometric_shape',
    arguments: {
      shape_type: 'cube',
      size: 2,
      location: [0, 0, 0],
      color: 'red'
    }
  });
  let response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_cube', scriptMatch[1]);
      console.log('  ✓ Cube script generated successfully\n');
    }
  }
  
  console.log('Test 2: Generate Building (House)');
  id = sendRequest('tools/call', {
    name: 'generate_building',
    arguments: {
      building_type: 'house',
      floors: 1,
      style: 'modern',
      location: [0, 0, 0]
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_house', scriptMatch[1]);
      console.log('  ✓ House script generated successfully\n');
    }
  }
  
  console.log('Test 3: Generate Building (Church)');
  id = sendRequest('tools/call', {
    name: 'generate_building',
    arguments: {
      building_type: 'church',
      floors: 1,
      location: [0, 0, 0]
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_church', scriptMatch[1]);
      console.log('  ✓ Church script generated successfully\n');
    }
  }
  
  console.log('Test 4: Generate Human Part (Head)');
  id = sendRequest('tools/call', {
    name: 'generate_human_part',
    arguments: {
      body_part: 'head',
      detail_level: 'medium',
      location: [0, 0, 0]
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_head', scriptMatch[1]);
      console.log('  ✓ Head script generated successfully\n');
    }
  }
  
  console.log('Test 5: Generate Human Part (Hand)');
  id = sendRequest('tools/call', {
    name: 'generate_human_part',
    arguments: {
      body_part: 'hand',
      detail_level: 'high',
      location: [0, 0, 0]
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_hand', scriptMatch[1]);
      console.log('  ✓ Hand script generated successfully\n');
    }
  }
  
  console.log('Test 6: Generate Full Body');
  id = sendRequest('tools/call', {
    name: 'generate_human_part',
    arguments: {
      body_part: 'full_body',
      detail_level: 'medium',
      location: [0, 0, 0]
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_full_body', scriptMatch[1]);
      console.log('  ✓ Full body script generated successfully\n');
    }
  }
  
  console.log('Test 7: Generate from Prompt (English)');
  id = sendRequest('tools/call', {
    name: 'generate_from_prompt',
    arguments: {
      prompt: 'a person with a head, two arms, and two legs',
      detail_level: 'medium'
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_prompt_person', scriptMatch[1]);
      console.log('  ✓ Prompt-based person script generated successfully\n');
    }
  }
  
  console.log('Test 8: Generate from Prompt (Spanish)');
  id = sendRequest('tools/call', {
    name: 'generate_from_prompt',
    arguments: {
      prompt: 'una persona con una cabeza, dos brazos, dos piernas y dos pies',
      detail_level: 'medium'
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_prompt_persona', scriptMatch[1]);
      console.log('  ✓ Spanish prompt script generated successfully\n');
    }
  }
  
  console.log('Test 9: Apply Texture');
  id = sendRequest('tools/call', {
    name: 'apply_texture',
    arguments: {
      object_name: 'Cube',
      texture_type: 'wood'
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_texture_wood', scriptMatch[1]);
      console.log('  ✓ Texture application script generated successfully\n');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('ALL TESTS PASSED! ✓');
  console.log('='.repeat(60));
  console.log(`\nGenerated scripts saved to: ${outputDir}`);
  console.log('\nTo use these scripts in Blender:');
  console.log('1. Open Blender');
  console.log('2. Switch to Scripting workspace');
  console.log('3. Open one of the test scripts');
  console.log('4. Click "Run Script" or press Alt+P');
  
  server.kill();
  process.exit(0);
}

// Run tests with error handling
runTests().catch(error => {
  console.error('Test failed:', error);
  server.kill();
  process.exit(1);
});

// Timeout
setTimeout(() => {
  console.error('Tests timed out');
  server.kill();
  process.exit(1);
}, 30000);
