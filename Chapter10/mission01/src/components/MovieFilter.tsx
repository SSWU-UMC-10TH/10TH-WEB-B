import { memo, useCallback, useMemo, useState, type FormEvent } from "react";
import { LANGUAGE_OPTIONS } from "../constants/movie";
import type { MovieFilters, MovieLanguage } from "../types/movie";
import { Input } from "./Input";
import LanguageSelector from "./LanguageSelector";
import { SelectBox } from "./SelectBox";

interface MovieFilterProps {
    initialFilters: MovieFilters;
    onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ initialFilters, onChange }: MovieFilterProps) => {
    const [query, setQuery] = useState<string>(initialFilters.query);
    const [includeAdult, setIncludeAdult] = useState<boolean>(initialFilters.include_adult);
    const [language, setLanguage] = useState<MovieLanguage>(initialFilters.language);

    const currentFilters = useMemo<MovieFilters>(
        () => ({
            query: query.trim(),
            include_adult: includeAdult,
            language,
        }),
        [includeAdult, language, query],
    );

    const handleQueryChange = useCallback((value: string) => {
        setQuery(value);
    }, []);

    const handleIncludeAdultChange = useCallback((checked: boolean) => {
        setIncludeAdult(checked);
    }, []);

    const handleLanguageChange = useCallback((value: MovieLanguage) => {
        setLanguage(value);
    }, []);

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onChange(currentFilters);
        },
        [currentFilters, onChange],
    );

    return (
        <section className="transform space-y-6 rounded-2xl border-gray-300 bg-white p-6 shadow-xl transition-all hover:shadow-2xl">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">영화 검색</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-6">
                <div className="min-w-[260px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        🎬영화 제목
                    </label>
                    <Input value={query} onChange={handleQueryChange} />
                </div>

                <div className="min-w-[250px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">⚙️옵션</label>
                    <SelectBox
                        checked={includeAdult}
                        onChange={handleIncludeAdultChange}
                        label="성인 콘텐츠 포함"
                        id="include_adult"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="min-w-[250px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">🌐언어</label>
                    <LanguageSelector
                        value={language}
                        onChange={handleLanguageChange}
                        options={LANGUAGE_OPTIONS}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    영화 검색
                </button>
            </form>
        </section>
    );
};

export default memo(MovieFilter);
