export type Setter<S, R = any> = (property: string, sourcePropertyName: string, source?: Function | S) => R;
