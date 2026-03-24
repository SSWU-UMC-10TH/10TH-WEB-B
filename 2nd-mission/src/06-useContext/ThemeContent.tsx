import { THEME, useTheme } from "./context/ThemeProvider";
import clsx from 'clsx';

export default function ThemeContent() {
    const{theme} = useTheme();
    const isLightMode = theme === THEME.LIGHT;

    return (
        <div className={clsx(
            'p-4 w-full flex-1', 
            isLightMode ? 'bg-white' : 'bg-gray-800')}
        >
            <h1 className={clsx(
            'text-wxl font-bold', 
            isLightMode ? 'text-black' : 'text-white')}
            >
            Theme Content
            </h1>
            <p className={clsx(
                'mt-2', 
                isLightMode? 'text-black' : 'text-white'
            )}>
                하늘하늘~가볍고 유연한 텍스쳐로 여리여리한 분위기♡ 전체 허리밴딩과 롱한 기장감으로 예쁘고 편안하게 즐겨주세요!
            </p>
        </div>
    )
}