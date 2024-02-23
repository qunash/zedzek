import {
  Ban,
  BarChart2,
  Check,
  ClipboardCheck,
  Copy,
  Edit,
  Github,
  Laptop,
  ListPlus,
  LucideProps,
  Moon,
  SendHorizonal,
  SunMedium,
  ThumbsDown,
  ThumbsUp,
  Twitter,
  X,
  Undo2,
  User,
  Square,
  Volume2,
  // type Icon as LucideIcon,
} from "lucide-react"

// export type Icon = typeof LucideIcon

export const Icons = {
  sun: SunMedium,
  clipboardCheck: ClipboardCheck,
  stats: BarChart2,
  moon: Moon,
  laptop: Laptop,
  listPlus: ListPlus,
  twitter: Twitter,
  thumbsUp: ThumbsUp,
  thumbsDown: ThumbsDown,
  edit: Edit,
  check: Check,
  copy: Copy,
  gitHub: Github,
  close: X,
  skip: Ban,
  undo: Undo2,
  user: User,
  play: Volume2,
  stop: Square,
  submit: SendHorizonal,
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#ffffff"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width="24"
        height="24"
        viewBox="0 0 400 400"
      >
        <g
          xmlns="http://www.w3.org/2000/svg"
          transform="translate(0.000000,400.000000) scale(0.100000,-0.100000)"
          stroke="none"
        >
          <path d="M652 3469 c-46 -13 -109 -79 -122 -128 -7 -27 -10 -371 -8 -1103 l3 -1063 24 -38 c13 -21 42 -50 64 -65 l41 -27 660 -5 660 -5 96 -267 c52 -147 100 -272 106 -278 7 -7 201 -10 631 -8 l619 3 41 27 c22 15 51 44 64 65 l24 38 0 1086 0 1085 -27 41 c-15 22 -44 51 -65 64 l-38 24 -684 5 -683 5 -92 265 c-50 146 -95 271 -99 278 -10 15 -1162 16 -1215 1z m1237 -311 c170 -494 183 -528 197 -528 21 0 17 26 -15 123 l-30 87 684 -2 685 -3 32 -33 33 -32 0 -1070 0 -1070 -33 -32 -32 -33 -575 -3 c-316 -1 -575 0 -575 3 0 2 27 42 60 87 57 77 69 107 45 111 -5 1 -39 -38 -75 -86 -35 -47 -68 -83 -71 -79 -12 12 -172 472 -167 477 3 3 122 4 266 3 l260 -3 -64 -88 c-61 -82 -70 -107 -40 -107 11 0 151 185 162 215 3 7 -7 43 -21 80 -14 37 -23 70 -21 72 2 3 21 0 43 -6 61 -17 174 -13 244 9 125 39 218 138 266 284 35 108 44 306 19 420 -35 155 -122 269 -244 318 -50 20 -74 23 -187 22 -108 0 -140 -4 -189 -22 -78 -29 -150 -76 -164 -107 -19 -41 -15 -102 8 -125 29 -29 64 -25 130 16 113 70 235 84 327 39 71 -36 112 -98 127 -192 l6 -43 -290 -1 c-159 -1 -295 -2 -302 -3 -6 -1 -32 60 -58 139 -68 208 -162 478 -172 498 -10 19 -38 23 -38 6 0 -8 417 -1227 468 -1367 3 -10 -185 -12 -957 -10 l-961 3 -32 33 -33 32 0 1069 0 1069 25 27 c14 15 34 31 45 35 11 5 270 9 575 9 l556 1 83 -242z m1004 -938 c103 -39 179 -129 211 -252 48 -185 19 -405 -70 -535 -74 -107 -214 -167 -340 -146 -35 6 -80 19 -101 30 -36 18 -38 21 -114 243 -43 124 -78 228 -78 233 -1 4 144 7 320 7 l322 0 -7 66 c-9 85 -38 168 -74 214 -16 19 -55 49 -87 65 -52 27 -68 30 -144 30 -96 -1 -161 -19 -235 -65 -58 -37 -66 -37 -66 -2 0 35 29 64 93 92 119 53 262 60 370 20z" />
          <path d="M1331 2778 c-5 -13 -92 -231 -195 -485 -106 -262 -183 -468 -180 -477 5 -13 23 -16 89 -16 54 0 86 4 92 13 5 6 27 58 48 115 l38 102 202 0 203 0 44 -112 44 -113 89 0 c83 0 90 2 92 20 2 11 -84 234 -190 495 l-193 475 -87 3 c-83 3 -88 2 -96 -20z m314 -460 c94 -232 173 -430 177 -440 7 -17 3 -19 -29 -16 l-38 3 -38 100 c-21 55 -43 105 -49 112 -15 18 -471 19 -486 1 -5 -7 -27 -59 -47 -115 l-38 -103 -35 0 c-28 0 -33 3 -29 18 2 9 77 197 167 417 89 220 166 410 171 423 7 19 16 22 56 22 l48 0 170 -422z" />
          <path d="M1401 2662 c-6 -10 -51 -128 -101 -261 -71 -190 -88 -246 -79 -257 18 -22 391 -20 409 1 11 13 2 46 -55 198 -128 343 -125 337 -146 337 -10 0 -23 -8 -28 -18z m97 -283 l69 -184 -135 -3 c-74 -1 -137 0 -140 2 -2 3 26 88 64 190 38 101 70 183 72 182 1 -2 33 -86 70 -187z" />
          <path d="M2470 1687 c0 -60 26 -153 59 -211 54 -96 163 -142 278 -118 132 28 208 131 229 312 l7 60 -287 0 -286 0 0 -43z m505 -49 c-15 -96 -75 -186 -142 -214 -42 -18 -124 -18 -166 0 -49 20 -102 88 -121 155 -31 110 -49 101 210 101 l226 0 -7 -42z" />
        </g>
      </svg>
    </svg>
  ),
  discord: (props: LucideProps) => (
    <svg
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#ffffff"
      strokeWidth="2"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>discord</title>{" "}
        <path d="M20.992 20.163c-1.511-0.099-2.699-1.349-2.699-2.877 0-0.051 0.001-0.102 0.004-0.153l-0 0.007c-0.003-0.048-0.005-0.104-0.005-0.161 0-1.525 1.19-2.771 2.692-2.862l0.008-0c1.509 0.082 2.701 1.325 2.701 2.847 0 0.062-0.002 0.123-0.006 0.184l0-0.008c0.003 0.050 0.005 0.109 0.005 0.168 0 1.523-1.191 2.768-2.693 2.854l-0.008 0zM11.026 20.163c-1.511-0.099-2.699-1.349-2.699-2.877 0-0.051 0.001-0.102 0.004-0.153l-0 0.007c-0.003-0.048-0.005-0.104-0.005-0.161 0-1.525 1.19-2.771 2.692-2.862l0.008-0c1.509 0.082 2.701 1.325 2.701 2.847 0 0.062-0.002 0.123-0.006 0.184l0-0.008c0.003 0.048 0.005 0.104 0.005 0.161 0 1.525-1.19 2.771-2.692 2.862l-0.008 0zM26.393 6.465c-1.763-0.832-3.811-1.49-5.955-1.871l-0.149-0.022c-0.005-0.001-0.011-0.002-0.017-0.002-0.035 0-0.065 0.019-0.081 0.047l-0 0c-0.234 0.411-0.488 0.924-0.717 1.45l-0.043 0.111c-1.030-0.165-2.218-0.259-3.428-0.259s-2.398 0.094-3.557 0.275l0.129-0.017c-0.27-0.63-0.528-1.142-0.813-1.638l0.041 0.077c-0.017-0.029-0.048-0.047-0.083-0.047-0.005 0-0.011 0-0.016 0.001l0.001-0c-2.293 0.403-4.342 1.060-6.256 1.957l0.151-0.064c-0.017 0.007-0.031 0.019-0.040 0.034l-0 0c-2.854 4.041-4.562 9.069-4.562 14.496 0 0.907 0.048 1.802 0.141 2.684l-0.009-0.11c0.003 0.029 0.018 0.053 0.039 0.070l0 0c2.14 1.601 4.628 2.891 7.313 3.738l0.176 0.048c0.008 0.003 0.018 0.004 0.028 0.004 0.032 0 0.060-0.015 0.077-0.038l0-0c0.535-0.72 1.044-1.536 1.485-2.392l0.047-0.1c0.006-0.012 0.010-0.027 0.010-0.043 0-0.041-0.026-0.075-0.062-0.089l-0.001-0c-0.912-0.352-1.683-0.727-2.417-1.157l0.077 0.042c-0.029-0.017-0.048-0.048-0.048-0.083 0-0.031 0.015-0.059 0.038-0.076l0-0c0.157-0.118 0.315-0.24 0.465-0.364 0.016-0.013 0.037-0.021 0.059-0.021 0.014 0 0.027 0.003 0.038 0.008l-0.001-0c2.208 1.061 4.8 1.681 7.536 1.681s5.329-0.62 7.643-1.727l-0.107 0.046c0.012-0.006 0.025-0.009 0.040-0.009 0.022 0 0.043 0.008 0.059 0.021l-0-0c0.15 0.124 0.307 0.248 0.466 0.365 0.023 0.018 0.038 0.046 0.038 0.077 0 0.035-0.019 0.065-0.046 0.082l-0 0c-0.661 0.395-1.432 0.769-2.235 1.078l-0.105 0.036c-0.036 0.014-0.062 0.049-0.062 0.089 0 0.016 0.004 0.031 0.011 0.044l-0-0.001c0.501 0.96 1.009 1.775 1.571 2.548l-0.040-0.057c0.017 0.024 0.046 0.040 0.077 0.040 0.010 0 0.020-0.002 0.029-0.004l-0.001 0c2.865-0.892 5.358-2.182 7.566-3.832l-0.065 0.047c0.022-0.016 0.036-0.041 0.039-0.069l0-0c0.087-0.784 0.136-1.694 0.136-2.615 0-5.415-1.712-10.43-4.623-14.534l0.052 0.078c-0.008-0.016-0.022-0.029-0.038-0.036l-0-0z"></path>{" "}
      </g>
    </svg>
  ),
  proofread: (props: LucideProps) => (
    <svg
        fill="none"
        fillRule="evenodd"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 116.5 122.88"
        stroke="#000000"
        {...props}
    >
        <title>proofread</title>
        <path d="M17.88,22.75a2.19,2.19,0,0,1,3.05.6L22,24.66l3.84-4.87a2.2,2.2,0,1,1,3.4,2.78L23.6,29.66a2.74,2.74,0,0,1-.52.5A2.21,2.21,0,0,1,20,29.55L17.28,25.8a2.21,2.21,0,0,1,.6-3.05ZM81.13,59a27.86,27.86,0,0,1,23.31,43.1l12.06,13.14-8.31,7.6L96.56,110.09A27.86,27.86,0,1,1,81.13,59ZM38.47,71.54a3.07,3.07,0,0,1-2.9-3.17,3,3,0,0,1,2.9-3.17h9a3.07,3.07,0,0,1,2.9,3.17,3,3,0,0,1-2.9,3.17ZM93,44.89c-.56,2.11-5.31,2.43-6.38,0V7.43a1.06,1.06,0,0,0-.3-.76,1.08,1.08,0,0,0-.75-.3H7.39a1,1,0,0,0-1,1.06V95.74a1,1,0,0,0,1,1.05H37.72c3.21.34,3.3,5.88,0,6.38H7.43A7.48,7.48,0,0,1,0,95.74V7.43A7.3,7.3,0,0,1,2.19,2.19,7.35,7.35,0,0,1,7.43,0H85.6a7.32,7.32,0,0,1,5.24,2.19A7.39,7.39,0,0,1,93,7.43c0,36.56,0-18,0,37.46ZM38.44,27.47a3.07,3.07,0,0,1-2.91-3.17,3,3,0,0,1,2.91-3.17H68.21a3.07,3.07,0,0,1,2.91,3.17,3,3,0,0,1-2.91,3.17Zm0,22a3.06,3.06,0,0,1-2.91-3.16,3,3,0,0,1,2.91-3.17H68.21a3.07,3.07,0,0,1,2.91,3.17,3,3,0,0,1-2.91,3.16Zm32.19,40a3.4,3.4,0,0,1-.38-.49,3.71,3.71,0,0,1-.29-.56A3.54,3.54,0,0,1,75.05,84a2.78,2.78,0,0,1,.56.41l0,0c1,.93,1.28,1.12,2.36,2.08l.92.83,7.58-8.13c3.21-3.3,8.32,1.53,5.12,4.9L82.15,94.26l-.47.5a3.56,3.56,0,0,1-5,.22l0,0L76,94.28c-.58-.52-1.18-1-1.79-1.57-1.4-1.22-2.22-1.89-3.54-3.21ZM81.15,64.85A22.17,22.17,0,1,1,59,87,22.17,22.17,0,0,1,81.15,64.85ZM23.54,63.59a5.1,5.1,0,1,1-5.09,5.09,5.09,5.09,0,0,1,5.09-5.09ZM25.66,42a2.09,2.09,0,0,1,3,0,2.12,2.12,0,0,1,0,3l-2.07,2.13,2.07,2.13a2.1,2.1,0,0,1-3,3l-2.05-2.1-2.07,2.11a2.07,2.07,0,0,1-3,0,2.13,2.13,0,0,1,0-3l2.08-2.13L18.57,45a2.1,2.1,0,0,1,0-3,2.07,2.07,0,0,1,2.94,0l2.06,2.11L25.66,42Z" />
    </svg>
),
}