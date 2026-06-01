import { useState } from "react";
import { LANGUAGE_OPTIONS } from "../constants/movie";
import type { Language, MovieFilters } from "../types/movie";
import { Input } from "./Input";
import LanguageSelector from "./LanguageSelector";
import { SelectBox } from "./SelectBox";

interface MovieFilterProps {
    onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
    const [query, setQuery] = useState("");
    const [includeAdult, setIncludeAdult] = useState(false);
    const [language, setLanguage] = useState<Language>("ko-KR");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onChange({
            query: query.trim(),
            include_adult: includeAdult,
            language,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
        >
            <h1 className="text-2xl font-bold text-gray-900">영화 검색</h1>
            <div className="flex flex-wrap gap-6">
                <div className="min-w-[260px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        영화 제목
                    </label>
                    <Input
                        value={query}
                        onChange={setQuery}
                        placeholder="영화 제목을 입력하세요"
                        className="border border-gray-300"
                    />
                </div>
                <div className="min-w-[220px] flex-1">
                    <span className="mb-2 block text-sm font-medium text-gray-700">옵션</span>
                    <SelectBox
                        checked={includeAdult}
                        onChange={setIncludeAdult}
                        label="성인 콘텐츠 포함"
                        id="include_adult"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm"
                    />
                </div>
                <div className="min-w-[220px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">언어</label>
                    <LanguageSelector
                        value={language}
                        onChange={setLanguage}
                        options={LANGUAGE_OPTIONS}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        영화 검색
                    </button>
                </div>
            </div>
        </form>
    );
};

export default MovieFilter;
