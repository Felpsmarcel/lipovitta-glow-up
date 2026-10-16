const ASSET_ORIGIN = "https://lipovitta.site";

/**
 * Resolve uma URL de asset (ex.: "/__l5e/assets-v1/...") contra o domínio
 * oficial. No preview local o proxy de assets não serve imagens renderizáveis,
 * então apontamos para a origem publicada, que tem os mesmos assets.
 */
export const assetUrl = (url: string): string => {
  try {
    return new URL(url, ASSET_ORIGIN).href;
  } catch {
    return url;
  }
};
