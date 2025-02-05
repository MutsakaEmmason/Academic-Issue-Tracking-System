Academic Issue Tracking System (AITS)
      The Academic Issue Tracking System (AITS) is a web-based platform designed to help students at Makerere University log and track issues related to their academic records.
      Issues like missing marks, appeals, and corrections can be reported, tracked, and resolved by various user roles within the system, including students, lecturers, heads of departments, and the Academic Registrar.
    The system provides role-based access control, personalized dashboards, issue categorization, status tracking, notifications, and an audit trail for all actions performed on issues.

  Project Overview
         This system was built using Django for the backend and React for the frontend. The backend is powered by Django REST Framework (DRF) to provide API endpoints, while React handles the user interface, allowing for an interactive and dynamic experience. PostgreSQL is used as the database, with cloud hosting and deployment options available on Heroku or AWS.

Features
User Roles and Permissions:
Students can log issues, view their status, and update information.
Academic Registrar can review, resolve, or assign issues to relevant lecturers or department heads.
Lecturers/Heads of Departments can resolve assigned issues and update their statuses.
Issue Management:
Issues are categorized into three types: "Missing Marks", "Appeals", and "Corrections."
Students can provide relevant details such as the course code and a description of the issue.
Notifications:
In-app and email notifications are triggered for status changes.
Alerts are generated for overdue or unresolved issues.
Dashboard:
A personalized dashboard for each user role displays relevant tasks, issues, and updates.
Audit Trail:
A log of all actions performed on each issue is maintained for transparency and accountability.
Security:
Role-based access control ensures that each user has access only to the features and data they are authorized to view.
Technologies Used
Backend: Django, Django REST Framework
Frontend: React, Redux, React Toastify
Database: PostgreSQL
Hosting/Deployment: Heroku or AWS
Version Control: Git, GitHub
Testing: Pytest (Backend), Jest, React Testing Library (Frontend)
Setup Instructions
Backend Setup (Django)
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/aits.git
cd aits
Set up a Python virtual environment (optional but recommended):

bash
Copy
Edit
python -m venv env
source env/bin/activate  # For macOS/Linux
env\Scripts\activate  # For Windows
Install required dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Set up PostgreSQL database (optional):

Ensure you have PostgreSQL installed and running on your machine.
Create a database and user as per the database configuration in settings.py.
Run the migrations to create the necessary database tables:

bash
Copy
Edit
python manage.py makemigrations
python manage.py migrate
Start the Django development server:

bash
Copy
Edit
python manage.py runserver
The backend API will be available at http://127.0.0.1:8000/.

Frontend Setup (React)
Navigate to the frontend directory:

bash
Copy
Edit
cd aits-frontend
Install the required dependencies:

bash
Copy
Edit
npm install
Start the React development server:

bash
Copy
Edit
npm start
The frontend will be available at http://localhost:3000/.

CORS Configuration
For development, allow cross-origin requests from your frontend by configuring CORS in Django. Install django-cors-headers and update settings.py:

bash
Copy
Edit
pip install django-cors-headers
Then, add the following to settings.py:

python
Copy
Edit
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
The project can be deployed on either Heroku or AWS. Follow the documentation of these platforms to set up your deployment.

For Heroku, you can use the following commands:

bash
Copy
Edit
heroku create
git push heroku main
For AWS, you can configure EC2 or Elastic Beanstalk for hosting the application.

Testing
Backend Testing:
      Pytest is used for testing the backend. Run the following command to run tests:

bash
Copy
Edit
python manage.py test
Frontend Testing: 
       Jest and React Testing Library are used for testing React components. Run the following command to run tests:

bash
Copy
Edit
npm test
Contribution
Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.


Acknowledgements
Thanks to the Django and React communities for providing such powerful frameworks.
Special thanks to the makers of Django REST Framework, React, and Redux for enabling efficient development of this system.
