import ProductCard from "./shared/ProductCard";

const Products = [
  {
    image: "https://embarkx.com/sample/placeholder.png",
    productName: "iPhone 13 Pro Max",
    description:
      "The iPhone 13 Pro Max offers exceptional performance with its A15 Bionic chip, stunning Super Retina XDR display, and advanced camera features for breathtaking photos.",
    specialPrice: 720,
    price: 780,
  },
  {
    image: "https://embarkx.com/sample/placeholder.png",
    productName: "Samsung Galaxy S21",
    description:
      "Experience the brilliance of the Samsung Galaxy S21 with its vibrant AMOLED display, powerful camera, and sleek design that fits perfectly in your hand.",
    specialPrice: 699,
    price: 799,
  },
  {
    image: "https://embarkx.com/sample/placeholder.png",
    productName: "Google Pixel 6",
    description:
      "The Google Pixel 6 boasts cutting-edge AI features, exceptional photo quality, and a stunning display, making it a perfect choice for Android enthusiasts.",
    price: 599,
    specialPrice: 400,
  },
];

const About = () => {
  return (
    <div className="page-section py-12">
      <div className="surface-card mb-10 grid gap-10 px-6 py-10 lg:grid-cols-2 lg:px-10">
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
            About us
          </span>
          <h1 className="section-heading mb-6">A cleaner commerce experience.</h1>
          <p className="section-subtext text-lg">
            Welcome to Ansh-Verse. We focus on curated products, simple checkout flows, and a shopping experience that feels modern from first visit to final order.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem]">
          <img
            src="https://images.pexels.com/photos/6238363/pexels-photo-6238363.jpeg"
            alt="About Us"
            className="h-full w-full rounded-[2rem] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>

      <div className="py-7 space-y-8">
        <div className="text-center">
          <h1 className="section-heading">Our Products</h1>
          <p className="section-subtext mx-auto mt-3 max-w-2xl">
            A premium mix of devices and lifestyle essentials presented in a cleaner catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              productName={product.productName}
              description={product.description}
              specialPrice={product.specialPrice}
              price={product.price}
              about
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
