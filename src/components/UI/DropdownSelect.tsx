import Downshift from "downshift";
import { Dropdown } from "react-bootstrap";

export interface IDropdownSelectItem {
  text: string;
  value: string;
}

type IGetClearCallback = (clear: () => void) => void;
interface IDropdownSelectProps {
  disabled?: boolean;
  getClear?: IGetClearCallback;
  id?: string;
  items: IDropdownSelectItem[];
  required?: boolean;
  value?: string | number;
  onChange(value: null | IDropdownSelectItem): void;
}

const DropdownSelect = ({
  disabled,
  getClear,
  id,
  items,
  onChange,
  required,
  value,
}: IDropdownSelectProps): JSX.Element => {
  const valueStr = typeof value === "number" ? String(value) : value;

  const initialSelectedItem = items.find((i) => i.value === valueStr);

  return (
    <Downshift
      id={id}
      initialSelectedItem={initialSelectedItem}
      itemToString={(item) => (item ? item.text : "")}
      onChange={(selection: IDropdownSelectItem | null) =>
        onChange(selection ?? null)
      }
    >
      {({
        clearSelection,
        getInputProps,
        getItemProps,
        getRootProps,
        inputValue,
        isOpen,
        selectedItem,
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
                <div className="dropdown-menu" style={{ display: "block" }}>
                  {items
                    .filter((item) => {
                      return (
                        !inputValue ||
                        item.text
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      );
                    })
                    .slice(0, 5)
                    .map((item, index) => (
                      <Dropdown.Item
                        active={selectedItem === item}
                        key={item.value}
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

DropdownSelect.defaultProps = {
  disabled: false,
  getClear: undefined,
  id: undefined,
  required: false,
  value: "",
};

export default DropdownSelect;
