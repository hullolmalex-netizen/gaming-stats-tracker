import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  template: `<canvas #c></canvas>`,
  styles: [`canvas { width:100%!important; height:280px!important; }`]
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @ViewChild('c', { static: true }) ref!: ElementRef;
  private chart!: Chart;

  ngOnInit() { this.build(); }
  ngOnChanges() { if (this.chart) { this.chart.destroy(); this.build(); } }

  build() {
    this.chart = new Chart(this.ref.nativeElement, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: ['#6c63ff','#00d4ff','#f72585','#ff9100','#00e676'],
          borderWidth: 3,
          borderColor: '#0a0a1a',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#8888aa', padding: 16, font: { size: 13 } } },
          tooltip: { backgroundColor: '#0f0f2e', borderColor: '#6c63ff', borderWidth: 1, titleColor: '#00d4ff', bodyColor: '#e8e8ff' }
        }
      }
    });
  }
}
