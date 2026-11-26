# Bohr's Atomic Model & Hydrogen Spectra Lab

> **Live Demo:** [zaindev210.github.io/bohr-atomic-model-lab](https://zaindev210.github.io/bohr-atomic-model-lab/)

An interactive **React + HTML5 Canvas** quantum physics laboratory built for **PECTAA Inter Part-2 (Class 12) Physics (Atomic Spectra)**. Designed to help students visualize Bohr's postulates, quantized electron orbits, de Broglie matter-wave standing conditions, and Rydberg spectral series in real time.

## Key Features

- **Interactive Bohr Atom Canvas:** Click any quantized shell ($n = 1 \dots 6$) to trigger photon emission or absorption with animated sinusoidal wave-packets colored by exact wavelength.
- **de Broglie Standing Wave Visualizer:** Toggle $2\pi r_n = n\lambda_{\text{dB}}$ directly on the active orbit to see why only integer quantum numbers form stable standing waves.
- **Quantized Energy Level Ladder:** Interactive Grotrian diagram ($E_n = -13.6 / n^2\text{ eV}$) with hover previews for $\Delta E$, $\lambda$, and spectral series.
- **Hydrogen Emission Spectrometer:** Real-time UV (Lyman), Visible (Balmer $H_\alpha, H_\beta, H_\gamma, H_\delta$), and IR (Paschen) spectral line detector with a transition history table.
- **PECTAA Textbook Notes & Self-Test:** Built-in summary of Bohr's three postulates, derivations, and a 6-question MCQ self-test.

## Local Setup & GitHub Pages Deployment

1. **Install dependencies and run locally:**
   ```bash
   npm install
   npm run dev
   ```
