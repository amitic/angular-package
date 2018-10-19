import { ElementRef } from '@angular/core';
import { CallbackType } from './prism.type';

export interface PrismInterface {
  async: boolean;
  callback?: CallbackType;
  code: string;
  el: ElementRef;
  language: string;
  interpolation?: Object;
  noEscape?: boolean;
}

export interface OptionsInterface  {
  async?: boolean;
  callback?: CallbackType;
  code?: string;
  language?: string;
  interpolation?: Object;
  noEscape?: boolean;
};
