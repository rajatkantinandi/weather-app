export const fromKtoC = (temp) => (temp - 273).toFixed(1);
export const fromKtoF = (temp) => ((temp - 273) * 1.8 + 32).toFixed(1);
export const fromCtoF = (temp) => (1.8 * temp + 32).toFixed(1);
export const fromFtoC = (temp) => ((temp - 32) / 1.8).toFixed(1);
