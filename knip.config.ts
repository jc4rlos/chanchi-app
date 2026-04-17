import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [
    'packages/ui/**',
    'src/components/layout/app-title.tsx',
    'src/tanstack-table.d.ts',
  ],
}

export default config
