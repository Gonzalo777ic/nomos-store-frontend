import { render, screen } from '@testing-library/react';
import React from 'react';

import { Input } from '@/components/ui/input';




vi.mock('@/lib/utils', () => ({
    cn: (...args: (string | undefined)[]) => args.filter(Boolean).join(' '),
}));

describe('Input Component', () => {

    test('should render an input element with the correct default role', () => {
        render(<Input data-testid="test-input" />);
        const inputElement = screen.getByTestId('test-input');


        expect(inputElement).toBeInTheDocument();
        expect(inputElement.tagName).toBe('INPUT');
    });


    test('should apply the specified type attribute (e.g., "email")', () => {
        render(<Input type="email" data-testid="email-input" />);
        const inputElement = screen.getByTestId('email-input');

        expect(inputElement).toHaveAttribute('type', 'email');
    });


    test('should display the correct placeholder text', () => {
        const placeholderText = 'Escribe tu nombre aquí';
        render(<Input placeholder={placeholderText} />);


        expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
    });


    test('should render the input as disabled when the prop is passed', () => {
        render(<Input disabled data-testid="disabled-input" />);
        const inputElement = screen.getByTestId('disabled-input');


        expect(inputElement).toBeDisabled();



        expect(inputElement).toHaveClass('disabled:cursor-not-allowed disabled:opacity-50');
    });


    test('should correctly merge custom classes with default classes', () => {
        const customClass = 'border-red-500 font-bold';
        render(<Input className={customClass} data-testid="class-input" />);
        const inputElement = screen.getByTestId('class-input');


        expect(inputElement).toHaveClass('flex h-10 w-full rounded-md border border-input');


        expect(inputElement).toHaveClass(customClass);
    });


    test('should correctly forward the ref to the underlying DOM element', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Input ref={ref} />);


        expect(ref.current).toBeInstanceOf(HTMLInputElement);


        expect(ref.current).toBeInTheDocument();
    });
});
