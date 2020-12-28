/* eslint-disable react/jsx-props-no-spreading */

import React from "react";
import Downshift from "downshift";
import { Dropdown } from "react-bootstrap";

export interface IDropdownSelectItem {
  value: string;
  text: string;
}

type IGetClearCallback = (clear: () => void) => void;
interface IDropdownSelectProps {
  items: IDropdownSelectItem[];
  value?: string;
  onChange(value: IDropdownSelectItem | null): void;
  getClear?: IGetClearCallback;
  id?: string;
  disabled?: boolean;
  required?: boolean;
}

const DropdownSelect = ({
  items,
  onChange,
  getClear,
  value,
  id,
  disabled,
  required,
}: IDropdownSelectProps): JSX.Element => {
  const initialSelectedItem = items.find((i) => i.value === value);

  return (
    <Downshift
      id={id}
      onChange={(selection: IDropdownSelectItem | null) =>
        onChange(selection ?? null)
      }
      itemToString={(item) => (item ? item.text : "")}
      initialSelectedItem={initialSelectedItem}
    >
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        getRootProps,
        clearSelection,
      }) => {
        if (getClear) {
          getClear(() => {
            clearSelection();
          });
        }

        return (
          <div>
            <div
              style={{ display: "flex", width: "100%" }}
              {...getRootProps(undefined, {
                suppressRefError: true,
              })}
            >
              <input
                className="form-control form-control-sm custom-control"
                disabled={disabled}
                required={required}
                {...getInputProps()}
              />
            </div>
            <div className="btn-group">
              {isOpen ? (
                <div style={{ display: "block" }} className="dropdown-menu">
                  {items
                    .filter(
                      (item) =>
                        !inputValue ||
                        item.text
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((item, index) => (
                      <Dropdown.Item
                        key={item.value}
                        active={selectedItem === item}
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                        })}
                      >
                        {item.text}
                      </Dropdown.Item>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};

export default DropdownSelect;
