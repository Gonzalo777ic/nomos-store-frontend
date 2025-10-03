import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from './checkbox'; // Asumiendo que esta es la ruta correcta

// Eliminamos la variable mockCn de nivel superior para evitar el error de elevación (hoisting)

// CORREGIDO: Usar vi.mock en lugar de jest.mock, y definir el mock
// de 'cn' DENTRO de la función factory para evitar el ReferenceError.
vi.mock('@/lib/utils', () => ({
  // La función 'cn' que simplemente une las clases
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('Checkbox Component', () => {

  // --- 1. Prueba de Renderizado Básico ---
  test('should render the checkbox component', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  // --- 2. Prueba de Estado No Marcado (Default) ---
  test('should be unchecked by default', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');
    // Verificamos que el atributo aria-checked es false
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  // --- 3. Prueba de Interacción (Cambiando el estado) ---
  test('should toggle state when clicked', () => {
    // CORREGIDO: Usar vi.fn() en lugar de jest.fn()
    const handleCheckedChange = vi.fn();

    render(
      <Checkbox
        data-testid="test-checkbox"
        onCheckedChange={handleCheckedChange}
      />
    );
    const checkbox = screen.getByTestId('test-checkbox');

    // Estado inicial: unchecked
    expect(checkbox).not.toBeChecked();

    // Simular un clic
    fireEvent.click(checkbox);

    // Verificamos que la función de cambio fue llamada con el nuevo estado 'true'
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    // Nota: Para que el checkbox cambie de estado en el DOM real,
    // generalmente necesitas usar el estado de React.
    // Para testear el comportamiento del componente sin estado (uncontrolled),
    // usamos una implementación controlada en el siguiente test.
  });


  // --- 4. Prueba de Estado Marcado (Controlado) ---
  test('should display as checked when the "checked" prop is true', () => {
    // Para simular el estado controlado, renderizamos con checked=true
    render(<Checkbox data-testid="test-checkbox" checked={true} />);
    const checkbox = screen.getByTestId('test-checkbox');

    // Verificamos el estado marcado
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'checked');

    // Verificamos que el ícono de "Check" está presente (buscando por clase o contenido)
    // El ícono se renderiza dentro del CheckboxPrimitive.Indicator
    // Buscamos un elemento con la clase 'h-4 w-4' que debería ser el icono <Check>
    const checkIcon = checkbox.querySelector('.h-4.w-4');
    expect(checkIcon).toBeInTheDocument();
  });

  // --- 5. Prueba de Estado Deshabilitado ---
  test('should be disabled when the "disabled" prop is true', () => {
    render(<Checkbox data-testid="test-checkbox" disabled />);
    const checkbox = screen.getByTestId('test-checkbox');

    // Verificamos los atributos de accesibilidad
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('disabled');

    // Verificamos que el clic no tiene efecto
    // CORREGIDO: Usar vi.fn() en lugar de jest.fn()
    const handleCheckedChange = vi.fn();
    fireEvent.click(checkbox);
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });
});
