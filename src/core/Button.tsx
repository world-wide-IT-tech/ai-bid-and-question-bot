import tw from 'tailwind-styled-components';

type TButton = {
    $variants?: 'primary';
}

export const Button = tw.button<TButton>`
    ${(p) => (p.$variants == 'primary' ? "bg-blue-500" : "bg-indigo-300")}

    hover:bg-blue-700 text-white font-bold py-1 px-2 rounded
    text-sm
    disabled:bg-none
    disabled:cursor-not-allowed
`
