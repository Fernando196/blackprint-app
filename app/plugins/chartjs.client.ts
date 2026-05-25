import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

export default defineNuxtPlugin(() => {
  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)
})
