// src/modules/operators/index.js
import EventBus from '../../runtime/event-bus.js';

const registry = new Map();

// Register a named operator function
export function opRegister(name, fn) {
  if (typeof name !== 'string' || typeof fn !== 'function') {
    throw new Error('opRegister requires (string, function)');
  }
  registry.set(name, fn);
  EventBus.emit('operator:registered', { name });
}

// Run a registered operator
export function opRun(name, ...args) {
  const fn = registry.get(name);
  if (!fn) {
    throw new Error(`Operator not found: ${name}`);
  }
  const result = fn(...args);
  EventBus.emit('operator:run', { name, args, result });
  return result;
}

// List available operator names
export function opList() {
  return Array.from(registry.keys());
}

// Alias exports for renderers.jsx expectations
export const operatorsOpRegister = opRegister;
export const operatorsOpRun = opRun;
export const operatorsOpList = opList;

// Renderer object for the operators module
export const renderer = {
  id: 'operators',
  title: 'Operators Engine',
  description: 'Register and execute domain operators.',
  content: (
    <div>
      <p>Operators engine ready.</p>
      <small>Use opRegister(opName, fn) and opRun(opName).</small>
    </div>
  )
};

export default { renderer };
