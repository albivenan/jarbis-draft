import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...(props as unknown as ImgHTMLAttributes<HTMLImageElement>)}
            src="/image/jrabis-logo.jpg"
            alt="Jarbis logo"
        />
    );
}
