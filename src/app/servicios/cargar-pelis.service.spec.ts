import { TestBed } from '@angular/core/testing';

import { CargarPelisService } from './cargar-pelis.service';

describe('CargarPelisService', () => {
  let service: CargarPelisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarPelisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
