import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Filter({ items, selected, onChange }) {
  const selectedItem = items.find((item) => item.id === selected.id);
  return (
    <Listbox value={selectedItem} onChange={onChange}>
      {({ open }) => (
        <div className="text-md relative mt-2 inline-flex w-full items-center justify-center rounded-md bg-slate-50 px-5 py-2 font-semibold text-neutral-900 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mt-0 md:w-64 md:flex-initial">
          <Listbox.Button className="">
            <span className="block truncate">{selectedItem.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute top-10 z-10 -mt-1 max-h-60 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items.map((item) => (
                <Listbox.Option
                  key={item.id}
                  className={({ active }) =>
                    classNames(
                      active
                        ? "bg-primary-300 text-neutral-900"
                        : "text-neutral-900",
                      "relative cursor-default select-none p-3 hover:cursor-pointer "
                    )
                  }
                  value={item}
                >
                  {({ selectedItem, active }) => (
                    <>
                      <span
                        className={classNames(
                          selectedItem ? "font-semibold" : "font-normal",
                          "block truncate"
                        )}
                      >
                        {item.name}
                      </span>

                      {selectedItem ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-indigo-600",
                            "absolute inset-y-0 right-0 flex items-center pr-4"
                          )}
                        ></span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
