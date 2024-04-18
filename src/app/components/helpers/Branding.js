import { Stack } from '@mui/material';
import Image from 'next/image';
import appfolioLogo from '/public/images/appfolio-logo.png';
import levLogo from '/public/images/Logo.svg';

export default function Branding ({justifyContent}){
    return(
        <Stack flexDirection="row" justifyContent={justifyContent} className="logos" >
            <Image src={levLogo} alt="" className="lev-logo"/>
            <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4399 1L1.43994 11M1.43994 1L11.4399 11" stroke="#737373" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <Image src={appfolioLogo} alt="" className="appfolio-logo" />
        </Stack>
    )
}

