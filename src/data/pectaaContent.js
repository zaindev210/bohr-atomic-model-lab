export const GUIDED_EXPERIMENTS = [
  {
    id: "balmer-ha",
    title: "Balmer Hα (Red Line)",
    subtitle: "n = 3 → n = 2 (656.3 nm)",
    from: 3,
    to: 2,
    description:
      "Electron drops from M-shell (n=3) to L-shell (n=2), emitting a visible red photon of 1.89 eV—the brightest line in the hydrogen spectrum.",
  },
  {
    id: "balmer-hb",
    title: "Balmer Hβ (Cyan-Blue)",
    subtitle: "n = 4 → n = 2 (486.1 nm)",
    from: 4,
    to: 2,
    description:
      "Larger energy drop (2.55 eV) produces a shorter wavelength cyan-blue photon in the visible Balmer series.",
  },
  {
    id: "lyman-alpha",
    title: "Lyman-α (UV Photon)",
    subtitle: "n = 2 → n = 1 (121.6 nm)",
    from: 2,
    to: 1,
    description:
      "Transition to the ground state (n=1) releases 10.20 eV—high-energy Ultraviolet radiation invisible to the human eye.",
  },
  {
    id: "excite-absorb",
    title: "Photon Absorption",
    subtitle: "n = 1 → n = 4 (97.3 nm)",
    from: 1,
    to: 4,
    description:
      "An incoming UV photon of exact energy 12.75 eV is absorbed, kicking the ground-state electron up to the n=4 shell.",
  },
];

export const BOHR_POSTULATES = [
  {
    number: "Postulate I",
    title: "Stationary Orbits (Non-Radiating States)",
    statement:
      "An electron in a hydrogen atom revolves around the nucleus only in certain discrete circular orbits without radiating electromagnetic energy. In each stationary orbit, the electrostatic Coulomb attraction provides the required centripetal force.",
    equation: "mv² / r = (1 / 4πε₀) · (e² / r²)",
  },
  {
    number: "Postulate II",
    title: "Quantization of Angular Momentum",
    statement:
      "Only those orbits are permitted in which the orbital angular momentum (L = mvr) of the electron is an integral multiple of h / 2π (ℏ).",
    equation: "L = mvrₙ = n · (h / 2π),   n = 1, 2, 3, ...",
  },
  {
    number: "Postulate III",
    title: "Frequency Condition (Quantum Jumps)",
    statement:
      "Energy is emitted or absorbed only when an electron jumps from one allowed stationary orbit (Eₙ) to another (Eₚ). The emitted or absorbed photon carries energy equal to the difference between the two levels.",
    equation: "ΔE = Eₙ − Eₚ = hf = hc / λ",
  },
];

export const TEXTBOOK_FORMULAS = [
  {
    label: "Quantized Orbit Radius",
    formula: "rₙ = n² r₁   (r₁ = 0.0529 nm)",
    note: "Orbit radius grows rapidly with the square of principal quantum number n.",
  },
  {
    label: "Quantized Electron Speed",
    formula: "vₙ = v₁ / n   (v₁ = 2.19 × 10⁶ m/s)",
    note: "Electrons move slowest in outer shells and fastest in the innermost K-shell.",
  },
  {
    label: "Quantized Energy Levels",
    formula: "Eₙ = −E₀ / n² = −13.6 / n² eV",
    note: "Negative sign shows the electron is bound to the proton; 13.6 eV is ionization energy.",
  },
  {
    label: "Rydberg Spectral Formula",
    formula: "1 / λ = R_H (1 / p² − 1 / n²)",
    note: "R_H = 1.097 × 10⁷ m⁻¹; p = final lower shell, n = initial upper shell.",
  },
  {
    label: "de Broglie Standing Wave",
    formula: "2π rₙ = n λ_dB",
    note: "Circumference of an allowed orbit equals an integer number of electron de Broglie wavelengths.",
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question:
      "According to Bohr’s second postulate, the angular momentum of an electron in the 3rd orbit (n = 3) of a hydrogen atom is:",
    options: ["h / 2π", "3h / 2π", "9h / 2π", "h / 6π"],
    correctIndex: 1,
    explanation:
      "By Bohr’s quantization condition L = n(h / 2π), substituting n = 3 gives L = 3h / 2π.",
  },
  {
    id: 2,
    question:
      "How does the radius rₙ of the nth Bohr orbit in a hydrogen atom depend on the principal quantum number n?",
    options: ["rₙ ∝ n", "rₙ ∝ 1 / n", "rₙ ∝ n²", "rₙ ∝ 1 / n²"],
    correctIndex: 2,
    explanation:
      "Since rₙ = (ε₀ h² / π m e²) n² = n² r₁, the orbit radius is directly proportional to n².",
  },
  {
    id: 3,
    question:
      "Which spectral series of the hydrogen atom lies entirely in the visible region of the electromagnetic spectrum?",
    options: [
      "Lyman Series",
      "Balmer Series",
      "Paschen Series",
      "Brackett Series",
    ],
    correctIndex: 1,
    explanation:
      "Transitions ending at n = 2 (Balmer series) emit wavelengths from 410.2 nm to 656.3 nm, which fall in the visible light spectrum.",
  },
  {
    id: 4,
    question:
      "The ionization energy of a hydrogen atom in its ground state (n = 1) is:",
    options: ["3.40 eV", "10.2 eV", "13.6 eV", "1.51 eV"],
    correctIndex: 2,
    explanation:
      "Ground-state energy is E₁ = −13.6 eV. Therefore, +13.6 eV is required to remove the electron completely (to n = ∞, E = 0).",
  },
  {
    id: 5,
    question:
      "When an electron jumps from n = 3 to n = 2 in hydrogen, the energy of the emitted photon is approximately:",
    options: ["1.89 eV", "10.2 eV", "12.09 eV", "3.40 eV"],
    correctIndex: 0,
    explanation:
      "E₃ = −13.6 / 9 = −1.51 eV and E₂ = −13.6 / 4 = −3.40 eV. Thus ΔE = −1.51 − (−3.40) = 1.89 eV (Hα red photon).",
  },
  {
    id: 6,
    question:
      "What is the physical explanation of Bohr’s angular momentum quantization using de Broglie matter waves?",
    options: [
      "The electron travels at the speed of light",
      "The orbit circumference equals an integral number of de Broglie wavelengths (2πrₙ = nλ)",
      "Protons inside the nucleus oscillate in phase",
      "Electrons spiral inward continuously",
    ],
    correctIndex: 1,
    explanation:
      "Substituting λ = h / mv into 2πrₙ = nλ yields mvrₙ = nh / 2π, explaining why only stationary standing-wave orbits persist.",
  },
];
