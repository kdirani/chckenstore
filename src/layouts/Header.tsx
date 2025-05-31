import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {

  return (
    <header>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to={'/'}>ترويسي</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to={'/dailyReport'}>تقرير الإنتاج اليومي</Nav.Link>
            <Nav.Link as={Link} to={'/globalReport'}>التقارير الشاملة</Nav.Link>
            <Nav.Link as={Link} to="/globalReportRecord">سجل التقارير الشاملة</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  )
}