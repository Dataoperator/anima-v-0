import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export class MockIdentity implements Identity {
  constructor(private principalId: string = '2vxsx-fae') {}

  getPrincipal() {
    return Principal.fromText(this.principalId);
  }

  async transformRequest(request: Record<string, any>) {
    return {
      ...request,
      sender: this.getPrincipal()
    };
  }
}