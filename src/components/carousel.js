import React from 'react'
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import { container, slideContainer, slideWrapper, slide } from "./carousel.module.css"

SwiperCore.use([Navigation, Pagination])

const Carousel = () => {
  return (
    <div className={container}>
      <Swiper className={slideContainer}
        speed={1000}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        lazy={true}
        navigation
        pagination={{ clickable: true }}
      >

        <SwiperSlide className={slideWrapper}>
          <iframe className={slide}
            title="creative-board-prototype"
            src="https://codesandbox.io/embed/creative-board-prototype-7k5mt?fontsize=14&hidenavigation=1&theme=dark&view=preview"
          >
          </iframe>
        </SwiperSlide>

        <SwiperSlide className={slideWrapper}>
          <iframe className={slide}
            title="JSxPiano"
            src="https://codesandbox.io/embed/jsxpiano-ju6xp?fontsize=14&hidenavigation=1&theme=dark&view=preview"
          >
          </iframe>
        </SwiperSlide>

        <SwiperSlide className={slideWrapper}>
          <iframe className={slide}
            title="circular-motion"
            src="https://codesandbox.io/embed/circular-motion-zkpl0?fontsize=14&hidenavigation=1&theme=dark&view=preview"
          >
          </iframe>
        </SwiperSlide>

        <SwiperSlide className={slideWrapper}>
          <iframe className={slide}
            title="planet-threejs"
            src="https://codesandbox.io/embed/planet-threejs-jjpij?fontsize=14&hidenavigation=1&theme=dark&view=preview"
          >
          </iframe>
        </SwiperSlide>

        <SwiperSlide className={slideWrapper}>
          <iframe className={slide}
            title="electric-current"
            src="https://codesandbox.io/embed/electric-current-threejs-5ygj4?fontsize=14&hidenavigation=1&theme=dark&view=preview"
          >
          </iframe>
        </SwiperSlide>

        <SwiperSlide className={slideWrapper}>
          <iframe className={slide}
            title="under-renovation"
            src="https://codesandbox.io/embed/under-renovation-we2y0?fontsize=14&hidenavigation=1&theme=dark&view=preview"
          >
          </iframe>
        </SwiperSlide>

      </Swiper>
    </div>
  )
}

export default Carousel