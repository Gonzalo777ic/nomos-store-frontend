import { fireEvent, render, screen } from '@testing-library/react';
// Nota: 'vi' (el equivalente de jest en Vitest) se inyecta globalmente
// gracias a 'globals: true' en tu vite.config.ts.
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

// Mock de la función cn
// ✅ CORRECCIÓN: Usamos 'vi.mock' y 'vi.fn' en lugar de 'jest'
vi.mock("@/lib/utils", () => ({
  cn: vi.fn((...args) => args.filter(Boolean).join(' ')),
}));


describe('Accordion Components', () => {

  const TestAccordion = () => (
    <Accordion type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1" data-testid="item-1">
        <AccordionTrigger>¿Qué es Nomos Store?</AccordionTrigger>
        <AccordionContent data-testid="content-1">
          Nomos Store es una tienda en línea de artículos electrónicos.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" data-testid="item-2">
        <AccordionTrigger>Métodos de pago</AccordionTrigger>
        <AccordionContent data-testid="content-2">
          Aceptamos todas las tarjetas de crédito y débito.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  // --- 1. Prueba de Renderizado Básico ---
  test('should render the accordion with the default open item', () => {
    render(<TestAccordion />);

    // Verifica que el contenido del item por defecto ('item-1') esté visible.
    const content1 = screen.getByTestId('content-1');
    expect(content1).toBeInTheDocument();
    // En Vitest/jest-dom, preferimos usar 'toHaveAttribute' para estados Radix/Shadcn
    // ya que 'toBeVisible' a veces falla en entornos JSDOM.
    expect(content1).toHaveAttribute('data-state', 'open');

    // Verificamos el estado del Item 2 (debería estar cerrado)
    const item2Content = screen.getByTestId('content-2');
    expect(item2Content).toHaveAttribute('data-state', 'closed');
  });

  // --- 2. Prueba de Interacción: Abrir/Cerrar ---
  test('should open the second item when the trigger is clicked', () => {
    render(<TestAccordion />);

    // 1. Obtener el trigger del segundo ítem.
    const trigger2 = screen.getByText('Métodos de pago');

    // 2. Hacer clic en el trigger para abrir el item-2.
    fireEvent.click(trigger2);

    // 3. Verifica que el contenido del item-2 esté abierto (data-state=open).
    const content2 = screen.getByTestId('content-2');
    expect(content2).toHaveAttribute('data-state', 'open');
  });

  // --- 3. Prueba de Clases y Estilos ---
  test('should apply the open state class to the trigger when clicked', () => {
    render(<TestAccordion />);

    // Obtener el trigger del segundo ítem.
    const trigger2 = screen.getByText('Métodos de pago');

    // Hacer clic en el trigger para abrir el item-2.
    fireEvent.click(trigger2);

    // Verifica que el estado del trigger haya cambiado a 'open'
    expect(trigger2).toHaveAttribute('data-state', 'open');

    // Verifica que la clase CSS condicional para la rotación se aplique
    expect(trigger2).toHaveClass('[&[data-state=open]>svg]:rotate-180');
  });
});
