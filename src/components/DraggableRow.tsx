import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    ROW: 'row',
  };
  interface DraggableRowProps {
    banner: any;
    index: number;
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    onEdit: (banner: any) => void;
    onCheckboxChange: (id: string, isChecked: boolean) => void;
    isChecked: boolean;
  }
export default function DraggableRow({ banner, index, moveRow, onEdit, onCheckboxChange, isChecked }: DraggableRowProps) {
    const ref = React.useRef<HTMLTableRowElement>(null);
  
    const [, drop] = useDrop({
      accept: 'row',
      hover(item: { index: number }, monitor) {
        if (!ref.current) return;
  
        const dragIndex = item.index;
        const hoverIndex = index;
  
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) return;
  
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current.getBoundingClientRect();
  
        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
  
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  
        // Only perform the move when the mouse has crossed half of the item's height
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
  
        // Perform the move
        moveRow(dragIndex, hoverIndex);
  
        // Note: we're mutating the monitor item here!
        item.index = hoverIndex;
      },
    });
  
    const [{ isDragging }, drag] = useDrag({
      type: 'row',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    drag(drop(ref));
  
    return (
      <tr
        ref={ref}
        style={{ opacity: isDragging ? 0 : 1 }}
        className="cursor-move"
      >
              <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheckboxChange(banner.id, e.target.checked)}
        />
      </td>
        <td className="px-6 py-4 whitespace-nowrap">{banner.id}</td>
        <td className="px-6 py-4 whitespace-nowrap">{banner.name}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <img src={banner.image} alt={banner.name} className="w-24 h-16" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{banner.banner_type}</td>
        <td className="px-6 py-4 whitespace-nowrap">{banner.catalog_id}</td>
        <td className="px-6 py-4 whitespace-nowrap">{banner.status}</td>
        <td className="px-6 py-4 whitespace-nowrap">
        <button
          className="px-4 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => onEdit(banner)}
        >
          Edit
        </button>
        </td>
      </tr>
    );
  }
  