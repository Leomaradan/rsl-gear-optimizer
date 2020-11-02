import { Orderable } from "models/Orderable";

const reorder = <T extends Orderable>(
  list: T[],
  updatedItem: T,
  newPosition: number
): T[] => {
  const ordered = list
    .filter((l) => l.order !== updatedItem.order && l.order >= 0)
    .sort((a, b) => a.order - b.order);

  const before = ordered
    .filter((o) => o.order < newPosition)
    .map((o, index) => ({ ...o, order: index }));

  const current: T = { ...updatedItem, order: before.length };

  const after = ordered
    .filter((o) => o.order >= newPosition)
    .map((o, index) => ({ ...o, order: index + current.order + 1 }));

  const newList = [...before, current, ...after];
  const negative = list
    .filter((l) => l.order < 0)
    .sort((a, b) => a.order - b.order)
    .map((n, index) => ({ ...n, order: newList.length + index }));
  return [...newList, ...negative];
};

export default reorder;
