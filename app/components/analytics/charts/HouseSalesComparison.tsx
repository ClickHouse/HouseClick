import DebugQuery from "@/components/DebugQuery";

export default function HouseSalesComparison({ data, metadata, debug }) {


  return (
    <div className="flex flex-col w-full h-full border rounded-lg bg-[#282828] border-[#414141]">
      {debug && <div className='flex justify-end items-center pt-2 px-2'><DebugQuery metadata={metadata} /></div>}
      <div className="p-6 w-full h-full rounded-lg">
        <div className="flex flex-col space-y-6 h-full justify-between">
          <div></div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl text-[#FAFF69] font-bold text-center">{new Intl.NumberFormat().format(data[0].area_count)}</span>
            <span className="text-[#FB64D6] text-6xl font-bold text-center">{new Intl.NumberFormat().format(data[0].national_count)}</span>
          </div>
          <div className="flex items-center gap-4 self-center">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#FAFF69] mr-2"></div><span className="text-[#FAFF69] text-sm">Area sales</span></div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#FB64D6] mr-2"></div><span className="text-[#FB64D6] text-sm">National sales</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
