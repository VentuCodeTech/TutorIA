import os, json

def w(path, content):
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f'Created: {path}')

w('tsconfig.json', json.dumps({"compilerOptions":{"lib":["dom","dom.iterable","esnext"],"allowJs":True,"skipLibCheck":True,"strict":True,"noEmit":True,"esModuleInterop":True,"module":"esnext","moduleResolution":"bundler","resolveJsonModule":True,"isolatedModules":True,"jsx":"preserve","incremental":True,"plugins":[{"name":"next"}],"paths":{"@/*":["./"]}},"include":["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],"exclude":["node_modules"]}, indent=2))

w('next.config.js', "/** @type {import('next').NextConfig} */\nconst nextConfig = { images: { domains: ['lh3.googleusercontent.com'] } }\nmodule.exports = nextConfig\n")

w('postcss.config.js', "module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }\n")

w('tailwind.config.ts', """import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {} },
  plugins: [],
}
export default config
""")

print('Done!')

