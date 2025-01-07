export enum PaymentType {
  CREATE = 'CREATE',
  RESURRECT = 'RESURRECT',
  GROWTH_PACK = 'GROWTH_PACK'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  CONFIRMED = 'confirmed',
  ERROR = 'error',
  TIMEOUT = 'timeout'
}