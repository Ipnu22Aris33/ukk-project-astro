import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import AppProviders from "@components/providers/AppProviders";
import { InternalServerError } from "@utils/httpError";

/* =======================
   SIGN-IN FORM
======================= */
function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new InternalServerError(err.message || "Login failed");
      }

      return res.json();
    },
    onSuccess: () => {
      sessionStorage.setItem("toast", "login-success");
      window.location.href = "/";
    },
    onError: (err: any) => {
      setError(err.message || "Login failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate({ email, password });
  };

  return (
    <Row className="justify-content-center align-items-center vh-100">
      <Col xs={12} md={6} lg={4}>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <h4 className="text-center mb-4">Sign In</h4>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} autoComplete="off">
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="pak"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="d-flex justify-content-between">
                  <span>Password</span>
                  <a href="/auth/forgot-password" className="small">
                    Forgot password?
                  </a>
                </Form.Label>
                <Form.Control type="password" autoComplete="tw" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              <Button type="submit" className="w-100" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small className="text-muted">
                Don't have an account? <a href="/auth/register">Sign Up</a>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

/* =======================
   PAGE
======================= */
export default function SignInPage() {
  return (
    <AppProviders>
      <Container>
        <SignInForm />
      </Container>
    </AppProviders>
  );
}
