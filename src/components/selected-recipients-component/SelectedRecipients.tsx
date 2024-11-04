import { useReducer } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  Button,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import strings from "../../localization/translations";
import { Recipient } from "../../models/recipient";
import { groupByDomain } from "../../utils/getRecipientsByDomain";
import { selectionReducer } from "../../reducer/recipientsReducer";
import { Container, EmailItem } from "./styles";

interface SelectedRecipientsProps {
  recipients: Recipient[];
  removeSelectedRecipients?: (emails: string[]) => void;
}

const {
  remove,
  selectedRecipients,
  emailRecipientsText,
  companyRecipientsText,
} = strings.global;

const SelectedRecipients = ({
  recipients,
  removeSelectedRecipients,
}: SelectedRecipientsProps) => {
  const [state, dispatch] = useReducer(selectionReducer, {
    selectedEmails: [],
    selectAllByDomain: {},
  });

  const companyRecipients = recipients.filter((recipient) =>
    recipient.email.endsWith("@timescale.com")
  );
  const emailRecipients = recipients.filter(
    (recipient) => !recipient.email.endsWith("@timescale.com")
  );

  const companyRecipientsByDomain = groupByDomain(companyRecipients);
  const emailRecipientsByDomain = groupByDomain(emailRecipients);

  const handleRemoveSelectedRecipientsClick = () => {
    removeSelectedRecipients(state.selectedEmails);
    dispatch({ type: "REMOVE", emails: state.selectedEmails });
    dispatch({ type: "RESET_SELECTION" });
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
      <h2>{selectedRecipients}</h2>
      <div style={{ width: "350px", padding: "25px" }}>
        <Accordion defaultExpanded style={{ border: "1px solid grey" }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>{companyRecipientsText}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {Object.keys(companyRecipientsByDomain).map((domain) => (
              <Accordion defaultExpanded key={domain}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Checkbox
                    checked={state.selectAllByDomain[domain] || false}
                    onChange={(e) =>
                      handleOnChangeCheckboxAllDomains(
                        e,
                        domain,
                        e.target.checked
                      )
                    }
                  />
                  <Typography
                    fontSize="20px"
                    alignItems="center"
                    display="flex"
                  >
                    {domain}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {companyRecipientsByDomain[domain].map((recipient) => (
                    <EmailItem
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                        justifyContent: "flex-end",
                      }}
                      key={recipient.email}
                    >
                      <Checkbox
                        size="small"
                        checked={state.selectedEmails.includes(recipient.email)}
                        onChange={() =>
                          dispatch({
                            type: "SELECT_EMAIL",
                            email: recipient.email,
                          })
                        }
                      />
                      <span
                        style={{
                          flexGrow: 1,
                          textAlign: "right",
                        }}
                      >
                        {recipient.email}
                      </span>
                    </EmailItem>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion
          style={{
            border: "1px solid grey",
          }}
          defaultExpanded
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>{emailRecipientsText}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.keys(emailRecipientsByDomain).map((domain) => (
              <Accordion
                style={{
                  border: "1px solid grey",
                }}
                defaultExpanded
                key={domain}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Checkbox
                    checked={state.selectAllByDomain[domain] || false}
                    onChange={(e) =>
                      handleOnChangeCheckboxAllDomains(
                        e,
                        domain,
                        e.target.checked
                      )
                    }
                  />
                  <Typography
                    fontSize="20px"
                    display="flex"
                    alignItems="center"
                  >
                    {domain}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {emailRecipientsByDomain[domain].map((recipient) => (
                    <EmailItem key={recipient.email}>
                      <Checkbox
                        size="small"
                        checked={state.selectedEmails.includes(recipient.email)}
                        onChange={() =>
                          dispatch({
                            type: "SELECT_EMAIL",
                            email: recipient.email,
                          })
                        }
                      />
                      <span>{recipient.email}</span>
                    </EmailItem>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
        <Button
          onClick={handleRemoveSelectedRecipientsClick}
          disabled={state.selectedEmails.length === 0}
        >
          {remove}
        </Button>
      </div>
    </Container>
  );
};

export default SelectedRecipients;
