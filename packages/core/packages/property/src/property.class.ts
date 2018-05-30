import { StoreOriginalClass } from '../../store';
import { PrefixSuffixClass } from '../../src/prefixsuffix.class';
import { Getter } from '../type/getter.type';
import { Setter } from '../type/setter.type';

/**
 * Wrap indicated properties of source component with instance dynamic component.
 * @export
 */
export class PropertyClass extends PrefixSuffixClass {

  /**
   * Instance of store.
   */
  private store: StoreOriginalClass = new StoreOriginalClass();

  /**
   * List of properties that were being binded.
   */
  private _binded: Array<string> = [];
  set binded(property: string | Array<string> | number) {
    if (property instanceof Array) {
      property.forEach(p => {
        this._binded.push(p);
      });
    }
    if (typeof property === 'string') {
      this._binded.push(property);
    }
    if (typeof property === 'number') {
      this._binded.splice(property, 1);
    }
  }
  get binded(): string | Array<string> | number {
    return this._binded;
  }

  /**
   * List of properties that were being wrapped.
   */
  private wrapped: Array<string> = [];

  /**
   * Creates an instance of PropertyClass.
   * @param [prefix] Prefix of new property name.
   * @param [suffix] Prefix of new property name.
   */
  constructor(prefix?: string, suffix?: string) {
    super(prefix, suffix);
  }

  /**
   * @template S Component source type.
   * @template T Component target type.
   * @param source Component as Function or as json object to bind its properties to the target.
   * @param properties Properties names source object to be binded with target properties.
   * @param target Target to have properties binded to source properties.
   */
  bind<S, T = string>(source: Function | S, properties: string | Array<string>, target: T): void {
    try {
      if (source) {
        if (properties instanceof Array) {
          properties.forEach((property: string) => {
            if (typeof target === 'string') {
              this._bind(source, property, target);
            }
          });
        } else if (typeof target === 'string') {
          this._bind(source, properties, target);
        }
      }
    } catch (e) {
      if (e instanceof TypeError) {
      } else if (e instanceof RangeError) {
      } else if (e instanceof EvalError) {
      } else {
      }
      console.warn(e.message);
    } finally { }
  }

  /**
   * Remove setter/getter and from binded/wrapped indicated properties by names.
   * @template S Component source type.
   * @template T Component target type.
   * @param source Usually component as Function or as json object to clear properties.
   * @param properties Name of properties to be cleared in source component.
   */
  clear<S>(source: Function | S, properties?: string | Array<string>): void {
    try {
      if (source) {
        const p = (properties) ? (typeof properties === 'string') ? [properties] : properties : this.binded;
        if (p instanceof Array) {
          p.forEach((property: string) => this._clear(source, property));
        }
      }
    } catch (e) {
      if (e instanceof TypeError) {
      } else if (e instanceof RangeError) {
      } else if (e instanceof EvalError) {
      } else {
      }
      console.warn(e.message);
    }
  }

  /**
   * Define new property in source object.
   * @template S Component source type.
   * @param source Component as Function or as json object to define property.
   * @param property Name of defined property.
   * @param descriptor Configuration of defining property.
   */
  define<S>(source: Function | S, property: string, descriptor: ThisType<any>): void {
    Object.defineProperties(
      (source instanceof Function) ? source.prototype : source, {
        [property]: descriptor
      }
    );
  }

  /**
   * Method to wrap specified properties with setter and getter callback method.
   * @template S Component source type.
   * @template R Result type of `setter()` and `getter()` function.
   * @param source Function or component.
   * @param properties Names of properties to be wrapped.
   * @param setter Callback function invoked on set.
   * @param getter Callback function invoked on get.
   */
  wrap<S, R = any>(source: Function | S, properties: string | Array<string>, setter: Setter<S, R>, getter: Getter<S, R>): void {
    try {
      if (source) {
        if (properties instanceof Array) {
          properties.forEach((property: string) => {
            this._wrap(source, property, setter, getter);
          });
        } else {
          this._wrap(source, properties, setter, getter);
        }
      }
    } catch (e) {
      if (e instanceof TypeError) {
      } else if (e instanceof RangeError) {
      } else if (e instanceof EvalError) {
      } else {
      }
      console.warn(e.message);
    }
  }

  /**
   * Bind property from component one to one to service in the same component with targetName.
   * @template S Component source type.
   * @param source Component as Function or as json object to bind its property to the target.
   * @param property Name of property to bind to target.
   * @param target Target to have property binded to source property.
   */
  private _bind<S, T, R = any>(source: Function | S, property: string, target: T | string): void {
    // Check if property is already used.
    if (this.binded instanceof Array && this.binded.includes(property) === false) {

      // Store original Setter/Getter.
      const store = this.store.setterGetter(source, property);

      // Create `get()` method.
      const get = (): R => {
        // Use old getter.
        if (store.getter[property]) {
          store.getter[property].apply(source, arguments);
        }
        if (typeof target === 'string' && source[target]) {
          return source[target][property];
        }
        
        return target[property];
      };

      // Create `set()` method.
      const set = (value: R): void => {
        // Use old setter.
        if (store.setter[property]) {
          store.setter[property].apply(source, arguments);
        }
        // TODO: Check source.
        if (typeof target === 'string') {
          source[target][property] = value;
        } else {
          target[property] = value;
        }
      };

      // Bind property to source.
      Object.defineProperties((source instanceof Function) ? source.prototype : source, { [property]: { get, set } });

      // Property is used.
      this.binded = property;
    }
  }

  /**
   * @template S Component source type.
   * @template T Component target type.
   * @param source Component as Function or as json object to clear property.
   * @param property Name of property to be cleared in source component.
   */
  private _clear<S>(source: Function | S, property: string): void {
    // Check if property is already used.
    if (this.binded instanceof Array && this.binded.includes(property) === true) {

      this.define(source, property, {
        get: undefined,
        set: undefined
      });

      // Property is removed from used.
      const index: number = this.binded.indexOf(property);
      if (index > -1) {
        this.binded = index;
      }
    }
  }

  /**
   * @template S Component source type.
   * @template T Component target type.
   * @param source Component as Function or as json object to wrap property.
   * @param property Name of component source property to be wrapped.
   * @param setter Function that is invoked in component source property `set`.
   * @param getter Function that is invoked in component source property `get`.
   */
  private _wrap<S, R = any>(source: Function | S, property: string, setter: Setter<S, R>, getter: Getter<S, R>): void {
    // Check if property is already used.
    if (this.wrapped.includes(property) === false) {

      // Store original Setter/Getter.
      const store = this.store.setterGetter(source, property);

      // Property with prefix and suffix.
      const sourcePropertyName = this.propertyName(property);

      // Wrap property.
      if (sourcePropertyName) {

        const get = (): R | undefined => {
          if (store.getter[property]) {
            return store.getter[property].apply(this, arguments);
          }
          // Use new getter.
          if (getter instanceof Function) {
            // return (getter(property, this)) ? getter(property, this) : this[sourcePropertyName];
            return getter(property, source) || this[sourcePropertyName];
          }
        };

        const set = (value: R | undefined) => {
          // Remember input value.
          this[sourcePropertyName] = value;

          // Use old setter.
          if (store.setter[property]) {
            store.setter[property].apply(this, arguments);
          }
          // Use setter function.
          if (setter instanceof Function) {
            setter(property, sourcePropertyName, source);
          }
        };

        // Create property with prefix and suffix to be wrapped by original name.
        // this.define(source, sourcePropertyName, )
        Object.defineProperty(
          (source instanceof Function) ? source.prototype : source,
          sourcePropertyName,
          { writable: true, value: (source[property]) ? source[property] : source[sourcePropertyName] }
        );

        Object.defineProperties((source instanceof Function) ? source.prototype : source, { [property]: { get, set } });
        this.wrapped.push(property);
      } else {
        throw new Error(`sourcePropertyName is not generated.`);
      }
    }
  }
}
