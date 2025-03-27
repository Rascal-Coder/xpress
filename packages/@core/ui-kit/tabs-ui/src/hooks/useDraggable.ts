import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface DraggableTabPaneProps
  extends React.HTMLAttributes<HTMLDivElement> {
  'data-node-key': string;
}

const useDraggable = ({ ...props }: DraggableTabPaneProps) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props['data-node-key'],
    transition: null,
  });

  const style: React.CSSProperties = {
    ...props.style,
    cursor: isDragging ? 'grabbing' : 'default',
    transform: CSS.Transform.toString(
      transform && { ...transform, scaleX: 1, y: 0 },
    ),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 2 : 1,
  };

  return {
    draggableProps: {
      key: props['data-node-key'],
      ref: setNodeRef,
      style,
      ...attributes,
      ...listeners,
    },
    isDragging,
  };
};

export default useDraggable;
