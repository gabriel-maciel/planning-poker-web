import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokerComponent } from './poker.component';

describe('PokerComponent', () => {
  let component: PokerComponent;
  let fixture: ComponentFixture<PokerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PokerComponent],
    });
    fixture = TestBed.createComponent(PokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
