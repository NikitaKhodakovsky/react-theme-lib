import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.module,
			sourcemap: true,
			strict: true
		}
	],
	plugins: [typescript({ tsconfig: './tsconfig.json' }), terser()],
	external: ['react']
}
