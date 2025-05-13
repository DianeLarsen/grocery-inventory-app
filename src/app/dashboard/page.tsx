import ProductSearch from "@/components/ProductSearch";


export default function DashboardPage() {
  return (
    <div className="grid grid-flow-col grid-rows-3 gap-4">
      <div className="row-span-3 ..."><ProductSearch /></div>
      <div className="col-span-2 ...">02</div>
      <div className="col-span-2 row-span-2 ...">03</div>
    </div>
  );
}
