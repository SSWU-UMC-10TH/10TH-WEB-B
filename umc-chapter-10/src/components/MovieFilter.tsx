import { memo, useState } from "react";
import type { FormEvent } from 'react';
import type { MovieFilters, MovieLanguage } from "../types/movie";
import { Input } from "./Input";
import { SelectBox } from "./SelectBox";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGE_OPTIONS } from "../constants/movie";

interface MovieFilterProps {
    onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({onChange}: MovieFilterProps) => {
    const [query, setQuery] = useState<string>('');
    const [includeAdult, setIncludeAdult] = useState<boolean>(false);
    const [language, setLanguage] = useState<MovieLanguage>('ko-KR');
    const handleLanguageChange = (value: string) => {
        setLanguage(value as MovieLanguage);
    }

    const handleSubmit = (e?: FormEvent) => {
        if (e) e.preventDefault();
        const filters: MovieFilters = {
            query,
            include_adult: includeAdult,
            language,
        }
        onChange(filters);
    }
  return (
    <div className="transform space-y-6 rounded-2xl border-gray-300 bg-white
     p-6 shadow-xl transition-all hover:shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[450px]">
                <label className="mb-2 block text-sm font-medium text-gray-700">영화 제목</label>
                <Input value={query} onChange={setQuery} placeholder="영화 제목을 입력하세요" />
            </div>

            <div className="flex-1 min-w-[250px]">
                <label className="mb-2 block text-sm font-medium text-gray-700">⚙️옵션</label>
                <SelectBox
                checked={includeAdult}
                onChange={setIncludeAdult}
                label="성인 콘텐츠 포함"
                id="include_adult"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 
                shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">🗣️언어</label>
                <LanguageSelector
                value={language}
                onChange={handleLanguageChange}
                options={LANGUAGE_OPTIONS}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 
                shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="pt-4">
             <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">🔎 검색하기</button>
            </div>
        </form>
    </div>
)
};

export default memo(MovieFilter);               