# Digital_Copy_Center

# 📝 About the Project
The ESITH Digital Copy Center is a digital solution designed to modernize and optimize the document printing process at the copy center of ESITH (Higher School of Textile and Clothing Industries). This project aims to replace a manual and time-consuming system with an efficient, fast, and traceable digital solution.


# 🔍 Problem Solved

-> Before the Platform :
- Teachers had to physically go to the copy center
- They had to fill out paper order forms
- Long waiting times during busy periods
- Need to return to collect prints and sign documents
- Heavy administrative process with multiple validations (Director of Studies, General Director)
- Manual processing of order forms by the accounting department

-> After Implementation :
- Online submission of orders
- Automatic notification when documents are ready
- Secure collection via a unique code system
- Complete traceability of the printing process
- Dashboards and statistics for administration


# 🚀 Features

1- Digital Submission of Print Orders
  * Online form for teachers
  * Direct upload of documents to be printed

2- Print Management for the Copy Center Agent
  * Dedicated interface to process orders
  * Update of print status

3- Notification System
  * Automatic email alerts
  * Generation of unique 4-digit codes for collection

4- Secure Collection
  * Code validation without physical signature
  * Electronic confirmation of document delivery

5- Administrative Dashboard
  * Detailed tracking of each step of the process
  * Statistics on print volumes
  * Reports for accounting and administration


# 💻 Technologies Used

Frontend: ReactJS

Backend: Django

Database: PostgreSQL

(on "version-1" branch, we used Html, Css, Javascript for the frontend)


# 🔧 Installation and Deployment

- Clone the repository :

git clone https://github.com/eyyman17/Digital_Copy_Center.git

- Access the directory :

cd Digital_Copy_Center

- Create and activate virtual environment :

python -m venv venv
source venv/bin/activate 

- Install Python dependencies :

pip install -r requirements.txt

- Configure environment variables :

cp .env.example .env

(Edit the .env file with your own configurations)

- Run migrations :

python manage.py migrate

- Create superuser (admin) :

python manage.py createsuperuser

- Start Django development server :

python manage.py runserver

- Navigate to the frontend directory :

cd frontend

- Install dependencies :

npm install

- Start React development server :

npm run dev

# 👥 Users and Roles

1-Teachers
 * Submit print requests
 * Receive notifications
 * Collect documents with a code

2- Copy Center Agent
 * Manage incoming orders
 * Mark prints as completed
 * Validate document delivery

3- Administration
 * Monitor the entire process
 * Access statistics
 * Manage billing

# 📈 Benefits
 * Significant time savings for all stakeholders
 * Reduction of administrative paperwork
 * Improved traceability of prints
 * Optimization of copy center resources
 * Increased transparency for administration

# 📸 Screenshots

![login page](https://github.com/user-attachments/assets/7cae1efc-877c-48e2-bd7a-248e89612a79)

![form](https://github.com/user-attachments/assets/b16812dd-98d9-455b-8426-eeee3d0e1b41)

![history](https://github.com/user-attachments/assets/d97e036d-e205-417d-b787-d9b11efb083a)

![agent](https://github.com/user-attachments/assets/26103353-29c1-4b2b-9961-868eb764f432)


