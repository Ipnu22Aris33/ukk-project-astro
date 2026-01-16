import { Row, Col, Card, Nav, Tab } from "react-bootstrap";
import { useHashState } from "@hooks/useHashState";
import { LoginForm } from "@components/views/LoginForm";
import { RegisterForm } from "@components/views/RegisterForm.";

export default function AuthPage() {
  const AUTH_TABS = ["login", "register"] as const;

  const [activeTab, setActiveTab] = useHashState(AUTH_TABS, "login", { replace: true });

  return (
    <Row className="justify-content-center w-100">
      <Col xs={12} sm={10} md={8} lg={6} xl={5}>
        <Card className="shadow-lg border-0 mx-auto" style={{ maxWidth: "450px", width: "100%" }}>
          <Card.Body className="p-5">
            <Tab.Container activeKey={activeTab} onSelect={(k) => k && setActiveTab(k as any)}>
              <Nav variant="tabs" className="justify-content-center mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="register">Register</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="login">
                  <LoginForm />
                </Tab.Pane>
                <Tab.Pane eventKey="register">
                  <RegisterForm />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
