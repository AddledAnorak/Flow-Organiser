import { Handle, Position, NodeResizeControl, type NodeProps } from '@xyflow/react';

import { type ContentEditableNode } from './types';

import React, { useState, useRef, useEffect } from 'react';


const controlStyle = {
  background: 'transparent',
  border: 'none',
};

type EditableTextProps = {
  initialText: string,
  changeDataFunction: (text: string) => void,
}

function EditableText({ initialText = 'Double click to edit', changeDataFunction }: EditableTextProps) {
  const [text, setText] = useState(initialText)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    changeDataFunction(e.target.value)
  }

  return (
    <div className="p-4 flex justify-center items-center h-full">
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="border-none bg-transparent text-center w-full h-full resize-none p-0 outline-none"
        />
      ) : (
        <p
          onDoubleClick={handleDoubleClick}
          className="cursor-pointer p-1 rounded w-full text-center"
        >
          {text}
        </p>
      )}
    </div>
  )
}


function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#697484"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}



export function ContentEditableNode({ 
  data,
}: NodeProps<ContentEditableNode>) {
  const changeDataFunction = (text: string) => {
    data.label = text;
  }

  return (
    // <div className="react-flow__node-default">
    <div className='active:border-[#666666] hover:shadow-centered hover:shadow-gray-500 text-white bg-[#1e1e1e] rounded w-full h-full border-[1px] border-[#3c3c3c]'>

      <NodeResizeControl style={controlStyle} minWidth={100} minHeight={100}>
        <ResizeIcon />
      </NodeResizeControl>

      {data.label && <EditableText initialText={data.label} changeDataFunction={changeDataFunction}></EditableText>}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
