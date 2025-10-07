import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// Importamos todos los componentes del Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'; // Asumiendo que esta es la ruta correcta

// Mock de la función 'cn' para evitar errores de alias y hoisting de Vitest
vi.mock('@/lib/utils', () => ({
  // Definimos la función 'cn' DENTRO del mock factory
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

// Componente de prueba simple para usar dentro del Dialog
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

  // --- 1. Prueba de Apertura ---
  test('should open the dialog when the trigger button is clicked', async () => {
    render(<TestDialog />);

    const openButton = screen.getByTestId('open-button');

    // El contenido del diálogo NO debe estar visible inicialmente
    expect(screen.queryByText('Título del Modal')).not.toBeInTheDocument();

    // Simular el clic para abrir
    fireEvent.click(openButton);

    // Usamos waitFor porque el modal se renderiza a través de un Portal
    // y puede ser asíncrono en JSDOM.
    const title = await waitFor(() => screen.getByText('Título del Modal'));

    // Verificamos que el contenido ahora es visible
    expect(title).toBeInTheDocument();
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  // --- 2. Prueba de Contenido ---
  test('should render header, description, and footer content correctly', async () => {
    render(<TestDialog />);

    const openButton = screen.getByTestId('open-button');
    fireEvent.click(openButton);

    // Esperamos a que el contenido esté disponible
    await waitFor(() => {
        expect(screen.getByText('Título del Modal')).toBeInTheDocument();
        expect(screen.getByText('Descripción de la prueba.')).toBeInTheDocument();
        expect(screen.getByText('Contenido Principal')).toBeInTheDocument();
        expect(screen.getByTestId('footer-button')).toBeInTheDocument();
    });
  });

  // --- 3. Prueba de Cierre (Usando el botón 'X') ---
  test('should close the dialog when the close button (X icon) is clicked', async () => {
    render(<TestDialog />);

    const openButton = screen.getByTestId('open-button');
    fireEvent.click(openButton);

    // Esperamos a que se abra y buscamos el botón de cierre
    await waitFor(() => screen.getByTestId('dialog-content'));

    // Radix usa un botón con el texto oculto "Close" (sr-only)
    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();

    // Simular el clic en el botón de cerrar
    fireEvent.click(closeButton);

    // Esperamos a que el diálogo desaparezca
    await waitFor(() => {
        // Se espera que el contenido principal NO esté en el documento
        expect(screen.queryByText('Contenido Principal')).not.toBeInTheDocument();
    }, { timeout: 200 }); // Damos un margen de tiempo para el fade out
  });

  // --- 4. Prueba de Cierre (Usando la tecla Escape) ---
  test('should close the dialog when the ESC key is pressed', async () => {
    render(<TestDialog />);

    const openButton = screen.getByTestId('open-button');
    fireEvent.click(openButton);

    // Verificamos que se abre
    await waitFor(() => expect(screen.getByText('Contenido Principal')).toBeInTheDocument());

    // Simular la presión de la tecla ESC en el cuerpo del documento
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    // Esperamos a que el diálogo desaparezca
    await waitFor(() => {
        expect(screen.queryByText('Contenido Principal')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

});
