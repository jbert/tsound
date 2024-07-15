import {nodeResolve } from '@rollup/plugin-node-resolve';
import  commonJS from '@rollup/plugin-commonjs'

export default {
  input: 'dist/wa.js',
  output: {
    file: 'dist/bundle.js',
//    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonJS({
      include: 'node_modules/**'
    })
  ]
};

