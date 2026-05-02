import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
})
export class MapComponent {
  location = signal<{ lat: number; lng: number } | null>(null);
  error = signal('');

  ngOnInit(): void {
    if (!navigator.geolocation) {
      this.error.set('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.location.set({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        this.error.set(err.message || 'Unable to retrieve your location.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  get mapUrl(): string {
    const loc = this.location();
    if (!loc) {
      return '';
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - 0.02}%2C${loc.lat - 0.01}%2C${loc.lng + 0.02}%2C${loc.lat + 0.01}&layer=mapnik&marker=${loc.lat}%2C${loc.lng}`;
  }
}
