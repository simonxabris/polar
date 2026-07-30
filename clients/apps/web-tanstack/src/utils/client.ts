import { createClient } from '@polar-sh/client'
import { CONFIG } from './config'

export const api = createClient(CONFIG.BASE_URL)
