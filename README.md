# ScreenSynced Database

### Link to the frontend:

https://github.com/EduardStroescu/ScreenSynced-FrontEnd

# Introduction

Full-Stack content streaming website using the TMDB API and an expressJS server along mongodb and cloudinary for authentication and bookmarking.

## Technologies Used

- [express](https://github.com/expressjs/express)
- [mongoose](https://github.com/Automattic/mongoose)
- [cloudinary](https://github.com/cloudinary/cloudinary_npm)
- [express-validator](https://github.com/express-validator/express-validator)
- [cookie-parser](https://github.com/expressjs/cookie-parser)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [cors](https://github.com/expressjs/cors)
- [dotenv](https://github.com/motdotla/dotenv)

Dev Dependencies:

- [nodemon](https://github.com/remy/nodemon)

```
Remember to update `.env` with your cloudinary token and mongodb url!

Example:

MONGODB_URL="" - Provided by mongodb
TOKEN_SECRET_KEY=""
PORT=5000 - The port on which you want the server to connect.

_Provided by Cloudinary_

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Installation

```bash
git clone https://github.com/EduardStroescu/ScreenSynced-Database.git
npm install
npm run dev
```
