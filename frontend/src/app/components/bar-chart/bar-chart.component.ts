import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  template: `<canvas #c></canvas>`,
  styles: [`canvas { width:100%!important; height:280px!important; }`]
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() title = '';
  @ViewChild('c', { static: true }) ref!: ElementRef;
  private chart!: Chart;

  ngOnInit() { this.build(); }
  ngOnChanges() { if (this.chart) { this.chart.destroy(); this.build(); } }

  build() {
    this.chart = new Chart(this.ref.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: this.title,
          data: this.data,
          backgroundColor: ['#6c63ff','#00d4ff','#f72585','#ff9100','#00e676','#9c55ff','#ff006e','#2196f3','#ff5722','#4caf50'],
          borderRadius: 8,
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
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
