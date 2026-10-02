import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, Plus } from "lucide-react";
import { PRODUCT_INGREDIENTS, type ProductIngredients } from "@/data/productIngredients";

/**
 * Accordion discreto "Ver ingredientes +" reutilizável em cards, kits e Lipolovers.
 * - Fechado por padrão; conteúdo permanece no HTML (forceMount) para SEO.
 * - Não usa modal nem muda de página; texto menor que a descrição comercial.
 */
const IngredientsAccordion = ({ product, className = "" }: { product: ProductIngredients; className?: string }) => (
  <Collapsible.Root className={className}>
    <Collapsible.Trigger className="group flex w-full items-center justify-between gap-2 rounded-lg border border-[#E8ECF1] bg-[#F8FAFD] px-3 py-2 text-left text-xs font-semibold text-[#4667B4] transition-colors hover:bg-[#EEF2FA]">
      <span className="whitespace-nowrap">Ver ingredientes</span>
      <Plus className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-45" aria-hidden="true" />
    </Collapsible.Trigger>
    {/* forceMount mantém o conteúdo no HTML mesmo fechado (SEO); hidden controla a visibilidade */}
    <Collapsible.Content forceMount className="data-[state=closed]:hidden overflow-hidden">
      <div className="rounded-b-lg border border-t-0 border-[#E8ECF1] px-3 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F5F5F]">{product.label}</p>
        <p className="mt-1 text-xs leading-relaxed text-[#555]">{product.ingredients}</p>
        {product.gluten && <p className="mt-2 text-[11px] font-semibold text-[#555]">{product.gluten}</p>}
        {product.allergens && <p className="mt-1 text-[11px] text-[#666]">{product.allergens}</p>}
      </div>
    </Collapsible.Content>
  </Collapsible.Root>
);

/** Segundo accordion opcional com a tabela nutricional (apenas onde houver espaço, nunca em cards pequenos). */
export const NutritionAccordion = ({ product, className = "" }: { product: ProductIngredients; className?: string }) => {
  if (!product.nutrition) return null;
  return (
    <Collapsible.Root className={className}>
      <Collapsible.Trigger className="group flex w-full items-center justify-between gap-2 rounded-lg border border-[#E8ECF1] bg-[#F8FAFD] px-3 py-2 text-left text-xs font-semibold text-[#4667B4] transition-colors hover:bg-[#EEF2FA]">
        <span className="whitespace-nowrap">Informação nutricional</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
      </Collapsible.Trigger>
      <Collapsible.Content forceMount className="data-[state=closed]:hidden overflow-hidden">
        <div className="rounded-b-lg border border-t-0 border-[#E8ECF1] px-3 py-3">
          <table className="w-full text-xs text-[#555]">
            <caption className="sr-only">Informação nutricional por porção de {product.nutrition.servingSize}</caption>
            <tbody>
              {product.nutrition.rows.map(([name, amount]) => (
                <tr key={name} className="border-b border-[#F0F3F8] last:border-0">
                  <th scope="row" className="py-1 text-left font-normal">{name}</th>
                  <td className="py-1 text-right font-semibold text-[#4667B4]">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-[#666]">
            Porção: {product.nutrition.servingSize} · Porções por embalagem: {product.nutrition.servings}.
          </p>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

/** Bloco "Produtos incluídos" para kits/assinaturas: um accordion por produto, sem duplicar fórmulas. */
export const KitIngredients = ({ productIds, className = "" }: { productIds: ProductIngredients["id"][]; className?: string }) => (
  <div className={className}>
    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#5F5F5F]">Produtos incluídos</p>
    <div className="space-y-2">
      {productIds.map((id) => (
        <div key={id}>
          <p className="mb-1 text-xs font-semibold text-[#333]">{PRODUCT_INGREDIENTS[id].name}</p>
          <IngredientsAccordion product={PRODUCT_INGREDIENTS[id]} />
        </div>
      ))}
    </div>
  </div>
);

import { PRODUCT_INGREDIENTS } from "@/data/productIngredients";

export default IngredientsAccordion;
