import { FileStore } from '@pawel-up/benchmark'
export type BenchTypes = 'expressions' | 'validation'
const store = new FileStore<BenchTypes>({ basePath: './benchmarks/history' })
export { store }
