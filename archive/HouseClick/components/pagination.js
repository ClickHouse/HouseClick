import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

export default function Pagination({num_pages, selected, onChange}) {
  
  const pages = [...Array(Math.min(num_pages, 10)).keys()].map(page => {
      return (
        <a href="#" key={page+1} onClick={event => onChange(page+1)}  className={`inline-flex items-center border-t-2 border-transparent px-4 p-2 text-sm font-medium text-primary-300  hover:underline ${page + 1 === selected ? 'active-page': ''}`}> {page+1}  </a>
     )
  })

  return (
    <nav className="flex items-center justify-between border-t border-neutral-700 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        {
            selected > 1 ? (
                <a href="#"  className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-primary-300  hover:underline" onClick={event => onChange(selected-1)}>
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-primary-300"
            aria-hidden="true"
          />
          Previous
        </a>
            ): null
        }
      </div>
      <div className="hidden md:-mt-px md:flex pt-2">
         { pages }
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {
            num_pages > 1 && selected < 10 ? (
        <a
          href="#" onClick={event => onChange(selected+1)}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-primary-300  hover:underline"
        >
          Next
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-primary-300"
            aria-hidden="true"
          />
        </a>
            ): null
        }
        
      </div>
    </nav>
  );
}
