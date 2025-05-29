

Academic Issue Tracking System (AITS)

   Project Overview


The Academic Issue Tracking System (AITS) is a web-based platform designed to help students at Makerere University log and track academic-related issues such as missing marks, appeals, and corrections. The system enables multiple user roles—students, lecturers, heads of departments, and the Academic Registrar—to manage, track, and resolve issues.

Technologies Used

Backend: Django, Django REST Framework (DRF) Frontend: React, Redux, React Toastify Database: PostgreSQL Hosting/Deployment: Heroku or AWS or render Version Control: Git, GitHub Testing: Pytest (Backend), Jest, React Testing Library (Frontend)

    Features

User Roles and Permissions

Students: Log issues, view status, update issue details.

Academic Registrar: Review and resolve issues, assign issues to lecturers or department heads.

Lecturers/Heads of Departments: Resolve assigned issues, update issue status.

   Issue Management

Issue Types: Categorized into "Missing Marks," "Appeals," and "Corrections."

Details: Students provide relevant information such as course codes and descriptions for each issue.

   
   Notifications

In-app & Email Notifications: Users are notified of status changes, and alerts are generated for overdue or unresolved issues

  Dashboard
 
 Personalized Dashboard: Displays relevant tasks, issues, and updates based on user roles.

   Activity Log
   
Activity Log: A log of all actions performed on each issue for transparency and accountability.

Security
Role-Based Access Control: Ensures users only have access to features and data they are authorized to view

     Setup Instructions.
 
 
 Backend Setup (Django)
Clone the repository:

bash
git clone https://github.com/your-username/aits.git,
cd aits
Set up a Python virtual environment (optional but recommended):

For macOS/Linux:

bash
python -m venv env
source env/bin/activate
For Windows

bash
env\Scripts\activate
Install required dependencies:

bash
pip install -r requirements.txt
Set up PostgreSQL database (optional):

Ensure PostgreSQL is installed and running. Create a database and user according to the configuration in settings.py.

Run migrations to create the necessary database tables:

bash
python manage.py makemigrations
python manage.py migrate
Start the Django development server:

bash
python manage.py runserver
The backend API will be available at http://127.0.0.1:8000/.

    Frontend Setup (React)

Navigate to the frontend directory:

bash
cd aits-frontend
Install the required dependencies:

bash
npm install
Start the React development server:

bash
npm start
The frontend will be available at http://localhost:3000/.

CORS Configuration
For development, allow cross-origin requests from the frontend by configuring CORS in Django.

Install django-cors-headers:

bash
pip install django-cors-headers
Update settings.py:

python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React frontend
]
   
   Deployment


The project  deployed on either Heroku or AWS or Render. Follow the respective documentation for deployment setup.

Heroku Deployment:

Create a Heroku app:

bash
heroku create
Push to Heroku:

bash
git push heroku main
AWS Deployment:

Configure EC2 or Elastic Beanstalk for hosting the application on AWS.

   
   Testing

Backend Testing (Pytest)

To run tests for the backend, use:

bash
python manage.py test
Frontend Testing (Jest and React Testing Library)

To run tests for the frontend, use:

bash.
npm test
Contribution
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

Acknowledgements
Thanks to the Django and React communities for providing such powerful frameworks. Special thanks to the creators of Django REST Framework, React, and Redux for enabling efficient development of this system.
We sincerely appreciate and acknowledge our lecturer, Dr Wakoli for the guidance he gave us because it contributed to us understanding inorder to come up with this application.
In God we trust, and  we develop awesome applications  and softwares.




