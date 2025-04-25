import type { UniqueIdentifier } from '@dnd-kit/core';

import { GripVertical } from '@xpress/icons';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  cva,
} from '@xpress-core/shadcn-ui';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { type ColumnId } from './KanbanBoard';

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva('', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary',
      },
    },
  });

  const getDraggingState = () => {
    if (isOverlay) return 'overlay';
    if (isDragging) return 'over';
    return undefined;
  };

  return (
    <Card
      className={variants({
        dragging: getDraggingState(),
      })}
      ref={setNodeRef}
      style={style}
    >
      <CardHeader className="space-between border-secondary relative flex flex-row border-b-2 px-3 py-3">
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className="text-secondary-foreground/50 -ml-2 h-auto cursor-grab p-1"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
        <Badge className="ml-auto font-semibold" variant={'outline'}>
          任务
        </Badge>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap px-3 pb-6 pt-3 text-left">
        {task.content}
      </CardContent>
    </Card>
  );
}
