import { Principal } from '@dfinity/principal';
import { HttpAgentRequest } from '@dfinity/agent';

export class MockIdentity {
  private _principal: Principal;

  constructor(principalId: string = 'aaaaa-aa') {
    this._principal = Principal.fromText(principalId);
  }

  getPrincipal() {
    return this._principal;
  }

  async transformRequest(request: HttpAgentRequest): Promise<unknown> {
    return request;
  }
}

export const mockAuthContext = {
  isAuthenticated: true,
  identity: new MockIdentity(),
  principal: 'aaaaa-aa',
  actor: {
    get_payment_settings: jest.fn(),
    initiate_payment: jest.fn(),
    complete_payment: jest.fn(),
    // Add other required methods with mock implementations
    check_autonomous_messages: jest.fn(),
    create_anima: jest.fn(),
    get_anima: jest.fn(),
    get_user_animas: jest.fn(),
    interact: jest.fn(),
    set_openai_api_key: jest.fn(),
    get_security_metrics: jest.fn(),
    get_network_health: jest.fn(),
    system_status: jest.fn(),
    get_user_stats: jest.fn(),
    get_canister_metrics: jest.fn(),
    icrc7_name: jest.fn(),
    icrc7_symbol: jest.fn(),
    icrc7_description: jest.fn(),
    icrc7_total_supply: jest.fn(),
    icrc7_balance_of: jest.fn(),
    icrc7_owner_of: jest.fn(),
  },
  login: jest.fn(),
  logout: jest.fn(),
  error: null,
  setError: jest.fn(),
  checkAuth: jest.fn(),
  recentConnections: [],
  shouldAutoConnect: false,
  toggleAutoConnect: jest.fn(),
  loading: false,
};