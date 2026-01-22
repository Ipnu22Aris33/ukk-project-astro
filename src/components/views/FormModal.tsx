// components/views/FormModal.tsx
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* =====================
   TYPES
===================== */
export type FieldOption = {
  label: string;
  value: string;
};

export type FieldType = "text" | "email" | "number" | "password" | "textarea" | "select" | "date" | "datetime-local" | "checkbox";

export type FieldConfig = {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  defaultValue?: any;
  fullWidth?: boolean;
};

type FormValue = Record<string, any>;

type FormModalProps = {
  show: boolean;
  onHide: () => void;
  title?: string;
  fields: FieldConfig[];
  initialValue: FormValue;
  onSubmit: (data: FormValue) => void;
  isSubmitting?: boolean;
};

/* =====================
   COMPONENT
===================== */
export default function FormModal({
  show,
  onHide,
  title = "Form",
  fields,
  initialValue,
  onSubmit,
  isSubmitting = false,
}: FormModalProps) {
  const [form, setForm] = useState<FormValue>({});

  useEffect(() => {
    if (show) {
      setForm(initialValue);
    }
  }, [show, initialValue]);

  const handleChange = (name: string, value: string, type?: FieldType) => {
    // Handle checkbox differently
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = form[field.name] ?? field.defaultValue ?? "";

    const commonProps = {
      required: field.required,
      placeholder: field.placeholder,
      disabled: isSubmitting,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (field.type === "checkbox") {
          handleChange(field.name, "", field.type);
        } else {
          handleChange(field.name, e.target.value, field.type);
        }
      },
    };

    if (field.type === "textarea") {
      return <Form.Control as="textarea" rows={4} value={value} {...commonProps} />;
    }

    if (field.type === "select") {
      return (
        <Form.Select value={value} {...commonProps}>
          <option value="" disabled>
            -- Pilih --
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
      );
    }

    if (field.type === "checkbox") {
      return <Form.Check type="checkbox" checked={!!value} label={field.placeholder} {...commonProps} />;
    }

    return <Form.Control type={field.type ?? "text"} value={value} {...commonProps} />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (const field of fields) {
      const value = form[field.name];
      if (field.required && (value === undefined || value === "" || value === null)) {
        alert(`${field.label} harus diisi`);
        return;
      }
    }

    onSubmit(form);
  };

  return (
    <Modal
      show={show}
      onHide={!isSubmitting ? onHide : undefined}
      centered
      backdrop={isSubmitting ? "static" : true}
      size="lg" // Tambahkan size="lg" untuk form yang lebih lebar
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            {fields.map((field) => (
              <Col xs={12} md={field.fullWidth ? 12 : 6} key={field.name}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {field.label}
                    {field.required && <span className="text-danger ms-1">*</span>}
                  </Form.Label>
                  {renderField(field)}
                  {field.type === "checkbox" && field.placeholder && (
                    <Form.Text className="text-muted">{field.placeholder}</Form.Text>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
