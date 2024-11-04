import { useState } from "react";
import AvailableRecipients from "../available-recipients-component/AvailableRecipients";
import SelectedRecipients from "../selected-recipients-component/SelectedRecipients";
import { Recipient } from "../../models/recipient";
import { Container } from "./styles";

interface MainComponentProps {
  recipientData: Recipient[];
}

const MainComponent = ({ recipientData }: MainComponentProps) => {
  const [recipients, setRecipients] = useState<Recipient[]>(recipientData);

  const addSelectedRecipients = (emails: string[]) => {
    setRecipients((prevRecipients) =>
      prevRecipients.map((recipient) =>
        emails.includes(recipient.email)
          ? { ...recipient, isSelected: true }
          : recipient
      )
    );
  };

  const removeSelectedRecipients = (emails: string[]) => {
    setRecipients((prevRecipients) =>
      prevRecipients.map((recipient) =>
        emails.includes(recipient.email)
          ? { ...recipient, isSelected: false }
          : recipient
      )
    );
  };

  const addNewRecipient = (email: string) => {
    setRecipients((prevRecipients) => [
      ...prevRecipients,
      { email, isSelected: false },
    ]);
  };

  const availableRecipients = recipients.filter(
    (recipient) => !recipient.isSelected
  );
  const selectedRecipients = recipients.filter(
    (recipient) => recipient.isSelected
  );

  return (
    <Container>
      <AvailableRecipients
        recipients={availableRecipients}
        addSelectedRecipients={addSelectedRecipients}
        addNewRecipient={addNewRecipient}
      />

      <SelectedRecipients
        recipients={selectedRecipients}
        removeSelectedRecipients={removeSelectedRecipients}
      />
    </Container>
  );
};

export default MainComponent;
