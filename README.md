# Angular UI Kit

Welcome to the Angular UI Kit! This project provides reusable Angular components to accelerate your development workflow.

## Features

- Prebuilt UI components (Table, Breadcrumbs, Buttons, etc.)
- Angular Material integration
- Customizable themes
- Easy to use and extend

## Package Configuration

This project uses **two different `package.json` files** depending on the environment:

### Package Files

| File Name             | Purpose                                                          |
| --------------------- | ---------------------------------------------------------------- |
| `_package-local.json` | Used for **local development** (workspace / library development) |
| `_package-npmjs.json` | Used for **publishing to npmjs**                                 |

### How to Use

#### Local Development

Replace `package.json` with the local version:

```bash
cp _package-local.json package.json
```

## Styles Configuration

This library provides **two style sources** depending on how it is used:
**local development** and **npm-installed package**.

You must register the correct style path in your Angular application’s
`angular.json`.

---

### Option 1: Local Development (Library Build Output)

Use this configuration when working with the library **locally** (development or testing from build output):

```json
"styles": [
  "dist/angular-ui-kit/src/styles/styles.scss"
]
```

### Option 2: Using NPM Package

Use this option when the library is installed from **npmjs**.

Add the following path to the `styles` array in your `angular.json` file:

```json
"styles": [
  "node_modules/@devkitify/angular-ui-kit/src/styles/styles.scss"
]
```

## Getting Started

To use this library in your Angular project, install it via npm:

```bash
npm install @devkitify/angular-ui-kit
```

Then, import the desired modules into your application:

```typescript
import { TableComponent, TableModel } from '@devkitify/angular-ui-kit';
```

## Folder Structure

- Components
    - [Autocomplete](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Breadcrumbs](https://github.com/abudygold/angular-ui-kit/blob/main/README-BREADCRUMB.md)
    - [Button](https://github.com/abudygold/angular-ui-kit/blob/main/README-BUTTON.md)
    - [Slide Toggle](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Checkbox](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Chip](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Datepicker](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Dropdown](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Formly](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Modal](https://github.com/abudygold/angular-ui-kit/blob/main/README-MODAL.md)
    - [Radio Button](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Table](https://github.com/abudygold/angular-ui-kit/blob/main/README-TABLE.md)
    - [Textarea](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
    - [Textbox](https://github.com/abudygold/angular-ui-kit/blob/main/README-FORM.md)
- Services
    - [API](https://github.com/abudygold/angular-ui-kit/blob/main/README-API.md)
- Shared
    - Model
    - Pipes
        - [Currency](https://github.com/abudygold/angular-ui-kit/blob/main/README-CURRENCY.md)
    - Utils

## Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Official Documentation](https://angular.dev/)

---

Feel free to contribute or open issues to help improve this library!
