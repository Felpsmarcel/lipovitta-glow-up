import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PartnerForm from "./PartnerForm";

const mocks = vi.hoisted(() => ({ insert: vi.fn(), single: vi.fn(), invoke: vi.fn(), lead: vi.fn(), start: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => ({ insert: (payload: unknown) => { mocks.insert(payload); return { select: () => ({ single: mocks.single }) }; } }), functions: { invoke: mocks.invoke } } }));
vi.mock("@/lib/tracking", () => ({ trackLead: mocks.lead, trackLeadStart: mocks.start }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
describe("Commercial interest capture without real submissions", () => {
  it("registers selected Shot and volume in existing payload and WhatsApp", async () => {
    mocks.single.mockResolvedValue({ data: { id: "mock-application", created_at: "2026-11-05" }, error: null });
    mocks.invoke.mockResolvedValue({ data: {}, error: null });
    render(<MemoryRouter><PartnerForm selectedProduct="shot_matinal" quantity={75} onProductChange={vi.fn()} /></MemoryRouter>);
    const fields = { "Nome do responsável": "Pessoa Teste", WhatsApp: "71999999999", "Email corporativo": "example@example.test", CNPJ: "11.222.333/0001-81", "Razão social": "Empresa Teste", Cidade: "Salvador" };
    for (const [label, value] of Object.entries(fields)) fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.change(screen.getByLabelText("Tipo de negócio"), { target: { value: "Academia" } });
    fireEvent.change(screen.getByLabelText("Estado"), { target: { value: "BA" } });
    fireEvent.change(screen.getByLabelText("Volume estimado / interesse"), { target: { value: "Contato pela tarde" } });
    fireEvent.click(screen.getByRole("button", { name: "Quero ser parceiro" }));
    await waitFor(() => expect(mocks.insert).toHaveBeenCalledOnce());
    expect(mocks.insert.mock.calls[0][0]).toMatchObject({ business_type: "Academia", volume_notes: "Produto de interesse: Shot Matinal LipoVitta. Quantidade: 75 unidades.\nContato pela tarde" });
    await waitFor(() => expect(mocks.invoke).toHaveBeenCalledWith("notify-application", { body: { type: "partner", applicationId: "mock-application" } }));
    const whatsapp = await screen.findByRole("link", { name: "Enviar meus dados pelo WhatsApp" });
    expect(decodeURIComponent(whatsapp.getAttribute("href") ?? "")).toContain("Shot Matinal LipoVitta. Quantidade: 75 unidades.");
    expect(mocks.lead).toHaveBeenCalledWith(expect.objectContaining({ formName: "parceiro_comercial", eventId: "partner-mock-application" }));
  });
  it("product selection delegates the choice without writing an application", () => {
    const choose = vi.fn();
    render(<MemoryRouter><PartnerForm selectedProduct="capsulas" onProductChange={choose} /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("Produto de interesse"), { target: { value: "shot_matinal" } });
    expect(choose).toHaveBeenCalledWith("shot_matinal");
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("legacy affiliate consumer validates before calling existing flow", () => {
    render(<MemoryRouter><PartnerForm /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Quero ser parceiro" }));
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(screen.queryByLabelText("Produto de interesse")).toBeNull();
  });
});