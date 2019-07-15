import { TestBed } from '@angular/core/testing';

import { HttpInterCeptorService } from './http-inter-ceptor.service';

describe('HttpInterCeptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpInterCeptorService = TestBed.get(HttpInterCeptorService);
    expect(service).toBeTruthy();
  });
});
