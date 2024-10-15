import { CommonModule } from "@angular/common";
import { Component, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { BaseChartDirective } from "ng2-charts";

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  @Input() public chartData: number[] = [];
  @Input() public chartLabels: string[] = [];

  public pieChartType: ChartType = 'pie'; // Chart type
  public pieChartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Products by Category'
      }
    }
  };
}
