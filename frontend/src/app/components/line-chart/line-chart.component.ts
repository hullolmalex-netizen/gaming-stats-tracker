import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`canvas { width: 100% !important; height: 300px !important; }`]
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() labels: string[] = [];
  @Input() datasets: { label: string; data: number[]; color: string }[] = [];
  @Input() title: string = 'Line Chart';
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

  private chart!: Chart;

  ngOnInit() { this.buildChart(); }
  ngOnChanges() { if (this.chart) { this.chart.destroy(); this.buildChart(); } }

  buildChart() {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.color,
          backgroundColor: ds.color + '22',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        }))
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}
