import { describe, expect, it } from "vitest";
import { isCatalogItemAvailable } from "./catalogAvailability";

describe("Rush stock restriction", () => {
  it.each(["shot-rush", "kit-rush", "kit-completo"])("blocks %s because Rush is out of stock", (id) => {
    expect(isCatalogItemAvailable(id)).toBe(false);
  });
  it.each(["capsulas", "shot-matinal", "protocolo"])("keeps %s available", (id) => {
    expect(isCatalogItemAvailable(id)).toBe(true);
  });
});