/** Availability confirmed by the team; bundles inherit component stock. */
const UNAVAILABLE_IDS = new Set(["shot-rush", "kit-rush", "kit-completo"]);

export function isCatalogItemAvailable(id: string): boolean {
  return !UNAVAILABLE_IDS.has(id);
}