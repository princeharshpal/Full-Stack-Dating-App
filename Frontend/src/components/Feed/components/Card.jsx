import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Card = ({ user }) => {
  const { firstName, lastName, photoUrl, about, age, gender } = user;

  console.log("Redux user in Card:", user);
  return (
    <div className="flex justify-center">
      <div className="card bg-base-100 w-96 shadow-sm overflow-hidden">
        <figure className="h-98 w-full">
          <img
            className="object-center object-cover rounded-md"
            src={photoUrl}
            alt="user photo"
          />
        </figure>

        <div className="card-body">
          <h2 className="card-title">
            {firstName} {lastName}
          </h2>

          <p>
            {gender}, {age}
          </p>

          <p className="line-clamp-2 text-sm">
            {about || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
