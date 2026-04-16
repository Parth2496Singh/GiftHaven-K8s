import { Link } from "react-router-dom";
import categoryBirthday from "@/assets/category-birthday.jpg";
import categoryAnniversary from "@/assets/category-anniversary.jpg";
import categoryForHim from "@/assets/category-forhim.jpg";
import categoryForHer from "@/assets/category-forher.jpg";
import categoryKids from "@/assets/category-kids.jpg";
import categoryCorporate from "@/assets/category-corporate.jpg";

const categoriesData = [
  { name: "Birthday Gifts", slug: "birthday-gifts", image: categoryBirthday },
  { name: "Anniversary Gifts", slug: "anniversary-gifts", image: categoryAnniversary },
  { name: "Gifts for Him", slug: "gifts-for-him", image: categoryForHim },
  { name: "Gifts for Her", slug: "gifts-for-her", image: categoryForHer },
  { name: "Kids Gifts", slug: "kids-gifts", image: categoryKids },
  { name: "Corporate Gifts", slug: "corporate-gifts", image: categoryCorporate },
];

const CategoryGrid = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Shop by Occasion</h2>
        <p className="text-muted-foreground mt-2">Find the ideal gift for every celebration</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categoriesData.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="group relative overflow-hidden rounded-xl aspect-square shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img src={cat.image} alt={cat.name} loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-sm md:text-base font-semibold text-primary-foreground text-center">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
