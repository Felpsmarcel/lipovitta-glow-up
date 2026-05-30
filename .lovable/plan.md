## Editar apenas `src/components/FAQSection.tsx`

Substituir o array `faqs` pelas 8 perguntas solicitadas, mantendo o componente Accordion e o layout atual (mobile-first, sem alterações de estilo).

### Nova lista de perguntas

1. **Qual a diferença entre Shot Matinal e Cápsula LipoVitta?** — texto do briefing.
2. **Preciso comprar os dois?** — texto do briefing.
3. **Tenho diagnóstico de lipedema. Posso usar?** — texto do briefing.
4. **Serve para quem suspeita de lipedema?** — texto do briefing.
5. **Em quanto tempo posso perceber diferença?** — texto do briefing.
6. **Tem glúten ou açúcar?** — usar informação real já presente no site: a Cápsula LipoVitta é divulgada como "Sem Glúten" no Hero. Sobre açúcar, nenhum dado oficial existe no projeto, então a resposta será conservadora, sem inventar:
   > "A Cápsula LipoVitta é Sem Glúten. As informações nutricionais completas, incluindo presença de açúcar, estão descritas no rótulo de cada produto. Em caso de dúvida, fale com a gente antes da compra."
7. **Posso tomar com outros medicamentos?** — texto do briefing.
8. **Como funciona a garantia?** — texto do briefing.

### Itens preservados

- Componente `FAQSection`, imports, `Accordion`, animações, classes e tokens.
- Seção, espaçamentos, cores, tipografia e estrutura mobile-first inalterados.
- Nenhuma outra seção, produto, preço, link, checkout, pixel ou script é tocado.

### Por que esta abordagem

- Mantém linguagem clara, responsável, sem prometer cura nem inventar composição/contraindicações.
- Pergunta 6 respeita a regra "não inventar": reaproveita apenas o claim "Sem Glúten" já existente e remete ao rótulo para detalhes que não constam no projeto.
