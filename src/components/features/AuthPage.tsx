import { Row, Col, Card, Button } from "react-bootstrap";
import { useHashState } from "@hooks/useHashState";
import { LoginForm } from "@components/views/LoginForm";
import { RegisterForm } from "@components/views/RegisterForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useHashState(["login", "register"], "login", { replace: true });

  return (
    <Row className="justify-content-center w-100">
      <Col xs={12} lg={9} xl={8}>
        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <motion.div
              key="login-card"
              initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card className="border-0 shadow-lg overflow-hidden rounded-4">
                <Card.Body className="p-0">
                  <Row className="g-0">
                    {/* Title di kiri */}
                    <Col
                      md={4}
                      className="d-none d-md-flex align-items-center p-5 bg-primary bg-opacity-10"
                    >
                      <div>
                        <h2 className="fw-bold mb-2">Welcome Back</h2>
                        <p className="text-muted small">
                          Sign in to access your account and continue where you left off.
                        </p>
                        <div className="mt-4">
                          <h6 className="fw-semibold">Quick Access</h6>
                          <ul className="list-unstyled text-muted small">
                            <li className="mb-1">✓ Track your progress</li>
                            <li className="mb-1">✓ Save preferences</li>
                            <li className="mb-1">✓ Access all features</li>
                          </ul>
                        </div>
                      </div>
                    </Col>

                    {/* Form di kanan */}
                    <Col xs={12} md={8} className="p-4 p-lg-5">
                      <div className="d-md-none text-center mb-4">
                        <h2 className="fw-bold mb-2">Welcome Back</h2>
                        <p className="text-muted">Sign in to your account</p>
                      </div>

                      <LoginForm />

                      {/* Posisi di bawah kanan */}
                      <div className="text-center mt-4 pt-3 border-top">
                        <p className="text-muted mb-0">
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
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="register-card"
              initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card className="border-0 shadow-lg overflow-hidden rounded-4">
                <Card.Body className="p-0">
                  <Row className="g-0">
                    {/* Title di kiri */}
                    <Col
                      md={4}
                      className="d-none d-md-flex align-items-center p-5 bg-primary bg-opacity-10"
                    >
                      <div>
                        <h2 className="fw-bold mb-2">Create Account</h2>
                        <p className="text-muted small">
                          Join our platform and start your journey with personalized features.
                        </p>
                        <div className="mt-4">
                          <h6 className="fw-semibold">Why Register?</h6>
                          <ul className="list-unstyled text-muted small">
                            <li className="mb-1">✓ Access all features</li>
                            <li className="mb-1">✓ Personalized experience</li>
                            <li className="mb-1">✓ Priority support</li>
                            <li className="mb-1">✓ Community access</li>
                          </ul>
                        </div>
                      </div>
                    </Col>

                    {/* Form di kanan */}
                    <Col xs={12} md={8} className="p-4 p-lg-5">
                      <div className="d-md-none text-center mb-4">
                        <h2 className="fw-bold mb-2">Create Account</h2>
                        <p className="text-muted">Fill in your details to get started</p>
                      </div>

                      <div style={{ maxHeight: "400px" }} className="overflow-auto scrollbar-thin pe-2">
                        <RegisterForm />
                      </div>

                      {/* Posisi di bawah kiri */}
                      <div className="text-center mt-4 pt-3 border-top">
                        <p className="text-muted mb-0">
                          Already have an account?{" "}
                          <Button
                            variant="link"
                            onClick={() => setActiveTab("login")}
                            className="text-decoration-none p-0 fw-bold"
                          >
                            Sign In
                          </Button>
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Col>
    </Row>
  );
}