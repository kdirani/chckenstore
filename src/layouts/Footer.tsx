import logo from '../assets/qudirani-logo.jpg';

const Footer = () => (
  <footer
    style={{
      width: '100%',
      background: '#c62828',
      color: '#fff',
    
      padding: '18px 0 11px 0',
      marginTop: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: '"IBM Plex Sans Arabic", "Ancizar Sans", Arial, sans-serif',
      fontSize: 16,
      flexWrap: 'wrap',
      minHeight: 60,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 32 }}>
      <img
        src={logo}
        alt="شعار القديراني"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#fff',
          border: '2px solid #fff',
          objectFit: 'contain',
        }}
      />
      <span style={{ fontWeight: 'bold', fontSize: 18 }}>مداجن القديراني</span>
    </div>     
    <div style={{ marginLeft: 32, textAlign: 'left', fontSize: 15 }}>
      جميع الحقوق محفوظة &copy; {new Date().getFullYear()}
    </div>
    <style>
      {`
        @media (max-width: 600px) {
          footer {
            flex-direction: column !important;
            gap: 10px;
          display: flex;
          gap: 16px;
        }

        .footer-icon {
          color: #fff;
          font-size: 18px;
          transition: color 0.3s ease;
        }

        .footer-icon:hover {
          color: #ffcdd2;
        }

        .footer-rights {
          font-size: 15px;
        }

        @media (max-width: 600px) {
          .footer-container {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .footer-brand,
          .footer-contact,
          .footer-rights {
            margin: 0;
            justify-content: center;
          }
        }
      `}
    </style>
  </footer>
);

export default Footer;
