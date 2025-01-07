export class MetricsService {
  static formatMemory(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;
    
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    
    return `${value.toFixed(1)} ${units[unitIndex]}`;
  }

  static formatCycles(cycles: number): string {
    const trillion = 1_000_000_000_000;
    const billion = 1_000_000_000;
    const million = 1_000_000;

    if (cycles >= trillion) {
      return `${(cycles / trillion).toFixed(2)}T`;
    } else if (cycles >= billion) {
      return `${(cycles / billion).toFixed(2)}B`;
    } else if (cycles >= million) {
      return `${(cycles / million).toFixed(2)}M`;
    } else {
      return cycles.toLocaleString();
    }
  }

  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
}