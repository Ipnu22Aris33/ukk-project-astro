import { useState } from "react";
import { useMutation } from "@hooks/useMutation";
import { Form, Alert, Button } from "react-bootstrap";
import { useSubmitMutation } from "@hooks/useSubmitMutation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, loading, error } = useMutation(async (data: { email: string; password: string }) => {
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Login failed" }));
      throw new Error(err.message || "Login failed");
    }
    return res.json();
  });

  const submitLogin = useSubmitMutation(mutate, {
    redirectTo: "/",
    successToast: { event: "login-success" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitLogin({ email, password });
  };
  return (
    <Form onSubmit={handleSubmit} autoComplete="off">
      {error && <Alert variant="danger">{error.message}</Alert>}

      <Form.Group className="mb-3" controlId="loginEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="email@example.com"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginPassword">
        <Form.Label className="d-flex justify-content-between">
          <span>Password</span>
          <a href="/auth/forgot-password" className="small">
            Forgot password?
          </a>
        </Form.Label>
        <Form.Control
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" className="w-100 mb-3" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </Form>
  );
}
