const fs = require('node:fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (dir && dir !== '.') fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log('Created: ' + filePath);
}

// package.json
writeFile('package.json', JSON.stringify({
  name: "Tirei10",
  version: "0.1.0",
  private: true,
  scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" },
  dependencies: {
    "@anthropic-ai/sdk": "^0.24.0",
    "@stripe/stripe-js": "^3.4.0",
    "@supabase/ssr": "^0.3.0",
    "@supabase/supabase-js": "^2.43.0",
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "stripe": "^15.7.0"
  },
  devDependencies: {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}, null, 2));

console.log('Done with package.json');
