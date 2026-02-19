import { Link } from "react-router-dom";

const categories = [
  "Wedding",
  "Party",
  "Ethnic",
  "Casual",
  "Formal",
  "Traditional",
  "Festive"
];

function CategoryBar() {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-black/10">
      <div className="page-shell overflow-x-auto">
        <div className="flex gap-6 py-3 whitespace-nowrap">
          {categories.map(cat => (
            <Link
              key={cat}
              to={`/shop?q=${cat.toLowerCase()}`}
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryBar;
