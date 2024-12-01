export default function Page() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full h-40 bg-slate-200 rounded-md"></div>
          <div className="w-full h-40 bg-slate-200 rounded-md"></div>
          <div className="w-full h-40 bg-slate-200 rounded-md"></div>
          <div className="w-full h-40 bg-slate-200 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full h-80 bg-red-200 rounded-md"></div>
          <div className="w-full h-80 bg-red-200 rounded-md"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
        <div className="grid gap-4">
          <div className="w-full h-80 bg-slate-200 rounded-md"></div>
          <div className="w-full h-80 bg-slate-200 rounded-md"></div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 justify-start">
          <div className="w-full h-52 bg-slate-200 rounded-md"></div>
          <div className="w-full h-52 bg-slate-200 rounded-md"></div>
          <div className="w-full h-52 bg-slate-200 rounded-md"></div>
          <div className="w-full h-52 bg-slate-200 rounded-md"></div>
          <div className="w-full h-52 bg-slate-200 rounded-md md:col-span-2"></div>
        </div>
      </div>
    </div>
  );
}
