import { useReducer, useState } from "react";
import * as EmailValidator from "email-validator";
import strings from "../../localization/translations";
import { groupByDomain } from "../../utils/getRecipientsByDomain";
import { selectionReducer } from "../../reducer/recipientsReducer";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Container, EmailItem, ErrorText } from "./styles";

interface Recipient {
  email: string;
  isSelected: boolean;
}

interface AvailableRecipientsProps {
  recipients: Recipient[];
  addSelectedRecipients: (emails: string[]) => void;
  addNewRecipient: (email: string) => void;
}

const { add, availableRecipients, addNewEmail } = strings.global;

const AvailableRecipients = ({
  recipients,
  addSelectedRecipients,
  addNewRecipient,
}: AvailableRecipientsProps) => {
  const [inputValue, setInputValue] = useState("");
  const [emailError, setEmailError] = useState("");

  const [state, dispatch] = useReducer(selectionReducer, {
    selectedEmails: [],
    selectAllByDomain: {},
  });

  const autocompleteData = [...recipients.map((r) => r.email)];
  const recipientsByDomain = groupByDomain(recipients);

  const handleAddSelectedRecipientsClick = () => {
    addSelectedRecipients(state.selectedEmails);
    dispatch({ type: "RESET_SELECTION" });
  };

  const handleAutoSelectEmail = () => {
    const isValidEmail = EmailValidator.validate(inputValue);
    if (isValidEmail) {
      const emailExists = recipients.some((r) => r.email === inputValue);
      if (emailExists) {
        setEmailError("Email already exists");
        return;
      }
      addNewRecipient(inputValue);
      setInputValue("");
      setEmailError("");
    } else {
      setEmailError("Email is invalid");
    }
  };

  const handleAutocompleteOnChange = (newValue: string | null) => {
    setInputValue(newValue || "");
    if (newValue && !state.selectedEmails.includes(newValue)) {
      dispatch({ type: "SELECT_EMAIL", email: newValue });
    }
  };

  const handleAutocompleteKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAutoSelectEmail();
    }
  };

  const handleOnChangeCheckboxAllDomains = (e, domain, isSelected) => {
    dispatch({
      type: "SELECT_ALL",
      domain,
      isSelected,
      recipientsByDomain: groupByDomain(recipients),
    });
  };

  return (
    <Container>
      <h2>{availableRecipients}</h2>
      <Autocomplete
        options={autocompleteData}
        freeSolo
        onChange={(event, newValue) => handleAutocompleteOnChange(newValue)}
        onKeyDown={handleAutocompleteKeyDown}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search or add email"
            placeholder="Type an email"
            error={!!emailError}
            helperText={emailError}
          />
        )}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          setEmailError("");
        }}
      />
      {emailError && <ErrorText>{emailError}</ErrorText>}

      <div style={{ padding: "25px" }}>
        {Object.keys(recipientsByDomain).map((domain) => (
          <Accordion
            style={{ border: "1px solid grey" }}
            defaultExpanded
            key={domain}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Checkbox
                checked={state.selectAllByDomain[domain] || false}
                onChange={(e) =>
                  handleOnChangeCheckboxAllDomains(e, domain, e.target.checked)
                }
              />

              <Typography display="flex" alignItems="center" fontSize="20px">
                {domain}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {recipientsByDomain[domain].map((recipient) => (
                <EmailItem key={recipient.email}>
                  <Checkbox
                    size="small"
                    checked={state.selectedEmails.includes(recipient.email)}
                    onChange={() =>
                      dispatch({ type: "SELECT_EMAIL", email: recipient.email })
                    }
                  />
                  {recipient.email}
                </EmailItem>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
        <Button
          onClick={handleAddSelectedRecipientsClick}
          disabled={state.selectedEmails.length === 0}
        >
          {add}
        </Button>
      </div>
    </Container>
  );
};

export default AvailableRecipients;
