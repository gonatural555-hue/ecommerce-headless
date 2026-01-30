type Messages = Record<string, any>;

export function getMessage(messages: Messages, key: string): string {
  return key.split(".").reduce((acc: any, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return acc[part];
    }
    return "";
  }, messages) as string;
}

export function createTranslator(messages: Messages) {
  return (key: string, fallback = "") => {
    const value = getMessage(messages, key);
    return value || fallback || key;
  };
}

