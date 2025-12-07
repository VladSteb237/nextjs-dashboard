"use client";
import toast from "react-hot-toast";

const notify = () => toast.error("Invoice Deleted Successfully!");

const Customers = () => {
  return (
    <div>
      Customers Page
      <div>
        <button
          className=" bg-slate-300 p-2 mt-6 rounded-md hover:bg-gray-100"
          onClick={notify}>
          Click Me
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default Customers;
