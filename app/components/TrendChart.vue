<template>
  <div class="trend-chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Chart.jsコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset, index) => ({
    label: dataset.label,
    data: dataset.data,
    borderColor: dataset.borderColor || getDefaultColor(index),
    backgroundColor: dataset.backgroundColor || getDefaultBackgroundColor(index),
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6
  }))
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 13
      },
      bodyFont: {
        size: 12
      },
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 11
        }
      }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
}

function getDefaultColor(index: number): string {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4'  // cyan
  ]
  return colors[index % colors.length]
}

function getDefaultBackgroundColor(index: number): string {
  const colors = [
    'rgba(59, 130, 246, 0.1)',
    'rgba(16, 185, 129, 0.1)',
    'rgba(245, 158, 11, 0.1)',
    'rgba(239, 68, 68, 0.1)',
    'rgba(139, 92, 246, 0.1)',
    'rgba(6, 182, 212, 0.1)'
  ]
  return colors[index % colors.length]
}
</script>

<style scoped>
.trend-chart-container {
  height: 250px;
  width: 100%;
}
</style>
