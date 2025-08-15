/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+.(ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'], plugins: ['@babel/plugin-transform-modules-commonjs'] }],
    '^.+.(js|jsx)$': 'babel-jest',    
    '/node_modules/(?!.pnpm)(.+).(js|jsx|ts|tsx)$g': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '/home/user/studio/src/$1',
    '^../src/components/bar-card$': '/home/user/studio/src/components/bar-card.tsx'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react/).+.(js|jsx|ts|tsx)$',
  ],
};

module.exports = config;