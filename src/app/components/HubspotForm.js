import { useEffect } from 'react';

const HubspotForm = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.hsforms.net/forms/v2.js';
        document.body.appendChild(script);
   
        script.addEventListener('load', () => {
           if(window.hbspt) {
              window.hbspt.forms.create({
                region: "na1",
                portalId: '20956331',
                formId: '55aa3844-557b-4b60-bb65-99d7e05b2fb5',
              });
           }
        });
      }, []);
  return (
    <div id="hubspotForm" className="hubspotForm"></div>
  )
}

export default HubspotForm;
