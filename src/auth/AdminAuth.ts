import { Principal } from '@dfinity/principal';

class AdminAuth {
  // For MVP, single admin principal
  private readonly ADMIN_PRINCIPAL = '1757492';

  public async isAdmin(principal: Principal): Promise<boolean> {
    return principal.toText() === this.ADMIN_PRINCIPAL;
  }

  public async validateAccess(principal: Principal): Promise<boolean> {
    return this.isAdmin(principal);
  }
}

export const adminAuth = new AdminAuth();