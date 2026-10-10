# tha-pyay-nu 
'Tha Pyay Nu' is a responsive book-selling e-commerce platform that customers can browse,add to cart and checkout books.

**Live Demo:** https://tha-pyay-nu.vercel.app/
The API is hosted on a free Render ,so that the first load can take up to a minute. 

![Home page](docs/screenshots/home.png)

## Features
- Users can register and log in 
- Users can browse books and checkout the cart
- Users can track orders
- Admin: manages book metadata, genres, store listings and orders

## Tech Stack 
- Frontend: React, TypeScript, Vite, Tailwind CSS , Redux Toolkit (RTK Query)
- Backend: Node.js, Express, Prisma, PostgreSQL

### Prerequisites
- Node.js [version]
- The [Tha Pyay Nu API](https://github.com/Paung1999/tha-pyay-nu-api) running locally

### Installation
git clone https://github.com/Paung1999/tha-pyay-nu-client.git
cd tha-pyay-nu-client
npm install
npm run dev

## Related Repository
The backend for this frontend is [tha-pyay-nu-api]( https://github.com/Paung1999/tha-pyay-nu-api)