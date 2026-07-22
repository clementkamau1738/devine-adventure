// `@mailchimp/mailchimp_marketing` ships no type declarations of its own.
// This covers only the surface this codebase actually calls.
declare module '@mailchimp/mailchimp_marketing' {
  export interface Config {
    apiKey: string;
    server: string;
  }

  export interface ListMemberRequest {
    email_address: string;
    status: string;
    merge_fields: Record<string, string>;
    tags: string[];
  }

  export interface ListsApi {
    addListMember(listId: string, body: ListMemberRequest): Promise<unknown>;
  }

  export interface SendTemplateMessage {
    to: { email: string; name: string; type: 'to' }[];
    subject: string;
    from_email: string;
    from_name: string;
    merge_vars: { rcpt: string; vars: { name: string; content: string }[] }[];
  }

  export interface SendTemplateRequest {
    template_name: string;
    template_content: unknown[];
    message: SendTemplateMessage;
  }

  // Not part of the Marketing API — the SDK has no Mandrill/transactional
  // `messages` client. Declared optional/undefined to keep the existing
  // `if (!messages) return;` runtime guard honest rather than papering over it.
  export interface MessagesApi {
    sendTemplate(request: SendTemplateRequest): Promise<unknown>;
  }

  const mailchimp: {
    setConfig(config: Config): void;
    lists: ListsApi;
    messages?: MessagesApi;
  };

  export default mailchimp;
}
