export interface IServiceProps<T> {
  success(data: T): void;
  fail?(errorMessage?: string): void;
}

export type IServiceStatus = "Idle" | "Loading" | "Done" | "Error";
