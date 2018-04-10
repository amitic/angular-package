// Make describe visible.
import { } from 'jasmine';

// external
import { NO_ERRORS_SCHEMA, ViewChild, ComponentRef } from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { TestBed, async, inject, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';

// internal
import { TestComponent } from '../test/class.component';

beforeAll(() => {
  TestBed.resetTestEnvironment();
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
});

describe('ApChangeDetectorClass', () => {

  let comp: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true} // detectChanges.
      ]
    }).compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    debugElement = fixture.debugElement;
    comp = fixture.componentInstance;
  });
  it('should create test component', async(() => {
    expect(fixture).toBeDefined();
    expect(comp).toBeTruthy();
  }));
  it('should have changeDetector.cd equal "c"', async(() => {
    expect(comp.changeDetector.cd).toEqual('c');
  }));
  it('should have changeDetector.detection falsy.', async(() => {
    comp.detection = false;
    expect(comp.changeDetector.detection).toBeFalsy();
  }));
  it('should be changed when surname change.', async(() => {
    comp.detection = false;
    comp.properties = {
      firstname: false,
      surname: true,
      age: true
    };
    comp.surname = 'Changed';
    expect(debugElement.nativeElement.textContent).toContain(comp.surname);
  }));
  it('should not be changed when surname change.', async(() => {
    comp.detection = false;
    comp.properties = {
      firstname: false,
      surname: false,
      age: true
    };
    comp.surname = 'Changed';
    expect(debugElement.nativeElement.textContent).not.toContain(comp.surname);
  }));
  it('should not be changed when surname change.', async(() => {
    comp.detection = false;
    comp.properties = {
      firstname: false,
      surname: false,
      age: true
    };
    comp.surname = 'Changed';
    expect(debugElement.nativeElement.textContent).not.toContain(comp.surname);
  }));
});
