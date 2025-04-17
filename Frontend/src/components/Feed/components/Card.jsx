const Card = ({ user }) => {
  const { firstName, lastName, photoUrl, about, age, gender } = user;

  return (
    <div className="flex justify-center">
      <div className="card bg-base-100 w-96 shadow-sm mt-2 overflow-hidden">
        <figure className="h-98 w-full">
          <img
            className="object-center object-cover"
            src={photoUrl}
            alt="user photo"
          />
        </figure>

        <div className="card-body">
          <h2 className="card-title">
            {firstName} {lastName}
          </h2>

          <p>
            {gender}
            {", "}
            {age}
          </p>

          <p className="text-wrap">{about || "No description available."}</p>

          <div className="card-actions justify-center gap-5 mt-2">
            <div className="btn btn-primary">Ignore</div>

            <div className="btn btn-secondary">Interested</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
