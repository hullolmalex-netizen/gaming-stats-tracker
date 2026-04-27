import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`canvas { width: 100% !important; height: 300px !important; }`]
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() title: string = 'Bar Chart';
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

  private chart!: Chart;

  ngOnInit() { this.buildChart(); }
  ngOnChanges() { if (this.chart) { this.chart.destroy(); this.buildChart(); } }

  buildChart() {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: this.title,
          data: this.data,
          backgroundColor: [
            '#3f51b5','#e91e63','#00bcd4','#ff9800','#4caf50',
            '#9c27b0','#f44336','#2196f3','#ff5722','#8bc34a'
          ],
          borderRadius: 6,
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
        scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } }
      }
    });
  }
}
