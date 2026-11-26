// Physical Constants (SI & Atomic Units)
export const PLANCK_H = 6.62607015e-34; // J·s
export const HBAR = PLANCK_H / (2 * Math.PI); // J·s
export const SPEED_OF_LIGHT = 2.99792458e8; // m/s
export const ELEMENTARY_CHARGE = 1.602176634e-19; // C
export const BOHR_RADIUS_NM = 0.0529177; // nm (r1)
export const GROUND_ENERGY_EV = 13.6; // eV (E0)
export const GROUND_SPEED_MS = 2.18769e6; // m/s (v1)
export const RYDBERG_CONSTANT = 1.097373e7; // m^-1 (R_H)

export const SHELL_NAMES = {
  1: "K-Shell (Ground State)",
  2: "L-Shell (1st Excited)",
  3: "M-Shell (2nd Excited)",
  4: "N-Shell (3rd Excited)",
  5: "O-Shell (4th Excited)",
  6: "P-Shell (5th Excited)",
};

/**
 * Returns quantized physical properties of a Hydrogen electron in orbit n.
 */
export function getShellState(n) {
  const energyEv = -GROUND_ENERGY_EV / (n * n);
  const radiusNm = BOHR_RADIUS_NM * n * n;
  const speedMs = GROUND_SPEED_MS / n;
  const angularMomentum = n * HBAR;
  const deBroglieWavelengthNm = (2 * Math.PI * radiusNm) / n;

  return {
    n,
    label: SHELL_NAMES[n] || `Shell n=${n}`,
    energyEv,
    radiusNm,
    speedMs,
    angularMomentum,
    deBroglieWavelengthNm,
  };
}

/**
 * Computes photon transition metrics between initial shell nInitial and final shell nFinal.
 */
export function calculateTransition(nInitial, nFinal) {
  if (nInitial === nFinal) return null;

  const isEmission = nInitial > nFinal;
  const nUpper = Math.max(nInitial, nFinal);
  const nLower = Math.min(nInitial, nFinal);

  const eUpper = -GROUND_ENERGY_EV / (nUpper * nUpper);
  const eLower = -GROUND_ENERGY_EV / (nLower * nLower);
  const deltaEEv = Math.abs(eUpper - eLower);
  const deltaEJoules = deltaEEv * ELEMENTARY_CHARGE;

  // Rydberg equation: 1/lambda = R_H * (1/p^2 - 1/n^2)
  const invLambda =
    RYDBERG_CONSTANT * (1 / (nLower * nLower) - 1 / (nUpper * nUpper));
  const wavelengthM = 1 / invLambda;
  const wavelengthNm = wavelengthM * 1e9;
  const frequencyHz = SPEED_OF_LIGHT / wavelengthM;

  const series = getSpectralSeries(nLower);
  const balmerLine = getBalmerLineName(nLower, nUpper);
  const color = wavelengthToColor(wavelengthNm);

  return {
    nInitial,
    nFinal,
    nUpper,
    nLower,
    type: isEmission ? "emission" : "absorption",
    deltaEEv,
    deltaEJoules,
    wavelengthNm,
    frequencyHz,
    series,
    balmerLine,
    color,
  };
}

export function getSpectralSeries(nLower) {
  switch (nLower) {
    case 1:
      return {
        name: "Lyman Series",
        region: "Ultraviolet (UV)",
        badgeColor: "#a855f7",
      };
    case 2:
      return {
        name: "Balmer Series",
        region: "Visible Light",
        badgeColor: "#38bdf8",
      };
    case 3:
      return {
        name: "Paschen Series",
        region: "Infrared (IR)",
        badgeColor: "#f97316",
      };
    case 4:
      return {
        name: "Brackett Series",
        region: "Far Infrared (IR)",
        badgeColor: "#ef4444",
      };
    case 5:
      return {
        name: "Pfund Series",
        region: "Far Infrared (IR)",
        badgeColor: "#dc2626",
      };
    default:
      return {
        name: "Higher Series",
        region: "Infrared",
        badgeColor: "#94a3b8",
      };
  }
}

export function getBalmerLineName(nLower, nUpper) {
  if (nLower !== 2) return null;
  const map = {
    3: "Hα (Red)",
    4: "Hβ (Cyan-Blue)",
    5: "Hγ (Blue-Violet)",
    6: "Hδ (Violet)",
  };
  return map[nUpper] || null;
}

/**
 * Converts wavelength in nanometers to accurate RGB hex/rgba values.
 * UV (< 380 nm) renders as violet-magenta; IR (> 750 nm) renders as deep crimson.
 */
export function wavelengthToColor(nm) {
  if (nm < 380) {
    return {
      hex: "#c084fc",
      rgb: "192, 132, 252",
      isVisible: false,
      band: "UV",
    };
  }
  if (nm > 750) {
    return {
      hex: "#fb7185",
      rgb: "251, 113, 133",
      isVisible: false,
      band: "IR",
    };
  }

  let r = 0;
  let g = 0;
  let b = 0;

  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (nm >= 440 && nm < 490) {
    r = 0;
    g = (nm - 440) / (490 - 440);
    b = 1;
  } else if (nm >= 490 && nm < 510) {
    r = 0;
    g = 1;
    b = -(nm - 510) / (510 - 490);
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (nm >= 580 && nm < 645) {
    r = 1;
    g = -(nm - 645) / (645 - 580);
    b = 0;
  } else if (nm >= 645 && nm <= 750) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity roll-off near vision edges
  let factor = 1.0;
  if (nm >= 380 && nm < 420) {
    factor = 0.35 + (0.65 * (nm - 380)) / (420 - 380);
  } else if (nm > 700 && nm <= 750) {
    factor = 0.35 + (0.65 * (750 - nm)) / (750 - 700);
  }

  const gamma = 0.8;
  const R = Math.round(255 * Math.pow(r * factor, gamma));
  const G = Math.round(255 * Math.pow(g * factor, gamma));
  const B = Math.round(255 * Math.pow(b * factor, gamma));

  const toHex = (c) => c.toString(16).padStart(2, "0");
  return {
    hex: `#${toHex(R)}${toHex(G)}${toHex(B)}`,
    rgb: `${R}, ${G}, ${B}`,
    isVisible: true,
    band: "Visible",
  };
}
