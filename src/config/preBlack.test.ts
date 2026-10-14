import { describe, expect, it } from "vitest";
import { confirmedGroupUrl, getPreBlackCountdown, PRE_BLACK_CONFIG } from "./preBlack";

describe("Pré Black campaign rules", () => {
  it("opens at 09:00 Bahia on 21 October 2026", () => {
    expect(new Date(PRE_BLACK_CONFIG.startsAt).toISOString()).toBe("2026-10-21T12:00:00.000Z");
    expect(getPreBlackCountdown(Date.parse("2026-10-20T12:00:00Z"))).toEqual({ started: false, days: 1, hours: 0, minutes: 0, seconds: 0 });
  });
  it("shows zero at and after opening without restarting", () => {
    for (const now of ["2026-10-21T12:00:00Z", "2026-10-25T00:00:00Z"]) {
      expect(getPreBlackCountdown(Date.parse(now))).toEqual({ started: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  });
  it("does not treat support or missing URLs as a group invitation", () => {
    expect(confirmedGroupUrl("")).toBeNull();
    expect(confirmedGroupUrl("https://wa.me/5571996150401")).toBeNull();
    expect(confirmedGroupUrl("https://chat.whatsapp.com.evil.test/abcdefghijklmnopqrstuv")).toBeNull();
  });
  it("preserves confirmed group invites without attaching campaign parameters", () => {
    const invite = "https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv?mode=gi_t";
    expect(confirmedGroupUrl(invite)).toBe(invite);
  });
  it("uses the exact confirmed NotifyFlow deeplink and rejects lookalikes", () => {
    const link = "https://app.notifyflow.com.br/deeplink/campaign/5233468f-cc5c-426b-96bc-a97f89414747";
    expect(PRE_BLACK_CONFIG.groupUrl).toBe(link);
    expect(confirmedGroupUrl(link)).toBe(link);
    for (const bad of [
      "http://app.notifyflow.com.br/deeplink/campaign/5233468f-cc5c-426b-96bc-a97f89414747",
      "https://app.notifyflow.com.br.evil.test/deeplink/campaign/5233468f-cc5c-426b-96bc-a97f89414747",
      "https://user:pw@app.notifyflow.com.br/deeplink/campaign/5233468f-cc5c-426b-96bc-a97f89414747",
      "https://app.notifyflow.com.br:8443/deeplink/campaign/5233468f-cc5c-426b-96bc-a97f89414747",
      "https://app.notifyflow.com.br/deeplink/campaign/not-a-uuid",
    ]) expect(confirmedGroupUrl(bad)).toBeNull();
  });
});