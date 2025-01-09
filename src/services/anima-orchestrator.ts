  }

  getState(): AnimaState | null {
    return this.state ? { ...this.state } : null;
  }

  async shutdown(): Promise<void> {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    await this.walletSync.stopSync();
    this.state = null;
  }
}

export const animaOrchestrator = AnimaOrchestrator.getInstance();