#!/bin/bash

# Set the library name
BASE_DIR="."

# Create the directory structure
mkdir -p $BASE_DIR/{src/{hooks,components,context,helpers,types,tests},dist,docs,.storybook,.github}

# Initialize package.json
cat <<EOL > $BASE_DIR/package.json
{
  "name": "@your-org",
  "version": "1.0.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "sideEffects": false,
  "scripts": {
    "build": "tsup src --format esm,cjs --dts --out-dir dist",
    "test": "jest"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
EOL

# Initialize tsconfig.json
cat <<EOL > $BASE_DIR/tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "declaration": true,
    "outDir": "dist",
    "strict": true
  },
  "include": ["src"]
}
EOL

# Initialize tsup config
cat <<EOL > $BASE_DIR/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
});
EOL

# Initialize Jest config
cat <<EOL > $BASE_DIR/jest.config.ts
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
EOL

# Create an index.ts file
cat <<EOL > $BASE_DIR/src/index.ts
export * from "./hooks/useFetch";
export * from "./helpers/formatDate";
EOL

# Create a sample hook
cat <<EOL > $BASE_DIR/src/hooks/useFetch.ts
import { useState, useEffect } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return data;
}
EOL

# Create a sample test
cat <<EOL > $BASE_DIR/src/hooks/useFetch.test.ts
import { renderHook } from "@testing-library/react";
import { useFetch } from "./useFetch";

test("fetches data successfully", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ success: true }) })
  ) as jest.Mock;

  const { result, waitForNextUpdate } = renderHook(() => useFetch("/api/test"));
  await waitForNextUpdate();
  expect(result.current).toEqual({ success: true });
});
EOL

# Install dependencies
echo "Installing dependencies..."
pnpm add -D tsup ts-jest @types/jest jest @testing-library/react @types/react

echo "React utility library structure created successfully in $BASE_DIR!"
