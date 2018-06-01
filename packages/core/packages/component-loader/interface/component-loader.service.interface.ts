import {
  ComponentFactoryResolver,
  // ComponentRef,
  ElementRef
} from '@angular/core';

// import { ComponentLoaderService } from '../src/component-loader.service';
import { ComponentLoaderCommonInterface, ComponentLoaderConfigInterface } from '.';

/**
 * @export
 * @extends {ComponentLoaderCommonInterface<T>}
 * @template T Type of component to load.
 */
export interface ComponentLoaderServiceInterface<T> extends ComponentLoaderCommonInterface<T> {

  __link?: (<S>(properties: Array<string>, source: S) => this);

  componentFactoryResolver: ComponentFactoryResolver;
  componentPropertyName: string;
  elementRef: ElementRef;
  prefix: string;
  suffix: string;

  init: (<S>(config: ComponentLoaderConfigInterface<T>, source?: S) => this);
}
