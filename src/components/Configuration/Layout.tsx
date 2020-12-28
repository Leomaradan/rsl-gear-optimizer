import styled from "styled-components";

export const Textarea = styled.textarea.attrs(() => ({
  className: "form-control",
}))`
  flex: 1;
`;
export const FormRow = styled.div.attrs(() => ({
  className: "form-group row",
}))``;
export const FormLabel = styled.label.attrs(() => ({
  className: "col-sm-4 col-form-label",
}))``;
export const FormInput = styled.div.attrs(() => ({ className: "col-sm-8" }))``;
