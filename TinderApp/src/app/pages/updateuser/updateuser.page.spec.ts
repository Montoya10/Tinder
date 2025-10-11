import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateuserPage } from './updateuser.page';

describe('UpdateuserPage', () => {
  let component: UpdateuserPage;
  let fixture: ComponentFixture<UpdateuserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
