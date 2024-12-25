import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MostrarPeliculaCinesComponent } from './mostrar-pelicula-cines.component';

describe('MostrarPeliculaCinesComponent', () => {
  let component: MostrarPeliculaCinesComponent;
  let fixture: ComponentFixture<MostrarPeliculaCinesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarPeliculaCinesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MostrarPeliculaCinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
