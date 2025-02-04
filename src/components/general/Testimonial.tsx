"use client";
import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Image from 'next/image';

const testimonials = [
    {
      id: 1,
      picture:'/img/hotel-gallery-1.jpg',
      text: "Cette application a changé ma vie !",
      author: "Jean"
    },
    {
      id: 2,
      picture:'/img/hotel-gallery-1.jpg',
      text: "Un service exceptionnel et très utile.",
      author: "Marie"
    },
    {
      id: 3,
      picture:'/img/hotel-gallery-1.jpg',
      text: "Je recommande fortement cette application.",
      author: "Albert"
    },
  ];

const Testimonial = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        className:"flex items-center flex-col justify-center",
        slidesToShow: 1,
        slidesToScroll: 1,
      };
  return (
    <div className='flex flex-col items-center justfy-center'>
        <h3 className="font-medium title my-[2rem]">TESTIMONIALS</h3>
        <div className="max-w-xl mx-auto py-8 text">
            <Slider {...settings}>
                {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex items-center justify-center">
                    <Image src={testimonial.picture} alt={testimonial.author} width={150} height={150} className="flex flex-col items-center justify-center object-cover rounded-full"/>
                    <p className=" flex text-center italic">"{testimonial.text}"</p>
                    <cite className="block font-semibold text-right ">
                    - {testimonial.author}
                    </cite>
                </div>
                ))}
            </Slider>
        </div>
    </div>
  )
}

export default Testimonial