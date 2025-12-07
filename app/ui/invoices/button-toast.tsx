"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const notify = () => toast.success("Invoice Deleted Successfully!");

const Buttontoast = () => {
  return (
    <button
      onClick={notify}
      type="submit"
      className="rounded-md border p-2 hover:bg-gray-100">
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
};

export default Buttontoast;
