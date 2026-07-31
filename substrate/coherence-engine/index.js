/**
 * substrate/coherence-engine/index.js
 * Minimal coherence engine surface for the substrate layer.
 *
 * Exported API:
 * - init(config)
 * - createField(name, opts)
 * - getField(id)
 * - listFields()
 * - registerOperator(name, fn)
 *
 * This is a minimal, in-memory stub suitable for local development and integration.
 */

import { createFieldRecord, getFieldRecord, listFieldRecords } from './coherence-field.js';
import { registerOperator as _registerOperator, runOperator as _runOperator } from './coherence-operators.js';

const _state = {
  started: false,
  config: null
};

export function init(config = {}) {
  _state.started = true;
  _state.config = { ...(config || {}) };
  return { started: _state.started, config: _state.config, startedAt: Date.now() };
}

export function createField(name, opts = {}) {
  return createFieldRecord(name, opts);
}

export function getField(id) {
  return getFieldRecord(id);
}

export function listFields() {
  return listFieldRecords();
}

export function registerOperator(name, fn) {
  return _registerOperator(name, fn);
}

export function runOperator(name, ...args) {
  return _runOperator(name, ...args);
}

export default {
  init,
  createField,
  getField,
  listFields,
  registerOperator,
  runOperator
};
