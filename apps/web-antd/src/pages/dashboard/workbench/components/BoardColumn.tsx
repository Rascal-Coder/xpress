import { GripVertical } from '@xpress/icons';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  cva,
  ScrollArea,
} from '@xpress-core/shadcn-ui';

import { type UniqueIdentifier, useDndContext } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';

import { type Task, TaskCard } from './TaskCard';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    'h-[calc(100vh-9rem)] min-h-[350px] w-[280px] sm:w-[300px] md:w-[320px] lg:w-[350px] flex flex-col flex-shrink-0 snap-center overflow-hidden',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary',
        },
      },
    },
  );

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
      <CardHeader className="space-between flex shrink-0 flex-row items-center border-b-2 p-2 text-left font-semibold sm:p-3 md:p-4">
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className="relative -ml-2 h-auto cursor-grab p-1"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <GripVertical />
        </Button>
        <span className="ml-auto"> {column.title}</span>
      </CardHeader>
      <ScrollArea className="flex-grow overflow-auto">
        <CardContent className="flex flex-col gap-1 p-1 sm:gap-2 sm:p-2">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('w-full h-auto px-4 pt-6 pb-4 overflow-x-auto', {
    variants: {
      dragging: {
        default: 'snap-x snap-mandatory',
        active: 'snap-none',
      },
    },
  });

  return (
    <div
      className={variations({
        dragging: dndContext.active ? 'active' : 'default',
      })}
    >
      <div className="mx-auto flex w-fit min-w-max items-start gap-4">
        {children}
      </div>
    </div>
  );
}
