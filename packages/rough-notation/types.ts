import type { ReactNode } from "react";

export type types = "underline" | "box" | "circle" | "highlight" | "strike-through" | "crossed-off" | "bracket";

type brackets = "left" | "right" | "top" | "bottom";

interface RoughNotationProperties {
  animate?: boolean;
  animationDelay?: number;
  animationDuration?: number;
  brackets?: brackets | brackets[];
  color?: string;
  iterations?: number;
  multiline?: boolean;
  order?: number | string;
  padding?: number | [number, number, number, number] | [number, number];
  strokeWidth?: number;
}

export interface RoughNotationProps extends RoughNotationProperties {
  children: ReactNode;
  customElement?: string;
  getAnnotationObject?: (annotation: Annotation) => void;
  show?: boolean;
  type: types;
}

export interface Annotation extends RoughNotationProperties {
  isShowing(): boolean;
  show(): void;
  hide(): void;
  remove(): void;
}

export interface Props {
  children: ReactNode;
}

export interface RoughNotationGroupProps {
  children: React.ReactNode;
  show?: boolean;
}

export type State = {
  annotations: Array<Payload>;
};

export type Payload = {
  annotation: React.RefObject<Annotation | undefined>;
  order: number | undefined;
};

export type Action = {
  type: "ADD";
  payload: Payload;
};

export type Dispatch = (action: Action) => void;
