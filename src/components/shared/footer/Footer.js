import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#7FB1E6',
    color: 'white',
  };

  return (
    <footer style={footerStyle} className="py-2">
      <div className='container'>
        <div className="row">
          <div className="col-md-6 text-start mt-3">
            <p>Desarrollado por <img src="/img/logoBinasCode.jpg" width={25} alt="" /> <a href='https://binascode.com/'>https://binascode.com/</a></p>
          </div>
          <div className="col-md-6 text-end mt-3">
            <p>© 2023 Fraternidad Sendero de Luz México. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
