import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

const SelectTextField = ({
    label,
    select,
    setSelect,
    lists
}) => {
    return (
        <Listbox value={select ?? null} onChange={setSelect}>
        <div className="flex flex-col gap-2 w-full">
            <label
                htmlFor="id"
                className="font-semibold text-sm text-slate-800">
                {label}
            </label>
        
            <div className="relative">
                <ListboxButton 
                className="form-input relative cursor-default pr-10 text-left text-sm text-slate-700 sm:leading-6">
                    <span className="block truncate">{select?.categoryName || ""}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                        <LuChevronsUpDown className="text-lg" />
                    </span>
                </ListboxButton>
                <ListboxOptions
                    transition
                    className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 text-base shadow-xl focus:outline-hidden">
                    {lists?.map((category) => (
                    <ListboxOption key={category.categoryId} value={category} 
                    className="group relative cursor-default rounded-xl py-3 pl-3 pr-9 text-slate-900 data-focus:bg-indigo-50 data-focus:text-indigo-700">
                        <span className="block truncate font-semibold group-data-selected:font-semibold">
                            {category.categoryName}
                        </span>

                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 [.group:not([data-selected])_&]:hidden">
                            <LuCheck className="text-xl"/>
                        </span>
                        
                    </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </div>
        </Listbox>
    );
};

export default SelectTextField;
