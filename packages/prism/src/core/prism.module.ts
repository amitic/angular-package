// @angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// internal
import { PrismComponent } from './prism.component';

// common
const COMMON_DECLARATIONS_EXPORTS = [ PrismComponent ];

/**
 * Angular Module for Prism
 * @export
 * @class PrismModule
 */
@NgModule({
  declarations: COMMON_DECLARATIONS_EXPORTS,
  exports: COMMON_DECLARATIONS_EXPORTS,
  imports: [ CommonModule, BrowserModule ]
})
export class ApPrismModule { }
