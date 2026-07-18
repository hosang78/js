importScripts('./comlink.min.js');

class MarketCalculator {
  constructor() {
    this.total = 0;
  }

  async heavyCompute(n) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += Math.sqrt(i);
    return sum;
  }

  async addToTotal(amount) {
    this.total += amount;
    return this.total;
  }

  async processWithProgress(steps, onProgress) {
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, 30));
      await onProgress(i, steps);
    }
    return '완료';
  }

  async sumBuffer(buffer) {
    const view = new Float64Array(buffer);
    let sum = 0;
    for (let i = 0; i < view.length; i++) sum += view[i];
    return { sum, bufferByteLengthInWorker: buffer.byteLength };
  }
}

Comlink.expose(MarketCalculator);
