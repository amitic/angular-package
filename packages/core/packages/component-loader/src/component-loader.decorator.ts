import { ComponentLoaderConfigInterface } from '../interface';
// import { ComponentLoaderService } from './component-loader.service';
import { PropertyClass } from '../../property';

/**
 * Decorator to wrap `ComponentLoaderService` methods and link properties to dynamic component.
 * @export
 * @param config Main configuration.
 */
export function ComponentLoader<T>(config: ComponentLoaderConfigInterface<T>): Function {
  return (source: Function): void => {
    const wrapper: PropertyClass = new PropertyClass(config.prefix, config.suffix);
    const t: any = source;

    /*
      Prepare methods
    */
    const assign = (p: string | Array<string>): void => {
      t.componentLoaderService.__assign(p, t);
    };

    const create = (): any => {
      t.componentLoaderService.init(config, t);

      return t;
    };

    const destroy = (): void => {
      t.componentLoaderService.__destroy();
    };

    const get = (property: string): any => {
      return t.componentLoaderService.__get(property);
    };

    const set = (property: string, value: any): void => {
      t.componentLoaderService.__set(property, value);
    };

    const subscribe = (property: string, ...args: Array<any>): void => {
      t.componentLoaderService.__subscribe(property, ...args);
    };

    // Wrap component methods with loaderService methods.
    Object.defineProperties(source.prototype, {

      __assign: {
        value: assign
      },

      __component: {
        set: function __component(value: any): void {
          t.componentLoaderService.__component = value;
        },
        get: function __component(): any {
          return t.componentLoaderService.__component;
        }
      },

      __componentPropertyName: {
        set: function __componentPropertyName(value: string): void {
          t.componentLoaderService.componentPropertyName = value;
        },
        get: function __componentPropertyName(): string {
          return t.componentLoaderService.componentPropertyName;
        }
      },

      __create: {
        value: create
      },

      __destroy: {
        value: destroy
      },

      __get: {
        value: get
      },

      __prefix: {
        set: function __prefix(value: any): void {
          t.componentLoaderService.prefix = value;
        },
        get: function __prefix(): any {
          return t.componentLoaderService.prefix;
        }
      },

      __properties: {
        set: function __properties(value: any): void {
          t.componentLoaderService.properties = value;
        },
        get: function __properties(): any {
          return t.componentLoaderService.properties;
        }
      },

      __set: {
        value: set
      },

      __suffix: {
        set: function __suffix(value: any): void {
          t.componentLoaderService.suffix = value;
        },
        get: function __suffix(): any {
          return t.componentLoaderService.suffix;
        }
      },

      __subscribe: {
        value: subscribe
      }

    });

    if (config.properties) {
      wrapper.wrap<T, any>(source, config.properties,
        (property: string, sourcePropertyName: string, s: Function | T | undefined) => {
          if (s && s['__set'] instanceof Function) {
            s['__set'](property, s[sourcePropertyName]);
          }
        }
        ,
        (targetPropertyName: string, s?: T): any => {
          if (s) {
            if (s['__get'] instanceof Function) {
              return s['__get'](targetPropertyName);
            }
          }
      });
    }
  };
}
