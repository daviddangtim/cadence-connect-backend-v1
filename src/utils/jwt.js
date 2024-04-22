import jwt from "jsonwebtoken";

export default class {
  constructor(secret, expiresIn) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { payload },
        this.secret,
        { expiresIn: this.expiresIn },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        },
      );
    });
  }

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
  }
}
