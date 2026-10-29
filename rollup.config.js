import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

const name = 'TutorialScreen';

const commonPlugins = [
  nodeResolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: './dist/types',
    noEmitOnError: true
  }),
  babel({
    babelHelpers: 'bundled',
    presets: [['@babel/preset-env', { targets: 'defaults' }]],
    extensions: ['.js', '.ts']
  })
];

const inputs = [
  { name: 'TS', path: 'src/tutorial.ts' }
];

export default inputs.flatMap(input => [
  // IIFE and ESM versions
  {
    input: input.path,
    output: [
      {
        file: `dist/tutorial${input.name === 'JS' ? '.js' : '.ts'}.js`,
        format: 'iife',
        name: name,
        exports: 'named',
        footer: 'window.TutorialScreen = TutorialScreen.TutorialScreen;'
      },
      {
        file: `dist/tutorial${input.name === 'JS' ? '.js' : '.ts'}.esm.js`,
        format: 'esm'
      }
    ],
    plugins: commonPlugins
  },
  // Minified versions
  {
    input: input.path,
    output: [
      {
        file: `dist/tutorial${input.name === 'JS' ? '.js' : '.ts'}.min.js`,
        format: 'iife',
        name: name,
        exports: 'named',
        footer: 'window.TutorialScreen = TutorialScreen.TutorialScreen;',
        plugins: [terser()]
      },
      {
        file: `dist/tutorial${input.name === 'JS' ? '.js' : '.ts'}.esm.min.js`,
        format: 'esm',
        plugins: [terser()]
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined
      }),
      babel({
        babelHelpers: 'bundled',
        presets: [['@babel/preset-env', { targets: 'defaults' }]],
        extensions: ['.js', '.ts']
      })
    ]
  }
]);
