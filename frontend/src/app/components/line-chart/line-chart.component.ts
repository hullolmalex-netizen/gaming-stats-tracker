import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  template: `<canvas #c></canvas>`,
  styles: [`canvas { width:100%!important; height:280px!important; }`]
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() labels: string[] = [];
  @Input() datasets: { label: string; data: number[]; color: string }[] = [];
  @ViewChild('c', { static: true }) ref!: ElementRef;
  private chart!: Chart;

  ngOnInit() { this.build(); }
  ngOnChanges() { if (this.chart) { this.chart.destroy(); this.build(); } }

  build() {
    this.chart = new Chart(this.ref.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.color,
          backgroundColor: ds.color + '33',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 9,
          pointBackgroundColor: ds.color,
          pointBorderColor: '#0a0a1a',
          pointBorderWidth: 2,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8888aa', font: { size: 13 } } },
          tooltip: { backgroundColor: '#0f0f2e', borderColor: '#6c63ff', borderWidth: 1, titleColor: '#00d4ff', bodyColor: '#e8e8ff' }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(108,99,255,0.1)' }, ticks: { color: '#8888aa' } },
          x: { grid: { display: false }, ticks: { color: '#8888aa' } }
        }
      }
    });
  }
}
