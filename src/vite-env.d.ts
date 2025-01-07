/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_MODE: string
  readonly VITE_ICP_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}