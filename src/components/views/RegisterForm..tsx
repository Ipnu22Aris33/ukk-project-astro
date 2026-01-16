import { useState } from "react";
import { useMutation } from "@hooks/useMutation";
import { Form, Alert, Button } from "react-bootstrap";

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, loading, error } = useMutation(async (data: { username: string; email: string; password: string }) => {
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Registration failed" }));
      throw new Error(err.message || "Registration failed");
    }
    return res.json();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate({ username, email, password });
      window.location.href = "/";
    //   triggerToast("login-success");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      {error && <Alert variant="danger">{error.message}</Alert>}

      <Form.Group className="mb-3" controlId="registerUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Your username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="email@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" className="w-100 mb-3" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
}
