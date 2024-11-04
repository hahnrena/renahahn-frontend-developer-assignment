import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import recipientsData from "../assets/recipientsData.json";
import MainComponent from "../components/main-component/MainComponent";
import SelectedRecipients from "../components/selected-recipients-component/SelectedRecipients";

describe("SelectedRecipients Component", () => {
  const handleDeselectMultiple = jest.fn();

  const selectedRecipients = recipientsData.filter(
    (recipient) => recipient.isSelected
  );

  test("renders available recipients grouped by domain", () => {
    render(
      <SelectedRecipients
        recipients={selectedRecipients}
        removeSelectedRecipients={handleDeselectMultiple}
      />
    );
    expect(screen.getByText("qwerty.com")).toBeInTheDocument();
    expect(screen.getByText("hello.com")).toBeInTheDocument();
  });

  test("removes selected email to AvailableRecipients", () => {
    render(<MainComponent recipientData={recipientsData} />);

    const kateEmailText = screen.getByText("kate@qwerty.com");
    const kateCheckbox = kateEmailText
      .closest("div")
      ?.querySelector('input[type="checkbox"]');
    expect(kateCheckbox).toBeInTheDocument();

    fireEvent.click(kateCheckbox);

    const removeBtn = screen.getByText("Remove");
    fireEvent.click(removeBtn);

    expect(screen.getByText("kate@qwerty.com")).toBeInTheDocument();
  });

  test("selects and deselects all emails in a domain", () => {
    render(
      <SelectedRecipients
        recipients={selectedRecipients}
        removeSelectedRecipients={handleDeselectMultiple}
      />
    );

    const timescaleDomain = screen.getByText("qwerty.com");
    const selectAllCheckbox = timescaleDomain
      .closest("div")
      ?.querySelector('input[type="checkbox"]');
    expect(selectAllCheckbox).toBeInTheDocument();
    fireEvent.click(selectAllCheckbox);

    expect((selectAllCheckbox as HTMLInputElement).checked).toBe(true);
    fireEvent.click(timescaleDomain);

    const brianEmailText = screen.getByText("brian@qwerty.com");
    const kateEmailText = screen.getByText("kate@qwerty.com");

    const brianCheckbox = brianEmailText
      .closest("div")
      ?.querySelector('input[type="checkbox"]');

    expect(brianCheckbox).toBeInTheDocument();
    expect((brianCheckbox as HTMLInputElement).checked).toBe(true);

    const kateCheckbox = kateEmailText
      .closest("div")
      ?.querySelector('input[type="checkbox"]');

    expect(kateCheckbox).toBeInTheDocument();
    expect((kateCheckbox as HTMLInputElement).checked).toBe(true);
  });
});
