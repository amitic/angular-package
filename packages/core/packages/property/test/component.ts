import { Component, OnInit } from '@angular/core';

import { PropertyClass } from '../src';

class TargetClass {
  firstname: string;
  surname: string;
}

@Component({
  template: `
  `
})
export class TestPropertyComponent implements OnInit {

  propertyClass: PropertyClass = new PropertyClass();

  firstname: string;
  surname: string;

  _age: number;
  set age(age: number) {
    this._age = age;
  }
  get age(): number {
    return this._age;
  }

  target = new TargetClass();

  constructor() {}

  ngOnInit(): void { }
}
