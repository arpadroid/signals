<link rel="stylesheet" href="docs-styles.css">

# README - **_`@arpadroid/signals`_**

![version](https://img.shields.io/badge/version-1.0.0-lightblue)
![node version](https://img.shields.io/badge/node-%3E%3D16.0.0-lightyellow)
![npm version](https://img.shields.io/badge/npm-%3E%3D8.0.0-pink)

>**_Links:_** 📖 [API](API.md) | 📝[Changelog](docs/CHANGELOG.md) | 🤝 [Contributing](#contributing)

> Isomorphic pub/sub observer pattern implementation for JavaScript projects. Works seamlessly in both Node.js and browser environments.

## ✨ Features

🔄 **Pub/Sub Pattern** - **Lightweight observer pattern** implementation for event-driven architecture  
🌍 **Isomorphic** - **Works everywhere** - Node.js, browser, and modern JavaScript environments  
⚡ **Simple API** - **Easy to use** with intuitive subscribe/unsubscribe methods  
🎯 **Type Safe** - **TypeScript support** with full type definitions  
🪶 **Zero Dependencies** - **Minimal footprint** with no external dependencies  
🔌 **Mixin Support** - **Add to any object** with the observerMixin function

<div id="installation"></div>

## 📦 Installation

```bash
npm install @arpadroid/signals
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { observerMixin } from '@arpadroid/signals';

class MyClass {
    constructor() {
        observerMixin(this);
    }

    doSomething() {
        this.signal('something-happened', { data: 'value' });
    }
}

const instance = new MyClass();

// Subscribe to signals
const unsubscribe = instance.on('something-happened', (data) => {
    console.log('Event received:', data);
});

instance.doSomething(); // Logs: Event received: { data: 'value' }

// Unsubscribe
unsubscribe();
```

### Multiple Subscribers

```javascript
const instance = new MyClass();

// Add multiple listeners
instance.on('data-changed', (data) => console.log('Listener 1:', data));
instance.on('data-changed', (data) => console.log('Listener 2:', data));

instance.signal('data-changed', { value: 42 });
// Logs:
// Listener 1: { value: 42 }
// Listener 2: { value: 42 }
```

### Auto-Unsubscribe

```javascript
const instance = new MyClass();
const otherInstance = new OtherClass();

// Automatically unsubscribe when otherInstance is destroyed
instance.on('event', callback, otherInstance.unsubscribes);
```

## 📖 API Reference

### `observerMixin(instance)`

Adds observer functionality to an object instance.

**Parameters:**
- `instance` - The object to add observer capabilities to

**Returns:** The modified instance

**Example:**
```javascript
const obj = {};
observerMixin(obj);
obj.on('event', () => console.log('Event fired!'));
```

### `on(signalName, callback, unsubscribes?)`

Subscribe to a signal.

**Parameters:**
- `signalName` (string) - The name of the signal to subscribe to
- `callback` (function) - The function to call when the signal is emitted
- `unsubscribes` (array, optional) - Array to track unsubscribe functions for cleanup

**Returns:** Function to unsubscribe from the signal

**Example:**
```javascript
const unsubscribe = instance.on('my-event', (data) => {
    console.log('Received:', data);
});

// Later...
unsubscribe();
```

### `signal(signalName, value, param1?, param2?)`

Emit a signal to all subscribers.

**Parameters:**
- `signalName` (string) - The name of the signal to emit
- `value` (any) - The primary data to send to subscribers
- `param1` (any, optional) - Additional parameter
- `param2` (any, optional) - Additional parameter

**Example:**
```javascript
instance.signal('data-updated', { id: 1, name: 'John' });
instance.signal('status-changed', 'active', previousStatus, timestamp);
```

### `off(signalName, callback)`

Unsubscribe from a signal.

**Parameters:**
- `signalName` (string) - The name of the signal
- `callback` (function) - The callback function to remove

**Example:**
```javascript
const handler = (data) => console.log(data);
instance.on('event', handler);

// Later...
instance.off('event', handler);
```

### `unsubscribe(signalName, callback)`

Returns an unsubscribe function for a specific signal and callback.

**Parameters:**
- `signalName` (string) - The name of the signal
- `callback` (function) - The callback function

**Returns:** Function to unsubscribe

**Example:**
```javascript
const handler = (data) => console.log(data);
const unsub = instance.unsubscribe('event', handler);

// Later...
unsub();
```

## 🌟 Arpadroid Ecosystem

This module is part of the @arpadroid ecosystem of packages:

### Core Modules

- **@arpadroid/tools** - JavaScript utility library with object, node, and HTML helpers
- **@arpadroid/module** - Build system and development toolkit

### UI & Component Libraries

- **@arpadroid/ui** - Core UI components and design system
- **@arpadroid/forms** - Advanced form components and validation
- **@arpadroid/lists** - Data list and table components
- **@arpadroid/navigation** - Navigation and routing components
- **@arpadroid/messages** - Notification and messaging components
- **@arpadroid/gallery** - Media gallery and image components

### Services & Infrastructure

- **@arpadroid/services** - Service layer and API utilities
- **@arpadroid/context** - State management and context providers
- **@arpadroid/resources** - Resource loading and management
- **@arpadroid/i18n** - Internationalization and localization

<div id="contributing"></div>

## 🤝 Contributing

This project has specific architectural goals. If you'd like to contribute:

1. **[Open an issue](https://github.com/arpadroid/signals/issues/new)** describing your proposal
2. Wait for maintainer feedback before coding
3. PRs without prior discussion may be closed

**[Bug reports](https://github.com/arpadroid/signals/issues/new)** are always welcome!

## 📄 License

MIT License - see LICENSE file for details.
