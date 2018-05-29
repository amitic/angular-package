export type Getter<S, R = any> = (property: string, source?: S) => R;
