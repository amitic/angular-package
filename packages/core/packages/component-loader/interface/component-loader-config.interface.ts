/**
 * @export
 * @template T Component type to load.
 */
export interface ComponentLoaderConfigInterface<T> {
  component: T;
  componentPropertyName?: string;
  container: string;
  properties?: Array<string>;
  prefix?: string;
  suffix?: string;
}
