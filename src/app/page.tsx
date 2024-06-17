import Feed from "@/components/Feed";
import Input from "@/components/Input";

export default function Home() {
  return (
    <div className="max-w-xl  mx-auto">
      <div className="py-2 px-3 stick top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
      </div>
      <Input />
      <Feed />
    </div>
  );
}
