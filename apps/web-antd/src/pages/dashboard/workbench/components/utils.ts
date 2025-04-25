import { type Active, type DataRef, type Over } from '@dnd-kit/core';

import { type ColumnDragData } from './BoardColumn';
import { type TaskDragData } from './TaskCard';

type DraggableData = ColumnDragData | TaskDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: null | T | undefined,
): entry is {
  data: DataRef<DraggableData>;
} & T {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}
