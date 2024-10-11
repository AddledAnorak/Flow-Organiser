import type { Node, BuiltInNode } from '@xyflow/react';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type ContentEditableNode = Node<{ label: string }, 'content-editable'>;
export type AppNode = BuiltInNode | PositionLoggerNode | ContentEditableNode;
