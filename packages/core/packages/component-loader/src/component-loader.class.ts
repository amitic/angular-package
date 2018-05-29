// external
import { ViewChild, ViewContainerRef, Type } from '@angular/core';

// internal
import { ComponentLoaderCommonClass } from './component-loader-common.aclass';
import { ComponentLoaderClassInterface } from '../interface';

/**
 * Class to handle loading dynamic component.
 * @export
 * @abstract
 * @class ComponentLoaderClass
 */
export
  class ComponentLoaderClass<T>
  extends ComponentLoaderCommonClass<T>
  implements ComponentLoaderClassInterface<T> {

  /**
   * Container property where Dynamic Component will be put in.
   * @public
   * @type {*}
   * @memberof ComponentLoaderClass
   */
  @ViewChild('container', { read: ViewContainerRef }) container?: ViewContainerRef;

  /**
   * Create in html `#container` resolved component.
   * @param {Type<D>} component Component that will be created.
   * @returns {this}
   * @memberof ComponentLoaderClass
   */
  __create<D = T>(component: Type<D>): this {
    if (!this.__component && this.container && component) {
      this.__component = this.container.createComponent(this.__resolve(component));
    }
    return this;
  }

  /**
   * Destroy component.
   * @returns {undefined}
   * @memberof ComponentLoaderClass
   */
  __destroy(): undefined {
    if (this.__component && this.container) {
      this.__component.destroy();
      this.__component = undefined;
      this.container.clear();
      return this.__component;
    }
  }

  /**
   * Link source(extended) component properties with dynamic component instance by using setters and getters.
   * @param {string[]} [p=this.__properties] Properties to be linked in source component with dynamic component.
   * @memberof ComponentLoaderClass
   */
  __link(p: string[] = this.__properties): void {
    this.__wrap(p, this,
      <PT>(property: string, sourcePropertyName: string) => {
        if (this.__set instanceof Function) {
          this.__set<PT>(property, this[sourcePropertyName]);
        }
      },
      <PT>(property: string): any => {
        if (this.__get instanceof Function) {
          return this.__get<PT>(property);
        }
      });
  }
}
