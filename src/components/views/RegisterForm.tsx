import { useState } from "react";
import { useMutation } from "@hooks/useMutation";
import { Form, Alert, Button } from "react-bootstrap";
import { useSubmitMutation } from "@hooks/useSubmitMutation";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [major, setMajor] = useState("");
  const [className, setClassName] = useState("");

  const { mutate, loading, error } = useMutation(
    async (data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      address: string;
      class: string;
      major: string;
    }) => {
      console.log(data)
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(res)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(err.message || "Registration failed");
      }
      return res.json();
    },
  );

  const submitLogin = useSubmitMutation(mutate, {
    redirectTo: "/",
    successToast: { event: "login-success" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitLogin({ name, email, password, phone, address, major, class: className });
  };

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      {error && <Alert variant="danger">{error.message}</Alert>}

      {/* Name Field */}
      <Form.Group className="mb-3" controlId="registerName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      {/* Email Field */}
      <Form.Group className="mb-3" controlId="registerEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="email@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      {/* Password Field */}
      <Form.Group className="mb-3" controlId="registerPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      {/* Phone Field */}
      <Form.Group className="mb-3" controlId="registerPhone">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Your phone number"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </Form.Group>

      {/* Address Field */}
      <Form.Group className="mb-3" controlId="registerAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Your address"
          autoComplete="street-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </Form.Group>

      {/* Major Field */}
      <Form.Group className="mb-3" controlId="registerMajor">
        <Form.Label>Major/Study Program</Form.Label>
        <Form.Control
          type="text"
          placeholder="Your major or study program"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          required
        />
      </Form.Group>

      {/* Class Field */}
      <Form.Group className="mb-3" controlId="registerClass">
        <Form.Label>Class</Form.Label>
        <Form.Control
          type="text"
          placeholder="Your class (e.g., X-A, XII-IPA2)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
      </Form.Group>

      <Button type="submit" className="w-100 mb-3" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
}
