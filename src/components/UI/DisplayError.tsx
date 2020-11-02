import React from "react";
import Error from "models/Error";

export default ({
  slot,
  errors,
}: {
  slot: string;
  errors: Error;
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
