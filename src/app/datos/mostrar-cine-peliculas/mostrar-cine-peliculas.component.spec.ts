import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MostrarCinePeliculasComponent } from './mostrar-cine-peliculas.component';

describe('MostrarCinePeliculasComponent', () => {
  let component: MostrarCinePeliculasComponent;
  let fixture: ComponentFixture<MostrarCinePeliculasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarCinePeliculasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MostrarCinePeliculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
