import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFlappyComponent } from './game-flappy.component';

describe('GameFlappyComponent', () => {
  let component: GameFlappyComponent;
  let fixture: ComponentFixture<GameFlappyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameFlappyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameFlappyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
