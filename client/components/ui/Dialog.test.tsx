import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';


vi.mock('@/lib/utils', () => ({

  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));


const TestDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button data-testid="open-button">Abrir Modal</button>
    </DialogTrigger>
    <DialogContent data-testid="dialog-content">
      <DialogHeader>
        <DialogTitle>Título del Modal</DialogTitle>
        <DialogDescription>Descripción de la prueba.</DialogDescription>
      </DialogHeader>
      <div data-testid="modal-body">Contenido Principal</div>
      <DialogFooter>
        <button data-testid="footer-button">Guardar</button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

describe('Dialog Component', () => {


  test('should open the dialog when the trigger button is clicked', async () => {
    render(<TestDialog />);

    const openButton = screen.getByTestId('open-button');


    expect(screen.queryByText('Título del Modal')).not.toBeInTheDocument();


    fireEvent.click(openButton);



    const title = await waitFor(() => screen.getByText('Título del Modal'));


    expect(title).toBeInTheDocument();
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });


  test('should render header, description, and footer content correctly', async () => {
    render(<TestDialog />);

    const openButton = screen.getByTestId('open-button');
    fireEvent.click(openButton);


    await waitFor(() => {
        expect(screen.getByText('Título del Modal')).toBeInTheDocument();
        expect(screen.getByText('Descripción de la prueba.')).toBeInTheDocument();
        expect(screen.getByText('Contenido Principal')).toBeInTheDocument();
        expect(screen.getByTestId('footer-button')).toBeInTheDocument();
    });
  });


  test('should close the dialog when the close button (X icon) is clicked', async () => {
    render(<TestDialog />);

    const openButton = screen.getByTestId('open-button');
    fireEvent.click(openButton);


    await waitFor(() => screen.getByTestId('dialog-content'));


    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();


    fireEvent.click(closeButton);


    await waitFor(() => {

        expect(screen.queryByText('Contenido Principal')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });


  test('should close the dialog when the ESC key is pressed', async () => {
    render(<TestDialog />);

    const openButton = screen.getByTestId('open-button');
    fireEvent.click(openButton);


    await waitFor(() => expect(screen.getByText('Contenido Principal')).toBeInTheDocument());


    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });


    await waitFor(() => {
        expect(screen.queryByText('Contenido Principal')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

});
