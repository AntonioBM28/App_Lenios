import { env } from '@/core/config/env'
import { MockAdminService } from './mockAdminService'
import { HttpAdminService } from './httpAdminService'
import type { DashboardStats } from '../types'

export interface AdminService {
  getDashboardStats(): Promise<DashboardStats>
}

let instance: AdminService | null = null

export function getAdminService(): AdminService {
  if (!instance) {
    instance = env.useMockData ? new MockAdminService() : new HttpAdminService()
  }
  return instance
}
