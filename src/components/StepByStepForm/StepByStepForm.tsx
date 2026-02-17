import React, { useState } from "react";
import { FormInput } from "../FormInput/FormInput";
import { FormTextarea } from "../FormTextarea/FormTextarea";
import { Checkbox } from "../Checkbox/Checkbox";
import { Radio } from "../Radio/Radio";
import { Select } from "../Select/Select";
import { Button } from "../Button/Button";
import { StepIndicator } from "../StepIndicator/StepIndicator";
import { Snackbar } from "../Snackbar/Snackbar";
import { findMatchingStyles } from "../../utils/findMatchingStyles";
import { buildCoreEmailHtml_2cols } from "../../utils/emailBuilder";
import {
  StyledFormContainer,
  StyledFormContent,
  StyledFormTitle,
  StyledFormDescription,
  StyledFormSection,
  StyledButtonContainer,
  StyledCheckboxGrid,
  StyledPrivacySection,
  StyledPrivacyText,
} from "./StepByStepForm.style.ts";

interface FormData {
  // Step 1
  nombre: string;
  apellido: string;
  email: string;
  caracteristicas: string;

  // Step 2
  personalidad: string[];

  // Step 3
  ajuste: string;

  // Step 4
  tiempo: string;

  // Step 5
  genero: string;

  // Step 6
  ubicacion: string;

  // Step 7
  comunicaciones: boolean;
  procesamiento: boolean;
}

const PERSONALITY_OPTIONS = [
  "Académica/o/e",
  "Activa/o/e",
  "Aventurera/o/e",
  "Casual",
  "Elegante",
  "Exploradora/o/e",
  "Bohemia/o/e",
  "Formal",
  "Hippie",
  "Informal",
  "Innovadora/o/e",
  "Intensa/o/e",
  "Intrigante",
  "Moderna/o/e",
  "Mística/o/e",
  "Natural",
  "Prolija/o/e",
  "Nostálgica/o/e",
  "Original",
  "Pin-up (50s)",
  "Rebelde",
  "Refinada/o/e",
  "Relajada/o/e",
  "Retro",
  "Romántica/o/e",
  "Sensual",
  "Simple",
  "Sofisticada/o/e",
  "Deportiva/o/e",
  "Subversiva/o/e",
  "Dulce",
  "Atemporal",
  "Tradicional",
  "Única/o/e",
  "Vintage",
];

const TIME_OPTIONS = [
  { value: "5min", label: "5 minutos" },
  { value: "15min", label: "15 minutos" },
  { value: "30min", label: "30 minutos" },
  { value: "1h", label: "1 hora" },
  { value: "2h+", label: "Más de 2 horas" },
];

const GENDER_OPTIONS = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "no-binario", label: "No binario" },
  { value: "otro", label: "Otro" },
  { value: "prefiero-no-decir", label: "Prefiero no decir" },
];

const STEPS = [
  "Información Personal",
  "Características",
  "Preferencias",
  "Tiempo",
  "Perfil",
  "Ubicación",
  "Privacidad",
];

export const StepByStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: "success" | "error";
  }>({ open: false, message: "", variant: "success" });
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    caracteristicas: "",
    personalidad: [],
    ajuste: "",
    tiempo: "",
    genero: "",
    ubicacion: "",
    comunicaciones: false,
    procesamiento: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 1:
        if (!formData.nombre.trim())
          newErrors.nombre = "El nombre es requerido";
        if (!formData.apellido.trim())
          newErrors.apellido = "El apellido es requerido";
        if (!formData.email.trim()) {
          newErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "El email no es válido";
        }
        break;
      case 2:
        if (!formData.caracteristicas.trim()) {
          newErrors.caracteristicas = "Las características son requeridas";
        }
        if (formData.personalidad.length < 5) {
          newErrors.personalidad =
            "Debes seleccionar al menos 5 características";
        } else if (formData.personalidad.length > 10) {
          newErrors.personalidad =
            "Debes seleccionar máximo 10 características";
        }
        break;
      case 3:
        if (!formData.ajuste) newErrors.ajuste = "Debes seleccionar una opción";
        break;
      case 4:
        if (!formData.tiempo) newErrors.tiempo = "Debes seleccionar una opción";
        break;
      case 5:
        // Gender is optional
        break;
      case 6:
        if (!formData.ubicacion.trim())
          newErrors.ubicacion = "La ubicación es requerida";
        break;
      case 7:
        if (!formData.procesamiento) {
          newErrors.procesamiento = "Debes aceptar el procesamiento de datos";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    try {
      // Process form data: get matching styles from selected personality traits
      const adjetivosString = formData.personalidad.join(", ");
      const matchingStyles = findMatchingStyles(adjetivosString);

      // Generate HTML email from utils
      const html = buildCoreEmailHtml_2cols(
        formData.nombre,
        matchingStyles,
        formData.caracteristicas,
        {
          ctaUrl: "https://www.corealternativas.com/estilismo-personalizado",
          ctaLabel: "Reservar asesoría",
        }
      );

      const body = {
        to: formData.email,
        subject: "Test de personalidad",
        html,
        replyTo: "core.alternativas@gmail.com",
        formData,
      };

      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message || "Error al enviar el email"
        );
      }

      setSnackbar({
        open: true,
        message:
          "¡Gracias por completar el test! Recibirás los resultados por email a la brevedad.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Hubo un error. Intenta nuevamente.",
        variant: "error",
      });
    }
  };

  const handlePersonalityToggle = (option: string) => {
    setFormData((prev) => {
      const current = prev.personalidad;
      const isSelected = current.includes(option);
      let newSelection: string[];

      if (isSelected) {
        newSelection = current.filter((item) => item !== option);
      } else {
        if (current.length >= 10) {
          return prev; // Don't add if already at max
        }
        newSelection = [...current, option];
      }

      return { ...prev, personalidad: newSelection };
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StyledFormSection>
            <FormInput
              label="Nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => updateFormData("nombre", e.target.value)}
              required
              error={errors.nombre}
            />
            <FormInput
              label="Apellido"
              type="text"
              value={formData.apellido}
              onChange={(e) => updateFormData("apellido", e.target.value)}
              required
              error={errors.apellido}
            />
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              required
              helperText="We'll be sending the results to your email address :)"
              error={errors.email}
            />
          </StyledFormSection>
        );

      case 2:
        return (
          <StyledFormSection>
            <FormTextarea
              label="Decinos tres (o más) características que defina qué te gustaría proyectar cuando alguien te ve."
              value={formData.caracteristicas}
              onChange={(e) =>
                updateFormData("caracteristicas", e.target.value)
              }
              required
              helperText="Por ejemplo: si alguien que no te conoce te cruzara en la calle, ¿qué te gustaría que piense de vos?"
              error={errors.caracteristicas}
              rows={4}
            />
            <StyledFormDescription>
              Bien, ahora seleccioná las palabras que más se acerquen a las
              características que identificaste.
            </StyledFormDescription>
            <StyledFormDescription>
              Elige entre 5 y 10 ({formData.personalidad.length} seleccionadas)
            </StyledFormDescription>
            {errors.personalidad && (
              <StyledFormDescription style={{ color: "#d32f2f" }}>
                {errors.personalidad}
              </StyledFormDescription>
            )}
            <StyledCheckboxGrid>
              {PERSONALITY_OPTIONS.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={formData.personalidad.includes(option)}
                  onChange={() => handlePersonalityToggle(option)}
                />
              ))}
            </StyledCheckboxGrid>
          </StyledFormSection>
        );

      case 3:
        return (
          <StyledFormSection>
            <StyledFormDescription>
              La ropa, en general, ¿la preferís más ajustada/ceñida al cuerpo, o
              más suelta?
            </StyledFormDescription>
            {errors.ajuste && (
              <StyledFormDescription style={{ color: "#d32f2f" }}>
                {errors.ajuste}
              </StyledFormDescription>
            )}
            <Radio
              name="ajuste"
              label="Más bien ajustada"
              checked={formData.ajuste === "ajustada"}
              onChange={() => updateFormData("ajuste", "ajustada")}
            />
            <Radio
              name="ajuste"
              label="Más bien suelta"
              checked={formData.ajuste === "suelta"}
              onChange={() => updateFormData("ajuste", "suelta")}
            />
          </StyledFormSection>
        );

      case 4:
        return (
          <StyledFormSection>
            <Select
              label="¿Cuánto tiempo por día queres dedicar a pensar en tu estilo/ropa?"
              options={TIME_OPTIONS}
              value={formData.tiempo}
              onChange={(e) => updateFormData("tiempo", e.target.value)}
              required
              error={errors.tiempo}
            />
          </StyledFormSection>
        );

      case 5:
        return (
          <StyledFormSection>
            <Select
              label="¿Cómo te identificas, cuál es tu género?"
              options={GENDER_OPTIONS}
              value={formData.genero}
              onChange={(e) => updateFormData("genero", e.target.value)}
              helperText="En CORE, creemos que el estilo y la ropa van más allá del género, y alentamos a todos a expresarse de manera auténtica. Esta pregunta es opcional y no influirá en tus resultados de estilo, pero nos ayuda a comprender mejor tu perfil (y a nuestra audiencia)."
            />
          </StyledFormSection>
        );

      case 6:
        return (
          <StyledFormSection>
            <FormInput
              label="¿Dónde estás ubicada/o/e?"
              type="text"
              value={formData.ubicacion}
              onChange={(e) => updateFormData("ubicacion", e.target.value)}
              required
              helperText="Esta respuesta la necesitamos para recomendaciones personalizadas de dónde conseguir las piezas que podrías necesitar"
              error={errors.ubicacion}
              placeholder="País"
            />
          </StyledFormSection>
        );

      case 7:
        return (
          <StyledFormSection>
            <StyledPrivacySection>
              <StyledPrivacyText>
                En CORE Alternativas Conscientes, nos tomamos muy en serio la
                seguridad de tu información. Solo usaremos tus datos para
                gestionar tu cuenta y ofrecerte los productos o servicios que
                solicitaste. Fin.
              </StyledPrivacyText>
            </StyledPrivacySection>

            <StyledPrivacySection>
              <StyledPrivacyText>
                De vez en cuando, nos encantaría compartir actualizaciones,
                información de productos y contenido que creemos que te podría
                gustar. Si estás de acuerdo con que nos pongamos en contacto,
                decinos cómo preferis que lo hagamos marcando las casillas a
                continuación:
              </StyledPrivacyText>
              <Checkbox
                label="Acepto recibir otras comunicaciones de CORE Alternativas Conscientes."
                checked={formData.comunicaciones}
                onChange={(e) =>
                  updateFormData("comunicaciones", e.target.checked)
                }
              />
            </StyledPrivacySection>

            <StyledPrivacySection>
              <StyledPrivacyText>
                Para poder proporcionarte el contenido solicitado, necesitamos
                almacenar y procesar tus datos personales. Si estás de acuerdo
                con que almacenemos tus datos personales para este propósito,
                marca la casilla a continuación.
              </StyledPrivacyText>
              {errors.procesamiento && (
                <StyledFormDescription style={{ color: "#d32f2f" }}>
                  {errors.procesamiento}
                </StyledFormDescription>
              )}
              <Checkbox
                label="Acepto permitir que CORE Alternativas Conscientes almacene y procese mis datos personales."
                checked={formData.procesamiento}
                onChange={(e) =>
                  updateFormData("procesamiento", e.target.checked)
                }
              />
            </StyledPrivacySection>

            <StyledPrivacySection>
              <StyledPrivacyText>
                Puedes darte de baja de estas comunicaciones en cualquier
                momento. Para más información sobre cómo darte de baja, nuestras
                prácticas de privacidad y nuestro compromiso con proteger y
                respetar tu privacidad, por favor revisa nuestra{" "}
                <a href="#" style={{ color: "#ce6b00" }}>
                  Política de Privacidad
                </a>
                .
              </StyledPrivacyText>
            </StyledPrivacySection>
          </StyledFormSection>
        );

      default:
        return null;
    }
  };

  return (
    <StyledFormContainer>
      <StyledFormContent>
        <StepIndicator currentStep={currentStep} steps={STEPS} />
        <StyledFormTitle>Encuentra tu estilo personal</StyledFormTitle>
        {currentStep === 1 && (
          <StyledFormDescription>
            Las siguientes preguntas están diseñadas para entender (a grandes
            rasgos) qué tipo de estilo te gusta vestir más.
          </StyledFormDescription>
        )}
        {currentStep === 1 && (
          <StyledFormDescription>
            Queremos alejarnos de las ideas de como "deberíamos" vernos, y hacer
            foco en qué sería la forma más auténtica para vos de vestirte, y
            mostrarte en el mundo &lt;3.
          </StyledFormDescription>
        )}
        {currentStep === 1 && (
          <StyledFormDescription>
            Vas a recibir los resultados por email a la brevedad. Gracias por
            jugar!
          </StyledFormDescription>
        )}

        <form onSubmit={handleSubmit}>{renderStep()}</form>

        <StyledButtonContainer>
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Anterior
            </Button>
          )}
          {currentStep < STEPS.length ? (
            <Button type="button" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit" onClick={handleSubmit}>
              Enviar
            </Button>
          )}
        </StyledButtonContainer>
      </StyledFormContent>
      <Snackbar
        key={snackbar.open ? `${snackbar.message}-${snackbar.variant}` : "closed"}
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </StyledFormContainer>
  );
};
