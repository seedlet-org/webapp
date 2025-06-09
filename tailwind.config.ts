import {type Config} from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-manrope"],
            },
            fontSize: {
                h1: ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '1.4', fontWeight: '400' }],
            },
            colors: {
                primary: '#42B883',
                'primary-dark': '#36A273',
                'primary-light': '#C9F4E5',
                secondary: '#333333',
                'secondary-light': '#4F4F4F',
                accent: '#FEE440',
                'accent-soft': '#FFF9C4',
            },
        },
    },
};

export default config;