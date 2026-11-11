/** Lee una variable VITE_* obligatoria; sin fallbacks de URL hardcodeados. */
export function requireViteEnv(name: `VITE_${string}`): string {
  const value = import.meta.env[name];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value.trim();
}
