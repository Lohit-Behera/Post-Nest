# Post Nest

Post-Next is a full-stack web application that allows users to share their thoughts by posting blogs, follow each other, interact with posts by liking and commenting, and search for other users and posts. The project is built using modern web technologies including Node.js, Express, MongoDB, React.js, Tailwind CSS, Redux, and Docker, with a responsive design supporting both light and dark modes.

## Features

- **User Authentication:** The application implements secure user authentication mechanisms, allowing users to log in seamlessly using JWT (JSON Web Token) for session management. Additionally, users have the option to sign in using Google login, providing a convenient and fast way to access their accounts without the need for traditional email and password registration. This enhances user experience by streamlining the login process while maintaining high security standards.

- **User Interaction:**
  Users can engage with the platform in multiple ways, fostering a vibrant community:

  - **Create and Publish Blog Posts:** Users can write, format, and publish their own blog posts, sharing their thoughts, experiences, and insights with others. The rich text editor allows for easy formatting, enabling users to create visually appealing content.

  - **Follow and Unfollow Other Users:** Users can connect with others by following their profiles. This feature enables users to stay updated on the latest posts from those they are interested in, creating a personalized feed of content. Unfollowing is equally simple, allowing users to manage their connections effortlessly.

  - **Like and Comment on Posts:** To promote interaction and engagement, users can express their appreciation for posts by liking them. Additionally, users can comment on posts, facilitating discussions and conversations around shared interests and topics. This feature helps build a community where ideas and feedback can be exchanged openly.

  - **Search for Users and Posts:** The search functionality allows users to find specific users or posts quickly. Whether searching for a friend, a particular topic, or popular blog posts, the intuitive search feature makes navigation smooth and efficient.

  - **Update Personal Posts and Details:** Users can easily manage their content by updating their blog posts and personal details at any time. This feature ensures that users can keep their profiles current and reflect any changes they wish to make, enhancing their overall experience on the platform.

- **Responsive Design:** The application boasts a fully responsive user interface that adapts seamlessly across various devices, including mobile phones, tablets, and desktop computers. This ensures that users have a consistent and enjoyable experience regardless of the device they use, making it accessible to a broader audience.

- **Theme Switching:** To enhance user experience further, the application includes support for theme switching between light and dark modes. This feature allows users to choose their preferred visual style based on their personal preference or the ambient lighting conditions, making the platform comfortable to use at any time of day. By accommodating different user preferences, the application fosters a more engaging and enjoyable environment.

## Technologies Used

- **Frontend:**

  - [**React.js:**](https://react.dev) Frontend framework for building the user interface.
  - [**Tailwind CSS:**](https://tailwindcss.com) Utility-first CSS framework for styling.
  - [**Redux:**](https://redux-toolkit.js.org) State management for handling app state.

- **Backend:**

  - [**Node.js:**](https://nodejs.org/en) JavaScript runtime for the backend.
  - [**Express.js:**](https://expressjs.com) Backend framework for building RESTful APIs.
  - [**MongoDB:**](https://www.mongodb.com) NoSQL database for storing data.
  - [**JWT:**](https://jwt.io) Secure user authentication.
  - [**Google OAuth:**](https://developers.google.com/identity/protocols/oauth2) Google Sign-In for user authentication.

- **DevOps:**
  - [**Docker:**](https://www.docker.com) Containerization for easy deployment.
  - [**Git:**](https://git-scm.com) Version control for tracking changes in the project.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

In backend Folder

`PORT`
`CORS_ORIGIN`
`MEMORY`

`MONGODB_URL`

`ACCESS_TOKEN_SECRET`
`ACCESS_TOKEN_EXPIRY`

`REFRESH_TOKEN_SECRET`
`REFRESH_TOKEN_EXPIRY`

`TOKEN_SECRET`
`TOKEN_EXPIRY`

`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_API_KEY`
`CLOUDINARY_API_SECRET`
`CLOUDINARY_URL`

`EMAIL_HOST`
`EMAIL_PORT`
`EMAIL_HOST_USER`
`EMAIL_HOST_PASSWORD`

`GOOGLE_CLIENT_ID`
`GOOGLE_CLIENT_SECRET`

In frontend Folder

`VITE_BASE_URL`

`VITE_GOOGLE_CLIENT_ID`

## Run Locally

Clone the repository:

```bash
  git clone https://github.com/Lohit-Behera/Post-Nest
  cd Post-Nest
```

**Running using [Docker](https://www.docker.com/)**

in root directory

```bash
  docker compose up
```

Then go to [localhost:5173](http://localhost:5173/) for frontend and [localhost:8000](http://localhost:8000/) for backend

**Running without Docker**

Clone the repository:

```bash
  git clone https://github.com/Lohit-Behera/Post-Nest
  cd Post-Nest
```

Now change directory to backend

```bash
  cd backend
```

Install node modules

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

In another terminal for React js

Now change directory to frontend

```bash
  cd Post-Nest
  cd frontend
```

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Then go to [http://localhost:5173](http://localhost:5173)

## Screenshots

If you would like to watch a video demonstration of this project, here is the [Google Drive link](https://drive.google.com/file/d/16kylK1lDWlACYAEN-1uvEq__-GZ9JALd/view?usp=sharing).

![App Screenshot](https://drive.usercontent.google.com/download?id=1U6VR6v5Wif5oAXAThwV2n26gj9hK_1d1)

![App Screenshot](https://drive.usercontent.google.com/download?id=1PzX20i_3YrppMv_g9-EWflR4xPXlaIXB)

![App Screenshot](https://drive.usercontent.google.com/download?id=1_58fe-7MNByoz3PpNJiC8bOH4y5-z82m)

![App Screenshot](https://drive.usercontent.google.com/download?id=1EQEbx4mUy6bEx4M7ZvRMSfqyI9ekq6it)

![App Screenshot](https://drive.usercontent.google.com/download?id=14uC5LZHTPoXlfWbydOsDEmexmOr6cKs_)
