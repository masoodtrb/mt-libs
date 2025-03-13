# MT Libs

## 🚀 About
**MT Libs** is a modern, modular, and highly optimized React utility library built with TypeScript. It provides a collection of reusable hooks, helper functions, and UI components designed for efficient and scalable frontend development.

## 🏗 Features
- **React 19 Support** – Fully compatible with the latest React version.
- **Optimized TypeScript Config** – Ensures type safety while maintaining flexibility.
- **ESM & CJS Support** – Works seamlessly with modern bundlers.
- **Testing-Ready** – Pre-configured with Jest and React Testing Library.
- **ESLint & Prettier** – Enforces best coding practices and consistent formatting.
- **Fast Builds with Tsup** – Optimized bundling for both development and production.
- **Commit Linting & Git Hooks** – Maintains high code quality and commit hygiene.

## 📦 Installation
```sh
pnpm add @masoodtrb/mt-libs
```

## 📚 Usage
### Importing Hooks
```tsx
import { useFetch } from "@masoodtrb/mt-libs";

const data = useFetch("https://api.example.com");
```

### Utility Functions
```tsx
import { formatDate } from "@masoodtrb/mt-libs";

const formatted = formatDate(new Date());
console.log(formatted);
```

## 📖 Documentation
Comprehensive documentation will be available as the project evolves.

## 🛠 Development Setup
### Clone the Repository
```sh
git clone https://github.com/masoodtrb/mt-libs.git
cd mt-libs
pnpm install
```

### Build the Library
```sh
pnpm build
```

### Run Tests
```sh
pnpm test
```

## 🔄 Contributing
Contributions are welcome! Please follow the commit conventions and best practices.

## 📜 License
MIT License. See `LICENSE` for details.

---

> This README will evolve as the project grows, adapting to new features and best practices.

