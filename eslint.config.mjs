import nextVitals from 'eslint-config-next/core-web-vitals';

export default [
  ...nextVitals,
  {
    ignores: [
      '.next/**',
      'attached_assets/**',
      'node_modules/**',
      'public/Blog-Images/**',
      'supabase/.temp/**',
      'tsconfig.tsbuildinfo',
    ],
  },
];
