import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import recipientsData from "../assets/recipientsData.json";
import AvailableRecipients from "../components/available-recipients-component/AvailableRecipients";
import MainComponent from "../components/main-component/MainComponent";

describe("AvailableRecipients Component", () => {
  const handleSelectMultiple = jest.fn();
  const handleAdd = jest.fn();
  const availableRecipients = recipientsData.filter(
    (recipient) => !recipient.isSelected
  );

  test("renders available recipients grouped by domain", () => {
    render(
      <AvailableRecipients
        recipients={availableRecipients}
        addSelectedRecipients={handleSelectMultiple}
        addNewRecipient={handleAdd}
      />
    );
    expect(screen.getByText("timescale.com")).toBeInTheDocument();
    expect(screen.getByText("qwerty.com")).toBeInTheDocument();
    expect(screen.getByText("awesome.com")).toBeInTheDocument();
  });

  test("allows users to add a new email", () => {
    render(
      <AvailableRecipients
        recipients={recipientsData}
        addSelectedRecipients={handleSelectMultiple}
        addNewRecipient={handleAdd}
      />
    );

    const input = screen.getByLabelText("Search or add email");

    fireEvent.change(input, { target: { value: "newuser@newdomain.com" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(handleAdd).toHaveBeenCalledWith("newuser@newdomain.com");
  });

  test("allows users to select an email through autocomplete", () => {
    render(
      <AvailableRecipients
        recipients={recipientsData}
        addSelectedRecipients={handleSelectMultiple}
        addNewRecipient={handleAdd}
      />
    );

    const input = screen.getByLabelText("Search or add email");

    fireEvent.change(input, { target: { value: "ann@timescale.com" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    const annEmailText = screen.getByText("ann@timescale.com");
    const annCheckbox = annEmailText
      .closest("div")
      ?.querySelector('input[type="checkbox"]');

    expect(annEmailText).toBeInTheDocument();
    expect(annCheckbox).toBeInTheDocument();

    expect((annCheckbox as HTMLInputElement).checked).toBe(true);
  });

  test("adds selected email to SelectedRecipients", () => {
    render(<MainComponent recipientData={recipientsData} />);

    const bobEmailText = screen.getByText("bob@timescale.com");
    const bobCheckbox = bobEmailText
      .closest("div")
      ?.querySelector('input[type="checkbox"]');
    expect(bobCheckbox).toBeInTheDocument();

    fireEvent.click(bobCheckbox);

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    expect(screen.getByText("bob@timescale.com")).toBeInTheDocument();
  });

  test("selects and deselects all emails in a domain", () => {
    render(
      <AvailableRecipients
        recipients={availableRecipients}
        addSelectedRecipients={handleSelectMultiple}
        addNewRecipient={handleAdd}
      />
    );

    const timescaleDomain = screen.getByText("timescale.com");
    const selectAllCheckbox = timescaleDomain
      .closest("div")
      ?.querySelector('input[type="checkbox"]');
    expect(selectAllCheckbox).toBeInTheDocument();
    fireEvent.click(selectAllCheckbox);

    expect((selectAllCheckbox as HTMLInputElement).checked).toBe(true);
    fireEvent.click(timescaleDomain);

    const bobEmailText = screen.getByText("bob@timescale.com");
    const annEmailText = screen.getByText("ann@timescale.com");

    const bobCheckbox = bobEmailText
      .closest("div")
      ?.querySelector('input[type="checkbox"]');

    expect(bobCheckbox).toBeInTheDocument();
    expect((bobCheckbox as HTMLInputElement).checked).toBe(true);

    const annCheckbox = annEmailText
      .closest("div")
      ?.querySelector('input[type="checkbox"]');

    expect(annCheckbox).toBeInTheDocument();
    expect((annCheckbox as HTMLInputElement).checked).toBe(true);
  });
});
