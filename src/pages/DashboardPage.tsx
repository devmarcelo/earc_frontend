import React from "react";
import { useTranslation } from "react-i18next";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Placeholder data for charts
const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Receita Mensal (Placeholder)",
      data: [1200, 1900, 3000, 5000, 2300, 3200],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const barChartData = {
  labels: ["Aluguel", "Salários", "Marketing", "Material", "Outros"],
  datasets: [
    {
      label: "Despesas por Categoria (Placeholder)",
      data: [1500, 4500, 800, 300, 1200],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Placeholder Chart",
    },
  },
};

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{t("dashboard")}</h1>
      <p className="mb-6">
        {t("welcome_dashboard_message", {
          defaultValue: "Visão geral do seu negócio.",
        })}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Placeholder Card 1: Summary */}
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">
            Resumo Financeiro (Placeholder)
          </h2>
          <p>Receita Total: R$ 10.000,00</p>
          <p>Despesa Total: R$ 7.500,00</p>
          <p>Lucro: R$ 2.500,00</p>
        </div>

        {/* Placeholder Card 2: Quick Actions */}
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">
            Ações Rápidas (Placeholder)
          </h2>
          <button
            className="btn btn-primary mr-2"
            style={{ backgroundColor: "var(--primary-color)", color: "white" }}
          >
            Nova Receita
          </button>
          <button
            className="btn btn-secondary"
            style={{
              backgroundColor: "var(--secondary-color)",
              color: "white",
            }}
          >
            Nova Despesa
          </button>
        </div>

        {/* Placeholder Chart 1 */}
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">
            Receita Mensal (Placeholder)
          </h2>
          <Line options={chartOptions} data={lineChartData} />
        </div>

        {/* Placeholder Chart 2 */}
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">
            Despesas por Categoria (Placeholder)
          </h2>
          <Bar options={chartOptions} data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
