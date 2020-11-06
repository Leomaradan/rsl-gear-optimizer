/* eslint-disable react/jsx-props-no-spreading */

import React from "react";
import Downshift from "downshift";
import classNames from "classnames";

export interface DropdownSelectItem {
  value: string;
  text: string;
}

interface DropdownSelectProps {
  items: DropdownSelectItem[];
  value: string;
  onChange(value: DropdownSelectItem | null): void;
  id?: string;
}

export default ({
  items,
  onChange,
  value,
  id,
}: DropdownSelectProps): JSX.Element => {
  const initialSelectedItem = items.find((i) => i.value === value);

  return (
    <Downshift
      id={id}
      onChange={(selection: DropdownSelectItem | null) =>
        onChange(selection ?? null)
      }
      itemToString={(item) => (item ? item.text : "")}
      initialSelectedItem={initialSelectedItem}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        selectedItem,
        getRootProps,
      }) => (
        <>
          <div
            style={{ display: "inline-block", width: "100%" }}
            {...getRootProps(undefined, {
              suppressRefError: true,
            })}
          >
            <input
              className="form-control form-control-sm custom-control"
              {...getInputProps()}
            />
          </div>
          <ul
            className="list-group"
            style={{ position: "absolute", zIndex: "1" }}
            {...getMenuProps()}
          >
            {isOpen
              ? items
                  .filter(
                    (item) =>
                      !inputValue ||
                      item.text.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((item, index) => (
                    <li
                      className={classNames(
                        "list-group-item list-group-item-action",
                        { active: selectedItem === item }
                      )}
                      {...getItemProps({
                        key: item.value,
                        index,
                        item,
                      })}
                    >
                      {item.text}
                    </li>
                  ))
              : null}
          </ul>
        </>
      )}
    </Downshift>
  );
};
