"use client";

import { useEffect, useState } from "react";
import { Field, Select, TextArea, TextInput } from "./ui";
import { api } from "@/app/lib/admin-client";

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "date"
  | "checkbox";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Carrega as opções de um endpoint (ex.: /api/clients) — usado para relações. */
  optionsEndpoint?: string;
  optionsMap?: (item: any) => { value: string; label: string };
  helpText?: string;
}

export function CrudForm({
  fields,
  values,
  onChange,
}: {
  fields: FormFieldConfig[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
}) {
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});

  useEffect(() => {
    fields
      .filter((f) => f.optionsEndpoint)
      .forEach(async (f) => {
        try {
          const result = await api.get<{ items: any[] }>(f.optionsEndpoint!);
          const mapped = (result.items ?? []).map(
            f.optionsMap ??
              ((item) => ({
                value: item.id,
                label: item.name ?? item.title ?? item.id,
              })),
          );
          setDynamicOptions((prev) => ({ ...prev, [f.name]: mapped }));
        } catch {
          // silencioso — o campo simplesmente fica sem opções
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.map((f) => f.optionsEndpoint).join(",")]);

  return (
    <>
      {fields.map((field) => {
        const value = values[field.name] ?? "";
        const inputId = `field-${field.name}`;

        if (field.type === "checkbox") {
          return (
            <label
              key={field.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem",
              }}
            >
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => onChange(field.name, e.target.checked)}
              />
              {field.label}
            </label>
          );
        }

        return (
          <Field key={field.name} label={field.label} htmlFor={inputId}>
            {field.type === "textarea" ? (
              <TextArea
                id={inputId}
                value={value}
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            ) : field.type === "select" ? (
              <Select
                id={inputId}
                value={value}
                required={field.required}
                onChange={(e) => onChange(field.name, e.target.value)}
              >
                <option value="">Selecionar...</option>
                {(field.optionsEndpoint
                  ? (dynamicOptions[field.name] ?? [])
                  : (field.options ?? [])
                ).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            ) : (
              <TextInput
                id={inputId}
                type={field.type}
                value={
                  field.type === "date" && typeof value === "string"
                    ? value.slice(0, 10)
                    : value
                }
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) =>
                  onChange(
                    field.name,
                    field.type === "number"
                      ? e.target.valueAsNumber
                      : e.target.value,
                  )
                }
              />
            )}
            {field.helpText && (
              <span style={{ fontSize: "0.72rem", color: "var(--ws-dim)" }}>
                {field.helpText}
              </span>
            )}
          </Field>
        );
      })}
    </>
  );
}
