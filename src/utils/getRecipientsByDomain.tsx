import { Recipient } from "../models/recipient";

export const groupByDomain = (
  recipients: Recipient[]
): { [domain: string]: Recipient[] } => {
  return recipients.reduce<{ [domain: string]: Recipient[] }>(
    (groups, recipient) => {
      const domain = recipient.email.split("@")[1];
      if (!groups[domain]) groups[domain] = [];
      groups[domain].push(recipient);
      return groups;
    },
    {}
  );
};
