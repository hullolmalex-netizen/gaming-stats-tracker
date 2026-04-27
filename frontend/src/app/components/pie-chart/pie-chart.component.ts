import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`canvas { width: 100% !important; height: 300px !important; }`]
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() title: string = 'Pie Chart';
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

  private chart!: Chart;

  ngOnInit() { this.buildChart(); }
  ngOnChanges() { if (this.chart) { this.chart.destroy(); this.buildChart(); } }

  buildChart() {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: ['#3f51b5','#e91e63','#00bcd4','#ff9800','#4caf50'],
          borderWidth: 2,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} sessions` } }
        }
      }
    });
  }
}
