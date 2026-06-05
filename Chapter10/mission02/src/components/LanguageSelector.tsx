import type { Language } from "../types/movie";

interface LanguageOption {
    value: Language;
    label: string;
}

interface LanguageSelectorProps {
    value: Language;
    onChange: (value: Language) => void;
    options: readonly LanguageOption[];
    className?: string;
}

const LanguageSelector = ({
    value,
    onChange,
    options,
    className = "",
}: LanguageSelectorProps) => {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value as Language)}
            className={className}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelector;
