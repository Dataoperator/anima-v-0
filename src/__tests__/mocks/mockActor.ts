import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from '@/declarations/anima/anima.did';

export const createMockActor = (overrides = {}): ActorSubclass<_SERVICE> => {
  const defaultMethods = {
    check_autonomous_messages: jest.fn(),
    create_anima: jest.fn(),
    get_anima: jest.fn(),
    get_user_animas: jest.fn(),
    interact: jest.fn(),
    set_openai_api_key: jest.fn(),
  };

  return {
    ...defaultMethods,
    ...overrides,
  } as unknown as ActorSubclass<_SERVICE>;
};