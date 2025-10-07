import { render, screen } from '@testing-library/react';
import React from 'react';
// Importamos el componente Input (asumiendo que está en el path "@/components/ui/input")
import { Input } from '@/components/ui/input';
// Importamos cn para verificar las clases de Tailwind

// Mockeamos la función cn si no es accesible globalmente, para que devuelva la cadena de clases combinadas.
// Esto ayuda a simular cómo Tailwind combina clases.
vi.mock('@/lib/utils', () => ({
    cn: (...args: (string | undefined)[]) => args.filter(Boolean).join(' '),
}));

describe('Input Component', () => {
    // 1. Renderizado Básico y Rol
    test('should render an input element with the correct default role', () => {
        render(<Input data-testid="test-input" />);
        const inputElement = screen.getByTestId('test-input');

        // El elemento debe estar presente en el documento y tener el tag 'input'
        expect(inputElement).toBeInTheDocument();
        expect(inputElement.tagName).toBe('INPUT');
    });

    // 2. Aplicación de Tipos (Type attribute)
    test('should apply the specified type attribute (e.g., "email")', () => {
        render(<Input type="email" data-testid="email-input" />);
        const inputElement = screen.getByTestId('email-input');

        expect(inputElement).toHaveAttribute('type', 'email');
    });

    // 3. Renderizado con Placeholder
    test('should display the correct placeholder text', () => {
        const placeholderText = 'Escribe tu nombre aquí';
        render(<Input placeholder={placeholderText} />);

        // Usamos getByPlaceholderText para verificar el placeholder
        expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
    });

    // 4. Propiedad 'disabled'
    test('should render the input as disabled when the prop is passed', () => {
        render(<Input disabled data-testid="disabled-input" />);
        const inputElement = screen.getByTestId('disabled-input');

        // Verifica el atributo HTML 'disabled'
        expect(inputElement).toBeDisabled();

        // Verifica que las clases de estilo para deshabilitado estén presentes
        // El componente tiene "disabled:cursor-not-allowed disabled:opacity-50"
        expect(inputElement).toHaveClass('disabled:cursor-not-allowed disabled:opacity-50');
    });

    // 5. Aplicación de clases personalizadas (className merging)
    test('should correctly merge custom classes with default classes', () => {
        const customClass = 'border-red-500 font-bold';
        render(<Input className={customClass} data-testid="class-input" />);
        const inputElement = screen.getByTestId('class-input');

        // Las clases base siempre deben estar presentes
        expect(inputElement).toHaveClass('flex h-10 w-full rounded-md border border-input');

        // Las clases personalizadas deben estar presentes
        expect(inputElement).toHaveClass(customClass);
    });

    // 6. Test de Ref Forwarding
    test('should correctly forward the ref to the underlying DOM element', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Input ref={ref} />);

        // Verifica que la referencia esté apuntando al elemento HTMLInputElement
        expect(ref.current).toBeInstanceOf(HTMLInputElement);

        // Opcional: verifica una propiedad del elemento referenciado
        expect(ref.current).toBeInTheDocument();
    });
});
