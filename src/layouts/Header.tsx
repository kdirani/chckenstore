import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/qudirani-logo.jpg';

export default function Header() {
  return (
    <header dir="rtl">
      <Navbar
        expand="md"
        sticky="top"
        style={{
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          background: '#c62828',
          borderBottom: '3px solid #b71c1c',
          padding: '0.4rem 0',
          height: 72,
        }}
      >
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* الشعار */}
          <Navbar.Brand
            as={Link}
            to="/"
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <img
              src={logo}
              alt="شعار القديراني"
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: '#fff',
                marginRight: 10,
                border: '2px solid #fff',
              }}
            />
            مداجن القديراني
          </Navbar.Brand>

          {/* زر القائمة - الجوال */}
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            style={{
              border: 'none',
              background: '#c62828 !important',
              padding: '6px 12px',
              borderRadius: '8px',
              // boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ fontWeight: 'bold', color: '#fff' }}>☰</span>
          </Navbar.Toggle>

          {/* قائمة سطح المكتب */}
          <Navbar.Collapse id="responsive-navbar-nav" className="d-none d-md-flex justify-content-end">
            <Nav className="me-auto" style={{ fontWeight: 'bold', fontSize: 17, marginLeft: 100 }}>
              <NavDropdown title="التقارير" id="desktop-reports-dropdown">
                <NavDropdown.Item as={Link} to="/dailyReport">تقرير الإنتاج اليومي</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/globalReport">التقارير الشاملة</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/globalReportRecord">سجل التقارير الشاملة</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="الفواتير" id="desktop-invoices-dropdown">
                <NavDropdown.Item as={Link} to="/invoice">سجل الفواتير</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/invoice/new">إضافة فاتورة جديدة</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="الإضافة" id="desktop-add-dropdown">
                <NavDropdown.Item as={Link} to="/addfarm">إضافة مزرعة جديدة</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/addreport">إضافة تقرير جديد</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>

          {/* قائمة الجوال - سايدبار */}
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            className="d-md-none"
            style={{
              backgroundColor: '#c62828',
              width: '260px',
              paddingTop: 10,
            }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel" style={{ color: '#fff', fontWeight: 'bold' }}>
                القائمة الرئيسية
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column" style={{ fontWeight: 'bold', fontSize: 17 }}>
                <NavDropdown title="التقارير" id="mobile-reports-dropdown">
                  <NavDropdown.Item as={Link} to="/dailyReport" className='test'>تقرير الإنتاج اليومي</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/globalReport">التقارير الشاملة</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/globalReportRecord">سجل التقارير الشاملة</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="الفواتير" id="mobile-invoices-dropdown">
                  <NavDropdown.Item as={Link} to="/invoice">سجل الفواتير</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/invoice/new">إضافة فاتورة جديدة</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown title="الإضافة" id="mobile-add-dropdown">
                  <NavDropdown.Item as={Link} to="/addfarm">إضافة مزرعة جديدة</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/addreport">إضافة تقرير جديد</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* تنسيقات إضافية */}
      <style>
        {`
          .dropdown-menu {
            text-align: right;
            background: #fff !important;
            border-radius: 10px;
            border: 1px solid #ffd6d6;
            box-shadow: 0 2px 12px #ffcdd2;
          }

          .dropdown-item {
            color: #c62828 !important;
            font-weight: bold;
            border-radius: 6px;
            transition: background 0.2s ease;
            background: #fff !important;
            border-bottom: 1px solid #ffcdd2 !important; 
          }

          .dropdown-item:hover,
          .dropdown-item:active {
            background: #c62828 !important;
            color: #fff !important;
          }
            

          .navbar-toggler {
            border-radius: 8px !important;
            background: ##c62828 !important;
            border: 1px solid #c62828 !important;
          }
            #mobile-reports-dropdown,#mobile-invoices-dropdown,#mobile-add-dropdown{
                        border-bottom: 1px solid #ffcdd2 !important;
                        margin-bottom: 20px;
                         }
          .offcanvas-header .btn-close {
  margin-right: auto;
  margin-left: 0;
}

          @media (max-width: 768px) {
            .offcanvas {
              text-align: right;
            }
          }
        `}
      </style>
    </header>  
  );
}
