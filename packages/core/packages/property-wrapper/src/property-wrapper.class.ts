import { StoreOriginalClass } from '../../store';
import { PrefixSuffixClass } from '../../src/prefixsuffix.class';
import { Getter } from '../type/getter.type';
import { Setter } from '../type/setter.type';

/**
 * Wrap indicated properties of source component with instance dynamic component.
 * @export
 * @class PropertyClass
 */
export class PropertyClass extends PrefixSuffixClass {

  /**
   * Instance of store.
   * @private
   * @type {StoreOriginalClass}
   * @memberof PropertyClass
   */
  private store: StoreOriginalClass = new StoreOriginalClass();

  /**
   * List of properties that were being binded.
   * @private
   * @type {string[]}
   * @memberof PropertyClass
   */
  private _binded: string[] = [];
  set binded(property: string | string[] | number) {
    if (property instanceof Array) {
      property.forEach(p => {
        this._binded.push(p);
      })
    }
    if (typeof property === 'string') {
      this._binded.push(property);
    }
    if (typeof property === 'number') {
      this._binded.splice(property, 1);
    }
  }
  get binded(): string | string[] | number {
    return this._binded;
  }

  /**
   * List of properties that were being wrapped.
   * @private
   * @type {string[]}
   * @memberof PropertyClass
   */
  private wrapped: string[] = [];

  /**
   * Creates an instance of PropertyClass.
   * @param {string} [prefix]
   * @param {string} [suffix]
   * @memberof PropertyClass
   */
  constructor(prefix?: string, suffix?: string) {
    super(prefix, suffix);
  }

  /**
   * @template S 
   * @template T 
   * @param {(Function | S)} source 
   * @param {(string | string[])} properties 
   * @param {T} targetName 
   * @memberof PropertyClass
   */
  bind<S, T = string>(source: Function | S, properties: string | string[], targetName: T): void {
    try {
      if (source) {
        if (properties instanceof Array) {
          properties.forEach((property: string) => {
            if (typeof targetName === 'string') {
              this._bind(source, property, targetName);
            }
          });
        } else if (typeof targetName === 'string') {
          this._bind(source, properties, targetName);
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
   * @template S 
   * @template T 
   * @param {(Function | S)} source 
   * @param {(string | string[])} properties 
   * @memberof PropertyClass
   */
  clear<S>(source: Function | S, properties?: string | string[]): void {
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
   * @template S 
   * @template R 
   * @param {(Function | S)} source 
   * @param {string} property 
   * @param {ThisType<any>} descriptor 
   * @memberof PropertyClass
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
   * @template S Source type.
   * @template R Result type of `setter()` and `getter()` function.
   * @param {(Function | S)} source Function or component.
   * @param {(string | string[])} properties Name of properties that will be wrapped.
   * @param {Setter<S, R>} setter Callback function used on set.
   * @param {Getter<S, R>} getter Callback function used on get.
   * @memberof PropertyClass
   */
  wrap<S, R = any>(source: Function | S, properties: string | string[], setter: Setter<S, R>, getter: Getter<S, R>): void {
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
   * @private
   * @template S 
   * @param {(Function | S)} source 
   * @param {string} property
   * @param {string} target Name of the object (for example service) in the same component that property will be binded to.
   * @memberof PropertyClass
   */
  private _bind<S, T = string, R = any>(source: Function | S, property: string, target: T): void {
    // Check if property is already used.
    if (this.binded instanceof Array && this.binded.includes(property) === false) {

      // Store original Setter/Getter.
      const store = this.store.setterGetter(source, property);

      // Bind property to source.
      Object.defineProperties((source instanceof Function) ? source.prototype : source, {
        [property]: {
          get: function (): R {
            // Use old getter.
            if (store.getter[property]) {
              store.getter[property].apply(this, arguments);
            }
            if (typeof target === 'string') {
              return this[target][property];
            } else {
              return target[property];
            }
          },
          set: function (value: R) {
            // Use old setter.
            if (store.setter[property]) { 
              store.setter[property].apply(this, arguments);
            }
            if (typeof target === 'string') {
              this[target][property] = value;
            } else {
              target[property] = value;
            }
          }
        }
      });

      // Property is used.
      this.binded = property;
    }
  }

  /**
   * @private
   * @template S 
   * @template T 
   * @template R 
   * @param {(Function | S)} source 
   * @param {string} property 
   * @memberof PropertyClass
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
   * @private
   * @template S 
   * @template R 
   * @param {(Function | S)} source 
   * @param {string} property 
   * @param {Setter<S, R>} setter 
   * @param {Getter<S, R>} getter 
   * @memberof PropertyClass
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

        // Create property with prefix and suffix to be wrapped by original name.
        // this.define(source, sourcePropertyName, )
        Object.defineProperty(
          (source instanceof Function) ? source.prototype : source,
          sourcePropertyName,
          { writable: true, value: (source[property]) ? source[property] : source[sourcePropertyName] }
        );  

        Object.defineProperties((source instanceof Function) ? source.prototype : source, {
          [property]: {
            get: function (): R | undefined {
              if (store.getter[property]) {
                return store.getter[property].apply(this, arguments);
              }
              // Use new getter.
              if (getter instanceof Function) {
                // return (getter(property, this)) ? getter(property, this) : this[sourcePropertyName];
                return getter(property, this) || this[sourcePropertyName];
              }
            },
            set: function (value: R | undefined) {
              // Remember input value.
              this[sourcePropertyName] = value;

              // Use old setter.
              if (store.setter[property]) {
                store.setter[property].apply(this, arguments);
              }
              // Use setter function.
              if (setter instanceof Function) {
                setter(property, sourcePropertyName, this);
              }
            }
          }
        });
        this.wrapped.push(property);
      } else {
        throw new Error(`sourcePropertyName is not generated.`);
      }
    }
  }
}
