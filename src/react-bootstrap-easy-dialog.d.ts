import type { ButtonProps, FormControlProps } from "react-bootstrap";

interface IOptions {
  title?: string;
  inputProps?: FormControlProps;
  cancelButtonProps?: ButtonProps;
  confirButtonProps?: ButtonProps;
  autoFocus?: boolean | "select";
  stubborn?: boolean;
}

type Alert = (text: string, options?: IOptions) => Promise<boolean>;
type Confirm = (text: string, options?: IOptions) => Promise<boolean>;
type Prompt = (text: string, options?: IOptions) => Promise<string | null>;

declare module "react-bootstrap-easy-dialog" {
  const DialogProvider: React.Provider;
  const useDialog: () => {
    alert: Alert;
    confirm: Confirm;
    prompt: Prompt;
  };
}
