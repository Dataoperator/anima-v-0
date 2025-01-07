export const formatGenesisDate = (timestamp: bigint | number | string | undefined): string => {
  if (!timestamp) return 'UNKNOWN';
  
  // Convert BigInt to number if necessary
  const timeNum = typeof timestamp === 'bigint' ? Number(timestamp) / 1_000_000 : Number(timestamp);
  
  try {
    return new Date(timeNum).toLocaleDateString();
  } catch (e) {
    return 'UNKNOWN';
  }
};