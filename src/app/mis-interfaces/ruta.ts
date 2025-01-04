import {Coordinate} from "ol/coordinate";

export type RouteData = {
  code: string;
  routes: Route[];
};

// Tipo que representa una ruta
export type Route = {
  geometry: string;
  legs: Leg[];
};

// Tipo que representa un trayecto o "leg" de una ruta
export type Leg = {
  steps: Step[];
};

// Tipo que representa un paso o "step" dentro de un trayecto
export type Step = {
  geometry: string;
  maneuver: Maneuver;
  mode: string;
  driving_side: string;
  name: string;
  intersections: Intersection[];
  weight: number;
  duration: number;
  distance: number;
};

// Tipo que representa una maniobra en un paso
export type Maneuver = {
  bearing_after: number;
  bearing_before: number;
  location: number[];
  modifier: string;
  type: string;
  exit?: number;
};

// Tipo que representa una intersección
export type Intersection = {
  out: number;
  entry: boolean[];
  bearings: number[];
  location: number[];
};

