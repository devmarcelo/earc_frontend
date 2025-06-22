import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

export default function RegisterCompany() {
  const [step, setStep] = useState<"empresa" | "admin">("empresa");
  const [formData, setFormData] = useState({
    company_name: "",
    schema_name: "",
    logo: "",
    email: "",
    password: "",
    apelido: "",
    imagem: "",
    aceite: false,
    data_cadastro: new Date().toISOString(),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleNext = () => {
    setStep("admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/register-company/", formData);
      if (res.status === 200 || res.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      setError(
        "Erro ao cadastrar empresa. Verifique os dados ou tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-6 text-xl font-semibold">
        {t("register_company_title", { defaultValue: "Cadastro de Empresa" })}
      </h2>
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setStep("empresa")}
          className={`rounded px-4 py-2 ${step === "empresa" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        >
          Empresa
        </button>
        <button
          onClick={() => setStep("admin")}
          className={`rounded px-4 py-2 ${step === "admin" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        >
          Administrador
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === "empresa" && (
          <>
            <input
              type="text"
              name="company_name"
              placeholder="Nome da Empresa"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              name="schema_name"
              placeholder="Identificador (ex: acme)"
              value={formData.schema_name}
              onChange={handleChange}
              required
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              name="logo"
              placeholder="URL da Logo da Empresa (opcional)"
              value={formData.logo}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
            <button
              type="button"
              onClick={handleNext}
              className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Próximo
            </button>
          </>
        )}

        {step === "admin" && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email do Administrador"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              name="apelido"
              placeholder="Apelido do Administrador"
              value={formData.apelido}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              name="imagem"
              placeholder="URL da imagem do usuário (opcional)"
              value={formData.imagem}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="aceite"
                checked={formData.aceite}
                onChange={handleChange}
                required
              />
              <span className="text-sm">Li e aceito os termos de uso</span>
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              {loading ? "Enviando..." : "Cadastrar Empresa"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
