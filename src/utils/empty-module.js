// Empty module to replace Node.js-specific dependencies in browser environment
// This prevents build errors when Node.js modules are imported in React components

export default {};

// Common exports that might be expected by existing code
export const createClient = () => ({});
export const Client = class {};

// Empty implementations for any other common exports
export const connect = () => Promise.resolve({});
export const disconnect = () => Promise.resolve();
export const upload = () => Promise.resolve();
export const download = () => Promise.resolve();
export const list = () => Promise.resolve([]);