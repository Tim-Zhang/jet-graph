export default {
  CPUPerc: {
    unit: '%',
    ratio: 1,
  },
  MemPerc: {
    unit: '%',
    ratio: 1,
  },
  MemUsage: {
    unit: 'MB',
    ratio: 1024 * 1024,
    g: 1024,
    columns: ['MemUsage', 'MemLimit'],
    title: 'MemUsage',
  },
  MemLimit: {
    unit: 'MB',
    ratio: 1024 * 1024,
    g: 1024,
    merge: 'MemUsage'
  },
  NetI: {
    unit: 'B',
    ratio: 1,
  },
  NetO: {
    unit: 'B',
    ratio: 1,
  },
  BlockI: {
    unit: 'B',
    ratio: 1,
  },
  BlockO: {
    unit: 'B',
    ratio: 1,
  },
}