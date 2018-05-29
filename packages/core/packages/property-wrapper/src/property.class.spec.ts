// Make describe visible.
import {

} from 'jasmine';

// external
import {
  // NO_ERRORS_SCHEMA, 
  // ViewChild,
  // ElementRef,
  // DebugElement
} from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
// import { By } from '@angular/platform-browser';
import {
  TestBed,
  async,
  // inject,
  ComponentFixture
} from '@angular/core/testing';

// internal
import { TestPropertyComponent } from '../test/component';
import { PropertyClass } from '.';

beforeAll(() => {
  TestBed.resetTestEnvironment();
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
});

describe('TestPropertyComponent', () => {

  let comp: TestPropertyComponent;
  let fixture: ComponentFixture<TestPropertyComponent>;
  // let debugElement: DebugElement;
  // let nativeElement: ElementRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestPropertyComponent
      ]
    }).compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(TestPropertyComponent);
    // debugElement = fixture.debugElement;
    // nativeElement = fixture.nativeElement;
    comp = fixture.componentInstance;
  });

  it('#1. should create test component', async(() => {
    expect(fixture).toBeDefined();
    expect(comp).toBeTruthy();
  }));

  it('#2. should have `propertyClass` instance.', async(() => {
    expect(comp.propertyClass instanceof PropertyClass).toBeTruthy();
  }));

  /*
    `bind()`
  */
  it('#3. should have bind working when properties is string.', async(() => {
    comp.propertyClass.bind(comp, 'firstname', 'target');
    comp.firstname = 'Lucas';
    expect(comp.firstname).toEqual(comp.target.firstname);
  }));

  it('#4. should have bind working when properties is array of string.', async(() => {
    comp.propertyClass.bind(comp, ['firstname', 'surname'], 'target');
    comp.firstname = 'Lucas';
    comp.surname = 'Tramp';
    expect(comp.firstname).toEqual(comp.target.firstname);
    expect(comp.surname).toEqual(comp.target.surname);
  }));

  it('#5. should have change firstname when binded with array of string.', async(() => {
    comp.propertyClass.bind(comp, ['firstname', 'surname'], 'target');
    comp.firstname = 'Lucas';
    comp.surname = 'Tramp';
    expect(comp.firstname).toEqual(comp.target.firstname);
    expect(comp.surname).toEqual(comp.target.surname);
    comp.firstname = 'Donald';
    expect(comp.firstname).toEqual(comp.target.firstname);
  }));

  /*
    `binded`
  */
  it('#6. Remove binded.', async(() => {
    comp.propertyClass.bind(comp, ['firstname', 'surname'], 'target');
    if (comp.propertyClass.binded instanceof Array) {
      const index: number = comp.propertyClass.binded.indexOf('surname');
      if (index > -1) {
        comp.propertyClass.binded = index;
      }
    }
    if (comp.propertyClass.binded instanceof Array) {
      expect(comp.propertyClass.binded.indexOf('surname')).toEqual(-1);
    }
  }));

  it('#7. Do not remove binded when index is string.', async(() => {
    comp.propertyClass.bind(comp, ['firstname', 'surname'], 'target');

    if (comp.propertyClass.binded instanceof Array) {
      const index: number = comp.propertyClass.binded.indexOf('surname');
      if (index > -1) {
        comp.propertyClass.binded = `${index}`;
      }

      if (comp.propertyClass.binded instanceof Array) {
        expect(comp.propertyClass.binded.indexOf('surname')).toEqual(index);
      }
    }
  }));

  it('#8. should have `clear()` method remove from binded and wrapped.', async(() => {
    comp.propertyClass.bind(comp, ['firstname', 'surname'], 'target');
    comp.firstname = 'Lucas';
    expect(comp.firstname).toEqual(comp.target.firstname);
    comp.propertyClass.clear(comp, 'firstname');
  }));
});
