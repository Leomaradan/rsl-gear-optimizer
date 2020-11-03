import { Errors } from "models";
import React from "react";

export default ({
  slot,
  errors,
}: {
  slot: string;
  errors: Errors;
}): JSX.Element => {
  const error = errors.find((e) => e.slot === slot);

  if (error) {
    return (
      <div className="alert alert-warning" role="alert">
        {error.text}
      </div>
    );
  }

  return <></>;
};
