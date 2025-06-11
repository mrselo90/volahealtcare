'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const posts = [
  {
    id: 1,
    title: 'Why Turkey is a Leading Destination for Medical Tourism',
    description: 'Discover why thousands of patients choose Turkey for their medical procedures, from state-of-the-art facilities to experienced doctors.',
    author: 'Dr. Mehmet Yilmaz',
    date: 'Mar 16, 2024',
    category: 'Medical Tourism',
    image: '/images/blog-1.jpg',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'The Complete Guide to Dental Veneers',
    description: 'Everything you need to know about dental veneers, from the procedure to recovery and maintenance.',
    author: 'Dr. Sarah Thompson',
    date: 'Mar 14, 2024',
    category: 'Dental Aesthetics',
    image: '/images/blog-2.jpg',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'Understanding Rhinoplasty: What to Expect',
    description: 'A comprehensive guide to nose surgery, including preparation, procedure, and recovery timeline.',
    author: 'Dr. John Smith',
    date: 'Mar 12, 2024',
    category: 'Facial Aesthetics',
    image: '/images/blog-3.jpg',
    readTime: '10 min read',
  },
  {
    id: 4,
    title: 'Body Contouring: Surgical vs Non-Surgical Options',
    description: 'Compare different body contouring methods to find the best option for your goals.',
    author: 'Dr. Maria Rodriguez',
    date: 'Mar 10, 2024',
    category: 'Body Aesthetics',
    image: '/images/blog-4.jpg',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'Planning Your Medical Tourism Trip: A Checklist',
    description: 'Essential tips and considerations for planning your medical tourism journey to ensure a smooth experience.',
    author: 'Emma Wilson',
    date: 'Mar 8, 2024',
    category: 'Medical Tourism',
    image: '/images/blog-5.jpg',
    readTime: '6 min read',
  },
  {
    id: 6,
    title: 'Latest Innovations in Aesthetic Dentistry',
    description: 'Explore cutting-edge technologies and techniques in modern dental aesthetics.',
    author: 'Dr. David Lee',
    date: 'Mar 6, 2024',
    category: 'Dental Aesthetics',
    image: '/images/blog-6.jpg',
    readTime: '9 min read',
  },
];

const categories = [
  { name: 'All', value: 'all' },
  { name: 'Medical Tourism', value: 'Medical Tourism' },
  { name: 'Dental Aesthetics', value: 'Dental Aesthetics' },
  { name: 'Facial Aesthetics', value: 'Facial Aesthetics' },
  { name: 'Body Aesthetics', value: 'Body Aesthetics' },
];

export default function Blog() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Medical Tourism Blog
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Stay informed about the latest trends, procedures, and insights in medical tourism and aesthetic treatments.
          </p>
        </motion.div>

        <div className="mt-10 flex justify-center space-x-4">
          {categories.map((category) => (
            <button
              key={category.value}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col items-start"
            >
              <div className="relative w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.date} className="text-gray-500">
                    {post.date}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    {post.category}
                  </span>
                  <span className="text-gray-500">{post.readTime}</span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={`/blog/${post.id}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.description}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <Image
                    src={`/images/author-${post.id}.jpg`}
                    alt={post.author}
                    className="h-10 w-10 rounded-full bg-gray-100"
                    width={40}
                    height={40}
                  />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      {post.author}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <button className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Load More Articles
          </button>
        </motion.div>
      </div>
    </div>
  );
} 