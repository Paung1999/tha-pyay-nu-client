import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Cart from "./pages/Cart.tsx";
import Orders from "./pages/Orders.tsx";
import BookDetails from "./pages/BookDetails.tsx";
import AppProvider from "./providers/AppProvider.tsx";
import CartProvider from "./providers/CartProvider.tsx";
import SearchBar from "./pages/SearchBar.tsx";
import CheckOut from "./pages/Checkout.tsx";
import OrderSuccess from "./pages/OrderSuccess.tsx";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute.tsx";


import ProtectedAdminRoute from "./components/ProtectedAdminRoute.tsx";
import OrderLists from "./pages/admin/OrderLists.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import AddBook from "./pages/admin/AddBook.tsx";
import Inventory from "./pages/admin/Inventory.tsx";
import Listings from "./pages/admin/Listings.tsx";
import CreateListing from "./pages/admin/CreateListing.tsx";
import Genres from "./pages/admin/Genres.tsx";
import AddGenre from "./pages/admin/AddGenre.tsx";
import EditBook from "./pages/admin/EditBook.tsx";
import EditListedBook from "./pages/admin/EditListedBook.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/sign-in",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <Register />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <ProtectedAuthRoute> <CheckOut /> </ProtectedAuthRoute>,

      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/order-success/:orderNumber",
        element: <OrderSuccess/>

      },
      {
        path: "/books/:id",
        element: <BookDetails />,
      },
      {
        path: "/search",
        element: <SearchBar isSearchResultsPage={true} />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout/>,
    children: [
      {
        path: "",
        element: <ProtectedAdminRoute> <Dashboard/> </ProtectedAdminRoute>,
      },
      {
        path: "login",
        element: <AdminLogin/>,
      },

      {
        path: "genres",
        element: <Genres/>,

      },
      {
        path: "genres/add-genre",
        element: <AddGenre/>
      },
      {
        path: "inventory",
        element: <Inventory/>
      },
      {
        path: "inventory/add-book",
        element: <AddBook/>
      },
      {
        path: "inventory/edit-book/:id",
        element: <EditBook/>
      },
      {
        path: "listings",
        element: <Listings/>
      },
      {
        path: "listings/create-listing",
        element: <CreateListing/>
      },
      {
        path: "listings/edit-listed-book/:id",
        element: <EditListedBook/>
      },
      {
        path: "orders",
        element: <OrderLists/>
      }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <QueryClientProvider client={queryClient}>
    <AppProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
    ,
  </AppProvider>,
  </QueryClientProvider>
  </CartProvider>
);
