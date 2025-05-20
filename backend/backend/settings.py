"""
Django settings for backend project.
"""

from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY','627c6fc400fe01c955f42aed260f4805430002d174c4ca5a')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG','False')=='True'

ALLOWED_HOSTS = [
    'academic-issue-tracking-system-ba1p.onrender.com',
    'localhost',
    '127.0.0.1',
]


# Application definition
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles', # Keep this
    'issues',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'authentication',
    'django_filters',
    'import_export',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # WhiteNoiseMiddleware must be listed after Django's SecurityMiddleware
    # and before any other middleware that might need to serve static files.
    'whitenoise.middleware.WhiteNoiseMiddleware', # ADD THIS LINE
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://academic-issue-tracking-system-ba1p.onrender.com",  # ✅ Correct format

]
ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')], # This path for index.html is correct
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Kampala'
USE_I18N = True
USE_TZ = True

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

# Simple JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# Static files (CSS, JavaScript, Images)
# Vite outputs assets with paths like /assets/index.js.
# By setting STATIC_URL to '/assets/', WhiteNoise will serve files from STATIC_ROOT
# at the URL path /assets/.
STATIC_URL = '/assets/' # CRITICAL: Change to '/assets/' to match Vite's output

# STATIC_ROOT is where collectstatic will gather all static files.
# For WhiteNoise to directly serve frontend/dist, STATIC_ROOT should point to it.
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
 # CRITICAL: Point STATIC_ROOT directly to frontend/dist

# STATICFILES_DIRS is for additional locations for Django to find static files
# before collecting them to STATIC_ROOT. If STATIC_ROOT is dist, you typically
# don't need STATICFILES_DIRS for the frontend assets themselves.
STATICFILES_DIRS = [
    # If you have other Django static files (e.g., from admin that aren't collected
    # directly by apps), you might list them here. Otherwise, leave empty.
    # We are explicitly pointing STATIC_ROOT to the dist folder, so we don't
    # need to list it again here.
]

# Configure WhiteNoise storage for compressed and versioned static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage' # ADD THIS LINE


# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'issues.CustomUser'

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'emmasonmutsaka@gmail.com'
EMAIL_HOST_PASSWORD = 'emmason2023' # Use App Password in production
EMAIL_USE_SSL = False
