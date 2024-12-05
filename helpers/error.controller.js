function devError(err, res) {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
  });
}

function prodError(err, res) {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
}

export default async function (err, req, res, next) {
  const error = { ...err };

  err.statusCode = err.statusCode ?? 500;
  err.status = `${err.status}`.startsWith(4) ? "fail" : "error";
  err.message = err.message;

  console.log(error);

  if (process.env.NODE_ENV === "dev") {
    devError(err, res);
  } else {
    prodError(err, res);
  }

  next();
}
