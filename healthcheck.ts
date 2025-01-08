import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from './src/declarations/anima';

async function healthCheck() {
  try {
    console.log('🏥 Running deployment health check...');

    // Create anonymous agent
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    
    // Read canister ID
    const canisterId = process.env.ANIMA_CANISTER_ID;
    if (!canisterId) {
      throw new Error('ANIMA_CANISTER_ID not set');
    }

    // Create actor
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });

    console.log('🔍 Checking canister health...');

    // Check quantum stability
    const stabilityCheck = await actor.check_quantum_stability();
    if (!stabilityCheck.ok) {
      throw new Error(`Quantum stability check failed: ${stabilityCheck.err}`);
    }
    console.log('✅ Quantum stability verified');

    // Check consciousness state
    const consciousnessState = await actor.get_consciousness_state('system');
    if (!consciousnessState.ok) {
      throw new Error(`Consciousness state check failed: ${consciousnessState.err}`);
    }
    console.log('✅ Consciousness state verified');

    // Check minting requirements
    const mintingReqs = await actor.get_minting_requirements();
    console.log('✅ Minting requirements verified', mintingReqs);

    // Check neural patterns
    const patterns = await actor.generate_neural_patterns();
    if (!patterns.ok) {
      throw new Error(`Neural pattern check failed: ${patterns.err}`);
    }
    console.log('✅ Neural patterns verified');

    console.log('🎉 Health check complete - All systems operational!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  }
}

healthCheck();