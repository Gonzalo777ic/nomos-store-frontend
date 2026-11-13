import { fireEvent, render, screen } from '@testing-library/react';


import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';



vi.mock("@/lib/utils", () => ({
  cn: vi.fn((...args) => args.filter(Boolean).join(' ')),
}));


describe('Accordion Components', () => {

  const TestAccordion = () => (
    <Accordion type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1" data-testid="item-1">
        <AccordionTrigger>¿Qué es ValeERP?</AccordionTrigger>
        <AccordionContent data-testid="content-1">
          ValeERP es una tienda en línea de artículos electrónicos.
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


  test('should render the accordion with the default open item', () => {
    render(<TestAccordion />);


    const content1 = screen.getByTestId('content-1');
    expect(content1).toBeInTheDocument();


    expect(content1).toHaveAttribute('data-state', 'open');


    const item2Content = screen.getByTestId('content-2');
    expect(item2Content).toHaveAttribute('data-state', 'closed');
  });


  test('should open the second item when the trigger is clicked', () => {
    render(<TestAccordion />);


    const trigger2 = screen.getByText('Métodos de pago');


    fireEvent.click(trigger2);


    const content2 = screen.getByTestId('content-2');
    expect(content2).toHaveAttribute('data-state', 'open');
  });


  test('should apply the open state class to the trigger when clicked', () => {
    render(<TestAccordion />);


    const trigger2 = screen.getByText('Métodos de pago');


    fireEvent.click(trigger2);


    expect(trigger2).toHaveAttribute('data-state', 'open');


    expect(trigger2).toHaveClass('[&[data-state=open]>svg]:rotate-180');
  });
});
