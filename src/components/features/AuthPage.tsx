import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useHashState } from "@hooks/useHashState";
import { LoginForm } from "@components/views/LoginForm";
import { RegisterForm } from "@components/views/RegisterForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useHashState(["login", "register"], "login", { replace: true });

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login-card"
                initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Card className="border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <h2 className="fw-bold mb-2">Welcome Back</h2>
                      <p className="text-muted">Sign in to your account</p>
                    </div>

                    <LoginForm />

                    <div className="text-center">
                      <p className="text-muted mb-2">
                        Don't have an account?{" "}
                        <Button
                          variant="link"
                          onClick={() => setActiveTab("register")}
                          className="text-decoration-none p-0 fw-bold"
                        >
                          Create Account
                        </Button>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="register-card"
                initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Card className="border-0 shadow-lg">
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <h2 className="fw-bold mb-2">Create Account</h2>
                      <p className="text-muted">Fill in your details to get started</p>
                    </div>

                    <RegisterForm />

                    <div className="text-center">
                      <p className="text-muted mb-2">
                        Already have an account?{" "}
                        <Button variant="link" onClick={() => setActiveTab("login")} className="text-decoration-none p-0 fw-bold">
                          Sign In
                        </Button>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Col>
      </Row>
    </Container>
  );
}
