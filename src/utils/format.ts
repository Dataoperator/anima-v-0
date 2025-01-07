export const formatBytes = (bytes: bigint): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = Number(bytes);
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const formatNumber = (num: bigint): string => {
  return new Intl.NumberFormat().format(Number(num));
};