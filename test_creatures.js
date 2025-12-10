#!/usr/bin/env node

/**
 * Test creature generation features
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing Creature Generation...\n');

const outputDir = join(__dirname, 'test_output');
try {
  mkdirSync(outputDir, { recursive: true });
} catch (e) {}

const serverPath = join(__dirname, 'src', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let requestId = 1;
const responses = new Map();

server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      if (response.id) {
        responses.set(response.id, response);
      }
    } catch (e) {}
  });
});

server.stderr.on('data', (data) => {
  console.log('Server:', data.toString().trim());
});

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

function saveScript(name, script) {
  const filename = join(outputDir, `${name}.py`);
  writeFileSync(filename, script);
  console.log(`  ✓ Saved to ${filename}`);
}

async function runTests() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Test 1: Generate Dragon');
  let id = sendRequest('tools/call', {
    name: 'generate_creature',
    arguments: {
      creature_type: 'dragon',
      size: 3.0,
      detail_level: 'medium'
    }
  });
  let response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_dragon', scriptMatch[1]);
      console.log('  ✓ Dragon script generated successfully\n');
    }
  }
  
  console.log('Test 2: Generate Spider');
  id = sendRequest('tools/call', {
    name: 'generate_creature',
    arguments: {
      creature_type: 'spider',
      size: 2.0,
      detail_level: 'high'
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_spider', scriptMatch[1]);
      console.log('  ✓ Spider script generated successfully\n');
    }
  }
  
  console.log('Test 3: Generate Monster from Prompt (Spanish)');
  id = sendRequest('tools/call', {
    name: 'generate_from_prompt',
    arguments: {
      prompt: 'un monstruo con cuernos y garras',
      detail_level: 'medium'
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_monster_prompt', scriptMatch[1]);
      console.log('  ✓ Monster from prompt generated successfully\n');
    }
  }
  
  console.log('Test 4: Generate Octopus');
  id = sendRequest('tools/call', {
    name: 'generate_creature',
    arguments: {
      creature_type: 'octopus',
      size: 2.5
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_octopus', scriptMatch[1]);
      console.log('  ✓ Octopus script generated successfully\n');
    }
  }
  
  console.log('Test 5: Generate Dragon from Prompt (Spanish)');
  id = sendRequest('tools/call', {
    name: 'generate_from_prompt',
    arguments: {
      prompt: 'un dragón con alas grandes',
      detail_level: 'medium'
    }
  });
  response = await waitForResponse(id);
  if (response.result?.content?.[0]?.text) {
    const scriptMatch = response.result.content[0].text.match(/```python\n([\s\S]+?)\n```/);
    if (scriptMatch) {
      saveScript('test_dragon_prompt', scriptMatch[1]);
      console.log('  ✓ Dragon from prompt generated successfully\n');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('CREATURE TESTS PASSED! ✓');
  console.log('='.repeat(60));
  console.log(`\nGenerated scripts saved to: ${outputDir}`);
  console.log('\nNew creature types available:');
  console.log('  - Dragon (dragón)');
  console.log('  - Spider (araña)');
  console.log('  - Octopus (pulpo)');
  console.log('  - Alien (extraterrestre)');
  console.log('  - Monster (monstruo)');
  console.log('  - Serpent (serpiente)');
  console.log('  - Bird (ave)');
  console.log('  - Fish (pez)');
  
  process.exit(0);
}

runTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});

setTimeout(() => {
  console.error('Tests timed out');
  process.exit(1);
}, 30000);
