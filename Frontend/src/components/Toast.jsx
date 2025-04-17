import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../store/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((store) => store.toast);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(removeToast());
      }, 3000);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const getColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-500";
    }
  };

  return (
    <div
      className={`toast toast-top toast-center rounded-md px-4
     py-2 ${getColor()}`}
    >
      {message}
    </div>
  );
};

export default Toast;
