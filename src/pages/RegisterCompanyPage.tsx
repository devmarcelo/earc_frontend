import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Stepper from "../components/Wizard/Stepper";
import { CompanyForm, UserAdminForm, AddressForm } from "../components/Forms";
import type {
  AddressFormData,
  CompanyFormData,
  RegistrationFormData,
  UserAdminFormData,
} from "../@types";
import { registerCompany } from "../services/registerCompanyService";
import { validateRequiredFields } from "../utils/validators";

export default function RegisterCompany() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegistrationFormData>({
    /* Campos App Tenant */
    company_name: "",
    schema_name: "",
    document: "",
    logo: undefined,
    registration_date: new Date().toISOString(),
    /* Campos App UserManager */
    email: "",
    phone: "",
    password: "",
    repeat_password: "",
    nickname: "",
    avatar: undefined,
    acceptance: false,
    /* Campos App Address */
    zipcode: "",
    address: "",
    address_number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const setCompanyFormData = (updates: Partial<CompanyFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const setAddressFormData = (updates: Partial<AddressFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const setUserAdminFormData = (updates: Partial<UserAdminFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleImageChange = (image: File | string, key: "logo" | "avatar") => {
    setFormData((prev) => ({
      ...prev,
      [key]: image,
    }));
  };

  const handleFinish = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "undefined" || value === null) {
          return;
        }

        if (value instanceof File || typeof value === "string") {
          data.append(key, value);
        } else {
          data.append(key, value?.toString() ?? "");
        }
      });

      await registerCompany(data);

      navigate("/login", {
        state: {
          message: t("company_created_success", {
            defaultValue:
              "Empresa criada com sucesso! Faça login para continuar.",
          }),
        },
      });
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(
          t("registration_error", {
            defaultValue:
              "Erro ao cadastrar empresa. Verifique os dados ou tente novamente.",
          }),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: t("company", { defaultValue: "Empresa" }),
      component: (
        <CompanyForm
          formData={{
            company_name: formData.company_name,
            schema_name: formData.schema_name,
            document: formData.document,
            logo: formData.logo,
          }}
          onChange={handleChange}
          onImageChange={(image) => handleImageChange(image, "logo")}
          setFormData={setCompanyFormData}
        />
      ),
      customValidate: () => validateRequiredFields("company-form"),
    },
    {
      title: t("address", { defaultValue: "Endereço" }),
      component: (
        <AddressForm
          formData={{
            zipcode: formData.zipcode,
            address: formData.address,
            address_number: formData.address_number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            country: formData.country,
          }}
          onChange={handleChange}
          setFormData={setAddressFormData}
        />
      ),
      customValidate: () => validateRequiredFields("address-form"),
    },
    {
      title: t("administrator", { defaultValue: "Administrador" }),
      component: (
        <UserAdminForm
          formData={{
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            repeat_password: formData.repeat_password,
            nickname: formData.nickname,
            avatar: formData.avatar,
            acceptance: formData.acceptance,
          }}
          onChange={handleChange}
          setFormData={setUserAdminFormData}
          onImageChange={(image) => handleImageChange(image, "avatar")}
          loading={loading}
          error={error}
        />
      ),
      customValidate: () => validateRequiredFields("user-admin-form"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("register_company_title", {
              defaultValue: "Cadastro de Empresa",
            })}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {t("register_company_subtitle", {
              defaultValue: "Configure sua empresa no sistema eARC",
            })}
          </p>
        </div>

        <div className="mt-8">
          <Stepper
            steps={steps}
            onFinish={handleFinish}
            isLoading={loading}
            showValidationErrors
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t("already_have_account", {
              defaultValue: "Já tem uma conta?",
            })}{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t("login_here", { defaultValue: "Faça login aqui" })}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
