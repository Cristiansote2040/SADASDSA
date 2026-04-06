import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "../Styles/Components/Carrusel.css";
import { Link } from "react-router-dom";
const slides = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dcvrqh4no/image/upload/v1774907592/RestauranteElegante_olh6dw.avif",
    title: "Pique Picante",
    text: "Somos un restaurante boliviano comprometido con la calidad y los sabores auténticos de nuestra tierra.",
    btn: "Ver más",
    direccion: "/",

  },
  {
    id: 2,
    src: "https://trexperienceperu.com/sites/default/files/2024-06/peruvian%20food.jpg",
    title: "Nuestros productos",
    text: "Ofrecemos platos tradicionales como Picante Pollo, Pollo a la Brasa y Lechón Crujiente, hechos con ingredientes frescos.",
    btn: "Ver productos",
    direccion: "/products",    
  },
  {
    id: 3,
    src: "https://c4.wallpaperflare.com/wallpaper/835/64/911/asado-comida-patatas-pollo-wallpaper-preview.jpg",
    title: "Promociones especiales",
    text: "Disfruta de descuentos exclusivos y combos especiales cada semana, pensados para que pruebes lo mejor de nuestra cocina.",
    btn: "Conocer promociones",
    direccion: "/promotions",
  },
  {
    id: 4,
    src: "https://images.alphacoders.com/976/976658.jpg",
    title: "Dónde estamos",
    text: "Visítanos en nuestro local principal o descubre cómo recibir nuestros platos directamente en tu domicilio.",
    btn: "Ubicación",
    direccion: "/#Ubi",
  },
  {
    id: 5,
    src: "https://img.freepik.com/foto-gratis/bartender-que-muestra-precios-al-cliente_23-2147795690.jpg?semt=ais_hybrid&w=740&q=80",
    title: "Cómo retirar tu pedido",
    text: "Retira tu pedido en el local con facilidad, o disfruta del servicio a domicilio con todas las medidas de seguridad.",
    btn: "Ver más",
    direccion: "/Comprar",
  },
];

export default function CarruselTextos() {
  return (
    <motion.div
      className="carruselTextosContainer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        navigation
        slidesPerView={1}
        speed={800}
        className="mainSwiperTextos"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slideWrapperTextos">
              <img
                src={slide.src}
                alt={slide.title}
                className="slideImgTextos"
              />
              <div className="slideOverlayTextos">
                <h2>{slide.title}</h2>
                <p>{slide.text}</p>
                <Link to={slide.direccion}>
                  <button className="slideBtnTextos">{slide.btn}</button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}
