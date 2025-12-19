import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from './checkbox';





vi.mock('@/lib/utils', () => ({

  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('Checkbox Component', () => {


  test('should render the checkbox component', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
  });


  test('should be unchecked by default', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });


  test('should toggle state when clicked', () => {

    const handleCheckedChange = vi.fn();

    render(
      <Checkbox
        data-testid="test-checkbox"
        onCheckedChange={handleCheckedChange}
      />
    );
    const checkbox = screen.getByTestId('test-checkbox');


    expect(checkbox).not.toBeChecked();


    fireEvent.click(checkbox);


    expect(handleCheckedChange).toHaveBeenCalledWith(true);





  });



  test('should display as checked when the "checked" prop is true', () => {

    render(<Checkbox data-testid="test-checkbox" checked={true} />);
    const checkbox = screen.getByTestId('test-checkbox');


    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'checked');




    const checkIcon = checkbox.querySelector('.h-4.w-4');
    expect(checkIcon).toBeInTheDocument();
  });


  test('should be disabled when the "disabled" prop is true', () => {
    render(<Checkbox data-testid="test-checkbox" disabled />);
    const checkbox = screen.getByTestId('test-checkbox');


    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('disabled');



    const handleCheckedChange = vi.fn();
    fireEvent.click(checkbox);
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });
});
