// components/views/FormModal.tsx
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from 'react-select';

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
  isSearchable?: boolean; // Ubah dari searchable ke isSearchable
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

// Custom styles untuk react-select agar match dengan Bootstrap
const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderColor: state.isFocused ? '#86b7fe' : '#dee2e6',
    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#86b7fe' : '#adb5bd',
    },
    minHeight: '38px',
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
    color: state.isSelected ? 'white' : '#212529',
    '&:hover': {
      backgroundColor: state.isSelected ? '#0d6efd' : '#f8f9fa',
    },
  }),
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

  const handleChange = (name: string, value: any, type?: FieldType) => {
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

  const handleSelectChange = (name: string, selectedOption: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const renderField = (field: FieldConfig) => {
    const value = form[field.name] ?? field.defaultValue ?? "";

    const commonProps = {
      required: field.required,
      placeholder: field.placeholder,
      disabled: isSubmitting,
    };

    if (field.type === "textarea") {
      return (
        <Form.Control 
          as="textarea" 
          rows={4} 
          value={value} 
          {...commonProps}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            handleChange(field.name, e.target.value, field.type);
          }}
        />
      );
    }

    if (field.type === "select") {
      // Find selected option
      const selectedOption = field.options?.find(opt => opt.value === value);
      
      return (
        <Select
          options={field.options}
          value={selectedOption}
          onChange={(selected) => handleSelectChange(field.name, selected)}
          isSearchable={field.isSearchable || false} // Enable search
          isDisabled={isSubmitting}
          placeholder={field.placeholder || "-- Pilih --"}
          noOptionsMessage={() => "Tidak ada opsi"}
          loadingMessage={() => "Memuat..."}
          styles={customSelectStyles}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      );
    }

    if (field.type === "checkbox") {
      return (
        <Form.Check 
          type="checkbox" 
          checked={!!value} 
          label={field.placeholder} 
          {...commonProps}
          onChange={() => handleChange(field.name, "", field.type)}
        />
      );
    }

    return (
      <Form.Control 
        type={field.type ?? "text"} 
        value={value} 
        {...commonProps}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(field.name, e.target.value, field.type);
        }}
      />
    );
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
      size="lg"
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