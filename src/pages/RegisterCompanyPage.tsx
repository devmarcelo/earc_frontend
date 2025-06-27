import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Stepper from "../components/Wizard/Stepper";
import { CompanyForm, UserAdminForm, AddressForm } from "../components/Forms";
import type { ImageData, RegistrationFormData } from "../@types";

export default function RegisterCompany() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegistrationFormData>({
    // Company data
    company_name: "",
    schema_name: "",
    logo: "",
    logoFile: undefined,
    logoType: "url",
    // Admin user data
    email: "",
    password: "",
    apelido: "",
    imagem: "",
    imagemFile: undefined,
    imagemType: "url",
    aceite: false,
    data_cadastro: new Date().toISOString(),
    // Address data
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "Brasil",
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

  const handleLogoChange = (imageData: ImageData) => {
    setFormData({
      ...formData,
      logo: imageData.url,
      logoFile: imageData.file,
      logoType: imageData.type,
    });
  };

  const handleProfileImageChange = (imageData: ImageData) => {
    setFormData({
      ...formData,
      imagem: imageData.url,
      imagemFile: imageData.file,
      imagemType: imageData.type,
    });
  };

  const uploadImageFile = async (
    file: File,
    type: "logo" | "profile",
  ): Promise<string> => {
    // Create FormData for file upload
    const uploadFormData = new FormData();
    uploadFormData.append(type === "logo" ? "logo" : "profile_image", file);

    try {
      // Replace with your actual upload endpoint
      const endpoint =
        type === "logo" ? "/api/upload-logo/" : "/api/upload-profile-image/";
      const uploadResponse = await axios.post(endpoint, uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return uploadResponse.data.url; // Assuming API returns { url: "..." }
    } catch (error) {
      console.error(`${type} upload failed:`, error);
      throw new Error(
        `Falha no upload da ${type === "logo" ? "logo" : "imagem de perfil"}`,
      );
    }
  };

  const handleFinish = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      let logoUrl = formData.logo;
      let profileImageUrl = formData.imagem;

      // If logo is a file, upload it first
      if (formData.logoType === "file" && formData.logoFile) {
        try {
          logoUrl = await uploadImageFile(formData.logoFile, "logo");
        } catch (uploadError) {
          setError(
            t("logo_upload_error", {
              defaultValue: "Erro no upload da logo. Tente novamente.",
            }),
          );
          setLoading(false);
          return;
        }
      }

      // If profile image is a file, upload it
      if (formData.imagemType === "file" && formData.imagemFile) {
        try {
          profileImageUrl = await uploadImageFile(
            formData.imagemFile,
            "profile",
          );
        } catch (uploadError) {
          setError(
            t("profile_image_upload_error", {
              defaultValue:
                "Erro no upload da imagem de perfil. Tente novamente.",
            }),
          );
          setLoading(false);
          return;
        }
      }

      // Prepare data for API
      const submitData = {
        // Company data
        company_name: formData.company_name,
        schema_name: formData.schema_name,
        logo: formData.logo || null,
        // Admin user data
        email: formData.email,
        password: formData.password,
        apelido: formData.apelido || null,
        imagem: formData.imagem || null,
        aceite: formData.aceite,
        data_cadastro: formData.data_cadastro,
        // Address data (if your API supports it)
        endereco_completo: {
          cep: formData.cep,
          endereco: formData.endereco,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          pais: formData.pais,
        },
      };

      const response = await axios.post("/api/register-company/", submitData);

      if (response.status === 200 || response.status === 201) {
        // Success - redirect to login
        navigate("/login", {
          state: {
            message: t("company_created_success", {
              defaultValue:
                "Empresa criada com sucesso! Faça login para continuar.",
            }),
          },
        });
      }
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

  const handleStepChange = (stepIndex: number) => {
    console.log(`Moved to step ${stepIndex + 1}`);
  };

  // Define steps for the Stepper
  const steps = [
    {
      title: t("company", { defaultValue: "Empresa" }),
      component: (
        <CompanyForm
          formData={{
            company_name: formData.company_name,
            schema_name: formData.schema_name,
            logo: formData.logo,
            logoFile: formData.logoFile,
            logoType: formData.logoType,
          }}
          onChange={handleChange}
          onImageChange={handleLogoChange}
        />
      ),
      //validate: validateCompanyStep,
    },
    {
      title: t("address", { defaultValue: "Endereço" }),
      component: (
        <AddressForm
          formData={{
            cep: formData.cep,
            endereco: formData.endereco,
            numero: formData.numero,
            complemento: formData.complemento,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado,
            pais: formData.pais,
          }}
          onChange={handleChange}
        />
      ),
      //validate: validateAddressStep,
    },
    {
      title: t("administrator", { defaultValue: "Administrador" }),
      component: (
        <UserAdminForm
          formData={{
            email: formData.email,
            password: formData.password,
            apelido: formData.apelido,
            imagem: formData.imagem,
            aceite: formData.aceite,
            imagemFile: formData.imagemFile,
            imagemType: formData.imagemType,
          }}
          onChange={handleChange}
          onImageChange={handleProfileImageChange}
          loading={loading}
          error={error}
        />
      ),
      //validate: validateUserAdminStep,
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
            onStepChange={handleStepChange}
            onFinish={handleFinish}
            isLoading={loading}
            showValidationErrors={true}
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
