import { Recipient } from "../models/recipient";
type Action =
  | { type: "SELECT_EMAIL"; email: string }
  | {
      type: "SELECT_ALL";
      domain: string;
      isSelected: boolean;
      recipientsByDomain: { [domain: string]: Recipient[] };
    }
  | { type: "REMOVE"; emails: string[] }
  | { type: "RESET_SELECTION" };

export const selectionReducer = (
  state: {
    selectedEmails: string[];
    selectAllByDomain: { [domain: string]: boolean };
  },
  action: Action
) => {
  switch (action.type) {
    case "SELECT_EMAIL": {
      const { email } = action;
      const isSelected = state.selectedEmails.includes(email);
      return {
        ...state,
        selectedEmails: isSelected
          ? state.selectedEmails.filter((e) => e !== email)
          : [...state.selectedEmails, email],
      };
    }
    case "SELECT_ALL": {
      const { domain, isSelected, recipientsByDomain } = action;

      const emailsInDomain = (recipientsByDomain[domain] || []).map(
        (r) => r.email
      );

      return {
        ...state,
        selectedEmails: isSelected
          ? [...new Set([...state.selectedEmails, ...emailsInDomain])]
          : state.selectedEmails.filter(
              (email) => !emailsInDomain.includes(email)
            ),
        selectAllByDomain: {
          ...state.selectAllByDomain,
          [domain]: isSelected,
        },
      };
    }

    case "REMOVE": {
      const { emails } = action;
      return {
        ...state,
        selectedEmails: state.selectedEmails.filter(
          (email) => !emails.includes(email)
        ),
      };
    }
    case "RESET_SELECTION":
      return { selectedEmails: [], selectAllByDomain: {} };
    default:
      return state;
  }
};
