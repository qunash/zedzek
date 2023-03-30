import { ImageResponse } from '@vercel/og'
import Image from 'next/image'

export const config = {
    runtime: 'edge',
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
    return new ImageResponse(
        (
            <div tw="flex h-full w-full flex-col items-center justify-center bg-black border-2 border-white/10">
                <div tw="absolute bottom-0 right-0 flex"
                    style={{
                        transform: 'translate(26%, 4%) rotate(-45deg)',
                        transformOrigin: 'center',
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-1966 0 3932 1966" version="1.1" width="1000" height="508" opacity={0.1}>
                        <rect x="-1966" width="3932" height="1966" fill="none" />
                        <g fill="#ffffff">
                            <path id="star" d="M0 488l22.96 70.67h74.3L37.15 602.34 60.11 673 0 629.33-60.11 673l22.96-70.66-60.11-43.67h74.3Z" />
                            <path id="arrow" d="M0 781 32 963 11 983v687l22 23v171L0 1831l-33 33V1693l22-23V983l-21-20Z" />
                            <use xlinkHref="#star" y="-392" />
                            <g id="half">
                                <use xlinkHref="#star" x="486" />
                                <use xlinkHref="#star" x="486" y="-314" />
                                <use xlinkHref="#star" x="923" y="-93" />
                                <use xlinkHref="#star" x="1271" y="255" />
                                <use xlinkHref="#star" x="1494" y="693" />
                                <use xlinkHref="#arrow" transform="rotate(40,0,1326)" />
                            </g>
                            <use xlinkHref="#half" transform="scale(-1,1)" />
                        </g>
                    </svg>
                </div>
                <div tw="p-4 text-8xl text-white">Zədzək</div>
                <div tw="p-4 text-6xl text-white">Circassian translator demo</div>
            </div>
        ),
        {
            width: 1200,
            height: 600,
        }
    )
}
